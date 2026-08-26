import { wireReveal } from "./reveal.js";

/* Reveal-on-scroll for the story section. The observer itself lives in
   src/reveal.js: T4 shipped a second copy of it and T5 extracted the shared
   one, so hero, story and champions now share a single implementation. */
const story = document.querySelector(".story");
if (story) wireReveal(story.querySelectorAll("[data-reveal]"));
