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

/* Faint pitch markings behind Our story, so the bone canvas reads as a
   ground, not a blank page (owner, 2026-10-07: "the background is plain").
   Ink at low opacity keeps it inside the palette. It sits inside the quote so
   the halfway line and centre circle always cross the quote's middle; the
   section's edge bands fade it out (owner: "align it with the lines"). Drawn in full by default;
   AboutMotion draws the lines in on scroll when motion is allowed. */
function PitchLines() {
  const line = { pathLength: 1, className: "pitch-line" };
  return (
    <svg aria-hidden="true" viewBox="0 0 1000 1400" preserveAspectRatio="xMidYMid slice" className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[2000px] w-screen -translate-x-1/2 -translate-y-1/2 fill-none stroke-ink/[0.09] [stroke-width:3]">
      <rect {...line} x="40" y="40" width="920" height="1320" />
      <path {...line} d="M40 700H960" />
      <circle {...line} cx="500" cy="700" r="150" />
      <path {...line} d="M220 40V300H780V40M380 40V120H620V40M400 300A120 120 0 0 0 600 300" />
      <path {...line} d="M220 1360V1100H780V1360M380 1360V1280H620V1360M400 1100A120 120 0 0 1 600 1100" />
    </svg>
  );
}

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
      <section data-tone="ink" data-chapter="Our story" aria-labelledby="who-heading" className="canvas-bone relative isolate overflow-clip py-[clamp(4rem,14vh,9rem)]">
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-[5] h-[15%] bg-[linear-gradient(var(--canvas),transparent)]" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-[25%] bg-[linear-gradient(transparent,var(--canvas))]" />
        {/* Label, headline, intro and quote share the pitch's centre line, so
            the markings are the only decoration (owner, 2026-10-07: "a bit
            messy", picked the centred option). The quote keeps its staggered
            serif lines and yellow marks ("I like how the words in the commas
            looked before"); the block is centred, the stagger inside it kept. */}
        <div className="frame relative">
          <p className="micro mb-[clamp(2rem,5vh,3.5rem)] text-center text-ink">Our story</p>
          <div className="text-center">
            <SplitReveal id="who-heading" lines={["A platform."]} className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.85] font-bold uppercase" />
            <p className="story-fade mx-auto mt-8 max-w-[46ch] text-balance text-[clamp(1.125rem,1.5vw,1.375rem)] leading-relaxed">
              Frontier Football is a platform for Sri Lanka’s football community. We spotlight talent and bring together everyone who loves the game.
            </p>
          </div>
          <blockquote className="story-quote relative mx-auto my-[clamp(3rem,10vh,6rem)] w-fit py-[clamp(2rem,6vh,4rem)]">
            <PitchLines />
            <span aria-hidden="true" className="story-mark pointer-events-none absolute -top-[0.38em] left-0 font-serif text-[clamp(6rem,14vw,12rem)] leading-none text-yellow select-none">
              &ldquo;
            </span>
            {/* The closing mark mirrors the opening one: same size, at the
                bottom right, so the pair bookends the line. */}
            <span aria-hidden="true" className="story-mark pointer-events-none absolute right-0 -bottom-[0.62em] font-serif text-[clamp(6rem,14vw,12rem)] leading-none text-yellow select-none">
              &rdquo;
            </span>
            <p className="relative font-serif text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.98] text-ink">
              <span className="story-line block">Talent was never missing.</span>{" "}
              <em className="story-line block italic md:pl-[2em]">The platform was.</em>
            </p>
          </blockquote>
          <div className="story-duel grid gap-8 md:grid-cols-[45fr_55fr] md:items-center md:gap-[clamp(2rem,5vw,5rem)]">
            <img
              src="/home/moment-duel.webp"
              srcSet={phoneSrcSet("/home/moment-duel.webp")}
              sizes="(min-width: 768px) 45vw, 100vw"
              alt="Two players go shoulder to shoulder for the ball at a Frontier match"
              width={1200}
              height={900}
              loading="lazy"
              decoding="async"
              className="story-photo block aspect-[4/3] w-full object-cover"
            />
            <div>
              <p className="max-w-[46ch] text-[clamp(1.125rem,1.5vw,1.375rem)] leading-relaxed">
                We build the space where players shine, get recognised and grow, in a community that goes well beyond casual play. Through tournaments, collaborations and digital content, football culture and brands meet here.
              </p>
              <ul aria-label="What we do" className="mt-8 flex flex-wrap gap-2">
                {["Tournaments", "Collaborations", "Digital content"].map((t) => (
                  <li key={t} className="story-pill border border-ink px-4 py-2 font-display text-sm uppercase">
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
