# Logic Apps — an interactive course (working title)

Design doc · 2026-11-24 (Tuesday)

## Intent

A free, public, interactive course that teaches Azure Logic Apps — from first trigger to agentic workflows — through animated, step-by-step lessons. Its job is to **build Daniel's reputation and an audience** of Azure integration developers. **It does not promote Lens Suite or LogicAppsHub for now** (Daniel, 2026-11-24); product tie-ins may be added in a later release, but nothing in this design depends on them.

The reference experience is <https://designed-to-scale.vercel.app> (a system-design course). We want the same *kind* of experience — not its look, branding, art or content.

**Audience:** Azure integration developers and architects, many arriving from Daniel's 100+ dev.to articles on Logic Apps and Azure integration.

**Success:** not yet defined in numbers. The site is built to *find out* what traction looks like: it measures lessons started and finished, where people drop off, CTA clicks, and which dev.to articles send people. Primary signal: lessons finished. Outward link: follows/clicks to Daniel's dev.to.

## Goals

- Lessons that make Logic Apps runtime behaviour *visible*: a run moving through trigger → actions, retries firing, scopes catching failures, agents choosing tools.
- Each lesson is its own indexable page so search and dev.to links land directly on it.
- Cheap to add lessons: writing one should feel close to writing a dev.to post plus a scene definition.

## Non-goals (v1)

- No login, accounts or backend of our own. Progress lives in the browser.
- No live Azure sandbox or running real Logic Apps.
- No integration with the Lens platform (separate site, separate repo).
- No Practice or Design Lab tabs in v1 (see Scope).
- English only in v1.

## Anti-goals (failure even if it works)

- **Looks like a copy of designed-to-scale.** Layout patterns are fine; its colours, isometric beige art style, typography pairing, logo treatment and wording are not.
- **Selling.** No product promotion and no email signup in v1. Lessons teach; the only outward link is "Follow Daniel on dev.to".
- **Wrong Azure facts.** One wrong retry default or limit undermines the expert positioning. Every lesson is checked against Microsoft Learn; agentic lessons carry a "last verified" date.
- **Content invisible to search engines** (the reference site is a JS-only SPA — a plain fetch sees only its title). Lesson text must be in the static HTML.
- **Cookie banner.** Analytics must be cookieless.

## Approaches considered

| | Approach | Trade-off |
|---|---|---|
| **A (chosen)** | **Astro static site + React islands** for interactive lesson players; lesson text in MDX | Every lesson a static, indexable page; fast; reuses Daniel's React/TS skills; authoring close to blogging. Cost: Astro is new to the stack. |
| B | Vite + React SPA (like the reference and the Lens UIs) | Most familiar; but search engines see an empty shell unless we add prerendering, and lesson content ends up in code. |
| C | Docs framework (Starlight / Docusaurus) + widgets | Fastest; but looks like every docs site, losing the distinctive feel that makes the reference shareable. |

Daniel picked A.

## The experience

Modelled on the reference's structure, with our own visual identity.

### Global shell
- **Top bar:** site name/logo · tabs (**Learn**, **Cheatsheets** in v1) · search (`⌘K`) · theme toggle (light/dark) · "by Daniel Jonathan" credit linking to dev.to.
- **Left sidebar (Learn):** modules as collapsible groups with `done/total` counters; current lesson highlighted; **Progress `x / N`** at the bottom.
- **Home page:** hook line, module grid, "New: Agentic Logic Apps" feature, start button.

