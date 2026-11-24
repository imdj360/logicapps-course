# Logic Apps — an interactive course

A free course that teaches Azure Logic Apps through animated, step-by-step lessons.
Static site: Astro + React islands, deployed to Azure Static Web Apps.

Design: [docs/superpowers/specs/2026-11-24-logicapps-course-design.md](docs/superpowers/specs/2026-11-24-logicapps-course-design.md)

## Run it locally

```bash
npm install
npx playwright install chromium   # once, for e2e tests
npm run dev                        # http://localhost:4321 — draft lessons are visible in dev
npm test                           # unit + content tests (Vitest)
npm run e2e                        # end-to-end tests against a production build (Playwright)
npm run build                      # production build into dist/
```

## Configuration

All settings are optional. Copy `.env.example` to `.env` for local use; in CI they come from GitHub repository variables.

| Variable | What it does | When empty |
|---|---|---|
| `PUBLIC_SITE_URL` | Canonical URLs, sitemap, share images | `http://localhost:4321` |
| `PUBLIC_DEVTO_URL` | "by Daniel Jonathan" credit, footer and recap "Follow on dev.to" links | Links hidden, credit is plain text |
| `PUBLIC_PLAUSIBLE_DOMAIN` | Loads cookieless Plausible analytics | No analytics script |
| `PUBLIC_CONTACT_EMAIL` | Contact on the privacy page | Privacy page points to dev.to |
| `PUBLIC_INCLUDE_FIXTURES` | `1` adds the test-fixture lessons (e2e only) | Fixtures excluded |

## Writing a lesson

Each lesson is a folder `src/content/lessons/<module-id>/<slug>/` with two files.

**`index.mdx`**: frontmatter plus one `<Step>` per step:

```mdx
---
title: Retry policies
module: reliability
order: 1
minutes: 9
level: Intermediate
summary: One line shown under the title.
youWillLearn: [three to five outcomes]
relatedArticles:
  - { title: My dev.to post, url: https://dev.to/... }
reviewStatus: draft
---

<Step id="problem" name="Retries pile up" tag="PROBLEM">
Narrative, 2–4 short paragraphs.

<Callout title="Watch out">Optional, one per step.</Callout>
</Step>
```

Tags: `PROBLEM` (first step), `FIX`, `TIP`, `RECAP` (last step). 8–12 steps.

**`scene.ts`**: the diagram. Nodes (with a `kind` that sets icon and colour), edges, and for each step id: which nodes/edges are visible, highlighted or failed, animated message tokens along edges, and the state chips above the diagram. Node labels are max 16 characters.

The slug must also be listed in `src/data/modules.ts`. `npm test` checks every lesson: step ids match the scene, every referenced node exists, labels fit, no product names.

### Draft → approved

New lessons are `reviewStatus: draft`: visible in `npm run dev`, **never published in a production build** (they show as "Soon"). After reviewing a lesson (facts checked against Microsoft Learn), Daniel sets:

```yaml
reviewStatus: approved
lastVerified: '2026-11-24'
```

## Reading the numbers (Plausible)

Custom events: `lesson_start`, `step_reached` (props: `lesson`, `step`), `lesson_complete`, `devto_click`.
Drop-off per lesson = `step_reached` counts by step. Use UTM tags on links from dev.to, e.g.
`?utm_source=devto&utm_campaign=<article-slug>`. Only add those links once the final domain is live, so the attribution is never split across two URLs.

## Deploying

`.github/workflows/azure-static-web-apps.yml` runs unit tests, e2e tests and the build on every push and pull request.
It deploys only when the repository variable `SWA_ENABLED` is `true`, and only if `PUBLIC_SITE_URL` is set.
The Static Web Apps config lives in `public/staticwebapp.config.json` so it ends up in `dist/`.

## Launch checklist (Daniel)

- [ ] Create a GitHub repository and push this repo
- [ ] Create an Azure Static Web App (Free plan), add its deployment token as secret `AZURE_STATIC_WEB_APPS_API_TOKEN`, set variable `SWA_ENABLED=true`
- [ ] Set `PUBLIC_SITE_URL` to the `*.azurestaticapps.net` URL before the first deploy (the workflow refuses to deploy without it)
- [ ] Later: choose a domain, add it to the Static Web App, update `PUBLIC_SITE_URL`
- [ ] Optional: create a Plausible site, set `PUBLIC_PLAUSIBLE_DOMAIN`
- [ ] Set `PUBLIC_DEVTO_URL` (and optionally `PUBLIC_CONTACT_EMAIL`)
- [ ] Review and approve the four launch lessons
