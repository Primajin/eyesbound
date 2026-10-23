# Hosting on Cloudflare (Workers static assets) and cutover runbook

Status: draft for issue #987. Gatsby code, packages and Netlify workflows are removed from the repository ([ADR 0004](adr/0004-gatsby-removal.md)); the Cloudflare steps below have not been executed. Background: [ADR 0003](adr/0003-csp-and-headers.md). The target is an assets-only Cloudflare Worker (not classic Pages); `wrangler.jsonc` is already in the repo root.

## 1. Build and deploy flow (decided: build in GitHub CI, deploy from GitHub Actions)

Cloudflare Workers Builds is **not** used. GitHub CI builds once and deploys that artifact:

1. `ci.yml` calls `astro-ci.yml` (job `astro`): lint, unit, `npm run build` with real Prismic data, e2e, route parity, Lighthouse (advisory). The build uploads the artifact `dist`.
2. After `astro` passed, job `preview` (`_deploy-cloudflare.yml`, `mode: preview`) downloads that same `dist` (no rebuild) and runs `npx wrangler@4.152.0 versions upload --preview-alias pr-<number>`. The version is **not** promoted to production. The URL (`https://pr-<n>-eyesbound.<account-subdomain>.workers.dev`, subdomain read from wrangler's output) goes to the job summary, the `url` job output and, best-effort, a sticky PR comment (job `preview-comment`; Dependabot has a read-only token, so there the comment may be missing, use the summary).
3. `console` and `screenshots` run against that URL when `PREVIEW_PROVIDER=cloudflare`.
4. Production: job `deploy-production` runs `wrangler deploy` on pushes to `main`, same gate. It is disabled (`if: ${{ false && ... }}` in `ci.yml`) until cutover.

Only same-repo PRs (Renovate, Dependabot included) deploy. Fork PRs get no secrets and skip the preview. `pull_request_target` is not used. The wrangler version is pinned in `WRANGLER_VERSION` in `_deploy-cloudflare.yml` (Renovate does not track it; bump by hand). `NODE_VERSION` is 24 (the package needs >= 22.4).

Switch (repository **variable**, not secret): `PREVIEW_PROVIDER`. Unset (or anything but `cloudflare`): the preview deploy, `console` and `screenshots` are skipped. `cloudflare`: the preview deploy runs and the other two use its URL (skipped if there is no URL, e.g. fork PRs or missing secrets). The Netlify wait steps no longer exist.

Preconditions on the Worker: it must already exist (earlier deploy) and have `workers.dev` and Preview URLs enabled (Worker, Settings, Domains and routes). The same `dist` is used for previews and production, so canonical/sitemap URLs come from the build default (`SITE_URL` is not set per target, it falls back to `https://eyesbound.com`).

Preview aliases are not removed when a PR closes (no workflow does that); they are harmless but accumulate within Cloudflare's version retention.

### Disconnect Workers Builds (dashboard, you do this)

Workers & Pages, the `eyesbound` worker, Settings, Builds: disconnect the Git repository (otherwise every push is built and deployed a second time, and non-production branch builds would also upload versions). Its build variables/secrets can then be deleted. The old Netlify site stays untouched.

Prismic webhook: Workers Builds deploy hooks no longer exist after disconnecting. Use a GitHub `repository_dispatch` (needs a fine-grained PAT) or a `workflow_dispatch` trigger to rebuild and deploy on publish. That workflow does not exist yet and is a cutover task. Keep the hook/PAT secret.

## 2. Secrets and variables you must add

GitHub (Settings, Secrets and variables, Actions), needed by `.github/workflows/astro-ci.yml`:

- Secret `PRISMIC_ACCESS_TOKEN` (required for build and route parity)
- Secret `MAPS_API_KEY` (the build reads it; add it to the repository and Dependabot secrets and to the Cloudflare build variables)
- Variable `PRISMIC_REPO_NAME` (optional, defaults to `eyesbound`)
- Optional: `SITE_URL` and `SITE_NAME` are read from the environment at build time and default to `https://eyesbound.com` and `EYESBOUND`; no CI setting is needed
- Optional: secret `CODECOV_TOKEN` (coverage upload in the `unit` job; without it the upload step only logs)

The old `GATSBY_API_KEY` secret is no longer used by any workflow (the Prismic token is `PRISMIC_ACCESS_TOKEN`) and can be deleted.

`GPG_PRIVATE_KEY` and `PASSPHRASE` are used only by the auto-fixing `lint` job of `ci.yml`. Fork PRs get no secrets, so `build`, `e2e`, `lighthouse` and `route-parity` are skipped for them; Dependabot PRs use the separate Dependabot secret store, so add the same two secrets there or those PRs skip the real-data jobs too.

For Cloudflare deploys add, in **both** the repository store (Settings, Secrets and variables, Actions) **and** the Dependabot store (Settings, Secrets and variables, Dependabot), because Dependabot PRs read only the latter:

- Secret `CLOUDFLARE_API_TOKEN`: API token from the "Edit Cloudflare Workers" template, scoped to this single account (no zone/DNS permissions needed until cutover).
- Secret `CLOUDFLARE_ACCOUNT_ID`

Repository **variable** `PREVIEW_PROVIDER=cloudflare` turns on previews, console and screenshots (leave unset until the secrets exist). Without the secrets a preview run only logs a warning and skips (it does not fail); production fails.

## 3. Cutover runbook (all steps need human confirmation)

Preconditions: Astro CI green on the cutover PR, `node scripts/route-parity.mjs` reports "Route parity OK", Lighthouse reports reviewed, `/sw.js` kill-switch present in `dist/` (done, see below), CSP still in report-only or verified on preview.

1. **Maps key referrers** (Google Cloud Console, Credentials, the browser key, HTTP referrers). Add before cutover, and already for previews: `https://*.primajin.workers.dev/*` (matches the Worker host `eyesbound.primajin.workers.dev` and the preview alias host `pr-<n>-eyesbound.primajin.workers.dev`; the subdomain `primajin` is the workers.dev subdomain of the Cloudflare account that holds the site), `https://eyesbound.com/*`, `https://www.eyesbound.com/*` if used. Remove the Netlify origins only after the rollback window closes. The ADR 0003 CSP follow-up (dropping `'unsafe-eval'`) also needs a test origin on this list.
2. **Lower DNS TTL** at least 24 h (the old TTL) ahead of the move: set the `eyesbound.com` records to 300 s.
3. **Enable the production deploy**: in `ci.yml` job `deploy-production` change `if: ${{ false && ... }}` to `if: ${{ github.event_name == 'push' && github.ref == 'refs/heads/main' }}` (optionally add a protected `production` environment), merge, then verify on `workers.dev`: all routes, one `Content-Security-Policy` header per route (ADR 0003 warns about silent doubles), `/sw.js`, `404` page and status.
4. **Move DNS to Cloudflare**: add the zone, copy existing records (mail/MX/TXT included), switch nameservers at the registrar, then attach `eyesbound.com` as the worker's custom domain. The lowered TTL applies to record changes; a nameserver change is bounded by the registrar's NS TTL, so allow for it.
5. **Smoke test** on the real domain: home, `/picture/`, a detail page, `/worldmap/` (map must render with the key), sitemap, `robots.txt`.
6. **Keep Netlify** deployed and untouched in its dashboard (do not delete the site; the repository no longer carries its config, so it keeps serving its last Gatsby deploy and must not be rebuilt from this branch) for at least 1-2 weeks as rollback. Do not let its builds stop receiving Prismic webhooks until you decide.
7. After stability: raise TTL back (e.g. 3600 s), decide separately on HSTS preload, switch CSP from report-only to enforcing.

### Rollback

Repoint DNS (or the custom domain) back at Netlify: with the TTL still low this takes about 5 minutes to propagate. Nameserver moves back are slower, which is why Netlify stays live and why the record TTL is lowered first. Redeploying the previous worker version (`npx wrangler@4.152.0 rollback`) covers a bad release without DNS changes.

## 4. Behaviour to know about

- **Trailing slashes**: URLs are canonical with a trailing slash. Cloudflare answers slash-less requests with `307` (not Netlify's `301`) and this is not configurable via `html_handling`. Internal links, canonical, `og:url` and the sitemap must all use the slash form so nothing points at the redirecting URL. Search engines treat 307 as temporary; static `301` rules in `_redirects` are a possible mitigation, untested (ADR 0003 section 6).
- **`/sw.js` kill-switch (required, done)**: implemented as `site/public/sw.js` (deletes all foreign caches on activate, then claims clients; caches only `/_astro/*` fonts and CSS plus icons, cache-first), registered by `site/public/register-sw.js` in production builds only, and `_headers` sets `Cache-Control: no-cache`. Covered by `site/scripts/__tests__/sw.test.js` and `e2e/sw.spec.js`. Background: returning visitors have the Gatsby Workbox service worker, which serves precached HTML. `/sw.js` must exist at cutover as a self-unregistering worker (or the replacement worker), served with `Cache-Control: no-cache`. Without it stale Gatsby pages can persist on returning devices. Verify with `curl -I https://eyesbound.com/sw.js` after the move.
- **HSTS**: `max-age=31536000; includeSubDomains` goes live on the custom domain once DNS moves and is hard to undo for a year. Check that every subdomain of `eyesbound.com` serves HTTPS before cutover. Do not add `preload` without a separate explicit decision.
- **`workers.dev`** previews should carry `X-Robots-Tag: noindex` (ADR 0003, untested).
- **Free-tier limit**: 20,000 asset files per version; CI prints the file count of `dist/` on each build.

## 5. CI overview

Gatsby removal is done (ADR 0004); the cutover checklist in section 3 and the owner steps in section 6 remain.

Deploy jobs: see section 1 (`preview`, `preview-comment`, `deploy-production` in `ci.yml`; implementation in `_deploy-cloudflare.yml`). `All checks green` includes `preview` and `deploy-production` (skipped is fine, failure blocks).

`.github/workflows/astro-ci.yml` (called from `ci.yml` as job `astro`, so the required `All checks green` covers it, together with the auto-fixing `lint` job): lint, Vitest coverage (uploaded to Codecov), real-data `astro build` (cached `node_modules/.astro` and npm), Playwright e2e on the built `dist`, route parity against the live sitemap, and Lighthouse CI (`lighthouserc.json`, mobile, median of 5, budgets 100 for performance, accessibility, best-practices and SEO). Lighthouse runs with `continue-on-error: true` and is excluded from `Astro checks green`; promote it by removing that line and adding it to the gate. The legacy PWA badge in `docs/lighthouse/` is not asserted; keep the badges truthful by updating the SVGs from real reports only.

## 6. Remaining owner steps after the Gatsby removal

1. Run the `git rm` commands listed in the PR description (the files named in ADR 0004), then delete the legacy ignore block at the top of `eslint.config.mjs`, commit and push.
2. Delete the leftover secrets `GATSBY_G_MAPS` and `GATSBY_API_KEY` from the repository and Dependabot stores (nothing reads them any more).
3. Local files: rename variables in your untracked `.env.local` if it still has `GATSBY_*` names (`SITE_URL`, `SITE_NAME`; the token and key names did not change), and delete the old `.env.development` / `.env.production`.
4. In the required status checks of the branch protection keep only `All checks green`; no check is named after the removed jobs (`build`, `build-matrix`, `test`).
5. Netlify: disable its build for this repository when you decide to (dashboard), after the rollback window.
6. Cutover steps 1 to 7 above.
