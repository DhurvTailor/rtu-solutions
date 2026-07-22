    "use client";

import Hero from "../../src/components/Hero";
import Youtubevideo from "../../src/components/Youtubevideo";
import Notes from "../../src/components/Notes";
import CgpaCalculator from "../../src/components/CgpaCalculator";
import Testimonials from "../../src/components/Testimonials";
import StatsCounter from "../../src/components/StatsCounter";
import Trust from "../../src/components/TrustedBy";
import GoogleReviewSection from "../../src/components/GoogleReviewSection";
import Pageslider from "../../src/components/Pageslider";
export default function Home() {
  return (
    <main>
      <Hero />
<Trust />
          <Notes />

      <Youtubevideo />      
        <Testimonials />
      <GoogleReviewSection />
      <CgpaCalculator />
<Pageslider />
       <StatsCounter />
    </main>
  );
  }