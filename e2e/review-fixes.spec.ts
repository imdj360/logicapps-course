import { expect, test } from '@playwright/test';

test('the Static Web Apps config ships inside the build output', async ({ request }) => {
  const res = await request.get('/staticwebapp.config.json');
  expect(res.status()).toBe(200);
  expect(await res.json()).toHaveProperty('responseOverrides');
});

test('after the player loads, screen readers get each step once', async ({ page }) => {
  await page.goto('/lessons/sample/');
  await expect(page.locator('.step-panel h2')).toHaveText('The problem');
  await expect(page.locator('#static-steps')).toBeHidden();
  await expect(page.getByRole('heading', { name: 'The fix' })).toHaveCount(0);
});

test('no requests go to Google Fonts', async ({ page }) => {
  const hosts: string[] = [];
  page.on('request', (r) => hosts.push(new URL(r.url()).host));
  await page.goto('/lessons/sample/');
  await page.waitForLoadState('networkidle');
  expect(hosts.filter((h) => /fonts\.(googleapis|gstatic)\.com/.test(h))).toEqual([]);
});
