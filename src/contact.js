import content from "../content.js";
import { parseContent } from "./content-data.js";
import { renderContactRoutes } from "./contact-routes.js";
import { initSmoothScroll } from "./smooth-scroll.js";

/* The contact page: one audience, one number, no form.

   IT USED TO ASK TWO. The brand half moved to /collaborate.html, which is where
   the hero's yellow button now points and where the reach figures a brand
   decides on actually live. What is left here is the player: someone who wants a
   spot next season, arriving from the footer or from a shared link.

   ONE BUTTON, THEREFORE. contactRoutes is narrowed to the player audience, so
   the WhatsApp message that arrives says which page it came from before anyone
   reads it, and there is no "I want to partner" button here pointing at a
   conversation the collaborate page is better set up to have.

   Everything this page draws is src/contact-routes.js, shared with the
   collaborate and events pages. This file only picks the audience and mounts. */

initSmoothScroll();

const routesMount = document.querySelector("[data-contact-routes]");
if (routesMount) {
  renderContactRoutes(routesMount, parseContent(content), { only: "player" });
}
