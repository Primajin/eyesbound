# Agent team for eyesbound

Role-based Claude Code subagents for this repo: a Gatsby 5 + Prismic + Emotion + Jest static site being migrated to Astro (https://github.com/Primajin/eyesbound/issues/987) and hosted on Cloudflare Workers (static assets).

| Agent | Model | Edits files | Role |
|---|---|---|---|
| orchestrator | opus | no | Decomposes work, dispatches specialists, enforces quality gates |
| architect | opus | no | Astro structure, Prismic content model, island strategy, ADR content |
| developer | sonnet | yes | Components, pages, `@prismicio/client` data, utilities |
| designer | sonnet | CSS/ARIA only | Plain/scoped CSS, tokens, accessibility, Lighthouse-minded design |
| tester | sonnet | yes | Jest now, Vitest later, e2e and Lighthouse checks |
| reviewer | opus | read-only by convention | Final gate; proposes codifications |
| devops | sonnet | yes | GitHub Actions, Cloudflare Workers static assets, `_headers`/CSP, Lighthouse CI |
| docs | haiku | yes | README, ADRs, migration notes |

## Invoking

Start with the orchestrator for anything spanning more than one domain:

```text
Use the orchestrator agent to <goal>, e.g. port the picture page to Astro.
```

Or call a specialist directly (for example "use the reviewer agent on my current diff"). The orchestrator must run at top level with the `Agent` tool, never in an isolated worktree; if its runtime lacks `Agent`, it returns a plan and handoff briefs instead of coding.

## Shared rules

- Quality gates: `npm run lint`, `npm test`, `npm run build`, Lighthouse 100s, CSP/`_headers` intact.
- Every agent except the reviewer ends by dispatching the reviewer.
- Destructive commands and file moves/deletes are presented to the user, never run.
- Agents are plain Markdown; edit them directly. Propose generalizable one-line rules when a mistake repeats.

