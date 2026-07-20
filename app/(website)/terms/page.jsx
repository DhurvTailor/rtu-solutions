






"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  BookOpen,
  GraduationCap,
  CreditCard,
  Ban,
  UserCog,
  Scale,
  ShieldCheck,
  MapPin,
  ChevronDown,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Lock,
  BadgeCheck,
  FileText,
} from "lucide-react";

/**
 * PlaceholderImage
 * -----------------
 * Har jagah jaha image chahiye, wahan is component ko use kiya hai.
 * Bas `src` prop mai apni image ka path daal do (public/images/... mai image daal kar).
 * Agar image nahi milegi (404 ya path galat), to ek clean dashed placeholder box dikhega
 * jisme bataya hoga ki yaha kaunsi image expected hai — broken image icon kabhi nahi dikhega.
 */
function PlaceholderImage({ src, alt, className = "", fallbackIcon: Icon = FileText, fallbackLabel }) {
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

export default function TermsPage() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  const sections = [
    {
      icon: BookOpen,
      title: "Acceptance of Terms",
      content: `By accessing or using RTU Solutions, you confirm that you are at least 18 years old (or have parental consent), and you agree to be bound by these Terms. If you do not agree, please discontinue use of the platform immediately.`,
    },
    {
      icon: GraduationCap,
      title: "Use of Content",
      content: `All solutions, PDFs, notes, and content on this platform are for personal educational reference only. You may not redistribute, resell, share, or reproduce any purchased content without explicit written permission from RTU Solutions.`,
    },
    {
      icon: CreditCard,
      title: "Payments & Purchases",
      content: `All payments are processed securely through Razorpay. Prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to change pricing at any time. Completed transactions cannot be reversed except as per our Refund Policy.`,
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      content: `You must not: (a) use the platform for any illegal purpose, (b) attempt to scrape, hack, or reverse-engineer our systems, (c) create fake accounts or misuse referral systems, (d) upload or share malicious content, or (e) impersonate other users or RTU Solutions staff.`,
    },
    {
      icon: UserCog,
      title: "User Content & Accounts",
      content: `You are responsible for maintaining the confidentiality of your account credentials. RTU Solutions is not liable for unauthorized access due to user negligence. We reserve the right to suspend accounts that violate these terms without prior notice.`,
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      content: `All original content, design, code, and branding of RTU Solutions are protected under Indian copyright law. RTU Solutions does not claim ownership over university question papers or syllabi, which remain property of Rajasthan Technical University (RTU).`,
    },
    {
      icon: ShieldCheck,
      title: "Disclaimer of Warranties",
      content: `RTU Solutions provides content "as is" without warranties of any kind. While we strive for accuracy, we do not guarantee that solutions are error-free or will result in specific academic outcomes. Use of this content is at your own academic discretion.`,
    },
    {
      icon: MapPin,
      title: "Governing Law",
      content: `These Terms are governed by the laws of India. Any disputes arising from use of RTU Solutions shall be subject to the exclusive jurisdiction of courts located in Jaipur, Rajasthan, India.`,
    },
  ];

  const highlightCards = [
    {
      icon: GraduationCap,
      title: "Educational Use Only",
      description:
        "All notes, PYQs, and solved papers are meant strictly for your personal exam preparation — not for resale or redistribution.",
      imgSrc: "/pageimg/Educational Use Only.webp",
      imgAlt: "Educational use illustration",
      imgLabel: "Add image: highlight-education.png",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description:
        "Every transaction runs through Razorpay's encrypted checkout, so your card and UPI details never touch our servers directly.",
      imgSrc: "/pageimg/Secure Payments.webp",
      imgAlt: "Secure payments illustration",
      imgLabel: "Add image: highlight-payments.png",
    },
    {
      icon: Scale,
      title: "Indian Law Governed",
      description:
        "These Terms follow Indian copyright and IT law, with any disputes handled under the jurisdiction of Jaipur courts.",
      imgSrc: "/pageimg/RTUcollege.webp",
      imgAlt: "Legal governance illustration",
      imgLabel: "Add image: highlight-law.png",
    },
  ];

  const faqs = [
    {
      question: "Can I share my purchased notes with friends?",
      answer:
        "No. Purchased content is licensed to your account only, for personal exam preparation. Sharing, reselling, or redistributing it violates our Terms and may lead to account suspension.",
    },
    {
      question: "Is my payment information safe?",
      answer:
        "Yes. All payments are processed through Razorpay's secure, PCI-DSS compliant checkout. RTU Solutions never stores your card or UPI details on its own servers.",
    },
    {
      question: "Can RTU Solutions suspend my account?",
      answer:
        "We can suspend accounts that violate these Terms — for example, misuse of referrals, scraping content, or sharing paid material — without prior notice.",
    },
    {
      question: "Are the solutions officially verified by RTU?",
      answer:
        "Solutions are prepared for reference and exam-prep purposes only. Original question papers and syllabi remain the property of Rajasthan Technical University; we don't claim official verification.",
    },
    {
      question: "Can pricing change after I've added something to cart?",
      answer:
        "Prices can be updated at any time, but once a transaction is completed successfully, it's locked in and won't be affected by later price changes.",
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
              <FileText className="w-4 h-4" />
              Last updated: June 2025
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Terms & Conditions
            </h1>
            <p className="text-orange-100 text-lg max-w-lg mb-8">
              Please read these terms carefully before using RTU Solutions. They
              define your rights and responsibilities as a student on our
              platform.
            </p>
            <a
              href="#terms-detail"
              className="inline-flex items-center gap-2 bg-[#ff6900] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#e85f00] transition"
            >
              Read the Terms
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right: hero image */}
          <div data-aos="fade-left" data-aos-delay="150" className="relative">
            <PlaceholderImage
              src="/pageimg/Terms & Conditions.webp"
              alt="Terms and conditions hero illustration"
              className="w-full h-80 md:h-96 object-contain rounded-3xl"
              fallbackIcon={FileText}
              fallbackLabel="Add image: terms-hero.png (isometric document / contract illustration)"
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

        {/* ---------------- Detailed Terms Accordion ---------------- */}
        <div id="terms-detail" className="scroll-mt-24">
          <div data-aos="fade-up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              The Full Terms
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Tap on any section below to expand and read the details.
            </p>
          </div>

          <div className="space-y-4">
            {sections.map((section, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all duration-300"
              >
                <details className="group">
                  <summary className="flex items-center gap-4 px-6 py-4 cursor-pointer list-none select-none">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-base flex-1">
                      {section.title}
                    </h3>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <div className="px-6 pb-5 pt-1 pl-18 border-t border-gray-50">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </details>
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
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Quick Answers
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">
              Common questions students ask about how these terms work in
              practice.
            </p> */}
            <PlaceholderImage
              src="/pageimg/QuickAnswers.webp"
              alt="Frequently asked questions illustration"
              className="w-full h-64 md:h-80 object-contain rounded-3xl"
              fallbackIcon={HelpCircle}
              fallbackLabel="Add image: faq-illustration.png"
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

        {/* ---------------- Agreement CTA ---------------- */}
        <div
          data-aos="zoom-in"
          className="mt-20 relative overflow-hidden bg-[#0B1F3F] rounded-2xl p-8 md:p-10 text-white text-center"
        >
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-orange-200" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Have questions about these terms?
          </h3>
          <p className="text-orange-100 mb-6 text-sm max-w-md mx-auto">
            Our team is here to help clarify anything you're unsure about.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#0B1F3F] font-semibold px-6 py-2.5 rounded-xl hover:bg-orange-50 transition"
          >
            Get in Touch
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}