"use client";
import { useEffect, useMemo, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Mail,
  ClipboardList,
  CreditCard,
  BookOpen,
  UserCog,
  Wrench,
  LayoutGrid,
} from "lucide-react";

/**
 * PlaceholderImage
 * -----------------
 * Har FAQ ke andar image optional hai. `imgSrc` set karo to wahi image dikhegi,
 * agar khali chhoda ya path galat hua to ek clean dashed placeholder box dikhega
 * jisme bataya hoga ki yaha kaunsi image expected hai — broken image icon kabhi nahi dikhega.
 */
function PlaceholderImage({ src, alt, className = "", fallbackIcon: Icon = HelpCircle, fallbackLabel }) {
  const [error, setError] = useState(!src);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-orange-50 border-2 border-dashed border-orange-300 rounded-xl ${className}`}
      >
        <Icon className="w-6 h-6 text-orange-400" strokeWidth={1.5} />
        <span className="text-[11px] text-orange-400 font-medium px-4 text-center leading-relaxed">
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

const CATEGORIES = [
  { key: "All", label: "All Questions", icon: LayoutGrid },
  { key: "General", label: "General", icon: ClipboardList },
  { key: "Orders", label: "Orders & Payments", icon: CreditCard },
  { key: "Content", label: "Content & Solutions", icon: BookOpen },
  { key: "Account", label: "Account", icon: UserCog },
  { key: "Technical", label: "Technical", icon: Wrench },
];

const FAQS = [
  {
    id: "f1",
    category: "General",
    icon: ClipboardList,
    question: "What is RTU Solutions?",
    answer:
      "RTU Solutions is a platform built for Rajasthan Technical University B.Tech students, offering notes, previous year questions (PYQs), and solved papers across all branches and semesters.",
    imgSrc: "/FAQimg/AboutRTUsolutions.webp",
    imgAlt: "What is RTU Solutions illustration",
    imgLabel: "Add image: faq-what-is-rtu.png",
  },
  {
    id: "f2",
    category: "General",
    icon: BookOpen,
    question: "Is any content available for free?",
    answer:
      "Yes. New users get free trial downloads to preview our content quality before purchasing full solutions.",
    imgSrc: "/FAQimg/TWOpdfree.webp",
    imgAlt: "Free trial downloads illustration",
    imgLabel: "Add image: faq-free-trial.png",
  },
  {
    id: "f3",
    category: "Orders",
    icon: CreditCard,
    question: "What payment methods are supported?",
    answer:
      "All major UPI apps, debit/credit cards, and net banking are supported through our secure Razorpay checkout.",
    imgSrc: "/FAQimg/paymentsupported.webp",
    imgAlt: "Payment methods illustration",
    imgLabel: "Add image: faq-payment-methods.png",
  },
  {
    id: "f4",
    category: "Orders",
    icon: CreditCard,
    question: "Will I get an invoice for my purchase?",
    answer:
      "Yes, a payment confirmation and invoice are sent to your registered email immediately after a successful purchase.",
    imgSrc: "/FAQimg/invoicesend.webp",
    imgAlt: "Invoice and confirmation illustration",
    imgLabel: "Add image: faq-invoice.png",
  },
  {
    id: "f5",
    category: "Orders",
    icon: CreditCard,
    question: "Can I get a refund if something goes wrong?",
    answer:
      "Yes, refunds are available for genuine issues like corrupted files or duplicate charges, within 7 days of purchase. Check our Refund Policy page for full details.",
    imgSrc: "/FAQimg/refundsavailable.webp",
    imgAlt: "Refund policy illustration",
    imgLabel: "Add image: faq-refund.png",
  },
  {
    id: "f6",
    category: "Content",
    icon: BookOpen,
    question: "How accurate are the solved papers?",
    answer:
      "Solutions are prepared carefully for exam-prep reference, but they're not officially verified by RTU. We recommend cross-checking critical answers with your course material.",
    imgSrc: "/FAQimg/verifiedAnswer.webp",
    imgAlt: "Solved papers accuracy illustration",
    imgLabel: "Add image: faq-accuracy.png",
  },
  {
    id: "f7",
    category: "Content",
    icon: BookOpen,
    question: "Can I re-download content I've already purchased?",
    answer:
      "Yes. Everything you buy stays available in your My Purchases page, so you can re-download it anytime without paying again.",
    imgSrc: "/FAQimg/re-download.webp",
    imgAlt: "My purchases redownload illustration",
    imgLabel: "Add image: faq-redownload.png",
  },
  {
    id: "f8",
    category: "Account",
    icon: UserCog,
    question: "I forgot my password. What do I do?",
    answer:
      "Use the \"Forgot Password\" link on the login page to reset it via your registered email, or sign in directly with Google.",
    imgSrc: "/FAQimg/ForgotPassword.webp",
    imgAlt: "Forgot password illustration",
    imgLabel: "Add image: faq-forgot-password.png",
  },
  {
    id: "f9",
    category: "Account",
    icon: UserCog,
    question: "How do I delete my account?",
    answer:
      "Email our support team with a deletion request, and we'll remove your account and personal data as per our Privacy Policy.",
    imgSrc: "/FAQimg/deleteaccount .webp",
    imgAlt: "Account deletion illustration",
    imgLabel: "Add image: faq-delete-account.png",
  },
  {
    id: "f10",
    category: "Technical",
    icon: Wrench,
    question: "My downloaded PDF won't open. What now?",
    answer:
      "Try re-downloading from My Purchases first — this fixes most issues. If it still doesn't open, contact support with your order ID and we'll sort it out quickly.",
    imgSrc: "/FAQimg/tryre-downloading.webp",
    imgAlt: "PDF not opening troubleshooting illustration",
    imgLabel: "Add image: faq-pdf-issue.png",
  },
  {
    id: "f11",
    category: "Technical",
    icon: Wrench,
    question: "The website feels slow or isn't loading properly.",
    answer:
      "Try clearing your browser cache or switching networks first. If the issue continues, let us know the page and device you're using so we can investigate.",
    imgSrc: "/FAQimg/networksproblem.webp",
    imgAlt: "Website loading issue illustration",
    imgLabel: "Add image: faq-site-slow.png",
  },
  {
    id: "f12",
    category: "General",
    icon: ClipboardList,
    question: "Which RTU branches and semesters are covered?",
    answer:
      "We cover all major B.Tech branches across all 8 semesters, with new content added regularly as syllabi and exam patterns update.",
    imgSrc: "/FAQimg/Allbranches.webp",
    imgAlt: "Branches and semesters coverage illustration",
    imgLabel: "Add image: faq-branches.png",
  },
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [openItems, setOpenItems] = useState({});

  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });

    // Laptop/desktop (lg breakpoint, 1024px+) par saare dropdowns by default open.
    // Phone/tablet par by default closed — user tap karke khole.
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    if (isDesktop) {
      const allOpen = {};
      FAQS.forEach((f) => (allOpen[f.id] = true));
      setOpenItems(allOpen);
    }
  }, []);

  const toggleItem = (id) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQS.filter((f) => {
      const matchesCategory =
        selectedCategory === "All" || f.category === selectedCategory;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, query]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ---------------- Hero Section ---------------- */}
      <section className="relative overflow-hidden bg-[#0B1F3F] text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 blur-2xl" />

        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          <div
            data-aos="zoom-in"
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6"
          >
            <HelpCircle className="w-4 h-4" />
            We&apos;ve Got Answers
          </div>
          <h1
            data-aos="fade-up"
            data-aos-delay="100"
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Frequently Asked Questions
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="200"
            className="text-orange-100 text-lg max-w-2xl mx-auto mb-8"
          >
            Everything you need to know about using RTU Solutions — orders,
            content, account, and more.
          </p>

          {/* Search bar */}
          <div data-aos="fade-up" data-aos-delay="300" className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-orange-300 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your question..."
              className="w-full bg-white/15 backdrop-blur placeholder-orange-100 text-white border border-white/20 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* ---------------- Category filter chips ---------------- */}
        <div
          data-aos="fade-up"
          className="-mt-6 mb-10 bg-white rounded-2xl shadow-xl border border-orange-100 p-3 flex flex-wrap justify-center gap-2"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                selectedCategory === cat.key
                  ? "bg-[#0B1F3F] text-white shadow-sm"
                  : "bg-orange-50 text-[#0B1F3F] hover:bg-orange-100"
              }`}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </div>

        {/* ---------------- FAQ Grid: 2 columns on laptop, 1 on phone ---------------- */}
        {filteredFaqs.length === 0 ? (
          <div data-aos="fade-up" className="text-center py-16">
            <HelpCircle className="w-10 h-10 text-orange-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">
              No questions matched your search. Try a different keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {filteredFaqs.map((faq, i) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  data-aos="fade-up"
                  data-aos-delay={(i % 6) * 60}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all duration-300 h-fit"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full flex items-center gap-4 px-6 py-4 text-left"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center">
                      <faq.icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-sm flex-1">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className="grid transition-all duration-300 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-5 pt-1 pl-18 border-t border-gray-50 space-y-3">
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                           <PlaceholderImage
    src={faq.imgSrc}
    alt={faq.imgAlt}
    className="w-full  mt-8 aspect-video object-cover rounded-xl"
    fallbackIcon={faq.icon}
    fallbackLabel={faq.imgLabel}
  />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ---------------- Still need help CTA ---------------- */}
        <div
          data-aos="zoom-in"
          className="mt-16 bg-[#0B1F3F] rounded-2xl p-8 md:p-10 text-white text-center"
        >
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-orange-200" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Still have a question?
          </h3>
          <p className="text-orange-100 mb-6 text-sm max-w-md mx-auto">
            Can&apos;t find what you're looking for? Our team is happy to help
            directly.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#0B1F3F] font-semibold px-6 py-2.5 rounded-xl hover:bg-orange-50 transition"
          >
            <Mail className="w-4 h-4" />
            Contact Support
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}