### Lesson page (three panes)
```
┌ sidebar ─┬──────────── stage ────────────────┬──── step panel ─────┐
│ modules  │ 04. Reliability / Lesson 1 of 4   │ STEP 3 / 10  [PROBLEM]
│  ...     │ Retry Policies   [9 min][Inter.][10 steps]               │
│          │ ┌ state chips ─────────┐ [Replay][Pause]│ Retries pile up  │
│          │ │ attempts: 3  backoff: exp  status: … │ narrative text…  │
│          │ │                                      │ ┌ WATCH OUT ──┐  │
│          │ │   animated diagram of the run        │ │ …           │  │
│          │ │                                      │ └─────────────┘  │
│          │ └ legend ──────────────────────────────┘ [Back] [Next: …] │
│          │ IN THIS LESSON  ①──②──③──…──⑩ Recap   │ YOU'LL LEARN ☐☐☐ │
└──────────┴───────────────────────────────────┴──────────────────────┘
```
- **Stage:** animated SVG diagram for the current step; **state chips** above it showing live values (e.g. `run status: Running`, `attempt: 2 of 4`, `tokens used: 1.2k`); legend below; Replay / Pause.
- **Step panel:** step number, optional tag (`PROBLEM`, `FIX`, `TIP`), title, narrative (2–4 short paragraphs), optional callout (`WATCH OUT`, `IN PRODUCTION`), Back / Next buttons labelled with the next step's name, keyboard hints (`←/→` step, `R` replay, `Space` pause).
- **Step timeline:** numbered, named steps along the bottom; clickable.
- **You'll learn:** checklist of outcomes for the lesson.
- **Recap (last step):** summary bullets, links to related dev.to articles, "Follow Daniel on dev.to".
- **Mobile:** panes stack — stage on top, step panel below, sidebar in a drawer. Must be usable at phone width.

### Cheatsheets tab
One page per module: dense reference tables (limits, retry defaults, expression functions, Consumption vs Standard differences, etc.). Highly linkable; good search landing pages.

### Visual identity
Own identity — not Lens Suite branding, and not the reference's palette or isometric art. Diagram vocabulary is Logic-Apps-specific: trigger, action, connector, scope, condition/loop, Service Bus queue/topic, storage, App Insights, Key Vault, LLM/agent, MCP server, human-approval. Exact art style (flat, isometric, schematic) is the builder's call within that constraint — propose two options as mockups before building all scenes.

## Curriculum

Twelve modules (Develop & test is 04; Logic Apps Automation (preview) is 10; Advanced integration patterns 11; Whole systems 12). The course is Standard-first: Microsoft's direction is Standard, and a Standard project is built the same way whatever the hosting; Consumption is covered only as a short aside. Lessons teach the patterns without naming Lens Suite or LogicAppsHub.

1. **Foundations** — Where Logic Apps run (Standard-first: build once, host on WS plan / ASE v3 / hybrid; Consumption as a short aside) · Follow an order through a run (trigger → actions → run history) · Stateful vs stateless
1b. **Hosting & runtime** (added by Daniel; Standard deep dives) — Standard on Workflow Service Plans (WS1/WS2/WS3) · Standard on App Service Environment v3 (isolated network) · Hybrid / on-premises deployment (Arc-enabled Kubernetes, SQL storage) · The storage account behind Standard (run state, queues, run history; why it limits throughput; scale units with multiple storage accounts) · Standard is built on the Azure Functions runtime (host.json, app settings, local dev with Functions Core Tools, built-in connectors as Functions extensions, custom .NET code). Source material: Daniel's HybridLADeployment and LogicAppScaleUnits repos.
2. **Building flows** — Connectors (managed vs built-in) · Expressions · Control flow (conditions, loops, scopes) · Parallel branches
3. **Integration patterns** — Service Bus & queues · Batching · Splitting arrays into separate runs (debatching) · Request/response vs async polling
4. **Reliability** — Retry policies · Timeouts · Run-after & error scopes · Idempotency · Resubmitting runs
5. **Operating at scale** — Throttling & limits · Monitoring with App Insights / Log Analytics · Alerting · "A run failed at 3am — now what?"
6. **Security & delivery** — Managed identity · Key Vault · Private endpoints / VNet · CI/CD with Bicep/ARM
7. **Agentic Logic Apps** — Agent workflows (agent loop in Standard) vs fixed workflows · Logic Apps as tools / as an MCP server · Agents that operate Logic Apps (run-history triage, AI incident investigation) · Guardrails (human approval, read-only by default, token/cost limits, tracing) · Whole system: failed run → agent investigates → human approves resubmit
8. **Whole systems** — Order-processing pipeline · EDI / B2B flow · Event-driven integration hub

Agentic is featured on the home page as "New". Order of modules 7 and 8 may swap; agentic builds on 4–5.

## Scope: lean first release

Ship small, measure, then add lessons in weekly increments. No fixed deadline.

**Release 1 (launch):**
- Home page: course pitch, module grid.
- Lesson player and four lessons:
  1. Follow an order through a run (Foundations)
  2. Where Logic Apps run (Foundations)
  3. Resubmitting runs & failure handling (Reliability)
  4. Agentic triage: failed run → agent investigates → human approves (Agentic)
