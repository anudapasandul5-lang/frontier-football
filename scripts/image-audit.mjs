// Lists images whose file has fewer pixels than the space they fill on screen.
import p from "puppeteer-core";
const BASE = "http://localhost:3000";
const routes = ["/", "/who-we-are", "/who-we-are/4x4-series", "/events", "/gallery", "/community", "/collaborate", "/contact"];
const b = await p.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", protocolTimeout: 600000 });
const pg = await b.newPage();
await pg.goto(BASE + "/gallery", { waitUntil: "networkidle0", timeout: 120000 });
const albums = await pg.evaluate(() => [...new Set([...document.querySelectorAll('a[href^="/albums/"]')].map((a) => a.getAttribute("href")))]);
const rows = new Map();
for (const [w, h, dpr] of [[1440, 900, 1], [400, 860, 2]]) {
  await pg.setViewport({ width: w, height: h, deviceScaleFactor: dpr });
  await pg.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  for (const r of [...routes, ...albums]) {
    await pg.goto(BASE + r, { waitUntil: "networkidle0", timeout: 120000 });
    const total = await pg.evaluate(() => document.scrollingElement.scrollHeight);
    // Album grids are long; the hero and first screens are what matter.
    for (let y = 0; y < Math.min(total, r.startsWith("/albums/") ? h : total); y += h * 0.8) {
      await pg.evaluate((y) => scrollTo(0, y), y);
      await new Promise((res) => setTimeout(res, 150));
    }
    await pg.evaluate(() => Promise.all([...document.images].map((i) => Promise.race([i.decode().catch(() => {}), new Promise((res) => setTimeout(res, 3000))]))));
    // naturalWidth is divided by the srcset density, so load each file again for its true size.
    const found = await pg.evaluate(async (dpr) => (await Promise.all([...document.images].filter((i) => i.naturalWidth > 0).map(async (i) => {
      const rect = i.getBoundingClientRect();
      if (rect.width < 40) return null;
      const file = new Image();
      file.src = i.currentSrc || i.src;
      await file.decode().catch(() => {});
      if (!file.naturalWidth) return null;
      const fit = getComputedStyle(i).objectFit;
      // Pixels the box needs, for object-fit cover the larger of both axes.
      const scale = fit === "cover" ? Math.max(rect.width / file.naturalWidth, rect.height / file.naturalHeight) : rect.width / file.naturalWidth;
      const need = scale * dpr;
      const src = new URL(file.src).pathname;
      return need > 1.25 ? { src, need: +need.toFixed(2), natural: `${file.naturalWidth}x${file.naturalHeight}`, shown: `${Math.round(rect.width)}x${Math.round(rect.height)}` } : null;
    }))).filter(Boolean), dpr);
    for (const f of found) {
      const key = f.src.replace(/-(800|1200)\.webp$/, ".webp");
      const prev = rows.get(key);
      if (!prev || prev.need < f.need) rows.set(key, { ...f, page: r, screen: `${w}@${dpr}x` });
    }
  }
}
await b.close();
const list = [...rows.entries()].sort((a, b) => b[1].need - a[1].need);
for (const [k, v] of list) console.log(`${v.need}x\t${k}\t${v.natural} shown ${v.shown}\t${v.page} ${v.screen}`);
console.log(`${list.length} images stretched more than 1.25x`);
