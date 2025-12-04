# Copilot Instructions for Eyesbound

## Project Overview
Eyesbound is a Gatsby-based website for a Berlin-based photographer, built with React and emotion-styled components. The project follows atomic design principles and prioritizes code quality, test coverage, and web performance standards.

## Development Workflow

### 1. Setup and Dependencies
- **ALWAYS** run `npm install` first before making any code changes
- This project requires Node.js >= 22.4.0 (though it may work with lower versions)
- Dependencies are managed via npm, never use yarn or other package managers

### 2. Code Quality and Linting
- **ALWAYS** use XO Lint for code quality checks
- Run `npm run lint` to check for issues
- Run `npm run lint:fix` to automatically fix linting issues
- The project uses ESLint with XO config and follows strict code style rules
- Key linting rules:
  - Import order with newlines between groups
  - React-specific rules (no React in scope needed, require default props)
  - Jest-specific rules for test files
  - Unknown property exceptions for `css` and `fill` attributes (emotion/SVG)

### 3. Testing and Coverage
- **ALWAYS** run tests before committing changes: `npm test`
- Maintain or improve code coverage - never let it decrease
- Test files use Jest with React Testing Library
- Snapshot tests are used extensively
- Run `npm run coverage` to generate coverage reports
- Update snapshots only when intentional changes are made: `npm test:update`
- Follow existing test patterns in `__tests__` directories

### 4. Build and Development
- Use `npm run develop` or `npm start` to run the development server
- Run `npm run build` to create production builds
- The project uses Gatsby for static site generation
- GraphQL is used for data queries
- Clean builds with `npm run clean` if needed

### 5. Code Structure
- Follow atomic design principles:
  - `src/components/atoms`: Small, non-dividable components
  - `src/components/molecules`: Medium complexity components
  - `src/components/organisms`: Complex, high-order components
- Use emotion for CSS-in-JS styling
- PropTypes are defined using custom type definitions in `src/types`
- Helper functions go in `src/utils`
- Templates in `src/templates` are used for Gatsby page generation

### 6. Performance and Web Standards
Focus on maintaining excellent Lighthouse scores:
- **Performance**: Target 99%+
- **Accessibility**: Target 97%+
- **Best Practices**: Target 100%
- **SEO**: Target 100%
- **Progressive Web App (PWA)**: Target 100%

Key considerations:
- Optimize images using gatsby-plugin-image
- Maintain PWA features (offline support, manifest)
- Follow accessibility best practices (semantic HTML, ARIA labels, keyboard navigation)
- Keep bundle sizes minimal
- Use lazy loading where appropriate

### 7. Git and Commits
- Write clear, concise commit messages
- Keep commits focused on single changes
- Do not commit build artifacts or `node_modules`
- Use `.gitignore` to exclude unnecessary files

### 8. Common Patterns
- React components use hooks and functional components
- No need to import React in JSX files (configured in linting)
- Use emotion's css prop for styling
- GraphQL queries are defined in page/template files
- Use Helmet for meta tags and SEO

### 9. Security and Best Practices
- Never commit API keys or secrets (use `.env` files)
- Follow security best practices for dependencies
- Keep dependencies up to date via dependabot
- Use CSP headers (gatsby-plugin-csp)

### 10. Documentation
- Update README.md if adding new features or changing setup
- Document complex logic with comments only when necessary
- Keep code self-documenting where possible
- Follow existing code style and patterns

## Quick Reference Commands
```bash
npm install           # Install dependencies
npm start            # Start development server
npm run lint         # Check code quality
npm run lint:fix     # Fix linting issues
npm test             # Run tests
npm run coverage     # Generate coverage report
npm run build        # Build for production
npm run clean        # Clean build cache
```

## Important Notes
- This is a private repository for a specific photography website
- The project uses Prismic CMS for content management
- Google Maps integration is used for location display
- The site must maintain high Lighthouse scores and PWA standards
- Code coverage must not decrease with new changes
