import { describe, it, expect } from "vitest";
import {
  contactRoutes,
  journey,
  outboundLinks,
  parseContent,
  partners,
  people,
  whatsappHref,
} from "./content-data.js";

describe("parseContent", () => {
  it("keeps every field of a fully recorded season", () => {
    // The shape the owner's data lands in. Nothing is dropped on the way through.
    const { seasons } = parseContent({
      seasons: [
        {
          season: 4,
          champion: "Pantera FC",
          runnerUp: "Some FC",
          goldenBoot: "A Player",
          goldenGlove: "A Keeper",
          note: "A note",
          photo: "/champions/szn-4.webp",
          photoAlt: "A description",
        },
      ],
    });

    expect(seasons[0]).toEqual({
      season: 4,
      champion: "Pantera FC",
      runnerUp: "Some FC",
      goldenBoot: "A Player",
      goldenGlove: "A Keeper",
      note: "A note",
      photo: "/champions/szn-4.webp",
      photoAlt: "A description",
      date: null,
      venue: null,
      driveFolder: null,
      albumId: null,
    });
  });

  it("renders a season with no photo as absent, not as a broken image", () => {
    // A src of "" or "TODO" would make the browser request the page itself or a
    // missing file and draw a broken-image icon inside the card.
    const { seasons } = parseContent({
      seasons: [{ season: 5, champion: "TODO", photo: "TODO" }],
    });

    expect(seasons[0].photo).toBeNull();
    expect(seasons[0].photoAlt).toBeNull();
  });

  it("renders a TODO champion as absent, keeping the season", () => {
    // Remove the TODO guard and this fails by putting the literal string "TODO"
    // on screen as a champion's name.
    const { seasons } = parseContent({
      seasons: [{ season: 5, champion: "TODO" }],
    });

    expect(seasons).toHaveLength(1);
    expect(seasons[0].season).toBe(5);
    expect(seasons[0].champion).toBeNull();
  });

  it("treats a TODO the owner has written a note onto as absent", () => {
    const { seasons } = parseContent({
      seasons: [{ season: 5, champion: "TODO: ask at the next session" }],
    });

    expect(seasons[0].champion).toBeNull();
  });

  it("survives a season with fields left out entirely", () => {
    const { seasons } = parseContent({ seasons: [{ season: 3, champion: "Ramadan FC" }] });

    expect(seasons[0].goldenBoot).toBeNull();
    expect(seasons[0].goldenGlove).toBeNull();
    expect(seasons[0].runnerUp).toBeNull();
  });

  it("survives content with no seasons at all", () => {
    expect(parseContent({ seasons: [] }).seasons).toEqual([]);
  });

  it("survives content with no competitions at all", () => {
    expect(parseContent({ seasons: [] }).competitions).toEqual([]);
  });

  it("reads a competition, keeping its note and dropping its TODOs", () => {
    const { competitions } = parseContent({
      seasons: [],
      competitions: [
        {
          name: "Turf Wars",
          note: "Aug 2025",
          champion: "TODO",
          runnerUp: "TODO",
          photo: "/champions/turf-wars.webp",
        },
      ],
    });

    expect(competitions[0]).toEqual({
      name: "Turf Wars",
      note: "Aug 2025",
      champion: null,
      runnerUp: null,
      photo: "/champions/turf-wars.webp",
      photoAlt: null,
      date: null,
      venue: null,
      driveFolder: null,
      albumId: null,
    });
  });

  it("reads more than one competition, in the order written", () => {
    // Turf Wars and Division 0 are both non-season competitions. The second one
    // is why this is a list and not two special-cased keys.
    const { competitions } = parseContent({
      seasons: [],
      competitions: [{ name: "Turf Wars" }, { name: "Division 0" }],
    });

    expect(competitions.map((c) => c.name)).toEqual(["Turf Wars", "Division 0"]);
  });

  it("drops a competition with no name, because a card needs a title", () => {
    const { competitions } = parseContent({
      seasons: [],
      competitions: [{ name: "TODO", champion: "Someone" }, { name: "Division 0" }],
    });

    expect(competitions.map((c) => c.name)).toEqual(["Division 0"]);
  });
});

