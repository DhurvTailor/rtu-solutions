    "use client";

import Hero from "../../src/components/Hero";
import Youtubevideo from "../../src/components/Youtubevideo";
import Notes from "../../src/components/Notes";
import CgpaCalculator from "../../src/components/CgpaCalculator";
import Testimonials from "../../src/components/Testimonials";
import StatsCounter from "../../src/components/StatsCounter";
export default function Home() {
  return (
    <main>
      <Hero />

      <Youtubevideo />      
        <Testimonials />
      <Notes />
    <StatsCounter />
      <CgpaCalculator />
       <StatsCounter />
    </main>
  );
  }