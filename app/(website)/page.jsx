    "use client";

import Hero from "../../src/components/Hero";
import Youtubevideo from "../../src/components/Youtubevideo";
import Notes from "../../src/components/Notes";
import CgpaCalculator from "../../src/components/CgpaCalculator";
export default function Home() {
  return (
    <main>
      <Hero />

      <Youtubevideo />      

      <Notes />

      <CgpaCalculator />
    </main>
  );
  }