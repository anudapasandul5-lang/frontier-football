import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { parseContent, upcomingEvents } from "@/lib/content-data";
import { Events } from "./Events";

const render = (events: unknown[]) => renderToStaticMarkup(<Events events={upcomingEvents(parseContent({ events }))} />);

describe("Events act", () => {
  it("is absent from the page while content.js has no events", () => {
    expect(render([])).toBe("");
  });

  it("is absent when the only event has no name", () => {
    expect(render([{ name: "TODO", date: "Sat 20 Sep" }])).toBe("");
  });

  it("draws a named event with what is recorded and a dash for what is not", () => {
    const html = render([{ name: "SZN 7 Final", date: "TODO", venue: "Athlete 360" }]);
    expect(html).toContain("SZN 7 Final");
    expect(html).toContain("Athlete 360");
    expect(html).toContain("Not recorded yet");
  });
});
