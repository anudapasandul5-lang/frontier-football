import { describe, expect, it } from "vitest";
import { activities, registrations } from "./community";

const content = {
  seasons: [{ season: 1, albumId: "szn-1" }, { season: 2, albumId: "szn-2" }],
  competitions: [
    { name: "Frontier Futsal Tournament", albumId: "frontier-futsal", beforeSeries: true },
    { name: "Turf Wars", albumId: "TODO", beforeSeries: true },
    { name: "Division 0", note: "PS5 FC26 tournament", albumId: "division-0" },
  ],
  watchAlongs: [{ name: "Final: Spain vs Argentina", albumId: "wa-final-esp-arg" }],
  contact: { whatsapp: "+94 76 343 1469", email: "Info.frontierfootball@gmail.com" },
  league: {
    teamMessage: "Hi Frontier, I'd like to register a team for the Sunday Football League.",
    freeAgentMessage: "Hi Frontier, I'd like to join the Sunday Football League as a free agent.",
  },
};

describe("registrations", () => {
  it("gives each button its own prefilled WhatsApp text to Frontier's number", () => {
    const [team, freeAgent] = registrations(content);
    expect(team).toEqual({
      label: "Register team",
      href: `https://wa.me/94763431469?text=${encodeURIComponent(content.league.teamMessage)}`,
    });
    expect(freeAgent).toEqual({
      label: "Join solo player",
      href: `https://wa.me/94763431469?text=${encodeURIComponent(content.league.freeAgentMessage)}`,
    });
    expect(team.href).not.toBe(freeAgent.href);
  });

  it("drops a button whose message is unrecorded rather than opening a blank chat", () => {
    const result = registrations({ ...content, league: { ...content.league, freeAgentMessage: "TODO" } });
    expect(result.map((r) => r.label)).toEqual(["Register team"]);
  });

  it("offers no buttons when no WhatsApp number is recorded", () => {
    expect(registrations({ ...content, contact: { whatsapp: "TODO" } })).toEqual([]);
  });
});

describe("activities", () => {
  it("lists every past activity in the order Frontier ran them, none with a way to join", () => {
    const past = activities(content);
    expect(past.map((a) => a.name)).toEqual([
      "Frontier Futsal Tournament",
      "Turf Wars",
      "4 x 4 Series",
      "Division 0",
      "Watch-alongs",
    ]);
    for (const activity of past) expect(Object.keys(activity).sort()).toEqual(["href", "name", "note", "photo"]);
  });

  it("links a past activity to its album when it has one, otherwise to the gallery", () => {
    const byName = Object.fromEntries(activities(content).map((a) => [a.name, a.href]));
    expect(byName["Frontier Futsal Tournament"]).toBe("/albums/frontier-futsal");
    expect(byName["Turf Wars"]).toBe("/gallery");
    expect(byName["4 x 4 Series"]).toBe("/gallery");
    expect(byName["Division 0"]).toBe("/albums/division-0");
  });

  it("carries a photo for each activity: its own, the newest season's, or the first watch-along's", () => {
    const withPhotos = {
      ...content,
      seasons: [{ season: 1, photo: "/champions/szn-1.webp" }, { season: 2, photo: "/champions/szn-2.webp" }],
      competitions: [{ name: "Division 0", photo: "/champions/division-0.webp" }, { name: "Turf Wars", photo: "TODO" }],
      watchAlongs: [{ name: "Final", photo: "/champions/wa-final.webp" }],
    };
    const byName = Object.fromEntries(activities(withPhotos).map((a) => [a.name, a.photo]));
    expect(byName["Division 0"]).toBe("/champions/division-0.webp");
    expect(byName["Turf Wars"]).toBeNull();
    expect(byName["4 x 4 Series"]).toBe("/champions/szn-2.webp");
    expect(byName["Watch-alongs"]).toBe("/champions/wa-final.webp");
  });
});
