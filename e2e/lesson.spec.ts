import { expect, test } from '@playwright/test';

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('every step title and its text are readable', async ({ page }) => {
    await page.goto('/lessons/sample/');
    const sections = page.locator('[data-step]');
    await expect(sections).toHaveCount(3);
    for (const name of ['The problem', 'The fix', 'Recap']) {
      await expect(page.getByRole('heading', { name })).toBeVisible();
    }
    await expect(page.getByText('A run fails at 3am and nobody notices.')).toBeVisible();
  });
});

test('opens on the last step for an out-of-range hash', async ({ page }) => {
  await page.goto('/lessons/sample/#99');
  await expect(page.locator('.step-panel h2')).toHaveText('Recap');
});

test('opens on the first step for a garbage hash', async ({ page }) => {
  await page.goto('/lessons/sample/#abc');
  await expect(page.locator('.step-panel h2')).toHaveText('The problem');
});

test('arrow key moves to the next step and updates the hash', async ({ page }) => {
  await page.goto('/lessons/sample/');
  await expect(page.locator('.step-panel h2')).toHaveText('The problem');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('.step-panel h2')).toHaveText('The fix');
  await expect(page).toHaveURL(/#2$/);
});

test('recap links appear only on the recap step', async ({ page }) => {
  await page.goto('/lessons/sample/');
  await expect(page.locator('.step-panel h2')).toHaveText('The problem');
  const recap = page.locator('.step-panel .recap-links');
  await expect(recap).toHaveCount(0);
  await page.goto('/lessons/sample/#3');
  await expect(recap).toHaveCount(1);
  await expect(recap.getByRole('link', { name: 'Sample related article' })).toBeVisible();
});

test('has a canonical link and lesson title', async ({ page }) => {
  await page.goto('/lessons/sample/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /\/lessons\/sample\/$/);
  await expect(page).toHaveTitle('Sample lesson · Logic Apps course');
});

test('draft lessons are not published in a production build', async ({ page }) => {
  const res = await page.goto('/lessons/sample-draft/');
  expect(res?.status()).toBe(404);
  await page.goto('/');
  const sidebar = page.locator('#sidebar');
  await sidebar.getByRole('button', { name: /Test fixtures/ }).click();
  await expect(sidebar.getByText('Sample draft lesson')).toBeVisible();
  await expect(sidebar.getByRole('link', { name: /Sample draft lesson/ })).toHaveCount(0);
  await expect(sidebar.getByRole('link', { name: /Sample lesson/ })).toBeVisible();
});
