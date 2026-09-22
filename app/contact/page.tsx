import type { Metadata } from "next";
import { ContactRoutes } from "@/components/pages/ContactRoutes";
import { Masthead, PageShell } from "@/components/pages/PageShell";

export const metadata: Metadata = { title: "Contact" };

/* The player's page: one audience, one number, no form. The brand half lives
   on /collaborate. */
export default function Contact() {
  return (
    <PageShell>
      <Masthead eyebrow="Say hello" lines={["Get in", "touch"]}>
        After a spot next season, or just want to know when we play? Send a message. Brands and venues:{" "}
        <a href="/collaborate" className="underline underline-offset-4 hover:no-underline">
          collaborate with us
        </a>{" "}
        instead - that page has the numbers.
      </Masthead>
      <ContactRoutes only="player" heading="Message us" />
    </PageShell>
  );
}
