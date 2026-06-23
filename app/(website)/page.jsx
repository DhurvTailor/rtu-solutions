    "use client";

import Hero from "../../src/components/Hero";
import Youtubevideo from "../../src/components/Youtubevideo";
import Notes from "../../src/components/Notes";
import CgpaCalculator from "../../src/components/CgpaCalculator";
import Testimonials from "../../src/components/Testimonials";
export default function Home() {
  return (
    <main>
      <Hero />

      <Youtubevideo />      
        <Testimonials />
      <Notes />
    
      <CgpaCalculator />
    </main>
  );
  }