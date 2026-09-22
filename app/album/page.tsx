import type { Metadata } from "next";
import { Suspense } from "react";
import { AlbumHead, AlbumView } from "@/components/motion/AlbumView";
import { PageShell } from "@/components/pages/PageShell";

export const metadata: Metadata = { title: "Album" };

/* /album?album=<id>. The id lives in the query string, so a static export can
   only know it in the browser: AlbumView reads it under Suspense. The fallback
   is what JS-off readers get, a labelled page with the way back. */
export default function Album() {
  return (
    <PageShell>
      <section className="pt-8 pb-12 sm:pt-12 sm:pb-20">
        <Suspense fallback={<AlbumHead title="Album" count={0} />}>
          <AlbumView />
        </Suspense>
      </section>
    </PageShell>
  );
}
