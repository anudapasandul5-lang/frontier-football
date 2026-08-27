import { describe, it, expect } from "vitest";
import {
  contactRoutes,
  galleryGroups,
  outboundLinks,
  parseContent,
  partners,
  record,
  tournaments,
  watchAlongs,
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
      driveFolder: null,
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
      driveFolder: null,
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

/* A tournament is a season of the 4x4 Series or a competition (CONTEXT.md). The
   photos page needs the two as one list, in the order the champions grid already
   shows them, so the title is built in one place rather than in each renderer. */
describe("tournaments", () => {
  it("titles a season from its number and a competition from its name", () => {
    const list = tournaments(
      parseContent({
        seasons: [{ season: 6, champion: "Spain" }],
        competitions: [{ name: "Turf Wars" }],
      }),
    );

    expect(list.map((entry) => entry.title)).toEqual(["SZN 6", "Turf Wars"]);
  });

  it("keeps seasons before competitions, in the order written", () => {
    // The champions grid cycles its colours by index, so this order is not
    // cosmetic. The photos page has to agree with it.
    const list = tournaments(
      parseContent({
        seasons: [{ season: 6 }, { season: 5 }],
        competitions: [{ name: "Turf Wars" }, { name: "Division 0" }],
      }),
    );

    expect(list.map((entry) => entry.title)).toEqual(["SZN 6", "SZN 5", "Turf Wars", "Division 0"]);
  });

  it("carries the photo and the Drive folder through", () => {
    const [entry] = tournaments(
      parseContent({
        seasons: [
          {
            season: 6,
            photo: "/champions/szn-6.webp",
            photoAlt: "The SZN 6 champions.",
            driveFolder: "https://drive.google.com/drive/folders/abc",
          },
        ],
      }),
    );

    expect(entry.photo).toBe("/champions/szn-6.webp");
    expect(entry.photoAlt).toBe("The SZN 6 champions.");
    expect(entry.driveFolder).toBe("https://drive.google.com/drive/folders/abc");
  });

  it("reads a TODO Drive folder as absent, so no card links nowhere", () => {
    const [entry] = tournaments(parseContent({ seasons: [{ season: 6, driveFolder: "TODO" }] }));

    expect(entry.driveFolder).toBeNull();
  });

  it("survives content with nothing in it", () => {
    expect(tournaments(parseContent({}))).toEqual([]);
  });
});

/* A watch-along is football Frontier watched, not football Frontier ran. It has
   no champion, which is why it is its own collection and its own gallery group
   rather than another competition (CONTEXT.md). */
describe("watchAlongs", () => {
  it("reads a watch-along and titles it by name", () => {
    const list = watchAlongs(
      parseContent({
        seasons: [],
        watchAlongs: [{ name: "World Cup", note: "July 2026", driveFolder: "https://drive.example" }],
      }),
    );

    expect(list).toHaveLength(1);
    expect(list[0].title).toBe("World Cup");
    expect(list[0].note).toBe("July 2026");
    expect(list[0].driveFolder).toBe("https://drive.example");
  });

  it("never mixes a watch-along into the tournaments list", () => {
    // The whole point of the split. Fold these together and a night in front of
    // a screen ends up under a heading about competitions Frontier ran.
    const data = parseContent({
      seasons: [{ season: 6 }],
      competitions: [{ name: "Turf Wars" }],
      watchAlongs: [{ name: "World Cup" }],
    });

    expect(tournaments(data).map((entry) => entry.title)).toEqual(["SZN 6", "Turf Wars"]);
    expect(watchAlongs(data).map((entry) => entry.title)).toEqual(["World Cup"]);
  });

  it("drops an unnamed watch-along, because a card needs a title", () => {
    const list = watchAlongs(
      parseContent({ seasons: [], watchAlongs: [{ name: "TODO" }, { name: "World Cup" }] }),
    );

    expect(list.map((entry) => entry.title)).toEqual(["World Cup"]);
  });

  it("survives content with no watchAlongs key at all", () => {
    expect(watchAlongs(parseContent({ seasons: [] }))).toEqual([]);
  });
});

/* The gallery page shows one tab per group. A tab bar is only meaningful when
   there is something to switch between, so the groups are filtered before they
   ever reach the renderer. */
describe("galleryGroups", () => {
  it("returns tournaments first, then watch-alongs", () => {
    const groups = galleryGroups(
      parseContent({
        seasons: [{ season: 6 }],
        competitions: [{ name: "Turf Wars" }],
        watchAlongs: [{ name: "World Cup" }],
      }),
    );

    expect(groups.map((group) => group.label)).toEqual(["Tournaments", "Watch-alongs"]);
    expect(groups[0].entries.map((entry) => entry.title)).toEqual(["SZN 6", "Turf Wars"]);
    expect(groups[1].entries.map((entry) => entry.title)).toEqual(["World Cup"]);
  });

  it("drops a group with nothing in it, so no tab leads to an empty panel", () => {
    const groups = galleryGroups(parseContent({ seasons: [{ season: 6 }] }));

    expect(groups.map((group) => group.label)).toEqual(["Tournaments"]);
  });

  it("drops the tournaments group too, if that is the empty one", () => {
    const groups = galleryGroups(
      parseContent({ seasons: [], watchAlongs: [{ name: "World Cup" }] }),
    );

    expect(groups.map((group) => group.label)).toEqual(["Watch-alongs"]);
  });

  it("returns nothing when there is nothing to show", () => {
    expect(galleryGroups(parseContent({}))).toEqual([]);
  });

  it("gives every group an id, since the tabs and panels reference each other", () => {
    // aria-controls and aria-labelledby both need one, and they have to be
    // stable rather than derived from the label at render time.
    const groups = galleryGroups(
      parseContent({ seasons: [{ season: 6 }], watchAlongs: [{ name: "World Cup" }] }),
    );

    expect(groups.map((group) => group.id)).toEqual(["tournaments", "watch-alongs"]);
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

/* ============ T8: the partner page ============ */

describe("whatsappHref", () => {
  it("strips the spaces, plus sign and dashes a written number carries", () => {
    // A phone number is written down as "+94 77 123-4567". wa.me wants digits.
    expect(whatsappHref("+94 77 123-4567")).toBe("https://wa.me/94771234567");
  });

  it("omits the text parameter entirely when there is no message", () => {
    // Not "?text=", not "?text=undefined". An empty parameter opens WhatsApp
    // with a blank draft that looks like the link half-worked.
    expect(whatsappHref("94771234567", null)).toBe("https://wa.me/94771234567");
    expect(whatsappHref("94771234567", "")).toBe("https://wa.me/94771234567");
  });

  it("url-encodes the pre-filled message", () => {
    expect(whatsappHref("+94 77 123 4567", "Hi Frontier, about a partnership")).toBe(
      "https://wa.me/94771234567?text=Hi%20Frontier%2C%20about%20a%20partnership",
    );
  });
});

describe("contactRoutes", () => {
  const withContact = (contact) => parseContent({ contact, links: [] });

  it("puts WhatsApp first and keeps email beside it", () => {
    // wa.me on a desktop browser with no WhatsApp Web session lands on a
    // download page, so email is co-present rather than a fallback rung.
    const routes = contactRoutes(withContact({
      whatsapp: "+94 77 123 4567",
      whatsappMessage: "TODO",
      email: "hello@example.test",
    }));

    expect(routes.primary.kind).toBe("whatsapp");
    expect(routes.primary.href).toBe("https://wa.me/94771234567");
    expect(routes.secondary.kind).toBe("email");
    expect(routes.secondary.href).toBe("mailto:hello@example.test");
  });

  it("promotes email to primary when there is no WhatsApp number, with no secondary", () => {
    const routes = contactRoutes(withContact({ whatsapp: "TODO", email: "hello@example.test" }));

    expect(routes.primary.kind).toBe("email");
    expect(routes.primary.href).toBe("mailto:hello@example.test");
    expect(routes.secondary).toBeNull();
  });

  it("falls through to the Instagram DM when neither is recorded", () => {
    // This is the path the site takes today: every contact field is TODO.
    const routes = contactRoutes(
      parseContent({
        contact: { whatsapp: "TODO", email: "TODO" },
        links: [{ name: "Instagram", url: "https://example.test/ig" }],
      }),
    );

    expect(routes.primary.kind).toBe("instagram");
    expect(routes.primary.href).toBe("https://example.test/ig");
    expect(routes.secondary).toBeNull();
  });

  it("never returns a null primary, even with nothing recorded anywhere", () => {
    // The contact slab exists to give a brand one way to reply. A slab with no
    // action is the one outcome this page cannot ship.
    expect(contactRoutes(parseContent({})).primary).not.toBeNull();
    expect(contactRoutes(parseContent({})).primary.href).toMatch(/^https:\/\//);
  });
});

describe("record", () => {
  it("returns the two groups labelled and never merged", () => {
    const groups = record(
      parseContent({
        seasons: [{ season: 6, photo: "/champions/szn-6.webp" }],
        watchAlongs: [{ name: "World Cup" }],
      }),
    );

    expect(groups.map((group) => group.id)).toEqual(["tournaments", "watch-alongs"]);
    expect(groups.map((group) => group.label)).toEqual(["Tournaments", "Watch-alongs"]);
  });

  it("drops a group with nothing in it rather than drawing an empty heading", () => {
    const groups = record(parseContent({ seasons: [{ season: 1 }] }));

    expect(groups.map((group) => group.id)).toEqual(["tournaments"]);
  });

  it("flags every entry for whether it carries a photograph", () => {
    const [tournaments] = record(
      parseContent({
        seasons: [{ season: 6, photo: "/champions/szn-6.webp" }, { season: 5, photo: "TODO" }],
      }),
    );

    expect(tournaments.entries.map((entry) => entry.hasPhoto)).toEqual([true, false]);
  });

  it("collapses a run of photo-less entries into one compact node", () => {
    // Five of the nine have a picture and carry the page. Drawing four full rows
    // around four bare titles is what makes a short record look thin.
    const [tournaments] = record(
      parseContent({
        seasons: [
          { season: 6, photo: "/champions/szn-6.webp" },
          { season: 5 },
          { season: 4, photo: "/champions/szn-4.webp" },
          { season: 2 },
          { season: 1 },
        ],
      }),
    );

    expect(tournaments.nodes.map((node) => node.kind)).toEqual([
      "entry",
      "cluster",
      "entry",
      "cluster",
    ]);
    expect(tournaments.nodes[3].entries.map((entry) => entry.title)).toEqual(["SZN 2", "SZN 1"]);
  });

  it("never reorders a group to do it, so the seasons still read newest first", () => {
    const [tournaments] = record(
      parseContent({
        seasons: [
          { season: 6, photo: "/champions/szn-6.webp" },
          { season: 5 },
          { season: 4, photo: "/champions/szn-4.webp" },
        ],
      }),
    );

    expect(tournaments.entries.map((entry) => entry.title)).toEqual(["SZN 6", "SZN 5", "SZN 4"]);
  });

  it("carries a date only when one is recorded", () => {
    const [tournaments] = record(
      parseContent({
        seasons: [{ season: 6, date: "Dec 2025" }, { season: 5, date: "TODO" }],
      }),
    );

    expect(tournaments.entries.map((entry) => entry.date)).toEqual(["Dec 2025", null]);
  });
});
