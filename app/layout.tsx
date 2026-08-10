import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "../lib/utils";
import AuthProvider from "../src/components/AuthProvider";
import RouteLoadingProvider from "../src/components/Routeloadingprovider";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rtu-solutions.me"),

  title: {
    default: "RTU Solutions | Engineering Notes, PYQ & Study Material",
    template: "%s | RTU Solutions",
  },

  description:
    "RTU Notes, PYQ Solutions & Video Lectures for all branches and semesters. Free and premium study material for Rajasthan Technical University students.",

  keywords:
    "RTU notes, RTU PYQ, RTU solutions, Rajasthan Technical University, RTU study material, RTU important questions, RTU previous year papers, RTU engineering notes",

  alternates: {
    canonical: "https://www.rtu-solutions.me",
  },

  openGraph: {
    title: "RTU Solutions | Engineering Notes, PYQ & Study Material",
    description:
      "RTU Notes, PYQ Solutions & Video Lectures for all branches and semesters. Free and premium study material for RTU students.",
    url: "https://www.rtu-solutions.me",
    siteName: "RTU Solutions",
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "RTU Solutions | Engineering Notes, PYQ & Study Material",
    description:
      "RTU Notes, PYQ Solutions & Video Lectures for all branches and semesters. Free and premium study material for RTU students.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  icons: {
    icon: "/favicon.ico",
  },

  verification: {
    google: "OpInaWck_WbQs1THL2bXjm6RsNLvbVPaGhYqmJd14p4",
  },
};

const schemaData = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "RTU Solutions",
  "url": "https://www.rtu-solutions.me",
  "description":
    "RTU Notes, PYQ Solutions & Video Lectures for all engineering branches and semesters.",
  "sameAs": [
    "https://instagram.com/rtu_solutions",
    "https://youtube.com/channel/UCxZxyvd-Gy9NRvsTRuncSvA",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable
      )}
    >
      <head>
        <meta name="google-adsense-account" content="ca-pub-4312176557759808" />
      </head>
      <body className="bg-white text-black flex flex-col min-h-screen">
        <AuthProvider>
          <RouteLoadingProvider>{children}</RouteLoadingProvider>
        </AuthProvider>

        {/* Schema — beforeInteractive: Google ko SSR mein milega */}
        <Script
          id="schema-org"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />

        {/* Razorpay — lazyOnload: sirf checkout pe chahiye */}
        <Script
          id="razorpay"
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="lazyOnload"
        />

        {/* AdSense — lazyOnload: LCP block na kare */}
        <Script
          id="adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4312176557759808"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}

// import type { Metadata } from "next";
// import { Geist, Geist_Mono, Figtree } from "next/font/google";
// import Script from "next/script";
// import "./globals.css";
// import { cn } from "../lib/utils";
// import AuthProvider from "../src/components/AuthProvider";

// const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// export const metadata: Metadata = {
//   metadataBase: new URL("https://www.rtu-solutions.me"),

//   title: {
//     default: "RTU Solutions | Engineering Notes, PYQ & Study Material",
//     template: "%s | RTU Solutions",
//   },

//   description:
//     "RTU Notes, PYQ Solutions & Video Lectures for all branches and semesters. Free and premium study material for Rajasthan Technical University students.",

//   keywords:
//     "RTU notes, RTU PYQ, RTU solutions, Rajasthan Technical University, RTU study material, RTU important questions, RTU previous year papers, RTU engineering notes",

//   alternates: {
//     canonical: "https://www.rtu-solutions.me",
//   },

//   openGraph: {
//     title: "RTU Solutions | Engineering Notes, PYQ & Study Material",
//     description:
//       "RTU Notes, PYQ Solutions & Video Lectures for all branches and semesters. Free and premium study material for RTU students.",
//     url: "https://www.rtu-solutions.me",
//     siteName: "RTU Solutions",
//     locale: "en_IN",
//     type: "website",
//   },

//   twitter: {
//     card: "summary_large_image",
//     title: "RTU Solutions | Engineering Notes, PYQ & Study Material",
//     description:
//       "RTU Notes, PYQ Solutions & Video Lectures for all branches and semesters. Free and premium study material for RTU students.",
//   },

