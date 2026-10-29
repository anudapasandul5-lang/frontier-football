// Full-page phone screenshots of every page, for a mobile QA pass.
// Usage: node scripts/mobile-shots.mjs <outDir> [baseUrl]
import puppeteer from "puppeteer-core";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.argv[2] ?? "mobile-shots");
const BASE = process.argv[3] ?? "http://localhost:3000";
const routes = ["/", "/who-we-are", "/who-we-are/4x4-series", "/events", "/gallery", "/community", "/collaborate", "/contact", "/albums/szn-6"];
fs.mkdirSync(OUT, { recursive: true });
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", protocolTimeout: 600000 });
const page = await browser.newPage();
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
for (const r of routes) {
  await page.goto(BASE + r, { waitUntil: "networkidle0", timeout: 120000 });
  // Walk down so lazy images and reveals load, then back to the top.
  const total = await page.evaluate(() => document.scrollingElement.scrollHeight);
  for (let y = 0; y < total; y += 600) {
    await page.evaluate((y) => scrollTo(0, y), y);
    await new Promise((res) => setTimeout(res, 120));
  }
  await page.evaluate(() => scrollTo(0, 0));
  await new Promise((res) => setTimeout(res, 800));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const name = r === "/" ? "home" : r.slice(1).replaceAll("/", "-");
  await page.screenshot({ path: path.join(OUT, `${name}.png`), fullPage: true });
  console.log(`${name}: height ${total}px, sideways overflow ${overflow}px`);
}
await browser.close();
