// "use client";

// import { useEffect, useState, useRef } from "react";
// import {
//   FaYoutube,
//   FaInstagram,
//   FaLinkedin,
//   FaWhatsapp,
//   FaUsers,
//   FaEye,
//   FaVideo,
// } from "react-icons/fa";
// import { SOCIAL_STATS } from "../data/socialStats";

// // ── Number animation hook ──────────────────────────────────────────────────
// function useCountUp(target, duration = 1500, started = false) {
//   const [count, setCount] = useState(0);

//   useEffect(() => {
//     if (!started || typeof target !== "number") return;
//     const start = Date.now();
//     const end = start + duration;
//     const timer = setInterval(() => {
//       const now = Date.now();
//       const progress = Math.min((now - start) / duration, 1);
//       // Ease out cubic
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setCount(Math.floor(eased * target));
//       if (now >= end) {
//         setCount(target);
//         clearInterval(timer);
//       }
//     }, 16);
//     return () => clearInterval(timer);
//   }, [target, started]);

//   return count;
// }

// // ── Single stat card ──────────────────────────────────────────────────────
// function StatCard({ icon, label, value, rawValue, color, url, delay = 0, started }) {
//   const animated = useCountUp(rawValue, 1500, started);

//   const displayValue =
//     rawValue != null
//       ? rawValue >= 1_000_000
//         ? (animated / 1_000_000).toFixed(1) + "M+"
//         : rawValue >= 1_000
//         ? (animated / 1_000).toFixed(1) + "K+"
//         : animated + "+"
//       : value;

//   const Card = (
//     <div
//       className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center"
//       style={{ animationDelay: `${delay}ms` }}
//     >
//       {/* Icon circle */}
//       <div
//         className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
//         style={{ backgroundColor: color + "15" }}
//       >
//         <span style={{ color }}>{icon}</span>
//       </div>

//       {/* Count */}
//       <p className="text-3xl font-black text-[#071A3D] mb-1 tabular-nums">
//         {displayValue}
//       </p>

//       {/* Label */}
//       <p className="text-sm font-medium text-gray-500">{label}</p>
//     </div>
//   );

//   if (url) {
//     return (
//       <a href={url} target="_blank" rel="noopener noreferrer">
//         {Card}
//       </a>
//     );
//   }
//   return Card;
// }

// // ── Main component ────────────────────────────────────────────────────────
// export default function StatsCounter() {
//   const [ytStats, setYtStats] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [started, setStarted] = useState(false);
//   const sectionRef = useRef(null);

//   // YouTube stats fetch karo
//   useEffect(() => {
//     fetch("/api/stats")
//       .then((r) => r.json())
//       .then((d) => {
//         if (d.success) setYtStats(d);
//       })
//       .catch(() => {})
//       .finally(() => setLoading(false));
//   }, []);

//   // Intersection Observer — jab section screen mein aaye tabhi animation start karo
//   useEffect(() => {
//     const el = sectionRef.current;
//     if (!el) return;
//     const obs = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setStarted(true);
//           obs.disconnect();
//         }
//       },
//       { threshold: 0.2 }
//     );
//     obs.observe(el);
//     return () => obs.disconnect();
//   }, []);

//   const stats = [
//     // YouTube — dynamic
//     {
//       id: "yt-subs",
//       icon: <FaYoutube size={26} />,
//       label: "YouTube Subscribers",
//       value: ytStats?.subscribers?.formatted ?? "...",
//       rawValue: ytStats?.subscribers?.raw ?? null,
//       color: "#FF0000",
//       url: `https://youtube.com/channel/UCxZxyvd-Gy9NRvsTRuncSvA`,
//     },
//     {
//       id: "yt-views",
//       icon: <FaEye size={26} />,
//       label: "Total Views",
//       value: ytStats?.views?.formatted ?? "...",
//       rawValue: ytStats?.views?.raw ?? null,
//       color: "#FF0000",
//       url: null,
//     },
//     {
//       id: "yt-videos",
//       icon: <FaVideo size={24} />,
//       label: "Videos Published",
//       value: ytStats?.videos?.formatted ?? "...",
//       rawValue: ytStats?.videos?.raw ?? null,
//       color: "#FF0000",
//       url: null,
//     },
//     // Instagram — static
//     {
//       id: "instagram",
//       icon: <FaInstagram size={26} />,
//       label: SOCIAL_STATS.instagram.label,
//       value: SOCIAL_STATS.instagram.value,
//       rawValue: null,
//       color: SOCIAL_STATS.instagram.color,
//       url: SOCIAL_STATS.instagram.url,
//     },
//     // LinkedIn — static
//     {
//       id: "linkedin",
//       icon: <FaLinkedin size={26} />,
//       label: SOCIAL_STATS.linkedin.label,
//       value: SOCIAL_STATS.linkedin.value,
//       rawValue: null,
//       color: SOCIAL_STATS.linkedin.color,
//       url: SOCIAL_STATS.linkedin.url,
//     },
//     // WhatsApp — static
//     {
//       id: "whatsapp",
//       icon: <FaWhatsapp size={26} />,
//       label: SOCIAL_STATS.whatsapp.label,
//       value: SOCIAL_STATS.whatsapp.value,
//       rawValue: null,
//       color: SOCIAL_STATS.whatsapp.color,
//       url: SOCIAL_STATS.whatsapp.url,
//     },
//   ];

//   return (
//     <section ref={sectionRef} className="py-16 bg-white">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6">
//         {/* Heading */}
//         <div className="text-center mb-10">
//           <span className="text-xs font-bold uppercase tracking-widest text-[#E8700A]">
//             Hamare Saath Hain
//           </span>
//           <h2 className="text-3xl sm:text-4xl font-bold text-[#071A3D] mt-2">
//             RTU Solutions Community
//           </h2>
//           <p className="text-gray-500 mt-3 text-sm">
//             Rajasthan ke students ka sabse bada study network
//           </p>
//         </div>

//         {/* Stats grid */}
//         {loading ? (
//           // Skeleton loader
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
//             {[...Array(6)].map((_, i) => (
//               <div
//                 key={i}
//                 className="bg-gray-100 rounded-2xl p-6 h-32 animate-pulse"
//               />
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
//             {stats.map((stat, i) => (
//               <StatCard
//                 key={stat.id}
//                 {...stat}
//                 delay={i * 80}
//                 started={started}
//               />
//             ))}
//           </div>
//         )}

//         {/* Bottom note */}
//         <p className="text-center text-xs text-gray-400 mt-6">
//           YouTube data real-time hai · Baaki counts approximate hain
//         </p>
//       </div>
//     </section>
//   );
// }




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