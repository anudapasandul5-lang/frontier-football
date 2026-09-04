import { describe, it, expect } from "vitest";
import { outboundLinks, parseContent, partners } from "./content-data.js";

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
