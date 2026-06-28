"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaFilePdf, FaDownload, FaCrown,
  FaArrowLeft, FaShoppingBag, FaBookOpen,
} from "react-icons/fa";
import { FiClock } from "react-icons/fi";

const TYPE_LABELS = {
  complete_notes: "Complete Notes",
  important_questions: "Important Questions",
  pyq_solutions: "PYQ Solutions",
  assignment: "Assignment",
};

function PurchaseCard({ item }) {
  return (
    <div className="bg-[#0d2454] border border-orange-500/15 rounded-2xl overflow-hidden flex gap-0 hover:border-orange-500/40 transition-all">

      {/* Thumbnail */}
      <div className="w-28 sm:w-36 shrink-0 bg-[#071A3D]">
        {item.thumbnail_blob_name ? (
          <img
            src={`/api/thumbnail?id=${item.solution_id}`}
            alt={item.title}
            className="w-full h-full object-cover"
            style={{ minHeight: "90px" }}
          />
        ) : (
          <div className="w-full h-full min-h-[90px] flex items-center justify-center">
            <FaFilePdf size={24} className="text-gray-600" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
        <div>
          {/* Type badge */}
          <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 border border-orange-500/20 mb-2">
            {TYPE_LABELS[item.solution_type] || item.solution_type}
          </span>

          <p className="font-bold text-white text-sm leading-snug line-clamp-2 mb-1">
            {item.title}
          </p>

          <div className="flex flex-wrap gap-x-2 gap-y-0.5">
            {item.subject_name && (
              <span className="text-xs text-gray-400">{item.subject_name}</span>
            )}
            {item.branch_name && (
              <span className="text-xs text-gray-500">· {item.branch_name}</span>
            )}
            {item.semester_number && (
              <span className="text-xs text-gray-500">· Sem {item.semester_number}</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-green-400">
              ₹{parseFloat(item.amount_paid).toFixed(0)} paid
            </span>
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <FiClock size={10} />
              {new Date(item.purchased_at).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <a
            href={`/api/download?id=${item.solution_id}`}
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition"
          >
            <FaDownload size={10} />
            Download
          </a>
        </div>
      </div>
    </div>
  );
}

export default function MyPurchasesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/purchases/my")
      .then((r) => r.json())
      .then((data) => setPurchases(Array.isArray(data) ? data : []))
      .catch(() => setPurchases([]))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050f24] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050f24] py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">

        {/* Back */}
        <Link
          href="/profile"
          className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition mb-6 text-sm"
        >
          <FaArrowLeft size={12} />
          Back to Profile
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaCrown className="text-orange-400" />
            My Purchases
          </h1>
          {purchases.length > 0 && (
            <span className="text-xs font-semibold text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
              {purchases.length} PDF{purchases.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Loading skeleton */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0d2454] rounded-2xl h-24 animate-pulse border border-white/5" />
            ))}
          </div>

        /* Empty state */
        ) : purchases.length === 0 ? (
          <div className="bg-[#0d2454] border border-orange-500/10 rounded-2xl p-14 text-center">
            <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaShoppingBag size={22} className="text-orange-400" />
            </div>
            <p className="font-bold text-white mb-1">Koi purchase nahi mili</p>
            <p className="text-sm text-gray-400 mb-5">
              Abhi tak koi premium PDF nahi kharida
            </p>
            <Link
              href="/#notes-section"
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition"
            >
              <FaBookOpen size={13} />
              PDFs Browse Karo
            </Link>
          </div>

        /* List */
        ) : (
          <div className="space-y-3">
            {purchases.map((item) => (
              <PurchaseCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}