describe("outboundLinks", () => {
  it("keeps a link whose url is recorded", () => {
    const links = outboundLinks(
      parseContent({ links: [{ name: "Instagram", url: "https://example.test/ig" }] }),
    );

    expect(links).toEqual([
      { name: "Instagram", handle: null, url: "https://example.test/ig" },
    ]);
  });

  it("drops a link with no url rather than rendering it disabled", () => {
    // A greyed-out control that can never be pressed is worse than an absent
    // one: it tells a visitor Frontier has a TikTok and then refuses to open it.
    const links = outboundLinks(
      parseContent({
        links: [
          { name: "Instagram", url: "https://example.test/ig" },
          { name: "TikTok", url: "TODO" },
          { name: "WhatsApp", url: "TODO: nobody has sent the invite link" },
        ],
      }),
    );

    expect(links.map((link) => link.name)).toEqual(["Instagram"]);
  });

  it("drops a link with no name, since a link with nothing to read is not a link", () => {
    const links = outboundLinks(
      parseContent({ links: [{ name: "TODO", url: "https://example.test/somewhere" }] }),
    );

    expect(links).toEqual([]);
  });

  it("keeps Instagram first when the others arrive", () => {
    // The hub is ordered by content.js, and BUILD-PROMPT fixes that order as
    // Instagram, TikTok, Sofascore, WhatsApp. Filling the absent three in must
    // not push the follow out of first place.
    const links = outboundLinks(
      parseContent({
        links: [
          { name: "Instagram", url: "https://example.test/ig" },
          { name: "TikTok", url: "https://example.test/tt" },
          { name: "Sofascore", url: "https://example.test/sofa" },
          { name: "WhatsApp", url: "https://example.test/wa" },
        ],
      }),
    );

    expect(links.map((link) => link.name)).toEqual([
      "Instagram",
      "TikTok",
      "Sofascore",
      "WhatsApp",
    ]);
  });

  it("promotes whatever is first when Instagram itself is unrecorded", () => {
    // The slab is given to the first renderable link, not to Instagram by name.
    // If the handle ever changed and was blanked while it was re-checked, the
    // section stays correct instead of rendering headless.
    const links = outboundLinks(
      parseContent({
        links: [
          { name: "Instagram", url: "TODO" },
          { name: "TikTok", url: "https://example.test/tt" },
        ],
      }),
    );

    expect(links.map((link) => link.name)).toEqual(["TikTok"]);
  });

  it("returns nothing when every url is still TODO", () => {
    const links = outboundLinks(
      parseContent({ links: [{ name: "Instagram", url: "TODO" }, { name: "TikTok", url: "TODO" }] }),
    );

    expect(links).toEqual([]);
  });

  it("survives a content file with no links at all", () => {
    expect(outboundLinks(parseContent({}))).toEqual([]);
  });
});

describe("partners", () => {
  it("keeps a partner whose url is still TODO, as plain text rather than a link", () => {
    // This is the path EVERY partner takes today. A partner with no checked
    // address still belongs on the page; it just does not link anywhere.
    const list = partners(parseContent({ partners: [{ name: "ThePapare", url: "TODO" }] }));

    expect(list).toEqual([{ name: "ThePapare", logo: null, url: null }]);
  });

  it("carries a url through once one is pasted in", () => {
    const list = partners(
      parseContent({ partners: [{ name: "@address.lk", url: "https://example.test/address" }] }),
    );

    expect(list[0].url).toBe("https://example.test/address");
  });

  it("carries a logo through once a file lands, without changing anything else", () => {
    const list = partners(
      parseContent({ partners: [{ name: "@absystudios", logo: "/partners/absy.webp" }] }),
    );

    expect(list[0]).toEqual({ name: "@absystudios", logo: "/partners/absy.webp", url: null });
  });

  it("drops a partner with no name, since a row's content is its name", () => {
    const list = partners(
      parseContent({ partners: [{ name: "TODO" }, { name: "@zone360.lk" }] }),
    );

    expect(list.map((partner) => partner.name)).toEqual(["@zone360.lk"]);
  });

  it("keeps content.js order rather than sorting the names", () => {
    // Alphabetising would imply a ranking nobody set. The file's order is the
    // order they were recorded in and carries no claim.
    const list = partners(
      parseContent({
        partners: [{ name: "@main.sportsbar" }, { name: "Sofascore" }, { name: "@iodexsrilanka" }],
      }),
    );

    expect(list.map((partner) => partner.name)).toEqual([
      "@main.sportsbar",
      "Sofascore",
      "@iodexsrilanka",
    ]);
  });

  it("returns nothing when the collection is missing or emptied", () => {
    expect(partners(parseContent({}))).toEqual([]);
    expect(partners(parseContent({ partners: [] }))).toEqual([]);
  });
});

