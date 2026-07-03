"use client";

import { useState } from "react";
import { FiLock, FiDownload, FiFileText, FiShare2, FiCopy, FiCheck } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function SolutionDetailClient({ solution }) {
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const price = parseFloat(solution.price || 0);
  const shareUrl = `https://www.rtu-solutions.me/solutions/${solution.id}-${slugify(solution.title)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copy ho gaya!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy nahi hua, dobara try karo");
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: solution.title,
          text: `Check out ${solution.title} on RTU Solutions`,
          url: shareUrl,
        });
      } catch {
        // user ne cancel kiya — ignore
      }
    } else {
      setShareOpen((v) => !v);
    }
  };

  const handleWhatsappShare = () => {
    const text = encodeURIComponent(`${solution.title} - RTU Solutions\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* PDF preview */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {solution.preview_blob_name ? (
            <iframe
              src={`/api/preview?id=${solution.id}`}
              className="w-full h-150"
              title="PDF preview"
            />
          ) : (
            <div className="h-100 flex flex-col items-center justify-center text-gray-400">
              <FiFileText size={28} className="mb-2" />
              <p>Is solution ke liye preview available nahi hai</p>
            </div>
          )}
        </div>

        {/* Details + Buy + Share */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-6">

          <div className="flex items-start justify-between gap-2">
            <h1 className="text-xl font-bold text-[#071A3D]">{solution.title}</h1>

            {/* Share button */}
            <div className="relative shrink-0">
              <button
                onClick={handleNativeShare}
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition shrink-0"
              >
                <FiShare2 size={15} className="text-gray-500" />
              </button>

              {/* Fallback share dropdown (desktop) */}
              {shareOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={() => { handleCopyLink(); setShareOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm text-gray-700"
                  >
                    {copied ? <FiCheck size={15} className="text-green-500" /> : <FiCopy size={15} />}
                    {copied ? "Copied!" : "Copy link"}
                  </button>
                  <button
                    onClick={() => { handleWhatsappShare(); setShareOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-sm text-gray-700 border-t border-gray-100"
                  >
                    <FaWhatsapp size={15} className="text-green-500" />
                    Share on WhatsApp
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-sm text-gray-400 mt-1">{solution.subject_name}</p>

          {solution.description && (
            <p className="text-sm text-gray-600 mt-3">{solution.description}</p>
          )}

          {/* Quick copy link row */}
          <button
            onClick={handleCopyLink}
            className="mt-4 w-full flex items-center justify-between gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-500 hover:bg-gray-100 transition"
          >
            <span className="truncate">{shareUrl}</span>
            {copied ? (
              <FiCheck size={14} className="text-green-500 shrink-0" />
            ) : (
              <FiCopy size={14} className="shrink-0" />
            )}
          </button>

          <div className="mt-6 pt-6 border-t">
            {solution.is_premium ? (
              <>
                <p className="text-2xl font-bold text-[#E8700A] mb-3">
                  ₹{price.toFixed(0)}
                </p>
                <a
                  href={`/checkout?solution_id=${solution.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#071A3D] hover:bg-[#0d2a5e] text-white py-3 rounded-xl font-semibold transition"
                >
                  <FiLock size={15} /> Buy & Download
                </a>
              </>
            ) : (
              <a
                href={`/api/download?id=${solution.id}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E8700A] hover:bg-[#cf6209] text-white py-3 rounded-xl font-semibold transition"
              >
                <FiDownload size={15} /> Download Free
              </a>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}