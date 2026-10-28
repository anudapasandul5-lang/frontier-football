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

const h2 = "font-display text-title leading-[0.9] font-bold uppercase";

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
          lines={["Who we", "are."]}
          photo={{ src: "/heroes/who-main.webp", alt: "Three smiling friends pose together at the Main Sports Bar during a Frontier watch party", position: "center 32%" }}
        >
          {raw.aboutIntro}
        </PageHero>
      }
    >
      <PhotoStrip
        aspect="aspect-[3/2]"
        photos={[
          { src: "/who/crew-rain.webp", alt: "Seven friends sit close and smile on a low wall in the rain, one holding a microphone" },
          { src: "/who/crew-trophies.webp", alt: "Seven people in Frontier and team shirts pose behind a gold trophy and boot awards on a table" },
          { src: "/who/crew-hypebam.webp", alt: "Five people in 4 x 4 Series shirts, one wearing a medal, pose under an orange Hype Bam tent" },
        ]}
      />

      {/* Signed-off story copy, on the page's bone background. */}
      <section data-tone="ink" data-chapter="Our story" aria-labelledby="who-heading" className="canvas-bone relative isolate overflow-clip py-[clamp(3rem,8vh,5rem)]">
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-[5] h-[15%] bg-[linear-gradient(var(--canvas),transparent)]" />
        <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-[5] h-[25%] bg-[linear-gradient(transparent,var(--canvas))]" />
        {/* Label, headline, intro and quote share the pitch's centre line, so
            the markings are the only decoration (owner, 2026-10-07: "a bit
            messy", picked the centred option). The quote keeps its staggered
            serif lines and yellow marks ("I like how the words in the commas
            looked before"); the block is centred, the stagger inside it kept. */}
        <div className="frame relative">
          <div className="text-center">
            <SplitReveal id="who-heading" lines={["Our story"]} className="font-display text-display-l leading-[0.85] font-bold uppercase" />
            <p className="story-fade mx-auto mt-8 max-w-[46ch] text-balance text-lead leading-relaxed">
              Frontier Football is a platform for Sri Lanka’s football community. We spotlight talent and bring together everyone who loves the game.
            </p>
          </div>
          <blockquote className="story-quote relative mx-auto my-[clamp(1.5rem,5vh,3rem)] w-fit py-[clamp(1.5rem,4vh,2.5rem)]">
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
              src="/who/story-shirt.webp"
              srcSet={phoneSrcSet("/who/story-shirt.webp")}
              sizes="(min-width: 768px) 45vw, 100vw"
              alt="A man in a cap, seen from behind, wears a Frontier Futsal crest shirt and holds a microphone under the floodlights"
              width={1280}
              height={1920}
              loading="lazy"
              decoding="async"
              className="story-photo block aspect-[4/5] w-full object-cover object-[center_40%] md:-ml-[3vw] md:w-[calc(100%+3vw)] md:max-w-none"
            />
            <div>
              {/* Last two sentences are from the owner's Sunday Socials proposal PDF (2026-10-28). */}
              <p className="max-w-[46ch] text-lead leading-relaxed">
                We build the space where players shine, get recognised and grow, in a community that goes well beyond casual play. Through tournaments, collaborations and digital content, football culture and brands meet here. What we build is never just a single event or a standard watch party, it is a deeply connected ecosystem for people who live and breathe the sport.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section data-tone="ink" data-chapter="The run so far" aria-labelledby="run-heading" className="overflow-x-clip py-[clamp(4rem,12vh,8rem)]">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-12">
          <SplitReveal id="run-heading" lines={["The run so far"]} className="scroll-mt-24 font-display text-display-l leading-[0.86] font-bold uppercase" />
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
                <p className="font-display text-lead-l uppercase">{person.name}</p>
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
