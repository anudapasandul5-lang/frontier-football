import { describe, it, expect } from "vitest";
import { parseContent } from "./champions-data.js";

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
