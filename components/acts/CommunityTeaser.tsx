import { SundayLeagueMark } from "@/components/primitives/SundayLeagueMark";

/* The home page's "Join the community" teaser (plan L7): the Sunday Football
   League lockup and one way in, to the Community page where the Registrations
   live. Held from production with the page (PLACEHOLDER gate). */
export function CommunityTeaser() {
  return (
    <section aria-labelledby="community-teaser-heading" className="canvas-night">
      <div className="frame flex flex-col gap-10 py-[clamp(4rem,14vh,9rem)] md:flex-row md:items-end md:justify-between">
        <SundayLeagueMark size="sm" />
        <div className="max-w-[34ch]">
          <h2 id="community-teaser-heading" className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.9] font-bold uppercase">
            Join the community
          </h2>
          <p className="mt-4 text-lg text-bone/85">Bring a team or come alone as a free agent. Sundays, with Frontier.</p>
          <a
            href="/community"
            className="mt-6 flex min-h-12 w-fit items-center bg-yellow px-6 font-display text-[clamp(1rem,0.9rem+0.4vw,1.25rem)] font-bold text-ink uppercase transition-transform duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
          >
            See the league
          </a>
        </div>
      </div>
    </section>
  );
}
