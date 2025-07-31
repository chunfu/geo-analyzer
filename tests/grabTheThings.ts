import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import searchAndCopy from "./searchAndCopy";
import { OutputRecord } from "./types";
import fs from "fs";
import { Page } from "playwright";

// Add stealth plugin
chromium.use(StealthPlugin());
const OUTPUT_FILE = "geo.csv";

// Function to read questions from file
const readQuestions = (): string[] => {
  try {
    const content = fs.readFileSync("tests/questions.txt", "utf-8");
    return content.split("\n").filter(line => line.trim() !== "");
  } catch (error) {
    console.error("❌ Error reading questions.txt:", error);
    return [];
  }
};

// Function to convert OutputRecord array to CSV
const exportToCSV = (records: OutputRecord[]): string => {
  const headers = [
    "no", "query", "aio", "aioBrandCompare", "aioBrandExist", 
    "chatgpt", "chatgptOfficialWebsiteExist", "chatgptReference", 
    "chatgptBrandCompare", "chatgptBrandExist", "brandRelated", 
    "contentAnalysis", "optimizeDirection", "answerEngine"
  ];
  
  const csvRows = [headers.join(",")];
  
  records.forEach(record => {
    const row = headers.map(header => {
      const value = record[header as keyof OutputRecord];
      // Escape commas and quotes in CSV
      const escapedValue = String(value || "").replace(/"/g, '""');
      return `"${escapedValue}"`;
    });
    csvRows.push(row.join(","));
  });
  
  return csvRows.join("\n");
};

async function main() {
  // Read questions from file
  const questions = readQuestions();
  console.log(`📝 Loaded ${questions.length} questions from questions.txt`);
  
  if (questions.length === 0) {
    console.error("❌ No questions found, exiting...");
    return;
  }

  // Initialize outputRecords array
  const outputRecords: OutputRecord[] = questions.map((_, index) => ({
    no: index + 1,
    query: "",
    aio: "",
    aioBrandCompare: false,
    aioBrandExist: false,
    chatgpt: "",
    chatgptOfficialWebsiteExist: false,
    chatgptReference: "",
    chatgptBrandCompare: false,
    chatgptBrandExist: false,
    brandRelated: "",
    contentAnalysis: "",
    optimizeDirection: "",
    answerEngine: ""
  }));

  // Launch browser with stealth
  const browser = await chromium.launch({ 
    headless: false,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--disable-features=VizDisplayCompositor',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--ignore-certificate-errors',
      '--ignore-ssl-errors',
      '--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
    ],
    ignoreDefaultArgs: ['--enable-automation']
  });
  
  const context = await browser.newContext();
  let page: Page;

  try {
    // Loop through all questions
    for (let i = 0; i < questions.length; i++) {
      page = await context.newPage();
      const question = questions[i];
      const outputRecord = outputRecords[i];
      
      console.log(`\n🔄 Processing question ${i + 1}/${questions.length}: ${question.substring(0, 50)}...`);
      
      try {
        await searchAndCopy({ 
          context, 
          page, 
          question, 
          outputRecord 
        });
        
        console.log(`✅ Completed question ${i + 1}`);
        
        // Add a small delay between requests to avoid rate limiting
        if (i < questions.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
      } catch (error) {
        console.error(`❌ Error processing question ${i + 1}:`, error.message);
        // Continue with next question instead of stopping
      }

      await page.close();
    }
    
    // Export to CSV
    console.log(`\n💾 Exporting ${outputRecords.length} records to ${OUTPUT_FILE}...`);
    const csvContent = exportToCSV(outputRecords);
    fs.writeFileSync(OUTPUT_FILE, csvContent, "utf-8");
    console.log(`✅ Successfully exported to ${OUTPUT_FILE}`);
    
  } catch (error) {
    console.error("❌ Fatal error:", error);
  } finally {
    await browser.close();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Closing browser...');
  process.exit(0);
});

main().catch(console.error); 