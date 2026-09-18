import { Hero } from "@/components/acts/Hero";
import { Moment } from "@/components/acts/Moment";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

// Acts 1 and 3 (T3). Acts 2 and 4-9 land in T4 and T5.
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <main>
        <Hero />
        <Moment />
      </main>
    </>
  );
}
