// The PLACEHOLDER gate (plan L7): run after `npm run build`, before any push to
// production. Fails while the exported site still prints a PLACEHOLDER, which
// is how the held Community page, home teaser and people section are marked
// until the owner supplies the real league details and people.
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = join(import.meta.dirname, "..", "out");
const files = (await readdir(root, { recursive: true })).filter((f) => /\.(html|txt)$/.test(f));
const hits = [];
for (const file of files) {
  const count = (await readFile(join(root, file), "utf8")).split("PLACEHOLDER").length - 1;
  if (count) hits.push(`${file}: ${count}`);
}

if (hits.length) {
  console.error(`PLACEHOLDER gate FAILED - not for production. ${hits.length} exported files still print PLACEHOLDER:\n${hits.join("\n")}`);
  process.exit(1);
}
console.log(`PLACEHOLDER gate clean (${files.length} files checked).`);