//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },

//   icons: {
//     icon: "/favicon.ico",
//   },

//   verification: {
//     google: "OpInaWck_WbQs1THL2bXjm6RsNLvbVPaGhYqmJd14p4",
//   },
// };

// const schemaData = {
//   "@context": "https://schema.org",
//   "@type": "EducationalOrganization",
//   "name": "RTU Solutions",
//   "url": "https://www.rtu-solutions.me",
//   "description":
//     "RTU Notes, PYQ Solutions & Video Lectures for all engineering branches and semesters.",
//   "sameAs": [
//     "https://instagram.com/rtu_solutions",
//     "https://youtube.com/channel/UCxZxyvd-Gy9NRvsTRuncSvA",
//   ],
// };

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html
//       lang="en"
//       className={cn(
//         geistSans.variable,
//         geistMono.variable,
//         "font-sans",
//         figtree.variable
//       )}
//     >
//       <head>
//         <meta name="google-adsense-account" content="ca-pub-4312176557759808" />
//       </head>
//       <body className="bg-white text-black flex flex-col min-h-screen">
//         <AuthProvider>{children}</AuthProvider>

//         {/* Schema — beforeInteractive: Google ko SSR mein milega */}
//         <Script
//           id="schema-org"
//           type="application/ld+json"
//           strategy="beforeInteractive"
//           dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
//         />

//         {/* Razorpay — lazyOnload: sirf checkout pe chahiye */}
//         <Script
//           id="razorpay"
//           src="https://checkout.razorpay.com/v1/checkout.js"
//           strategy="lazyOnload"
//         />

//         {/* AdSense — lazyOnload: LCP block na kare */}
//         <Script
//           id="adsense"
//           src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4312176557759808"
//           strategy="lazyOnload"
//           crossOrigin="anonymous"
//         />
//       </body>
//     </html>
//   );
// }


// import type { Metadata } from "next";
// import { Geist, Geist_Mono, Figtree } from "next/font/google";
// import "./globals.css";
// import { cn } from "../lib/utils";
// import AuthProvider from "../src/components/AuthProvider";

// const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// export const metadata: Metadata = {
//   metadataBase: new URL("https://www.rtu-solutions.me"),

//   title: {
//     default: "RTU Solutions | RTU Notes, PYQ & Study Material",
//     template: "%s | RTU Solutions",
//   },

//   description:
//     "RTU Notes, PYQ Solutions & Video Lectures for all branches and semesters. Free and premium study material for Rajasthan Technical University students.",

//   keywords:
//     "RTU notes, RTU PYQ, RTU solutions, Rajasthan Technical University, RTU study material, RTU important questions, RTU previous year papers",

//   alternates: {
//     canonical: "https://www.rtu-solutions.me",
//   },

//   openGraph: {
//     title: "RTU Solutions | RTU Notes, PYQ & Study Material",
//     description:
//       "RTU Notes, PYQ Solutions & Video Lectures for all branches and semesters. Free and premium study material for RTU students.",
//     url: "https://www.rtu-solutions.me",
//     siteName: "RTU Solutions",
//     locale: "en_IN",
//     type: "website",
//   },

//   robots: {
//     index: true,
//     follow: true,
//     googleBot: {
//       index: true,
//       follow: true,
//       "max-image-preview": "large",
//       "max-snippet": -1,
//     },
//   },

//   icons: {
//     icon: "/favicon.ico",
//   },

//   verification: {
//     google: "OpInaWck_WbQs1THL2bXjm6RsNLvbVPaGhYqmJd14p4",
//   },
// };

// export default function RootLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html
//       lang="en"
//       className={cn(geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}
//     >
//       <head>
//         <script src="https://checkout.razorpay.com/v1/checkout.js" async></script> 
//       <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4312176557759808"
//      crossOrigin="anonymous"></script>
//       <meta name="google-adsense-account" content="ca-pub-4312176557759808"></meta> 
//      </head>
//       <body className="bg-white text-black flex flex-col min-h-screen">
//         <AuthProvider>{children}</AuthProvider>
//       </body>
//     </html>
//   );
// }