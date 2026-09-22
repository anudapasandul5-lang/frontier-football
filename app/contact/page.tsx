import type { Metadata } from "next";
import raw from "@/content.js";
import { outboundLinks, parseContent, whatsappHref } from "@/lib/content-data";
import { Masthead, PageShell } from "@/components/pages/PageShell";

export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  const data = parseContent(raw);
  const { email, whatsapp, playerMessage } = data.contact;
  const playerLink = whatsappHref(whatsapp, playerMessage);
  const socials = outboundLinks(data).filter((link) => link.name === "Instagram" || link.name === "TikTok");
  return (
    <PageShell>
      <Masthead eyebrow="Contact" lines={["Get in", "touch."]}>
        Players: message us on WhatsApp until Community opens. Brands: see{" "}
        <a href="/collaborate" className="underline underline-offset-4">Collaborate</a>.
      </Masthead>
      <section aria-label="Contact details" className="frame pb-16 sm:pb-24">
        <div className="canvas-night grid gap-8 p-6 sm:p-10 md:grid-cols-2">
          {email ? (
            <div>
              <p className="micro mb-3">Email</p>
              <a className="break-all text-[clamp(1rem,2.2vw,1.5rem)] underline underline-offset-4" href={`mailto:${email}`}>{email}</a>
            </div>
          ) : null}
          {playerLink ? (
            <div>
              <p className="micro mb-3">WhatsApp</p>
              <a className="text-[clamp(1rem,2.2vw,1.5rem)] underline underline-offset-4" href={playerLink} target="_blank" rel="noopener noreferrer" aria-label={`Message ${whatsapp} on WhatsApp (opens in a new tab)`}>{whatsapp}</a>
            </div>
          ) : null}
          {socials.length > 0 ? (
            <div className="md:col-span-2">
              <p className="micro mb-3">Follow</p>
              <ul className="flex flex-wrap gap-x-8 gap-y-2">
                {socials.map((link) => (
                  <li key={link.name}>
                    <a className="underline underline-offset-4" href={link.url!} target="_blank" rel="noopener noreferrer" aria-label={`Frontier Football on ${link.name} (opens in a new tab)`}>{link.name} {link.handle}</a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>
    </PageShell>
  );
}
