# Logic Apps Course — Release 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the lean first release of a free, interactive Logic Apps course: home page, a reusable animated lesson player, and four lessons. No product promotion, no email signup.

**Architecture:** Astro static site. Lesson text lives in MDX (one `<Step>` block per step, all rendered into static HTML); each lesson's diagram is a typed `scene.ts`. A single React island, `LessonPlayer`, turns the static steps + scene into the interactive three-pane player. Progress lives in `localStorage`; analytics is cookieless Plausible; all external accounts (analytics, domain, dev.to link) are optional config that degrades gracefully when unset.

**Tech Stack:** Astro 5 (latest stable), `@astrojs/react`, `@astrojs/mdx`, `@astrojs/sitemap`, React 19, TypeScript (strict), `motion` for SVG animation, Vitest + @testing-library/react (unit/component), Playwright (e2e), Azure Static Web Apps.

**Spec:** `docs/superpowers/specs/2026-11-24-logicapps-course-design.md`

**Repo:** `~/Workspace/LearnDJ/logicapps-course` (git initialised, no commits, no remote).

## Global Constraints

- Own visual identity (own oklch palette in `src/styles/tokens.css`). Not Lens Suite branding; must not reuse designed-to-scale's colours, beige isometric art, typography pairing, logo treatment or wording.
- Lesson step text must be present in the static HTML (readable with JS disabled).
- No cookies, no cookie banner. Analytics: Plausible only, custom events exactly: `lesson_start`, `step_reached`, `lesson_complete`, `devto_click`.
- No email signup in v1 (Daniel, 2026-11-24). The only outward link is "Follow Daniel on dev.to" (recap step, footer). No popups, no gated content.
- No mention of Lens Suite, LogicAppsHub or any product anywhere on the site (Daniel, 2026-11-24).
- Every `localStorage` access wrapped in try/catch; site fully works when storage throws.
- `prefers-reduced-motion: reduce` → steps change without animation.
- Usable at 375px width: no horizontal page scroll; panes stack (stage, step panel; sidebar in a drawer).
- English only. Light + dark themes.
- A lesson with `reviewStatus: 'draft'` is never published in a production build (shown as "coming soon"); only Daniel sets `approved`.
- Keyboard: `←`/`→` step, `R` replay, `Space` pause/play.

## Review Focus

- Step hash out of range or garbage (`#99`, `#0`, `#abc`) → player opens on the nearest valid step, never crashes. (Task 6)
- `localStorage` throws or holds corrupt JSON → progress reads as empty, site works. (Task 3)
- JS disabled → every step's title and narrative visible on the lesson page. (Task 8)
- Reduced-motion users → no transition animation, step content still changes. (Task 5)
- Draft lesson in a production build → no page generated, sidebar shows "coming soon". (Task 2, Task 8)

---

### Task 1: Scaffold, site config, CI-ready test setup

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `playwright.config.ts`, `.gitignore`, `.env.example`
- Create: `src/config/site.ts`
- Test: `src/config/site.test.ts`

**Interfaces:**
- Produces: `getSiteConfig(env?: Record<string, string | undefined>): SiteConfig` where
  ```ts
  interface SiteConfig {
    siteUrl: string;                 // PUBLIC_SITE_URL, default 'http://localhost:4321'
    devtoUrl: string | null;         // PUBLIC_DEVTO_URL
    plausibleDomain: string | null;  // PUBLIC_PLAUSIBLE_DOMAIN
    contactEmail: string | null;     // PUBLIC_CONTACT_EMAIL
  }
  ```
  `siteConfig` = `getSiteConfig(import.meta.env)` exported from the same file.

- [ ] **Step 1:** `npm create astro@latest . -- --template minimal --typescript strict --no-git --install`, then `npx astro add react mdx sitemap --yes`, `npm i motion`, `npm i -D vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test`, `npx playwright install chromium`. Scripts: `test` = `vitest run`, `e2e` = `playwright test`, `check` = `astro check`.
- [ ] **Step 2: Failing test** `site.test.ts`:
  - empty env → `plausibleDomain`, `devtoUrl`, `contactEmail` all `null`; `siteUrl === 'http://localhost:4321'`
  - `PUBLIC_DEVTO_URL='https://dev.to/x'` → `devtoUrl === 'https://dev.to/x'`
  - empty-string values treated as unset
