# Clubhouse poster — design notes

## Direction

A club playbill, built from Frontier's real night, bone and yellow fields. The huge type announces the page; overlapping match photographs make the opening feel like a printed poster. The Sunday information becomes a clear bone reading page with one WhatsApp action. The nine winners form a staggered poster wall: wide features alternate with narrow editions, so the archive has a different rhythm from the opening and from a repeated broadcast spread. Each actual winner photograph appears once. Photo corners use the current site's rounded-photo rule; the fields and controls remain square.

## Motion

The title cuts into place, the two-photograph group slides into place, and a broad bar moves across the opening in the first 1.6 seconds. A clearly visible word strip moves below. As each winner poster enters view, its photograph settles once and the thin line over its champion grows in; the winner text remains visible throughout. Pause stops the strip and poster motion, and ends any partial opening reveal so the content remains readable. Reduced-motion and no-JavaScript states are static. Motion uses transforms and opacity for the images, local CSS and a small native IntersectionObserver script; no remote libraries.

## Content and boundaries

- Static HTML contains the Sunday session, the existing WhatsApp message and all nine results from `facts.json` in source order. Unknown dates and runners-up stay absent. The empty upcoming list has no section.
- ThePapare and Milinda Deshan / ThePapare credits stay beside the full photographs. All nine alt texts and available album links are carried over.
- The existing page's next destination is Gallery. Main/footer destinations match the current route set.
- This is a sample at `previews/clubhouse.html`; it does not alter the production Events route. Preview navigation and album links point to their local exported `out/*.html` files; the logical production destinations are unchanged. Relative local font and photo paths assume the file stays in this folder.

## Check

Ran a static assertion against `facts.json`: nine source-order results, winner names, alt text, photo/album paths, credits, Sunday text and WhatsApp URL all present; local photo files exist. All 23 internal preview links resolve to exported HTML. Desktop, phone and live animation still need the lead's browser review.
