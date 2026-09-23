import type { Metadata } from "next";
import { Fragment } from "react";
import raw from "@/content.js";
import { journey, parseContent, people } from "@/lib/content-data";
import { AboutMotion } from "@/components/motion/AboutMotion";
import { PageShell } from "@/components/pages/PageShell";

export const metadata: Metadata = { title: "Who We Are" };
const PEOPLE_RELEASED = false;

type Stop = ReturnType<typeof journey>[number];
type Party = ReturnType<typeof parseContent>["watchAlongs"][number];

const h2 = "font-display text-[clamp(2.125rem,5.4vw,5.25rem)] leading-[0.9] font-bold uppercase";

/* Photos overlap the type on a screen wide enough; below 768px they stack
   un-rotated, where an overlap would land on the words. Decorative: each is
   captioned on the gallery page, so hidden here rather than described twice. */
const TILES = [
  { src: "/gallery/p11.webp", w: 1280, h: 658, pos: "md:top-[2%] md:right-[6%] md:w-[30%] md:rotate-[2.5deg]" },
  { src: "/gallery/p06.webp", w: 1280, h: 853, pos: "md:top-[36%] md:right-[38%] md:w-[24%] md:-rotate-[3.5deg]" },
  { src: "/gallery/p14.webp", w: 1280, h: 649, pos: "md:top-[58%] md:right-[2%] md:w-[26%] md:-rotate-[1.5deg]" },
];

/* One row of the record: identity, photo, what is actually known. Champion
   prints "Not recorded yet" rather than vanishing (a record with a silent gap
   reads as though nobody won); venue, date and note simply drop out. */
function RecordRow({ stop }: { stop: Stop }) {
  const season = "season" in stop && typeof stop.season === "number" ? stop.season : null;
  return (
    <li className="record-row grid gap-5 border-t border-ink/20 py-10 first:border-t-0 first:pt-0 min-[900px]:grid-cols-[minmax(110px,0.9fr)_minmax(0,2.6fr)_minmax(180px,1.1fr)] min-[900px]:items-center min-[900px]:gap-10">
      {season !== null ? (
        <div className="flex items-baseline gap-2 min-[900px]:block">
          <p className="micro">4 x 4 Series SZN</p>
          <p className="font-display text-[clamp(2.75rem,15vw,4.5rem)] leading-none font-bold min-[900px]:mt-2 min-[900px]:text-[clamp(3.5rem,7vw,6.875rem)]">
            {season}
          </p>
        </div>
      ) : (
        <p className="font-display text-[clamp(1.625rem,2.6vw,2.5rem)] leading-none uppercase">{stop.name}</p>
      )}
      {stop.photo ? (
        <figure className="aspect-video overflow-hidden border-2 border-ink min-[900px]:aspect-[2/1]">
          <img
            src={stop.photo}
            alt={stop.photoAlt ?? `A photograph from ${stop.name}.`}
            width={1200}
            height={675}
            loading="lazy"
            decoding="async"
            className="record-photo size-full scale-[1.14] object-cover"
          />
        </figure>
      ) : (
        <span className="hidden min-[900px]:block" />
      )}
      <div className="grid content-start gap-2">
        {"champion" in stop ? (
          <>
            <p className="micro">Champion</p>
            <p className={stop.champion ? "font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.875rem)] uppercase" : "text-[15px]"}>
              {stop.champion ?? "Not recorded yet"}
            </p>
          </>
        ) : null}
        {"venue" in stop && stop.venue ? <p className="text-[12px]">{stop.venue}</p> : null}
        {"date" in stop && stop.date ? <p className="text-[12px]">{stop.date}</p> : null}
        {stop.note ? <p className="mt-2 text-[12px] italic">{stop.note}</p> : null}
      </div>
    </li>
  );
}

/* The watch parties are an inset row, because they happened DURING the run;
   content.js's watchAlongsAfter says which season they sit behind. */
