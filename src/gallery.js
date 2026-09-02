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
  // Every card is one fixed 16:9 landscape slot (see gallery.css); object-fit:
  // cover crops each photo into it. The home deck reads as a uniform row of
  // frames rather than a ragged run of per-photo shapes. The gallery-page
  // mosaic still keeps each picture's own ratio - the home deck is the
  // deliberate exception. item.width/height still feed the <img> size attrs in
  // thumbnail() so the row does not jump while images load.

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

  // Two rows, not one combined list: a tag and a media type answer different
  // questions ("what is this of" vs "is it moving"), so folding them into a
  // single-select row would make "Clips" and "Watch-alongs" fight over the
  // same slot. They are not fully independent though - see applyFilters().
  let activeTag = null;
  let activeMedia = null; // null | "photo" | "clip"
  let filtered = items; // replaced by applyFilters() below, before first paint
  let active = 0;

  // The deck is landscape-only everywhere except Clips. Cards are a fixed 16:9
  // slot that object-fit crops into, so an upright frame does not break the
  // row's geometry - it loses most of itself to the crop instead, which is why
  // every photograph in content.js is wide to begin with. Clips are the one
  // thing allowed to be upright: the source footage is phone-shot, a cropped
  // poster is acceptable when the play button says there is more behind it,
  // and the lightbox shows the whole frame anyway. So clips live behind their
  // own pill and nowhere else - Clips ignores the tag row (four clips in
  // total; intersecting them with a tag mostly yields nothing), and every
  // other view drops them.
  function applyFilters() {
    filtered =
      activeMedia === "clip"
        ? items.filter((item) => item.isClip)
        : filterItems(items, activeTag).filter((item) => !item.isClip);
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
    // Nothing on screen today reaches this, because Clips ignores the tag row
    // and every tag has landscape photographs under it. It stays because a tag
    // whose only entries were clips would empty the stage, and an empty stage
    // has to say so. Told plainly via the native hidden attribute rather than
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
    // Clips ignores the tag row, so leaving Clips pressed here would show a
    // pressed tag that changed nothing on screen. Picking a tag means "show me
    // this subject", which is a request to leave the clips view.
    if (activeMedia === "clip") activeMedia = null;
    applyFilters();
    renderTagPills();
    renderMediaPills();
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

  // Even the untouched view is a filtered one now: the default drops clips.
  applyFilters();
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