describe("outboundLinks handles", () => {
  it("carries the handle the hub prints big", () => {
    const [link] = outboundLinks(
      parseContent({
        links: [
          { name: "Instagram", handle: "@frontierfootballl", url: "https://example.test/ig" },
        ],
      }),
    );

    expect(link.handle).toBe("@frontierfootballl");
  });

  it("leaves the handle absent for a link that has none, rather than inventing one", () => {
    // A WhatsApp invite and a Sofascore page have no handle in them. The hub
    // falls back to the link's name; it never parses one out of the url.
    const [link] = outboundLinks(
      parseContent({ links: [{ name: "WhatsApp", handle: "TODO", url: "https://example.test/wa" }] }),
    );

    expect(link.handle).toBeNull();
  });
});

describe("journey", () => {
  it("puts Turf Wars first, then the seasons oldest first, then the other competitions", () => {
    // The About page tells the story forward. content.js lists seasons newest
    // first because that is the order the champions grid wants, so the ordering
    // lives here rather than in the file the owner edits.
    const stops = journey(
      parseContent({
        seasons: [{ season: 3 }, { season: 2 }, { season: 1 }],
        competitions: [{ name: "Turf Wars" }, { name: "Division 0" }],
      }),
    );

    expect(stops.map((stop) => stop.name)).toEqual([
      "Turf Wars",
      "4 x 4 Series SZN 1",
      "4 x 4 Series SZN 2",
      "4 x 4 Series SZN 3",
      "Division 0",
    ]);
  });

  it("survives a season being added, and a whole collection being deleted", () => {
    // HOUSE-RULES section 7: any layout driven by content.js must survive a
    // changing item count. Deleting every list from the file must not throw.
    expect(journey(parseContent({}))).toEqual([]);
    expect(journey(parseContent({ seasons: [{ season: 7 }] })).map((s) => s.name)).toEqual(["4 x 4 Series SZN 7"]);
  });

  it("leaves an unrecorded date and venue absent instead of printing TODO", () => {
    const [stop] = journey(
      parseContent({ seasons: [{ season: 1, date: "TODO: ask the lads", venue: "TODO" }] }),
    );

    expect(stop.date).toBeNull();
    expect(stop.venue).toBeNull();
  });

  it("carries a recorded date, venue and champion straight through", () => {
    const [stop] = journey(
      parseContent({
        competitions: [
          { name: "Turf Wars", date: "Aug 2024", venue: "One Galle Face", champion: "TODO" },
        ],
      }),
    );

    expect(stop).toMatchObject({
      name: "Turf Wars",
      date: "Aug 2024",
      venue: "One Galle Face",
      champion: null,
    });
  });
});

describe("people", () => {
  it("returns nothing while the list is empty, so the section can hide itself", () => {
    // The list ships empty on purpose. Nobody has agreed to be named yet, and
    // an empty section is better than a placeholder for a real person.
    expect(people(parseContent({}))).toEqual([]);
    expect(people(parseContent({ people: [] }))).toEqual([]);
  });

  it("drops a nameless entry, the same rule partners() uses", () => {
    const list = people(
      parseContent({ people: [{ name: "TODO", role: "Founder" }, { name: "A Real Name" }] }),
    );

    expect(list.map((person) => person.name)).toEqual(["A Real Name"]);
  });
});

