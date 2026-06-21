import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import AuthProvider from "@/src/components/AuthProvider";
const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
<script src="https://checkout.razorpay.com/v1/checkout.js" async></script>

export const metadata: Metadata = {
  title: "RTU Solutions",
  description: "RTU Notes, PYQ, Important Questions, Video Lectures and Study Resources",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable, "font-sans", figtree.variable)}>
      <body className="bg-white text-black flex flex-col min-h-screen">
  <AuthProvider>
    {children}
  </AuthProvider>
</body>
    </html>
    
  );
}