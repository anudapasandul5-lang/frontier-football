import { chromium } from "/opt/node-tools/node_modules/playwright/index.mjs";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
const page = await (await b.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 })).newPage();
for (const plate of [1,2,3]) for (const bg of [1,0]) {
  await page.goto(`file://${process.cwd()}/plates.html?plate=${plate}&bg=${bg}`);
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(400);
  await page.screenshot({ path: `out/plate-0${plate}${bg ? "" : "-transparent"}.png`, omitBackground: !bg });
}
await b.close();
