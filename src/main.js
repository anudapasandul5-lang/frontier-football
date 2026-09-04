import { initSmoothScroll } from "./smooth-scroll.js";
import "./hero.js";
import "./story.js";
import "./champions.js";
import "./gallery.js";
import "./partners.js";
import "./hub.js";

// After the section modules, not before: ES imports are hoisted, so their
// top-level code has already run by the time any statement in this file does.
// Ordering it here is honest about that, and it is also what we want - Lenis
// reads the document height on init, and the champions rail and the gallery
// deck have both been built by now.
initSmoothScroll();
