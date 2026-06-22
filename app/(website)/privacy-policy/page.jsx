"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function PrivacyPolicyPage() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  const sections = [
    {
      icon: "📋",
      title: "Information We Collect",
      content: [
        "Personal identification info (Name, email, phone number) during registration.",
        "Academic details like branch, semester, and degree for personalized content.",
        "Payment information processed securely via Razorpay — we never store card details.",
        "Usage data including pages visited, downloads, and session duration.",
      ],
    },
    {
      icon: "🎯",
      title: "How We Use Your Information",
      content: [
        "To provide and personalize your RTU Solutions experience.",
        "To process payments and send purchase confirmations.",
        "To send important updates about your account or new solutions.",
        "To improve our platform based on usage patterns and feedback.",
      ],
    },
    {
      icon: "🔒",
      title: "Data Security",
      content: [
        "All data is encrypted in transit using SSL/TLS protocols.",
        "Passwords are hashed and never stored in plain text.",
        "Payment data is handled by Razorpay's PCI-DSS compliant systems.",
        "We conduct regular security audits to protect your information.",
      ],
    },
    {
      icon: "🤝",
      title: "Data Sharing",
      content: [
        "We do not sell, trade, or rent your personal data to third parties.",
        "Data may be shared with Razorpay solely for payment processing.",
        "We may disclose data if required by law or legal process.",
        "Aggregated, anonymized analytics may be used for research purposes.",
      ],
    },
    {
      icon: "🍪",
      title: "Cookies",
      content: [
        "We use session cookies to maintain your login state.",
        "Analytics cookies help us understand how students use our platform.",
        "You can disable cookies in your browser, though some features may break.",
        "We do not use advertising or tracking cookies from third parties.",
      ],
    },
    {
      icon: "✏️",
      title: "Your Rights",
      content: [
        "You can request a copy of all personal data we hold about you.",
        "You may update or correct your information from your profile settings.",
        "You can request account deletion by contacting our support team.",
        "You have the right to opt out of non-essential communications.",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div
            data-aos="zoom-in"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <span>🔐</span> Last updated: June 2025
          </div>
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Privacy Policy
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-blue-100 text-lg max-w-2xl mx-auto"
          >
            We value your trust. Here's a clear, honest breakdown of how RTU Solutions handles your data.
          </p>
        </div>
      </div>

      {/* Intro card */}
      <div className="max-w-4xl mx-auto px-6 -mt-8 mb-12">
        <div
          data-aos="fade-up"
          className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 flex items-start gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-2xl shrink-0">
            ℹ️
          </div>
          <div>
            <h2 className="font-semibold text-gray-800 text-lg mb-1">Our Commitment</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              RTU Solutions (&quot;we&quot;, &quot;our&quot;) is committed to protecting your privacy. This policy applies to all students, users, and visitors of our platform. By using RTU Solutions, you agree to the data practices described below.
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid gap-6">
          {sections.map((section, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 80}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all duration-300"
            >
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                <span className="text-2xl">{section.icon}</span>
                <h2 className="font-semibold text-gray-800 text-lg">{section.title}</h2>
              </div>
              <ul className="px-6 py-4 space-y-3">
                {section.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div
          data-aos="fade-up"
          className="mt-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-xl font-bold mb-2">Questions about your privacy?</h3>
          <p className="text-indigo-100 mb-4 text-sm">
            We're happy to help. Reach out to our support team anytime.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-indigo-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}