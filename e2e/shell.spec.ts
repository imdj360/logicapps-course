import { expect, test } from '@playwright/test';

const MODULE_TITLES = [
  'Foundations', 'Hosting & runtime', 'Building flows', 'Integration patterns', 'Reliability',
  'Operating at scale', 'Security & delivery', 'Agentic Logic Apps', 'Whole systems',
];

test('sidebar lists every module', async ({ page }) => {
  await page.goto('/');
  const sidebar = page.locator('#sidebar');
  for (const title of MODULE_TITLES) {
    await expect(sidebar.getByRole('button', { name: new RegExp(title) })).toBeVisible();
  }
});

test('coming-soon lessons are not links', async ({ page }) => {
  await page.goto('/');
  const sidebar = page.locator('#sidebar');
  await sidebar.getByRole('button', { name: /Test fixtures/ }).click();
  await expect(sidebar.getByText('Sample draft lesson')).toBeVisible();
  await expect(sidebar.getByRole('link', { name: /Sample draft lesson/ })).toHaveCount(0);
});

test('theme toggle switches data-theme', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('phone width: no horizontal scroll and the menu opens the drawer', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(scrollWidth).toBeLessThanOrEqual(375);
  const sidebar = page.locator('#sidebar');
  await expect(sidebar).not.toBeInViewport();
  await page.getByRole('button', { name: 'Open course menu' }).click();
  await expect(sidebar).toHaveAttribute('data-open', 'true');
  await expect(sidebar).toBeInViewport();
});

test('progress shows the published lesson count', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#sidebar')).toContainText(/Progress\s*0\s*\/\s*\d+/);
});
