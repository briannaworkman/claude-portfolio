import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('projects page renders', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('h1')).toContainText('Projects');
  });

  test('blog page renders with empty state or posts', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('h1')).toContainText('Blog');
  });

  test('uses page renders', async ({ page }) => {
    await page.goto('/uses');
    await expect(page.locator('h1')).toContainText('Uses');
  });

  test('contact page renders', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1')).toContainText('Contact');
  });
});
