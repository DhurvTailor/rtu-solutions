// import type { Metadata } from "next";
// import { Geist, Geist_Mono, Figtree } from "next/font/google";
// import "./globals.css";
// import { cn } from "../lib/utils";
// import AuthProvider from "../src/components/AuthProvider";
// const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
// const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
// const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>

// export const metadata: Metadata = {
//   metadataBase: new URL("https://www.rtu-solutions.me"),
//   title: {
//     default: "RTU Solutions | RTU Notes, PYQ & Study Material",
//     template: "%s | RTU Solutions",
//   },
//   description: "RTU Notes, PYQ Solutions, Important Questions aur Video Lectures - sabhi branches aur semesters ke liye. Free aur premium study material RTU students ke liye.",
//   keywords: "RTU notes, RTU PYQ, RTU solutions, Rajasthan Technical University, RTU study material, RTU important questions",
//   openGraph: {
//     title: "RTU Solutions | RTU Notes, PYQ & Study Material",
//     description: "RTU Notes, PYQ Solutions, Important Questions - sabhi branches ke liye",
//     url: "https://www.rtu-solutions.me",
//     siteName: "RTU Solutions",
//     locale: "en_IN",
//     type: "website",
//   },
//   robots: {
//     index: true,
//     follow: true,
//   },
//   verification: {
//     google: "OpInaWck_WbQs1THL2bXjm6RsNLvbVPaGhYqmJd14p4",
//   },
// };

// export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <html lang="en" className={cn(geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}>
//       <body className="bg-white text-black flex flex-col min-h-screen">
//   <AuthProvider>
//     {children}
//   </AuthProvider>
// </body>
//     </html>
    
//   );
// }



import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import AuthProvider from "../src/components/AuthProvider";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rtu-solutions.me"),
  title: {
    default: "RTU Solutions | RTU Notes, PYQ & Study Material",
    template: "%s | RTU Solutions",
  },
  description:
    "RTU Notes, PYQ Solutions, Important Questions aur Video Lectures - sabhi branches aur semesters ke liye. Free aur premium study material RTU students ke liye.",
  keywords:
    "RTU notes, RTU PYQ, RTU solutions, Rajasthan Technical University, RTU study material, RTU important questions",
  alternates: {
    canonical: "https://www.rtu-solutions.me",
  },
  openGraph: {
    title: "RTU Solutions | RTU Notes, PYQ & Study Material",
    description: "RTU Notes, PYQ Solutions, Important Questions - sabhi branches ke liye",
    url: "https://www.rtu-solutions.me",
    siteName: "RTU Solutions",
    locale: "en_IN",
    type: "website",
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
  verification: {
    google: "OpInaWck_WbQs1THL2bXjm6RsNLvbVPaGhYqmJd14p4",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}
    >
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="bg-white text-black flex flex-col min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}