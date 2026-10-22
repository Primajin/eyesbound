# 0002. Test strategy and offline support for the Astro migration

- Status: Accepted (2026-10-22, owner approved recommendations)
- Date: 2026-10-22
- Deciders: Jannis Hell (pending)
- Related: issue #987 (Gatsby to Astro migration), CSP strategy ADR (pending)

## Context

The Gatsby site is tested with Jest 30 + jsdom + Testing Library. The setup is tightly coupled to Gatsby and Emotion:

- `jest.config.js` transforms with `babel-preset-gatsby` + `@emotion/babel-plugin` (`jest-preprocess.js`), uses `@emotion/jest/serializer` for snapshots, maps `react-i18next` to `__mocks__/react-i18next.js`, and loads `loadershim.js` (Gatsby `___loader`).
- `jest-mocks.js` mocks `gatsby-plugin-image`, `react-helmet` and `@react-google-maps/api`; `__mocks__/gatsby.js` mocks `Link`, `graphql`, `useStaticQuery`.
- There are 30 test files (test counts per file are listed below) and 23 Emotion snapshot files (53 files total; "53 suites" in earlier notes counts the `.snap` files). Most component tests are `toMatchSnapshot()` on Emotion-serialized DOM; several snapshots exceed 500 lines (member 1711, group 1203, imprint 921, slideshow 863).
- `__tests__/gatsby-node.test.js` actually tests `csp-utils.js` (post-build inline-script hashing), not Gatsby route creation.

