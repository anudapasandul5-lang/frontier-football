# Events page redesign and motion

SUPERSEDED SCOPE: User subsequently said 'nah just redesign the hall of fame section'. Whole-page samples are reference studies only. Do not apply their hero, weekly-session, navigation, photo bridge or footer. Production scope is now only Hall of Fame in app/events/page.tsx, scoped CSS and existing reveal behavior. Main job returns to docs/hall-of-fame-2026-10-26/.

26 October 2026. User explicitly selected: redesign and animate the whole Events page. Earlier Hall of Fame background proposals were insufficient; stop polishing the trophy wallpaper. Design-workflow direction proposals come before production replacement.

Brand authority: docs/HOUSE-RULES.md, current app/globals.css and app/layout.tsx. Preserve current Frontier identity: night/bone/yellow, Bricolage Grotesque width75, Geist, real football photos, rounded photos. No new logo, fonts or palette. Root DESIGN.md is a historical reference extraction.

Content authority: content.js parsed through lib/content-data.ts. facts.json is a checked snapshot for samples; current production data must be re-read at implementation. Current results: Ramadan FC SZN6 then Panadura SZN5, followed by remaining resultRows in exact order. Preserve unknowns, credits, alt text, links, existing weekly-session message and empty-upcoming-event behavior. Weekly session must not be presented as Sunday League registration.

Goal: an exciting, coherent player-facing Events page with perceptible motion, clear next action, and a Hall of Fame that celebrates actual winners. Both samples cover hero, weekly play/session, conditional upcoming events and full winner archive. Keep navigation/next-page/footer destinations consistent with current site. No invented event dates, results, rankings, capacity or urgency.

Deliver two original, substantially different working page samples, using local assets and current facts. A Matchday broadcast: bold editorial sports layout, clear hero-to-session transition, repeated photo-led champion spreads; purposeful moving pitch/broadcast graphics. B Clubhouse poster: typographic playbill and cut-out composition of real rectangular photo panels, clearly different section rhythm and champion archive treatment; expressive but readable motion. Keep animation visible without needing 20seconds to notice it. Shared palette is the brand, not a reason to make the layouts identical.

Research routing: gpt-6-luna for source searches, gpt-6-sol for sample builds; lead checks sources, renders and aggregates. Only the lead uses CUA/browser for testing. No browser research agents concurrently.

Success: two rendered desktop/400px samples with visibly distinct layout and motion; current data unchanged; all actual result entries represented; pause/reduced motion, keyboard focus and no sideways overflow. Show real screenshots and one recommendation. User chooses direction before replacing production Events page. No deployment or push.

Assumption most likely wrong: the user wants a cohesive new Events experience rather than another decorative background. User's explicit whole-page answer supports it. Worst failure: hiding winners/booking facts behind animation or mixing the weekly session with League sign-up. Not covered: other pages, new branding, content corrections, generated imagery, paid tools or live publication.

Tickets: (1) references and facts; (2) two independent page samples; (3) lead UI/motion/data review, bounded fixes; (4) user direction choice; (5) chosen design implemented in app/events/page.tsx with an isolated motion leaf and existing shared components after selection.
