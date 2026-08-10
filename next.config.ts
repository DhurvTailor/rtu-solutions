// import type { NextConfig } from "next";
// const nextConfig: NextConfig = {
//   allowedDevOrigins: ["192.168.0.10:3000", "localhost:3000"],

//       images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: "lh3.googleusercontent.com",
//       },
//     ],
//   },
 
// };
// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.10:3000", "localhost:3000"],

  images: {
    formats: ["image/avif", "image/webp"],  // ← sirf ye line add ki
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;