import { Competitions } from "@/components/acts/Competitions";
import { Hero } from "@/components/acts/Hero";
import { Moment } from "@/components/acts/Moment";
import { Numbers } from "@/components/acts/Numbers";
import { Strip } from "@/components/acts/Strip";
import { SmoothScroll } from "@/components/motion/SmoothScroll";

// Acts 1-5 (T3, T4). Acts 6-9 land in T5.
export default function Home() {
  return (
    <>
      <SmoothScroll />
      <main>
        <Hero />
        <Strip />
        <Moment />
        <Numbers />
        <Competitions />
      </main>
    </>
  );
}
