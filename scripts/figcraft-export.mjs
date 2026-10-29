// Export the running site into FigCraft files, one per screen size, one frame per page.
// Usage: node scripts/figcraft-export.mjs <outDir> [baseUrl]   (needs `npm run dev` or start running)
// Layout is read from headless Chrome with reduced motion. Photos, SVG icons and gradients are
// rendered alone by Chrome to PNG so crops, filters and colours match; boxes and text stay editable.
// shortcut: web fonts are not installed, so headings use Bahnschrift Condensed, body Arial and
// serif Times New Roman; install the real fonts and change FONT_MAP to match exactly.
import puppeteer from "puppeteer-core";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.argv[2] ?? "docs/figcraft");
const BASE = process.argv[3] ?? "http://localhost:3000";
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const CLI = "C:/Program Files/FigCraft/figcraft-cli.exe";
const ROUTES = [
  ["Home", "/"],
  ["Who We Are", "/who-we-are"],
  ["Events", "/events"],
  ["Gallery", "/gallery"],
  ["Community", "/community"],
  ["Collaborate", "/collaborate"],
  ["Contact", "/contact"],
  ["4 x 4 Series", "/who-we-are/4x4-series"],
];
const SIZES = [
  ["desktop", 1440, 900],
  ["phone", 400, 860],
];

function fontFor(family, weight, italic) {
  const f = family.toLowerCase();
  if (f.includes("bricolage") || f.includes("arial narrow")) {
    const w = weight >= 700 ? "Bold " : weight >= 600 ? "SemiBold " : "";
    return ["Bahnschrift", `${w}Condensed`];
  }
  const bold = weight >= 600;
  if (f.includes("instrument") || f.includes("serif") && !f.includes("sans")) {
    return ["Times New Roman", [bold && "Bold", italic && "Italic"].filter(Boolean).join(" ") || "Regular"];
  }
  return ["Arial", [bold && "Bold", italic && "Italic"].filter(Boolean).join(" ") || "Regular"];
}

