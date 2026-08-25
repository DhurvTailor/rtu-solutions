"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaDownload, FaFileWord } from "react-icons/fa";

const statusStyles = {
  pending: "bg-yellow-50 text-yellow-700",
  paid: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

export default function MyReportsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status !== "authenticated") return;

    async function loadReports() {
      try {
        const res = await fetch("/api/student-reports");
        const data = await res.json();
        setReports(Array.isArray(data) ? data : []);
      } catch (e) {
        // silently ignore, list stays empty
      } finally {
        setLoading(false);
      }
    }
    loadReports();
  }, [status, router]);

  if (status === "loading" || loading) {
    return <div className="max-w-4xl mx-auto px-5 py-16 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3F] mb-1">
        Mere Reports
      </h1>
      <p className="text-gray-500 mb-8">
        Aapke saare training reports yahan hain.
      </p>

      {reports.length === 0 ? (
        <div className="text-center border border-dashed border-gray-200 rounded-2xl py-16">
          <p className="text-gray-500 mb-4">Koi report abhi tak nahi banaya</p>
          <Link
            href="/report-maker"
            className="inline-flex items-center gap-2 bg-[#0B1F3F] hover:bg-[#132a52] text-white font-semibold px-5 py-2.5 rounded-full transition"
          >
            Naya Report Banao
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between border border-gray-100 rounded-2xl px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#0B1F3F]/5 flex items-center justify-center text-[#0B1F3F]">
                  <FaFileWord />
                </div>
                <div>
                  <p className="font-medium text-[#0B1F3F]">{r.template_title}</p>
                  <p className="text-xs text-gray-500">{r.college_name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${
                    statusStyles[r.payment_status] || "bg-gray-100 text-gray-600"
                  }`}
                >
                  {r.payment_status}
                </span>

                {r.payment_status === "paid" ? (
                  <a
                    href={`/api/reports/download?id=${r.id}`}
                    className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-full transition"
                  >
                    <FaDownload size={12} /> Download
                  </a>
                ) : (
                  <Link
                    href={`/report-maker/success/${r.id}`}
                    className="text-sm text-orange-500 font-medium hover:underline"
                  >
                    Status dekho
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}