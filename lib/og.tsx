import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";

/* The branded link-preview card (plan L6b): a real photo, full bleed, under a
   night scrim, with the page or album title in the condensed display face.
   Rendered once at build time by each route's opengraph-image.tsx.

   Two workarounds, both for next/og's renderer: it cannot decode WebP, so
   sharp re-encodes the photo as JPEG; and it ignores variable-font axes, so
   the headline face is a static Bricolage cut at wdth 75 / wght 700 (the
   site's headline setting), instanced with fontTools into assets/og/. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/jpeg";
export const siteDescription = "Frontier Football is Sri Lanka’s football community. Tournaments, Sunday League and the culture around the game, in Colombo.";

const fontData = readFile(join(process.cwd(), "assets/og/bricolage-75-700.ttf"));

async function dataUri(publicPath: string, width: number, height: number, fit: "cover" | "inside") {
  const buffer = await sharp(join(process.cwd(), "public", publicPath))
    .resize(width, height, { fit, position: "attention" })
    .flatten({ background: "#0b0e13" })
    .jpeg({ quality: 82 })
    .toBuffer();
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

export async function ogCard({ title, photo }: { title: string; photo: string }) {
  const [font, background, crest] = await Promise.all([
    fontData,
    dataUri(photo, ogSize.width, ogSize.height, "cover"),
    sharp(join(process.cwd(), "public/crest.webp")).resize({ height: 96 }).png().toBuffer(),
  ]);
  const long = title.length > 18;
  const png = new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#0b0e13", position: "relative" }}>
        <img src={background} width={ogSize.width} height={ogSize.height} style={{ position: "absolute", top: 0, left: 0, objectFit: "cover" }} />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: ogSize.width,
            height: ogSize.height,
            display: "flex",
            backgroundImage: "linear-gradient(20deg, rgba(11,14,19,0.95) 0%, rgba(11,14,19,0.7) 45%, rgba(11,14,19,0.1) 100%)",
          }}
        />
        <div style={{ position: "absolute", top: 0, left: 0, width: ogSize.width, height: ogSize.height, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 64 }}>
          <img src={`data:image/png;base64,${crest.toString("base64")}`} width={79} height={96} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 22, letterSpacing: 4, color: "#faba2a", textTransform: "uppercase" }}>Frontier Football</div>
            <div
              style={{
                marginTop: 12,
                maxWidth: 1000,
                fontSize: long ? 108 : 150,
                lineHeight: 0.86,
                color: "#efeae0",
                textTransform: "uppercase",
              }}
            >
              {title}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...ogSize, fonts: [{ name: "Bricolage", data: font, weight: 700, style: "normal" }] },
  );
  // next/og only writes PNG, about 1.3 MB with a photo in it; WhatsApp drops
  // previews that heavy. The same pixels as a JPEG are a tenth of the size.
  const jpeg = await sharp(Buffer.from(await png.arrayBuffer())).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  return new Response(new Uint8Array(jpeg), { headers: { "content-type": ogContentType } });
}
