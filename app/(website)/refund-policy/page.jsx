"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Wallet,
  Mail,
  ClipboardCheck,
  BadgeIndianRupee,
  Landmark,
  CheckCircle2,
  XCircle,
  Check,
  X,
  Clock,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  ArrowRight,
  BadgeCheck,
  ShieldQuestion,
} from "lucide-react";

/**
 * PlaceholderImage
 * -----------------
 * Har jagah jaha image chahiye, wahan is component ko use kiya hai.
 * Bas `src` prop mai apni image ka path daal do (public/images/... mai image daal kar).
 * Agar image nahi milegi (404 ya path galat), to ek clean dashed placeholder box dikhega
 * jisme bataya hoga ki yaha kaunsi image expected hai — broken image icon kabhi nahi dikhega.
 */
function PlaceholderImage({ src, alt, className = "", fallbackIcon: Icon = Wallet, fallbackLabel }) {
  const [error, setError] = useState(!src);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-orange-50 border-2 border-dashed border-orange-300 rounded-2xl ${className}`}
      >
        <Icon className="w-8 h-8 text-orange-500" strokeWidth={1.5} />
        <span className="text-xs text-orange-500 font-medium px-4 text-center leading-relaxed">
          {fallbackLabel || "Add image here"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

export default function RefundPolicyPage() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  const steps = [
    {
      step: "01",
      icon: Mail,
      title: "Submit Request",
      desc: "Email us at support@rtusolutions.in within 7 days of purchase with your order ID.",
      color: "from-[#0B1F3F] to-[#132a52]",
    },
    {
      step: "02",
      icon: ClipboardCheck,
      title: "Review Process",
      desc: "Our team reviews your request within 24–48 hours and verifies the issue.",
      color: "from-[#132a52] to-[#ff6900]",
    },
    {
      step: "03",
      icon: BadgeIndianRupee,
      title: "Refund Initiated",
      desc: "If approved, the refund is initiated to your original payment method.",
      color: "from-[#ff6900] to-[#e85f00]",
    },
    {
      step: "04",
      icon: Landmark,
      title: "Credit Received",
      desc: "Amount reflects in your account within 5–7 working days depending on your bank.",
      color: "from-slate-700 to-slate-900",
    },
  ];
  const eligible = [
    "File was corrupted or unreadable after download",
    "You were charged twice for the same solution",
    "Solution content was significantly different from what was described",
    "Technical error prevented access despite successful payment",
  ];

  const notEligible = [
    "You downloaded the file successfully and changed your mind",
    "You bought the wrong subject or semester",
    "Dissatisfaction with the quality of the answer (preview is available before purchase)",
    "Refund request submitted after 7 days of purchase",
  ];

  const highlightCards = [
    {
      icon: Clock,
      title: "7-Day Window",
      description:
        "Raise your refund request within 7 days of purchase — requests after that window can't be processed.",
      imgSrc: "/pageimg/7-Day Window.webp",
      imgAlt: "7 day refund window illustration",
      imgLabel: "Add image: highlight-7days.png",
    },
    {
      icon: ClipboardCheck,
      title: "Quick Review",
      description:
        "Every request is reviewed by our team within 24–48 hours, so you're never left waiting long for an answer.",
      imgSrc: "/pageimg/Quick Review.webp",
      imgAlt: "Quick review process illustration",
      imgLabel: "Add image: highlight-review.png",
    },
    {
      icon: Landmark,
      title: "Straight to Your Bank",
      description:
        "Approved refunds go back to your original payment method — no store credit, no strings attached.",
      imgSrc: "/pageimg/Straight to Your Bank.webp",
      imgAlt: "Bank refund illustration",
      imgLabel: "Add image: highlight-bank.png",
    },
  ];

  const faqs = [
    {
      question: "How long does a refund actually take?",
      answer:
        "Once approved, the refund is initiated immediately, but it typically takes 5–7 working days to reflect in your account, depending on your bank.",
    },
    {
      question: "I bought the wrong semester by mistake — can I get a refund?",
      answer:
        "Unfortunately no. Since a preview is available before purchase, refunds aren't offered for choosing the wrong subject or semester. Please double-check before buying.",
    },
    {
      question: "What if I was charged twice for the same solution?",
      answer:
        "That's covered — duplicate charges are fully eligible for a refund. Email us with both order IDs and we'll sort it out quickly.",
    },
    {
      question: "Can I request a refund after 7 days?",
      answer:
        "No, the 7-day window is strict and applies regardless of the reason. We'd recommend raising any issue as soon as you notice it.",
    },
    {
      question: "Do I get store credit or money back?",
      answer:
        "Approved refunds go directly back to your original payment method via Razorpay — not store credit.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ---------------- Hero Section ---------------- */}
      <section className="relative overflow-hidden bg-[#0B1F3F] text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Wallet className="w-4 h-4" />
              Fair & Transparent Policy
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Refund Policy
            </h1>
            <p className="text-orange-100 text-lg max-w-lg mb-8">
              We believe in fair refunds. If something goes wrong on our end,
              we&apos;ll make it right.
            </p>
            <a
              href="#refund-process"
              className="inline-flex items-center gap-2 bg-white text-[#0B1F3F] font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition"
            >
              See How It Works
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right: hero image */}
          <div data-aos="fade-left" data-aos-delay="150" className="relative">
            <PlaceholderImage
              src="/pageimg/Refund Policy.webp"
              alt="Refund policy hero illustration"
              className="w-full h-80 md:h-96 object-contain rounded-3xl"
              fallbackIcon={BadgeIndianRupee}
              fallbackLabel="Add image: refund-hero.png (isometric wallet / refund illustration)"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* ---------------- Highlight Cards with Images ---------------- */}
        <div className="grid md:grid-cols-3 gap-6 my-14">
          {highlightCards.map((card, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 100}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-200 hover:-translate-y-1 transition-all duration-300"
            >
              <PlaceholderImage
  src={card.imgSrc}
  alt={card.imgAlt}
  className="w-full h-48 object-contain bg-gray-50 p-2"
/>
              <div className="p-6">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-base mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- Timeline ---------------- */}
        <div id="refund-process" className="scroll-mt-24 my-12">
          <div data-aos="fade-up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              How the Refund Process Works
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Four simple steps from request to money back in your account.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-[#0B1F3F] text-white flex items-center justify-center mx-auto mb-3 relative`}
                >
                  <s.icon className="w-5 h-5" />
                  <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-white text-gray-700 text-[10px] font-bold flex items-center justify-center shadow">
                    {s.step}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">
                  {s.title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  {s.desc}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 text-gray-300 z-10">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Eligible / Not Eligible ---------------- */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div
            data-aos="fade-right"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-[#0B1F3F] px-6 py-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Eligible for Refund
              </h3>
            </div>
            <ul className="px-6 py-4 space-y-3">
              {eligible.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            data-aos="fade-left"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-[#132a52] px-6 py-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                Not Eligible for Refund
              </h3>
            </div>
            <ul className="px-6 py-4 space-y-3">
              {notEligible.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 mt-0.5">
                    <X className="w-3 h-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------------- Timeline note ---------------- */}
        <div
          data-aos="fade-up"
          className="bg-orange-50 border border-orange-200 rounded-2xl p-6 mb-16 flex items-start gap-4"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-semibold text-[#0B1F3F] mb-1">
              Important: 7-Day Window
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              All refund requests must be raised within{" "}
              <strong>7 days</strong> of purchase. Requests submitted after
              this window will not be entertained, regardless of the reason.
            </p>
          </div>
        </div>

        {/* ---------------- FAQ Section: Image left, accordion right ---------------- */}
        <div className="grid md:grid-cols-2 gap-10 items-start mb-20">
          <div data-aos="fade-right" className="md:sticky md:top-24">
            {/* <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Quick Answers
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">
              Common questions students ask before requesting a refund.
            </p> */}
            <PlaceholderImage
              src="/pageimg/QuickAnswers.webp"
              alt="Refund frequently asked questions illustration"
              className="w-full h-64 md:h-80 object-contain rounded-3xl"
              fallbackIcon={ShieldQuestion}
              fallbackLabel="Add image: refund-faq-illustration.png"
            />
          </div>

          <div data-aos="fade-left" className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-orange-200 transition-colors duration-300"
              >
                <details className="group">
                  <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none select-none">
                    <BadgeCheck className="w-4 h-4 text-orange-500 shrink-0" />
                    <h3 className="font-medium text-gray-800 text-sm flex-1">
                      {faq.question}
                    </h3>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-200 shrink-0" />
                  </summary>
                  <div className="px-5 pb-4 pl-12">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- CTA ---------------- */}
        <div
          data-aos="zoom-in"
          className="bg-[#0B1F3F] rounded-2xl p-8 md:p-10 text-white text-center"
        >
          <Mail className="w-8 h-8 mx-auto mb-3 text-orange-200" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Need to request a refund?
          </h3>
          <p className="text-orange-100 mb-6 text-sm max-w-md mx-auto">
            Email us at{" "}
            <span className="font-semibold underline">
              support@rtusolutions.in
            </span>{" "}
            with your Order ID and reason.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#0B1F3F] font-semibold px-6 py-2.5 rounded-xl hover:bg-orange-50 transition"
          >
            Contact Support
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}