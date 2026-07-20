"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Megaphone,
  Users,
  Eye,
  TrendingUp,
  Layout,
  Newspaper,
  Mail,
  Target,
  BarChart3,
  Sparkles,
  ChevronDown,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Rocket,
  MousePointerClick,
  GraduationCap,
} from "lucide-react";

/**
 * PlaceholderImage
 * -----------------
 * Har jagah jaha image chahiye, wahan is component ko use kiya hai.
 * Bas `src` prop mai apni image ka path daal do (public/images/... mai image daal kar).
 * Agar image nahi milegi (404 ya path galat), to ek clean dashed placeholder box dikhega
 * jisme bataya hoga ki yaha kaunsi image expected hai — broken image icon kabhi nahi dikhega.
 */
function PlaceholderImage({ src, alt, className = "", fallbackIcon: Icon = Megaphone, fallbackLabel }) {
  const [error, setError] = useState(!src);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-orange-50 border-2 border-dashed border-orange-300 rounded-2xl ${className}`}
      >
        <Icon className="w-8 h-8 text-orange-400" strokeWidth={1.5} />
        <span className="text-xs text-orange-400 font-medium px-4 text-center leading-relaxed">
          {fallbackLabel || "Add image here"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

export default function AdvertisementPage() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  // NOTE: Yeh numbers placeholder hain — apne actual traffic/user stats se replace kar dena.
  const stats = [
    { icon: Users, value: "10,000+", label: "Registered Students" },
    { icon: Eye, value: "50,000+", label: "Monthly Page Views" },
    { icon: GraduationCap, value: "8", label: "Branches Covered" },
    { icon: TrendingUp, value: "3–5 min", label: "Avg. Session Duration" },
  ];

  const adFormats = [
    {
      icon: Layout,
      title: "Homepage Banner Ads",
      description:
        "Prime placement on the homepage hero and search results — the first thing every student sees when they land on RTU Solutions.",
      imgSrc: "/pageimg/HomepageAd.webp",
      imgAlt: "Homepage banner ad placement illustration",
      imgLabel: "Add image: format-homepage-banner.png",
    },
    {
      icon: Newspaper,
      title: "Sponsored Content",
      description:
        "Native placements inside blog posts, notes pages, and subject listings — reaching students exactly when they're studying.",
      imgSrc: "/pageimg/Sponsored Content.webp",
      imgAlt: "Sponsored content placement illustration",
      imgLabel: "Add image: format-sponsored-content.png",
    },
    {
      icon: Mail,
      title: "Newsletter & Email",
      description:
        "Get featured in exam-time update emails and notifications sent directly to students' inboxes.",
      imgSrc: "/pageimg/Newsletter & Email.webp",
      imgAlt: "Newsletter and email placement illustration",
      imgLabel: "Add image: format-newsletter.png",
    },
  ];

  const benefits = [
    {
      icon: Target,
      title: "Hyper-Targeted Audience",
      description:
        "Every visitor is a verified B.Tech student — filter by branch, semester, or subject for laser-focused targeting.",
    },
    {
      icon: MousePointerClick,
      title: "High Engagement",
      description:
        "Students spend real time on exam-prep pages, not bouncing away — your brand gets genuine attention, not a glance.",
    },
    {
      icon: BarChart3,
      title: "Transparent Reporting",
      description:
        "Track impressions, clicks, and campaign performance with clear reports shared throughout your ad run.",
    },
    {
      icon: Rocket,
      title: "Fast Turnaround",
      description:
        "Campaigns can go live within days — no lengthy approval chains, just a quick chat and your ad is up.",
    },
  ];

  const packages = [
    {
      name: "Starter",
      tagline: "Best for local coaching centers",
      features: [
        "Sidebar banner placement",
        "1 subject / branch page targeting",
        "Monthly performance summary",
      ],
    },
    {
      name: "Growth",
      tagline: "Best for ed-tech & book publishers",
      highlighted: true,
      features: [
        "Homepage + sidebar banner placement",
        "Multi-branch targeting",
        "1 sponsored content feature",
        "Weekly performance reports",
      ],
    },
    {
      name: "Premium",
      tagline: "Best for brands & universities",
      features: [
        "Homepage hero + sitewide placement",
        "Newsletter & email feature",
        "Dedicated sponsored content",
        "Priority support & custom reporting",
      ],
    },
  ];

  const faqs = [
    {
      question: "How do I get started advertising with RTU Solutions?",
      answer:
        "Just reach out through the contact form below with your brand details and goals. Our team will get back to you with the best-fit ad format and next steps.",
    },
    {
      question: "Can I target specific branches or semesters?",
      answer:
        "Yes. Since our content is organized by branch, semester, and subject, we can place your ads exactly where your target students are studying.",
    },
    {
      question: "What ad formats do you support?",
      answer:
        "Homepage banners, sidebar placements, sponsored content within notes and blog pages, and email/newsletter features — see the formats above.",
    },
    {
      question: "How is ad performance tracked?",
      answer:
        "We share impression and click data throughout your campaign so you always know exactly how your ad is performing.",
    },
    {
      question: "Is there a minimum campaign duration?",
      answer:
        "Campaign length is flexible and depends on the package you choose. Reach out and we'll tailor a duration that fits your goals.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ---------------- Hero Section ---------------- */}
      <section className="relative overflow-hidden bg-[#0B1F3F] text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Megaphone className="w-4 h-4" />
              Advertise With Us
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Reach Thousands of B.Tech Students
            </h1>
            <p className="text-orange-100 text-lg max-w-lg mb-8">
              Put your brand in front of engaged, exam-focused RTU students —
              right when they're studying, searching, and ready to act.
            </p>
            <a
              href="#ad-formats"
              className="inline-flex items-center gap-2 bg-white text-[#0B1F3F] font-semibold px-6 py-3 rounded-xl hover:bg-orange-50 transition"
            >
              Explore Ad Formats
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right: hero image */}
          <div data-aos="fade-left" data-aos-delay="150" className="relative">
            <PlaceholderImage
              src="/pageimg/Advertise With Us.webp"
              alt="Advertise with RTU Solutions hero illustration"
              className="w-full h-80 md:h-96 object-contain rounded-3xl"
              fallbackIcon={Megaphone}
              fallbackLabel="Add image: advertise-hero.png (isometric marketing / megaphone illustration)"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        {/* ---------------- Stats strip ---------------- */}
        <div data-aos="fade-up" className="-mt-8 mb-16">
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-xl md:text-2xl font-bold text-gray-800">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-400 mt-3">
            * Update these numbers with your actual traffic & user stats.
          </p>
        </div>

        {/* ---------------- Ad Formats with Images ---------------- */}
        <div id="ad-formats" className="scroll-mt-24 mb-16">
          <div data-aos="fade-up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Ad Formats We Offer
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Multiple ways to place your brand right where students are
              looking.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {adFormats.map((format, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-200 hover:-translate-y-1 transition-all duration-300"
              >
              <PlaceholderImage
  src={format.imgSrc}
  alt={format.imgAlt}
  className="w-full h-48 object-contain bg-gray-50 p-2"
/>
                <div className="p-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                    <format.icon className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-base mb-2">
                    {format.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {format.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Why Advertise / Benefits ---------------- */}
        <div className="mb-16">
          <div data-aos="fade-up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Why Advertise With RTU Solutions
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              A focused, high-intent student audience — not random web
              traffic.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {benefits.map((b, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 80}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-start gap-4 hover:border-orange-200 hover:shadow-md transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                  <b.icon className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm mb-1">
                    {b.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Packages ---------------- */}
        <div className="mb-16">
          <div data-aos="fade-up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Advertising Packages
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Pick a starting point — every plan can be customized to fit
              your goals and budget.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {packages.map((pkg, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className={`rounded-2xl p-6 flex flex-col border transition-all duration-300 ${
                  pkg.highlighted
                    ? "bg-[#0B1F3F] text-white border-transparent shadow-xl md:-translate-y-2"
                    : "bg-white border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200"
                }`}
              >
                {pkg.highlighted && (
                  <span className="self-start bg-white/20 backdrop-blur text-xs font-semibold px-3 py-1 rounded-full mb-3">
                    Most Popular
                  </span>
                )}
                <h3
                  className={`text-lg font-bold mb-1 ${
                    pkg.highlighted ? "text-white" : "text-gray-800"
                  }`}
                >
                  {pkg.name}
                </h3>
                <p
                  className={`text-xs mb-5 ${
                    pkg.highlighted ? "text-orange-50" : "text-gray-500"
                  }`}
                >
                  {pkg.tagline}
                </p>
                <ul className="space-y-3 mb-6 flex-1">
                  {pkg.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle2
                        className={`w-4 h-4 mt-0.5 shrink-0 ${
                          pkg.highlighted ? "text-white" : "text-orange-500"
                        }`}
                      />
                      <span
                        className={
                          pkg.highlighted ? "text-white" : "text-gray-600"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/contact"
                  className={`inline-flex items-center justify-center gap-2 font-semibold px-5 py-2.5 rounded-xl transition ${
                    pkg.highlighted
                      ? "bg-white text-orange-600 hover:bg-orange-50"
                      : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                  }`}
                >
                  Contact for Pricing
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- FAQ Section: Image left, accordion right ---------------- */}
        <div className="grid md:grid-cols-2 gap-10 items-start mb-20">
          <div data-aos="fade-right" className="md:sticky md:top-24">
            {/* <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              FAQ
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Quick Answers
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm">
              Common questions brands and coaching centers ask before
              advertising with us.
            </p> */}
            <PlaceholderImage
              src="/pageimg/QuickAnswers.webp"
              alt="Advertising frequently asked questions illustration"
              className="w-full h-64 md:h-80 object-contain rounded-3xl"
              fallbackIcon={HelpCircle}
              fallbackLabel="Add image: advertise-faq-illustration.png"
            />
          </div>

          <div data-aos="fade-left" className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-orange-200 transition-colors duration-300"
              >
                <details className="group">
                  <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none select-none">
                    <Sparkles className="w-4 h-4 text-orange-500 shrink-0" />
                    <h3 className="font-medium text-gray-800 text-sm flex-1">
                      {faq.question}
                    </h3>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-200 shrink-0" />
                  </summary>
                  <div className="px-5 pb-4 pl-12">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- CTA ---------------- */}
        <div
          data-aos="zoom-in"
          className="mb-20 bg-[#0B1F3F] rounded-2xl p-8 md:p-10 text-white text-center"
        >
          <Rocket className="w-8 h-8 mx-auto mb-3 text-orange-200" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Ready to put your brand in front of students?
          </h3>
          <p className="text-orange-100 mb-6 text-sm max-w-md mx-auto">
            Email us at{" "}
            <span className="font-semibold underline">
              support@rtusolutions.in
            </span>{" "}
            or use the form below to get started.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#0B1F3F] font-semibold px-6 py-2.5 rounded-xl hover:bg-orange-50 transition"
          >
            Get In Touch
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}