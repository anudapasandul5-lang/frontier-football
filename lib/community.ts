import { recorded, whatsappHref, type Raw } from "./content-data";

/* The Community page's logic (plan L7). A Registration is a prefilled WhatsApp
   message to Frontier's number, never a form (CONTEXT.md): one for a team, one
   for a free agent, each with its own text so Frontier can tell them apart
   before anyone types. An unrecorded message drops its button rather than
   opening a blank chat. */
export function registrations(content: Raw) {
  const number = content?.contact?.whatsapp;
  const league = content?.league ?? {};
  return [
    { label: "Register team", message: league.teamMessage },
    { label: "Join as a solo player", message: league.freeAgentMessage },
  ].flatMap(({ label, message }) => {
    // whatsappHref still opens a chat with no text; that is not a registration.
    const href = recorded(message) ? whatsappHref(number, message) : null;
    return href ? [{ label, href }] : [];
  });
}

function albumHref(albumId: unknown) {
  const id = recorded(albumId);
  // No album yet: no link, rather than a "Photos" link to "coming soon".
  return id ? `/albums/${encodeURIComponent(id)}` : null;
}

/* Every Past activity, in the order Frontier ran them: the competitions that
   came before the 4x4 Series, the Series itself, the watch-alongs, then the
   rest. Same order as the home Events act and the Who We Are scrapbook. A
   record of what Frontier has done, so there is no join field on any of them:
   only the Sunday Football League takes a Registration. */
export function activities(content: Raw) {
  const competitions = ((content?.competitions ?? []) as Raw[]).filter((c) => recorded(c.name));
  const seasonRows = ((content?.seasons ?? []) as Raw[]).filter((s) => Number.isFinite(Number(s.season)));
  const seasons = seasonRows.map((s) => Number(s.season));
  const parties = ((content?.watchAlongs ?? []) as Raw[]).filter((w) => recorded(w.name));
  // The photo is for the pointer preview on the list (Interactions data-preview).
  const newest = [...seasonRows].sort((a, b) => Number(b.season) - Number(a.season)).find((s) => recorded(s.photo));
  const competition = (c: Raw) => ({ name: recorded(c.name)!, note: recorded(c.note), href: albumHref(c.albumId), photo: recorded(c.photo) });

  return [
    ...competitions.filter((c) => c.beforeSeries === true).map(competition),
    ...(seasons.length
      ? [{ name: "4 x 4 Series", note: `SZN ${Math.min(...seasons)} to SZN ${Math.max(...seasons)}`, href: "/gallery#series", photo: newest ? recorded(newest.photo) : null }]
      : []),
    ...(parties.length
      ? [{ name: "Watch Parties", note: `${parties.length} match nights on the big screen`, href: "/gallery#watch-parties", photo: recorded(parties.find((w) => recorded(w.photo))?.photo) }]
      : []),
    ...competitions.filter((c) => c.beforeSeries !== true).map(competition),
  ];
}
