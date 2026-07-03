

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
    const res = await fetch("https://www.rtu-solutions.me/api/solutions", {
      next: { revalidate: 3600 },
    });

    const solutions = await res.json();

    const solutionUrls = Array.isArray(solutions)
      ? solutions.map((sol: any) => ({
          url: `https://www.rtu-solutions.me/solutions/${sol.id}-${slugify(sol.title)}`,
          lastModified: sol.created_at ? new Date(sol.created_at) : new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }))
      : [];

    return [
      {
        url: "https://www.rtu-solutions.me",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: "https://www.rtu-solutions.me/about",
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      },
      ...solutionUrls,
    ];
  } catch {
    return [
      {
        url: "https://www.rtu-solutions.me",
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}