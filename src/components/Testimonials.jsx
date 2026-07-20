// "use client";

// import { useEffect, useState, useRef } from "react";
// import Image from "next/image";
// import { FaStar, FaYoutube, FaChevronLeft, FaChevronRight } from "react-icons/fa";

// export default function Testimonials() {
//   const [comments, setComments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [syncing, setSyncing] = useState(false);
//   const [syncMsg, setSyncMsg] = useState("");
//   const [current, setCurrent] = useState(0);
//   const intervalRef = useRef(null);

//   useEffect(() => {
//     fetch("/api/testimonials")
//       .then((res) => res.json())
//       .then((data) => setComments(Array.isArray(data) ? data : []))
//       .catch(() => setComments([]))
//       .finally(() => setLoading(false));
//   }, []);

//   // Auto-slide har 4 seconds
//   useEffect(() => {
//     if (comments.length === 0) return;
//     intervalRef.current = setInterval(() => {
//       setCurrent((prev) => (prev + 1) % comments.length);
//     }, 4000);
//     return () => clearInterval(intervalRef.current);
//   }, [comments]);

//   const prev = () => {
//     clearInterval(intervalRef.current);
//     setCurrent((c) => (c - 1 + comments.length) % comments.length);
//   };

//   const next = () => {
//     clearInterval(intervalRef.current);
//     setCurrent((c) => (c + 1) % comments.length);
//   };

//   // Cards per view — desktop 3, tablet 2, mobile 1
//   const getVisible = () => {
//     const total = comments.length;
//     if (total === 0) return [];
//     const indices = [];
//     for (let i = 0; i < Math.min(4, total); i++) {
//       indices.push((current + i) % total);
//     }
//     return indices;
//   };

//   if (loading) return null;
//   if (comments.length === 0) return null;

//   const visible = getVisible();

//   return (
//     <section className="py-16 bg-gray-50">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6">
//         {/* Heading */}
//         <div className="text-center mb-10">
//           <span className="text-xs font-bold uppercase tracking-widest text-[#E8700A]">
//             Real Students, Real Feedback
//           </span>
//           <h2 className="text-3xl sm:text-4xl font-bold text-[#071A3D] mt-2">
//            Students Youtube comments
//           </h2>
//           <div className="flex items-center justify-center gap-2 mt-3">
//             <FaYoutube className="text-red-500" size={18} />
//             <p className="text-gray-500 text-sm">
//            Rtu-solutions
//             </p>
//           </div>
//         </div>

//         {/* Carousel */}
//         <div className="relative">
//           {/* Cards */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//             {visible.map((idx, i) => {
//               const c = comments[idx];
//               return (
//                 <div
//                   key={c.id}
//                   className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 ${
//                     i === 0 ? "ring-2 ring-[#E8700A]/20" : ""
//                   }`}
//                 >
//                   {/* Stars */}
//                   <div className="flex gap-1 mb-4">
//                     {[1, 2, 3, 4, 5].map((s) => (
//                       <FaStar key={s} className="text-yellow-400" size={14} />
//                     ))}
//                   </div>

//                   {/* Comment text */}
//                   <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">
//                     "{c.comment_text}"
//                   </p>

//                   {/* Author */}
//                   <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
//                     {c.author_img ? (
//                       <img
//                         src={c.author_img}
//                         alt={c.author_name}
//                         width={40}
//                         height={40}
//                         className="rounded-full object-cover w-10 h-10"
//                         onError={(e) => {
//                           e.target.style.display = "none";
//                         }}
//                       />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-[#071A3D] flex items-center justify-center text-white font-bold text-sm">
//                         {c.author_name?.charAt(0)?.toUpperCase() || "S"}
//                       </div>
//                     )}
//                     <div className="min-w-0">
//                       <p className="font-semibold text-[#071A3D] text-sm truncate">
//                         {c.author_name}
//                       </p>
//                       <p className="text-xs text-gray-400">
//                         RTU Student
//                         {c.likes > 0 && (
//                           <span className="ml-2">👍 {c.likes}</span>
//                         )}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Prev / Next buttons */}
//           {comments.length > 3 && (
//             <>
//               <button
//                 onClick={prev}
//                 className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
//               >
//                 <FaChevronLeft size={13} className="text-[#071A3D]" />
//               </button>
//               <button
//                 onClick={next}
//                 className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
//               >
//                 <FaChevronRight size={13} className="text-[#071A3D]" />
//               </button>
//             </>
//           )}
//         </div>

//         {/* Dots */}
//         <div className="flex justify-center gap-2 mt-8">
//           {comments.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => { clearInterval(intervalRef.current); setCurrent(i); }}
//               className={`w-2 h-2 rounded-full transition-all ${
//                 i === current ? "bg-[#E8700A] w-6" : "bg-gray-300"
//               }`}
//             />
//           ))}
//         </div>

//         {/* Sync button — admin only (production mein ye button hide karna) */}
//         <div className="text-center mt-8">
//           <button
//             onClick={async () => {
//               setSyncing(true);
//               setSyncMsg("");
//               try {
//                 const res = await fetch("/api/testimonials", { method: "POST" });
//                 const data = await res.json();
//                 setSyncMsg(data.message || "Done");
//                 // Refresh comments
//                 const r2 = await fetch("/api/testimonials");
//                 const updated = await r2.json();
//                 setComments(Array.isArray(updated) ? updated : []);
//                 setCurrent(0);
//               } catch {
//                 setSyncMsg("Sync fail ho gaya");
//               } finally {
//                 setSyncing(false);
//               }
//             }}
//             disabled={syncing}
//             className="text-xs text-gray-400 hover:text-gray-600 underline transition"
//           >
//             {syncing ? "Syncing YouTube comments..." : "Sync comments"}
//           </button>
//           {syncMsg && (
//             <p className="text-xs text-green-600 mt-1">{syncMsg}</p>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }





