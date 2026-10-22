# Hosting on Cloudflare (Workers static assets) and cutover runbook

Status: draft for issue #987. Nothing in this document has been executed. Background: [ADR 0003](adr/0003-csp-and-headers.md). The target is an assets-only Cloudflare Worker (not classic Pages); `wrangler.jsonc` is already in the repo root.

## 1. Build and deploy settings

| Setting | Value |
|---|---|
| Build command | `npm ci && npm run astro:build` |
| Output directory | `dist` (`assets.directory` in `wrangler.jsonc`) |
| Deploy command | `npx wrangler deploy` (Workers Builds default) |
| Non-production branch deploy | `npx wrangler versions upload` |
| Node | 24 (set build variable `NODE_VERSION=24`; the package needs >= 22.4) |

Changing these settings does not re-run an old build: use "Retry build" in the dashboard or push a commit. `npm run build` is still the Gatsby build until cutover, so the dashboard build command must stay `npm run astro:build`.

Note: `npm run build` is still the Gatsby build until cutover. Use `astro:build` for Astro, or rename scripts in the cutover PR and then update the commands above.

### Option A (recommended): Workers Builds (Git integration)

Configured by you in the Cloudflare dashboard (Workers & Pages, the worker, Settings, Builds). No GitHub secrets needed; Cloudflare builds from the repo. Add these as **build variables and secrets in Cloudflare** (separate values for production and non-production if you want):

| Name | Kind | Value |
|---|---|---|
| `PRISMIC_ACCESS_TOKEN` | secret | Prismic Content API token (same as the GitHub secret) |
| `MAPS_API_KEY` | secret-ish (ships in the bundle, must be referrer-restricted) | Google Maps JS key |
| `PRISMIC_REPO_NAME` | variable, optional | defaults to `eyesbound` |
| `GATSBY_SERVER_URL` | variable | public origin used for canonical URLs and sitemap, e.g. `https://eyesbound.com` (production) |
| `GATSBY_SITE_NAME` | variable, optional | defaults to `EYESBOUND` |
| `NODE_VERSION` | variable | `24` |

### Option B: GitHub Actions + wrangler (template only, intentionally not a live workflow)

Needs GitHub **repository secrets** that you create: `CLOUDFLARE_API_TOKEN` (API token, template "Edit Cloudflare Workers", scoped to the single account), `CLOUDFLARE_ACCOUNT_ID`, plus `PRISMIC_ACCESS_TOKEN` and `MAPS_API_KEY`. Copy this to `.github/workflows/deploy.yml` only at cutover, after review. Pin `cloudflare/wrangler-action` to the SHA of its current release when you do (look it up; the placeholder below must not be committed as is).

```yaml
name: Deploy (Cloudflare Workers)
on:
  push:
    branches: [ main ]
permissions: {}
concurrency:
  group: deploy-production
  cancel-in-progress: false
jobs:
  deploy:
    if: false # TEMPLATE: remove at cutover
    runs-on: ubuntu-latest
    environment: production
    permissions:
      contents: read
    steps:
      - uses: actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1
        with:
          persist-credentials: false
      - uses: actions/setup-node@949feb2413d6458794dcd2491c4babbbce0c15c1 # v7.1.0
        with:
          node-version: '24'
          cache: npm
      - run: npm ci
      - run: npm run astro:build
        env:
          PRISMIC_ACCESS_TOKEN: ${{ secrets.PRISMIC_ACCESS_TOKEN }}
          MAPS_API_KEY: ${{ secrets.MAPS_API_KEY || secrets.GATSBY_G_MAPS }}
          GATSBY_SERVER_URL: https://eyesbound.com
      - uses: cloudflare/wrangler-action@<FULL_SHA> # vX.Y.Z (pin before use)
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: deploy
```

### Prismic publish webhook

Prismic webhook (Settings, Webhooks) must call a Workers Builds deploy hook (Option A, Settings, Builds, Deploy hooks) or a GitHub `repository_dispatch` (Option B, needs a fine-grained PAT). Keep the hook URL secret; it is not in the repo.

## 2. Secrets and variables you must add

GitHub (Settings, Secrets and variables, Actions), needed by `.github/workflows/astro-ci.yml`:

- Secret `PRISMIC_ACCESS_TOKEN` (required for build and route parity)
- Secret `MAPS_API_KEY` (the build reads it; new name, add it in Cloudflare. GitHub CI falls back to the existing `GATSBY_G_MAPS` secret until you add it there too)
- Variable `PRISMIC_REPO_NAME` (optional, defaults to `eyesbound`)

Not needed for Astro CI: `GPG_PRIVATE_KEY`, `PASSPHRASE`, `CODECOV_TOKEN` (legacy workflows only). Fork PRs get no secrets, so `build`, `e2e`, `lighthouse` and `route-parity` are skipped for them; Dependabot PRs use the separate Dependabot secret store, so add the same two secrets there or those PRs skip the real-data jobs too.

