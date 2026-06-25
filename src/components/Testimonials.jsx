"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { FaStar, FaYoutube, FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Testimonials() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((data) => setComments(Array.isArray(data) ? data : []))
      .catch(() => setComments([]))
      .finally(() => setLoading(false));
  }, []);

  // Auto-slide har 4 seconds
  useEffect(() => {
    if (comments.length === 0) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % comments.length);
    }, 4000);
    return () => clearInterval(intervalRef.current);
  }, [comments]);

  const prev = () => {
    clearInterval(intervalRef.current);
    setCurrent((c) => (c - 1 + comments.length) % comments.length);
  };

  const next = () => {
    clearInterval(intervalRef.current);
    setCurrent((c) => (c + 1) % comments.length);
  };

  // Cards per view — desktop 3, tablet 2, mobile 1
  const getVisible = () => {
    const total = comments.length;
    if (total === 0) return [];
    const indices = [];
    for (let i = 0; i < Math.min(4, total); i++) {
      indices.push((current + i) % total);
    }
    return indices;
  };

  if (loading) return null;
  if (comments.length === 0) return null;

  const visible = getVisible();

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8700A]">
            Real Students, Real Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#071A3D] mt-2">
           Students Youtube comments
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <FaYoutube className="text-red-500" size={18} />
            <p className="text-gray-500 text-sm">
           Rtu-solutions
            </p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {visible.map((idx, i) => {
              const c = comments[idx];
              return (
                <div
                  key={c.id}
                  className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 ${
                    i === 0 ? "ring-2 ring-[#E8700A]/20" : ""
                  }`}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FaStar key={s} className="text-yellow-400" size={14} />
                    ))}
                  </div>

                  {/* Comment text */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">
                    "{c.comment_text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    {c.author_img ? (
                      <img
                        src={c.author_img}
                        alt={c.author_name}
                        width={40}
                        height={40}
                        className="rounded-full object-cover w-10 h-10"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#071A3D] flex items-center justify-center text-white font-bold text-sm">
                        {c.author_name?.charAt(0)?.toUpperCase() || "S"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-[#071A3D] text-sm truncate">
                        {c.author_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        RTU Student
                        {c.likes > 0 && (
                          <span className="ml-2">👍 {c.likes}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Prev / Next buttons */}
          {comments.length > 3 && (
            <>
              <button
                onClick={prev}
                className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
              >
                <FaChevronLeft size={13} className="text-[#071A3D]" />
              </button>
              <button
                onClick={next}
                className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
              >
                <FaChevronRight size={13} className="text-[#071A3D]" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {comments.map((_, i) => (
            <button
              key={i}
              onClick={() => { clearInterval(intervalRef.current); setCurrent(i); }}
              className={`w-2 h-2 rounded-full transition-all ${
                i === current ? "bg-[#E8700A] w-6" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Sync button — admin only (production mein ye button hide karna) */}
        <div className="text-center mt-8">
          <button
            onClick={async () => {
              setSyncing(true);
              setSyncMsg("");
              try {
                const res = await fetch("/api/testimonials", { method: "POST" });
                const data = await res.json();
                setSyncMsg(data.message || "Done");
                // Refresh comments
                const r2 = await fetch("/api/testimonials");
                const updated = await r2.json();
                setComments(Array.isArray(updated) ? updated : []);
                setCurrent(0);
              } catch {
                setSyncMsg("Sync fail ho gaya");
              } finally {
                setSyncing(false);
              }
            }}
            disabled={syncing}
            className="text-xs text-gray-400 hover:text-gray-600 underline transition"
          >
            {syncing ? "Syncing YouTube comments..." : "Sync comments"}
          </button>
          {syncMsg && (
            <p className="text-xs text-green-600 mt-1">{syncMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
}