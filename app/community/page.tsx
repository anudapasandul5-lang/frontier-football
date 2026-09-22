import type { Metadata } from "next";
import { Masthead, PageShell } from "@/components/pages/PageShell";

export const metadata: Metadata = { title: "Community", robots: { index: false } };

/* L0 PROTOTYPE stub so the full-screen menu has somewhere to land. Ticket L7
   builds the real page. */
export default function CommunityStub() {
  return (
    <PageShell>
      <Masthead eyebrow="Coming soon" lines={["Community", "is on its way."]}>
        This page is being built. The rest of the site is open.
      </Masthead>
    </PageShell>
  );
}
