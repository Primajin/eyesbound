# 0001. Prismic data layer: replace gatsby-source-prismic with @prismicio/client

- Status: Accepted (2026-10-22, owner approved recommendations)
- Date: 2026-10-22
- Spike: S0a, Gatsby to Astro migration ([#987](https://github.com/Primajin/eyesbound/issues/987))
- Note: the Gatsby files named below were removed afterwards ([ADR 0004](0004-gatsby-removal.md)); `src/schemas/*.json` now lives in `prismic/`.

## Context

The Gatsby site gets its content from the Prismic repository `eyesbound` through `gatsby-source-prismic` (v6). Astro has no GraphQL data layer, so the migration needs another way to fetch content at build time. This spike checks whether `@prismicio/client` can replace the Gatsby source plugin without changing any URLs.

### What the current site queries

Custom types (`src/schemas/*.json`, now `prismic/*.json`):

| Type | Fields |
|---|---|
| `picture` | `uid`, `title`, `homepage` (bool), `series` → link to `series`, `category` → link to `category`, `tags` (group of `tag` → link to `tags`), `image` (constraint width 1500; thumbnail `thumbnail` width 280), `datetime`, `coordinates` (GeoPoint) |
| `category`, `series`, `tags` | `uid`, `title` |

Template queries (`src/templates/*.jsx`, routes from `gatsby-node.js`):

| Route | Template | Data |
|---|---|---|
| `/` | home | pictures with `homepage = true`, sorted by `datetime` desc, limit 5; image width 1280 q80 and thumbnail width 50 |
| `/worldmap` | map | pictures whose coordinates are not 0/0; title, coordinates, thumbnail width 164 |
| `/picture` | pictures | all pictures sorted by `datetime` desc; thumbnail width 261 |
| `/picture/:uid` | picture | one picture; image width 1072 q80 and thumbnail width 164; linked `category`, `series` and `tags[].tag`, each with `uid` and `data.title` |
| `/category`, `/series`, `/tag` | categories / series-all / tags | all documents of the type sorted by `title` asc |
| `/category/:uid`, `/series/:uid`, `/tag/:uid` | category / series / tag | the document plus the pictures that link to it, sorted by `datetime` desc; thumbnail width 261 |
| `/imprint`, `/404` | static pages | no Prismic data |

The only linked-document data any template reads is `uid` and `data.title` of `category`, `series` and `tags`. These map directly to `fetchLinks: ['category.title', 'series.title', 'tags.title']`. Linked documents already include `uid` without asking for it.

### Findings

1. **The API needs a token.** `GET https://eyesbound.cdn.prismic.io/api/v2` with no token returns `401 {"error":"Invalid access token"}`. The build already uses the secret `GATSBY_API_KEY` (`.github/workflows/_build.yml`, `_build-matrix.yml`). There is no token in the local `.env`. The Astro build will need the same token, stored as a build-time secret with a name that has no public prefix, for example `PRISMIC_ACCESS_TOKEN`. Do not use the `PUBLIC_` prefix, because Astro inlines `PUBLIC_*` variables into client code.
2. **Document counts.** Without a token they could not be read from the API. The live sitemap is used as a proxy, because every published document with a UID becomes one page: 158 `picture`, 4 `category`, 7 `series`, 63 `tags`. With 7 static routes that makes 239 URLs. The spike that has the token must confirm these numbers against the API.
3. **Previews are not used.** There is no preview plugin, no `withPrismicPreview` and no toolbar script. Two CSP entries only exist for previews and can be removed during the CSP work: `static.cdn.prismic.io` (script-src) and `eyesbound.prismic.io` (frame-src).
4. **The link resolver is not used.** `linkResolver: doc => /${doc.id}` is configured, but the templates build all URLs by hand from `src/constants/asset-types.js`.
5. **Parity details on the live site (Netlify):**
   - Pages are served with a trailing slash. `/picture/exoplanet` returns a 301 to `/picture/exoplanet/`.
   - The `canonical` and `og:url` tags use the URL without the slash, which is the URL that redirects.
   - Internal links also leave out the slash.
   - At least one UID has dots in it (`holland-8664-z.z.g.`), so route params must not be slugified or normalised.
6. **Images come from a third party.** All `<img>`, `srcset` and `og:image` URLs point to `images.prismic.io` (imgix), for example `?auto=compress,format&rect=…&w=1072&h=713&fit=max&q=80`. So the CSP needs `images.prismic.io` in `img-src`, and `src/html.jsx` preconnects to it.
7. **There is a large generated file.** `src/schemas/schema.graphql` (about 115 KB) is Gatsby type output and is not needed after the migration.

## Decision

Replace `gatsby-source-prismic` with `@prismicio/client`, used **only at build time**. This adds one new dependency, which needs maintainer approval.

1. **One data module**, for example `src/lib/prismic.js`. It is the only place that imports `@prismicio/client`. It exports small typed functions (JSDoc) that return plain objects:
   - `getAllPictures()`: `client.getAllByType('picture', { orderings: [{ field: 'my.picture.datetime', direction: 'desc' }], fetchLinks: ['category.title', 'series.title', 'tags.title'] })`. With 158 documents this is 2 API pages.
   - `getAllByTitle(type)` for `category`, `series` and `tags`, ordered by `my.<type>.title` asc.
   - Derived helpers that run in memory on the cached picture list, with no extra API calls: `homepagePictures(limit = 5)`, `mapPictures()` (coordinates not 0/0), `picturesByCategory(uid)`, `picturesBySeries(uid)`, `picturesByTag(uid)`.
   - The module stores each fetch in a module-level promise, so a build makes about 5 API requests in total, not one per page.
2. **Routing** stays in one place. Each Astro page uses `getStaticPaths` with `params.uid` taken directly from Prismic, unchanged. One `routes` helper builds the `/category/`, `/series/`, `/tag/` and `/picture/` paths from the existing `asset-types` constants. It replaces both the unused `linkResolver` and the paths currently built by hand in templates.
3. **The access token** is read from `import.meta.env.PRISMIC_ACCESS_TOKEN` (server only). The CI secret is renamed or mapped from `GATSBY_API_KEY`. The build fails with a clear error if the token is missing.
4. **Preview support is not built.** This is out of scope, and the preview-only CSP origins are removed.
5. **Images are downloaded at build time and served from our own origin.** We use Astro's built-in image pipeline (`astro:assets`):
   - Allow remote source images with `image.domains: ['images.prismic.io']`.
   - Pass the imgix URL as the source, already reduced in size (for example `w=2144&q=90`, about 2× the largest rendered width), so the build downloads less.
   - Astro generates the responsive widths and formats (AVIF/WebP with a JPEG fallback) and writes them to `/_astro/`, with explicit `width` and `height`.
   - Rendered sizes stay the same as today: detail 1072, home 1280, grid 261, map 164, slideshow indicator 50.
   - `og:image` uses an absolute same-origin URL to a 1200-wide variant.
   - Results:
     - CSP `img-src` can become `'self' data:` plus the Google Maps origins only.
     - The `images.prismic.io` preconnect goes away.
     - Images keep working if Prismic or imgix is down, and visitors no longer reveal their IP to a third party for every image.
     - Images can use Cloudflare's long-lived immutable caching, through `_headers` for `/_astro/*`.
6. **Parity gate.** The CI job that builds the Astro site compares the generated sitemap URL set with the live `https://eyesbound.com/sitemap-0.xml` and fails on any difference. A trailing-slash difference also counts as a failure. The trailing-slash policy (Astro `trailingSlash` and `build.format: 'directory'`) and making canonical URLs match the served URL are decided in the hosting ADR.

## Consequences

**Positive**
- No GraphQL layer, no `schema.graphql`, and no Gatsby node APIs. The data code is plain JS, so it can be tested with Vitest using fixture JSON and no DOM.
- About 5 API requests per build, and all page filtering runs in memory.
- With same-origin images the CSP is stricter, there is no third-party image dependency at runtime, and LCP should improve because no extra connection is needed.

**Negative / risks**
- A new runtime/build dependency (`@prismicio/client`) needs maintainer approval.
- Build time and size: 158 source images in about 4 widths and 2 to 3 formats adds roughly 2,000 to 3,000 files and image processing (sharp) on every build. This is below Cloudflare Pages' 20,000 files per deployment and 25 MiB per file limits. Without a cache, every build downloads and processes everything again, so the Astro asset cache (`node_modules/.astro`) must be kept between CI builds. The devops/CI ADR decides where the build runs (GitHub Actions plus `wrangler pages deploy`, or a Cloudflare Pages build).
- The images are copies. A changed image in Prismic only goes live after the next build, which is already true for all content on this static site. Publishing content still needs a rebuild, through a Prismic webhook to a deploy hook. This is the same as today.
- The JSDoc types must be updated by hand when the custom types change. They change rarely, and there are 4 types.

## Alternatives considered

- **Keep imgix URLs from `images.prismic.io`** using `@prismicio/client`'s `asImageWidthSrcSet`. This is simpler and gives fast builds with no image processing, but it keeps a third-party origin in the CSP and in the LCP path. It is a fallback if build time becomes a problem.
- **Write our own download script** that saves imgix-resized variants into `public/` without `astro:assets`. This avoids running sharp locally, but it duplicates what Astro already does and needs its own cache and manifest.
- **Astro Content Layer loader for Prismic**, through a community loader or a custom `loader` in `content.config`. It is idiomatic, but at about 230 documents it adds abstraction without a clear benefit. We can revisit it if content grows.
- **Fetch per page with filters** (`filter.at('my.picture.category', id)`). This needs more requests than fetching everything once, and the dataset is small.
- **Use Prismic Slice Machine / `prismic-ts-codegen`.** It is not needed for 4 simple types and adds tooling.
