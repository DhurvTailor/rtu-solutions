"use client";

import { useEffect, useState, useRef } from "react";
import {
  FaYoutube,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaUsers,
  FaEye,
  FaVideo,
} from "react-icons/fa";
import { SOCIAL_STATS } from "../data/socialStats";

// ── Number animation hook ──────────────────────────────────────────────────
function useCountUp(target, duration = 1500, started = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started || typeof target !== "number") return;
    const start = Date.now();
    const end = start + duration;
    const timer = setInterval(() => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
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

// ── Single stat card ──────────────────────────────────────────────────────
function StatCard({ icon, label, value, rawValue, color, url, delay = 0, started }) {
  const animated = useCountUp(rawValue, 1500, started);

  const displayValue =
    rawValue != null
      ? rawValue >= 1_000_000
        ? (animated / 1_000_000).toFixed(1) + "M+"
        : rawValue >= 1_000
        ? (animated / 1_000).toFixed(1) + "K+"
        : animated + "+"
      : value;

  const Card = (
    <div
      className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1 text-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon circle */}
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: color + "15" }}
      >
        <span style={{ color }}>{icon}</span>
      </div>

      {/* Count */}
      <p className="text-3xl font-black text-[#071A3D] mb-1 tabular-nums">
        {displayValue}
      </p>

      {/* Label */}
      <p className="text-sm font-medium text-gray-500">{label}</p>
    </div>
  );

  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {Card}
      </a>
    );
  }
  return Card;
}

// ── Main component ────────────────────────────────────────────────────────
export default function StatsCounter() {
  const [ytStats, setYtStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const sectionRef = useRef(null);

  // YouTube stats fetch karo
  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setYtStats(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Intersection Observer — jab section screen mein aaye tabhi animation start karo
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

  const stats = [
    // YouTube — dynamic
    {
      id: "yt-subs",
      icon: <FaYoutube size={26} />,
      label: "YouTube Subscribers",
      value: ytStats?.subscribers?.formatted ?? "...",
      rawValue: ytStats?.subscribers?.raw ?? null,
      color: "#FF0000",
      url: `https://youtube.com/channel/UCxZxyvd-Gy9NRvsTRuncSvA`,
    },
    {
      id: "yt-views",
      icon: <FaEye size={26} />,
      label: "Total Views",
      value: ytStats?.views?.formatted ?? "...",
      rawValue: ytStats?.views?.raw ?? null,
      color: "#FF0000",
      url: null,
    },
    {
      id: "yt-videos",
      icon: <FaVideo size={24} />,
      label: "Videos Published",
      value: ytStats?.videos?.formatted ?? "...",
      rawValue: ytStats?.videos?.raw ?? null,
      color: "#FF0000",
      url: null,
    },
    // Instagram — static
    {
      id: "instagram",
      icon: <FaInstagram size={26} />,
      label: SOCIAL_STATS.instagram.label,
      value: SOCIAL_STATS.instagram.value,
      rawValue: null,
      color: SOCIAL_STATS.instagram.color,
      url: SOCIAL_STATS.instagram.url,
    },
    // LinkedIn — static
    {
      id: "linkedin",
      icon: <FaLinkedin size={26} />,
      label: SOCIAL_STATS.linkedin.label,
      value: SOCIAL_STATS.linkedin.value,
      rawValue: null,
      color: SOCIAL_STATS.linkedin.color,
      url: SOCIAL_STATS.linkedin.url,
    },
    // WhatsApp — static
    {
      id: "whatsapp",
      icon: <FaWhatsapp size={26} />,
      label: SOCIAL_STATS.whatsapp.label,
      value: SOCIAL_STATS.whatsapp.value,
      rawValue: null,
      color: SOCIAL_STATS.whatsapp.color,
      url: SOCIAL_STATS.whatsapp.url,
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8700A]">
            Hamare Saath Hain
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#071A3D] mt-2">
            RTU Solutions Community
          </h2>
          <p className="text-gray-500 mt-3 text-sm">
            Rajasthan ke students ka sabse bada study network
          </p>
        </div>

        {/* Stats grid */}
        {loading ? (
          // Skeleton loader
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-2xl p-6 h-32 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, i) => (
              <StatCard
                key={stat.id}
                {...stat}
                delay={i * 80}
                started={started}
              />
            ))}
          </div>
        )}

        {/* Bottom note */}
        <p className="text-center text-xs text-gray-400 mt-6">
          YouTube data real-time hai · Baaki counts approximate hain
        </p>
      </div>
    </section>
  );
}