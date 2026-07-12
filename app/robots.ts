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
        userAgent: "Googlebot",
        allow: ["/"],
        disallow: ["/admin", "/checkout", "/profile", "/api/"],
      },
      {
        userAgent: "Googlebot-Image",
        allow: ["/", "/api/thumbnail"],
        disallow: ["/admin", "/checkout", "/profile"],
      },
      {
        userAgent: "Storebot-Google",
        allow: ["/", "/api/thumbnail", "/api/product-feed"],
        disallow: ["/admin", "/checkout", "/profile"],
      },
      {
        userAgent: "*",
        allow: ["/"],
        disallow: ["/admin", "/checkout", "/profile", "/api/"],
      },
    ],
    sitemap: "https://www.rtu-solutions.me/sitemap.xml",
  };
}