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
    { label: "Register a team", message: league.teamMessage },
    { label: "Join as a free agent", message: league.freeAgentMessage },
  ].flatMap(({ label, message }) => {
    // whatsappHref still opens a chat with no text; that is not a registration.
    const href = recorded(message) ? whatsappHref(number, message) : null;
    return href ? [{ label, href }] : [];
  });
}

function albumHref(albumId: unknown) {
  const id = recorded(albumId);
  return id ? `/albums/${encodeURIComponent(id)}` : "/gallery";
}

/* Every Past activity, in the order Frontier ran them: the competitions that
   came before the 4x4 Series, the Series itself, the rest, then the
   watch-alongs. A record of what Frontier has done, so there is no join field
   on any of them: only the Sunday Football League takes a Registration. */
export function activities(content: Raw) {
  const competitions = ((content?.competitions ?? []) as Raw[]).filter((c) => recorded(c.name));
  const seasons = ((content?.seasons ?? []) as Raw[]).map((s) => Number(s.season)).filter(Number.isFinite);
  const parties = ((content?.watchAlongs ?? []) as Raw[]).filter((w) => recorded(w.name));
  const competition = (c: Raw) => ({ name: recorded(c.name)!, note: recorded(c.note), href: albumHref(c.albumId) });

  return [
    ...competitions.filter((c) => c.beforeSeries === true).map(competition),
    ...(seasons.length
      ? [{ name: "4 x 4 Series", note: `SZN ${Math.min(...seasons)} to SZN ${Math.max(...seasons)}`, href: "/gallery" }]
      : []),
    ...competitions.filter((c) => c.beforeSeries !== true).map(competition),
    ...(parties.length ? [{ name: "Watch-alongs", note: `${parties.length} match nights on the big screen`, href: "/gallery" }] : []),
  ];
}
