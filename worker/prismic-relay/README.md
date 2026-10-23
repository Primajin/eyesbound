# Prismic to GitHub relay Worker

Tiny Cloudflare Worker (free plan) that turns a Prismic publish webhook into a GitHub `workflow_dispatch` (ref `main`) that starts `.github/workflows/content-deploy.yml`.

Why it exists: Prismic sends a fixed JSON body (`type`, `masterRef`, `documents`, `secret`, ...) and expects HTTP 200. GitHub requires `ref` in the body and an `Authorization` header, and answers 204 (or 200). Full setup: `docs/hosting-cloudflare.md`, section 7.

Behaviour:

- Only `POST`; body up to 64 KiB, JSON.
- Checks `secret` in the body against `PRISMIC_WEBHOOK_SECRET` (constant-time); 401 otherwise.
- `type: "test-trigger"` (Prismic's test button) answers 200 without dispatching.
- Otherwise POSTs `{"ref":"<GITHUB_REF>"}` to `https://api.github.com/repos/<GITHUB_REPO>/actions/workflows/content-deploy.yml/dispatches`. Nothing from the Prismic payload is forwarded. Any 2xx from GitHub gives 200 to Prismic; any other status or a network error gives 502 (only the status is logged) (Prismic retries every 10 minutes, up to 5 times, then disables the webhook).

Config: `GITHUB_REPO` and `GITHUB_REF` (default `main`) are plain vars in `wrangler.jsonc`. Secrets, set once and never committed:

```sh
cd worker/prismic-relay
npx wrangler@4.152.0 secret put PRISMIC_WEBHOOK_SECRET   # long random string, same value you enter as Prismic's secret
npx wrangler@4.152.0 secret put GITHUB_TOKEN             # fine-grained PAT, Primajin/eyesbound only, Actions: Read and write
```

Deploy (owner, by hand; CI does not deploy this Worker): `npx wrangler@4.152.0 deploy`. The URL is `https://eyesbound-prismic-relay.<account-subdomain>.workers.dev`.

Test: `npm test` from the repository root runs `src/index.test.js`.
