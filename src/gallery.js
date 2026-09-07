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
  // Photographs get one fixed 16:9 slot (see gallery.css) and object-fit: cover
  // crops each into it, so the ALL/tag views read as a uniform row of frames.
  // Clips are the exception: a phone-shot upright clip keeps its own shape
  // rather than being letterboxed to 16:9 - it fits the deck's height and takes
  // whatever width its ratio needs. --gallery-ratio drives that; it is only set
  // for clips. item.width/height also feed the <img> size attrs in thumbnail()
  // so the row does not jump while images load.
  if (item.isClip) {
    cell.classList.add("gallery__tile--clip");
    cell.style.setProperty("--gallery-ratio", `${item.width} / ${item.height}`);
  }

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

/* Mouse drag along the filter rail.

   A native overflow row scrolls with a thumb, a trackpad two-finger swipe and
   shift+wheel, but a click-drag does nothing at all. That is the browser, not
   this code, and it is why the champions rail carries arrow buttons instead.
   This row gets no arrows - it sits in a bar that already holds "Go to
   gallery", and two more controls would cost more width than the rail saves -
   so the drag is wired here by hand.

   FINE POINTERS ONLY. pointermove fires on touch too, and writing scrollLeft
   underneath the browser's own momentum scroll produces a rail that jitters
   and never settles. A thumb already drags this row natively; there is nothing
   to add there and something to break.

   A DRAG MUST NOT PRESS A PILL. Past a few pixels of movement the click that
   follows is swallowed in the capture phase, so dragging across "Clips" does
   not select clips. Under the threshold nothing is swallowed and an ordinary
   click still filters. */
function wireDragScroll(rail) {
  if (!rail || !matchMedia("(pointer: fine)").matches) return;

  // 4px, not 0. A mouse moves a pixel or two between press and release on
  // almost every real click, and a zero threshold would eat all of them.
  const THRESHOLD = 4;
  let startX = 0;
  let startLeft = 0;
  let down = false;
  let dragged = false;

  rail.addEventListener("pointerdown", (event) => {
    // Left button only: right opens a menu, middle is paste on some platforms.
    if (event.button !== 0) return;
    down = true;
    dragged = false;
    startX = event.clientX;
    startLeft = rail.scrollLeft;
  });

  rail.addEventListener("pointermove", (event) => {
    if (!down) return;
    const dx = event.clientX - startX;
    if (!dragged) {
      if (Math.abs(dx) < THRESHOLD) return;
      dragged = true;
      rail.classList.add("is-dragging");
      // Captured AFTER the threshold, never on pointerdown. Capturing early
      // retargets the pointerup as well, and a plain click on a pill would
      // then never reach the pill.
      rail.setPointerCapture(event.pointerId);
    }
    rail.scrollLeft = startLeft - dx;
  });

  function endDrag(event) {
    if (!down) return;
    down = false;
    rail.classList.remove("is-dragging");
    if (rail.hasPointerCapture(event.pointerId)) rail.releasePointerCapture(event.pointerId);
  }

  rail.addEventListener("pointerup", endDrag);
  rail.addEventListener("pointercancel", endDrag);

  // Capture phase, so this runs before the pill's own click listener rather
  // than after it has already changed the filter. `dragged` is not cleared
  // here on purpose - a drag that ends off the rail fires no click at all, and
  // the next pointerdown clears it.
  rail.addEventListener(
    "click",
    (event) => {
      if (!dragged) return;
      event.preventDefault();
      event.stopPropagation();
    },
    true,
  );
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

  // Two GROUPS, not one combined list: a tag and a media type answer different
  // questions ("what is this of" vs "is it moving"), so folding them into a
  // single-select row would make "Clips" and "Watch-alongs" fight over the
  // same slot. They are not fully independent though - see applyFilters().
  // They share one line since 2026-09-07 (gallery.css) but remain two mounts
  // and two selections; the wider gap between them is what says so.
  let activeTag = null;
  // null | "clip". There is no "photo" value any more: applyFilters() drops
  // clips unless clips are explicitly asked for, so null already IS photos.
  let activeMedia = null;
  let filtered = items; // replaced by applyFilters() below, before first paint
  let active = 0;

  // The deck is landscape-only everywhere except Clips. Photographs share one
  // fixed 16:9 slot and are cropped into it, so an upright photograph would
  // lose most of itself - which is why every photograph in content.js is wide
  // to begin with. Clips keep their own ratio instead (see card()), so an
  // upright clip is not cropped, it is just narrow. That is the whole reason
  // they are quarantined: a run of tall narrow cards among 16:9 ones is a
  // different row, not a ragged one. So clips live behind their own pill and
  // nowhere else - Clips ignores the tag row (four clips in total;
  // intersecting them with a tag mostly yields nothing), and every other view
  // drops them.
  function applyFilters() {
    filtered =
      activeMedia === "clip"
        ? items.filter((item) => item.isClip)
        : filterItems(items, activeTag).filter((item) => !item.isClip);
    active = 0;
  }

  function layout() {
    const cells = cardsMount.children;
    const count = cells.length;
    if (count === 0) return;

    // The deck wraps: the card "before" the first is the last one. So there is
    // always a neighbour peeking on both sides and the row never bottoms out
    // into empty paper at an end - which is what it did at card 1 and card N,
    // the whole deck shoved to one side with a bare gutter on the other. The
    // arrows and Left/Right already stepped in a loop (stepIndex wraps); this
    // just makes the picture match. A card can only sit at +v and -v at once
    // when count <= 2v+1, so the visible reach is clamped for the short Clips
    // deck (4 items -> one neighbour a side).
    const visible = Math.min(MAX_VISIBLE_OFFSET, Math.floor((count - 1) / 2));

    // Step is measured off the ACTIVE card's own width, not the stage, so the
    // sliver of the next card showing past its edge is the same whether the
    // centre is a wide 16:9 photo or a narrow upright clip. Photos are all one
    // width now, so there is a real card width to read.
    const stageWidth = stage.clientWidth;
    const activeWidth = cells[active].offsetWidth || stageWidth * 0.6;
    const step = activeWidth / 2 + Math.min(stageWidth * 0.05, 48);

    for (let i = 0; i < count; i += 1) {
      const cell = cells[i];
      let offset = i - active;
      if (offset > count / 2) offset -= count;
      else if (offset < -count / 2) offset += count;

      const distance = Math.abs(offset);
      const isCentre = distance === 0;
      const hidden = distance > visible;

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
    // ONE PILL. There were two - "Photos" beside "Clips" - and "Photos" was a
    // control that did nothing: applyFilters() drops clips unless clips are
    // asked for, so the unpressed state already showed exactly what pressing
    // Photos showed. Removed by the owner on 2026-09-07; nothing about what the
    // section displays changed, only the row got shorter.
    //
    // No "All" pill to replace it either. Unpressed IS all photos, the tag row
    // next door already owns an "All", and a second one would read as an
    // unlabelled duplicate of it.
    mediaMount.replaceChildren(
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

  wireDragScroll(section.querySelector(".gallery__filter-groups"));

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
