/* The first-visit intro (plan L6b): the crest and wordmark wipe over the home
   hero for about 1.2s, once per browser. The decision runs as an inline script
   before the hero paints, so the overlay is either there from the first frame
   or never there, and JS off means no intro at all.

   Any storage failure means no intro: a store that cannot remember the visit
   would otherwise replay it on every page load. */
export function claimIntro(getStorage: () => Pick<Storage, "getItem" | "setItem">, reducedMotion: boolean) {
  // Keep this function self-contained: introScript serialises it with
  // toString(), so it may not reference anything outside its own body.
  if (reducedMotion) return false;
  try {
    const storage = getStorage();
    if (storage.getItem("ff-intro-seen")) return false;
    storage.setItem("ff-intro-seen", "1");
    return storage.getItem("ff-intro-seen") === "1";
  } catch {
    return false;
  }
}

export const introScript = `if ((${claimIntro.toString()})(function () { return window.localStorage; }, window.matchMedia("(prefers-reduced-motion: reduce)").matches)) window.document.documentElement.setAttribute("data-intro", "");`;
