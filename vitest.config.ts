import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// The "@/" alias tsconfig gives Next, so a component test can import what the
// component imports.
export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL(".", import.meta.url)) } },
});
