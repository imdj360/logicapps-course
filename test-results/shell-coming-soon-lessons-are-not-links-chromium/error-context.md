# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: shell.spec.ts >> coming-soon lessons are not links
- Location: e2e/shell.spec.ts:16:1

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('#sidebar').getByRole('link', { name: /EDI \/ B2B flow/ })
Expected: 0
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" locator('#sidebar').getByRole('link', { name: /EDI \/ B2B flow/ }) with timeout 5000ms
  - waiting for locator('#sidebar').getByRole('link', { name: /EDI \/ B2B flow/ })
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - link "Logic Apps an interactive course" [ref=e3] [cursor=pointer]:
      - /url: /
    - navigation "Sections" [ref=e9]:
      - link "Learn" [ref=e10] [cursor=pointer]:
        - /url: /
      - generic [ref=e11]:
        - text: Cheatsheets
        - generic [ref=e12]: Soon
    - generic [ref=e13]:
      - generic [ref=e14]: by Daniel Jonathan
      - button "Switch to dark theme" [ref=e16] [cursor=pointer]
  - generic [ref=e19]:
    - complementary "Course" [ref=e20]:
      - generic [ref=e21]:
        - generic [ref=e22]:
          - text: Course
          - generic [ref=e23]: 61 lessons
        - list [ref=e24]:
          - listitem [ref=e25]:
            - button "01 Foundations 0/4" [ref=e26] [cursor=pointer]:
              - generic [ref=e29]: "01"
              - text: Foundations
              - generic [ref=e30]: 0/4
          - listitem [ref=e31]:
            - button "02 Hosting & runtime 0/5" [ref=e32] [cursor=pointer]:
              - generic [ref=e35]: "02"
              - text: Hosting & runtime
              - generic [ref=e36]: 0/5
          - listitem [ref=e37]:
            - button "03 Building flows 0/6" [ref=e38] [cursor=pointer]:
              - generic [ref=e41]: "03"
              - text: Building flows
              - generic [ref=e42]: 0/6
          - listitem [ref=e43]:
            - button "04 Develop & test 0/4" [ref=e44] [cursor=pointer]:
              - generic [ref=e47]: "04"
              - text: Develop & test
              - generic [ref=e48]: 0/4
          - listitem [ref=e49]:
            - button "05 Integration patterns 0/6" [ref=e50] [cursor=pointer]:
              - generic [ref=e53]: "05"
              - text: Integration patterns
              - generic [ref=e54]: 0/6
          - listitem [ref=e55]:
            - button "06 Reliability 0/5" [ref=e56] [cursor=pointer]:
              - generic [ref=e59]: "06"
              - text: Reliability
              - generic [ref=e60]: 0/5
          - listitem [ref=e61]:
            - button "07 Operating at scale 0/4" [ref=e62] [cursor=pointer]:
              - generic [ref=e65]: "07"
              - text: Operating at scale
              - generic [ref=e66]: 0/4
          - listitem [ref=e67]:
            - button "08 Security & delivery 0/6" [ref=e68] [cursor=pointer]:
              - generic [ref=e71]: "08"
              - text: Security & delivery
              - generic [ref=e72]: 0/6
          - listitem [ref=e73]:
            - button "09 Agentic Logic Apps 0/5" [ref=e74] [cursor=pointer]:
              - generic [ref=e77]: "09"
              - text: Agentic Logic Apps
              - generic [ref=e78]: 0/5
          - listitem [ref=e79]:
            - button "10 Logic Apps Automation (preview) 0/3" [ref=e80] [cursor=pointer]:
              - generic [ref=e83]: "10"
              - text: Logic Apps Automation (preview)
              - generic [ref=e84]: 0/3
          - listitem [ref=e85]:
            - button "11 Advanced integration patterns 0/8" [ref=e86] [cursor=pointer]:
              - generic [ref=e89]: "11"
              - text: Advanced integration patterns
              - generic [ref=e90]: 0/8
          - listitem [ref=e91]:
            - button "12 Whole systems 0/3" [expanded] [active] [ref=e92] [cursor=pointer]:
              - generic [ref=e95]: "12"
              - text: Whole systems
              - generic [ref=e96]: 0/3
            - list [ref=e97]:
              - listitem [ref=e98]:
                - link "Order-processing pipeline" [ref=e99] [cursor=pointer]:
                  - /url: /lessons/order-processing/
              - listitem [ref=e101]:
                - link "EDI / B2B flow" [ref=e102] [cursor=pointer]:
                  - /url: /lessons/edi-b2b/
              - listitem [ref=e104]:
                - link "Event-driven integration hub" [ref=e105] [cursor=pointer]:
                  - /url: /lessons/integration-hub/
          - listitem [ref=e107]:
            - button "99 Test fixtures 0/1" [ref=e108] [cursor=pointer]:
              - generic [ref=e111]: "99"
              - text: Test fixtures
              - generic [ref=e112]: 0/1
        - generic [ref=e114]:
          - generic [ref=e115]: Progress
          - generic [ref=e116]: 0 / 60
    - generic [ref=e118]:
      - main [ref=e119]:
        - generic [ref=e120]:
          - generic [ref=e121]:
            - generic [ref=e122]:
              - paragraph [ref=e123]: Free · 12 modules · 59 lessons
              - heading "See how Logic Apps really run." [level=1] [ref=e124]
              - paragraph [ref=e125]: "Follow a run hop by hop: triggers, actions, retries, hosting plans and AI agents, animated one step at a time. Built for Azure integration developers who want to know what actually happens, not only which button to click."
              - generic [ref=e126]:
                - link "Start the course" [ref=e127] [cursor=pointer]:
                  - /url: /lessons/where-logic-apps-run/
                - link "NEW Agentic Logic Apps" [ref=e128] [cursor=pointer]:
                  - /url: "#module-agentic"
                  - generic [ref=e129]: NEW
                  - text: Agentic Logic Apps
            - generic [ref=e132]:
              - list "Current state" [ref=e133]:
                - listitem [ref=e134]:
                  - generic [ref=e135]: run status
                  - generic [ref=e136]: Running
                - listitem [ref=e137]:
                  - generic [ref=e138]: retries
                  - generic [ref=e139]: 0 of 4
              - img "Diagram for this step" [ref=e141]:
                - generic [ref=e142]: Message arrives
                - generic [ref=e147]: Parse order
                - generic [ref=e152]:
                  - generic [ref=e156]: Agent
                  - generic [ref=e157]: picks a tool
                - generic [ref=e158]: Orders queue
                - generic [ref=e163]: Approve
          - heading "The course" [level=2] [ref=e171]
          - list [ref=e172]:
            - listitem [ref=e173]:
              - generic [ref=e174]:
                - generic [ref=e175]:
                  - generic [ref=e176]: "01"
                  - generic [ref=e177]: 4 of 4 lessons live
                - heading "Foundations" [level=3] [ref=e178]
                - list [ref=e179]:
                  - listitem [ref=e180]:
                    - link "Where Logic Apps run" [ref=e181] [cursor=pointer]:
                      - /url: /lessons/where-logic-apps-run/
                  - listitem [ref=e182]:
                    - link "Follow an order through a run" [ref=e183] [cursor=pointer]:
                      - /url: /lessons/follow-an-order/
                  - listitem [ref=e184]:
                    - link "Stateful vs stateless" [ref=e185] [cursor=pointer]:
                      - /url: /lessons/stateful-vs-stateless/
                  - listitem [ref=e186]:
                    - link "Connections and connections.json" [ref=e187] [cursor=pointer]:
                      - /url: /lessons/connections-json/
            - listitem [ref=e188]:
              - generic [ref=e189]:
                - generic [ref=e190]:
                  - generic [ref=e191]: "02"
                  - generic [ref=e192]: 5 of 5 lessons live
                - heading "Hosting & runtime" [level=3] [ref=e193]
                - list [ref=e194]:
                  - listitem [ref=e195]:
                    - link "Standard on Workflow Service Plans" [ref=e196] [cursor=pointer]:
                      - /url: /lessons/workflow-service-plans/
                  - listitem [ref=e197]:
                    - link "Standard on App Service Environment v3" [ref=e198] [cursor=pointer]:
                      - /url: /lessons/app-service-environment/
                  - listitem [ref=e199]:
                    - link "Hybrid & on-premises" [ref=e200] [cursor=pointer]:
                      - /url: /lessons/hybrid-on-premises/
                  - listitem [ref=e201]:
                    - link "The storage account behind Standard" [ref=e202] [cursor=pointer]:
                      - /url: /lessons/storage-account/
                  - listitem [ref=e203]:
                    - link "Built on Azure Functions" [ref=e204] [cursor=pointer]:
                      - /url: /lessons/built-on-functions/
            - listitem [ref=e205]:
              - generic [ref=e206]:
                - generic [ref=e207]:
                  - generic [ref=e208]: "03"
                  - generic [ref=e209]: 6 of 6 lessons live
                - heading "Building flows" [level=3] [ref=e210]
                - list [ref=e211]:
                  - listitem [ref=e212]:
                    - 'link "Connectors: built-in vs managed" [ref=e213] [cursor=pointer]':
                      - /url: /lessons/connectors/
                  - listitem [ref=e214]:
                    - link "Databases over JDBC" [ref=e215] [cursor=pointer]:
                      - /url: /lessons/jdbc-databases/
                  - listitem [ref=e216]:
                    - link "Expressions" [ref=e217] [cursor=pointer]:
                      - /url: /lessons/expressions/
                  - listitem [ref=e218]:
                    - link "Inline code and .NET functions" [ref=e219] [cursor=pointer]:
                      - /url: /lessons/inline-code/
                  - listitem [ref=e220]:
                    - link "Control flow" [ref=e221] [cursor=pointer]:
                      - /url: /lessons/control-flow/
                  - listitem [ref=e222]:
                    - link "Parallel branches" [ref=e223] [cursor=pointer]:
                      - /url: /lessons/parallel-branches/
            - listitem [ref=e224]:
              - generic [ref=e225]:
                - generic [ref=e226]:
                  - generic [ref=e227]: "04"
                  - generic [ref=e228]: 4 of 4 lessons live
                - heading "Develop & test" [level=3] [ref=e229]
                - list [ref=e230]:
                  - listitem [ref=e231]:
                    - link "Local development in VS Code" [ref=e232] [cursor=pointer]:
                      - /url: /lessons/local-development/
                  - listitem [ref=e233]:
                    - link "Parameters and app settings" [ref=e234] [cursor=pointer]:
                      - /url: /lessons/parameters-app-settings/
                  - listitem [ref=e235]:
                    - link "Unit testing workflows" [ref=e236] [cursor=pointer]:
                      - /url: /lessons/unit-testing/
                  - listitem [ref=e237]:
                    - link "Mocking triggers and actions" [ref=e238] [cursor=pointer]:
                      - /url: /lessons/mocking-actions/
            - listitem [ref=e239]:
              - generic [ref=e240]:
                - generic [ref=e241]:
                  - generic [ref=e242]: "05"
                  - generic [ref=e243]: 6 of 6 lessons live
                - heading "Integration patterns" [level=3] [ref=e244]
                - list [ref=e245]:
                  - listitem [ref=e246]:
                    - 'link "XML maps: XSLT and Data Mapper" [ref=e247] [cursor=pointer]':
                      - /url: /lessons/xslt-maps/
                  - listitem [ref=e248]:
                    - link "JSON with Liquid templates" [ref=e249] [cursor=pointer]:
                      - /url: /lessons/liquid-templates/
                  - listitem [ref=e250]:
                    - link "Service Bus & queues" [ref=e251] [cursor=pointer]:
                      - /url: /lessons/service-bus-queues/
                  - listitem [ref=e252]:
                    - link "Batching" [ref=e253] [cursor=pointer]:
                      - /url: /lessons/batching/
                  - listitem [ref=e254]:
                    - link "Splitting arrays into separate runs" [ref=e255] [cursor=pointer]:
                      - /url: /lessons/debatching/
                  - listitem [ref=e256]:
                    - link "Request/response vs async polling" [ref=e257] [cursor=pointer]:
                      - /url: /lessons/async-polling/
            - listitem [ref=e258]:
              - generic [ref=e259]:
                - generic [ref=e260]:
                  - generic [ref=e261]: "06"
                  - generic [ref=e262]: 5 of 5 lessons live
                - heading "Reliability" [level=3] [ref=e263]
                - list [ref=e264]:
                  - listitem [ref=e265]:
                    - link "Retry policies" [ref=e266] [cursor=pointer]:
                      - /url: /lessons/retry-policies/
                  - listitem [ref=e267]:
                    - link "Timeouts" [ref=e268] [cursor=pointer]:
                      - /url: /lessons/timeouts/
                  - listitem [ref=e269]:
                    - link "Run-after & error scopes" [ref=e270] [cursor=pointer]:
                      - /url: /lessons/run-after-error-scopes/
                  - listitem [ref=e271]:
                    - link "Idempotency" [ref=e272] [cursor=pointer]:
                      - /url: /lessons/idempotency/
                  - listitem [ref=e273]:
                    - link "Resubmitting runs & failure handling" [ref=e274] [cursor=pointer]:
                      - /url: /lessons/resubmitting-runs/
            - listitem [ref=e275]:
              - generic [ref=e276]:
                - generic [ref=e277]:
                  - generic [ref=e278]: "07"
                  - generic [ref=e279]: 4 of 4 lessons live
                - heading "Operating at scale" [level=3] [ref=e280]
                - list [ref=e281]:
                  - listitem [ref=e282]:
                    - link "Throttling & limits" [ref=e283] [cursor=pointer]:
                      - /url: /lessons/throttling-limits/
                  - listitem [ref=e284]:
                    - link "Monitoring with App Insights & Log Analytics" [ref=e285] [cursor=pointer]:
                      - /url: /lessons/monitoring/
                  - listitem [ref=e286]:
                    - link "Alerting" [ref=e287] [cursor=pointer]:
                      - /url: /lessons/alerting/
                  - listitem [ref=e288]:
                    - link "A run failed at 3am — now what?" [ref=e289] [cursor=pointer]:
                      - /url: /lessons/failed-at-3am/
            - listitem [ref=e290]:
              - generic [ref=e291]:
                - generic [ref=e292]:
                  - generic [ref=e293]: "08"
                  - generic [ref=e294]: 6 of 6 lessons live
                - heading "Security & delivery" [level=3] [ref=e295]
                - list [ref=e296]:
                  - listitem [ref=e297]:
                    - link "Managed identity" [ref=e298] [cursor=pointer]:
                      - /url: /lessons/managed-identity/
                  - listitem [ref=e299]:
                    - link "Key Vault" [ref=e300] [cursor=pointer]:
                      - /url: /lessons/key-vault/
                  - listitem [ref=e301]:
                    - link "Easy Auth (App Service authentication)" [ref=e302] [cursor=pointer]:
                      - /url: /lessons/easy-auth/
                  - listitem [ref=e303]:
                    - link "Private endpoints & VNet" [ref=e304] [cursor=pointer]:
                      - /url: /lessons/private-networking/
                  - listitem [ref=e305]:
                    - link "CI/CD with Bicep & ARM" [ref=e306] [cursor=pointer]:
                      - /url: /lessons/cicd/
                  - listitem [ref=e307]:
                    - link "Deployment slots" [ref=e308] [cursor=pointer]:
                      - /url: /lessons/deployment-slots/
            - listitem [ref=e309]:
              - generic [ref=e310]:
                - generic [ref=e311]:
                  - generic [ref=e312]: "09"
                  - generic [ref=e313]: 5 of 5 lessons live
                - heading "Agentic Logic Apps" [level=3] [ref=e314]
                - list [ref=e315]:
                  - listitem [ref=e316]:
                    - link "Agent workflows vs fixed workflows" [ref=e317] [cursor=pointer]:
                      - /url: /lessons/agent-workflows/
                  - listitem [ref=e318]:
                    - link "Logic Apps as tools & MCP servers" [ref=e319] [cursor=pointer]:
                      - /url: /lessons/logic-apps-as-tools/
                  - listitem [ref=e320]:
                    - link "Single and multiple agents" [ref=e321] [cursor=pointer]:
                      - /url: /lessons/multi-agent-patterns/
                  - listitem [ref=e322]:
                    - link "Guardrails for agents" [ref=e323] [cursor=pointer]:
                      - /url: /lessons/agent-guardrails/
                  - listitem [ref=e324]:
                    - link "Agentic triage" [ref=e325] [cursor=pointer]:
                      - /url: /lessons/agentic-triage/
            - listitem [ref=e326]:
              - generic [ref=e327]:
                - generic [ref=e328]:
                  - generic [ref=e329]: "10"
                  - generic [ref=e330]: 3 of 3 lessons live
                - heading "Logic Apps Automation (preview)" [level=3] [ref=e331]
                - list [ref=e332]:
                  - listitem [ref=e333]:
                    - link "What Logic Apps Automation is" [ref=e334] [cursor=pointer]:
                      - /url: /lessons/what-is-automation/
                  - listitem [ref=e335]:
                    - link "Projects, applications and workflows" [ref=e336] [cursor=pointer]:
                      - /url: /lessons/projects-apps-workflows/
                  - listitem [ref=e337]:
                    - link "Building an automation workflow" [ref=e338] [cursor=pointer]:
                      - /url: /lessons/automation-workflows/
            - listitem [ref=e339]:
              - generic [ref=e340]:
                - generic [ref=e341]:
                  - generic [ref=e342]: "11"
                  - generic [ref=e343]: 8 of 8 lessons live
                - heading "Advanced integration patterns" [level=3] [ref=e344]
                - list [ref=e345]:
                  - listitem [ref=e346]:
                    - link "Claim check" [ref=e347] [cursor=pointer]:
                      - /url: /lessons/claim-check/
                  - listitem [ref=e348]:
                    - link "Request-reply over Service Bus" [ref=e349] [cursor=pointer]:
                      - /url: /lessons/request-reply-service-bus/
                  - listitem [ref=e350]:
                    - link "Sequential convoy" [ref=e351] [cursor=pointer]:
                      - /url: /lessons/sequential-convoy/
                  - listitem [ref=e352]:
                    - link "Scatter-gather" [ref=e353] [cursor=pointer]:
                      - /url: /lessons/scatter-gather/
                  - listitem [ref=e354]:
                    - link "Saga & compensation" [ref=e355] [cursor=pointer]:
                      - /url: /lessons/saga-compensation/
                  - listitem [ref=e356]:
                    - link "Competing consumers & priority queues" [ref=e357] [cursor=pointer]:
                      - /url: /lessons/competing-consumers/
                  - listitem [ref=e358]:
                    - link "Circuit breaker" [ref=e359] [cursor=pointer]:
                      - /url: /lessons/circuit-breaker/
                  - listitem [ref=e360]:
                    - link "Correlation & long waits" [ref=e361] [cursor=pointer]:
                      - /url: /lessons/long-waits-correlation/
            - listitem [ref=e362]:
              - generic [ref=e363]:
                - generic [ref=e364]:
                  - generic [ref=e365]: "12"
                  - generic [ref=e366]: 3 of 3 lessons live
                - heading "Whole systems" [level=3] [ref=e367]
                - list [ref=e368]:
                  - listitem [ref=e369]:
                    - link "Order-processing pipeline" [ref=e370] [cursor=pointer]:
                      - /url: /lessons/order-processing/
                  - listitem [ref=e371]:
                    - link "EDI / B2B flow" [ref=e372] [cursor=pointer]:
                      - /url: /lessons/edi-b2b/
                  - listitem [ref=e373]:
                    - link "Event-driven integration hub" [ref=e374] [cursor=pointer]:
                      - /url: /lessons/integration-hub/
          - generic [ref=e375]: Written by Daniel Jonathan, Azure integration specialist.
      - contentinfo [ref=e376]:
        - generic [ref=e377]: Logic Apps — an interactive course · free to use
        - generic [ref=e378]: Lessons are written with AI assistance and fact-checked against Microsoft Learn documentation; a sample is spot-checked by hand.
        - link "Privacy" [ref=e379] [cursor=pointer]:
          - /url: /privacy/
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | const MODULE_TITLES = [
  4  |   'Foundations', 'Hosting & runtime', 'Building flows', 'Integration patterns', 'Reliability',
  5  |   'Operating at scale', 'Security & delivery', 'Agentic Logic Apps', 'Whole systems',
  6  | ];
  7  | 
  8  | test('sidebar lists every module', async ({ page }) => {
  9  |   await page.goto('/');
  10 |   const sidebar = page.locator('#sidebar');
  11 |   for (const title of MODULE_TITLES) {
  12 |     await expect(sidebar.getByRole('button', { name: new RegExp(title) })).toBeVisible();
  13 |   }
  14 | });
  15 | 
  16 | test('coming-soon lessons are not links', async ({ page }) => {
  17 |   await page.goto('/');
  18 |   const sidebar = page.locator('#sidebar');
  19 |   await sidebar.getByRole('button', { name: /Whole systems/ }).click();
  20 |   await expect(sidebar.getByText('EDI / B2B flow')).toBeVisible();
> 21 |   await expect(sidebar.getByRole('link', { name: /EDI \/ B2B flow/ })).toHaveCount(0);
     |                                                                        ^ Error: expect(locator).toHaveCount(expected) failed
  22 | });
  23 | 
  24 | test('theme toggle switches data-theme', async ({ page }) => {
  25 |   await page.emulateMedia({ colorScheme: 'light' });
  26 |   await page.goto('/');
  27 |   await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  28 |   await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  29 | });
  30 | 
  31 | test('phone width: no horizontal scroll and the menu opens the drawer', async ({ page }) => {
  32 |   await page.setViewportSize({ width: 375, height: 800 });
  33 |   await page.goto('/');
  34 |   const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  35 |   expect(scrollWidth).toBeLessThanOrEqual(375);
  36 |   const sidebar = page.locator('#sidebar');
  37 |   await expect(sidebar).not.toBeInViewport();
  38 |   await page.getByRole('button', { name: 'Open course menu' }).click();
  39 |   await expect(sidebar).toHaveAttribute('data-open', 'true');
  40 |   await expect(sidebar).toBeInViewport();
  41 | });
  42 | 
  43 | test('progress shows the published lesson count', async ({ page }) => {
  44 |   await page.goto('/');
  45 |   await expect(page.locator('#sidebar')).toContainText(/Progress\s*0\s*\/\s*\d+/);
  46 | });
  47 | 
```