function PartiesRow({ parties }: { parties: Party[] }) {
  return (
    <li className="record-row grid gap-5 border-t border-ink/20 py-10 min-[900px]:grid-cols-[minmax(110px,0.9fr)_minmax(0,2.6fr)_minmax(180px,1.1fr)] min-[900px]:items-start min-[900px]:gap-10">
      <div>
        <p className="font-display text-[clamp(1.625rem,2.6vw,2.5rem)] leading-none uppercase">Watch parties</p>
        <p className="micro mt-2">Alongside the run</p>
      </div>
      <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-3 min-[900px]:col-[2/-1]">
        {parties.map((party) => {
          const body = (
            <>
              {party.photo ? (
                <img
                  src={party.photo}
                  alt={party.photoAlt ?? `A photograph from ${party.name}.`}
                  width={400}
                  height={300}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/3] h-auto w-full border-2 border-ink object-cover"
                />
              ) : null}
              <p className="text-[12px] font-bold group-hover:underline">{party.name}</p>
              {party.date ? <p className="text-[12px]">{party.date}</p> : null}
            </>
          );
          return (
            <li key={party.name}>
              {party.driveFolder ? (
                <a
                  href={party.driveFolder}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${party.name} photos on Google Drive (opens in a new tab)`}
                  className="group grid h-full content-start gap-2"
                >
                  {body}
                </a>
              ) : (
                <div className="grid h-full content-start gap-2">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </li>
  );
}

export default function WhoWeAre() {
  const data = parseContent(raw);
  const stops = journey(data);
  const parties = data.watchAlongs.filter((w) => w.name);
  const anchor = data.watchAlongsAfter;
  const anchored = parties.length > 0 && stops.some((s) => "season" in s && s.season === anchor);
  const crew = people(data);

  return (
    <PageShell>
      <section className="pt-10 pb-12 md:pt-20 md:pb-32">
        <div className="frame relative md:min-h-[62vh]">
          <p className="micro mb-5">Colombo, since 2024</p>
          <h1 className="relative z-[1] font-display text-[min(clamp(2.5rem,13vw,13.75rem),20vh)] leading-[0.88] font-bold uppercase">
            Who we
            <br />
            are
          </h1>
          <p className="relative z-[1] mt-8 max-w-[46ch] text-[clamp(1.125rem,1rem+0.5vw,1.5rem)] leading-[1.45] md:max-w-[36%]">
            Frontier started in Colombo in 2024 so small sided football here had somewhere to happen. It began with one
            night on turf and it is six seasons deep now.
          </p>
          <div aria-hidden="true" className="mt-10 grid gap-4 md:mt-0 md:block">
            {TILES.map((tile, i) => (
              <figure key={tile.src} className={`border-2 border-ink bg-bone p-2 md:absolute ${tile.pos}`}>
                <img
                  src={tile.src}
                  width={tile.w}
                  height={tile.h}
                  alt=""
                  loading={i === 0 ? undefined : "lazy"}
                  decoding="async"
                  className="block aspect-[4/3] w-full object-cover"
                />
              </figure>
            ))}
          </div>
        </div>
      </section>


      {/* The owner's own words, from the 4x4 Series proposal deck (2026-09-10).
          v1's green band; ink now (strict bone/ink, owner 2026-09-22). */}
      <section aria-labelledby="who-heading" className="canvas-ink py-12 sm:py-20">
        <div className="frame">
          <h2 id="who-heading" className={`${h2} mb-6 sm:mb-8`}>
            Who we are
          </h2>
          <p className="max-w-[58ch] text-[15px] leading-relaxed">
            Frontier Football has evolved into a main stage for Sri Lanka&apos;s futsal community, built to spotlight talent and
            unite everyone who shares a passion for the game.
          </p>
          <p className="my-6 max-w-[30ch] font-serif text-[clamp(1.5rem,3.2vw,2.75rem)] leading-[1.1] sm:my-8">
            Talent was never missing. The platform was.
          </p>
          <p className="max-w-[58ch] text-[15px] leading-relaxed">
            Our mission is to create a space where players can shine, get recognised, and grow their presence within a
            community that goes beyond casual play. Through tournaments, collaborations and engaging digital content,
            Frontier Football has grown into a platform where futsal culture and brands naturally align.
          </p>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="frame">
          <h2 className={h2}>The run so far</h2>
          <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed">
            Frontier has run small-sided tournaments and watch parties in Colombo. Where a champion, a month or
            a venue is missing, nobody has written it down yet.
          </p>
          <ol className="mt-15">
            {stops.map((stop) => (
              <Fragment key={stop.name}>
                <RecordRow stop={stop} />
                {anchored && "season" in stop && stop.season === anchor ? <PartiesRow parties={parties} /> : null}
              </Fragment>
            ))}
            {parties.length > 0 && !anchored ? <PartiesRow parties={parties} /> : null}
          </ol>
        </div>
      </section>

      {/* Absent while content.js lists nobody: no stand-in for someone who has
          not agreed to be named. */}
      {PEOPLE_RELEASED && crew.length > 0 ? (
        <section className="frame py-12 sm:py-20">
          <h2 className={`${h2} mb-10`}>The people</h2>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-6">
            {crew.map((person) => (
              <li key={person.name} className="grid content-start gap-4">
                {person.photo ? (
                  <figure className="border-2 border-ink bg-bone p-1">
                    <img
                      src={person.photo}
                      alt={person.photoAlt ?? `${person.name}.`}
                      width={600}
                      height={750}
                      loading="lazy"
                      decoding="async"
                      className="block aspect-[4/5] w-full object-cover"
                    />
                  </figure>
                ) : null}
                <p className="font-display text-[clamp(1.375rem,1.2rem+0.7vw,1.875rem)] uppercase">{person.name}</p>
                {person.role ? <p className="micro">{person.role}</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      <AboutMotion />
    </PageShell>
  );
}