- [ ] **Step 3:** Run `npm test` → FAIL (module missing).
- [ ] **Step 4:** Implement `getSiteConfig`. Set `site` in `astro.config.mjs` from `PUBLIC_SITE_URL`. `.env.example` lists every variable with a comment.
- [ ] **Step 5:** `npm test` PASS; `npm run build` succeeds.
- [ ] **Step 6:** Commit (include the existing `docs/`): `git add -A && git commit -m "chore: scaffold Astro site with config and test setup"`.

### Task 2: Content model — modules, lesson schema, scene types

**Files:**
- Create: `src/content.config.ts`, `src/data/modules.ts`, `src/lessons/scene-types.ts`, `src/lib/catalog.ts`
- Test: `src/lib/catalog.test.ts`

**Interfaces:**
- Produces:
  ```ts
  // scene-types.ts
  type NodeKind = 'trigger' | 'action' | 'connector-builtin' | 'connector-managed' | 'scope' | 'condition'
    | 'servicebus' | 'storage' | 'appinsights' | 'keyvault' | 'llm-agent' | 'mcp-server' | 'human'
    | 'user' | 'hosting-plan';
  interface SceneNode { id: string; kind: NodeKind; label: string; x: number; y: number; sublabel?: string }
  interface SceneEdge { id: string; from: string; to: string; style?: 'solid' | 'dashed' }
  interface Token { id: string; edge: string; tone: 'ok' | 'fail' | 'info' }   // animated message along an edge
  interface StepState {
    visible: string[]; highlight?: string[]; failed?: string[]; tokens?: Token[];
    chips: { label: string; value: string; tone?: 'ok' | 'warn' | 'fail' | 'neutral' }[];
  }
  interface Scene { viewBox: [number, number]; nodes: SceneNode[]; edges: SceneEdge[]; steps: Record<string, StepState>; legend: { tone: Token['tone'] | 'failed'; label: string }[] }
  ```
  - Lesson frontmatter (zod, collection `lessons`, glob `src/content/lessons/**/index.mdx`): `title`, `module` (module id), `order: number`, `minutes: number`, `level: 'Beginner'|'Intermediate'|'Advanced'`, `summary`, `youWillLearn: string[]` (min 1), `relatedArticles: {title, url}[]` (default `[]`), `reviewStatus: 'draft'|'approved'` (default `'draft'`), `lastVerified?: string` (ISO date; required when `approved`).
  - `modules.ts`: `MODULES: { id: string; number: string; title: string; lessons: { slug: string; title: string }[] }[]` — the 9 modules and every lesson title from the spec curriculum (Hosting & runtime is number `02`; renumber the rest `03`–`09`). Hosting lessons: "Hosting options side by side", "Consumption", "Standard on Workflow Service Plans", "Standard on App Service Environment v3", "Hybrid & on-premises", "The storage account behind Standard", "Built on Azure Functions".
  - `catalog.ts`: `buildCatalog(lessons: LessonEntry[], opts: { includeDrafts: boolean }): CatalogModule[]` where each catalog lesson is `{ slug, title, status: 'published' | 'coming-soon', href: string | null }`. `includeDrafts = import.meta.env.DEV`.

- [ ] **Step 1: Failing tests** `catalog.test.ts`:
  - lesson in `MODULES` with no content entry → `status: 'coming-soon'`, `href: null`
  - entry with `reviewStatus: 'draft'`, `includeDrafts: false` → coming-soon
  - same entry, `includeDrafts: true` → `published`, `href: '/lessons/<slug>/'`
  - `approved` entry → published regardless of flag
  - content entry whose slug is not in `MODULES` → `buildCatalog` throws naming the slug
  - schema: `approved` without `lastVerified` fails `lessonSchema.safeParse`
- [ ] **Step 2:** `npm test` → FAIL.
- [ ] **Step 3:** Implement the three files; export `lessonSchema` from `content.config.ts` for the test.
- [ ] **Step 4:** `npm test` PASS.
- [ ] **Step 5:** Commit `feat: content model, module catalog and scene types`.

