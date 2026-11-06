import { test, expect } from '@playwright/test';

// Visual regression tests for Pixelmist design system
// These tests capture screenshots and compare them against baseline images

const BASE_URL = 'http://localhost:5173';

// Helper to wait for hydration
async function waitForHydration(page) {
  await page.waitForSelector('[data-pm-hydrated="true"]', { timeout: 5000 }).catch(() => null);
  await page.waitForTimeout(500);
}

test.describe('Pixelmist Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForHydration(page);
  });

  // 1. Test homepage initial load
  test('homepage - daylight theme', async ({ page }) => {
    await expect(page).toHaveScreenshot('homepage-daylight.png', {
      fullPage: true,
      mask: [page.locator('[data-testid="hydration-marker"]')],
    });
  });

  // 2. Test dark mode toggle
  test('homepage - terminal theme', async ({ page }) => {
    // Click theme toggle if it exists
    const themeToggle = page.locator('[data-testid="theme-toggle"]');
    if (await themeToggle.count() > 0) {
      await themeToggle.click();
      await page.waitForTimeout(300); // Animation delay
    } else {
      // Alternative: set data-theme attribute directly
      await page.evaluate(() => {
        document.documentElement.dataset.theme = 'terminal';
      });
      await page.waitForTimeout(300);
    }
    await expect(page).toHaveScreenshot('homepage-terminal.png', {
      fullPage: true,
    });
  });

  // 3. Test button variants
  test('button variants - daylight', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/components/button`);
    await waitForHydration(page);
    await expect(page.locator('[data-testid="button-section"]')).toHaveScreenshot('button-variants-daylight.png');
  });

  // 4. Test button variants in dark mode
  test('button variants - terminal', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/components/button`);
    await waitForHydration(page);
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'terminal';
    });
    await page.waitForTimeout(300);
    await expect(page.locator('[data-testid="button-section"]')).toHaveScreenshot('button-variants-terminal.png');
  });

  // 5. Test typography
  test('typography - all variants', async ({ page }) => {
    await page.goto(`${BASE_URL}/#/components/typography`);
    await waitForHydration(page);
    await expect(page.locator('[data-testid="typography-section"]')).toHaveScreenshot('typography.png');
  });
});

test.describe('Component Screenshots', () => {
  test('badge variants', async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForHydration(page);
    await page.evaluate(() => {
      document.documentElement.dataset.theme = 'daylight';
    });
    await expect(page.locator('[data-testid="badge-section"]')).toHaveScreenshot('badges-daylight.png');
  });

  test('card variants', async ({ page }) => {
    await page.goto(BASE_URL);
    await waitForHydration(page);
    await expect(page.locator('[data-testid="card-section"]')).toHaveScreenshot('cards-daylight.png');
  });
});
