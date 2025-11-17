import { test, expect } from '@playwright/test';

const STORYBOOK_URL = 'http://localhost:6006';
const ACCORDION_STORY_URL = `${STORYBOOK_URL}/?path=/story/components-accordion--basic`;

test.describe('Storybook Accordion', () => {
  test('should load Storybook', async ({ page }) => {
    await page.goto(STORYBOOK_URL);
    
    await expect(page).toHaveTitle(/Storybook/i);
    
    const sidebar = page.getByRole('navigation', { name: 'Global' });
    await expect(sidebar).toBeVisible({ timeout: 10000 });
  });

  test('headerBackgroundColor control should update preview', async ({ page }) => {
    await page.goto(ACCORDION_STORY_URL);
    
    await page.waitForLoadState('networkidle');
    
    const iframe = page.frameLocator('iframe[id*="storybook-preview"]');
    
    const accordionButton = iframe.locator('.accordion-button').first();
    await expect(accordionButton).toBeVisible({ timeout: 10000 });
    
    const initialBgColor = await accordionButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(initialBgColor).toBeTruthy();
    
    await page.waitForSelector('input[placeholder*="Choose color"]', { timeout: 10000 });
    
    const colorInputs = page.locator('input[placeholder*="Choose color"]');
    const headerBgInput = colorInputs.first();
    await expect(headerBgInput).toBeVisible();
    
    await headerBgInput.fill('#ff0000');
    await headerBgInput.press('Enter');
    
    await page.waitForTimeout(1000);
    
    const updatedBgColor = await accordionButton.evaluate((el) => {
      return window.getComputedStyle(el).backgroundColor;
    });
    
    expect(updatedBgColor).toBe('rgb(255, 0, 0)');
    expect(updatedBgColor).not.toBe(initialBgColor);
  });
});

