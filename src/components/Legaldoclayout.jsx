"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/**
 * LegalDocLayout — a formal "document" layout with a sticky, scroll-spy
 * table of contents on the left and numbered sections on the right.
 * Used by Privacy Policy and Terms so both read as one official family,
 * while Refund / FAQ / Advertise use their own distinct layouts.
 *
 * sections: [{ id, icon, heading, body: string | string[], image?: { src, alt } }]
 */
export default function LegalDocLayout({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  description,
  heroImage,
  gradient,
  accentBg,
  accentText,
  sections,
  cta,
}) {
  const [activeId, setActiveId] = useState(sections[0]?.id);
  const refs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    Object.values(refs.current).forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className={`relative overflow-hidden bg-gradient-to-r ${gradient} text-white`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700 inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
              {EyebrowIcon && <EyebrowIcon className="w-4 h-4" />}
              {eyebrow}
            </div>
            <h1 className="animate-in fade-in slide-in-from-bottom-3 duration-700 delay-100 fill-mode-both text-4xl md:text-5xl font-bold mb-4">
              {title}
            </h1>
            <p className="animate-in fade-in slide-in-from-bottom-3 duration-700 delay-200 fill-mode-both text-white/85 text-lg max-w-lg">
              {description}
            </p>
          </div>
          {heroImage && (
            <div className="hidden md:block animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both relative aspect-square rounded-2xl overflow-hidden bg-white/10 ring-1 ring-white/20">
              {/* Dhruv: isometric-style illustration yaha daal do (public/ folder) */}
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                sizes="480px"
                className="object-contain p-6"
              />
            </div>
          )}
        </div>
      </div>

      {/* TOC + Sections */}
      <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-[220px_1fr] gap-12">
        <aside className="hidden md:block">
          <div className="sticky top-20 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              On this page
            </p>
            {sections.map((s, i) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${
                  activeId === s.id
                    ? `${accentBg} text-white font-medium shadow-sm`
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="text-[11px] opacity-70 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.heading}
              </a>
            ))}
          </div>
        </aside>

        <div>
          {sections.map((s, i) => {
            const Icon = s.icon;
            return (
              <section
                key={s.id}
                id={s.id}
                ref={(el) => (refs.current[s.id] = el)}
                className="scroll-mt-24 pb-12"
              >
                <div className={`grid gap-8 items-start ${s.image ? "md:grid-cols-[1fr_260px]" : ""}`}>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className={`w-10 h-10 rounded-xl ${accentBg} text-white flex items-center justify-center shrink-0`}
                      >
                        <Icon className="w-5 h-5" />
                      </span>
                      <h2 className="text-xl font-bold text-gray-800">{s.heading}</h2>
                    </div>
                    {Array.isArray(s.body) ? (
                      <ul className="space-y-3">
                        {s.body.map((p, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-3 text-gray-600 text-sm leading-relaxed"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${accentBg} mt-2 shrink-0`} />
                            {p}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
                    )}
                  </div>

                  {s.image && (
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-100">
                      {/* Dhruv: image is path pe daal do */}
                      <Image
                        src={s.image.src}
                        alt={s.image.alt}
                        fill
                        sizes="260px"
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
                {i < sections.length - 1 && <div className="mt-12 border-t border-gray-100" />}
              </section>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      {cta && (
        <div className="max-w-6xl mx-auto px-6 pb-20">
          <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-8 text-white text-center`}>
            {cta.icon && <cta.icon className="w-8 h-8 mx-auto mb-3 text-white/80" />}
            <h3 className="text-xl font-bold mb-2">{cta.title}</h3>
            <p className="text-white/85 mb-4 text-sm">{cta.desc}</p>
            <a
              href={cta.href}
              className={`inline-block bg-white ${accentText} font-semibold px-6 py-2.5 rounded-xl hover:opacity-90 transition`}
            >
              {cta.buttonLabel}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}