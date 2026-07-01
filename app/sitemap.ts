// import { MetadataRoute } from "next";
// import db from "@/lib/db";

// function slugify(text: string) {
//   return text
//     .toLowerCase()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-")
//     .trim();
// }

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const [solutions]: any = await db.query(
//     "SELECT id, title, created_at FROM solutions"
//   );

//   const solutionUrls = solutions.map((sol: any) => ({
//     url: `https://rtu-solutions.vercel.app/solutions/${sol.id}-${slugify(sol.title)}`,
//     lastModified: sol.created_at,
//     changeFrequency: "weekly" as const,
//     priority: 0.8,
//   }));

//   return [
//     {
//       url: "https://rtu-solutions.vercel.app",
//       lastModified: new Date(),
//       changeFrequency: "daily",
//       priority: 1,
//     },
//     {
//       url: "https://rtu-solutions.vercel.app/about",
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.5,
//     },
//     ...solutionUrls,
//   ];
// }


import { MetadataRoute } from "next";

function slugify(text: string) {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .trim()
    .replace(/^-|-$/g, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // API se solutions fetch karo — direct DB nahi
    const res = await fetch("https://rtu-solutions.vercel.app/api/solutions", {
      next: { revalidate: 3600 },
    });

    const solutions = await res.json();

    const solutionUrls = Array.isArray(solutions)
      ? solutions.map((sol: any) => ({
          url: `https://rtu-solutions.vercel.app/solutions/${sol.id}-${slugify(sol.title)}`,
          lastModified: sol.created_at ? new Date(sol.created_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      : [];

    return [
      {
        url: "https://rtu-solutions.vercel.app",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: "https://rtu-solutions.vercel.app/about",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      },
      ...solutionUrls,
    ];
  } catch {
    return [
      {
        url: "https://rtu-solutions.vercel.app",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}