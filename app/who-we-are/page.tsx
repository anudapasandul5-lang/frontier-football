import type { Metadata } from "next";
import { Masthead, PageShell } from "@/components/pages/PageShell";

export const metadata: Metadata = { title: "Who We Are", robots: { index: false } };

/* L0 PROTOTYPE stub so the full-screen menu has somewhere to land. Ticket L1
   builds the real page. */
export default function WhoWeAreStub() {
  return (
    <PageShell>
      <Masthead eyebrow="Coming soon" lines={["Who We Are", "is on its way."]}>
        This page is being built. The rest of the site is open.
      </Masthead>
    </PageShell>
  );
}
