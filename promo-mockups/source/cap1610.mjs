import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
import { mkdirSync } from "node:fs";
mkdirSync("out/d1610", { recursive: true });
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
for (const p of ["", "who-we-are", "events", "gallery", "community", "collaborate", "contact"]) {
  const page = await ctx.newPage(); await page.goto("http://localhost:4173/" + p); await page.waitForLoadState("networkidle");
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(80); }
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(900);
  await page.screenshot({ path: `out/d1610/${p || "home"}.png` }); await page.close();
}
await b.close();
