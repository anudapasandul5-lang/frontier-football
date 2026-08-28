import content from "../content.js";
import { countLabel, filterItems, galleryItems, galleryTags, stepIndex } from "./gallery-data.js";
import { initLightbox } from "./lightbox.js";
import { wireReveal } from "./reveal.js";

/* Renders the home page's coverflow: one active photo at full size, its
   neighbours peeking to either side, filter pills above it. Opens the shared
   lightbox (src/lightbox.js) on the active card.

   Only the active card sits in the tab order (tabIndex 0); the peeking cards
   are real buttons a mouse or touch can jump to directly, but tabIndex -1
   keeps them out of the keyboard flow. A keyboard user reaches the same
   destinations through the Previous/Next buttons and the Left/Right keys,
   which is the same vocabulary the lightbox already uses for exactly the same
   move. That is a deliberate simplification against a "focus a peeking card
   and it recentres itself" pattern: coverflow-style auto-recentring-on-focus
   is a known trap for screen readers (focus lands somewhere, then silently
   jumps), and nothing here is actually unreachable without it. */

const SCALE_STEP = 0.12;
const MAX_VISIBLE_OFFSET = 2;

function thumbnail(item) {
  const img = document.createElement("img");
  // A clip shows its poster. No <video> element goes into the deck at all, so a
  // phone cannot download an .mp4 it did not ask for: there is nothing in the
  // document capable of requesting one until the lightbox builds it.
  img.src = item.isClip ? item.poster : item.src;
  img.alt = "";
  img.loading = "lazy";
  img.decoding = "async";
  img.width = item.width;
  img.height = item.height;
  return img;
}

function card(item, index, onActivate) {
  const cell = document.createElement("li");
  cell.className = "gallery__tile";
  // The card takes its shape from the picture rather than from a slot, so
  // reordering content.js cannot change what gets cropped. Same mechanism the
  // old strip used and the mosaic on the gallery page reuses.
  cell.style.setProperty("--gallery-ratio", `${item.width} / ${item.height}`);

  const button = document.createElement("button");
  button.className = "gallery__frame";
  button.type = "button";
  const description = item.alt ?? (item.isClip ? "A Frontier clip." : "A Frontier photograph.");
  button.setAttribute("aria-label", item.isClip ? `Play clip. ${description}` : description);
  button.append(thumbnail(item));

  if (item.isClip) {
    const mark = document.createElement("span");
    mark.className = "gallery__play";
    mark.setAttribute("aria-hidden", "true");
    button.append(mark);
  }

  button.addEventListener("click", () => onActivate(index));
  cell.append(button);
  return cell;
}

function pill(label, tag, isPressed, onSelect) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "pill gallery__pill";
  button.textContent = label;
  button.setAttribute("aria-pressed", String(isPressed));
  button.addEventListener("click", () => onSelect(tag));
  return button;
}