- All other lessons shown in the sidebar as "coming soon".
- Analytics events and UTM tracking live from day one.

**After launch (in order):** remaining Foundations + Hosting lessons → Reliability → Agentic → cheatsheets → search → per-lesson OG images → other modules. Practice and Design Lab are later candidates, decided from data.

## Decisions after builder review (2026-11-24)

- **Content authoring:** Claude drafts each lesson (narrative + `scene.ts`) from Daniel's dev.to articles and repos and checks it against Microsoft Learn; **Daniel reviews and signs off each lesson** before it ships. `lastVerified` is set at sign-off. *(Claude's recommendation; Daniel opted out of further questions.)*
- **Deadline:** none fixed; lean first release above.
- **No product promotion (Daniel, 2026-11-24):** no Lens Suite / LogicAppsHub sections, CTAs, capability claims or GitHub product links in v1. Lessons may teach patterns (e.g. agentic triage of failed runs) without naming the products. Visual identity is the site's own, not Lens branding.
- **Analytics account:** built against config; stubbed until Daniel creates a Plausible site. *(Claude's call.)*
- **Domain:** configurable; launch may use the temporary `*.azurestaticapps.net` URL, but dev.to articles get UTM links only once the final domain is live, so attribution isn't lost. *(Claude's call.)*

## Lesson authoring model

- One folder per lesson: `src/content/lessons/<module>/<slug>/`
  - `index.mdx` — frontmatter (`title`, `module`, `order`, `minutes`, `level`, `summary`, `youWillLearn[]`, `relatedArticles[]`, `cta: boolean`, `lastVerified`) and **one MDX section per step** (step id, name, tag, narrative, callout).
  - `scene.ts` — the diagram: nodes, edges, and for each step id the scene state (visible nodes, highlighted edges, animated tokens/messages, chip values).
- A shared **`LessonPlayer`** React island renders stage + step panel + timeline from those two inputs; it owns playback, keyboard shortcuts, URL sync (`/lessons/<slug>/#3` or similar), and progress.
- Step narrative is rendered into the static HTML (all steps present, player shows one at a time) so search engines and no-JS readers get the full text.
- Adding a lesson must not require touching the player.

## Progress

`localStorage`: lessons started, last step reached, completed. Sidebar counters and Progress `x / N` read from it. All access wrapped so the site works if storage is blocked.

## Calls to action

- **No email signup in v1** (Daniel, 2026-11-24): no provider account, consent flow or data-controller page needed.
- **dev.to** — "Follow Daniel on dev.to" on the recap step and in the footer.
- No product promotion, no popups, no gated content.

## Measurement

Cookieless analytics (Plausible, EU-hosted). Custom events: `lesson_start`, `step_reached` (lesson, step), `lesson_complete`, `devto_click`. Inbound dev.to links carry UTM params (`utm_source=devto&utm_campaign=<article-slug>`). A short README section explains how to read the funnel.

## SEO & sharing

Static page per lesson and cheatsheet; per-page title/description; generated Open Graph image per lesson (lesson title + module + a frame of its diagram); sitemap; canonical URLs; clean slugs.

## Tech & hosting

- Astro (latest stable) + React islands + TypeScript; MDX content collections.
- Animation: SVG driven by React state; a small motion library (e.g. Motion) is acceptable. Respect `prefers-reduced-motion` (steps jump instead of animate).
- Light/dark themes via CSS custom properties.
- Hosting: **Azure Static Web Apps** (free tier) — fits the Azure-expert positioning; GitHub Actions deploy on push to `main`. Custom domain TBD.
- Repo: `~/Workspace/LearnDJ/logicapps-course`.

## Content accuracy

Each lesson is checked against Microsoft Learn before publishing; `lastVerified` shown on agentic lessons. Source material: Daniel's dev.to articles and his Logic Apps repos in `~/Workspace/LearnDJ` (e.g. LABlog, LogicAppScaleUnits, HybridLADeployment, LAMCP).

## Left to the builder

- Diagram art style (within "own identity"); show two mockups first.
- Motion library choice, search implementation (e.g. Pagefind), OG image generation method.
- Exact URL scheme for steps.
