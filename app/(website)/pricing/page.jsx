import PricingClient from "../../../src/components/PricingClient";

export const metadata = {
  title: "Pricing | RTU Solutions",
  description:
    "Pay only for the PDF you need — no fixed subscriptions. Preview the first 2 pages free, pay securely with Razorpay, and download instantly. See how RTU Solutions pricing works.",
  keywords:
    "RTU Solutions pricing, RTU notes price, RTU PYQ solutions price, RTU study material cost, per PDF pricing, Razorpay secure payment",
  alternates: {
    canonical: "https://www.rtu-solutions.me/pricing",
  },
  openGraph: {
    title: "Pricing | RTU Solutions",
    description:
      "No fixed plans — pay only for the PDF you actually need. Free preview, secure Razorpay checkout, instant download.",
    url: "https://www.rtu-solutions.me/pricing",
    siteName: "RTU Solutions",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | RTU Solutions",
    description:
      "No fixed plans — pay only for the PDF you actually need. Free preview, secure Razorpay checkout, instant download.",
  },
};

export default function PricingPage() {
  return <PricingClient />;
}