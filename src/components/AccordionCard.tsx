"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, type LucideIcon } from "lucide-react";

interface AccordionCardProps {
  icon: LucideIcon;
  title: string;
  teaser: string;
  points: string[];
  /** Path under /public, e.g. "/images/privacy/data-security.jpg". Add the actual file yourself — this is just a slot. */
  image?: { src: string; alt: string };
  imagePosition?: "left" | "right";
  /** Tailwind gradient stops, e.g. "from-indigo-500 to-blue-600" */
  accent: string;
  delay?: number;
  defaultOpen?: boolean;
}

export default function AccordionCard({
  icon: Icon,
  title,
  teaser,
  points,
  image,
  imagePosition = "right",
  accent,
  delay = 0,
  defaultOpen = false,
}: AccordionCardProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div
      data-aos="fade-up"
      data-aos-delay={delay}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-shadow duration-500 overflow-hidden"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-4 px-5 sm:px-6 py-5 text-left"
      >
        <span
          className={`w-11 h-11 shrink-0 rounded-xl bg-gradient-to-br ${accent} flex items-center justify-center text-white shadow-md`}
        >
          <Icon className="w-5 h-5" strokeWidth={2} />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block font-semibold text-gray-800 text-[15px] sm:text-base">
            {title}
          </span>
          <span className="block text-sm text-gray-500 mt-0.5 truncate">{teaser}</span>
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-500 ${
            open ? "rotate-180 text-gray-600" : ""
          }`}
        />
      </button>

      {/* Smooth height animation via grid-template-rows, no JS height math needed */}
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div
            className={`px-5 sm:px-6 pb-6 pt-1 grid gap-6 items-center ${
              image ? "md:grid-cols-2" : ""
            }`}
          >
            <div className={image && imagePosition === "left" ? "md:order-2" : ""}>
              <ul className="space-y-3">
                {points.map((p, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2 shrink-0" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            {image && (
              <div className={imagePosition === "left" ? "md:order-1" : ""}>
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-100">
                  {/* Dhruv: apni image is path pe public/ folder mein daal do */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}