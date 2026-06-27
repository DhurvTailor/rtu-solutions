"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaGift,
  FaDownload,
  FaTimes,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";

// ── Simple canvas confetti ─────────────────────────────────────────────────
function Confetti({ active }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#f97316", "#071A3D", "#fbbf24", "#10b981", "#3b82f6", "#ef4444"];

    particles.current = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: -10 - Math.random() * 100,
      w: 6 + Math.random() * 8,
      h: 3 + Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: 2 + Math.random() * 3,
      angle: Math.random() * 360,
      rotation: Math.random() * 6 - 3,
      opacity: 0.8 + Math.random() * 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.angle * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
        p.y += p.speed;
        p.angle += p.rotation;
        p.opacity -= 0.003;
      });
      particles.current = particles.current.filter((p) => p.opacity > 0);
      if (particles.current.length > 0) {
        animRef.current = requestAnimationFrame(draw);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9998] pointer-events-none"
    />
  );
}

// ── Main popup ─────────────────────────────────────────────────────────────
export default function WelcomePopup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Only authenticated users ke liye check karo
    if (status !== "authenticated" || checked) return;
    setChecked(true);

    // Agar already dikhaya hua hai is session mein → skip
    const shown = sessionStorage.getItem(`welcome_shown_${session.user.id}`);
    if (shown) return;

    // API se confirm karo ki user genuinely naya hai
    fetch("/api/user/welcome-status")
      .then((r) => r.json())
      .then((data) => {
        if (data.isNew) {
          // Thoda delay taaki page load ho sake
          setTimeout(() => {
            setVisible(true);
            setConfetti(true);
            // Confetti 4 seconds ke baad band
            setTimeout(() => setConfetti(false), 4000);
          }, 800);
        }
      })
      .catch(() => {});
  }, [status, session, checked]);

  const handleClose = () => {
    sessionStorage.setItem(`welcome_shown_${session?.user?.id}`, "1");
    setVisible(false);
    setConfetti(false);
  };

  const handleExplore = () => {
    handleClose();
    router.push("/");
    setTimeout(() => {
      document
        .getElementById("notes-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  if (!visible) return <Confetti active={confetti} />;

  return (
    <>
      <Confetti active={confetti} />

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4"
        onClick={handleClose}
      >
        {/* Card */}
        <div
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{ animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}
        >
          {/* Top banner */}
          <div className="bg-gradient-to-br from-[#071A3D] to-[#0d2a5e] px-8 pt-8 pb-6 text-center relative">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition"
            >
              <FaTimes size={12} />
            </button>

            {/* Gift icon */}
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FaGift size={28} className="text-white" />
            </div>

            <h2 className="text-2xl font-black text-white leading-tight">
              Welcome to RTU Solutions!
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Hi {session?.user?.name?.split(" ")[0] || "there"}, you're all set 🎉
            </p>
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            {/* Free PDFs highlight */}
            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5 text-center mb-5">
              <div className="flex items-center justify-center gap-2 mb-1">
                <FaDownload className="text-orange-500" size={16} />
                <span className="text-3xl font-black text-[#071A3D]">2</span>
                <span className="text-xl font-bold text-orange-500">Free PDFs</span>
              </div>
              <p className="text-gray-600 text-sm">
                As a new member, you can download any{" "}
                <span className="font-semibold text-[#071A3D]">2 premium PDFs</span>{" "}
                completely free — no payment required.
              </p>
            </div>

            {/* Benefits list */}
            <div className="space-y-3 mb-6">
              {[
                "Pick any 2 premium PDFs from our library",
                "No credit card or payment needed",
                "From your 3rd PDF onwards, pay & download",
                "Already unlocked PDFs stay free forever",
              ].map((text, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <FaCheckCircle
                    size={14}
                    className="text-green-500 mt-0.5 flex-shrink-0"
                  />
                  <p className="text-gray-600 text-sm">{text}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={handleExplore}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-bold text-base transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 group"
            >
              Start Exploring
              <FaArrowRight
                size={13}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              This offer is for new accounts only
            </p>
          </div>
        </div>
      </div>

      {/* Popup animation */}
      <style>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7) translateY(30px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </>
  );
}