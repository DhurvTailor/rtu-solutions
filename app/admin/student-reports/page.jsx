"use client";

import { useState, useEffect } from "react";
import { FaDownload, FaRedo, FaFileWord } from "react-icons/fa";

const paymentStyles = {
  pending: "bg-yellow-50 text-yellow-700",
  paid: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

const generationStyles = {
  pending: "bg-gray-100 text-gray-600",
  processing: "bg-blue-50 text-blue-600",
  done: "bg-green-50 text-green-700",
  failed: "bg-red-50 text-red-700",
};

export default function AdminStudentReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState(null);
  const [error, setError] = useState("");

  async function loadReports() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/student-reports");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setReports(data);
    } catch (e) {
      setError("Reports load nahi ho paye");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  async function handleRetry(id) {
    setRetryingId(id);
    try {
      const res = await fetch(`/api/admin/student-reports/${id}/retry`, { method: "POST" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Retry fail hua");
      await loadReports();
    } catch (err) {
      alert(err.message);
    } finally {
      setRetryingId(null);
    }
  }

  const totalPaid = reports.filter((r) => r.payment_status === "paid").length;
  const totalRevenue = reports
    .filter((r) => r.payment_status === "paid")
    .reduce((sum, r) => sum + Number(r.amount_paid), 0);
  const failedGenerations = reports.filter(
    (r) => r.payment_status === "paid" && r.generation_status === "failed"
  ).length;

  return (
    <div className="space-y-6 p-2">
      <div>
        <h1 className="text-3xl font-bold text-[#142647]">Student Reports</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Sabhi students ke submitted training reports — payment aur generation status ke saath
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-2xl font-bold text-[#142647]">{loading ? "—" : reports.length}</p>
          <p className="text-xs text-gray-500 mt-1">Total Submissions</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-2xl font-bold text-green-600">
            {loading ? "—" : `₹${totalRevenue.toFixed(0)}`}
          </p>
          <p className="text-xs text-gray-500 mt-1">{totalPaid} Paid Orders</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-2xl font-bold text-red-600">{loading ? "—" : failedGenerations}</p>
          <p className="text-xs text-gray-500 mt-1">Failed Generations</p>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-100">
              <th className="px-5 py-3">Student</th>
              <th className="px-5 py-3">Template</th>
              <th className="px-5 py-3">College</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Generation</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-5 py-8 text-center text-gray-400">
                  Koi report submit nahi hui abhi tak
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-5 py-3">
                    <p className="font-medium text-[#142647]">{r.student_name}</p>
                    <p className="text-xs text-gray-400">{r.roll_no} · {r.user_email}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <FaFileWord className="text-blue-500 shrink-0" size={14} />
                      <span className="text-xs">{r.template_title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-600">{r.college_name}</td>
                  <td className="px-5 py-3 font-semibold text-[#142647]">₹{r.amount_paid}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${paymentStyles[r.payment_status] || "bg-gray-100"}`}>
                      {r.payment_status}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${generationStyles[r.generation_status] || "bg-gray-100"}`}>
                      {r.generation_status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-xs text-gray-400">
                    {new Date(r.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {r.generation_status === "done" && r.generated_report_blob_name && (
                        <a 
                          href={`/api/admin/student-reports/${r.id}/download`}
                          className="flex items-center gap-1.5 bg-[#142647] hover:bg-[#1d3766] text-white text-xs font-medium px-3 py-1.5 rounded-full transition"
                        >
                          <FaDownload size={11} /> Download
                        </a>
                      )}
                      {r.payment_status === "paid" && r.generation_status !== "done" && (
                        <button
                          onClick={() => handleRetry(r.id)}
                          disabled={retryingId === r.id}
                          className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-medium px-3 py-1.5 rounded-full transition disabled:opacity-60"
                        >
                          <FaRedo size={11} className={retryingId === r.id ? "animate-spin" : ""} />
                          {retryingId === r.id ? "Retrying..." : "Retry"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}