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

    // 3. Wait until there are at least 2 copy buttons
    const copyButtonSelector = '[data-testid="copy-turn-action-button"]';
    await page.locator(copyButtonSelector).nth(1).waitFor({ timeout: 120000 });

    // 4. Click the last copy button (latest answer)
    const copyButtons = await page.$$(copyButtonSelector);
    const lastCopyButton = copyButtons[copyButtons.length - 1];
    await lastCopyButton.click();

    // 5. Read the clipboard
    await context.grantPermissions(["clipboard-read"]);
    const clipboardText = await page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    // 6. Save the answer to a txt file
    // fs.writeFileSync(outputFile, clipboardText, "utf-8");

  } catch (error) {
    console.error("❌ Error:", error.message);
    throw error;
  }
};

export default searchAndCopy;