// Runs inside the page: returns layers in paint order, page coordinates.
function collect() {
  const ctx = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  const rgba = (c) => {
    if (!c || c === "transparent") return null;
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = c;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return null;
    return { hex: "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join(""), a: a / 255 };
  };
  const sx = scrollX, sy = scrollY;
  const box = (r) => ({ x: r.left + sx, y: r.top + sy, w: r.width, h: r.height });
  const items = [], fixed = [];
  const isInline = (d) => d === "inline" || d === "contents";
  const hidden = (el, cs) => {
    const r = el.getBoundingClientRect();
    return (r.width <= 1 && r.height <= 1) || cs.clip === "rect(0px, 0px, 0px, 0px)" || cs.clipPath === "inset(50%)";
  };
  const clipOf = (el) => {
    let c = { x: -1e6, y: -1e6, x2: 1e6, y2: 1e6 };
    for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflowX !== "visible" || cs.overflowY !== "visible") {
        const b = box(p.getBoundingClientRect());
        c = { x: Math.max(c.x, b.x), y: Math.max(c.y, b.y), x2: Math.min(c.x2, b.x + b.w), y2: Math.min(c.y2, b.y + b.h) };
      }
      if (cs.position === "fixed") break;
    }
    return c;
  };
  const clipped = (b, c) => {
    const x = Math.max(b.x, c.x), y = Math.max(b.y, c.y);
    const w = Math.min(b.x + b.w, c.x2) - x, h = Math.min(b.y + b.h, c.y2) - y;
    return w > 1 && h > 1 ? { x, y, w, h } : null;
  };

  function textFlow(el, out, state) {
    for (const n of el.childNodes) {
      if (n.nodeType === 3) {
        const p = n.parentElement, cs = getComputedStyle(p);
        if (cs.visibility === "hidden") continue;
        const re = /\S+/g;
        let m;
        while ((m = re.exec(n.data))) {
          const range = document.createRange();
          range.setStart(n, m.index);
          range.setEnd(n, m.index + m[0].length);
          const r = range.getClientRects()[0];
          if (!r || r.width === 0) continue;
          const space = m.index > 0 ? /\s/.test(n.data[m.index - 1]) : state.trailingSpace;
          let word = m[0];
          if (cs.textTransform === "uppercase") word = word.toUpperCase();
          if (cs.textTransform === "lowercase") word = word.toLowerCase();
          out.push({ word, space, r, p });
        }
        if (n.data.length) state.trailingSpace = /\s$/.test(n.data);
      } else if (n.nodeType === 1) {
        const cs = getComputedStyle(n);
        if (cs.display === "none" || !isInline(cs.display) || hidden(n, cs) || ["svg", "IMG", "BR"].includes(n.nodeName)) {
          if (n.nodeName === "BR") state.trailingSpace = true;
          continue;
        }
        textFlow(n, out, state);
      }
    }
  }

  function emitText(el, op, list) {
    const words = [];
    textFlow(el, words, { trailingSpace: false });
    if (!words.length) return;
    const lines = [];
    for (const w of words) {
      const line = lines.at(-1);
      if (line && Math.abs(w.r.top - line.top) < w.r.height * 0.5) line.words.push(w);
      else lines.push({ top: w.r.top, words: [w] });
    }
    const cs = getComputedStyle(words[0].p);
    const size = parseFloat(cs.fontSize);
    const lh = cs.lineHeight === "normal" ? size * 1.2 : parseFloat(cs.lineHeight);
    const col = rgba(cs.color);
    if (!col) return;
    const left = Math.min(...words.map((w) => w.r.left));
    const right = Math.max(...words.map((w) => w.r.right));
    const text = lines.map((l) => l.words.map((w, i) => (i && w.space ? " " : "") + w.word).join("")).join("\n");
    list.push({
      t: "text", text,
      x: left + sx, y: words[0].r.top + sy - (lh - words[0].r.height) / 2, w: right - left,
      size, lh, ls: cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing),
      family: cs.fontFamily, weight: +cs.fontWeight, italic: cs.fontStyle === "italic",
      align: lines.length > 1 && ["center", "right"].includes(cs.textAlign) ? cs.textAlign : "left",
      color: col.hex, op: op * col.a, name: text.slice(0, 40),
    });
  }

  function isoHtml(el, b, vis) {
    if (el.nodeName === "IMG") {
      const cs = getComputedStyle(el);
      return `<img src="${el.currentSrc || el.src}" style="position:absolute;left:${b.x - vis.x}px;top:${b.y - vis.y}px;width:${b.w}px;height:${b.h}px;object-fit:${cs.objectFit};object-position:${cs.objectPosition};filter:${cs.filter};border-radius:${cs.borderRadius}">`;
    }
    if (el.nodeName.toLowerCase() === "svg") {
      const clone = el.cloneNode(true);
      const src = [el, ...el.querySelectorAll("*")], dst = [clone, ...clone.querySelectorAll("*")];
      src.forEach((s, i) => {
        const cs = getComputedStyle(s);
        for (const k of ["fill", "stroke", "stroke-width", "opacity", "fill-opacity", "stroke-opacity", "stroke-linecap", "stroke-linejoin"]) {
          dst[i].setAttribute(k, cs.getPropertyValue(k));
        }
      });
      clone.setAttribute("width", b.w);
      clone.setAttribute("height", b.h);
      clone.setAttribute("style", `position:absolute;left:${b.x - vis.x}px;top:${b.y - vis.y}px;color:${getComputedStyle(el).color}`);
      return clone.outerHTML;
    }
    const cs = getComputedStyle(el);
    return `<div style="position:absolute;left:${b.x - vis.x}px;top:${b.y - vis.y}px;width:${b.w}px;height:${b.h}px;background:${cs.background};border-radius:${cs.borderRadius}"></div>`;
  }

  function walk(el, op, list) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") return;
    if (["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "HEAD"].includes(el.nodeName)) return;
    op *= parseFloat(cs.opacity);
    if (op < 0.03 || hidden(el, cs)) return;
    if (cs.position === "fixed" && list !== fixed) return walk.call(null, el, op / parseFloat(cs.opacity), fixed);
    const r = el.getBoundingClientRect();
    const b = box(r);
    const name = el.nodeName.toLowerCase();
    if (name === "img" || name === "svg" || name === "canvas" || name === "video" || name === "iframe") {
      const vis = clipped(b, clipOf(el));
      if (vis) list.push({ t: name === "img" || name === "svg" ? "iso" : "shot", ...vis, op, html: name === "img" || name === "svg" ? isoHtml(el, b, vis) : null, name });
      return;
    }
    const bg = rgba(cs.backgroundColor);
    const sides = ["Top", "Right", "Bottom", "Left"].map((s) => (cs[`border${s}Style`] !== "none" ? parseFloat(cs[`border${s}Width`]) : 0));
    const bc = sides.some(Boolean) ? rgba(cs.borderTopColor) || rgba(cs.borderBottomColor) || rgba(cs.borderLeftColor) : null;
    const vis = clipped(b, clipOf(el));
    if (vis && cs.backgroundImage !== "none") {
      list.push({ t: "iso", ...vis, op: op * (bg ? 1 : 1), html: isoHtml(el, b, vis), name: "background" });
    } else if (vis && (bg || bc)) {
      const radius = parseFloat(cs.borderTopLeftRadius) || 0;
      list.push({ t: "rect", x: b.x, y: b.y, w: b.w, h: b.h, fill: bg?.hex ?? null, fillA: bg?.a ?? 1, op, radius, stroke: bc?.hex ?? null, strokeA: bc?.a ?? 1, sides, name: el.id || el.className?.toString().split(" ")[0] || name });
    }
    if ((name === "input" || name === "textarea") && (el.value || el.placeholder) && el.type !== "hidden") {
      const ph = !el.value;
      const pcs = ph ? getComputedStyle(el, "::placeholder") : cs;
      const col = rgba(pcs.color);
      const size = parseFloat(cs.fontSize);
      if (col) list.push({ t: "text", text: el.value || el.placeholder, x: b.x + parseFloat(cs.paddingLeft), y: name === "textarea" ? b.y + parseFloat(cs.paddingTop) : b.y + (b.h - size * 1.2) / 2, w: b.w, size, lh: size * 1.2, ls: 0, family: cs.fontFamily, weight: +cs.fontWeight, italic: false, align: "left", color: col.hex, op: op * col.a, name: el.name || name });
      return;
    }
    if (!isInline(cs.display)) emitText(el, op, list);
    for (const c of el.children) walk(c, op, list);
  }
  walk(document.body, 1, items);
  const root = document.scrollingElement;
  return {
    items: [...items, ...fixed],
    height: Math.max(root.scrollHeight, document.body.scrollHeight),
    bg: rgba(getComputedStyle(document.body).backgroundColor)?.hex ?? "#ffffff",
  };
}

