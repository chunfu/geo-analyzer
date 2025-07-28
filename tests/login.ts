import { Page } from '@playwright/test';
import { delay } from './utils';

export async function login(page: Page) {
  // 1. Click the login button
  await page.waitForSelector('button[data-testid="login-button"]', { timeout: 15000 });
  await page.click('button[data-testid="login-button"]');

  // 2. Wait for email input and type email
  await page.waitForSelector('input[type="email"][autocomplete="email"][placeholder="Email address"]', { timeout: 15000 });
  await page.fill('input[type="email"][autocomplete="email"][placeholder="Email address"]', 'open@solwen.ai');

  // 3. Click the first Continue button (for email)
  await page.click('button[type="submit"][name="intent"][value="email"]');

  // 4. Wait for password input and type password
  await page.waitForSelector('input[type="text"][autocomplete="current-password"][placeholder="Password"]', { timeout: 15000 });
  await page.fill('input[type="text"][autocomplete="current-password"][placeholder="Password"]', 'SalmonAI2024!');

  /*
  // 5. Click the next Continue button (for password)
  // Use the first visible button with type submit and no name attribute
  const continueButtons = await page.$$('button[type="submit"]:not([name])');
  for (const btn of continueButtons) {
    if (await btn.isVisible()) {
      await btn.click();
      break;
    }
  }

  // 6. Wait for chat input to appear (login success)
  await page.waitForSelector('div#prompt-textarea[contenteditable="true"]', { timeout: 20000 });
  */
} 