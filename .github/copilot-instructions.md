# Copilot Instructions for Eyesbound

## Project Overview
Eyesbound is an Astro website for a Berlin-based photographer, with content from Prismic, hosted on Cloudflare Workers static assets. It prioritizes code quality, test coverage, and web performance standards. The site used to run on Gatsby; see `docs/adr/0004-gatsby-removal.md`.

## Development Workflow

### 1. Setup and Dependencies
- **ALWAYS** run `npm install` first before making any code changes
- This project requires Node.js >= 22.4.0 as specified in package.json
- Dependencies are managed via npm, never use yarn or other package managers

### 2. Code Quality and Linting
- **ALWAYS** use XO Lint for code quality checks
- Run `npm run lint` to check for issues
- Run `npm run lint:fix` to automatically fix linting issues
- The project uses ESLint with XO config and follows strict code style rules
- Key linting rules:
  - Import order with newlines between groups
  - Tab indentation
  - Jest-style rules for test files (tests themselves run on Vitest)

### 3. Testing and Coverage
- **ALWAYS** run tests before committing changes: `npm test` (Vitest)
- Maintain or improve code coverage - never let it decrease
- Run `npm run coverage` to generate coverage reports
- Browser behaviour is covered by Playwright specs in `e2e/` (`npm run test:e2e`, needs a build)
- Follow existing test patterns in `__tests__` directories beside the code

### 4. Build and Development
- Use `npm run dev` (or `npm start`) to run the development server
- Run `npm run build` to create the production build in `dist/` (needs `PRISMIC_ACCESS_TOKEN` and `MAPS_API_KEY`, see `.env.example`)
- Run `npm run preview` to serve `dist/`
- Content is fetched from Prismic at build time with `@prismicio/client` (`site/lib`)

### 5. Code Structure
- Source lives in `site/` (Astro `srcDir`):
  - `site/pages`: file-based routes with the same URLs as the old site
  - `site/components`, `site/layouts`: `.astro` markup
  - `site/lib`: Prismic client, data mapping, route list
  - `site/utils`, `site/constants`, `site/i18n`: helpers, constants, translations (`locales/{en,de}.json`)
  - `site/scripts`: browser scripts (map, slideshow, navigation, theme)
  - `site/styles`: plain CSS with custom properties
  - `site/public`: files copied verbatim to `dist/` (`_headers`, manifest, service worker)
- No CSS-in-JS and no UI framework; add one only after an architect decision

### 6. Performance and Web Standards
Focus on maintaining excellent Lighthouse scores:
- **Performance**: Target 99%+
- **Accessibility**: Target 97%+
- **Best Practices**: Target 100%
- **SEO**: Target 100%

Key considerations:
- Images: explicit width and height, responsive `srcset`, lazy loading below the fold
- Keep the manifest and service worker (ADR 0002)
- Follow accessibility best practices (semantic HTML, ARIA labels, keyboard navigation)
- Keep bundle sizes minimal

### 7. Git and Commits
- Write clear, concise commit messages
- Keep commits focused on single changes
- Do not commit build artifacts or `node_modules`
- Use `.gitignore` to exclude unnecessary files

### 8. Common Patterns
- `.astro` components for static markup; plain scripts for interactivity
- Missing Prismic data renders a defined fallback or fails the build, never a happy-looking default
- Title, description, canonical and Open Graph tags come from the base layout

### 9. Security and Best Practices
- Never commit API keys or secrets (use `.env.local`, which is git-ignored)
- Follow security best practices for dependencies
- Keep dependencies up to date via Renovate and Dependabot
- CSP and other headers live in `site/public/_headers` (ADR 0003)

### 10. Documentation
- Update README.md if adding new features or changing setup
- Document complex logic with comments only when necessary
- Keep code self-documenting where possible
- Follow existing code style and patterns

## Quick Reference Commands
```bash
npm install           # Install dependencies
npm run dev           # Start development server
npm run lint          # Check code quality
npm run lint:fix      # Fix linting issues
npm test              # Run unit tests
npm run coverage      # Generate coverage report
npm run build         # Build for production
npm run preview       # Serve the production build
npm run test:e2e      # Playwright e2e on dist/
```

## Important Notes
- This is a private repository for a specific photography website
- The project uses Prismic CMS for content management
- Google Maps integration is used for location display
- The site must maintain high Lighthouse scores
- Code coverage must not decrease with new changes
