// import SolutionDetailClient from "./SolutionDetailClient";

// function slugify(text) {
//   if (!text) return "";
//   return text
//     .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
//     .replace(/[–—]/g, "-")
//     .toLowerCase()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-{2,}/g, "-")
//     .trim()
//     .replace(/^-|-$/g, "");
// }

// async function getSolution(id) {
//   try {
//     const res = await fetch(
//       `https://www.rtu-solutions.me/api/solutions?id=${id}`,
//       { cache: "no-store" }
//     );
//     if (!res.ok) return null;
//     const data = await res.json();
//     if (!data || !data.id) return null;
//     return data;
//   } catch {
//     return null;
//   }
// }

// export async function generateMetadata({ params }) {
//   const { id: idParam } = await params;
//   const numericId = parseInt(String(idParam).split("-")[0], 10);
//   const solution = await getSolution(numericId);

//   if (!solution) {
//     return { title: "Solution Not Found | RTU Solutions" };
//   }

//   const title = `${solution.title} | RTU Solutions`;
//   const description = solution.description
//     ? solution.description.slice(0, 155)
//     : `${solution.title} - RTU notes. RTU Solutions par best study material.`;

//   const imageUrl = solution.thumbnail_blob_name
//     ? `/api/thumbnail?id=${solution.id}`
//     : "https://www.rtu-solutions.me/logo.jpg";

//   const canonicalUrl = `https://www.rtu-solutions.me/solutions/${solution.id}-${slugify(solution.title)}`;

//   return {
//     title,
//     description,
//     alternates: { canonical: canonicalUrl },
//     openGraph: {
//       title,
//       description,
//       url: canonicalUrl,
//       siteName: "RTU Solutions",
//       images: [{ url: imageUrl, width: 800, height: 450 }],
//       locale: "en_IN",
//       type: "website",
//     },
//     twitter: {
//       card: "summary_large_image",
//       title,
//       description,
//       images: [imageUrl],
//     },
//   };
// }

// export default async function SolutionPage({ params }) {
//   const { id: idParam } = await params;
//   const numericId = parseInt(String(idParam).split("-")[0], 10);
//   const solution = await getSolution(numericId);

//   if (!solution) {
//     return (
//       <main className="min-h-screen flex items-center justify-center">
//         <p className="text-red-500 text-sm">Solution nahi mila (id: {numericId})</p>
//       </main>
//     );
//   }

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "Product",
//     name: solution.title,
//     description: solution.description || solution.title,
//     image: solution.thumbnail_blob_name
//       ? `https://www.rtu-solutions.me/api/thumbnail?id=${solution.id}`     
//       : "https://www.rtu-solutions.me/logo.jpg",
//     brand: { "@type": "Brand", name: "RTU Solutions" },
//     offers: {
//       "@type": "Offer",
//       price: solution.is_premium ? parseFloat(solution.price) : 0,
//       priceCurrency: "INR",
//       availability: "https://schema.org/InStock",
//       url: `https://www.rtu-solutions.me/solutions/${solution.id}-${slugify(solution.title)}`,
//     },
//   };

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />
//       <SolutionDetailClient solution={solution} />
//     </>
//   );
// }



import SolutionDetailClient from "./SolutionDetailClient";

function slugify(text) {
  if (!text) return "";

  return String(text)
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/[–—]/g, "-")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .trim()
    .replace(/^-|-$/g, "");
}

/**
 * Description se HTML tags remove karke
 * clean plain text banata hai.
 *
 * Example:
 * <h3>Training Report</h3>
 * <p>Hello</p>
 *
 * becomes:
 * Training Report Hello
 */
function stripHtml(html) {
  if (!html) return "";

  return String(html)
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<\/div>/gi, " ")
    .replace(/<\/li>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function getSolution(id) {
  try {
    if (!id || Number.isNaN(Number(id))) {
      return null;
    }

    const res = await fetch(
      `https://www.rtu-solutions.me/api/solutions?id=${encodeURIComponent(id)}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (!data || !data.id) {
      return null;
    }

    return data;
  } catch (error) {
    console.error("Failed to fetch solution:", error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { id: idParam } = await params;

  const numericId = parseInt(
    String(idParam).split("-")[0],
    10
  );

  if (Number.isNaN(numericId)) {
    return {
      title: "Solution Not Found | RTU Solutions",
      description: "The requested solution could not be found.",
    };
  }

  const solution = await getSolution(numericId);

  if (!solution) {
    return {
      title: "Solution Not Found | RTU Solutions",
      description: "The requested solution could not be found.",
    };
  }

  const cleanDescription = stripHtml(solution.description);

  const title = `${solution.title} | RTU Solutions`;

  const description = cleanDescription
    ? cleanDescription.slice(0, 155)
    : `${solution.title} - RTU study material, notes and solutions on RTU Solutions.`;

  const imageUrl = solution.thumbnail_blob_name
    ? `https://www.rtu-solutions.me/api/thumbnail?id=${solution.id}`
    : "https://www.rtu-solutions.me/logo.jpg";

  const canonicalUrl =
    `https://www.rtu-solutions.me/solutions/` +
    `${solution.id}-${slugify(solution.title)}`;

  return {
    title,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "RTU Solutions",
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 450,
          alt: solution.title,
        },
      ],
      locale: "en_IN",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SolutionPage({ params }) {
  const { id: idParam } = await params;

  const numericId = parseInt(
    String(idParam).split("-")[0],
    10
  );

  if (Number.isNaN(numericId)) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-500 text-sm text-center">
          Invalid solution ID.
        </p>
      </main>
    );
  }

  const solution = await getSolution(numericId);

  if (!solution) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <p className="text-red-500 text-sm text-center">
          Solution nahi mila (id: {numericId})
        </p>
      </main>
    );
  }

  const cleanDescription = stripHtml(solution.description);

  const canonicalUrl =
    `https://www.rtu-solutions.me/solutions/` +
    `${solution.id}-${slugify(solution.title)}`;

  const imageUrl = solution.thumbnail_blob_name
    ? `https://www.rtu-solutions.me/api/thumbnail?id=${solution.id}`
    : "https://www.rtu-solutions.me/logo.jpg";

  const price = solution.is_premium
    ? Number.parseFloat(solution.price || 0)
    : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: solution.title,

    description:
      cleanDescription || solution.title,

    image: imageUrl,

    brand: {
      "@type": "Brand",
      name: "RTU Solutions",
    },

    offers: {
      "@type": "Offer",

      price: price.toFixed(2),

      priceCurrency: "INR",

      availability:
        "https://schema.org/InStock",

      url: canonicalUrl,

      seller: {
        "@type": "Organization",
        name: "RTU Solutions",
        url: "https://www.rtu-solutions.me",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <SolutionDetailClient
        solution={solution}
      />
    </>
  );
}