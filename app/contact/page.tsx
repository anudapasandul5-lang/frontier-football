import type { Metadata } from "next";
import raw from "@/content.js";
import { brandIcons } from "@/lib/brand-icons";
import { outboundLinks, parseContent, whatsappHref } from "@/lib/content-data";
import { NextPage } from "@/components/pages/NextPage";
import { PageHero, heroButton } from "@/components/pages/PageHero";
import { PageShell } from "@/components/pages/PageShell";
import { PhotoStrip } from "@/components/pages/PhotoStrip";
import { PastActivities } from "@/components/pages/PastActivities";
import { Roll } from "@/components/primitives/Roll";
import { SplitReveal } from "@/components/primitives/SplitReveal";

export const metadata: Metadata = { title: "Contact" };

/* opus55: a photo hero with the two ways in as buttons, then the details set
   as big type on a yellow panel (each line is a link), the channel logos from
   the home closing band, the photo strip and the record. */
export default function Contact() {
  const data = parseContent(raw);
  const { email, whatsapp, playerMessage } = data.contact;
  const playerLink = whatsappHref(whatsapp, playerMessage);
  const socials = outboundLinks(data).filter((link) => link.name === "Instagram" || link.name === "TikTok");
  // Lowercase: an address set in caps reads as shouting and breaks badly.
  // It wraps only at its dots and @ (the <wbr>s below), never mid-word.
  // min-h-11: a 44px tap target on phones, where one line is only 24px tall.
  const big = "block min-h-11 font-display text-[clamp(1.6rem,4.6vw,4.25rem)] leading-[0.95] font-bold underline-offset-[0.12em] hover:underline";

  return (
    <PageShell
      hero={
        <PageHero
          chapter="Contact"
          eyebrow="Contact"
          lines={["Get in", "touch."]}
          photo={{ src: "/heroes/contact.webp", alt: "Four friends together beside a beer tower at a Frontier watch-along", position: "center 30%" }}
          actions={
            <>
              {playerLink ? (
                <a
                  href={playerLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Message Frontier on WhatsApp (opens in a new tab)"
                  className={`${heroButton} bg-yellow text-ink`}
                >
                  <Roll>WhatsApp us</Roll>
                </a>
              ) : null}
              <a href="/collaborate" className={`${heroButton} border-2 border-bone hover:bg-bone hover:text-ink`}>
                <Roll>For brands</Roll>
              </a>
            </>
          }
        >
          For Sunday League,{" "}
          <a href="/community#sunday-league" className="underline underline-offset-4">
            register a team or join as a free agent
          </a>
          . Brands: see{" "}
          <a href="/collaborate" className="underline underline-offset-4">Collaborate</a>.
        </PageHero>
      }
    >
      <section data-tone="ink" data-chapter="Details" aria-labelledby="details-heading" className="bg-yellow text-ink">
        <div className="frame grid gap-[clamp(2rem,6vh,4rem)] py-[clamp(4rem,12vh,8rem)]">
          <SplitReveal
            id="details-heading"
            lines={["Say hello."]}
            className="font-display text-[clamp(3rem,10vw,9rem)] leading-[0.85] font-bold uppercase"
          />
          <dl className="grid gap-10 border-t-2 border-ink pt-8">
            {email ? (
              <div>
                <dt className="micro mb-3">Email</dt>
                <dd>
                  <a className={big} href={`mailto:${email}`}>
                    {email.split(/(?=[.@])/).map((part, i) => (
                      <span key={i}>
                        {i > 0 ? <wbr /> : null}
                        {part}
                      </span>
                    ))}
                  </a>
                </dd>
              </div>
            ) : null}
            {playerLink ? (
              <div>
                <dt className="micro mb-3">WhatsApp</dt>
                <dd>
                  <a
                    className={big}
                    href={playerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                   
                    aria-label={`Message ${whatsapp} on WhatsApp (opens in a new tab)`}
                  >
                    {whatsapp}
                  </a>
                </dd>
              </div>
            ) : null}
          </dl>
          {socials.length > 0 ? (
            <div>
              <p className="micro mb-3">Follow</p>
              <ul className="flex flex-wrap items-center gap-3">
                {socials.map((link) => {
                  const icon = link.name ? brandIcons[link.name] : undefined;
                  return (
                    <li key={link.name}>
                      <a
                        href={link.url!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Frontier Football on ${link.name} (opens in a new tab)`}
                        className="flex h-14 items-center gap-3 border-2 border-ink px-4 transition-colors hover:bg-ink hover:text-yellow"
                      >
                        {icon ? (
                          <svg viewBox="0 0 24 24" aria-hidden="true" className="size-6 fill-current">
                            <path d={icon} />
                          </svg>
                        ) : null}
                        <span className="micro">{link.handle ?? link.name}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <PhotoStrip
        photos={[
          { src: "/pages/contact-cheer.webp", alt: "Fans cheering at a Frontier watch-along" },
          { src: "/pages/contact-trophies.webp", alt: "4 x 4 Series trophies, medals and prizes laid out on the night" },
          { src: "/pages/contact-watching.webp", alt: "Fans watching the match together at a watch-along" },
        ]}
      />
      <PastActivities />
      <NextPage current="/contact" />
    </PageShell>
  );
}
