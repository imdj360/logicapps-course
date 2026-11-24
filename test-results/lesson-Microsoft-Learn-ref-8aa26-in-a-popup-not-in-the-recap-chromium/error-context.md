# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: lesson.spec.ts >> Microsoft Learn references open in a popup, not in the recap
- Location: e2e/lesson.spec.ts:70:1

# Error details

```
Error: expect(locator).not.toContainText(expected) failed

Locator: locator('.recap-links')
Expected substring: not "On Microsoft Learn"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "not toContainText" locator('.recap-links') with timeout 5000ms
  - waiting for locator('.recap-links')

```

```yaml
- banner:
  - link "Logic Apps an interactive course":
    - /url: /
  - navigation "Sections":
    - link "Learn":
      - /url: /
    - text: Cheatsheets Soon
  - text: by Daniel Jonathan
  - button "Switch to dark theme"
- complementary "Course":
  - text: Course 61 lessons
  - list:
    - listitem:
      - button "01 Foundations 0/4"
    - listitem:
      - button "02 Hosting & runtime 0/5"
    - listitem:
      - button "03 Building flows 0/6"
    - listitem:
      - button "04 Develop & test 0/4"
    - listitem:
      - button "05 Integration patterns 0/6" [expanded]
      - list:
        - listitem:
          - 'link "XML maps: XSLT and Data Mapper"':
            - /url: /lessons/xslt-maps/
        - listitem:
          - link "JSON with Liquid templates":
            - /url: /lessons/liquid-templates/
        - listitem:
          - link "Service Bus & queues":
            - /url: /lessons/service-bus-queues/
        - listitem:
          - link "Batching":
            - /url: /lessons/batching/
        - listitem:
          - link "Splitting arrays into separate runs":
            - /url: /lessons/debatching/
        - listitem:
          - link "Request/response vs async polling":
            - /url: /lessons/async-polling/
    - listitem:
      - button "06 Reliability 0/5"
    - listitem:
      - button "07 Operating at scale 0/4"
    - listitem:
      - button "08 Security & delivery 0/6"
    - listitem:
      - button "09 Agentic Logic Apps 0/5"
    - listitem:
      - button "10 Logic Apps Automation (preview) 0/3"
    - listitem:
      - button "11 Advanced integration patterns 0/8"
    - listitem:
      - button "12 Whole systems 0/3"
    - listitem:
      - button "99 Test fixtures 0/1"
  - text: Progress 0 / 60
- main:
  - paragraph: 05. Integration patterns / Lesson 3 of 6
  - heading "Service Bus & queues" [level=1]
  - paragraph: Orders arrive in bursts and the ERP takes them at its own pace. Put a Service Bus queue in between, and learn how Standard reads, settles and orders its messages.
  - paragraph: Written with AI assistance and fact-checked against Microsoft Learn documentation (2026-11-24). Daniel Jonathan spot-checks lessons by hand. Facts come from Microsoft Learn (see References); anything marked “ours” is our own advice.
  - text: 11 min Intermediate 10 steps
  - button "References (5)"
  - strong: On Microsoft Learn
  - button "Close references": ×
  - list:
    - listitem:
      - link "Connect to Azure Service Bus from Workflows":
        - /url: https://learn.microsoft.com/en-us/azure/connectors/connectors-create-api-servicebus
    - listitem:
      - link "Azure Service Bus Queues, Topics, and Subscriptions":
        - /url: https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-queues-topics-subscriptions
    - listitem:
      - link "Service Bus (built-in connector reference)":
        - /url: https://learn.microsoft.com/en-us/azure/logic-apps/connectors/built-in/reference/servicebus/
    - listitem:
      - link "Edit App and Host Settings for Standard Logic Apps":
        - /url: https://learn.microsoft.com/en-us/azure/logic-apps/edit-app-settings-host-settings
    - listitem:
      - link "Limits and Configuration Reference Guide":
        - /url: https://learn.microsoft.com/en-us/azure/logic-apps/logic-apps-limits-and-config
  - button "↻ Replay"
  - button "❚❚ Pause"
  - list "Current state":
    - listitem: in bursts
    - listitem: out steady
  - img "Diagram for this step": Shop bursts Orders queue Service Bus Queue trigger built-in ERP steady pace
  - list:
    - listitem: message
    - listitem: processed
    - listitem: dead-lettered
  - navigation "Steps in this lesson":
    - text: In this lesson Step 1 of 10
    - list:
      - listitem:
        - button "1 Bursts in, steady out"
      - listitem:
        - button "2 Built-in or managed"
      - listitem:
        - button "3 The queue trigger"
      - listitem:
        - 'button "4 Peek-lock: you decide"'
      - listitem:
        - 'button "5 Topics: one message, many readers"'
      - listitem:
        - 'button "6 In order: sessions"'
      - listitem:
        - button "7 The dead-letter queue"
      - listitem:
        - button "8 Concurrency and batches"
      - listitem:
        - button "9 Connecting"
      - listitem:
        - button "10 Recap"
  - text: Step 1 / 10 PROBLEM
  - heading "Bursts in, steady out" [level=2]
  - paragraph: "Orders arrive in bursts: hundreds in a minute after a promotion, then nothing for an hour. The ERP can only take them at its own steady pace."
  - paragraph:
    - text: A common answer, and the one this lesson uses, is a
    - strong: Service Bus queue
    - text: "between them: the shop puts orders on the queue, and a workflow takes them off as fast as the ERP allows."
  - button "Back" [disabled]
  - 'button "Next: Built-in or managed"'
  - heading "You'll learn" [level=3]
  - list:
    - listitem: Why the built-in Service Bus connector is usually the better choice in Standard
    - listitem: How auto-complete and peek-lock triggers settle messages
    - listitem: How sessions keep related messages in order
    - listitem: Where failed messages go, and how to read them
- contentinfo:
  - text: Logic Apps — an interactive course · free to use Lessons are written with AI assistance and fact-checked against Microsoft Learn documentation; a sample is spot-checked by hand.
  - link "Privacy":
    - /url: /privacy/
```