### Task 3: Progress store

**Files:**
- Create: `src/lib/progress.ts`
- Test: `src/lib/progress.test.ts`

**Interfaces:**
- Produces (storage key `lac:progress:v1`, value `Record<slug, { lastStep: number; completed: boolean }>`):
  `getProgress(): ProgressMap` · `getLesson(slug): { lastStep: number; completed: boolean } | null` · `markStepReached(slug, stepIndex: number): void` (keeps the max) · `markComplete(slug): void` · `completedCount(slugs: string[]): number` · `onProgressChange(cb): () => void` (window `lac:progress` CustomEvent).
  Optional `storage?: Storage` param on each, defaulting to `window.localStorage`, for tests.

- [ ] **Step 1: Failing tests:** round-trip; `markStepReached(s, 2)` then `(s, 1)` keeps 2; storage whose `getItem`/`setItem` throw → `getProgress()` returns `{}` and writes do not throw; stored value `"{not json"` → `{}`; `completedCount` counts only listed slugs.
- [ ] **Step 2:** FAIL → **Step 3:** implement → **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: localStorage progress store`.

### Task 4: Analytics wrapper

**Files:**
- Create: `src/lib/analytics.ts`, `src/components/Analytics.astro`
- Test: `src/lib/analytics.test.ts`

**Interfaces:**
- Produces: `type AnalyticsEvent = 'lesson_start'|'step_reached'|'lesson_complete'|'devto_click'`; `track(event: AnalyticsEvent, props?: Record<string, string | number>): void` — calls `window.plausible(event, { props })` if present, otherwise no-op. `Analytics.astro` injects `https://plausible.io/js/script.tagged-events.js` with `data-domain={plausibleDomain}` only when configured.

- [ ] **Step 1: Failing tests:** no `window.plausible` → no throw; with a spy → called with `('step_reached', { props: { lesson: 'x', step: 3 } })`; spy that throws → `track` swallows.
- [ ] **Step 2–4:** FAIL → implement → PASS.
- [ ] **Step 5:** Commit `feat: cookieless analytics wrapper`.

### Task 5: Theme tokens and diagram Stage

**Files:**
- Create: `src/styles/tokens.css`, `src/styles/global.css`, `src/components/ThemeToggle.tsx`, `src/components/stage/Stage.tsx`, `src/components/stage/NodeShape.tsx`, `src/components/stage/StateChips.tsx`, `src/components/stage/Legend.tsx`
- Test: `src/components/stage/Stage.test.tsx`, `src/components/ThemeToggle.test.tsx`

**Interfaces:**
- Consumes: `Scene`, `StepState` (Task 2).
- Produces: `<Stage scene: Scene; stepId: string; playing: boolean; reducedMotion: boolean />`; `<StateChips chips: StepState['chips'] />`; `<ThemeToggle />` (sets `data-theme` on `<html>`, persists `lac:theme`, defaults to `prefers-color-scheme`).
- `tokens.css`: define the site's own palette as oklch custom properties (bg, surface, fg, muted, border, accent, plus ok/warn/fail/info/agent families with `-bg`/`-border` variants) in `:root`; add dark values under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {…} }` and `:root[data-theme="dark"] {…}`. Diagram node fills map kind → token family (trigger/action info, connectors ok, failures fail, agent/LLM agent, storage/hosting neutral).

- [ ] **Step 1: Failing tests (Stage):** renders one `[data-node-id]` per id in `steps[stepId].visible` and no others; nodes in `failed` carry `data-state="failed"`; one `[data-token-id]` per token; with `reducedMotion` no element has a `transition`/motion animate prop (assert `data-animated="false"` on tokens); unknown `stepId` renders an empty stage without throwing.
- [ ] **Step 2: Failing tests (ThemeToggle):** click toggles `data-theme`; `localStorage.setItem` throwing → still toggles.
- [ ] **Step 3:** FAIL → **Step 4:** implement. Node art: flat, rounded schematic shapes with a small icon per kind (own style). Tokens travel along edges with `motion` when animated.
- [ ] **Step 5:** PASS. **Step 6 (visual check):** create a throwaway `src/pages/dev/stage.astro` (dev-only, excluded from build via `import.meta.env.DEV` guard) rendering every `NodeKind` in light and dark; take Playwright screenshots of both themes and show them to Daniel as the art-style mockup before Task 9 starts. If he prefers an alternative, adjust `NodeShape` only.
- [ ] **Step 7:** Commit `feat: theme tokens and animated diagram stage`.

