import { expect, test } from '@playwright/test';

test('Example est', async ({ page }) => {
  await page.goto((process.env['WEBPACK_CI_PUBLIC_URL'] || process.env['WEBPACK_DEV_PUBLIC_URL'])!);

  await expect(page).toHaveTitle(/CRM System | TechExpo 2024/);
  await expect(page.getByRole('heading', { level: 1, name: 'Dashboard' })).toBeVisible();
});