"use client";

import { useEffect, useState, useRef } from "react";
import { FaQuoteLeft, FaYoutube, FaChevronLeft, FaChevronRight } from "react-icons/fa";

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

  // Cards per view — desktop 3, tablet 2, mobile 1 (design ke hisaab se 3 max)
  const getVisible = () => {
    const total = comments.length;
    if (total === 0) return [];
    const indices = [];
    for (let i = 0; i < Math.min(3, total); i++) {
      indices.push((current + i) % total);
    }
    return indices;
  };

  if (loading) return null;
  if (comments.length === 0) return null;

  const visible = getVisible();
  const totalPages = comments.length;

  return (
    <section
      className="relative py-20 sm:py-24 bg-cover bg-center overflow-hidden"
      style={{
        // TODO: chaho to yahan apni background image lagao
        // backgroundImage: "url('/images/testimonials-bg.jpg')",
        backgroundColor: "#0B2D6B",
      }}
    >
      {/* Dark blue overlay taaki background image ke upar bhi text/cards clear rahein */}
      <div className="absolute inset-0 bg-[#0B2D6B]/85" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 lg:gap-14 items-center">
          {/* ── Left panel ─────────────────────────────────────────── */}
          <div className="text-center lg:text-left">
            <FaQuoteLeft className="text-white/25 mx-auto lg:mx-0 mb-4" size={56} />

            <span className="text-xs font-bold uppercase tracking-widest text-[#E8700A]">
              Real Students, Real Feedback
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2 leading-snug">
              Students YouTube Comments
            </h2>

            <div className="flex items-center justify-center lg:justify-start gap-2 mt-3">
              <FaYoutube className="text-red-500" size={18} />
              <p className="text-gray-300 text-sm">RTU Solutions</p>
            </div>

            <p className="text-gray-300 text-sm leading-relaxed mt-4">
              Hamare YouTube channel par students ke real comments — unki
              apni words mein, unka apna experience.
            </p>

            <a
              href="https://youtube.com/channel/UCxZxyvd-Gy9NRvsTRuncSvA"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 bg-[#E8700A] hover:bg-[#d9660a] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition"
            >
              Channel dekho
            </a>
          </div>

          {/* ── Right — cards carousel ─────────────────────────────── */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">
              {visible.map((idx, i) => {
                const c = comments[idx];
                return (
                  <div
                    key={c.id}
                    className={`relative bg-white rounded-2xl p-6 pt-10 shadow-lg transition-all duration-300 ${
                      i === 0 ? "ring-2 ring-[#E8700A]/30" : ""
                    }`}
                  >
                    {/* Avatar overlapping top of card */}
                    <div className="absolute -top-7 left-6">
                      {c.author_img ? (
                        <img
                          src={c.author_img}
                          alt={c.author_name}
                          width={56}
                          height={56}
                          className="rounded-full object-cover w-14 h-14 border-4 border-white shadow-md"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#071A3D] border-4 border-white shadow-md flex items-center justify-center text-white font-bold">
                          {c.author_name?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                      )}
                      {/* Quote badge overlapping avatar corner */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-[#0B2D6B] flex items-center justify-center shadow">
                        <FaQuoteLeft className="text-white" size={9} />
                      </div>
                    </div>

                    {/* Comment text */}
                    <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-4">
                      "{c.comment_text}"
                    </p>

                    {/* Author */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="font-semibold text-[#071A3D] text-sm truncate">
                        {c.author_name}
                      </p>
                      <p className="text-xs text-gray-400">
                        RTU Student
                        {c.likes > 0 && <span className="ml-2">👍 {c.likes}</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Nav — arrows + page counter (left) + dots (right), design jaisa */}
            {comments.length > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="flex items-center gap-3">
                  <button
                    onClick={prev}
                    aria-label="Previous"
                    className="w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition"
                  >
                    <FaChevronLeft size={12} className="text-white" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Next"
                    className="w-9 h-9 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center transition"
                  >
                    <FaChevronRight size={12} className="text-white" />
                  </button>
                  <span className="text-white/70 text-xs ml-1 tabular-nums">
                    {current + 1} / {totalPages}
                  </span>
                </div>

                {/* Dots */}
                <div className="flex gap-2">
                  {comments.map((_, i) => (
                    <button
                      key={i}
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => {
                        clearInterval(intervalRef.current);
                        setCurrent(i);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        i === current ? "bg-[#E8700A] w-6" : "bg-white/30 w-2"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sync button — admin only (production mein ye button hide karna) */}
        <div className="text-center mt-10">
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
            className="text-xs text-white/40 hover:text-white/70 underline transition"
          >
            {syncing ? "Syncing YouTube comments..." : "Sync comments"}
          </button>
          {syncMsg && <p className="text-xs text-green-400 mt-1">{syncMsg}</p>}
        </div>
      </div>
    </section>
  );
}