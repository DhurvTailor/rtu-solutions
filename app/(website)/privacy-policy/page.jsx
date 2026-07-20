


"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ClipboardList,
  Target,
  Lock,
  Handshake,
  Cookie,
  PenLine,
  ShieldCheck,
  ChevronDown,
  HelpCircle,
  ArrowRight,
  BadgeCheck,
  FileLock2,
  UserCheck,
  Sparkles,
} from "lucide-react";

/**
 * PlaceholderImage
 * -----------------
 * Har jagah jaha image chahiye, wahan is component ko use kiya hai.
 * Bas `src` prop mai apni image ka path daal do (public/images/... mai image daal kar).
 * Agar image nahi milegi (404 ya path galat), to ek clean dashed placeholder box dikhega
 * jisme bataya hoga ki yaha kaunsi image expected hai — broken image icon kabhi nahi dikhega.
 */
function PlaceholderImage({ src, alt, className = "", fallbackIcon: Icon = FileLock2, fallbackLabel }) {
  const [error, setError] = useState(!src);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-orange-50 border-2 border-dashed border-orange-300 rounded-2xl ${className}`}
      >
        <Icon className="w-8 h-8 text-orange-400" strokeWidth={1.5} />
        <span className="text-xs text-orange-400 font-medium px-4 text-center leading-relaxed">
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

export default function PrivacyPolicyPage() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  const sections = [
    {
      icon: ClipboardList,
      title: "Information We Collect",
      content: [
        "Personal identification info (Name, email, phone number) during registration.",
        "Academic details like branch, semester, and degree for personalized content.",
        "Payment information processed securely via Razorpay — we never store card details.",
        "Usage data including pages visited, downloads, and session duration.",
      ],
    },
    {
      icon: Target,
      title: "How We Use Your Information",
      content: [
        "To provide and personalize your RTU Solutions experience.",
        "To process payments and send purchase confirmations.",
        "To send important updates about your account or new solutions.",
        "To improve our platform based on usage patterns and feedback.",
      ],
    },
    {
      icon: Lock,
      title: "Data Security",
      content: [
        "All data is encrypted in transit using SSL/TLS protocols.",
        "Passwords are hashed and never stored in plain text.",
        "Payment data is handled by Razorpay's PCI-DSS compliant systems.",
        "We conduct regular security audits to protect your information.",
      ],
    },
    {
      icon: Handshake,
      title: "Data Sharing",
      content: [
        "We do not sell, trade, or rent your personal data to third parties.",
        "Data may be shared with Razorpay solely for payment processing.",
        "We may disclose data if required by law or legal process.",
        "Aggregated, anonymized analytics may be used for research purposes.",
      ],
    },
    {
      icon: Cookie,
      title: "Cookies",
      content: [
        "We use session cookies to maintain your login state.",
        "Analytics cookies help us understand how students use our platform.",
        "You can disable cookies in your browser, though some features may break.",
        "We do not use advertising or tracking cookies from third parties.",
      ],
    },
    {
      icon: PenLine,
      title: "Your Rights",
      content: [
        "You can request a copy of all personal data we hold about you.",
        "You may update or correct your information from your profile settings.",
        "You can request account deletion by contacting our support team.",
        "You have the right to opt out of non-essential communications.",
      ],
    },
  ];

  const highlightCards = [
    {
      imgSrc: "/pageimg/Bank-Grade Encryption.webp",
      title: "Bank-Grade Encryption",
      description:
        "Every byte of data travels over SSL/TLS, and passwords are hashed — never stored in plain text, ever.",
      icon: Lock,
      imgAlt: "Encryption and data security illustration",
      imgLabel: "Add image: highlight-encryption.png",
    },
    {
      imgSrc: "/pageimg/No Data Selling.webp",
      title: "No Data Selling",
      description:
        "We never sell, trade, or rent your personal information. Your data is shared only where strictly needed, like payments.",
       icon: Handshake,
      imgAlt: "No data selling illustration",
      imgLabel: "Add image: highlight-no-selling.png",
    },
    {
      imgSrc: "/pageimg/control.webp",
      title: "Your Data, Your Control",
      description:
        "Request a copy, correct it, or delete your account whenever you want — you're always in charge of your information.",
      icon: UserCheck,
      imgAlt: "User data control illustration",
      imgLabel: "Add image: highlight-control.png",
    },
  ];

  const faqs = [
    {
      question: "Do you sell my data to advertisers?",
      answer:
        "Never. We don't sell, trade, or rent your personal data to third parties. The only sharing that happens is with Razorpay, solely to process your payments.",
    },
    {
      question: "Do you store my card or UPI details?",
      answer:
        "No. Payments are handled entirely by Razorpay's PCI-DSS compliant systems. RTU Solutions never sees or stores your card, UPI, or banking details.",
    },
    {
      question: "How do I delete my account and data?",
      answer:
        "Reach out to our support team with a deletion request, and we'll remove your personal data from our systems, except where retention is legally required.",
    },
    {
      question: "Do you use tracking or ad cookies?",
      answer:
        "No. We only use session cookies to keep you logged in and basic analytics cookies to understand platform usage — no third-party advertising trackers.",
    },
    {
      question: "Can I get a copy of the data you hold on me?",
      answer:
        "Yes. You can request a full copy of all personal data we hold about you at any time by contacting our support team.",
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
              <Lock className="w-4 h-4" />
              Last updated: June 2025
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-orange-100 text-lg max-w-lg mb-8">
              We value your trust. Here&apos;s a clear, honest breakdown of how
              RTU Solutions handles your data.
            </p>
            <a
              href="#privacy-detail"
              className="inline-flex items-center gap-2 bg-[#ff6900] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#e85f00] transition"
            >
              See the Details
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right: hero image */}
          <div data-aos="fade-left" data-aos-delay="150" className="relative">
            <PlaceholderImage
              src="/pageimg/PrivacyPolicy.webp"
              alt="Privacy policy hero illustration"
              className="w-full h-80 md:h-96 object-contain rounded-4xl"
              fallbackIcon={ShieldCheck}
              fallbackLabel="Add image: privacy-hero.png (isometric shield / lock illustration)"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        {/* ---------------- Intro / Commitment card ---------------- */}
        <div data-aos="fade-up" className="-mt-8 mb-14">
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-lg mb-1">
                Our Commitment
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                RTU Solutions (&quot;we&quot;, &quot;our&quot;) is committed
                to protecting your privacy. This policy applies to all
                students, users, and visitors of our platform. By using RTU
                Solutions, you agree to the data practices described below.
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- Highlight Cards with Images ---------------- */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
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

        {/* ---------------- Detailed Sections ---------------- */}
        <div id="privacy-detail" className="scroll-mt-24 pb-4">
          <div data-aos="fade-up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              The Full Policy
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              A detailed, section-by-section look at how your data is
              handled.
            </p>
          </div>

          <div className="grid gap-6">
            {sections.map((section, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 60}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all duration-300"
              >
                <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 bg-white">
                  <div className="w-10 h-10 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="font-semibold text-gray-800 text-lg">
                    {section.title}
                  </h2>
                </div>
                <ul className="px-6 py-4 space-y-3">
                  {section.content.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 text-sm text-gray-600"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- FAQ Section: Image left, accordion right ---------------- */}
        <div className="mt-20 grid md:grid-cols-2 gap-10 items-start">
          <div data-aos="fade-right" className="md:sticky md:top-24">
            {/* <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </div> */}
            {/* <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Quick Answers
            </h2> */}
          
            <PlaceholderImage
              src="/pageimg/QuickAnswers.webp"
              alt="Privacy frequently asked questions illustration"
              className="w-full h-64 md:h-80 object-contain rounded-3xl"
              fallbackIcon={HelpCircle}
              fallbackLabel="Add image: privacy-faq-illustration.png"
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

        {/* ---------------- Contact CTA ---------------- */}
        <div
          data-aos="zoom-in"
          className="mt-20 mb-20 relative overflow-hidden bg-[#0B1F3F] rounded-2xl p-8 md:p-10 text-white text-center"
        >
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-orange-200" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Questions about your privacy?
          </h3>
          <p className="text-orange-100 mb-6 text-sm max-w-md mx-auto">
            We&apos;re happy to help. Reach out to our support team anytime.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#0B1F3F] font-semibold px-6 py-2.5 rounded-xl hover:bg-orange-50 transition"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}