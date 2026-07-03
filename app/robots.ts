import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/checkout", "/profile"],
    },
    sitemap: "https://www.rtu-solutions.me/sitemap.xml",
  };
}