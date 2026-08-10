"use client";

import { useState } from "react";
import {
  FiEye,
  FiCreditCard,
  FiDownloadCloud,
  FiLock,
  FiChevronDown,
  FiCheckCircle,
} from "react-icons/fi";

// ── Seal icon — same motif family as the CGPA calculator's result stamp ──
function IconSeal({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
      <path
        d="M24 12l2.47 5.01 5.53.8-4 3.9.94 5.5L24 24.6l-4.94 2.6.94-5.5-4-3.9 5.53-.8L24 12z"
        fill="currentColor"
      />
      <path
        d="M17 31l-2.5 9L20 37l4 4 4-4 5.5 3-2.5-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STEPS = [
  {
    num: "01",
    icon: FiEye,
    title: "Browse & Preview",
    desc: "Open any PDF and view the first 2 pages for free — check the content and handwriting quality before you decide to buy.",
  },
  {
    num: "02",
    icon: FiCreditCard,
    title: "Pay Securely",
    desc: "Like what you see? Pay through Razorpay — cards, UPI, and net banking are all supported, with bank-grade security.",
  },
  {
    num: "03",
    icon: FiDownloadCloud,
    title: "Download Instantly",
    desc: "As soon as payment is confirmed, the full PDF is available in your My Purchases page — no waiting.",
  },
];

const CATEGORIES = [
  {
    key: "notes",
    label: "Notes",
    range: "Starts at a low price",
    desc: "Subject-wise handwritten and typed notes, organised unit by unit.",
    imgAlt: "Notes 3D icon",
  },
  {
    key: "pyq",
    label: "PYQ Solutions",
    range: "Priced by content depth",
    desc: "Solved previous year question papers — more years covered means more detailed content.",
    imgAlt: "PYQ Solutions 3D icon",
  },
  {
    key: "videos",
    label: "Video Lectures",
    range: "Many are free to watch",
    desc: "Several video lectures are free; others are bundled with premium notes.",
    imgAlt: "Video Lectures 3D icon",
  },
];

const FAQS = [
  {
    q: "Why doesn't RTU Solutions offer fixed pricing plans?",
    a: "Because every student doesn't need every subject's PDF. A subscription makes you pay for material you'll never open. Instead, you only pay for the exact PDF you need — nothing more.",
  },
  {
    q: "How is the price of each PDF decided?",
    a: "Pricing is based on the depth of content — number of pages, solved questions, and how many years of previous papers are covered. That's why price varies from subject to subject.",
  },
  {
    q: "Is payment on RTU Solutions safe?",
    a: "Yes — every payment is processed through Razorpay, an RBI-approved payment gateway. Your card and UPI details are never stored on our servers.",
  },
  {
    q: "What do I get in the free preview?",
    a: "You can view the first 2 pages of any premium PDF for free, without logging in or paying, so you can check the content and quality yourself before buying.",
  },
  {
    q: "Do you offer refunds?",
    a: "Refund eligibility is covered on our Refund Policy page — genuine issues like an incorrect purchase are covered.",
  },
];

export default function PricingClient() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <main className="min-h-screen bg-[#FAF8F3]">
      {/* ───────────────── Hero + Fee Slip ───────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E8700A]">
            Fee Structure
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#071A3D] mt-3 leading-tight">
            No fixed plans. Just the price of the one PDF you actually need.
          </h1>
          <p className="text-gray-500 text-sm sm:text-base mt-4">
            No monthly subscription, no forced bundles. Every note and solution
            is priced on its own — and the price is always shown right on its page.
          </p>
        </div>

        {/* Signature element — Official Fee Slip */}
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-[0_10px_40px_-12px_rgba(7,26,61,0.25)] bg-white">
            {/* Header */}
            <div className="bg-[#071A3D] px-6 py-5 flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
                <IconSeal className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white font-semibold leading-tight text-sm">
                  RTU Solutions
                </p>
                <p className="text-slate-300 text-xs tracking-wide">
                  Official Fee Information Slip
                </p>
              </div>
            </div>

            {/* Perforated tear line */}
            <div className="relative h-0">
              <div className="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-[#FAF8F3]" />
              <div className="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-[#FAF8F3]" />
              <div className="border-t-2 border-dashed border-slate-200 mx-4" />
            </div>

            {/* Line items */}
            <div className="px-6 py-6 space-y-4">
              <FeeRow label="Preview (2 pages)" value="Free" highlight="green" />
              <FeeRow label="Full PDF" value="Per document" />
              <FeeRow label="Payment method" value="Razorpay (secure)" />
              <FeeRow label="Delivery" value="Instant, after payment" />
            </div>

            {/* Bottom strip */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center gap-2">
              <FiLock className="text-[#071A3D] shrink-0" size={14} />
              <p className="text-xs text-slate-500">
                The exact price is always shown on the PDF's page — no hidden charges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────── How it works ───────────────── */}
      <section className="bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-[#071A3D]">
              How It Works
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              Three simple steps — with no account-wide commitment
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {STEPS.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.num} className="relative">
                  <span className="text-5xl font-black text-slate-100 leading-none select-none">
                    {s.num}
                  </span>
                  <div className="w-11 h-11 rounded-xl bg-[#071A3D] text-amber-400 flex items-center justify-center -mt-7 mb-4 relative z-10">
                    <Icon size={18} />
                  </div>
                  <h3 className="font-bold text-[#071A3D] mb-1.5">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ───────────────── Why price varies ───────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-[#071A3D]">
            Why Prices Vary by Document
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            A subscription charges everyone the same amount. We charge based on
            content depth instead — the more work went in, the higher the price.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {CATEGORIES.map((c) => (
            <div
              key={c.key}
              className="bg-white border border-slate-100 rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
            >
              {/* ── 3D image placeholder ──
                  To add your own 3D render here:
                  1. Save the image at /public/pricing/{c.key}-3d.png
                  2. Replace the <div> below with:

                  <Image
                    src={`/pricing/${c.key}-3d.png`}
                    alt={c.imgAlt}
                    width={120}
                    height={120}
                    className="mx-auto mb-4"
                  />
              */}
              <div className="w-28 h-28 mx-auto mb-4 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300 text-[11px] leading-tight px-2">
                {c.imgAlt} here
              </div>

              <h3 className="font-bold text-[#071A3D]">{c.label}</h3>
              <p className="text-xs font-semibold text-[#E8700A] mt-1 mb-2">
                {c.range}
              </p>
              <p className="text-sm text-gray-500 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────────── Trust strip ───────────────── */}
      <section className="bg-[#071A3D]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid sm:grid-cols-3 gap-6 text-center sm:text-left">
            <TrustItem
              icon={<FiLock size={16} />}
              title="Razorpay Secured"
              desc="RBI-approved payment gateway"
            />
            <TrustItem
              icon={<FiEye size={16} />}
              title="Free 2-Page Preview"
              desc="See the content before you buy"
            />
            <TrustItem
              icon={<FiCheckCircle size={16} />}
              title="1000+ Students"
              desc="Trust RTU Solutions for exam prep"
            />
          </div>
        </div>
      </section>

      {/* ───────────────── FAQ ───────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h2 className="text-2xl font-bold text-[#071A3D] text-center mb-8">
          Frequently Asked Questions
        </h2>

        <div className="space-y-3">
          {FAQS.map((item, i) => {
            const open = openFaq === i;
            return (
              <div
                key={item.q}
                className="border border-slate-200 rounded-xl overflow-hidden bg-white"
              >
                <button
                  onClick={() => setOpenFaq(open ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="font-semibold text-sm text-[#071A3D]">
                    {item.q}
                  </span>
                  <FiChevronDown
                    className={`shrink-0 text-slate-400 transition-transform ${
                      open ? "rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>
                {open && (
                  <div className="px-5 pb-4">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ───────────────── CTA ───────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="bg-[#071A3D] rounded-2xl px-8 py-12 text-center">
          <h2 className="text-white text-2xl font-bold mb-2">
            Find your subject, check the price, decide for yourself
          </h2>
          <p className="text-slate-300 text-sm mb-6 max-w-md mx-auto">
            Every PDF page shows its exact price and a free preview.
          </p>
          <a
            href="/rtu-solutions"
            className="inline-flex items-center gap-2 bg-[#E8700A] hover:bg-[#d9660a] text-white text-sm font-semibold px-6 py-3 rounded-full transition"
          >
            Browse PDFs
          </a>
        </div>
      </section>
    </main>
  );
}

// ── Small pieces ──────────────────────────────────────────────
function FeeRow({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span
        className={`text-sm font-semibold ${
          highlight === "green" ? "text-emerald-600" : "text-[#071A3D]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function TrustItem({ icon, title, desc }) {
  return (
    <div className="flex items-center gap-3 justify-center sm:justify-start">
      <div className="w-9 h-9 rounded-lg bg-white/10 text-amber-400 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-white text-sm font-semibold">{title}</p>
        <p className="text-slate-400 text-xs">{desc}</p>
      </div>
    </div>
  );
}