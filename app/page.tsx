import raw from "@/content.js";
import { parseContent, upcomingEvents } from "@/lib/content-data";
import { Champions } from "@/components/acts/Champions";
import { Closing } from "@/components/acts/Closing";
import { CommunityTeaser } from "@/components/acts/CommunityTeaser";
import { Competitions } from "@/components/acts/Competitions";
import { Events } from "@/components/acts/Events";
import { Hero } from "@/components/acts/Hero";
import { Moment } from "@/components/acts/Moment";
import { Numbers } from "@/components/acts/Numbers";
import { Partners } from "@/components/acts/Partners";
import { Strip } from "@/components/acts/Strip";
import { WhoWeAre } from "@/components/acts/WhoWeAre";
import { Intro } from "@/components/motion/Intro";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { Footer } from "@/components/primitives/Footer";

// The nine acts (plan section 5), plus Who We Are under the hero (T2, 2026-09-22). Events renders nothing while content.js has none.
export default function Home() {
  return (
    <>
      <Intro />
      <SmoothScroll />
      <main>
        <Hero />
        <WhoWeAre />
        <Strip />
        <Moment />
        <Numbers />
        <Competitions />
        <Champions />
        <Events events={upcomingEvents(parseContent(raw))} />
        <CommunityTeaser />
        <Partners />
        <Closing />
      </main>
      <Footer />
    </>
  );
}