describe("watchAlongsAfter", () => {
  it("carries the season the watch parties ran alongside", () => {
    // The owner said on 2026-09-03 that the watch parties happened in the
    // middle of SZN 4, 5 and 6, so the branch leaves the timeline there rather
    // than hanging off the end of it.
    expect(parseContent({ watchAlongsAfter: 5 }).watchAlongsAfter).toBe(5);
  });

  it("is absent when unrecorded, so the branch falls back to the end", () => {
    expect(parseContent({}).watchAlongsAfter).toBeNull();
    expect(parseContent({ watchAlongsAfter: "TODO" }).watchAlongsAfter).toBeNull();
    // A season that does not exist is not an anchor either - the renderer has
    // nothing to attach to and must not throw looking for it.
    expect(parseContent({ watchAlongsAfter: 0 }).watchAlongsAfter).toBeNull();
  });
});

describe("whatsappHref", () => {
  it("strips everything that is not a digit out of the number", () => {
    // The owner types a number the way a human writes one. wa.me wants digits
    // only, and a link built with a plus sign or a space in it silently opens a
    // chat with nobody.
    expect(whatsappHref("+94 71 234 5678", null)).toBe("https://wa.me/94712345678");
    expect(whatsappHref("(+94) 71-234-5678", null)).toBe("https://wa.me/94712345678");
  });

  it("appends the pre-filled message, encoded", () => {
    expect(whatsappHref("+94712345678", "Hi Frontier, I'd like to partner.")).toBe(
      "https://wa.me/94712345678?text=Hi%20Frontier%2C%20I'd%20like%20to%20partner.",
    );
  });

  it("omits the text parameter when there is no message", () => {
    // An empty ?text= is not the same as no ?text=: it is a link that says the
    // message was meant to be there and got lost.
    expect(whatsappHref("+94712345678", null)).toBe("https://wa.me/94712345678");
    expect(whatsappHref("+94712345678", "TODO")).toBe("https://wa.me/94712345678");
  });

  it("returns nothing when there is no number to link to", () => {
    expect(whatsappHref("TODO", "Hi")).toBeNull();
    expect(whatsappHref(null, "Hi")).toBeNull();
    // Punctuation with no digits in it is not a phone number.
    expect(whatsappHref("+ - ()", "Hi")).toBeNull();
  });
});

