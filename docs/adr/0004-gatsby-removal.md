# 0004. Gatsby removal

- Status: Accepted
- Date: 2026-10-22
- Tracking: Gatsby to Astro migration ([#987](https://github.com/Primajin/eyesbound/issues/987), PR #989)

## Context

The Astro site in `site/` reproduces every route of the Gatsby site (route parity is checked by `scripts/route-parity.mjs`). Keeping the Gatsby sources, Jest setup and Netlify workflows next to it meant two toolchains, two sets of scripts (`astro:*` next to the Gatsby ones), a large dependency tree (Gatsby, Emotion, Babel, Jest, webpack overrides) and documents describing both stacks.

## Decision

Remove all Gatsby code, packages and configuration from the branch before the switchover, so the default npm scripts are the Astro ones.

Removed:

- Gatsby sources: `gatsby-*.js`, `csp-utils.js`, `src/` (React and Emotion components, templates, pages, hooks, utils, tests, snapshots, `schema.graphql`), `static/`.
- Jest tooling: `jest.config.js`, `jest-*.js`, `loadershim.js`, `__mocks__/`, root `__tests__/`, and the packages (`jest`, `babel-jest`, `jest-junit`, `@emotion/jest`, Testing Library, ...).
- Packages: `gatsby` and all `gatsby-plugin-*`/`gatsby-source-prismic`, Emotion, `react-helmet`, `react-i18next`, `i18next`, `@react-google-maps/api`, `react-slideshow-image`, `classnames`, `prop-types`, `@codecov/webpack-plugin`, `eslint-config-xo-react`, the unused `ajv`, React itself (`react`, `react-dom`, `@astrojs/react`: the Astro site has no framework components) and the webpack/Gatsby-related `overrides` (only the `katex` override for XO's dev tooling stays). `legacy-peer-deps` in `.npmrc` was only needed for Gatsby.
- Workflows: `_build.yml`, `_build-matrix.yml` and `_test.yml` (Gatsby build with retries, Jest and Codecov), the Netlify wait steps in `_console.yml` and `_screenshots.yml`.

Kept by copying into Astro locations first:

| Was | Now |
|---|---|
| `src/i18n/locales/{en,de}.json` | `site/i18n/locales/` |
| `static/reset.css` | `site/styles/reset.css` |
| `static/a-design-award-winner-2016-silver-2x.png`, `static/creative-commons/*.svg` | `site/assets/` |
| `src/schemas/{category,picture,series,tags}.json` | `prismic/` (reference copy of the custom types) |
| `src/constants/*` | `site/constants/` (already ported) |

Renamed:

- npm scripts: `astro:build` is `build` (with `prebuild`), `astro:dev` is `dev`, `astro:preview` is `preview`, `test:astro` is `test`, `test:astro:coverage` is `coverage`.
- Environment variables: `GATSBY_SERVER_URL` is `SITE_URL`, `GATSBY_SITE_NAME` is `SITE_NAME` (both with documented fallbacks), `GATSBY_PRISMIC_REPO_NAME` was never read and is now `PRISMIC_REPO_NAME`. `GATSBY_API_KEY` is `PRISMIC_ACCESS_TOKEN` and `GATSBY_G_MAPS` is `MAPS_API_KEY` in CI.

Codecov: coverage upload moved into the `unit` job of `astro-ci.yml` (Vitest writes `lcov`). The separate Codecov test-results upload (JUnit from `jest-junit`) is gone.

## Consequences

- One toolchain: `npm run dev/build/preview/test/coverage/lint`.
- Older ADRs (0001 to 0003) describe the Gatsby state in their context sections; they are historical and are not rewritten.
- The Netlify site is not touched by this change; its configuration lived in Gatsby plugins and the dashboard, so the repository no longer carries any of it.
- The `GATSBY_G_MAPS` fallback was removed from `astro-ci.yml` once `MAPS_API_KEY` existed in the repository and Dependabot secret stores (see [hosting-cloudflare.md](../hosting-cloudflare.md)).
- Git history keeps the removed files, so a rollback is a revert.
