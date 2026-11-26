import { expect, test } from '@playwright/test';

test('unknown pages show a helpful 404', async ({ page }) => {
  const res = await page.goto('/lessons/does-not-exist/');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found');
  await expect(page.getByRole('link', { name: 'Back to the guide' })).toHaveAttribute('href', '/');
});