### Task 6: LessonPlayer island

**Files:**
- Create: `src/components/player/LessonPlayer.tsx`, `src/components/player/StepPanel.tsx`, `src/components/player/Timeline.tsx`, `src/components/player/useStepNav.ts`
- Test: `src/components/player/LessonPlayer.test.tsx`, `src/components/player/useStepNav.test.ts`

**Interfaces:**
- Consumes: `Stage` (Task 5), progress (Task 3), `track` (Task 4), `Scene` (Task 2).
- Produces: `<LessonPlayer slug: string; scene: Scene; steps: PlayerStep[]; youWillLearn: string[] />` where `PlayerStep = { id: string; name: string; tag?: 'PROBLEM'|'FIX'|'TIP'|'RECAP'; html: string }` (narrative HTML taken from the static `<Step>` blocks — see Task 8). `useStepNav(count: number, initialHash: string): { index; next(); back(); goTo(i) }`.
- Behaviour: hash `#<1-based step>` synced via `history.replaceState`; parse rule: integer → clamp to `[1, count]`; anything else → 1. Autoplay of in-step animation; `Replay` restarts the current step's animation; `Pause` freezes it. Keys `←`/`→`/`R`/`Space` ignored when focus is in an input. On mount: `track('lesson_start')`; each new step: `markStepReached` + `track('step_reached', {lesson, step})`; reaching the last step: `markComplete` + `track('lesson_complete')`. Next button label `Next: <next step name>`; disabled Back on step 1.

- [ ] **Step 1: Failing tests (`useStepNav`):** `'#3'`, count 5 → index 2; `'#99'` → 4; `'#0'` → 0; `'#abc'` → 0; `''` → 0; `next()` at last stays last.
- [ ] **Step 2: Failing tests (player):** `→` key advances and the step panel shows step 2's name; `Next` label reads `Next: <name of step 2>`; reaching last step calls `markComplete` (spy) and `track('lesson_complete', …)`; `Space` toggles `aria-pressed` on Pause; key presses while an `<input>` is focused do nothing; timeline buttons jump to their step.
- [ ] **Step 3:** FAIL → **Step 4:** implement → **Step 5:** PASS.
- [ ] **Step 6:** Commit `feat: interactive lesson player`.

### Task 7: Site shell — layout, top bar, sidebar, mobile drawer

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/components/TopBar.astro`, `src/components/Sidebar.tsx`, `src/components/Footer.astro`
- Test: `e2e/shell.spec.ts`

**Interfaces:**
- Consumes: `buildCatalog` (Task 2), progress (Task 3), `ThemeToggle` (Task 5), `siteConfig` (Task 1), `Analytics.astro` (Task 4).
- Produces: `<BaseLayout title: string; description: string; ogImage?: string; activeSlug?: string>` with slots `default`. Sidebar: modules as collapsible groups `NN. Title  done/total`, current lesson highlighted, coming-soon lessons dimmed with a "Soon" tag and not links, `Progress x / N` (N = published lessons) at the bottom, updates live via `onProgressChange`. Top bar: site name (working title "Logic Apps — an interactive course"), tabs `Learn` (active) and `Cheatsheets` (rendered disabled with "Soon"), theme toggle, credit "by Daniel Jonathan" (links to `devtoUrl` if set, fires `track('devto_click')`). Footer: "More from Daniel on dev.to" link only if `devtoUrl`, link to `/privacy/`. Below 900px: sidebar becomes a drawer behind a menu button.

- [ ] **Step 1: Failing e2e** (`npm run build && npm run preview` via Playwright `webServer`): home loads; sidebar lists all 9 module headings; a coming-soon lesson is not a link; at viewport 375×800 `document.documentElement.scrollWidth <= 375` and the menu button opens the drawer; theme toggle switches `data-theme`.
- [ ] **Step 2:** FAIL → **Step 3:** implement → **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: site shell with sidebar and mobile drawer`.

