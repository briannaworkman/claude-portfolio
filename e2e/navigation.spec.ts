import { expect, test } from '@playwright/test';

test.describe('Navigation', () => {
  test('landing page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });

  test('projects page renders', async ({ page }) => {
    await page.goto('/projects');
    await expect(page.locator('h1')).toContainText('PROJECTS');
  });

  test('blog page renders with empty state or posts', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('h1')).toContainText('BLOG');
  });

  test('uses page renders', async ({ page }) => {
    await page.goto('/uses');
    await expect(page.locator('h1')).toContainText('USES');
  });

  test('contact page renders', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.locator('h1')).toContainText('CONTACT');
  });

  test('page titles use Bri Workman branding', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Bri Workman/);

    await page.goto('/projects');
    await expect(page).toHaveTitle(/Bri Workman/);

    await page.goto('/blog');
    await expect(page).toHaveTitle(/Bri Workman/);

    await page.goto('/uses');
    await expect(page).toHaveTitle(/Bri Workman/);

    await page.goto('/contact');
    await expect(page).toHaveTitle(/Bri Workman/);
  });

  test('resume link points to correct file', async ({ page }) => {
    await page.goto('/');
    const resumeLink = page.locator('nav a[href="/Brianna_Workman-Resume.pdf"]').first();
    await expect(resumeLink).toBeVisible();
  });

  test('github links render an svg icon', async ({ page }) => {
    await page.goto('/projects');
    const githubLink = page.locator('a[aria-label*="on GitHub"]').first();
    await expect(githubLink.locator('svg')).toBeVisible();
  });

  test('claude portfolio project card has no live link', async ({ page }) => {
    await page.goto('/projects');
    const portfolioCard = page.locator('article').filter({ hasText: 'Claude Portfolio' });
    await expect(portfolioCard.locator('a[aria-label="Claude Portfolio live site"]')).toHaveCount(
      0,
    );
  });

  test('contact page github link renders an svg icon', async ({ page }) => {
    await page.goto('/contact');
    const githubLink = page.locator('a[href*="github.com"]');
    await expect(githubLink.locator('svg')).toBeVisible();
  });
});
