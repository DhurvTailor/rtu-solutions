"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function TermsPage() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  const sections = [
    {
      icon: "📖",
      title: "Acceptance of Terms",
      content: `By accessing or using RTU Solutions, you confirm that you are at least 18 years old (or have parental consent), and you agree to be bound by these Terms. If you do not agree, please discontinue use of the platform immediately.`,
    },
    {
      icon: "🎓",
      title: "Use of Content",
      content: `All solutions, PDFs, notes, and content on this platform are for personal educational reference only. You may not redistribute, resell, share, or reproduce any purchased content without explicit written permission from RTU Solutions.`,
    },
    {
      icon: "💳",
      title: "Payments & Purchases",
      content: `All payments are processed securely through Razorpay. Prices are in Indian Rupees (INR) and include applicable taxes. We reserve the right to change pricing at any time. Completed transactions cannot be reversed except as per our Refund Policy.`,
    },
    {
      icon: "🚫",
      title: "Prohibited Activities",
      content: `You must not: (a) use the platform for any illegal purpose, (b) attempt to scrape, hack, or reverse-engineer our systems, (c) create fake accounts or misuse referral systems, (d) upload or share malicious content, or (e) impersonate other users or RTU Solutions staff.`,
    },
    {
      icon: "📝",
      title: "User Content & Accounts",
      content: `You are responsible for maintaining the confidentiality of your account credentials. RTU Solutions is not liable for unauthorized access due to user negligence. We reserve the right to suspend accounts that violate these terms without prior notice.`,
    },
    {
      icon: "⚖️",
      title: "Intellectual Property",
      content: `All original content, design, code, and branding of RTU Solutions are protected under Indian copyright law. RTU Solutions does not claim ownership over university question papers or syllabi, which remain property of Rajasthan Technical University (RTU).`,
    },
    {
      icon: "🛡️",
      title: "Disclaimer of Warranties",
      content: `RTU Solutions provides content "as is" without warranties of any kind. While we strive for accuracy, we do not guarantee that solutions are error-free or will result in specific academic outcomes. Use of this content is at your own academic discretion.`,
    },
    {
      icon: "📍",
      title: "Governing Law",
      content: `These Terms are governed by the laws of India. Any disputes arising from use of RTU Solutions shall be subject to the exclusive jurisdiction of courts located in Jaipur, Rajasthan, India.`,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-purple-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div
            data-aos="zoom-in"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <span>📜</span> Last updated: June 2025
          </div>
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Terms & Conditions
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-violet-100 text-lg max-w-2xl mx-auto"
          >
            Please read these terms carefully before using RTU Solutions. They define your rights and responsibilities.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* Quick summary */}
        <div
          data-aos="fade-up"
          className="grid grid-cols-3 gap-4 my-10"
        >
          {[
            { icon: "🎯", label: "Educational Use Only" },
            { icon: "🔒", label: "Secure Payments" },
            { icon: "⚖️", label: "Indian Law Governed" },
          ].map((item, i) => (
            <div
              key={i}
              data-aos="zoom-in"
              data-aos-delay={i * 80}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center"
            >
              <div className="text-2xl mb-2">{item.icon}</div>
              <p className="text-xs font-semibold text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 60}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-violet-200 transition-all duration-300"
            >
              <details className="group">
                <summary className="flex items-center gap-3 px-6 py-4 cursor-pointer list-none select-none">
                  <span className="text-2xl">{section.icon}</span>
                  <h2 className="font-semibold text-gray-800 text-base flex-1">
                    {section.title}
                  </h2>
                  <span className="text-gray-400 group-open:rotate-180 transition-transform duration-200">
                    ▾
                  </span>
                </summary>
                <div className="px-6 pb-5 pt-1 border-t border-gray-50">
                  <p className="text-sm text-gray-600 leading-relaxed">{section.content}</p>
                </div>
              </details>
            </div>
          ))}
        </div>

        {/* Agreement CTA */}
        <div
          data-aos="zoom-in"
          className="mt-10 bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-xl font-bold mb-2">Have questions about these terms?</h3>
          <p className="text-violet-100 mb-4 text-sm">
            Our team is here to help clarify anything you're unsure about.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-violet-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-violet-50 transition"
          >
            Get in Touch
          </a>
        </div>
      </div>
    </div>
  );
}