Offline: `gatsby-plugin-manifest` generates the web manifest and icons from `static/logo.png`; `gatsby-plugin-offline` registers a Workbox service worker at `/sw.js` (precache glob `**/static*` plus Gatsby's app-shell and runtime caching). Fonts are self-hosted via `@fontsource/montserrat` (latin 400/700). The README shows a Lighthouse PWA badge (`docs/lighthouse/lighthouse_pwa.svg`), but Lighthouse 12 removed the PWA category, so that badge can no longer be regenerated.

Astro renders most of the site to static HTML with zero JS. Only interactive parts become islands. Tests that snapshot Emotion class names lose their meaning once Emotion is removed.

## Decision

### Test runner

1. Adopt Vitest (shares Vite config with Astro). Unit and island tests run in Vitest with the `jsdom` environment where a DOM is needed and `node` otherwise.
2. Static `.astro` components are tested with Astro's Container API (`experimental_AstroContainer`) inside Vitest, using behaviour assertions (text, links, attributes, meta tags), not full-DOM snapshots.
3. A small Playwright smoke suite against the built `dist/` (or the Cloudflare Pages preview) covers cross-island flows: theme toggle persistence, language switch, fullscreen toggle, map renders, no CSP violations in the console.
4. All Emotion snapshots are dropped, not ported. No new snapshot tests except small inline snapshots of pure data (for example a generated `srcset`).
5. Jest and Vitest coexist during the migration: Vitest's `include` covers only new Astro-era files; each Jest suite is deleted in the same PR that deletes the Gatsby component it covers; Jest and its Babel/Emotion config are removed in the "remove Gatsby deps" PR. `main` stays green throughout.
6. `jest-junit` is replaced by Vitest's built-in `junit` reporter; coverage by `@vitest/coverage-v8`.

### Per-suite disposition

Legend: KEEP = keep logic test under Vitest (mechanical port: `jest.*` to `vi.*`); ISLAND = port as React island test (Vitest + Testing Library, assertions instead of snapshots); CONTAINER = replace with Astro Container API test; E2E = covered by Playwright smoke; DROP = delete without replacement.

| Suite | Tests | Snapshots | Disposition | Notes |
|---|---|---|---|---|
| `__tests__/gatsby-node.test.js` (csp-utils) | 15 | 0 | KEEP (conditional) | Survives only if the CSP ADR keeps build-time script hashing (then move to an Astro integration and rename `csp-utils.test.js`); otherwise DROP with `csp-utils.js`. |
| `src/utils/__tests__/fullscreen.test.js` | 4 | 0 | KEEP | Pure util. |
| `src/utils/__tests__/theming.test.js` | 6 | 0 | KEEP | Pure util; feeds the theme island and the pre-paint inline theme script. |
| `src/i18n/__tests__/config.test.js` | 5 | 0 | KEEP | `getBrowserLanguage` stays a plain module. |
| `src/hooks/__tests__/use-theme-preference.test.js` | 4 | 0 | KEEP | Hook stays if the theme switcher remains a React island; otherwise rewrite against the plain module. |
| `src/i18n/__tests__/hydration.test.jsx` | 3 | 0 | ISLAND | Still relevant: Astro SSRs React islands with `renderToString` and hydrates them; retarget to the language-switcher and navigation islands. |
| `atoms/fullscreen.test.jsx` | 3 | 2 | ISLAND | Keep click behaviour, drop snapshots. |
| `atoms/theme-switcher.test.jsx` | 3 | 4 | ISLAND + E2E | Persistence across navigation in Playwright. |
| `atoms/language-switcher.test.jsx` | 5 | 1 | ISLAND + E2E | Replace the `react-i18next` mock with the shared translation module. |
| `atoms/navigation.test.jsx` | 4 | 3 | ISLAND | Menu toggle state (`useState`). |
| `atoms/google-map.test.jsx` | 5 | 5 | ISLAND | Port the `@react-google-maps/api` mock from `jest-mocks.js` to `vi.mock`; keep marker/InfoWindow click assertions. |
| `molecules/map.test.jsx` | 2 | 2 | ISLAND | Merge into the google-map island test (thin wrapper). |
| `atoms/icon-bulb-off.test.jsx` | 1 | 1 | DROP | Static SVG; covered by the theme-switcher test. |
| `atoms/icon-bulb-on.test.jsx` | 1 | 1 | DROP | As above. |
| `atoms/icon-fullscreen.test.jsx` | 1 | 1 | DROP | Static SVG; covered by the fullscreen test. |
| `atoms/icon-fullscreen-exit.test.jsx` | 1 | 1 | DROP | As above. |
| `atoms/logo.test.jsx` | 2 | 2 | CONTAINER | Assert link target and accessible name. |
| `atoms/main-wrapper.test.jsx` | 2 | 2 | DROP | Pure layout wrapper; covered by page container tests. |
| `atoms/tag-links.test.jsx` | 3 | 3 | CONTAINER | Assert hrefs and labels per tag. |
| `atoms/helmet-meta-tags.test.jsx` | 2 | 2 | CONTAINER | Becomes the shared head/meta component; assert title, description, OG/Twitter tags, canonical. |
| `molecules/header.test.jsx` | 2 | 2 | CONTAINER | Assert islands present and logo link. |
| `molecules/list.test.jsx` | 3 | 3 | CONTAINER | Empty / one / many cases as assertions. |
| `molecules/group.test.jsx` | 3 | 3 | CONTAINER | As above; 1203-line snapshot dropped. |
| `molecules/member.test.jsx` | 4 | 4 | CONTAINER | Keep "hides title when it matches the plural asset type" as an assertion. |
| `molecules/picture.test.jsx` | 3 | 5 | CONTAINER | Assert image `width`/`height`/`srcset`/`loading`; replaces the `gatsby-plugin-image` mock. |
| `molecules/thumbnails.test.jsx` | 3 | 3 | CONTAINER | Assert thumbnail count, links, lazy loading. |
| `organisms/slideshow.test.jsx` | 5 | 5 | CONTAINER | No component state today (CSS-driven); if it becomes an island, switch to ISLAND. |
| `pages/404.test.jsx` | 3 | 1 | CONTAINER | Heading and home link. |
| `pages/imprint.test.jsx` | 1 | 1 | CONTAINER | Assert key sections and privacy link. |
| `templates/picture.test.jsx` | 5 | 0 | CONTAINER | Already behaviour-based (date, `datetime`, tags, missing title); port assertions 1:1 with Prismic fixtures instead of GraphQL props. |
| 23 `__snapshots__/*.snap` files | n/a | n/a | DROP | Emotion-serialized; meaningless after Emotion removal. |

Totals: KEEP 5, ISLAND 7, CONTAINER 14, DROP 5 test files plus all 23 snapshot files; Playwright smoke adds roughly 5 new flows.

### Test infrastructure disposition

| File | Disposition |
|---|---|
| `jest.config.js`, `jest-preprocess.js`, `jest-setup.js`, `loadershim.js` | DROP at Gatsby removal; replaced by `vitest.config.ts` (via Astro's `getViteConfig`) and a setup file importing `@testing-library/jest-dom/vitest`. |
| `jest-mocks.js` | DROP; the Google Maps mock moves into the map island test. `gatsby-plugin-image` and `react-helmet` mocks have no successor. |
| `__mocks__/gatsby.js`, `__mocks__/file-mock.js` | DROP (Vite handles assets). |
| `__mocks__/react-i18next.js` | DROP; tests load the real translation resources through the shared i18n module so missing keys fail tests. |

### Offline / PWA

Chosen: **web manifest + minimal precache service worker**, with no new runtime dependency.

- `public/manifest.webmanifest` and pre-generated icons (from `static/logo.png`) replace `gatsby-plugin-manifest`, keeping the same name, colours, `display: standalone` and `purpose: any maskable` icon.
- A small hand-written `public/sw.js` precaches the self-hosted Montserrat 400/700 font files, the logo/icons and the global CSS, using cache-first for those versioned assets only. HTML and Prismic images are not cached; navigation is network-only, so there is no stale-content risk.
- `public/sw.js` is served at the same path as the old Gatsby Workbox worker, so existing visitors update to it automatically. On `activate` it deletes the old Workbox/Gatsby caches and calls `clients.claim()`.
- Astro hashes asset filenames, so there is no install-time precache list: fonts, CSS and icons are cached cache-first on first use; `_headers` sets `Cache-Control: no-cache` on `/sw.js`.
- Registration lives in an external script file (not inline) so it needs no CSP hash; it must be verified that Astro does not inline it.
- The Lighthouse PWA badge is retired from the README because Lighthouse no longer reports that category. This is a product decision for the owner to confirm.

## Consequences

- Positive: the test suite no longer depends on Gatsby, Babel or Emotion; Vitest reuses Astro's Vite config; behaviour assertions replace roughly 7,000 lines of brittle snapshots; Playwright catches CSP and hydration failures that jsdom cannot.
- Positive: offline support keeps the installable manifest and fast repeat visits (fonts, icons) without Workbox or a new runtime dependency, and cleanly retires the Gatsby service worker for returning visitors.
- Negative: two runners run side by side during the migration (more CI time, two configs).
- Negative: no offline browsing of previously visited pages (Gatsby's app-shell behaviour is gone). Acceptable for a portfolio whose content is large images.
- Negative: the Container API is still marked experimental in Astro; tests may need updating across Astro minors.
- New dev dependencies need owner approval: `vitest`, `@vitest/coverage-v8`, `jsdom`, `@playwright/test` (`@testing-library/react` and `@testing-library/jest-dom` already exist).
- CI (`coverage` script, `JEST_JUNIT_CLASSNAME`) must be updated by devops when Jest is removed.

## Alternatives considered

- **Keep Jest with a Vite/SWC transform**: rejected; duplicates the build pipeline and cannot render `.astro` files.
- **Port all Emotion snapshots to plain DOM snapshots**: rejected; huge snapshots that get approved without review, and they break on every markup change.
- **Playwright only for components**: rejected as primary tool; slow feedback, but kept for the smoke flows.
- **`gatsby-plugin-offline` equivalent via `@vite-pwa/astro` (Workbox)**: rejected for now; adds a dependency and Workbox runtime for a site that only needs fonts/icons precached; its generated registration script also needs CSP handling. Revisit if full offline browsing becomes a requirement.
- **Drop the service worker entirely (manifest only)**: viable fallback. It would need a one-off "kill switch" `sw.js` that unregisters the old Gatsby worker anyway, so the incremental cost of a minimal precache is small.
