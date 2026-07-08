// import { MetadataRoute } from "next";

// export default function robots(): MetadataRoute.Robots {
//   return {
//     rules: {
//       userAgent: "*",
//       allow: "/",
//       disallow: ["/admin", "/api/", "/checkout", "/profile"],
//     },
//     sitemap: "https://www.rtu-solutions.me/sitemap.xml",
//   };
// }


import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/thumbnail", "/api/product-feed"],
        disallow: ["/admin", "/api/", "/checkout", "/profile"],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/api/thumbnail", "/api/product-feed"],
        disallow: ["/admin", "/checkout", "/profile"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/api/thumbnail"],
      },
    ],
    sitemap: "https://www.rtu-solutions.me/sitemap.xml",
  };
}