describe("contactRoutes", () => {
  const instagram = { name: "Instagram", handle: "@frontierfootballl", url: "https://example.test/ig" };
  const tiktok = { name: "TikTok", handle: "@frontierfootball", url: "https://example.test/tt" };

  it("gives each audience its own WhatsApp link when the number is recorded", () => {
    // Two buttons, one number, two different pre-filled messages: the owner can
    // tell which audience messaged before they type a word.
    const routes = contactRoutes(
      parseContent({
        contact: {
          whatsapp: "+94 71 234 5678",
          partnerMessage: "Partner please",
          playerMessage: "Player please",
          email: "hi@example.test",
        },
        links: [instagram, tiktok],
      }),
    );

    expect(routes.primary).toEqual({
      kind: "whatsapp",
      audience: "partner",
      href: "https://wa.me/94712345678?text=Partner%20please",
    });
    expect(routes.secondary).toEqual({
      kind: "whatsapp",
      audience: "player",
      href: "https://wa.me/94712345678?text=Player%20please",
    });
    expect(routes.email).toBe("mailto:hi@example.test");
  });

  it("falls back to email as the single action when there is no number", () => {
    // Not two identical mailto buttons labelled differently. One action, because
    // there is only one thing to do.
    const routes = contactRoutes(
      parseContent({
        contact: { whatsapp: "TODO", email: "hi@example.test" },
        links: [instagram],
      }),
    );

    expect(routes.primary).toEqual({ kind: "email", audience: null, href: "mailto:hi@example.test" });
    expect(routes.secondary).toBeNull();
    expect(routes.email).toBe("mailto:hi@example.test");
  });

  it("falls back to the first outbound link when neither is recorded", () => {
    // The state the page ships in until the owner pastes a number in. A DM is a
    // real way to reach Frontier, so the page still works - it does not draw a
    // dead button or a placeholder number.
    const routes = contactRoutes(
      parseContent({ contact: {}, links: [instagram, tiktok] }),
    );

    expect(routes.primary).toEqual({
      kind: "link",
      audience: null,
      href: "https://example.test/ig",
      name: "Instagram",
    });
    expect(routes.secondary).toBeNull();
    expect(routes.email).toBeNull();
  });

  it("does not print the same destination twice", () => {
    // Whatever became the primary action is dropped from the channels row
    // beneath it. Instagram as the headline button and Instagram again in the
    // row under it reads like a bug.
    const routes = contactRoutes(parseContent({ contact: {}, links: [instagram, tiktok] }));

    expect(routes.channels.map((link) => link.name)).toEqual(["TikTok"]);
  });

  it("keeps every channel when the primary action is not one of them", () => {
    const routes = contactRoutes(
      parseContent({ contact: { whatsapp: "+94712345678" }, links: [instagram, tiktok] }),
    );

    expect(routes.channels.map((link) => link.name)).toEqual(["Instagram", "TikTok"]);
  });

  it("has no action at all when nothing anywhere is recorded", () => {
    // Degenerate, and it must not throw: the owner can blank every field in
    // content.js. The renderer leaves the slab off rather than drawing an empty
    // one. HOUSE-RULES section 7 - the layout survives a changing item count.
    const routes = contactRoutes(parseContent({}));

    expect(routes.primary).toBeNull();
    expect(routes.secondary).toBeNull();
    expect(routes.email).toBeNull();
    expect(routes.channels).toEqual([]);
  });

  it("falls through to email when the number has no digits in it", () => {
    // "TBA", "ask on Instagram", anything the owner types that is not "TODO"
    // and not a number. Branching on the raw field instead of the built link
    // ships two buttons reading href="null" and skips the email entirely.
    const routes = contactRoutes(
      parseContent({ contact: { whatsapp: "TBA", email: "hi@example.test" }, links: [instagram] }),
    );

    expect(routes.primary).toEqual({ kind: "email", audience: null, href: "mailto:hi@example.test" });
    expect(routes.secondary).toBeNull();
  });

  it("does not draw two buttons that go to the same place", () => {
    // Both messages unrecorded is the state content.js ships in. Without a
    // distinct pre-filled message the two hrefs are identical, and two labels
    // over one link is a lie about what pressing them does.
    const routes = contactRoutes(
      parseContent({ contact: { whatsapp: "+94712345678" }, links: [instagram] }),
    );

    expect(routes.primary.href).toBe("https://wa.me/94712345678");
    expect(routes.secondary).toBeNull();
  });

  it("keeps both buttons when only one message is recorded", () => {
    // Still two different links, so still two honest buttons.
    const routes = contactRoutes(
      parseContent({
        contact: { whatsapp: "+94712345678", partnerMessage: "Partner please" },
      }),
    );

    expect(routes.primary.href).toBe("https://wa.me/94712345678?text=Partner%20please");
    expect(routes.secondary.href).toBe("https://wa.me/94712345678");
  });

  it("leaves a TODO message out of an otherwise good WhatsApp link", () => {
    const routes = contactRoutes(
      parseContent({ contact: { whatsapp: "+94712345678", partnerMessage: "TODO" } }),
    );

    expect(routes.primary.href).toBe("https://wa.me/94712345678");
  });
});

describe("partnerOffer", () => {
  it("drops the unrecorded ones and keeps the owner's own words", () => {
    // Every claim on the contact page about what a partner gets is the owner's,
    // typed into content.js. Nothing here is phrased by the code, and a half
    // finished line is absent rather than printed. HOUSE-RULES section 9.
    const { contact } = parseContent({
      contact: { partnerOffer: ["Named on tournament posters", "TODO: ask", ""] },
    });

    expect(contact.partnerOffer).toEqual(["Named on tournament posters"]);
  });

  it("survives the list being deleted entirely", () => {
    expect(parseContent({}).contact.partnerOffer).toEqual([]);
    expect(parseContent({ contact: {} }).contact.partnerOffer).toEqual([]);
  });
});
