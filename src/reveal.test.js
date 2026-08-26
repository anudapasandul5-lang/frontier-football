import { describe, it, expect, afterEach } from "vitest";
import { shouldReveal, wireReveal } from "./reveal.js";

/* A stand-in for a DOM element. wireReveal only ever touches classList, so this
   is everything it needs and the suite stays in the node environment: adding
   jsdom would be a third dependency. */
function fakeElement() {
  const classes = [];
  return {
    classes,
    classList: {
      add: (name) => classes.push(name),
    },
  };
}

/* A stand-in for IntersectionObserver that hands back its callback, so a test
   can fire an entry the browser would never produce on demand. */
function fakeObserver() {
  const observed = [];
  let callback;
  let options;
  globalThis.IntersectionObserver = class {
    constructor(cb, opts) {
      callback = cb;
      options = opts;
    }
    observe(el) {
      observed.push(el);
    }
    unobserve() {}
  };
  return { observed, fire: (entries) => callback(entries), options: () => options };
}

afterEach(() => {
  delete globalThis.IntersectionObserver;
});

describe("shouldReveal", () => {
  it("reveals an element that is intersecting", () => {
    expect(shouldReveal({ isIntersecting: true, boundingClientRect: { bottom: 400 } })).toBe(true);
  });

  it("reveals an element the page has already scrolled past", () => {
    // The #about deep link and browser scroll restoration both land here: the
    // element never intersects, so without this it stays at opacity 0 forever.
    expect(shouldReveal({ isIntersecting: false, boundingClientRect: { bottom: -400 } })).toBe(
      true,
    );
  });

  it("leaves an element below the viewport alone", () => {
    expect(shouldReveal({ isIntersecting: false, boundingClientRect: { bottom: 900 } })).toBe(
      false,
    );
  });
});

describe("wireReveal", () => {
  it("hides and observes in the same step", () => {
    const observer = fakeObserver();
    const el = fakeElement();

    wireReveal([el]);

    expect(el.classes).toEqual(["is-pre"]);
    expect(observer.observed).toEqual([el]);
  });

  it("reveals an element the page scrolled past, not only an intersecting one", () => {
    // Guards the wiring, not just the predicate: swapping shouldReveal back out
    // for a bare entry.isIntersecting check fails here and nowhere else.
    const observer = fakeObserver();
    const el = fakeElement();

    wireReveal([el]);
    observer.fire([
      { isIntersecting: false, boundingClientRect: { bottom: -400 }, target: el },
    ]);

    expect(el.classes).toContain("is-revealed");
  });

  it("never insets the bottom of the observer root", () => {
    // A negative bottom rootMargin permanently hides anything sitting in that
    // band once the page is scrolled as far as it goes: no further scroll can
    // push it into the shrunk root. A "-15%" inset here stranded six cards the
    // moment the champions grid grew to eight.
    const observer = fakeObserver();
    wireReveal([fakeElement()]);

    const bottom = String(observer.options().rootMargin ?? "0px").split(/\s+/)[2] ?? "0px";
    expect(parseFloat(bottom)).toBeGreaterThanOrEqual(0);
  });

  it("leaves an element below the viewport at its pre-state", () => {
    const observer = fakeObserver();
    const el = fakeElement();

    wireReveal([el]);
    observer.fire([{ isIntersecting: false, boundingClientRect: { bottom: 900 }, target: el }]);

    expect(el.classes).not.toContain("is-revealed");
  });
});
