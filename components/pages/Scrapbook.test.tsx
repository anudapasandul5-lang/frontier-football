import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import raw from "@/content.js";
import { parseContent } from "@/lib/content-data";
import { Scrapbook, SeriesSeasons } from "./Scrapbook";

describe("Who We Are scrapbook", () => {
  it("connects four events in the approved order and keeps existing album routes", () => {
    const html = renderToStaticMarkup(<Scrapbook data={parseContent(raw)} />);
    const names = ["Ground Zero", "4 x 4 Series", "Watch Parties", "Division 0"];
    const captions = [...html.matchAll(/<strong[^>]*>([^<]+)/g)].map((match) => match[1]);
    expect(captions).toEqual(names);
    expect(html).toContain('href="/who-we-are/4x4-series"');
    expect(html).toContain('href="/albums/frontier-futsal"');
    expect(html).toContain('href="/albums/division-0"');
    expect(html).toContain('href="/gallery#watch-parties"');
    expect(html).toContain("Milinda Deshan / ThePapare");
  });

  it("does not render invented photos or dead links for missing event data", () => {
    const html = renderToStaticMarkup(<Scrapbook data={parseContent({})} />);
    expect(html).not.toContain("<img");
    expect(html).not.toContain("TODO");
    expect(html).not.toContain('href="/albums/');
  });
});

describe("4 x 4 Series archive", () => {
  it("orders seasons chronologically without changing the facts file order", () => {
    const data = parseContent(raw);
    const before = data.seasons.map((season) => season.season);
    const html = renderToStaticMarkup(<SeriesSeasons seasons={data.seasons} />);
    const links = [...html.matchAll(/href="\/albums\/szn-(\d)"/g)].map((match) => Number(match[1]));
    expect(links).toEqual([1, 2, 3, 4, 5, 6]);
    expect(data.seasons.map((season) => season.season)).toEqual(before);
  });

  it("shows confirmed facts and hides unknown champions, dates and photos", () => {
    const data = parseContent({ seasons: [
      { season: 1, champion: "TODO: verify", date: "TODO", photo: "TODO", venue: "Athlete 360" },
      { season: 2, champion: "Confirmed FC", date: "7 October 2026", albumId: "szn-2" },
    ] });
    const html = renderToStaticMarkup(<SeriesSeasons seasons={data.seasons} />);
    expect(html).toContain("Athlete 360");
    expect(html).toContain("Confirmed FC");
    expect(html).toContain("7 October 2026");
    expect(html).not.toMatch(/TODO|Not recorded yet|<img|href="null"/);
    expect(html.match(/Champion/g)).toHaveLength(1);
  });
});
