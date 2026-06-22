"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function RefundPolicyPage() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  const steps = [
    {
      step: "01",
      title: "Submit Request",
      desc: "Email us at support@rtusolutions.in within 7 days of purchase with your order ID.",
      color: "from-violet-500 to-purple-600",
    },
    {
      step: "02",
      title: "Review Process",
      desc: "Our team reviews your request within 24–48 hours and verifies the issue.",
      color: "from-blue-500 to-indigo-600",
    },
    {
      step: "03",
      title: "Refund Initiated",
      desc: "If approved, the refund is initiated to your original payment method.",
      color: "from-cyan-500 to-teal-600",
    },
    {
      step: "04",
      title: "Credit Received",
      desc: "Amount reflects in your account within 5–7 working days depending on your bank.",
      color: "from-emerald-500 to-green-600",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 blur-2xl" />
        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div
            data-aos="zoom-in"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <span>💸</span> Fair & Transparent Policy
          </div>
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Refund Policy
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-emerald-100 text-lg max-w-2xl mx-auto"
          >
            We believe in fair refunds. If something goes wrong on our end, we'll make it right.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* Timeline */}
        <div data-aos="fade-up" className="my-12">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            How the Refund Process Works
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="relative bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center hover:shadow-md transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} text-white font-bold text-lg flex items-center justify-center mx-auto mb-3`}
                >
                  {s.step}
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-2">{s.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 text-gray-300 text-lg z-10">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Eligible / Not Eligible */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div
            data-aos="fade-right"
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="bg-gradient-to-r from-emerald-500 to-green-500 px-6 py-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                ✅ Eligible for Refund
              </h3>
            </div>
            <ul className="px-6 py-4 space-y-3">
              {eligible.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ✓
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
            <div className="bg-gradient-to-r from-red-500 to-rose-500 px-6 py-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                ❌ Not Eligible for Refund
              </h3>
            </div>
            <ul className="px-6 py-4 space-y-3">
              {notEligible.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xs shrink-0 mt-0.5">
                    ✗
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Timeline note */}
        <div
          data-aos="fade-up"
          className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8 flex items-start gap-4"
        >
          <span className="text-3xl shrink-0">⏰</span>
          <div>
            <h3 className="font-semibold text-amber-800 mb-1">Important: 7-Day Window</h3>
            <p className="text-amber-700 text-sm leading-relaxed">
              All refund requests must be raised within <strong>7 days</strong> of purchase. Requests submitted after this window will not be entertained, regardless of the reason.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div
          data-aos="zoom-in"
          className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-8 text-white text-center"
        >
          <h3 className="text-xl font-bold mb-2">Need to request a refund?</h3>
          <p className="text-emerald-100 mb-4 text-sm">
            Email us at{" "}
            <span className="font-semibold underline">support@rtusolutions.in</span> with your Order ID and reason.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-emerald-600 font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-50 transition"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}