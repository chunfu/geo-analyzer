import { test, expect } from '@playwright/test';

test('open chatgpt.com in headed browser', async ({ page }) => {
  await page.goto('https://chatgpt.com');
  // Wait for the page to load by checking the title contains 'ChatGPT'
  await expect(page).toHaveTitle(/ChatGPT/i);
}); 