# Test source

```ts
  1  | import { expect, test } from '@playwright/test';
  2  | 
  3  | test.describe('without JavaScript', () => {
  4  |   test.use({ javaScriptEnabled: false });
  5  | 
  6  |   test('every step title and its text are readable', async ({ page }) => {
  7  |     await page.goto('/lessons/sample/');
  8  |     const sections = page.locator('[data-step]');
  9  |     await expect(sections).toHaveCount(3);
  10 |     for (const name of ['The problem', 'The fix', 'Recap']) {
  11 |       await expect(page.getByRole('heading', { name })).toBeVisible();
  12 |     }
  13 |     await expect(page.getByText('A run fails at 3am and nobody notices.')).toBeVisible();
  14 |   });
  15 | });
  16 | 
  17 | test('opens on the last step for an out-of-range hash', async ({ page }) => {
  18 |   await page.goto('/lessons/sample/#99');
  19 |   await expect(page.locator('.step-panel h2')).toHaveText('Recap');
  20 | });
  21 | 
  22 | test('opens on the first step for a garbage hash', async ({ page }) => {
  23 |   await page.goto('/lessons/sample/#abc');
  24 |   await expect(page.locator('.step-panel h2')).toHaveText('The problem');
  25 | });
  26 | 
  27 | test('arrow key moves to the next step and updates the hash', async ({ page }) => {
  28 |   await page.goto('/lessons/sample/');
  29 |   await expect(page.locator('.step-panel h2')).toHaveText('The problem');
  30 |   // The heading is server-rendered, so wait for the player to hydrate before sending keys.
  31 |   await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  32 |   await page.keyboard.press('ArrowRight');
  33 |   await expect(page.locator('.step-panel h2')).toHaveText('The fix');
  34 |   await expect(page).toHaveURL(/#2$/);
  35 | });
  36 | 
  37 | test('recap links appear only on the recap step', async ({ page }) => {
  38 |   await page.goto('/lessons/sample/');
  39 |   await expect(page.locator('.step-panel h2')).toHaveText('The problem');
  40 |   const recap = page.locator('.step-panel .recap-links');
  41 |   await expect(recap).toHaveCount(0);
  42 |   await page.goto('/lessons/sample/#3');
  43 |   await expect(recap).toHaveCount(1);
  44 |   await expect(recap.getByRole('link', { name: 'Sample related article' })).toBeVisible();
  45 | });
  46 | 
  47 | test('has a canonical link and lesson title', async ({ page }) => {
  48 |   await page.goto('/lessons/sample/');
  49 |   await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/lessons\/sample\/$/);
  50 |   await expect(page).toHaveTitle('Sample lesson · Logic Apps course');
  51 | });
  52 | 
  53 | test('draft lessons are not published in a production build', async ({ page }) => {
  54 |   const res = await page.goto('/lessons/sample-draft/');
  55 |   expect(res?.status()).toBe(404);
  56 |   await page.goto('/');
  57 |   const sidebar = page.locator('#sidebar');
  58 |   await sidebar.getByRole('button', { name: /Test fixtures/ }).click();
  59 |   await expect(sidebar.getByText('Sample draft lesson')).toBeVisible();
  60 |   await expect(sidebar.getByRole('link', { name: /Sample draft lesson/ })).toHaveCount(0);
  61 |   await expect(sidebar.getByRole('link', { name: /Sample lesson/ })).toBeVisible();
  62 | });
  63 | 
  64 | test('discloses AI assistance and review on every lesson', async ({ page }) => {
  65 |   await page.goto('/lessons/sample/');
  66 |   await expect(page.getByTestId('provenance')).toContainText('Written with AI assistance and fact-checked against Microsoft Learn documentation');
  67 |   await expect(page.locator('footer')).toContainText('written with AI assistance');
  68 | });
  69 | 
  70 | test('Microsoft Learn references open in a popup, not in the recap', async ({ page }) => {
  71 |   await page.goto('/lessons/service-bus-queues/');
  72 |   await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  73 |   const popup = page.getByTestId('refs-popup');
  74 |   await expect(popup).toBeHidden();
  75 |   await page.getByTestId('refs-button').click();
  76 |   await expect(popup).toBeVisible();
  77 |   await expect(popup.getByRole('link').first()).toHaveAttribute('href', /learn\.microsoft\.com/);
> 78 |   await expect(page.locator('.recap-links')).not.toContainText('On Microsoft Learn');
     |                                                  ^ Error: expect(locator).not.toContainText(expected) failed
  79 | });
  80 | 
```