"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiLock, FiDownload, FiFileText } from "react-icons/fi";

export default function SolutionPreviewPage() {
  const { id } = useParams();
  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/solutions?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !Array.isArray(data) && data.id) setSolution(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </main>
    );
  }

  if (!solution) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Solution nahi mila</p>
      </main>
    );
  }

  const price = parseFloat(solution.price || 0);

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
        {/* ── PDF preview — page khulte hi seedha dikhta hai, koi extra click nahi ── */}
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

        {/* Details + Buy */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-6">
          <h1 className="text-xl font-bold text-[#071A3D]">{solution.title}</h1>
          <p className="text-sm text-gray-400 mt-1">{solution.subject_name}</p>
          {solution.description && (
            <p className="text-sm text-gray-600 mt-3">{solution.description}</p>
          )}

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