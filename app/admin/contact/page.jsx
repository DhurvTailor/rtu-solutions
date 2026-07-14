"use client";

import { useEffect, useState } from "react";

export default function AdminContactPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setSubmissions(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const buildWhatsAppLink = (sub) => {
    const message = `Hi ${sub.name}, RTU Solutions team here. Regarding your query: "${sub.message.slice(0, 100)}" - `;
    return `https://wa.me/91${sub.phone}?text=${encodeURIComponent(message)}`;
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contact Submissions</h1>
      <div className="space-y-4">
        {submissions.map((sub) => (
          <div key={sub.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{sub.name} <span className="text-xs bg-gray-100 px-2 py-0.5 rounded ml-2 capitalize">{sub.role}</span></p>
                <p className="text-sm text-gray-500">{sub.phone} · {sub.email}</p>
                {sub.subject && <p className="text-sm font-medium mt-1">{sub.subject}</p>}
                <p className="text-sm mt-2">{sub.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(sub.created_at).toLocaleString("en-IN")}
                </p>
              </div>
              <a
                href={buildWhatsAppLink(sub)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap"
              >
                Reply on WhatsApp
              </a>
            </div>
          </div>
        ))}
        {submissions.length === 0 && (
          <p className="text-gray-500">Koi submission nahi hai abhi.</p>
        )}
      </div>
    </div>
  );
}