### Task 8: Lesson page route, Step component, recap links, SEO

**Files:**
- Create: `src/pages/lessons/[slug].astro`, `src/components/mdx/Step.astro`, `src/components/RecapLinks.tsx`, `src/pages/privacy.astro`, `src/pages/robots.txt.ts`, `public/og-default.png`
- Create (fixture lesson for tests): `src/content/lessons/_fixture/sample/index.mdx`, `scene.ts` — `reviewStatus: 'draft'`, slug `sample`, registered in `MODULES` only when `import.meta.env.DEV`
- Test: `e2e/lesson.spec.ts`, `src/components/RecapLinks.test.tsx`

**Interfaces:**
- Consumes: `LessonPlayer` (Task 6), `BaseLayout` (Task 7), catalog (Task 2), `siteConfig`, `track`.
- `Step.astro` props `{ id: string; name: string; tag?: PlayerStep['tag'] }`; renders `<section data-step id={'step-'+id}>` with `<h2>` name and slotted narrative, all visible in static HTML. The page script reads these sections into `PlayerStep[]` and hydrates `<LessonPlayer client:load>`; once hydrated, the static sections are visually hidden (kept in DOM).
- `getStaticPaths` only yields catalog lessons with `status: 'published'` (so drafts are absent in production).
- Recap: on the last step of every lesson, render `<RecapLinks />`: related dev.to articles (from `relatedArticles`) and "Follow Daniel on dev.to" (only if `devtoUrl`; fires `devto_click`). Renders nothing extra when both are empty.
- `privacy.astro`: short note — Plausible analytics, no cookies, no personal data collected; contact via `PUBLIC_CONTACT_EMAIL` if set, otherwise the dev.to link.
- SEO: `<title>{lesson} · Logic Apps course</title>`, meta description = `summary`, canonical `siteUrl + path`, OG tags with `og-default.png`; sitemap via integration; `robots.txt` pointing at sitemap.

- [ ] **Step 1: Failing tests (RecapLinks):** lists each related article as a link; dev.to follow link present only when `devtoUrl` set; nothing rendered when no articles and no `devtoUrl`.
- [ ] **Step 2: Failing e2e** (dev server, fixture lesson): with `javaScriptEnabled: false` every `[data-step] h2` and its narrative are visible; with JS, `/lessons/sample/#99` opens on the last step; `→` moves to the next step and URL hash updates; the recap links appear only on the recap step; page has a `<link rel="canonical">`.
- [ ] **Step 3: Failing e2e** (production build): `/lessons/sample/` returns 404 and the sidebar shows it as coming soon (fixture is draft).
- [ ] **Step 4:** FAIL → **Step 5:** implement → **Step 6:** PASS.
- [ ] **Step 7:** Commit `feat: lesson pages, recap links, privacy and SEO`.

### Task 9: Home page

**Files:**
- Create: `src/pages/index.astro`, `src/components/home/Hero.astro`, `src/components/home/ModuleGrid.astro`
- Test: `e2e/home.spec.ts`

**Interfaces:**
- Consumes: catalog, `siteConfig`, `BaseLayout`.
- Content: Hero — one-line hook (e.g. "See how Logic Apps really run — one animated step at a time.") + "Start the course" button to the first published lesson + "New: Agentic Logic Apps" badge linking to the agentic module. ModuleGrid — 9 cards with lesson counts and "x lessons live".  Short "About" line: who Daniel is (Azure integration specialist, dev.to author) with dev.to link if configured.

- [ ] **Step 1: Failing e2e:** home shows hero heading, "Start the course" links to a `/lessons/` URL, no `<form>` element, page text contains neither "LogicAppsHub" nor "Lens", no horizontal scroll at 375px.
- [ ] **Step 2:** FAIL → **Step 3:** implement → **Step 4:** PASS.
- [ ] **Step 5:** Commit `feat: home page`.

### Tasks 10–13: The four launch lessons (one task each)

