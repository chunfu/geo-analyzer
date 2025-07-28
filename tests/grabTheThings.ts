import { chromium } from "playwright-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import searchAndCopy from "./searchAndCopy";
import { OutputRecord } from "./types";

// Add stealth plugin
chromium.use(StealthPlugin());
const QUESTION =
  "台北有哪些 SEO 公司口碑佳，成功把客戶關鍵字從第 3 頁拉到首頁？";
const OUTPUT_FILE = "geo.csv";
const outputRecords: OutputRecord[] = [];

async function main() {
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
  const page = await context.newPage();

  try {
    await searchAndCopy({ context, page, question: QUESTION, outputRecord: outputRecords[0] });
  } catch (error) {
    await browser.close();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Closing browser...');
  process.exit(0);
});

main().catch(console.error); 