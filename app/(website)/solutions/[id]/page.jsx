
import { getSolutionById } from "../../../../services/solutionService.js";
import SolutionDetailClient from "./SolutionDetailClient";

function slugify(text) {
  if (!text) return "";
  return text
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/[–—]/g, "-")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .trim()
    .replace(/^-|-$/g, "");
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