import { test, expect } from "@playwright/test";
import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import fs from "fs";
import { login } from "./login";
import { setupBrowser } from "./setupBrowser";
import { randomDelay, delay } from "./utils";

// Add stealth plugin
chromium.use(StealthPlugin());

const QUESTION =
  "台北有哪些 SEO 公司口碑佳，成功把客戶關鍵字從第 3 頁拉到首頁？";
const OUTPUT_FILE = "chatgpt-answer.txt";

test("ask ChatGPT and save answer", async ({ context, page }) => {
  // Launch browser with stealth
  /*
  const browser = await chromium.launch({
    headless: false,
    args: [
      "--disable-blink-features=AutomationControlled",
      "--disable-features=VizDisplayCompositor",
    ],
  });

  const context = await browser.newContext();
  const page = await context.newPage();
  */

  try {
    // Setup browser anti-detection and headers
    // await setupBrowser(context, page);

    // 1. Open chatgpt.com
    // await page.goto("https://chatgpt.com");
    await page.goto("https://bot.sannysoft.com");
    
    await delay(60);

    // 2. Do login before input
    // await login(page);

    // 3. Find the contenteditable div and ask the question
    const inputSelector = 'div#prompt-textarea[contenteditable="true"]';
    await page.waitForSelector(inputSelector, { timeout: 15000 });
    await page.click(inputSelector);
    await page.type(inputSelector, QUESTION, { delay: 50 });
    await page.keyboard.press("Enter");

    // 4. Wait until there are at least 2 copy buttons
    const copyButtonSelector = '[data-testid="copy-turn-action-button"]';
    await page.locator(copyButtonSelector).nth(1).waitFor({ timeout: 120000 });

    // 5. Click the last copy button (latest answer)
    const copyButtons = await page.$$(copyButtonSelector);
    const lastCopyButton = copyButtons[copyButtons.length - 1];
    await lastCopyButton.click();

    // 6. Read the clipboard
    await context.grantPermissions(["clipboard-read"]);
    const clipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    // 7. Save the answer to a txt file
    fs.writeFileSync(OUTPUT_FILE, clipboardText, "utf-8");

    // Optionally, assert the answer is not empty
    expect(clipboardText.trim().length).toBeGreaterThan(0);
  } finally {
    await browser.close();
  }
});
