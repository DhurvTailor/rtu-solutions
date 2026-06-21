"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { FiClock, FiBookOpen } from "react-icons/fi";

function Badge({ item }) {
  if (!item.is_premium) {
    return (
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
        Free
      </span>
    );
  }
  return (
    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-50 text-[#E8700A] border border-[#E8700A]/20">
      Purchased
    </span>
  );
}

export default function DownloadHistoryPage() {
  const { status } = useSession();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/downloads/history")
      .then((res) => res.json())
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading...</p>
      </main>
    );
  }

  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-gray-500 text-center">
          Download history dekhne ke liye pehle login karo.
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#071A3D] mb-6 flex items-center gap-2">
          <FiClock /> Download History
        </h1>

        {loading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : history.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <FiBookOpen className="mx-auto mb-3 text-gray-300" size={28} />
            <p className="text-gray-400">Abhi tak koi PDF download nahi ki</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-gray-100 p-4 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[#071A3D] truncate">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {item.subject_name} ·{" "}
                    {new Date(item.downloaded_at).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Badge item={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}