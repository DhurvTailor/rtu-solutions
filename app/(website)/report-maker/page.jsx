"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFileWord, FaArrowRight, FaGraduationCap } from "react-icons/fa";

export default function ReportMakerPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadTemplates() {
      try {
        const res = await fetch("/api/report-data");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setTemplates(data.templates || []);
      } catch (e) {
        setError("Templates load nahi ho paye");
      } finally {
        setLoading(false);
      }
    }
    loadTemplates();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-5 py-12">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <FaFileWord /> Training / Practical Report Maker
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-[#0B1F3F] mb-3">
          Apna Training Report{" "}
          <span className="text-orange-500">2 minute mein</span> banao
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          College, university, guide, HOD — sab details fill karo, payment
          karo, aur ready-made docx report seedha download karo.
        </p>
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="text-center text-red-600">{error}</p>
      )}

      {!loading && !error && templates.length === 0 && (
        <p className="text-center text-gray-500">
          Abhi koi report template available nahi hai. Jald hi aayega!
        </p>
      )}

      {!loading && !error && templates.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {templates.map((t) => (
            <div
              key={t.id}
              className="border border-gray-100 rounded-2xl p-6 flex flex-col justify-between hover:shadow-lg transition bg-white"
            >
              <div>
                <div className="w-11 h-11 rounded-xl bg-[#0B1F3F]/5 flex items-center justify-center text-[#0B1F3F] mb-4">
                  <FaGraduationCap size={18} />
                </div>
                <h3 className="font-semibold text-[#0B1F3F] mb-1">
                  {t.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Subject: {t.subject_name}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <span className="text-lg font-bold text-[#0B1F3F]">
                  ₹{t.price}
                </span>
                <Link
                  href={`/report-maker/new/${t.id}`}
                  className="flex items-center gap-2 bg-[#0B1F3F] hover:bg-[#132a52] text-white text-sm font-semibold px-4 py-2 rounded-full transition"
                >
                  Banao
                  <FaArrowRight size={11} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          href="/report-maker/my-reports"
          className="text-orange-500 font-medium hover:underline"
        >
          Mere purane reports dekhein →
        </Link>
      </div>
    </div>
  );
}