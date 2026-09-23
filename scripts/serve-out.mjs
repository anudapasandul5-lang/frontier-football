// Serves the static export in out/ the way a static host would: /about finds
// about.html. For the owner's phone over LAN and for Lighthouse, which must
// measure the exported files rather than `next dev`.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { gzipSync } from "node:zlib";

// OUT_DIR lets QA serve a variant of the export (e.g. scripts stripped for the JS-off check).
const root = join(import.meta.dirname, "..", process.env.OUT_DIR ?? "out");
const port = Number(process.env.PORT ?? 4173);
const types = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".webp": "image/webp", ".png": "image/png",
  ".jpg": "image/jpeg", ".svg": "image/svg+xml", ".mp4": "video/mp4",
  ".woff2": "font/woff2", ".txt": "text/plain", ".ico": "image/x-icon",
};

async function resolve(path) {
  for (const candidate of [path, `${path}.html`, join(path, "index.html")]) {
    const s = await stat(candidate).catch(() => null);
    if (s?.isFile()) return candidate;
  }
  return null;
}

createServer(async (req, res) => {
  let path;
  try {
    path = normalize(join(root, decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname)));
  } catch {
    return res.writeHead(400).end();
  }
  // Prefix check on root + separator: a bare startsWith(root) also admits a
  // sibling such as out-old/. This server listens on the LAN.
  if (path !== root && !path.startsWith(root + sep)) return res.writeHead(403).end();
  const file = (await resolve(path)) ?? join(root, "404.html");
  const body = await readFile(file).catch(() => null);
  if (!body) return res.writeHead(404).end("Not found");
  // Compress text and cache hashed assets as any static host does, so
  // Lighthouse measures the site as it will be served, not this script.
  const text = /\.(html|js|css|json|svg|txt)$/.test(file);
  const gzip = text && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "");
  res.writeHead(file.endsWith("404.html") && !path.endsWith("404") ? 404 : 200, {
    // The OG cards export without an extension; vercel.json types them too.
    "content-type": file.endsWith("opengraph-image") ? "image/jpeg" : (types[extname(file)] ?? "application/octet-stream"),
    ...(gzip && { "content-encoding": "gzip", vary: "accept-encoding" }),
    ...(file.includes(`${sep}_next${sep}static${sep}`) && { "cache-control": "public, max-age=31536000, immutable" }),
  });
  res.end(gzip ? gzipSync(body) : body);
}).listen(port, "0.0.0.0", () => console.log(`out/ on http://localhost:${port}`));