async function exportSize(browser, [label, width, height]) {
  const assets = path.join(OUT, "assets", label);
  fs.mkdirSync(assets, { recursive: true });
  const context = await browser.createBrowserContext();
  const page = await context.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 2 });
  await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  const iso = await context.newPage();
  await iso.setViewport({ width: 2000, height: 2000, deviceScaleFactor: 2 });
  await iso.setContent(`<base href="${BASE}"><style>html,body{margin:0;background:transparent}</style><div id="h" style="position:relative"></div>`);
  const steps = [{ command: "page.rename", params: { name: `${label} ${width}px` } }];
  let id = 2, frameX = 0, images = 0;
  for (const [title, route] of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "networkidle0", timeout: 120000 });
    // Scroll through so lazy images and reveal-on-scroll sections load, then back to the top.
    const total = await page.evaluate(() => document.scrollingElement.scrollHeight);
    for (let y = 0; y < total; y += height * 0.7) {
      await page.evaluate((y) => scrollTo(0, y), y);
      await sleep(120);
    }
    await page.evaluate(() => scrollTo(0, 0));
    // A lazy image that never loads would make decode() wait forever, so force eager and cap the wait.
    await page.evaluate(() => {
      const wait = (p) => Promise.race([p.catch(() => {}), new Promise((r) => setTimeout(r, 5000))]);
      return Promise.all([...document.images].map((i) => ((i.loading = "eager"), wait(i.decode()))));
    });
    await sleep(800);
    console.log(`${label} ${title}: reading layout`);
    const { items, height: pageH, bg } = await page.evaluate(collect);
    const slug = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
    const frame = id++;
    steps.push({ command: "frame.create", params: { x: frameX, y: 0, width, height: Math.ceil(pageH), name: title, props: { fill: bg, clip: true } } });
    for (const it of items) {
      if (it.y > pageH || it.x > width || it.x + it.w < 0) continue;
      if (it.t === "rect") {
        const props = { name: it.name, opacity: +it.op.toFixed(3), fill: it.fill ? it.fill : "none" };
        if (it.fill && it.fillA < 1) props.opacity = +(it.op * it.fillA).toFixed(3);
        if (it.radius) props.cornerRadius = Math.min(it.radius, it.w / 2, it.h / 2);
        if (it.stroke) {
          props.stroke = it.stroke;
          props.strokeAlign = "inside";
          const [t, r, b, l] = it.sides;
          if (t === r && r === b && b === l) props.strokeWeight = t;
          else Object.assign(props, { strokeTopWeight: t, strokeRightWeight: r, strokeBottomWeight: b, strokeLeftWeight: l });
        }
        steps.push({ command: "node.create", params: { type: "rectangle", x: it.x, y: it.y, width: it.w, height: it.h, parent: frame, props } });
      } else if (it.t === "text") {
        const [fontFamily, fontStyle] = fontFor(it.family, it.weight, it.italic);
        steps.push({
          command: "text.create",
          params: {
            text: it.text, x: it.x, y: it.y, parent: frame,
            props: { name: it.name, fontFamily, fontStyle, fontSize: it.size, lineHeight: it.lh, letterSpacing: it.ls, textAlign: it.align, fill: it.color, opacity: +it.op.toFixed(3), textAutoResize: "widthAndHeight" },
          },
        });
      } else {
        const file = path.join(assets, `${slug}-${++images}.png`);
        if (it.t === "shot") {
          const top = await page.evaluate((y) => (scrollTo(0, y), scrollY), it.y);
          await sleep(150);
          await page.screenshot({ path: file, clip: { x: it.x, y: it.y - top, width: it.w, height: Math.min(it.h, height) } });
          await page.evaluate(() => scrollTo(0, 0));
        } else {
          await iso.evaluate(({ html, w, h, op }) => {
            const holder = document.getElementById("h");
            holder.style.cssText = `position:relative;overflow:hidden;width:${w}px;height:${h}px;opacity:${op}`;
            holder.innerHTML = html;
            const wait = (p) => Promise.race([p.catch(() => {}), new Promise((r) => setTimeout(r, 5000))]);
            return Promise.all([...holder.querySelectorAll("img")].map((i) => wait(i.decode())));
          }, it);
          await (await iso.$("#h")).screenshot({ path: file, omitBackground: true });
        }
        steps.push({ command: "image.place", params: { path: file.replaceAll("\\", "/"), x: it.x, y: it.y, width: it.w, height: it.h, parent: frame, mode: "fill" } });
      }
      id++;
    }
    console.log(`${label} ${title}: ${items.length} layers`);
    frameX += width + 200;
  }
  await context.close();
  const script = path.join(OUT, `frontier-website-${label}.json`);
  const outFile = path.join(OUT, `frontier-website-${label}.figcraft`);
  fs.writeFileSync(script, JSON.stringify(steps));
  execFileSync(CLI, ["run", script, "--out", outFile], { stdio: ["ignore", "ignore", "inherit"], maxBuffer: 1 << 30 });
  console.log(`wrote ${outFile}`);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, protocolTimeout: 600000 });
try {
  for (const size of SIZES) await exportSize(browser, size);
} finally {
  await browser.close();
}
