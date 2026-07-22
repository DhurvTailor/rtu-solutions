



"use client";

import { useEffect, useState, useRef } from "react";
import { FaYoutube, FaEye, FaVideo, FaUserGraduate } from "react-icons/fa";

// ── Static counters — yahan apne actual numbers daal do ──────────────────
const STATS = [
  {
    id: "subscribers",
    icon: <FaYoutube size={30} />,
    value: 5000, // 5k
    suffix: "k",
    divide: 1000, // 5000 / 1000 = 5 -> "5k"
    label: "YouTube Subscribers",
  },
  {
    id: "views",
    icon: <FaEye size={30} />,
    value: 60,
    suffix: "%",
    divide: 1,
    label: "Growth in Views",
  },
  {
    id: "videos",
    icon: <FaVideo size={30} />,
    value: 100,
    suffix: "+",
    divide: 1,
    label: "Videos Published",
  },
  {
    id: "students",
    icon: <FaUserGraduate size={30} />,
    value: 1230,
    suffix: "+",
    divide: 1,
    label: "Students Helped",
  },
];

// ── Number count-up hook (smooth ease-out) ───────────────────────────────
function useCountUp(target, duration = 1600, started = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    const start = Date.now();
    const end = start + duration;
    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.floor(eased * target));
      if (now >= end) {
        setCount(target);
        clearInterval(timer);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, started]);

  return count;
}

// ── Single counter box ────────────────────────────────────────────────────
function CounterBox({ icon, value, suffix, divide, label, delay, started }) {
  const displayTarget = divide ? Math.round(value / divide) : value;
  const animated = useCountUp(displayTarget, 1600, started);

  return (
    <div
      className={`counter-box   p-6 sm:p-8 flex flex-col items-start gap-2 ${
        started ? "counter-box-in" : "counter-box-hidden"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <span className="text-[#E8700A] mb-1" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}>
        {icon}
      </span>

      <p
        className={`counter-number text-4xl sm:text-5xl font-black text-white tabular-nums ${
          started ? "counter-number-pop" : ""
        }`}
        style={{ animationDelay: `${delay}ms` }}
      >
        {animated}
        {suffix}
      </p>

      <p className="text-sm font-medium text-gray-200">{label}</p>

      <style jsx>{`
        .counter-box-hidden {
          opacity: 0;
          transform: translateY(16px) scale(0.92);
        }
        .counter-box-in {
          opacity: 1;
          transform: translateY(0) scale(1);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .counter-number-pop {
          animation: counterZoomPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        @keyframes counterZoomPop {
          0% {
            opacity: 0;
            transform: scale(0.4);
          }
          60% {
            opacity: 1;
            transform: scale(1.2);
          }
          80% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

// ── Main section ───────────────────────────────────────────────────────────
export default function ImpactCounterSection() {
  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 sm:py-28 bg-cover  bg-center"
      style={{
        // TODO: apni background image yahan lagao
         backgroundImage: "url('/counterbg.webp')",
        backgroundColor: "#1a1a1a",
      }}
    >
      {/* Dark overlay taaki text readable rahe */}
      <div className="absolute inset-0 bg-black/55" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left — heading */}
        <div className="max-w-xl">
      

        <h2 className="mt-6 text-4xl lg:text-5xl font-bold leading-tight text-white">
          Prepare Exam with{" "}
          <span className="text-[#E8700A]">
            RTU Solutions
          </span>
        </h2>

        <p className="mt-6 text-lg text-gray-300 leading-relaxed">
          Access premium notes, previous year papers, important questions,
          and video lectures—all in one place to boost your RTU exam preparation.
        </p>

        <div className="flex flex-wrap gap-4 mt-8">
          <div className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <p className="text-white font-semibold">
               Premium Notes
            </p>
          </div>

          <div className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/10">
            <p className="text-white font-semibold">
             Video Lectures
            </p>
          </div>

         
        </div>
      </div>

        {/* Right — 2x2 counter grid */}
        <div className="grid grid-cols-2 ">
          {STATS.map((stat, i) => (
            <CounterBox key={stat.id} {...stat} delay={i * 100} started={started} />
          ))}
        </div>
      </div>
    </section>
  );
}