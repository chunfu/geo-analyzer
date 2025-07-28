import { BrowserContext, Page } from "@playwright/test";

export async function setupBrowser(context: BrowserContext, page: Page) {
  // Set viewport to match real browser
  await page.setViewportSize({ width: 1168, height: 968 });

  // Set user agent and headers to match real browser
  await page.setExtraHTTPHeaders({
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br, zstd",
    DNT: "1",
    "Sec-GPC": "1",
    "Upgrade-Insecure-Requests": "1",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Cache-Control": "max-age=0",
  });

  // Configure browser to appear more human-like with built-in stealth
  await context.addInitScript(() => {
    // Remove automation flags (Playwright handles some of this automatically)
    Object.defineProperty(navigator, "webdriver", { get: () => undefined });
    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en"],
    });
    
    // Additional stealth measures
    Object.defineProperty(navigator, "permissions", {
      get: () => ({
        query: () => Promise.resolve({ state: "granted" }),
      }),
    });
    
    // Remove any automation-related properties
    delete (window as any).navigator.__proto__.webdriver;
    
    // Mock chrome runtime
    if (!(window as any).chrome) {
      (window as any).chrome = {
        runtime: {},
      };
    }
  });
}
