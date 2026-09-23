import { describe, expect, it } from "vitest";
import { countFrame, parseCountFigure } from "./count-up";

describe("parseCountFigure", () => {
  it("keeps decimal precision and the complete suffix", () => {
    expect(parseCountFigure("3.4M+")).toEqual({ value: 3.4, decimals: 1, suffix: "M+" });
  });

  it("parses whole-number figures", () => {
    expect(parseCountFigure("400+")).toEqual({ value: 400, decimals: 0, suffix: "+" });
  });

  it("rejects a figure with a thousands separator rather than counting its first digits", () => {
    expect(parseCountFigure("1,200+")).toBeNull();
  });

  it("rejects copy that is not a count", () => {
    expect(parseCountFigure("Sold out")).toBeNull();
  });
});

describe("countFrame", () => {
  it("formats an intermediate decimal frame", () => {
    expect(countFrame("3.4M+", 0.5)).toBe("1.7M+");
  });

  it("returns the exact source at the final frame", () => {
    expect(countFrame("3.4M+", 1)).toBe("3.4M+");
  });

  it("leaves an unparseable figure unchanged", () => {
    expect(countFrame("Sold out", 0.5)).toBe("Sold out");
  });
});
