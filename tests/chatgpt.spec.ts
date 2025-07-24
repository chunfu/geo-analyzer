import { test, expect } from '@playwright/test';
import fs from 'fs';

const QUESTION = '台北有哪些 SEO 公司口碑佳，成功把客戶關鍵字從第 3 頁拉到首頁？';
const OUTPUT_FILE = 'chatgpt-answer.txt';

// Helper function to add random delay
const randomDelay = (min: number, max: number) => 
  new Promise(resolve => setTimeout(resolve, Math.random() * (max - min) + min));

const delay = (s: number) => new Promise(resolve => setTimeout(resolve, s * 1000));

test('ask ChatGPT and save answer', async ({ page, context }) => {
  // Set viewport to match real browser
  await page.setViewportSize({ width: 1168, height: 968 });
  
  // Set user agent to match real browser
  await page.setExtraHTTPHeaders({
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:140.0) Gecko/20100101 Firefox/140.0',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'DNT': '1',
    'Sec-GPC': '1',
    'Upgrade-Insecure-Requests': '1',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
    'Cache-Control': 'max-age=0'
  });

  // Configure browser to appear more human-like
  await context.addInitScript(() => {
    // Remove automation flags
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    
    // Mock other properties that might be checked
    Object.defineProperty(navigator, 'permissions', {
      get: () => ({
        query: () => Promise.resolve({ state: 'granted' })
      })
    });
  });

  // 1. Open chatgpt.com
  await page.goto('https://chatgpt.com');

  // 2. Find the contenteditable div and ask the question
  const inputSelector = 'div#prompt-textarea[contenteditable="true"]';
  await page.waitForSelector(inputSelector, { timeout: 15000 });
  
  // Click on the input first to focus it
  await page.click(inputSelector);
  
  // Type the question with human-like delays
  await page.type(inputSelector, QUESTION, { delay: 50 }); // 50ms delay between characters
  await randomDelay(1000, 2000); // Wait before pressing Enter
  
  await page.keyboard.press('Enter');

  // 3. Wait until there are at least 2 copy buttons (use locator to avoid CSP issues)
  const copyButtonSelector = '[data-testid="copy-turn-action-button"]';
  await page.locator(copyButtonSelector).nth(1).waitFor({ timeout: 120000 }); // Increased timeout

  // 4. Click the last copy button (latest answer)
  const copyButtons = await page.$$(copyButtonSelector);
  const lastCopyButton = copyButtons[copyButtons.length - 1];
  await lastCopyButton.click();

  // 5. Read the clipboard
  await context.grantPermissions(['clipboard-read']);
  const clipboardText = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });

  // 6. Save the answer to a txt file
  fs.writeFileSync(OUTPUT_FILE, clipboardText, 'utf-8');

  // Optionally, assert the answer is not empty
  expect(clipboardText.trim().length).toBeGreaterThan(0);
}); 