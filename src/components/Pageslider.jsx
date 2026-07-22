"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ImageOff } from "lucide-react";
const defaultSlides = [
  {
    id: 1,
    image: "/pageimg/PrivacyPolicy.webp",
    tags: [{ text: "Privacy Policy", top: "30%", left: "20%" }],
    buttonText: "Privacy Policy",
    buttonUrl: "/pageimg/PrivacyPolicy.webp",
  },
  {
    id: 2,
    image: "/pageimg/Refund Policy.webp",
    tags: [{ text: "Refund Policy", top: "28%", left: "18%" }],
    buttonText: "Refund Policy",
    buttonUrl: "/pageimg/Refund Policy.webp",
  },
  {
    id: 3,
    image: "/pageimg/Terms & Conditions.webp",
    tags: [{ text: "Terms & Conditions", top: "35%", left: "60%" }],
    buttonText: "Terms & Conditions",
    buttonUrl: "/pageimg/Terms & Conditions.webp"
  },
  {
    id: 4,
    image: "/pageimg/Advertise With Us.webp",
    tags: [{ text: "Advertise With Us", top: "32%", left: "22%" }],
    buttonText: "Advertise With Us",
    buttonUrl: "/pageimg/Advertise With Us.webp",
  },
  {
    id: 5,
    image: "/pageimg/FAQ.webp",
    tags: [{ text: "FAQ", top: "30%", left: "65%" }],
buttonText: "FAQ",
    buttonUrl: "/pageimg/FAQ.webp",
  },
];

function SlideImage({ src, alt }) {
  const [error, setError] = useState(!src);
  useEffect(() => setError(!src), [src]);

  if (error) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <ImageOff className="h-7 w-7 text-orange-300" strokeWidth={1.5} />
        <span className="text-[11px] font-medium text-orange-300">No image</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className="h-full w-full   bg-white select-none"
      draggable={false}
    />
  );
}

