// "use client";

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { FiLock, FiDownload, FiFileText } from "react-icons/fi";

// export default function SolutionPreviewPage() {
//   const { id } = useParams();
//   const [solution, setSolution] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (!id) return;
//     fetch(`/api/solutions?id=${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data && !Array.isArray(data) && data.id) setSolution(data);
//       })
//       .finally(() => setLoading(false));
//   }, [id]);

//   if (loading) {
//     return (
//       <main className="min-h-screen flex items-center justify-center">
//         <p className="text-gray-400 text-sm">Loading...</p>
//       </main>
//     );
//   }

//   if (!solution) {
//     return (
//       <main className="min-h-screen flex items-center justify-center">
//         <p className="text-red-500">Solution nahi mila</p>
//       </main>
//     );
//   }

//   const price = parseFloat(solution.price || 0);

//   return (
//     <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6">
//       <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">
//         {/* ── PDF preview — page khulte hi seedha dikhta hai, koi extra click nahi ── */}
//         <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
//           {solution.preview_blob_name ? (
//             <iframe
//               src={`/api/preview?id=${solution.id}`}
//               className="w-full h-150"
//               title="PDF preview"
//             />
//           ) : (
//             <div className="h-100 flex flex-col items-center justify-center text-gray-400">
//               <FiFileText size={28} className="mb-2" />
//               <p>Is solution ke liye preview available nahi hai</p>
//             </div>
//           )}
//         </div>

//         {/* Details + Buy */}
//         <div className="bg-white rounded-2xl border border-gray-100 p-6 h-fit sticky top-6">
//           <h1 className="text-xl font-bold text-[#071A3D]">{solution.title}</h1>
//           <p className="text-sm text-gray-400 mt-1">{solution.subject_name}</p>
//           {solution.description && (
//             <p className="text-sm text-gray-600 mt-3">{solution.description}</p>
//           )}

//           <div className="mt-6 pt-6 border-t">
//             {solution.is_premium ? (
//               <>
//                 <p className="text-2xl font-bold text-[#E8700A] mb-3">
//                   ₹{price.toFixed(0)}
//                 </p>
//                 <a 
//                   href={`/checkout?solution_id=${solution.id}`}
//                   className="w-full inline-flex items-center justify-center gap-2 bg-[#071A3D] hover:bg-[#0d2a5e] text-white py-3 rounded-xl font-semibold transition"
//                 >
//                   <FiLock size={15} /> Buy & Download
//                 </a>
//               </>
//             ) : (
//               <a
//                 href={`/api/download?id=${solution.id}`}
//                 className="w-full inline-flex items-center justify-center gap-2 bg-[#E8700A] hover:bg-[#cf6209] text-white py-3 rounded-xl font-semibold transition"
//               >
//                 <FiDownload size={15} /> Download Free
//               </a>
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";
import { getSolutionById } from "@/services/solutionService";
import SolutionDetailClient from "./SolutionDetailClient";

// ── slugify pehle define karo — dono functions use karte hain ──
function slugify(text) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")   // special chars hatao
    .replace(/\s+/g, "-")        // spaces ko dash
    .replace(/-{2,}/g, "-")      // double dash ko single dash
    .trim()
    .replace(/^-|-$/g, "");      // start/end ke dashes hatao
}

export async function generateMetadata({ params }) {
  const idParam = await params.id;
  const numericId = String(idParam).split("-")[0];

  const solution = await getSolutionById(numericId);

  if (!solution) {
    return { title: "Solution Not Found | RTU Solutions" };
  }

  const title = `${solution.title} | RTU Solutions`;
  const description = solution.description
    ? solution.description.slice(0, 155)
    : `${solution.title} - RTU ${solution.subject_name || ""} notes, free download. RTU Solutions par best quality study material.`;

  const imageUrl = solution.thumbnail_blob_name
    ? `https://rtu-solutions.vercel.app/api/thumbnail?id=${solution.id}`
    : "https://rtu-solutions.vercel.app/logo.jpg";

  const canonicalUrl = `https://rtu-solutions.vercel.app/solutions/${solution.id}-${slugify(solution.title)}`;

  return {
    title,
    description,
    keywords: [
      "RTU",
      solution.subject_name,
      solution.branch_name,
      solution.solution_type,
      "RTU notes",
      "RTU PYQ",
      `RTU semester ${solution.semester_number}`,
    ].filter(Boolean).join(", "),
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "RTU Solutions",
      images: [{ url: imageUrl, width: 800, height: 450 }],
      locale: "en_IN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function SolutionPage({ params }) {
  const idParam = await params.id;
  const numericId = String(idParam).split("-")[0];

  const solution = await getSolutionById(numericId);

  if (!solution) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Solution nahi mila</p>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: solution.title,
    description: solution.description || solution.title,
    image: solution.thumbnail_blob_name
      ? `https://rtu-solutions.vercel.app/api/thumbnail?id=${solution.id}`
      : "https://rtu-solutions.vercel.app/logo.jpg",
    brand: {
      "@type": "Brand",
      name: "RTU Solutions",
    },
    offers: {
      "@type": "Offer",
      price: solution.is_premium ? parseFloat(solution.price) : 0,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: `https://rtu-solutions.vercel.app/solutions/${solution.id}-${slugify(solution.title)}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SolutionDetailClient solution={solution} />
    </>
  );
}