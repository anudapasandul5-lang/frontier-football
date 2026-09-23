import { describe, expect, it } from "vitest";
import { claimIntro, introScript } from "./intro";

function memoryStorage(seed: Record<string, string> = {}) {
  const map = new Map(Object.entries(seed));
  return {
    getItem: (key: string) => map.get(key) ?? null,
    setItem: (key: string, value: string) => void map.set(key, value),
  };
}

describe("claimIntro", () => {
  it("plays on a first visit and marks the visit, so a reload does not replay it", () => {
    const storage = memoryStorage();
    expect(claimIntro(() => storage, false)).toBe(true);
    expect(claimIntro(() => storage, false)).toBe(false);
  });

  it("never plays under reduced motion, and leaves the flag unset", () => {
    const storage = memoryStorage();
    expect(claimIntro(() => storage, true)).toBe(false);
    expect(storage.getItem("ff-intro-seen")).toBeNull();
  });

  it("does not play when storage throws, so a blocked store never replays it on every page load", () => {
    expect(claimIntro(() => { throw new Error("SecurityError"); }, false)).toBe(false);
    const throwingSet = { getItem: () => null, setItem: () => { throw new Error("QuotaExceededError"); } };
    expect(claimIntro(() => throwingSet, false)).toBe(false);
  });

  it("does not play when the write silently fails to stick", () => {
    const forgetful = { getItem: () => null, setItem: () => {} };
    expect(claimIntro(() => forgetful, false)).toBe(false);
  });
});

describe("introScript", () => {
  it("is self-contained: the serialised function behaves like the imported one", () => {
    const storage = memoryStorage();
    const attrs: Record<string, string> = {};
    const window = {
      localStorage: storage,
      matchMedia: () => ({ matches: false }),
      document: { documentElement: { setAttribute: (k: string, v: string) => void (attrs[k] = v) } },
    };
    new Function("window", introScript)(window);
    expect(attrs["data-intro"]).toBe("");
    delete attrs["data-intro"];
    new Function("window", introScript)(window);
    expect(attrs["data-intro"]).toBeUndefined();
  });
});