export default function Pageslider({
  slides = defaultSlides,
  title = "Student Help Center",
  autoPlay = true,
  autoPlayInterval = 2000,
}) {
  const [current, setCurrent] = useState(0);
  const [viewportWidth, setViewportWidth] = useState(0);
  const timerRef = useRef(null);
  const total = slides.length;

  const mod = (n) => ((n % total) + total) % total;

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    if (!autoPlay) return;
    timerRef.current = setInterval(() => {
      setCurrent((c) => mod(c + 1));
    }, autoPlayInterval);
  }, [autoPlay, autoPlayInterval, total]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  useEffect(() => {
    const updateViewportWidth = () => setViewportWidth(window.innerWidth);

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => window.removeEventListener("resize", updateViewportWidth);
  }, []);

  const goTo = (i) => {
    setCurrent(mod(i));
    startTimer();
  };

  const prev1 = mod(current - 1); // immediate left
  const prev2 = mod(current - 2); // far left
  const next1 = mod(current + 1); // immediate right
  const next2 = mod(current + 2); // far right
  const active = slides[current];

  const isMobile = viewportWidth > 0 && viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;

  const GAP = isMobile ? 96 : isTablet ? 180 : 270;
  const centerWidth = isMobile ? 180 : isTablet ? 240 : 300;
  const centerHeight = isMobile ? 270 : isTablet ? 360 : 400;
  const sideWidth = isMobile ? 120 : isTablet ? 170 : 250;
  const sideHeight = isMobile ? 180 : isTablet ? 260 : 390;
  const farWidth = isMobile ? 92 : isTablet ? 130 : 190;
  const farHeight = isMobile ? 140 : isTablet ? 210 : 320;

  const getStyle = (slideIndex) => {
    // CENTER
    if (slideIndex === current) {
      return {
        left: "50%",
        top: "50%",
        transform: "translateX(-50%) translateY(-50%) scale(1)",
        zIndex: 30,
        opacity: 1,
        width: `${centerWidth}px`,
        height: `${centerHeight}px`,
        filter: "none",
        cursor: "default",
      };
    }
    // IMMEDIATE LEFT
    if (slideIndex === prev1) {
      return {
        left: `calc(50% - ${GAP}px)`,
        top: "50%",
        transform: "translateX(-50%) translateY(-50%) scale(0.84)",
        zIndex: 20,
        opacity: 0.62,
        width: `${sideWidth}px`,
        height: `${sideHeight}px`,
        filter: "brightness(0.82)",
        cursor: "pointer",
      };
    }
    // FAR LEFT
    if (slideIndex === prev2) {
      return {
        left: `calc(50% - ${GAP * 2}px)`,
        top: "50%",
        transform: "translateX(-50%) translateY(-50%) scale(0.68)",
        zIndex: 10,
        opacity: 0.32,
        width: `${farWidth}px`,
        height: `${farHeight}px`,
        filter: "brightness(0.72)",
        cursor: "pointer",
      };
    }
    // IMMEDIATE RIGHT
    if (slideIndex === next1) {
      return {
        left: `calc(50% + ${GAP}px)`,
        top: "50%",
        transform: "translateX(-50%) translateY(-50%) scale(0.84)",
        zIndex: 20,
        opacity: 0.62,
        width: `${sideWidth}px`,
        height: `${sideHeight}px`,
        filter: "brightness(0.82)",
        cursor: "pointer",
      };
    }
    // FAR RIGHT
    if (slideIndex === next2) {
      return {
        left: `calc(50% + ${GAP * 2}px)`,
        top: "50%",
        transform: "translateX(-50%) translateY(-50%) scale(0.68)",
        zIndex: 10,
        opacity: 0.32,
        width: `${farWidth}px`,
        height: `${farHeight}px`,
        filter: "brightness(0.72)",
        cursor: "pointer",
      };
    }
    // HIDDEN — collapse behind center
    return {
      left: "50%",
      top: "50%",
      transform: "translateX(-50%) translateY(-50%) scale(0.5)",
      zIndex: 0,
      opacity: 0,
      width: `${farWidth}px`,
      height: `${farHeight}px`,
      filter: "brightness(0.1)",
      cursor: "default",
      pointerEvents: "none",
    };
  };

  const isClickable = (i) =>
    i === prev1 || i === prev2 || i === next1 || i === next2;

  return (
    <section
      className="relative overflow-hidden bg-white py-6 md:py-8"
      onMouseEnter={() => clearInterval(timerRef.current)}
      onMouseLeave={startTimer}
    >
      {/* Title */}
      <div className="mx-auto max-w-xl px-6 text-center">
        <h2 className="font-serif text-2xl font-semibold leading-tight text-gray-800 md:text-4xl">
          {title}
        </h2>
    
      </div>

      {/* Slider track */}
      <div
        className="relative mx-auto mt-1 select-none md:mt-2"
        style={{ height: isMobile ? "320px" : isTablet ? "400px" : "450px" }}
      >
        {slides.map((slide, i) => {
          const style = getStyle(i);

          return (
            <div
              key={slide.id}
              onClick={isClickable(i) ? () => goTo(i) : undefined}
              style={{
                ...style,
                position: "absolute",
                borderRadius: "1rem",
                overflow: "hidden",
                boxShadow:
                  i === current
                    ? "0 10px 36px rgba(0,0,0,0.13)"
                    : "0 2px 10px rgba(0,0,0,0.07)",
                transition:
                  "left 0.55s cubic-bezier(0.4,0,0.2,1), width 0.55s cubic-bezier(0.4,0,0.2,1), height 0.55s cubic-bezier(0.4,0,0.2,1), opacity 0.5s ease, transform 0.55s cubic-bezier(0.4,0,0.2,1), filter 0.4s ease",
              }}
            >
              <SlideImage src={slide.image} alt={`Slide ${i + 1}`} />
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="mt-2 flex items-center justify-center gap-2 md:mt-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current
                ? "w-6 bg-gray-700"
                : "w-1.5 bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>

      {/* CTA button */}
      <div className="mt-1 flex justify-center px-6 md:mt-2">
        <Link
          key={active?.buttonUrl}
          href={active?.buttonUrl || "#"}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-800 transition hover:border-gray-400 hover:bg-gray-50 md:px-6 md:py-2.5"
        >
          {active?.buttonText || "See more"}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}