Only for Option B, add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

## 3. Cutover runbook (all steps need human confirmation)

Preconditions: Astro CI green on the cutover PR, `node scripts/route-parity.mjs` reports "Route parity OK", Lighthouse reports reviewed, `/sw.js` kill-switch present in `dist/` (done, see below), CSP still in report-only or verified on preview.

1. **Maps key referrers** (Google Cloud Console, Credentials, the browser key, HTTP referrers). Add before cutover: `https://eyesbound.com/*`, `https://www.eyesbound.com/*` if used, the `workers.dev` production URL (`https://eyesbound.<subdomain>.workers.dev/*`), and the preview pattern (`https://*-eyesbound.<subdomain>.workers.dev/*`, check the actual version-URL host form in the dashboard). Remove the Netlify origins only after the rollback window closes. The ADR 0003 CSP follow-up (dropping `'unsafe-eval'`) also needs a test origin on this list.
2. **Lower DNS TTL** at least 24 h (the old TTL) ahead of the move: set the `eyesbound.com` records to 300 s.
3. **Deploy to production worker** on `main`, verify on `workers.dev`: all routes, one `Content-Security-Policy` header per route (ADR 0003 warns about silent doubles), `/sw.js`, `404` page and status.
4. **Move DNS to Cloudflare**: add the zone, copy existing records (mail/MX/TXT included), switch nameservers at the registrar, then attach `eyesbound.com` as the worker's custom domain. The lowered TTL applies to record changes; a nameserver change is bounded by the registrar's NS TTL, so allow for it.
5. **Smoke test** on the real domain: home, `/picture/`, a detail page, `/worldmap/` (map must render with the key), sitemap, `robots.txt`.
6. **Keep Netlify** deployed and untouched (do not delete the site or remove its config) for at least 1-2 weeks as rollback. Do not let its builds stop receiving Prismic webhooks until you decide.
7. After stability: raise TTL back (e.g. 3600 s), decide separately on HSTS preload, switch CSP from report-only to enforcing, remove Gatsby workflows and Netlify config (you perform the deletions).

### Rollback

Repoint DNS (or the custom domain) back at Netlify: with the TTL still low this takes about 5 minutes to propagate. Nameserver moves back are slower, which is why Netlify stays live and why the record TTL is lowered first. Redeploying the previous worker version (`npx wrangler rollback`) covers a bad release without DNS changes.

## 4. Behaviour to know about

- **Trailing slashes**: URLs are canonical with a trailing slash. Cloudflare answers slash-less requests with `307` (not Netlify's `301`) and this is not configurable via `html_handling`. Internal links, canonical, `og:url` and the sitemap must all use the slash form so nothing points at the redirecting URL. Search engines treat 307 as temporary; static `301` rules in `_redirects` are a possible mitigation, untested (ADR 0003 section 6).
- **`/sw.js` kill-switch (required, done)**: implemented as `site/public/sw.js` (deletes all foreign caches on activate, then claims clients; caches only `/_astro/*` fonts and CSS plus icons, cache-first), registered by `site/public/register-sw.js` in production builds only, and `_headers` sets `Cache-Control: no-cache`. Covered by `site/scripts/__tests__/sw.test.js` and `e2e/sw.spec.js`. Background: returning visitors have the Gatsby Workbox service worker, which serves precached HTML. `/sw.js` must exist at cutover as a self-unregistering worker (or the replacement worker), served with `Cache-Control: no-cache`. Without it stale Gatsby pages can persist on returning devices. Verify with `curl -I https://eyesbound.com/sw.js` after the move.
- **HSTS**: `max-age=31536000; includeSubDomains` goes live on the custom domain once DNS moves and is hard to undo for a year. Check that every subdomain of `eyesbound.com` serves HTTPS before cutover. Do not add `preload` without a separate explicit decision.
- **`workers.dev`** previews should carry `X-Robots-Tag: noindex` (ADR 0003, untested).
- **Free-tier limit**: 20,000 asset files per version; CI prints the file count of `dist/` on each build.

## 5. CI overview

`.github/workflows/astro-ci.yml` (called from `ci.yml` as job `astro`, so the required `All checks green` covers it): lint, Vitest coverage, real-data `astro build` (cached `node_modules/.astro` and npm), Playwright e2e on the built `dist`, route parity against the live sitemap, and Lighthouse CI (`lighthouserc.json`, mobile, median of 5, budgets 100 for performance, accessibility, best-practices and SEO). Lighthouse runs with `continue-on-error: true` and is excluded from `Astro checks green`; promote it by removing that line and adding it to the gate. The legacy PWA badge in `docs/lighthouse/` is not asserted; keep the badges truthful by updating the SVGs from real reports only.
