"use client";

import { useEffect, useState } from "react";

interface ContactSubmission {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: "student" | "teacher" | "other";
  subject: string | null;
  message: string;
  status: "pending" | "replied";
  created_at: string;
}

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/contact");
      if (!res.ok) throw new Error("Failed to load submissions");
      const data: ContactSubmission[] = await res.json();
      setSubmissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const buildWhatsAppLink = (sub: ContactSubmission) => {
    const message = `Hi ${sub.name}, RTU Solutions team here. Regarding your query: "${sub.message.slice(0, 100)}" - `;
    return `https://wa.me/91${sub.phone}?text=${encodeURIComponent(message)}`;
  };

  const roleBadgeColor: Record<ContactSubmission["role"], string> = {
    student: "bg-blue-50 text-blue-700",
    teacher: "bg-purple-50 text-purple-700",
    other: "bg-gray-100 text-gray-700",
  };

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading submissions...</div>;
  }

  if (error) {
    return <div className="p-6 text-sm text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Contact Submissions</h1>
          <p className="text-sm text-gray-500 mt-1">
            {submissions.length} total {submissions.length === 1 ? "query" : "queries"}
          </p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-xl p-10 text-center text-sm text-gray-500">
          Koi submission nahi hai abhi.
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-gray-900">{sub.name}</p>
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full capitalize ${roleBadgeColor[sub.role]}`}>
                      {sub.role}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {sub.phone} · {sub.email}
                  </p>
                  {sub.subject && (
                    <p className="text-sm font-medium text-gray-800 mt-2">{sub.subject}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">{sub.message}</p>
                  <p className="text-[11px] text-gray-400 mt-2">
                    {new Date(sub.created_at).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div> 
 
                  <a
                  href={buildWhatsAppLink(sub)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 inline-flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  Reply on WhatsApp
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}