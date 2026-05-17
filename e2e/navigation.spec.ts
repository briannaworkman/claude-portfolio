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

test.describe('Stats page', () => {
  test('stats page renders with heading', async ({ page }) => {
    await page.goto('/stats');
    await expect(page.locator('h1')).toContainText('STATS');
  });

  test('stats page has correct title', async ({ page }) => {
    await page.goto('/stats');
    await expect(page).toHaveTitle(/Bri Workman/);
  });

  test('Stats link appears in navbar', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('nav a[href="/stats"]').first()).toBeVisible();
  });

  test('all five tabs are present', async ({ page }) => {
    await page.goto('/stats');
    for (const label of ['metrics', 'trends', 'assessment', 'on the horizon', 'implemented']) {
      await expect(page.locator(`button:has-text("${label}")`).first()).toBeVisible();
    }
  });

  test('active month button has green styling', async ({ page }) => {
    await page.goto('/stats');
    const activeBtn = page.locator('button:has-text("2026-05")');
    await expect(activeBtn).toBeVisible();
    await expect(activeBtn).toHaveClass(/text-\[#00ff9d\]/);
  });

  test('metrics tab shows goal rate and headline stats', async ({ page }) => {
    await page.goto('/stats');
    await expect(page.locator('text=Goal Rate')).toBeVisible();
    await expect(page.locator('text=Messages')).toBeVisible();
    await expect(page.locator('text=Commits')).toBeVisible();
    await expect(page.locator('text=Agent Calls')).toBeVisible();
    await expect(page.locator('text=Friction')).toBeVisible();
  });

  test('metrics tab shows work breakdown section', async ({ page }) => {
    await page.goto('/stats');
    await expect(page.locator('text=Work Breakdown')).toBeVisible();
    await expect(page.locator('text=Feature Dev')).toBeVisible();
  });

  test('clicking trends tab shows charts', async ({ page }) => {
    await page.goto('/stats');
    await page.locator('button:has-text("trends")').click();
    await expect(page.locator('.recharts-responsive-container').first()).toBeVisible();
  });

  test('assessment tab shows strengths and rough edges', async ({ page }) => {
    await page.goto('/stats');
    await page.locator('button:has-text("assessment")').click();
    await expect(page.locator('text=Strengths')).toBeVisible();
    await expect(page.locator('text=Rough Edges')).toBeVisible();
    await expect(page.locator('text=Summary')).toBeVisible();
  });

  test('horizon tab shows items with effort badges', async ({ page }) => {
    await page.goto('/stats');
    await page.locator('button:has-text("on the horizon")').click();
    await expect(page.locator('text=Autonomous Linear-to-PR Ticket Swarm')).toBeVisible();
    await expect(page.locator('text=high').first()).toBeVisible();
  });
});
