import { test, expect } from '@playwright/test';

const STORYBOOK_URL = 'http://localhost:6006';
const ACCORDION_DOCS_URL = `${STORYBOOK_URL}/?path=/docs/components-accordion--docs`;

const COLOR_CONTROLS = [
  {
    name: 'headerBackgroundColor',
    testColor: '#ff0000',
  },
  {
    name: 'headerTextColor',
    testColor: '#00ff00',
  },
  {
    name: 'bodyBackgroundColor',
    testColor: '#0000ff',
  },
  {
    name: 'bodyTextColor',
    testColor: '#ff00ff',
  },
  {
    name: 'borderColor',
    testColor: '#ffff00',
  },
];

test.describe('Accordion Color Controls', () => {
  test('should update accordion colors via Storybook controls', async ({ page }) => {
    await page.goto(ACCORDION_DOCS_URL);
    
    await page.waitForLoadState('networkidle');
    
    const iframe = page.frameLocator('iframe[id*="storybook-preview"]');
    
    const accordionContainer = iframe.locator('.accordion').first();
    await expect(accordionContainer).toBeVisible({ timeout: 10000 });
    
    const accordionButton = iframe.locator('.accordion-button').first();
    await expect(accordionButton).toBeVisible({ timeout: 10000 });
    
    await expect(iframe.locator('input[placeholder*="Choose color"]').first()).toBeVisible({ timeout: 10000 });
    
    const initialScreenshot = await accordionContainer.screenshot();
    await expect(initialScreenshot).toMatchSnapshot('accordion-initial-state.png');
    
    for (const control of COLOR_CONTROLS) {
      const isBodyColor = control.name.includes('body');
      
      if (isBodyColor) {
        const isCollapsed = await accordionButton.evaluate((el) => {
          return el.classList.contains('collapsed');
        });
        
        if (isCollapsed) {
          await accordionButton.click();
          await page.waitForTimeout(300);
        }
      }
      
      const beforeScreenshot = await accordionContainer.screenshot();
      await expect(beforeScreenshot).toMatchSnapshot(`accordion-before-${control.name}.png`);
      
      const controlRow = iframe.locator(`tr:has-text("${control.name}")`);
      await expect(controlRow).toBeVisible();
      
      const colorInput = controlRow.locator('input[placeholder*="Choose color"]');
      await expect(colorInput).toBeVisible();
      
      await colorInput.fill(control.testColor);
      await colorInput.press('Enter');
      
      await page.waitForTimeout(500);
      
      const afterScreenshot = await accordionContainer.screenshot();
      await expect(afterScreenshot).toMatchSnapshot(`accordion-after-${control.name}.png`);
    }
    
    const finalScreenshot = await accordionContainer.screenshot();
    await expect(finalScreenshot).toMatchSnapshot('accordion-final-state.png');
  });
});

