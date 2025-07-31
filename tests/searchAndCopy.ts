import { BrowserContext, Page } from "playwright";
import { OutputRecord } from "./types";

const searchAndCopy = async ({
  context,
  page,
  question,
  outputRecord,
}: {
  context: BrowserContext;
  page: Page;
  question: string;
  outputRecord: OutputRecord;
}) => {
  try {
    // 1. Navigate to ChatGPT
    await page.goto("https://chatgpt.com");

    // 2. Find the contenteditable div and ask the question
    const inputSelector = 'div#prompt-textarea[contenteditable="true"]';
    await page.waitForSelector(inputSelector, { timeout: 15000 });
    await page.click(inputSelector);
    await page.type(inputSelector, question, { delay: 50 });
    await page.keyboard.press("Enter");

    // 3. Wait for the response and find the copy button (previous sibling of edit button)
    const editButtonSelector = 'button[aria-label="Edit in canvas"]';
    await page.waitForSelector(editButtonSelector, { timeout: 120000 });
    
    // 3.5. Scroll to the bottom to ensure buttons are visible
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    
    // 4. Find the copy button (previous sibling of the edit button)
    const copyButton = await page.locator(editButtonSelector).first().locator('xpath=preceding-sibling::button').first();
    await copyButton.waitFor({ timeout: 10000 });
    await copyButton.click();

    // 5. Read the clipboard
    await context.grantPermissions(["clipboard-read"]);
    const clipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    // 6. Update the outputRecord object with the data
    outputRecord.query = question;
    outputRecord.chatgpt = clipboardText;

  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  }
};

export default searchAndCopy;
