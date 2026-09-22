/* L0 PROTOTYPE: where the hero scrub's frames live and how many there are.
   Its own module, not HeroScrub's: a server component importing a value from
   a "use client" file gets a client reference, not the value, and the still
   frame's src came out as "undefined/d/001.webp". */
export const SCRUB = { base: "/scrub/hero", desktop: 60, phone: 24 };
