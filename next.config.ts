import type { NextConfig } from "next";

// Static export: `next build` writes plain files to out/, and each route lands
// as about.html etc. (trailingSlash off), so every v1 URL keeps resolving.
// The default next/image loader cannot run without a server, hence unoptimized.
const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default config;
