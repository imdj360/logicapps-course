import { expect, test } from '@playwright/test';
import { MODULES } from '../src/data/modules';

test('hero invites you to start the course', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Logic Apps');
  const start = page.getByRole('link', { name: 'Start exploring' });
  await expect(start).toHaveAttribute('href', /^\/lessons\/[a-z0-9-]+\/$/);
});

test('shows every module with its live lesson count', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.module-card');
  await expect(cards).toHaveCount(MODULES.length);
  await expect(cards.first()).toContainText(/lessons? live|coming soon/i);
});

test('links the agentic module as new', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /new.*Agentic Logic Apps/i })).toBeVisible();
});

test('does not promote products or collect emails', async ({ page }) => {
  await page.goto('/');
  const text = await page.locator('body').innerText();
  expect(text).not.toMatch(/LogicAppsHub|Lens/);
  await expect(page.locator('form')).toHaveCount(0);
});

test('no horizontal scroll at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375);
});
