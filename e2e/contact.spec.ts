import { expect, test } from '@playwright/test';

test.describe('Contact form', () => {
  test('shows success message after submission (stubbed)', async ({ page }) => {
    // Stub Formspree endpoint
    await page.route('**/formspree.io/**', async (route) => {
      await route.fulfill({ status: 200, body: JSON.stringify({ ok: true }) });
    });

    await page.goto('/contact');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'Hello from Playwright!');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Thanks!')).toBeVisible({ timeout: 5_000 });
  });
});
