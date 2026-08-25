"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaCheckCircle, FaDownload, FaClock } from "react-icons/fa";

export default function ReportSuccessPage() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReport() {
    try {
      const res = await fetch(`/api/student-reports/${id}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReport(data);
    } catch (e) {
      setError("Report status load nahi ho paaya");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReport();
  }, [id]);

  // Agar generation abhi processing mein hai to thodi der baad phir check karo
  useEffect(() => {
    if (report && ["pending", "processing"].includes(report.generation_status)) {
      const timer = setTimeout(loadReport, 3000);
      return () => clearTimeout(timer);
    }
  }, [report]);

  if (loading) {
    return <div className="max-w-lg mx-auto px-5 py-16 text-center">Loading...</div>;
  }

  if (error || !report) {
    return (
      <div className="max-w-lg mx-auto px-5 py-16 text-center text-red-600">
        {error || "Report nahi mila"}
      </div>
    );
  }

  const isReady = report.generation_status === "done";
  const isFailed = report.generation_status === "failed";

  return (
    <div className="max-w-lg mx-auto px-5 py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-5">
        <FaCheckCircle size={28} />
      </div>

      <h1 className="text-2xl font-bold text-[#0B1F3F] mb-2">
        Payment Successful!
      </h1>
      <p className="text-gray-500 mb-8">
        Amount paid: <span className="font-semibold text-[#0B1F3F]">₹{report.amount_paid}</span>
      </p>

      <div className="border border-gray-100 rounded-2xl p-6">
        {isReady && (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Aapka report ready hai, download kar lo.
            </p>
            <a
              href={`/api/reports/download?id=${report.id}`}
              className="inline-flex items-center gap-2 bg-[#0B1F3F] hover:bg-[#132a52] text-white font-semibold px-6 py-3 rounded-xl transition"
            >
              <FaDownload /> Download Report (.docx)
            </a>
          </>
        )}

        {!isReady && !isFailed && (
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <FaClock className="animate-pulse text-orange-500" size={22} />
            <p className="text-sm">
              Aapka report generate ho raha hai, kripya kuch second wait karo...
            </p>
          </div>
        )}

        {isFailed && (
          <div className="text-red-600 text-sm">
            Report generate karne mein problem aayi. Download page par jaake retry ho jayega.
            <div className="mt-3">
              <a
                href={`/api/reports/download?id=${report.id}`}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-5 py-2.5 rounded-xl transition"
              >
                Retry Download
              </a>
            </div>
          </div>
        )}
      </div>

      <Link
        href="/report-maker/my-reports"
        className="inline-block text-orange-500 font-medium hover:underline mt-6"
      >
        Sabhi mere reports dekhein →
      </Link>
    </div>
  );
}