import { expect, test } from '@playwright/test';

test.describe('Terminal mode', () => {
  test('toggle button opens terminal', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await expect(page.getByTestId('terminal')).toBeVisible();
  });

  test('macOS close button closes terminal', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await expect(page.getByTestId('terminal')).toBeVisible();
    await page.getByRole('button', { name: 'Close terminal' }).click();
    await expect(page.getByTestId('terminal')).not.toBeVisible();
  });

  test('help command lists commands', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').fill('help');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('whoami');
    await expect(page.getByTestId('terminal')).toContainText('ls projects');
  });

  test('ls projects returns project list', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').fill('ls projects');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('claude-portfolio');
  });

  test('cat with valid slug returns project details', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').fill('cat claude-portfolio');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('Claude Portfolio');
  });

  test('cat with unknown slug returns error', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').fill('cat not-a-real-project');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('not found');
  });

  test('unknown command shows error', async ({ page }) => {
    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').fill('foobar');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('command not found');
  });

  test('ask command returns a response (stubbed)', async ({ page }) => {
    // Stub the /api/ask endpoint to avoid real API calls in CI
    await page.route('**/api/ask', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: 'I work on frontend projects and love using Claude in my workflow.',
      });
    });

    await page.goto('/');
    await page.click('button:has-text("terminal")');
    await page.getByTestId('terminal').locator('input').fill('ask what do you work on');
    await page.keyboard.press('Enter');
    await expect(page.getByTestId('terminal')).toContainText('frontend', { timeout: 10_000 });
  });
});