export function initGallery(section, dialog) {
  const filtersMount = section.querySelector("[data-gallery-filters]");
  const mediaMount = section.querySelector("[data-gallery-media]");
  const stage = section.querySelector("[data-gallery-stage]");
  const cardsMount = section.querySelector("[data-gallery-cards]");
  const emptyMessage = section.querySelector("[data-gallery-empty]");
  const prevButton = section.querySelector("[data-gallery-prev]");
  const nextButton = section.querySelector("[data-gallery-next]");
  const countLabelEl = section.querySelector("[data-gallery-count]");

  const items = galleryItems(content);

  // No items means no section. The head stays static markup so a failed
  // bundle still reads as a labelled section, but a stage that successfully
  // rendered nothing is just an empty band and is removed outright.
  if (items.length === 0) {
    section.remove();
    return;
  }

  const tags = galleryTags(items);
  const hasClips = items.some((item) => item.isClip);
  const lightbox = initLightbox(dialog);

  // Two independent facets, not one combined list: a tag and a media type
  // answer different questions ("what is this of" vs "is it moving"), and
  // combining them into a single-select row would mean "Clips" and "Watch-
  // alongs" fight over the same slot even though a watch-along clip is a
  // perfectly sensible photograph to want. Each row keeps its own All.
  let activeTag = null;
  let activeMedia = null; // null | "photo" | "clip"
  let filtered = items;
  let active = 0;

  function applyFilters() {
    filtered = filterItems(items, activeTag).filter(
      (item) => activeMedia === null || item.isClip === (activeMedia === "clip"),
    );
    active = 0;
  }

  function layout() {
    const stageWidth = stage.clientWidth;
    // A percentage of the stage, not a fixed pixel step: the cards themselves
    // are variable width (their own aspect ratio, never cropped to a shared
    // slot), so there is no single card width to base spacing on. A step tied
    // to the stage instead gives consistent peeking regardless of which mix of
    // portrait and landscape frames the filter happens to be showing.
    const step = Math.min(Math.max(stageWidth * 0.24, 90), 220);
    const cells = cardsMount.children;

    for (let i = 0; i < cells.length; i += 1) {
      const cell = cells[i];
      const offset = i - active;
      const distance = Math.abs(offset);
      const isCentre = distance === 0;
      const hidden = distance > MAX_VISIBLE_OFFSET;

      cell.hidden = hidden;
      if (hidden) continue;

      const scale = 1 - distance * SCALE_STEP;
      cell.style.transform = `translate(-50%, -50%) translateX(${offset * step}px) scale(${scale})`;
      cell.style.zIndex = String(10 - distance);
      cell.style.opacity = isCentre ? "1" : "0.55";
      cell.style.filter = isCentre ? "none" : "blur(2px)";
      cell.setAttribute("aria-hidden", isCentre ? "false" : "true");

      const button = cell.querySelector(".gallery__frame");
      button.tabIndex = isCentre ? 0 : -1;
    }

    countLabelEl.textContent = countLabel(active, filtered.length);
  }

  function setActive(index) {
    active = stepIndex(index, 0, filtered.length);
    layout();
  }

  function step(delta) {
    setActive(stepIndex(active, delta, filtered.length));
  }

  function activate(index) {
    if (index === active) {
      lightbox.open(filtered, active, cardsMount.children[active].querySelector(".gallery__frame"));
      return;
    }
    setActive(index);
  }

  function renderCards() {
    // A combination (say Clips + Watch-alongs) can legitimately match nothing
    // today - the two clips that exist are both tagged On the pitch. Told
    // plainly via the native hidden attribute on both elements rather than
    // left as a stage with peeking cards and no centre - the same "say it,
    // don't fake it" rule the champions grid and the Drive links already
    // follow. hidden rather than a CSS class: a class that also sets display
    // on .gallery__empty would silently outrank the attribute (author styles
    // beat the UA stylesheet's [hidden] rule), so the attribute stays the only
    // thing controlling either element's visibility.
    const isEmpty = filtered.length === 0;
    cardsMount.hidden = isEmpty;
    emptyMessage.hidden = !isEmpty;
    prevButton.disabled = isEmpty;
    nextButton.disabled = isEmpty;
    // layout() also writes this, but only when isEmpty is false below - a
    // combination that matches nothing never reaches it, so it is cleared
    // here on the same branch as the other empty-state attributes.
    if (isEmpty) countLabelEl.textContent = "";

    cardsMount.replaceChildren(...filtered.map((item, index) => card(item, index, activate)));
    if (!isEmpty) layout();
  }

  function renderTagPills() {
    if (tags.length === 0) {
      filtersMount.remove();
      return;
    }
    filtersMount.replaceChildren(
      pill("All", null, activeTag === null, setTag),
      ...tags.map((tag) => pill(tag, tag, activeTag === tag, setTag)),
    );
  }

  function renderMediaPills() {
    if (!hasClips) {
      mediaMount.remove();
      return;
    }
    // Two pills, not three: unlike the tag row, media has only two real values,
    // so a third "All" pill next to the tag row's own "All" would read as two
    // unlabelled duplicates stacked on top of each other. Neither pressed IS
    // "all media" here, and clicking the pressed one again clears it - a toggle
    // fits a binary facet better than forcing symmetry with the tag row.
    mediaMount.replaceChildren(
      pill("Photos", "photo", activeMedia === "photo", toggleMedia),
      pill("Clips", "clip", activeMedia === "clip", toggleMedia),
    );
  }

  function setTag(tag) {
    activeTag = tag;
    applyFilters();
    renderTagPills();
    renderCards();
  }

  function setMedia(media) {
    activeMedia = media;
    applyFilters();
    renderMediaPills();
    renderCards();
  }

  function toggleMedia(media) {
    setMedia(activeMedia === media ? null : media);
  }

  prevButton.addEventListener("click", () => step(-1));
  nextButton.addEventListener("click", () => step(1));

  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") step(1);
    else if (event.key === "ArrowLeft") step(-1);
    else return;
    // Otherwise the arrow also scrolls the page underneath the stage.
    event.preventDefault();
  });

  // Cheap to recompute on every resize: layout() only touches the cards
  // currently on stage, at most five of them.
  window.addEventListener("resize", layout);

  renderTagPills();
  renderMediaPills();
  renderCards();

  // The head and the bar, never the individual cards: src/reveal.js observes
  // against the viewport, and a card scaled near zero or translated off to the
  // side would be exactly the kind of element that trips a fractional
  // threshold. The stage itself is the reveal element for the deck.
  wireReveal(section.querySelectorAll("[data-reveal]"));
}

const section = document.querySelector(".gallery");
const dialog = document.querySelector("[data-lightbox]");
if (section && dialog) initGallery(section, dialog);
