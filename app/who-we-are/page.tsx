import type { Metadata } from "next";
import raw from "@/content.js";
import { parseContent, people } from "@/lib/content-data";
import { Scrapbook } from "@/components/pages/Scrapbook";
import { AboutMotion } from "@/components/motion/AboutMotion";
import { NextPage } from "@/components/pages/NextPage";
import { PageHero } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { PhotoStrip } from "@/components/pages/PhotoStrip";
import { SplitReveal } from "@/components/primitives/SplitReveal";
import { phoneSrcSet } from "@/lib/phone-image";

export const metadata: Metadata = { title: "Who We Are" };

const h2 = "font-display text-[clamp(2.125rem,5.4vw,5.25rem)] leading-[0.9] font-bold uppercase";

export default function WhoWeAre() {
  const data = parseContent(raw);
  const crew = people(data);

  return (
    <PageShell
      hero={
        <PageHero
          chapter="Who we are"
          eyebrow="Since Ground Zero"
          lines={["Who we", "are."]}
          photo={{ src: "/heroes/who.webp", alt: "A long table of supporters with Argentina flags at the World Cup final watch-along", position: "center 40%" }}
        >
          {raw.aboutIntro}
        </PageHero>
      }
    >
      <PhotoStrip
        photos={[
          { src: "/who/szn6-scramble.webp", alt: "Players scrambling for the ball in front of goal at 4 x 4 Series SZN 06" },
          { src: "/who/division-0-crowd.webp", alt: "Players and friends at the Division 0 console tournament" },
          { src: "/who/norway-england-fan.webp", alt: "A fan with both arms up at the Norway vs England watch-along" },
        ]}
      />

      {/* Signed-off story copy, on the page's bone background. */}
      <section data-tone="ink" data-chapter="Our story" aria-labelledby="who-heading" className="canvas-bone py-[clamp(4rem,14vh,9rem)]">
        {/* United's editorial moves (docs/design/united/DESIGN.md): a tick-rule
            under a micro-label, an unbalanced 55/45 split with the small body
            offset right, the serif line set against the condensed caps, and
            one photo to break the text wall (owner, 2026-10-07: "too plain"). */}
        <div className="frame">
          <div className="mb-[clamp(2rem,5vh,3.5rem)] flex items-center gap-4">
            <p className="micro shrink-0 text-ink">Our story</p>
            <span aria-hidden="true" className="h-2 flex-1 border-x border-b border-ink/40" />
          </div>
          <div>
            <SplitReveal id="who-heading" lines={["A platform."]} className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.85] font-bold uppercase" />
            <p className="mt-8 max-w-[46ch] text-[clamp(1.125rem,1.5vw,1.375rem)] leading-relaxed md:ml-[55%]">
              Frontier Football is a platform for Sri Lanka’s football community. We spotlight talent and bring together everyone who loves the game.
            </p>
          </div>
          <blockquote className="relative my-[clamp(3rem,10vh,6rem)] border-y border-ink py-[clamp(2rem,6vh,4rem)]">
            <span aria-hidden="true" className="pointer-events-none absolute -top-[0.38em] left-0 font-serif text-[clamp(6rem,14vw,12rem)] leading-none text-yellow select-none">
              &ldquo;
            </span>
            {/* The closing mark mirrors the opening one: same size, hanging on
                the bottom rule at the right, so the pair bookends the line. */}
            <span aria-hidden="true" className="pointer-events-none absolute right-0 -bottom-[0.62em] font-serif text-[clamp(6rem,14vw,12rem)] leading-none text-yellow select-none">
              &rdquo;
            </span>
            <p className="relative font-serif text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.98] text-ink">
              Talent was never missing.{" "}
              <em className="block italic md:pl-[18%]">
The platform was.</em>
            </p>
          </blockquote>
          <div className="grid gap-8 md:grid-cols-[45fr_55fr] md:items-center md:gap-[clamp(2rem,5vw,5rem)]">
            <img
              src="/home/moment-duel.webp"
              srcSet={phoneSrcSet("/home/moment-duel.webp")}
              sizes="(min-width: 768px) 45vw, 100vw"
              alt="Two players go shoulder to shoulder for the ball at a Frontier match"
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className="block aspect-[4/3] w-full object-cover"
            />
            <div>
              <p className="max-w-[46ch] text-[clamp(1.125rem,1.5vw,1.375rem)] leading-relaxed">
                We build the space where players shine, get recognised and grow, in a community that goes well beyond casual play. Through tournaments, collaborations and digital content, football culture and brands meet here.
              </p>
              <ul aria-label="What we do" className="mt-8 flex flex-wrap gap-2">
                {["Tournaments", "Collaborations", "Digital content"].map((t) => (
                  <li key={t} className="border border-ink px-4 py-2 font-display text-sm uppercase">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section data-tone="ink" data-chapter="The run so far" aria-labelledby="run-heading" className="overflow-x-clip py-[clamp(4rem,12vh,8rem)]">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-12">
          <SplitReveal id="run-heading" lines={["The run", "so far"]} className="max-w-[850px] scroll-mt-24 font-display text-[clamp(4.5rem,12vw,10.625rem)] leading-[0.86] font-bold uppercase" />
          <Scrapbook data={data} />
        </div>
      </section>

      {/* Absent while content.js lists nobody: no stand-in for someone who has
          not agreed to be named. */}
      {crew.length > 0 ? (
        <section data-tone="ink" data-chapter="The people" className="frame py-12 sm:py-20">
          <h2 className={`${h2} mb-10`}>The people</h2>
          <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-6">
            {crew.map((person) => (
              <li key={person.name} className="grid content-start gap-4">
                {person.photo ? (
                  <figure className="border-2 border-ink bg-bone p-1">
                    <img
                      src={person.photo}
                      srcSet={phoneSrcSet(person.photo)}
                      sizes="(min-width: 768px) 25vw, 50vw"
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
      <NextPage current="/who-we-are" />
      <AboutMotion />
    </PageShell>
  );
}
