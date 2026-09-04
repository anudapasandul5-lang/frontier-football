import { describe, it, expect } from "vitest";
import { imageSize, parseFolder } from "./sync-albums.mjs";

/* The two parsers in the sync script. Everything else in it is network, and
   these are the parts that can be wrong without failing loudly — the PNG branch
   exists because a JPEG-only reader measured nothing for all 502 SZN 1 frames
   and reported it as a clean run. */

function jpeg({ w, h, withDecoyMarker = false }) {
  const parts = [Buffer.from([0xff, 0xd8])];
  if (withDecoyMarker) {
    // An APP1/EXIF segment whose payload contains the ff c0 byte pair. A reader
    // that scans for the pattern rather than walking the segment lengths finds
    // this and returns garbage.
    const payload = Buffer.from([0xff, 0xc0, 0x00, 0x11, 0x08, 0x99, 0x99, 0x99, 0x99]);
    const seg = Buffer.alloc(2 + 2 + payload.length);
    seg.writeUInt16BE(0xffe1, 0);
    seg.writeUInt16BE(2 + payload.length, 2);
    payload.copy(seg, 4);
    parts.push(seg);
  }
  const sof = Buffer.alloc(11);
  sof.writeUInt16BE(0xffc0, 0);
  sof.writeUInt16BE(9, 2);
  sof.writeUInt8(8, 4);
  sof.writeUInt16BE(h, 5);
  sof.writeUInt16BE(w, 7);
  parts.push(sof);
  return Buffer.concat(parts);
}

function png({ w, h }) {
  const b = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(b, 0);
  b.writeUInt32BE(13, 8);
  b.write("IHDR", 12);
  b.writeUInt32BE(w, 16);
  b.writeUInt32BE(h, 20);
  return b;
}

describe("imageSize", () => {
  it("reads a JPEG", () => {
    expect(imageSize(jpeg({ w: 400, h: 267 }))).toEqual({ w: 400, h: 267 });
  });

  // SZN 1 is a PNG album and every other album is JPEG.
  it("reads a PNG", () => {
    expect(imageSize(png({ w: 400, h: 599 }))).toEqual({ w: 400, h: 599 });
  });

  it("keeps portrait portrait in both formats", () => {
    expect(imageSize(jpeg({ w: 400, h: 599 }))).toEqual({ w: 400, h: 599 });
    expect(imageSize(png({ w: 400, h: 599 }))).toEqual({ w: 400, h: 599 });
  });

  it("walks past a marker pattern buried in an EXIF payload", () => {
    expect(imageSize(jpeg({ w: 400, h: 267, withDecoyMarker: true }))).toEqual({ w: 400, h: 267 });
  });

  it("returns null rather than guessing", () => {
    expect(imageSize(Buffer.alloc(0))).toBe(null);
    expect(imageSize(Buffer.from("<!doctype html><html>"))).toBe(null);
    // A JPEG truncated before its SOF: better no dimensions than wrong ones.
    expect(imageSize(Buffer.from([0xff, 0xd8, 0xff, 0xe0]))).toBe(null);
  });
});

describe("parseFolder", () => {
  const entry = (id, title) =>
    `<div class="flip-entry" id="entry-${id}" tabindex="0"><div class="flip-entry-title">${title}</div></div>`;

  it("pairs each file id with its own name", () => {
    expect(parseFolder(entry("1AAA", "DSC_0289.jpg") + entry("1BBB", "DSC_0290.jpg"))).toEqual([
      { id: "1AAA", name: "DSC_0289.jpg" },
      { id: "1BBB", name: "DSC_0290.jpg" },
    ]);
  });

  // The failure the split guards against: an entry with no title must not
  // borrow the next entry's name and shift every pair after it by one.
  it("does not let a nameless entry steal the next name", () => {
    const html = '<div id="entry-1AAA"></div>' + entry("1BBB", "DSC_0290.jpg");
    expect(parseFolder(html)).toEqual([
      { id: "1AAA", name: "" },
      { id: "1BBB", name: "DSC_0290.jpg" },
    ]);
  });

  it("is empty for a page with no entries", () => {
    expect(parseFolder("<html><body>Sorry, unable to open the file.</body></html>")).toEqual([]);
  });
});
