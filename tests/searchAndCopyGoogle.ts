import { BrowserContext, Page } from "playwright";
import { OutputRecord } from "./types";

const searchAndCopyGoogle = async ({
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
    // 1. Navigate to Google
    await page.goto("https://google.com");

    // 2. Find the search input and type the question
    const searchInputSelector = 'textarea[name="q"], input[name="q"]';
    await page.waitForSelector(searchInputSelector, { timeout: 15000 });
    await page.click(searchInputSelector);
    await page.type(searchInputSelector, question, { delay: 50 });
    await page.keyboard.press("Enter");

    // 3. Wait for search results to load
    await page.waitForSelector('#search', { timeout: 10000 });

    // 4. Look for AI summary/featured snippets
    const aiSummarySelectors = [
      // Google's AI-generated summary box
      '[data-ved] [data-ved] div[data-ved]',
      // Featured snippets
      '.g .VwiC3b',
      // Knowledge graph
      '.kno-rdesc',
      // People also ask
      '.related-question-pair',
      // AI-powered search results
      '[data-ved] .VwiC3b',
      // Summary cards
      '.ULSxyf'
    ];

    let aiSummary = "";
    
    // Try to find AI summary from various selectors
    for (const selector of aiSummarySelectors) {
      try {
        const summaryElement = await page.locator(selector).first();
        const isVisible = await summaryElement.isVisible();
        
        if (isVisible) {
          aiSummary = await summaryElement.textContent();
          if (aiSummary && aiSummary.trim().length > 0) {
            console.log("✅ Found AI summary from Google");
            break;
          }
        }
      } catch (error) {
        // Continue to next selector if this one fails
        continue;
      }
    }

    // 5. If no AI summary found, get the first few search result snippets
    if (!aiSummary || aiSummary.trim().length === 0) {
      try {
        const searchResults = await page.locator('.g .VwiC3b').all();
        const snippets = [];
        
        for (let i = 0; i < Math.min(3, searchResults.length); i++) {
          const snippet = await searchResults[i].textContent();
          if (snippet && snippet.trim().length > 0) {
            snippets.push(snippet.trim());
          }
        }
        
        aiSummary = snippets.join(" | ");
        console.log("📝 Using search result snippets as summary");
      } catch (error) {
        console.log("⚠️ Could not extract search result snippets");
      }
    }

    // 6. Update the outputRecord with AI summary
    outputRecord.aio = aiSummary || "No AI summary found";

  } catch (error) {
    console.error("❌ Error in Google search:", error.message);
    outputRecord.aio = "Error during Google search";
  }
};

export default searchAndCopyGoogle; 