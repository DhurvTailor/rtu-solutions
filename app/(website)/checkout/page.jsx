"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  FaLock, FaCreditCard, FaCheckCircle,
  FaFilePdf, FaInfinity, FaHeadset,
  FaYoutube, FaDownload, FaGift,
} from "react-icons/fa";

// ── Safely convert ANY error shape (object, Error, string, null) into a readable string ──
function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
  if (!err) return fallback;
  if (typeof err === "string") return err;
  if (err instanceof Error) return err.message || fallback;
  if (typeof err === "object") {
    // common API error shapes
    if (typeof err.message === "string") return err.message;
    if (typeof err.error === "string") return err.error;
    if (typeof err.description === "string") return err.description;
    try {
      const str = JSON.stringify(err);
      return str && str !== "{}" ? str : fallback;
    } catch {
      return fallback;
    }
  }
  return String(err);
}

// ── Razorpay ka "description" field sirf plain ASCII accept karta hai ──
// Special chars, emoji, unicode dashes waghera hatao warna
// "description contains invalid characters" error aata hai
function sanitizeDescription(text) {
  if (!text || typeof text !== "string") return "";
  return text
    .normalize("NFKD")            // accented/special chars normalize karo
    .replace(/[^\x00-\x7F]/g, "") // sirf ASCII rakho, baaki hatao
    .replace(/[<>&"]/g, "")       // HTML-sensitive chars hatao
    .trim()
    .slice(0, 255);               // Razorpay ka limit bhi hai
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const solutionId = searchParams.get("solution_id");

  const [solution, setSolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [trialsLeft, setTrialsLeft] = useState(0);
  const [trialLoading, setTrialLoading] = useState(true);

  const TYPE_LABELS = {
    complete_notes: "Complete Notes",
    important_questions: "Important Questions",
    pyq_solutions: "PYQ Solutions",
    assignment: "Assignment",
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user/trial-status")
        .then((r) => r.json())
        .then((data) => setTrialsLeft(data.trialsLeft || 0))
        .catch(() => {})
        .finally(() => setTrialLoading(false));
    } else if (status !== "loading") {
      setTrialLoading(false);
    }
  }, [status]);

  useEffect(() => {
    if (document.getElementById("rzp-script")) { setScriptLoaded(true); return; }
    const s = document.createElement("script");
    s.id = "rzp-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => setScriptLoaded(true);
    s.onerror = () => setError("Payment gateway failed to load.");
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    if (!solutionId) { setError("Solution ID missing in URL"); setLoading(false); return; }
    fetch(`/api/solutions?id=${solutionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data || !data.id) setError("Solution not found");
        else setSolution(data);
      })
      .catch((err) => setError(getErrorMessage(err, "Failed to load solution")))
      .finally(() => setLoading(false));
  }, [solutionId]);

  const isPremium = solution?.is_premium === 1 || solution?.is_premium === true;
  const price = parseFloat(solution?.price || 0);

  // ── TRIAL DOWNLOAD — seedha download route par bhejo ──
  const handleTrialDownload = () => {
    if (status !== "authenticated") { signIn("google"); return; }
    window.location.href = `/api/download?id=${solutionId}`;
  };

  // ── NORMAL RAZORPAY PAYMENT ──
  const handlePay = async () => {
    if (status !== "authenticated") { signIn("google"); return; }
    if (!scriptLoaded) { alert("Payment gateway is loading, please wait"); return; }
    setError(""); setPaying(true);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution_id: solutionId }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(getErrorMessage(data.error, "Failed to create order"));
        setPaying(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "RTU Solutions",
        description: sanitizeDescription(data.title) || "Solution Purchase",
        order_id: data.orderId,
        handler: async (response) => {
          try {
            const vRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const vData = await vRes.json();
            if (vData.success) window.location.href = `/api/download?id=${solutionId}`;
            else setError(getErrorMessage(vData.error, "Payment verification failed. Contact support if amount was deducted."));
          } catch (err) {
            setError(getErrorMessage(err, "Verification error occurred"));
          }
          finally { setPaying(false); }
        },
        modal: { ondismiss: () => setPaying(false) },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: { color: "#D85A30" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp) => {
        setError(getErrorMessage(resp?.error, "Payment failed. Please try again."));
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      setError(getErrorMessage(err));
      setPaying(false);
    }
  };

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </main>
  );

  if (error && !solution) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <p className="text-red-500 text-center max-w-sm text-sm">{getErrorMessage(error)}</p>
    </main>
  );

  const showTrialOption = isPremium && trialsLeft > 0 && !trialLoading;

  return (
    <main className="min-h-screen bg-gray-100 pb-28 lg:pb-0">

      <div className="bg-[#071A3D] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-gray-400 flex-wrap">
          <span className="text-gray-500">Home</span>
          <span className="text-gray-600">/</span>
          <span className="truncate max-w-25 sm:max-w-none">{solution?.degree_name || "—"}</span>
          <span className="text-gray-600">/</span>
          <span className="truncate max-w-25 sm:max-w-none">{solution?.branch_name || "—"}</span>
          <span className="text-gray-600">/</span>
          <span>Sem {solution?.semester_number || "—"}</span>
          <span className="text-gray-600">/</span>
          <span className="truncate max-w-25 sm:max-w-none">{solution?.subject_name || "—"}</span>
          <span className="text-gray-600">/</span>
          <span className="text-orange-400 font-medium">Checkout</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start">

          {/* LEFT */}
          <div className="w-full lg:flex-1 space-y-4 min-w-0">
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                {solution?.thumbnail_blob_name ? (
                  <img
                    src={`/api/thumbnail?id=${solution.id}`}
                    alt={solution.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-2">
                    <FaFilePdf size={36} className="text-gray-300" />
                    <p className="text-xs text-gray-300">No cover image</p>
                  </div>
                )}
                <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                  {solution?.semester_number && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/90 text-blue-700 border border-blue-100">
                      Semester {solution.semester_number}
                    </span>
                  )}
                  {isPremium && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-400/90 text-amber-900">
                      Premium
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-5">
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100 mb-3">
                  {TYPE_LABELS[solution?.solution_type] || solution?.solution_type}
                </span>
                <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-2 wrap-break-word">{solution?.title}</h1>
                {solution?.description && (
                  <p className="text-sm text-gray-500 leading-relaxed mb-4 wrap-break-wordword">{solution.description}</p>
                )}
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Course Details</p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[
                    { label: "Degree", val: solution?.degree_name },
                    { label: "Branch", val: solution?.branch_name },
                    { label: "Semester", val: solution?.semester_number ? `Semester ${solution.semester_number}` : null },
                    { label: "Subject", val: solution?.subject_name },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100 min-w-0">
                      <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800 leading-tight wrap-break-word">{item.val || "—"}</p>
                    </div>
                  ))}
                </div>

                {solution?.preview_blob_name && (
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Free Preview</p>
                    <button
                      onClick={() => setPreviewOpen(!previewOpen)}
                      className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                      <FaFilePdf className="text-red-400" size={14} />
                      {previewOpen ? "Close preview" : "View first 2 pages — free"}
                    </button>
                    {previewOpen && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
                        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200 flex-wrap gap-1">
                          <span className="text-xs font-medium text-gray-500">Preview — first 2 pages only</span>
                          <span className="text-xs text-gray-400">Remaining pages after purchase</span>
                        </div>
                        <iframe
                          src={`/api/preview?id=${solution.id}`}
                          className="w-full"
                          style={{ height: "300px", border: "none", display: "block" }}
                          title="PDF Preview"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">What You Get</p>
              <div className="space-y-3">
                {[
                  { icon: <FaDownload className="text-orange-500" size={14} />, title: "Instant PDF Download", sub: "Access immediately after payment" },
                  { icon: <FaInfinity className="text-green-500" size={14} />, title: "Lifetime Access", sub: "Download anytime, no expiry" },
                  { icon: <FaCheckCircle className="text-blue-500" size={14} />, title: "RTU Exam Pattern", sub: "Prepared according to RTU syllabus" },
                  ...(solution?.youtube_url ? [{ icon: <FaYoutube className="text-red-500" size={14} />, title: "Video Explanation", sub: "YouTube video included" }] : []),
                  { icon: <FaHeadset className="text-purple-500" size={14} />, title: "Support Available", sub: "Contact us if you face any issues" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">{item.icon}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — hidden CTA button on mobile (moved to fixed bottom bar below) */}
          <div className="w-full lg:w-80 lg:shrink-0 space-y-4 lg:sticky lg:top-4">

            <div className="flex items-center gap-1 text-xs overflow-x-auto no-scrollbar">
              {["Product", "Payment", "Download"].map((step, i) => (
                <span key={step} className="flex items-center gap-1 shrink-0">
                  <span className={`px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap ${i < 2 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-400"}`}>
                    {i + 1}. {step}
                  </span>
                  {i < 2 && <span className="text-gray-300 font-bold">›</span>}
                </span>
              ))}
            </div>

            {showTrialOption && (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
                <FaGift className="text-green-600 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-bold text-green-800">
                    {trialsLeft} Free PDF{trialsLeft > 1 ? "s" : ""} Available!
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">
                    This PDF is free for you — no payment needed
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Order Summary</p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shrink-0">
                  <FaFilePdf className="text-red-400" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{solution?.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{solution?.branch_name} · Sem {solution?.semester_number}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  {showTrialOption ? (
                    <span className="font-medium">
                      <span className="line-through text-gray-400 mr-1">₹{price.toFixed(0)}</span>
                      <span className="text-green-600 font-bold">FREE</span>
                    </span>
                  ) : (
                    <span className="font-medium text-gray-700">₹{price.toFixed(0)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>GST</span>
                  <span className="font-medium text-gray-700">₹0</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-900 text-sm">Total</span>
                {showTrialOption ? (
                  <span className="text-2xl font-bold text-green-600">₹0</span>
                ) : (
                  <span className="text-2xl font-bold text-orange-500">₹{price.toFixed(0)}</span>
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Billing Details</p>
              {status === "authenticated" ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <span className="text-sm font-bold text-blue-700">{session?.user?.name?.[0]?.toUpperCase() || "U"}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{session?.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                  <p className="text-xs font-medium text-amber-800">Login required to proceed</p>
                  <button onClick={() => signIn("google")} className="mt-2 text-xs font-bold text-orange-600 underline">
                    Sign in with Google →
                  </button>
                </div>
              )}
            </div>

            {!showTrialOption && (
              <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Payment Method</p>
                <div className="flex items-center gap-3 p-3 border border-amber-100 bg-amber-50 rounded-xl">
                  <FaCreditCard className="text-amber-600 shrink-0" size={18} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">Razorpay</p>
                    <p className="text-xs text-gray-500">UPI · Card · Net Banking · Wallets</p>
                  </div>
                  <FaCheckCircle className="text-green-500 shrink-0 ml-auto" size={14} />
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                <p className="text-red-600 text-xs font-medium text-center wrap-break-word">{getErrorMessage(error)}</p>
              </div>
            )}

            {/* CTA Button — desktop/tablet only, mobile uses fixed bottom bar */}
            <div className="hidden lg:block">
              {showTrialOption ? (
                <button
                  onClick={handleTrialDownload}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 bg-green-600 hover:bg-green-700"
                >
                  <FaGift size={14} />
                  Download Free (Trial)
                </button>
              ) : (
                <button
                  onClick={handlePay}
                  disabled={paying || !solution}
                  className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: paying || !solution ? "#9ca3af" : "#D85A30" }}
                >
                  <FaLock size={14} />
                  {paying ? "Processing..." : `Pay ₹${price.toFixed(0)} Securely`}
                </button>
              )}
            </div>

            {solution?.youtube_url && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
                <FaYoutube className="text-red-500 shrink-0" size={22} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Video Explanation Included</p>
                  <p className="text-xs text-gray-500">YouTube video access after purchase</p>
                </div>
              </div>
            )}

            <div className="hidden lg:flex items-center justify-center gap-2 text-xs text-gray-400">
              <FaLock size={10} />
              <span>100% Secure · Powered by Razorpay</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE FIXED BOTTOM BAR — always visible, no scroll needed ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Total</p>
            {showTrialOption ? (
              <span className="text-lg font-bold text-green-600">₹0</span>
            ) : (
              <span className="text-lg font-bold text-orange-500">₹{price.toFixed(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            {showTrialOption ? (
              <button
                onClick={handleTrialDownload}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-95 bg-green-600"
              >
                <FaGift size={14} />
                Download Free
              </button>
            ) : (
              <button
                onClick={handlePay}
                disabled={paying || !solution}
                className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: paying || !solution ? "#9ca3af" : "#D85A30" }}
              >
                <FaLock size={13} />
                {paying ? "Processing..." : `Pay ₹${price.toFixed(0)} Securely`}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </main>
    }>
      <CheckoutContent />
    </Suspense>
  );
}






// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useSession, signIn } from "next-auth/react";
// import {
//   FaLock, FaCreditCard, FaCheckCircle,
//   FaFilePdf, FaInfinity, FaHeadset,
//   FaYoutube, FaDownload, FaGift,
// } from "react-icons/fa";

// // ── Safely convert ANY error shape (object, Error, string, null) into a readable string ──
// function getErrorMessage(err, fallback = "Something went wrong. Please try again.") {
//   if (!err) return fallback;
//   if (typeof err === "string") return err;
//   if (err instanceof Error) return err.message || fallback;
//   if (typeof err === "object") {
//     // common API error shapes
//     if (typeof err.message === "string") return err.message;
//     if (typeof err.error === "string") return err.error;
//     if (typeof err.description === "string") return err.description;
//     try {
//       const str = JSON.stringify(err);
//       return str && str !== "{}" ? str : fallback;
//     } catch {
//       return fallback;
//     }
//   }
//   return String(err);
// }

// function CheckoutContent() {
//   const searchParams = useSearchParams();
//   const { data: session, status } = useSession();
//   const solutionId = searchParams.get("solution_id");

//   const [solution, setSolution] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [paying, setPaying] = useState(false);
//   const [error, setError] = useState("");
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);

//   const [trialsLeft, setTrialsLeft] = useState(0);
//   const [trialLoading, setTrialLoading] = useState(true);

//   const TYPE_LABELS = {
//     complete_notes: "Complete Notes",
//     important_questions: "Important Questions",
//     pyq_solutions: "PYQ Solutions",
//     assignment: "Assignment",
//   };

//   useEffect(() => {
//     if (status === "authenticated") {
//       fetch("/api/user/trial-status")
//         .then((r) => r.json())
//         .then((data) => setTrialsLeft(data.trialsLeft || 0))
//         .catch(() => {})
//         .finally(() => setTrialLoading(false));
//     } else if (status !== "loading") {
//       setTrialLoading(false);
//     }
//   }, [status]);

//   useEffect(() => {
//     if (document.getElementById("rzp-script")) { setScriptLoaded(true); return; }
//     const s = document.createElement("script");
//     s.id = "rzp-script";
//     s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.onload = () => setScriptLoaded(true);
//     s.onerror = () => setError("Payment gateway failed to load.");
//     document.body.appendChild(s);
//   }, []);

//   useEffect(() => {
//     if (!solutionId) { setError("Solution ID missing in URL"); setLoading(false); return; }
//     fetch(`/api/solutions?id=${solutionId}`)
//       .then((r) => r.json())
//       .then((data) => {
//         if (!data || !data.id) setError("Solution not found");
//         else setSolution(data);
//       })
//       .catch((err) => setError(getErrorMessage(err, "Failed to load solution")))
//       .finally(() => setLoading(false));
//   }, [solutionId]);

//   const isPremium = solution?.is_premium === 1 || solution?.is_premium === true;
//   const price = parseFloat(solution?.price || 0);

//   // ── TRIAL DOWNLOAD — seedha download route par bhejo ──
//   const handleTrialDownload = () => {
//     if (status !== "authenticated") { signIn("google"); return; }
//     window.location.href = `/api/download?id=${solutionId}`;
//   };

//   // ── NORMAL RAZORPAY PAYMENT ──
//   const handlePay = async () => {
//     if (status !== "authenticated") { signIn("google"); return; }
//     if (!scriptLoaded) { alert("Payment gateway is loading, please wait"); return; }
//     setError(""); setPaying(true);
//     try {
//       const res = await fetch("/api/payment/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ solution_id: solutionId }),
//       });
//       const data = await res.json();
//       if (!data.success) {
//         setError(getErrorMessage(data.error, "Failed to create order"));
//         setPaying(false);
//         return;
//       }

//       const options = {
//         key: data.keyId,
//         amount: data.amount,
//         currency: "INR",
//         name: "RTU Solutions",
//         description: data.title,
//         order_id: data.orderId,
//         handler: async (response) => {
//           try {
//             const vRes = await fetch("/api/payment/verify", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(response),
//             });
//             const vData = await vRes.json();
//             if (vData.success) window.location.href = `/api/download?id=${solutionId}`;
//             else setError(getErrorMessage(vData.error, "Payment verification failed. Contact support if amount was deducted."));
//           } catch (err) {
//             setError(getErrorMessage(err, "Verification error occurred"));
//           }
//           finally { setPaying(false); }
//         },
//         modal: { ondismiss: () => setPaying(false) },
//         prefill: {
//           name: session?.user?.name || "",
//           email: session?.user?.email || "",
//         },
//         theme: { color: "#D85A30" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", (resp) => {
//         setError(getErrorMessage(resp?.error, "Payment failed. Please try again."));
//         setPaying(false);
//       });
//       rzp.open();
//     } catch (err) {
//       setError(getErrorMessage(err));
//       setPaying(false);
//     }
//   };

//   if (loading) return (
//     <main className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="flex flex-col items-center gap-3">
//         <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
//         <p className="text-sm text-gray-400">Loading...</p>
//       </div>
//     </main>
//   );

//   if (error && !solution) return (
//     <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//       <p className="text-red-500 text-center max-w-sm text-sm">{getErrorMessage(error)}</p>
//     </main>
//   );

//   const showTrialOption = isPremium && trialsLeft > 0 && !trialLoading;

//   return (
//     <main className="min-h-screen bg-gray-100 pb-28 lg:pb-0">

//       <div className="bg-[#071A3D] px-4 py-3">
//         <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-gray-400 flex-wrap">
//           <span className="text-gray-500">Home</span>
//           <span className="text-gray-600">/</span>
//           <span className="truncate max-w-[100px] sm:max-w-none">{solution?.degree_name || "—"}</span>
//           <span className="text-gray-600">/</span>
//           <span className="truncate max-w-[100px] sm:max-w-none">{solution?.branch_name || "—"}</span>
//           <span className="text-gray-600">/</span>
//           <span>Sem {solution?.semester_number || "—"}</span>
//           <span className="text-gray-600">/</span>
//           <span className="truncate max-w-[100px] sm:max-w-none">{solution?.subject_name || "—"}</span>
//           <span className="text-gray-600">/</span>
//           <span className="text-orange-400 font-medium">Checkout</span>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
//         <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-start">

//           {/* LEFT */}
//           <div className="w-full lg:flex-1 space-y-4 min-w-0">
//             <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
//               <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
//                 {solution?.thumbnail_blob_name ? (
//                   <img
//                     src={`/api/thumbnail?id=${solution.id}`}
//                     alt={solution.title}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-2">
//                     <FaFilePdf size={36} className="text-gray-300" />
//                     <p className="text-xs text-gray-300">No cover image</p>
//                   </div>
//                 )}
//                 <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
//                   {solution?.semester_number && (
//                     <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/90 text-blue-700 border border-blue-100">
//                       Semester {solution.semester_number}
//                     </span>
//                   )}
//                   {isPremium && (
//                     <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-400/90 text-amber-900">
//                       Premium
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="p-4 sm:p-5">
//                 <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100 mb-3">
//                   {TYPE_LABELS[solution?.solution_type] || solution?.solution_type}
//                 </span>
//                 <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-2 break-words">{solution?.title}</h1>
//                 {solution?.description && (
//                   <p className="text-sm text-gray-500 leading-relaxed mb-4 break-words">{solution.description}</p>
//                 )}
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Course Details</p>
//                 <div className="grid grid-cols-2 gap-2 mb-5">
//                   {[
//                     { label: "Degree", val: solution?.degree_name },
//                     { label: "Branch", val: solution?.branch_name },
//                     { label: "Semester", val: solution?.semester_number ? `Semester ${solution.semester_number}` : null },
//                     { label: "Subject", val: solution?.subject_name },
//                   ].map((item) => (
//                     <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100 min-w-0">
//                       <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wide">{item.label}</p>
//                       <p className="text-sm font-semibold text-gray-800 leading-tight break-words">{item.val || "—"}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {solution?.preview_blob_name && (
//                   <div>
//                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Free Preview</p>
//                     <button
//                       onClick={() => setPreviewOpen(!previewOpen)}
//                       className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
//                     >
//                       <FaFilePdf className="text-red-400" size={14} />
//                       {previewOpen ? "Close preview" : "View first 2 pages — free"}
//                     </button>
//                     {previewOpen && (
//                       <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
//                         <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200 flex-wrap gap-1">
//                           <span className="text-xs font-medium text-gray-500">Preview — first 2 pages only</span>
//                           <span className="text-xs text-gray-400">Remaining pages after purchase</span>
//                         </div>
//                         <iframe
//                           src={`/api/preview?id=${solution.id}`}
//                           className="w-full"
//                           style={{ height: "300px", border: "none", display: "block" }}
//                           title="PDF Preview"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">What You Get</p>
//               <div className="space-y-3">
//                 {[
//                   { icon: <FaDownload className="text-orange-500" size={14} />, title: "Instant PDF Download", sub: "Access immediately after payment" },
//                   { icon: <FaInfinity className="text-green-500" size={14} />, title: "Lifetime Access", sub: "Download anytime, no expiry" },
//                   { icon: <FaCheckCircle className="text-blue-500" size={14} />, title: "RTU Exam Pattern", sub: "Prepared according to RTU syllabus" },
//                   ...(solution?.youtube_url ? [{ icon: <FaYoutube className="text-red-500" size={14} />, title: "Video Explanation", sub: "YouTube video included" }] : []),
//                   { icon: <FaHeadset className="text-purple-500" size={14} />, title: "Support Available", sub: "Contact us if you face any issues" },
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
//                     <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">{item.icon}</div>
//                     <div className="min-w-0">
//                       <p className="text-sm font-semibold text-gray-800">{item.title}</p>
//                       <p className="text-xs text-gray-400">{item.sub}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT — hidden CTA button on mobile (moved to fixed bottom bar below) */}
//           <div className="w-full lg:w-80 lg:shrink-0 space-y-4 lg:sticky lg:top-4">

//             <div className="flex items-center gap-1 text-xs overflow-x-auto no-scrollbar">
//               {["Product", "Payment", "Download"].map((step, i) => (
//                 <span key={step} className="flex items-center gap-1 shrink-0">
//                   <span className={`px-2.5 py-1.5 rounded-lg font-semibold whitespace-nowrap ${i < 2 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-400"}`}>
//                     {i + 1}. {step}
//                   </span>
//                   {i < 2 && <span className="text-gray-300 font-bold">›</span>}
//                 </span>
//               ))}
//             </div>

//             {showTrialOption && (
//               <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
//                 <FaGift className="text-green-600 shrink-0 mt-0.5" size={18} />
//                 <div>
//                   <p className="text-sm font-bold text-green-800">
//                     {trialsLeft} Free PDF{trialsLeft > 1 ? "s" : ""} Available!
//                   </p>
//                   <p className="text-xs text-green-600 mt-0.5">
//                     This PDF is free for you — no payment needed
//                   </p>
//                 </div>
//               </div>
//             )}

//             <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Order Summary</p>
//               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
//                 <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shrink-0">
//                   <FaFilePdf className="text-red-400" size={16} />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{solution?.title}</p>
//                   <p className="text-xs text-gray-400 mt-0.5 truncate">{solution?.branch_name} · Sem {solution?.semester_number}</p>
//                 </div>
//               </div>

//               <div className="space-y-2 text-sm text-gray-500 mb-3">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   {showTrialOption ? (
//                     <span className="font-medium">
//                       <span className="line-through text-gray-400 mr-1">₹{price.toFixed(0)}</span>
//                       <span className="text-green-600 font-bold">FREE</span>
//                     </span>
//                   ) : (
//                     <span className="font-medium text-gray-700">₹{price.toFixed(0)}</span>
//                   )}
//                 </div>
//                 <div className="flex justify-between">
//                   <span>GST</span>
//                   <span className="font-medium text-gray-700">₹0</span>
//                 </div>
//               </div>
//               <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
//                 <span className="font-bold text-gray-900 text-sm">Total</span>
//                 {showTrialOption ? (
//                   <span className="text-2xl font-bold text-green-600">₹0</span>
//                 ) : (
//                   <span className="text-2xl font-bold text-orange-500">₹{price.toFixed(0)}</span>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Billing Details</p>
//               {status === "authenticated" ? (
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
//                     <span className="text-sm font-bold text-blue-700">{session?.user?.name?.[0]?.toUpperCase() || "U"}</span>
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-sm font-semibold text-gray-800 truncate">{session?.user?.name}</p>
//                     <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
//                   <p className="text-xs font-medium text-amber-800">Login required to proceed</p>
//                   <button onClick={() => signIn("google")} className="mt-2 text-xs font-bold text-orange-600 underline">
//                     Sign in with Google →
//                   </button>
//                 </div>
//               )}
//             </div>

//             {!showTrialOption && (
//               <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5">
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Payment Method</p>
//                 <div className="flex items-center gap-3 p-3 border border-amber-100 bg-amber-50 rounded-xl">
//                   <FaCreditCard className="text-amber-600 shrink-0" size={18} />
//                   <div className="min-w-0">
//                     <p className="text-sm font-semibold text-gray-800">Razorpay</p>
//                     <p className="text-xs text-gray-500">UPI · Card · Net Banking · Wallets</p>
//                   </div>
//                   <FaCheckCircle className="text-green-500 shrink-0 ml-auto" size={14} />
//                 </div>
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-50 border border-red-100 rounded-xl p-3">
//                 <p className="text-red-600 text-xs font-medium text-center break-words">{getErrorMessage(error)}</p>
//               </div>
//             )}

//             {/* CTA Button — desktop/tablet only, mobile uses fixed bottom bar */}
//             <div className="hidden lg:block">
//               {showTrialOption ? (
//                 <button
//                   onClick={handleTrialDownload}
//                   className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 bg-green-600 hover:bg-green-700"
//                 >
//                   <FaGift size={14} />
//                   Download Free (Trial)
//                 </button>
//               ) : (
//                 <button
//                   onClick={handlePay}
//                   disabled={paying || !solution}
//                   className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
//                   style={{ background: paying || !solution ? "#9ca3af" : "#D85A30" }}
//                 >
//                   <FaLock size={14} />
//                   {paying ? "Processing..." : `Pay ₹${price.toFixed(0)} Securely`}
//                 </button>
//               )}
//             </div>

//             {solution?.youtube_url && (
//               <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
//                 <FaYoutube className="text-red-500 shrink-0" size={22} />
//                 <div>
//                   <p className="text-sm font-semibold text-gray-800">Video Explanation Included</p>
//                   <p className="text-xs text-gray-500">YouTube video access after purchase</p>
//                 </div>
//               </div>
//             )}

//             <div className="hidden lg:flex items-center justify-center gap-2 text-xs text-gray-400">
//               <FaLock size={10} />
//               <span>100% Secure · Powered by Razorpay</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── MOBILE FIXED BOTTOM BAR — always visible, no scroll needed ── */}
//       <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
//         <div className="max-w-4xl mx-auto flex items-center gap-3">
//           <div className="shrink-0">
//             <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Total</p>
//             {showTrialOption ? (
//               <span className="text-lg font-bold text-green-600">₹0</span>
//             ) : (
//               <span className="text-lg font-bold text-orange-500">₹{price.toFixed(0)}</span>
//             )}
//           </div>
//           <div className="flex-1 min-w-0">
//             {showTrialOption ? (
//               <button
//                 onClick={handleTrialDownload}
//                 className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-95 bg-green-600"
//               >
//                 <FaGift size={14} />
//                 Download Free
//               </button>
//             ) : (
//               <button
//                 onClick={handlePay}
//                 disabled={paying || !solution}
//                 className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
//                 style={{ background: paying || !solution ? "#9ca3af" : "#D85A30" }}
//               >
//                 <FaLock size={13} />
//                 {paying ? "Processing..." : `Pay ₹${price.toFixed(0)} Securely`}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default function CheckoutPage() {
//   return (
//     <Suspense fallback={
//       <main className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
//       </main>
//     }>
//       <CheckoutContent />
//     </Suspense>
//   );
// }






// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useSession, signIn } from "next-auth/react";
// import {
//   FaLock, FaCreditCard, FaCheckCircle,
//   FaFilePdf, FaInfinity, FaHeadset,
//   FaYoutube, FaDownload, FaGift,
// } from "react-icons/fa";

// function CheckoutContent() {
//   const searchParams = useSearchParams();
//   const { data: session, status } = useSession();
//   const solutionId = searchParams.get("solution_id");

//   const [solution, setSolution] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [paying, setPaying] = useState(false);
//   const [error, setError] = useState("");
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const [previewOpen, setPreviewOpen] = useState(false);

//   const [trialsLeft, setTrialsLeft] = useState(0);
//   const [trialLoading, setTrialLoading] = useState(true);

//   const TYPE_LABELS = {
//     complete_notes: "Complete Notes",
//     important_questions: "Important Questions",
//     pyq_solutions: "PYQ Solutions",
//     assignment: "Assignment",
//   };

//   useEffect(() => {
//     if (status === "authenticated") {
//       fetch("/api/user/trial-status")
//         .then((r) => r.json())
//         .then((data) => setTrialsLeft(data.trialsLeft || 0))
//         .catch(() => {})
//         .finally(() => setTrialLoading(false));
//     } else if (status !== "loading") {
//       setTrialLoading(false);
//     }
//   }, [status]);

//   useEffect(() => {
//     if (document.getElementById("rzp-script")) { setScriptLoaded(true); return; }
//     const s = document.createElement("script");
//     s.id = "rzp-script";
//     s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.onload = () => setScriptLoaded(true);
//     s.onerror = () => setError("Payment gateway failed to load.");
//     document.body.appendChild(s);
//   }, []);

//   useEffect(() => {
//     if (!solutionId) { setError("Solution ID missing in URL"); setLoading(false); return; }
//     fetch(`/api/solutions?id=${solutionId}`)
//       .then((r) => r.json())
//       .then((data) => {
//         if (!data || !data.id) setError("Solution not found");
//         else setSolution(data);
//       })
//       .catch(() => setError("Failed to load solution"))
//       .finally(() => setLoading(false));
//   }, [solutionId]);

//   const isPremium = solution?.is_premium === 1 || solution?.is_premium === true;
//   const price = parseFloat(solution?.price || 0);

//   // ── TRIAL DOWNLOAD — seedha download route par bhejo ──
//   const handleTrialDownload = () => {
//     if (status !== "authenticated") { signIn("google"); return; }
//     window.location.href = `/api/download?id=${solutionId}`;
//   };

//   // ── NORMAL RAZORPAY PAYMENT ──
//   const handlePay = async () => {
//     if (status !== "authenticated") { signIn("google"); return; }
//     if (!scriptLoaded) { alert("Payment gateway is loading, please wait"); return; }
//     setError(""); setPaying(true);
//     try {
//       const res = await fetch("/api/payment/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ solution_id: solutionId }),
//       });
//       const data = await res.json();
//       if (!data.success) { setError(data.error || "Failed to create order"); setPaying(false); return; }

//       const options = {
//         key: data.keyId,
//         amount: data.amount,
//         currency: "INR",
//         name: "RTU Solutions",
//         description: data.title,
//         order_id: data.orderId,
//         handler: async (response) => {
//           try {
//             const vRes = await fetch("/api/payment/verify", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(response),
//             });
//             const vData = await vRes.json();
//             if (vData.success) window.location.href = `/api/download?id=${solutionId}`;
//             else setError("Payment verification failed. Contact support if amount was deducted.");
//           } catch { setError("Verification error occurred"); }
//           finally { setPaying(false); }
//         },
//         modal: { ondismiss: () => setPaying(false) },
//         prefill: {
//           name: session?.user?.name || "",
//           email: session?.user?.email || "",
//         },
//         theme: { color: "#D85A30" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", () => { setError("Payment failed. Please try again."); setPaying(false); });
//       rzp.open();
//     } catch {
//       setError("Something went wrong. Please try again.");
//       setPaying(false);
//     }
//   };

//   if (loading) return (
//     <main className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="flex flex-col items-center gap-3">
//         <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
//         <p className="text-sm text-gray-400">Loading...</p>
//       </div>
//     </main>
//   );

//   if (error && !solution) return (
//     <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//       <p className="text-red-500 text-center max-w-sm text-sm">{error}</p>
//     </main>
//   );

//   const showTrialOption = isPremium && trialsLeft > 0 && !trialLoading;

//   return (
//     <main className="min-h-screen bg-gray-100">

//       <div className="bg-[#071A3D] px-4 py-3">
//         <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-gray-400 flex-wrap">
//           <span className="text-gray-500">Home</span>
//           <span className="text-gray-600">/</span>
//           <span>{solution?.degree_name || "—"}</span>
//           <span className="text-gray-600">/</span>
//           <span>{solution?.branch_name || "—"}</span>
//           <span className="text-gray-600">/</span>
//           <span>Sem {solution?.semester_number || "—"}</span>
//           <span className="text-gray-600">/</span>
//           <span>{solution?.subject_name || "—"}</span>
//           <span className="text-gray-600">/</span>
//           <span className="text-orange-400 font-medium">Checkout</span>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 py-6">
//         <div className="flex flex-col lg:flex-row gap-5 items-start">

//           {/* LEFT */}
//           <div className="w-full lg:flex-1 space-y-4 min-w-0">
//             <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">
//               <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
//                 {solution?.thumbnail_blob_name ? (
//                   <img
//                     src={`/api/thumbnail?id=${solution.id}`}
//                     alt={solution.title}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center gap-2">
//                     <FaFilePdf size={36} className="text-gray-300" />
//                     <p className="text-xs text-gray-300">No cover image</p>
//                   </div>
//                 )}
//                 <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
//                   {solution?.semester_number && (
//                     <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/90 text-blue-700 border border-blue-100">
//                       Semester {solution.semester_number}
//                     </span>
//                   )}
//                   {isPremium && (
//                     <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-amber-400/90 text-amber-900">
//                       Premium
//                     </span>
//                   )}
//                 </div>
//               </div>

//               <div className="p-5">
//                 <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100 mb-3">
//                   {TYPE_LABELS[solution?.solution_type] || solution?.solution_type}
//                 </span>
//                 <h1 className="text-lg font-bold text-gray-900 leading-snug mb-2">{solution?.title}</h1>
//                 {solution?.description && (
//                   <p className="text-sm text-gray-500 leading-relaxed mb-4">{solution.description}</p>
//                 )}
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Course Details</p>
//                 <div className="grid grid-cols-2 gap-2 mb-5">
//                   {[
//                     { label: "Degree", val: solution?.degree_name },
//                     { label: "Branch", val: solution?.branch_name },
//                     { label: "Semester", val: solution?.semester_number ? `Semester ${solution.semester_number}` : null },
//                     { label: "Subject", val: solution?.subject_name },
//                   ].map((item) => (
//                     <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
//                       <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wide">{item.label}</p>
//                       <p className="text-sm font-semibold text-gray-800 leading-tight">{item.val || "—"}</p>
//                     </div>
//                   ))}
//                 </div>

//                 {solution?.preview_blob_name && (
//                   <div>
//                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Free Preview</p>
//                     <button
//                       onClick={() => setPreviewOpen(!previewOpen)}
//                       className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
//                     >
//                       <FaFilePdf className="text-red-400" size={14} />
//                       {previewOpen ? "Close preview" : "View first 2 pages — free"}
//                     </button>
//                     {previewOpen && (
//                       <div className="mt-3 rounded-xl overflow-hidden border border-gray-200">
//                         <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
//                           <span className="text-xs font-medium text-gray-500">Preview — first 2 pages only</span>
//                           <span className="text-xs text-gray-400">Remaining pages after purchase</span>
//                         </div>
//                         <iframe
//                           src={`/api/preview?id=${solution.id}`}
//                           className="w-full"
//                           style={{ height: "300px", border: "none", display: "block" }}
//                           title="PDF Preview"
//                         />
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl border border-gray-200 p-5">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">What You Get</p>
//               <div className="space-y-3">
//                 {[
//                   { icon: <FaDownload className="text-orange-500" size={14} />, title: "Instant PDF Download", sub: "Access immediately after payment" },
//                   { icon: <FaInfinity className="text-green-500" size={14} />, title: "Lifetime Access", sub: "Download anytime, no expiry" },
//                   { icon: <FaCheckCircle className="text-blue-500" size={14} />, title: "RTU Exam Pattern", sub: "Prepared according to RTU syllabus" },
//                   ...(solution?.youtube_url ? [{ icon: <FaYoutube className="text-red-500" size={14} />, title: "Video Explanation", sub: "YouTube video included" }] : []),
//                   { icon: <FaHeadset className="text-purple-500" size={14} />, title: "Support Available", sub: "Contact us if you face any issues" },
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
//                     <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">{item.icon}</div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-800">{item.title}</p>
//                       <p className="text-xs text-gray-400">{item.sub}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="w-full lg:w-80 lg:shrink-0 space-y-4 lg:sticky lg:top-4">

//             <div className="flex items-center gap-1 text-xs">
//               {["Product", "Payment", "Download"].map((step, i) => (
//                 <span key={step} className="flex items-center gap-1">
//                   <span className={`px-2.5 py-1.5 rounded-lg font-semibold ${i < 2 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-400"}`}>
//                     {i + 1}. {step}
//                   </span>
//                   {i < 2 && <span className="text-gray-300 font-bold">›</span>}
//                 </span>
//               ))}
//             </div>

//             {showTrialOption && (
//               <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-start gap-3">
//                 <FaGift className="text-green-600 shrink-0 mt-0.5" size={18} />
//                 <div>
//                   <p className="text-sm font-bold text-green-800">
//                     {trialsLeft} Free PDF{trialsLeft > 1 ? "s" : ""} Available!
//                   </p>
//                   <p className="text-xs text-green-600 mt-0.5">
//                     This PDF is free for you — no payment needed
//                   </p>
//                 </div>
//               </div>
//             )}

//             <div className="bg-white rounded-2xl border border-gray-200 p-5">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Order Summary</p>
//               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
//                 <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shrink-0">
//                   <FaFilePdf className="text-red-400" size={16} />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{solution?.title}</p>
//                   <p className="text-xs text-gray-400 mt-0.5">{solution?.branch_name} · Sem {solution?.semester_number}</p>
//                 </div>
//               </div>

//               <div className="space-y-2 text-sm text-gray-500 mb-3">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   {showTrialOption ? (
//                     <span className="font-medium">
//                       <span className="line-through text-gray-400 mr-1">₹{price.toFixed(0)}</span>
//                       <span className="text-green-600 font-bold">FREE</span>
//                     </span>
//                   ) : (
//                     <span className="font-medium text-gray-700">₹{price.toFixed(0)}</span>
//                   )}
//                 </div>
//                 <div className="flex justify-between">
//                   <span>GST</span>
//                   <span className="font-medium text-gray-700">₹0</span>
//                 </div>
//               </div>
//               <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
//                 <span className="font-bold text-gray-900 text-sm">Total</span>
//                 {showTrialOption ? (
//                   <span className="text-2xl font-bold text-green-600">₹0</span>
//                 ) : (
//                   <span className="text-2xl font-bold text-orange-500">₹{price.toFixed(0)}</span>
//                 )}
//               </div>
//             </div>

//             <div className="bg-white rounded-2xl border border-gray-200 p-5">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Billing Details</p>
//               {status === "authenticated" ? (
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
//                     <span className="text-sm font-bold text-blue-700">{session?.user?.name?.[0]?.toUpperCase() || "U"}</span>
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-sm font-semibold text-gray-800 truncate">{session?.user?.name}</p>
//                     <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
//                   <p className="text-xs font-medium text-amber-800">Login required to proceed</p>
//                   <button onClick={() => signIn("google")} className="mt-2 text-xs font-bold text-orange-600 underline">
//                     Sign in with Google →
//                   </button>
//                 </div>
//               )}
//             </div>

//             {!showTrialOption && (
//               <div className="bg-white rounded-2xl border border-gray-200 p-5">
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Payment Method</p>
//                 <div className="flex items-center gap-3 p-3 border border-amber-100 bg-amber-50 rounded-xl">
//                   <FaCreditCard className="text-amber-600 shrink-0" size={18} />
//                   <div className="min-w-0">
//                     <p className="text-sm font-semibold text-gray-800">Razorpay</p>
//                     <p className="text-xs text-gray-500">UPI · Card · Net Banking · Wallets</p>
//                   </div>
//                   <FaCheckCircle className="text-green-500 shrink-0 ml-auto" size={14} />
//                 </div>
//               </div>
//             )}

//             {error && (
//               <div className="bg-red-50 border border-red-100 rounded-xl p-3">
//                 <p className="text-red-600 text-xs font-medium text-center">{error}</p>
//               </div>
//             )}

//             {/* CTA Button */}
//             {showTrialOption ? (
//               <button
//                 onClick={handleTrialDownload}
//                 className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 bg-green-600 hover:bg-green-700"
//               >
//                 <FaGift size={14} />
//                 Download Free (Trial)
//               </button>
//             ) : (
//               <button
//                 onClick={handlePay}
//                 disabled={paying || !solution}
//                 className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
//                 style={{ background: paying || !solution ? "#9ca3af" : "#D85A30" }}
//               >
//                 <FaLock size={14} />
//                 {paying ? "Processing..." : `Pay ₹${price.toFixed(0)} Securely`}
//               </button>
//             )}

//             {solution?.youtube_url && (
//               <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
//                 <FaYoutube className="text-red-500 shrink-0" size={22} />
//                 <div>
//                   <p className="text-sm font-semibold text-gray-800">Video Explanation Included</p>
//                   <p className="text-xs text-gray-500">YouTube video access after purchase</p>
//                 </div>
//               </div>
//             )}

//             <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
//               <FaLock size={10} />
//               <span>100% Secure · Powered by Razorpay</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default function CheckoutPage() {
//   return (
//     <Suspense fallback={
//       <main className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
//       </main>
//     }>
//       <CheckoutContent />
//     </Suspense>
//   );
// }


