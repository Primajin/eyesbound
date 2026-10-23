# Hosting on Cloudflare (Workers static assets) and cutover runbook

Status: draft for issue #987. Gatsby code, packages and Netlify workflows are removed from the repository ([ADR 0004](adr/0004-gatsby-removal.md)); the cutover was executed on 2026-10-23 (see the record in section 3) and Netlify is retired. Background: [ADR 0003](adr/0003-csp-and-headers.md). The target is an assets-only Cloudflare Worker (not classic Pages); `wrangler.jsonc` is already in the repo root.

## 1. Build and deploy flow (decided: build in GitHub CI, deploy from GitHub Actions)

Cloudflare Workers Builds is **not** used. GitHub CI builds once and deploys that artifact:

1. `ci.yml` calls `astro-ci.yml` (job `astro`): lint, unit, `npm run build` with real Prismic data, e2e, route parity, Lighthouse (advisory). The build uploads the artifact `dist`.
2. Right after the `build` job (not after e2e/Lighthouse), job `preview` in `astro-ci.yml` (`_deploy-cloudflare.yml`, `mode: preview`) downloads that same `dist` (no rebuild) and runs `npx wrangler@4.152.0 versions upload --preview-alias pr-<number>`. The version is **not** promoted to production. The URL (`https://pr-<n>-eyesbound.<account-subdomain>.workers.dev`, subdomain read from wrangler's output) goes to the job summary, the `url` job output and, best-effort, a sticky PR comment (job `preview-comment`; Dependabot has a read-only token, so there the comment may be missing, use the summary).
3. `console` and `screenshots` run against that URL when `PREVIEW_PROVIDER=cloudflare`.
4. Production: job `deploy-production` runs `wrangler deploy` on pushes to `main`, same gate. It is disabled until the repository variable `PRODUCTION_DEPLOY_ENABLED` is `true` (section 7 uses the same switch for content publishes).

Only same-repo PRs (Renovate, Dependabot included) deploy. Fork PRs get no secrets and skip the preview. `pull_request_target` is not used. The wrangler version is pinned in `WRANGLER_VERSION` in `_deploy-cloudflare.yml` (Renovate does not track it; bump by hand). `NODE_VERSION` is 24 (the package needs >= 22.4).

Switch (repository **variable**, not secret): `PREVIEW_PROVIDER`. Unset (or anything but `cloudflare`): the preview deploy, `console` and `screenshots` are skipped. `cloudflare`: the preview deploy runs and the other two use its URL (skipped if there is no URL, e.g. fork PRs or missing secrets). The Netlify wait steps no longer exist.

Preconditions on the Worker: it must already exist (earlier deploy) and have `workers.dev` and Preview URLs enabled (Worker, Settings, Domains and routes). The same `dist` is used for previews and production, so canonical/sitemap URLs come from the build default (`SITE_URL` is not set per target, it falls back to `https://eyesbound.com`).

Preview aliases are not removed when a PR closes (no workflow does that); they are harmless but accumulate within Cloudflare's version retention.

### Disconnect Workers Builds (dashboard, you do this)

Workers & Pages, the `eyesbound` worker, Settings, Builds: disconnect the Git repository (otherwise every push is built and deployed a second time, and non-production branch builds would also upload versions). Its build variables/secrets can then be deleted. The old Netlify site stays untouched.

Prismic webhook: Workers Builds deploy hooks no longer exist after disconnecting. Rebuild-on-publish is `.github/workflows/content-deploy.yml`, set up in section 7.

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

### Cutover record (executed 2026-10-23)

- Registrar is Squarespace Domains. DNSSEC was switched off there before the nameserver change (a DS record at the registrar without matching keys at the new DNS host breaks resolution); it can be re-enabled later from Cloudflare.
- The zone moved to Cloudflare (Free plan). Nameservers: `hassan.ns.cloudflare.com`, `olga.ns.cloudflare.com`.
- Google Workspace mail records were copied unchanged and kept DNS-only (grey cloud): 5 MX records, SPF (`v=spf1 include:_spf.google.com a:hell-yeah.de ~all`), DKIM `google._domainkey`, DMARC (`p=reject`), `google-site-verification`, the `mail` CNAME to `ghs.googlehosted.com` and `_domainconnect`.
- `eyesbound.com` and `www.eyesbound.com` are attached as Workers custom domains. A Redirect Rule sends `www` to the apex with `301`. Always Use HTTPS is on. HSTS comes only from `site/public/_headers` (`max-age=31536000; includeSubDomains`, no preload).
- Checked with `curl --resolve eyesbound.com:443:<cloudflare ip>` while local resolvers still returned the old address.
- Map pages: the strict CSP needed `data:` in the map `connect-src` (the label worker fetches `data:` URLs).
- Netlify was retired after the cutover (see step 6); its DNS records and Maps referrers were removed.


Preconditions: Astro CI green on the cutover PR, `node scripts/route-parity.mjs` reports "Route parity OK", Lighthouse reports reviewed, `/sw.js` kill-switch present in `dist/` (done, see below), CSP still in report-only or verified on preview.

1. **Maps key referrers** (Google Cloud Console, Credentials, the browser key, HTTP referrers). Add before cutover, and already for previews: `https://*.primajin.workers.dev/*` (matches the Worker host `eyesbound.primajin.workers.dev` and the preview alias host `pr-<n>-eyesbound.primajin.workers.dev`; the subdomain `primajin` is the workers.dev subdomain of the Cloudflare account that holds the site), `https://eyesbound.com/*`, `https://www.eyesbound.com/*` if used. Remove the Netlify origins only after the rollback window closes. The ADR 0003 CSP follow-up (dropping `'unsafe-eval'`) also needs a test origin on this list.
2. **Lower DNS TTL** at least 24 h (the old TTL) ahead of the move: set the `eyesbound.com` records to 300 s.
3. **Enable the production deploy** (no file edit): set the repository **variable** `PRODUCTION_DEPLOY_ENABLED` to `true` (Settings, Secrets and variables, Actions, Variables; this one switch enables `deploy-production` in `ci.yml` and `content-deploy.yml`; optionally add a protected `production` environment first), then push or merge to `main`, then verify on `workers.dev`: all routes, one `Content-Security-Policy` header per route (ADR 0003 warns about silent doubles), `/sw.js`, `404` page and status.
4. **Move DNS to Cloudflare**: add the zone, copy existing records (mail/MX/TXT included), switch nameservers at the registrar, then attach `eyesbound.com` as the worker's custom domain. The lowered TTL applies to record changes; a nameserver change is bounded by the registrar's NS TTL, so allow for it.
5. **Smoke test** on the real domain: home, `/picture/`, a detail page, `/worldmap/` (map must render with the key), sitemap, `robots.txt`.
6. **Netlify (done: retired)**. The original plan was to keep Netlify deployed and untouched in its dashboard (do not delete the site; the repository no longer carries its config, so it keeps serving its last Gatsby deploy and must not be rebuilt from this branch) as rollback. The owner decided to retire it completely right after a successful cutover, so there is no DNS rollback target any more.
7. After stability: raise TTL back (e.g. 3600 s), decide separately on HSTS preload, switch CSP from report-only to enforcing.

### Rollback

Netlify is retired, so rollback means redeploying a previous worker version (`npx wrangler@4.152.0 rollback`), which needs no DNS change. A bad content change is fixed by republishing in Prismic.

## 4. Behaviour to know about

- **Trailing slashes**: URLs are canonical with a trailing slash. Cloudflare answers slash-less requests with `307` (not Netlify's `301`) and this is not configurable via `html_handling`. Internal links, canonical, `og:url` and the sitemap must all use the slash form so nothing points at the redirecting URL. Search engines treat 307 as temporary; static `301` rules in `_redirects` are a possible mitigation, untested (ADR 0003 section 6).
- **`/sw.js` kill-switch (required, done)**: implemented as `site/public/sw.js` (deletes all foreign caches on activate, then claims clients; caches only `/_astro/*` fonts and CSS plus icons, cache-first), registered by `site/public/register-sw.js` in production builds only, and `_headers` sets `Cache-Control: no-cache`. Covered by `site/scripts/__tests__/sw.test.js` and `e2e/sw.spec.js`. Background: returning visitors have the Gatsby Workbox service worker, which serves precached HTML. `/sw.js` must exist at cutover as a self-unregistering worker (or the replacement worker), served with `Cache-Control: no-cache`. Without it stale Gatsby pages can persist on returning devices. Verify with `curl -I https://eyesbound.com/sw.js` after the move.
- **HSTS**: `max-age=31536000; includeSubDomains` goes live on the custom domain once DNS moves and is hard to undo for a year. Check that every subdomain of `eyesbound.com` serves HTTPS before cutover. Do not add `preload` without a separate explicit decision.
- **Cloudflare script injection (Free plan)**: Cloudflare's JavaScript Detections injects a per-request inline script (`window.__CF$cv$params`, loads `/cdn-cgi/challenge-platform/scripts/jsd/main.js`). It cannot be switched off on the Free plan, and a per-request value cannot be allowed with a CSP hash, so the strict CSP blocked it and logged a console error. The fix is `Cache-Control: no-transform` on every response in `_headers`. That rule replaces the platform default `Cache-Control`, so `/*` also sets `public, max-age=0, must-revalidate`, and `/_astro/*` and `/sw.js` first detach it with `! Cache-Control` and then set their own value plus `no-transform`. If the script or the console error ever reappears, check this first (and any new Cloudflare bot or security feature).
- **`workers.dev`** previews should carry `X-Robots-Tag: noindex` (ADR 0003, untested).
- **Free-tier limit**: 20,000 asset files per version; CI prints the file count of `dist/` on each build.

## 5. CI overview

Gatsby removal is done (ADR 0004); the cutover checklist in section 3, the owner steps in section 6 and the publish pipeline in section 7 remain.

Deploy jobs: `preview`, `preview-comment`, `console` and `screenshots` live in `astro-ci.yml` (PR only, same-repo, `PREVIEW_PROVIDER=cloudflare`); `deploy-production` lives in `ci.yml` and `content-deploy.yml`; implementation in `_deploy-cloudflare.yml`. `Astro checks green` (inside `astro-ci.yml`) includes `preview`, `console` and `screenshots`; `All checks green` includes `astro` and `deploy-production` (skipped is fine, failure blocks).

`.github/workflows/astro-ci.yml` (called from `ci.yml` as job `astro`, so the required `All checks green` covers it, together with the auto-fixing `lint` job). It is built for the shortest wall-clock time; everything that can run in parallel does:

```text
t=0 ----+-- lint
        +-- unit (Vitest + Codecov)
        +-- route-parity (live sitemap)
        +-- build (real Prismic data, cached node_modules/.astro) --+-- e2e shards 1,2,3 (Playwright, browsers cached)
                                                                    +-- lighthouse home | picture | detail (advisory)
                                                                    +-- preview (PR, same repo, PREVIEW_PROVIDER=cloudflare)
                                                                          +-- preview-comment (best-effort)
                                                                          +-- console
                                                                          +-- screenshots
lint, unit, build, route-parity, e2e, preview, console, screenshots --> astro-green --> (caller `astro`) --> All checks green
```

Lint no longer gates the build (a failing lint wastes one build, the gate still fails). Playwright runs as 3 shards (`--shard`, artifacts `playwright-traces-<n>`); Lighthouse runs one job per URL (`lighthouserc.json` for `/` and `/picture/`, `lighthouserc.detail.json` for the first detail page; mobile, median of 5, artifacts `lighthouse-reports-<name>`). Lighthouse runs with `continue-on-error: true` and is not listed in `Astro checks green`; promote it by removing that line and adding it to the gate. The `astro` caller in `ci.yml` and `content-deploy.yml` grants `contents: write` and `pull-requests: write` only as the ceiling that the nested `screenshots`, `console` and comment jobs need; every inner job declares its own smaller grant. `content-deploy.yml` passes `run-route-parity: false`, and the PR-only jobs are skipped there (the event is not `pull_request`). The legacy PWA badge in `docs/lighthouse/` is not asserted; keep the badges truthful by updating the SVGs from real reports only.

## 6. Remaining owner steps after the Gatsby removal

1. Run the `git rm` commands listed in the PR description (the files named in ADR 0004), then delete the legacy ignore block at the top of `eslint.config.mjs`, commit and push.
2. Delete the leftover secrets `GATSBY_G_MAPS` and `GATSBY_API_KEY` from the repository and Dependabot stores (nothing reads them any more).
3. Local files: rename variables in your untracked `.env.local` if it still has `GATSBY_*` names (`SITE_URL`, `SITE_NAME`; the token and key names did not change), and delete the old `.env.development` / `.env.production`.
4. In the required status checks of the branch protection keep only `All checks green`; no check is named after the removed jobs (`build`, `build-matrix`, `test`).
5. Netlify: done. The site was retired after the cutover.
6. Cutover steps 1 to 7 above: done (see the record in section 3).

## 7. Publish in Prismic, rebuild and deploy (content-deploy)

Flow: Prismic webhook, then the relay Worker `worker/prismic-relay/`, then a GitHub `workflow_dispatch` on `.github/workflows/content-deploy.yml` (ref `main`), which runs the gates (lint, unit, real-data build, e2e) and `_deploy-cloudflare.yml` in production mode. Route parity is not run there: it compares Prismic with the live sitemap and would fail whenever a page is added or removed.

Behaviour of the workflow:

- The gates always run (they are cheap). The production deploy runs only when the repository variable `PRODUCTION_DEPLOY_ENABLED` is `true` (the same switch `deploy-production` in `ci.yml` uses) and the run is on `refs/heads/main`. A manual run from another branch is therefore a dry run.
- `workflow_dispatch` only runs from a branch that contains the workflow file. The relay uses `main`, so the pipeline works after the PR is merged; before that, dispatches to `main` fail with 404 (the relay answers 502).
- Start by hand: Actions, Content deploy, Run workflow.
- Concurrency group `content-deploy`, `cancel-in-progress: false`: a running deploy is never cancelled; GitHub keeps one pending run and replaces older pending ones, so a burst of publishes becomes the running build plus one follow-up that sees the latest content.
- Security: no inputs and no payload are read, every job that runs here holds at most `contents: read` (the `astro` caller grants `contents: write` / `pull-requests: write` only as the ceiling for the PR-only nested jobs, which are skipped on this event), actions are SHA-pinned in the called workflows.
- Blast radius of the relay token: it has only `Actions: Read and write`, so a leaked token can start and cancel workflow runs of this repository. It cannot push code, change workflows, or read secrets. Worst case is extra builds (and, with the switch on, a redeploy of what is on `main`).

### Why a relay (what was verified)

Verified against https://prismic.io/docs/webhooks (fetched): the payload is fixed JSON (`type` `api-update` or `test-trigger`, `masterRef`, `documents`, `releases`, `tags`, `domain`, `apiUrl`, `secret`), the only authentication field documented is the `secret` in that body, anything other than a 200 response counts as failure (retry every 10 minutes, 5 times, then the webhook is disabled). The docs mention neither custom headers nor a custom body. Not verified (I could not open the dashboard): whether Settings, Webhooks has a "Headers" field. Even if it has, a direct call to GitHub does not fit: GitHub needs `{"ref": ...}` in the body and an `Authorization` header, and it answers 204 (or 200 on newer API versions); Prismic treats 204 as a failure and eventually disables the webhook. Hence the relay.

The relay also keeps the GitHub token out of Prismic: Prismic only holds a shared secret, the token lives in Cloudflare as a Worker secret.

Relay environment: `GITHUB_REPO` (`Primajin/eyesbound`) and `GITHUB_REF` (`main`, also the default when unset) are plain vars in `worker/prismic-relay/wrangler.jsonc`; secrets `PRISMIC_WEBHOOK_SECRET` and `GITHUB_TOKEN` are set with `wrangler secret put`. The relay POSTs `{"ref":"main"}` to `https://api.github.com/repos/Primajin/eyesbound/actions/workflows/content-deploy.yml/dispatches`, treats any 2xx as success (200 to Prismic), and answers 502 on any other status or network error (logging only the status, never GitHub's body or the token).

### Verified vs assumed

- Verified: Prismic webhook behaviour (above); the relay code and its unit tests (all branches, 100% coverage); the workflow passes actionlint and parses.
- Assumed, to be confirmed by you: that **Actions: Read and write** is the exact fine-grained permission for "Create a workflow dispatch event" (the GitHub docs page could not be confirmed). Verify: if the dispatch answers 403, the response header `x-accepted-github-permissions` names what the endpoint needs; add that permission (and only that) to the token. Also assumed: the exact labels in the GitHub, Cloudflare and Prismic dashboards below (taken from memory, they may be worded slightly differently), and that GitHub answers 204 or 200 (the relay accepts any 2xx).

### Owner steps (nothing here is done for you)

1. **Create the GitHub token.** github.com, your avatar, Settings, Developer settings, Personal access tokens, Fine-grained tokens, Generate new token.
   1. Token name: `eyesbound-prismic-relay`.
   2. Resource owner: yourself (the owner of `Primajin/eyesbound`).
   3. Expiration: custom, at most one year out. Write the date down (step 12).
   4. Repository access: **Only select repositories**, choose `Primajin/eyesbound` and nothing else.
   5. Repository permissions: **Actions: Read and write**. Nothing else (Metadata: Read-only is added automatically). No account permissions.
   6. Generate token and copy it once (it starts with `github_pat_`).
2. **Test the token against GitHub** (needs the PR merged, otherwise 404). Replace the placeholder; do not keep a real token in shell history (prefix the command with a space, or use a throwaway shell):
   ```sh
   curl -sS -i -X POST https://api.github.com/repos/Primajin/eyesbound/actions/workflows/content-deploy.yml/dispatches \
     -H "Accept: application/vnd.github+json" \
     -H "Authorization: Bearer <GITHUB_PAT>" \
     -H "X-GitHub-Api-Version: 2022-11-28" \
     -d '{"ref":"main"}'
   # expect: any 2xx (204 historically, 200 on newer versions); a run appears in the Actions tab
   # 403: read the response header x-accepted-github-permissions, it names the permission the token lacks
   # 404: the workflow file is not on main yet, or the token cannot see the repository
   ```
3. **Create the shared secret:** `openssl rand -hex 32`. Copy the output; you paste it twice (step 5 and step 8).
4. **Log in to the right Cloudflare account**, the same `primajin` account the site is deployed to: `cd worker/prismic-relay && npx wrangler@4.152.0 whoami`. If it shows another account or none, run `npx wrangler@4.152.0 login` and pick the primajin account in the browser.
5. **Store the secrets** (still in `worker/prismic-relay/`; each command prompts, paste the value, nothing is echoed):
   ```sh
   npx wrangler@4.152.0 secret put PRISMIC_WEBHOOK_SECRET   # the shared secret from step 3
   npx wrangler@4.152.0 secret put GITHUB_TOKEN             # the token from step 1
   ```
   If wrangler says the Worker does not exist yet, accept creating it, or do step 6 first and repeat this step.
6. **Deploy the relay** (by hand, free plan, not done by CI): `npx wrangler@4.152.0 deploy`.
7. **Note the relay URL** printed by the deploy: `https://eyesbound-prismic-relay.<account-subdomain>.workers.dev`.
8. **Prismic webhook.** Prismic repository, Settings, Webhooks, Create a webhook:
   - URL: the relay URL from step 7.
   - Secret: the shared secret from step 3.
   - Triggers: page published and page unpublished (releases and tags are not needed).
   - Leave any header field empty. Save (the webhook is enabled).
9. **Test trigger.** In the webhook's detail view click "Test trigger". Expected: HTTP 200 in the log, and no run in the Actions tab (the relay does not dispatch for tests).
10. **Real publish test.** Publish a small change to a page in Prismic. Expected within seconds: a run `Content deploy (Prismic publish)` in the Actions tab; until `PRODUCTION_DEPLOY_ENABLED` is `true` it runs the gates only and does not deploy.
11. **Read the Prismic webhook logs:** Settings, Webhooks, open the webhook, Logs (or the log link). Each call shows the status the relay returned: 200 is fine, 401 means the secrets differ, 502 means GitHub refused (token expired, missing permission, workflow not on `main`, see the Cloudflare Worker logs in the dashboard under the Worker, Logs, which contain only the GitHub status). Repeated failures disable the webhook; re-enable it after fixing the cause.
12. **Record the token expiry** so `token-expiry.yml` can warn you:
    ```sh
    gh variable set RELAY_TOKEN_EXPIRES --body <YYYY-MM-DD of step 1.3> --repo Primajin/eyesbound
    ```
13. **Switch production deploys on** only at cutover (section 3, step 3): variable `PRODUCTION_DEPLOY_ENABLED` = `true`, plus the Cloudflare secrets from section 2.

Test the relay (shape of Prismic's call; `<RELAY_URL>` and `<SHARED_SECRET>` are placeholders):

```sh
curl -sS -i -X POST <RELAY_URL> -H "Content-Type: application/json" \
  -d '{"type":"api-update","secret":"<SHARED_SECRET>","documents":[]}'
# expect: 200 {"message":"Dispatched"}; a wrong secret gives 401; "type":"test-trigger" gives 200 without a run
```

### Token expiry and rotation

A fine-grained PAT has a mandatory expiry (maximum one year). When it expires, GitHub answers 401, the relay answers 502, Prismic retries 5 times over about 50 minutes and then **disables the webhook**: publishes silently stop reaching production. Mitigation: put a calendar reminder two weeks before expiry (GitHub also emails a warning), and check Prismic's webhook logs (Settings, Webhooks, Logs) when the site looks stale. Rotate: create a new token with the same scope (Actions: Read and write, only `Primajin/eyesbound`), run `npx wrangler@4.152.0 secret put GITHUB_TOKEN` in `worker/prismic-relay/` (no redeploy needed), then delete the old token. Rotate the shared secret the same way: `secret put PRISMIC_WEBHOOK_SECRET`, then update the secret in the Prismic webhook. If Prismic disabled the webhook, re-enable it in the dashboard after fixing the token. A manual rebuild is always possible via Actions, Content deploy, Run workflow.

The workflow `token-expiry.yml` checks this every Monday: it reads the repository variable `RELAY_TOKEN_EXPIRES` (the token's expiry date as `YYYY-MM-DD`) and fails, and opens an issue titled "Rotate the GitHub token of the Prismic relay", when the variable is missing or the date is 21 days away or less. Set the variable when you create the token, and update it after every rotation:

```bash
gh variable set RELAY_TOKEN_EXPIRES --body 2027-10-22 --repo Primajin/eyesbound
```

The date is kept by hand because the token itself lives only in Cloudflare. Scheduled workflows only run from the default branch, so the check starts working after the merge.
