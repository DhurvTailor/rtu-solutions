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

async function getSolution(id) {
  try {
    const res = await fetch(
      `https://rtu-solutions.vercel.app/api/solutions?id=${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data || !data.id) return null;
    return data;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const idParam = params.id;
  const numericId = parseInt(String(idParam).split("-")[0], 10);
  const solution = await getSolution(numericId);

  if (!solution) {
    return { title: "Solution Not Found | RTU Solutions" };
  }

  const title = `${solution.title} | RTU Solutions`;
  const description = solution.description
    ? solution.description.slice(0, 155)
    : `${solution.title} - RTU notes. RTU Solutions par best study material.`;

  const imageUrl = solution.thumbnail_blob_name
    ? `https://rtu-solutions.vercel.app/api/thumbnail?id=${solution.id}`
    : "https://rtu-solutions.vercel.app/logo.jpg";

  const canonicalUrl = `https://rtu-solutions.vercel.app/solutions/${solution.id}-${slugify(solution.title)}`;

  return {
    title,
    description,
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
  const idParam = params.id;
  const numericId = parseInt(String(idParam).split("-")[0], 10);
  const solution = await getSolution(numericId);

  if (!solution) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm">Solution nahi mila (id: {numericId})</p>
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
    brand: { "@type": "Brand", name: "RTU Solutions" },
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