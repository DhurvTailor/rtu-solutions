

// import { MetadataRoute } from "next";

// function slugify(text: string) {
//   if (!text) return "";
//   return text
//     .toLowerCase()
//     .replace(/[^\w\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-{2,}/g, "-")
//     .trim()
//     .replace(/^-|-$/g, "");
// }

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   try {
//     // API se solutions fetch karo — direct DB nahi
//     const res = await fetch("https://www.rtu-solutions.me/api/solutions", {
//       next: { revalidate: 3600 },
//     });

//     const solutions = await res.json();

//     const solutionUrls = Array.isArray(solutions)
//       ? solutions.map((sol: any) => ({
//           url: `https://www.rtu-solutions.me/solutions/${sol.id}-${slugify(sol.title)}`,
//           lastModified: sol.created_at ? new Date(sol.created_at) : new Date(),
//           changeFrequency: "weekly" as const,
//           priority: 0.8,
//         }))
//       : [];

//     return [
//       {
//         url: "https://www.rtu-solutions.me",
//         lastModified: new Date(),
//         changeFrequency: "daily",
//         priority: 1,
//       },
//       {
//         url: "https://www.rtu-solutions.me/about",
//         lastModified: new Date(),
//         changeFrequency: "monthly",
//         priority: 0.5,
//       },
//       ...solutionUrls,
//     ];
//   } catch {
//     return [
//       {
//         url: "https://www.rtu-solutions.me",
//         lastModified: new Date(),
//         changeFrequency: "daily",
//         priority: 1,
//       },
//     ];
//   }
// }




import { MetadataRoute } from "next";

const BASE_URL = "https://www.rtu-solutions.me";

function slugify(text: string): string {
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
  // ─── 1. Static pages — High priority ─────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/rtu-solutions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cgpa`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // ─── 2. Blog ──────────────────────────────────────────────────────────────
  let blogUrls: MetadataRoute.Sitemap = [];
  try {
    const blogRes = await fetch(`${BASE_URL}/api/blogs`, {
      next: { revalidate: 3600 },
    });

    if (blogRes.ok) {
      const blogs = await blogRes.json();

      blogUrls = [
        {
          url: `${BASE_URL}/blog`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.8,
        },
        ...(Array.isArray(blogs)
          ? blogs.map((blog: any) => ({
              url: `${BASE_URL}/blog/${blog.slug ?? slugify(blog.title)}`,
              lastModified: blog.updated_at
                ? new Date(blog.updated_at)
                : blog.created_at
                ? new Date(blog.created_at)
                : new Date(),
              changeFrequency: "weekly" as const,
              priority: 0.7,
            }))
          : []),
      ];
    } else {
      // Blog listing page at minimum
      blogUrls = [
        {
          url: `${BASE_URL}/blog`,
          lastModified: new Date(),
          changeFrequency: "daily",
          priority: 0.8,
        },
      ];
    }
  } catch {
    blogUrls = [
      {
        url: `${BASE_URL}/blog`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.8,
      },
    ];
  }

  // ─── 3. Solutions (products) ──────────────────────────────────────────────
  let solutionUrls: MetadataRoute.Sitemap = [];
  try {
    const solRes = await fetch(`${BASE_URL}/api/solutions`, {
      next: { revalidate: 3600 },
    });

    if (solRes.ok) {
      const solutions = await solRes.json();

      solutionUrls = Array.isArray(solutions)
        ? solutions.map((sol: any) => ({
            url: `${BASE_URL}/solutions/${sol.id}-${slugify(sol.title)}`,
            lastModified: sol.updated_at
              ? new Date(sol.updated_at)
              : sol.created_at
              ? new Date(sol.created_at)
              : new Date(),
            changeFrequency: "weekly" as const,
            priority: 0.85, // Products deserve higher priority — ye revenue pages hain
          }))
        : [];
    }
  } catch {
    // Solutions fetch fail — silently skip, static pages still return
  }

  // ─── 4. Utility / Tool pages ──────────────────────────────────────────────
  const utilityPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/advertisement`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // ─── 5. Legal pages ───────────────────────────────────────────────────────
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // ─── EXCLUDED from sitemap (intentional) ─────────────────────────────────
  // /checkout         → transactional, no SEO value, Google penalizes
  // /profile          → authenticated pages, personal data
  // /profile/student-info
  // /profile/purchases
  // /profile/history
  // /api/*            → backend routes

  return [
    ...staticPages,
    ...blogUrls,
    ...solutionUrls,
    ...utilityPages,
    ...legalPages,
  ];
}