Same procedure for each; each ends `reviewStatus: 'draft'` for Daniel's sign-off.

| Task | Slug | Module | Source material |
|---|---|---|---|
| 10 | `how-a-run-travels` | 01 Foundations | Microsoft Learn: Logic Apps overview, run history; `~/Workspace/LearnDJ/LABlog` |
| 11 | `hosting-options` | 02 Hosting & runtime | Learn: single-tenant vs multi-tenant, hybrid deployment, ASEv3; `HybridLADeployment`, `LogicAppScaleUnits` |
| 12 | `resubmitting-runs` | 05 Reliability | Learn: retry policies, run-after, resubmit; `LABlog` |
| 13 | `agentic-triage` | 08 Agentic Logic Apps | Learn: agent workflows in Standard, Logic Apps as MCP server; `LAMCP` (teach the pattern; do not name any product) |

**Files (per lesson):** `src/content/lessons/<module-id>/<slug>/index.mdx`, `.../scene.ts`. Test: `src/content/lessons.test.ts` (created in Task 10, extended per lesson).

- [ ] **Step 1: Failing content test** for the lesson: frontmatter parses; 8–12 steps; last step tag `RECAP`; every `<Step id>` has a matching key in `scene.steps` and vice versa; every id in `visible`/`highlight`/`failed`/token `edge` exists in `nodes`/`edges`; `youWillLearn` length 3–5; narrative contains neither "LogicAppsHub" nor "Lens".
- [ ] **Step 2:** FAIL.
- [ ] **Step 3: Draft** the narrative: story-led opening step tagged `PROBLEM` (a concrete integration pain), 2–4 short paragraphs per step, at most one callout per step, plain language. Draft the scene: node positions on a `[900, 560]` viewBox, chips that change meaningfully per step.
- [ ] **Step 4: Fact check** every technical claim (limits, defaults, plan capabilities, names) against current Microsoft Learn pages; add each URL used to a `sources` comment block at the bottom of the MDX (not rendered). Any claim not confirmable → remove it.
- [ ] **Step 5:** `npm test` PASS; open the lesson in `npm run dev`, step through in light and dark, and screenshot steps 1, middle, recap at desktop and 375px.
- [ ] **Step 6:** Commit `content: draft lesson <slug>`; list the lesson in the hand-off for Daniel's review. (Daniel approving = set `reviewStatus: 'approved'`, `lastVerified: <date>` in a separate commit.)

### Task 14: Deployment and README

**Files:**
- Create: `staticwebapp.config.json`, `.github/workflows/azure-static-web-apps.yml`, `README.md`

**Interfaces:**
- `staticwebapp.config.json`: `navigationFallback` off (static pages), `responseOverrides` 404 → `/404.html`, cache headers for `/_astro/*` immutable, security headers (CSP allowing `plausible.io`).
- Workflow: on push to `main` and PRs: `npm ci`, `npm test`, `npx playwright install --with-deps chromium`, `npm run e2e`, `npm run build`, then `Azure/static-web-apps-deploy@v1` with `app_location: "/"`, `output_location: "dist"`, `skip_app_build: true`, token from secret `AZURE_STATIC_WEB_APPS_API_TOKEN`; `PUBLIC_*` values from repo variables.
- README: what this is; local dev; every env var (from `.env.example`) and what happens when unset; how a lesson is authored (MDX `<Step>` + `scene.ts`) and the draft → approved sign-off rule; how to read the funnel in Plausible (events, `utm_source=devto&utm_campaign=<article-slug>`, rule: add dev.to links only once the final domain is live); Daniel's launch checklist: create GitHub repo + SWA resource, create Plausible site, choose domain, set `PUBLIC_DEVTO_URL` / `PUBLIC_CONTACT_EMAIL`, approve lessons.

- [ ] **Step 1:** Add `src/pages/404.astro` and the three files.
- [ ] **Step 2:** Verify: `npm test && npm run e2e && npm run build` all pass; `npx @azure/static-web-apps-cli start dist` serves home, a published lesson and a 404.
- [ ] **Step 3:** Commit `chore: Azure Static Web Apps deployment and README`.
