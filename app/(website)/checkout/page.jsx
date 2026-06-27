"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  FaLock, FaCreditCard, FaCheckCircle,
  FaFilePdf, FaInfinity, FaHeadset,
  FaYoutube, FaDownload, FaGift,
} from "react-icons/fa";

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

  // Trial status
  const [trialsLeft, setTrialsLeft] = useState(0);
  const [trialLoading, setTrialLoading] = useState(true);

  const TYPE_LABELS = {
    complete_notes: "Complete Notes",
    important_questions: "Important Questions",
    pyq_solutions: "PYQ Solutions",
    assignment: "Assignment",
  };

  // Trial check
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

  // Razorpay script
  useEffect(() => {
    if (document.getElementById("rzp-script")) { setScriptLoaded(true); return; }
    const s = document.createElement("script");
    s.id = "rzp-script";
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => setScriptLoaded(true);
    s.onerror = () => setError("Payment gateway failed to load.");
    document.body.appendChild(s);
  }, []);

  // Fetch solution
  useEffect(() => {
    if (!solutionId) { setError("Solution ID missing in URL"); setLoading(false); return; }
    fetch(`/api/solutions?id=${solutionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data || !data.id) setError("Solution not found");
        else setSolution(data);
      })
      .catch(() => setError("Failed to load solution"))
      .finally(() => setLoading(false));
  }, [solutionId]);

  const isPremium = solution?.is_premium === 1 || solution?.is_premium === true;
  const price = parseFloat(solution?.price || 0);

  // Trial se free download
  const handleTrialDownload = async () => {
    if (status !== "authenticated") { signIn("google"); return; }
    setPaying(true);
    try {
      const res = await fetch("/api/download/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution_id: solutionId }),
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = `/api/download?id=${solutionId}`;
      } else {
        setError(data.error || "Trial download failed");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setPaying(false);
    }
  };

  // Normal Razorpay payment
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
      if (!data.success) { setError(data.error || "Failed to create order"); setPaying(false); return; }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "RTU Solutions",
        description: data.title,
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
            else setError("Payment verification failed. Contact support if amount was deducted.");
          } catch { setError("Verification error occurred"); }
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
      rzp.on("payment.failed", () => { setError("Payment failed. Please try again."); setPaying(false); });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
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
      <p className="text-red-500 text-center max-w-sm text-sm">{error}</p>
    </main>
  );

  // Trial available hai is premium PDF ke liye?
  const showTrialOption = isPremium && trialsLeft > 0 && !trialLoading;

  return (
    <main className="min-h-screen bg-gray-100">

      <div className="bg-[#071A3D] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-xs text-gray-400 flex-wrap">
          <span className="text-gray-500">Home</span>
          <span className="text-gray-600">/</span>
          <span>{solution?.degree_name || "—"}</span>
          <span className="text-gray-600">/</span>
          <span>{solution?.branch_name || "—"}</span>
          <span className="text-gray-600">/</span>
          <span>Sem {solution?.semester_number || "—"}</span>
          <span className="text-gray-600">/</span>
          <span>{solution?.subject_name || "—"}</span>
          <span className="text-gray-600">/</span>
          <span className="text-orange-400 font-medium">Checkout</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-5 items-start">

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

              <div className="p-5">
                <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100 mb-3">
                  {TYPE_LABELS[solution?.solution_type] || solution?.solution_type}
                </span>
                <h1 className="text-lg font-bold text-gray-900 leading-snug mb-2">{solution?.title}</h1>
                {solution?.description && (
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{solution.description}</p>
                )}
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Course Details</p>
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[
                    { label: "Degree", val: solution?.degree_name },
                    { label: "Branch", val: solution?.branch_name },
                    { label: "Semester", val: solution?.semester_number ? `Semester ${solution.semester_number}` : null },
                    { label: "Subject", val: solution?.subject_name },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                      <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wide">{item.label}</p>
                      <p className="text-sm font-semibold text-gray-800 leading-tight">{item.val || "—"}</p>
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
                        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
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

            <div className="bg-white rounded-2xl border border-gray-200 p-5">
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
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full lg:w-80 lg:shrink-0 space-y-4 lg:sticky lg:top-4">

            <div className="flex items-center gap-1 text-xs">
              {["Product", "Payment", "Download"].map((step, i) => (
                <span key={step} className="flex items-center gap-1">
                  <span className={`px-2.5 py-1.5 rounded-lg font-semibold ${i < 2 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-400"}`}>
                    {i + 1}. {step}
                  </span>
                  {i < 2 && <span className="text-gray-300 font-bold">›</span>}
                </span>
              ))}
            </div>

            {/* Trial banner */}
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

            {/* Order summary */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Order Summary</p>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
                <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shrink-0">
                  <FaFilePdf className="text-red-400" size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">{solution?.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{solution?.branch_name} · Sem {solution?.semester_number}</p>
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

            {/* Billing info */}
            <div className="bg-white rounded-2xl border border-gray-200 p-5">
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

            {/* Payment method — sirf tab dikhao jab trial nahi hai */}
            {!showTrialOption && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5">
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
                <p className="text-red-600 text-xs font-medium text-center">{error}</p>
              </div>
            )}

            {/* CTA Button */}
            {showTrialOption ? (
              <button
                onClick={handleTrialDownload}
                disabled={paying}
                className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 bg-green-600 hover:bg-green-700"
              >
                <FaGift size={14} />
                {paying ? "Processing..." : "Download Free (Trial)"}
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

            {solution?.youtube_url && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
                <FaYoutube className="text-red-500 shrink-0" size={22} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Video Explanation Included</p>
                  <p className="text-xs text-gray-500">YouTube video access after purchase</p>
                </div>
              </div>
            )}

            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <FaLock size={10} />
              <span>100% Secure · Powered by Razorpay</span>
            </div>
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


// // "use client";

// // import { Suspense, useEffect, useState } from "react";
// // import { useSearchParams } from "next/navigation";
// // import { useSession, signIn } from "next-auth/react";
// // import {
// //   FaLock, FaCreditCard, FaCheckCircle,
// //   FaFilePdf, FaBolt, FaInfinity, FaHeadset,
// // } from "react-icons/fa";

// // function CheckoutContent() {
// //   const searchParams = useSearchParams();
// //   const { data: session, status } = useSession();
// //   const solutionId = searchParams.get("solution_id");

// //   const [solution, setSolution] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [paying, setPaying] = useState(false);
// //   const [error, setError] = useState("");
// //   const [scriptLoaded, setScriptLoaded] = useState(false);
// //   const [previewOpen, setPreviewOpen] = useState(false); // ← NEW

// //   // Razorpay script load
// //   useEffect(() => {
// //     if (document.getElementById("razorpay-checkout-script")) {
// //       setScriptLoaded(true); return;
// //     }
// //     const script = document.createElement("script");
// //     script.id = "razorpay-checkout-script";
// //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
// //     script.onload = () => setScriptLoaded(true);
// //     script.onerror = () => setError("Payment gateway load nahi ho paya.");
// //     document.body.appendChild(script);
// //   }, []);

// //   // Solution fetch
// //   useEffect(() => {
// //     if (!solutionId) { setError("Solution ID missing"); setLoading(false); return; }
// //     fetch(`/api/solutions?id=${solutionId}`)
// //       .then((r) => r.json())
// //       .then((data) => {
// //         if (!data || !data.id) setError("Solution nahi mila");
// //         else setSolution(data);
// //       })
// //       .catch(() => setError("Solution load karne mein error"))
// //       .finally(() => setLoading(false));
// //   }, [solutionId]);

// //   const handlePay = async () => {
// //     if (status !== "authenticated") { signIn("google"); return; }
// //     if (!scriptLoaded) { alert("Payment gateway load ho raha hai"); return; }
// //     setError(""); setPaying(true);
// //     try {
// //       const res = await fetch("/api/payment/create-order", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ solution_id: solutionId }),
// //       });
// //       const data = await res.json();
// //       if (!data.success) { setError(data.error || "Order create nahi hua"); setPaying(false); return; }

// //       const options = {
// //         key: data.keyId, amount: data.amount, currency: "INR",
// //         name: "RTU Solutions", description: data.title, order_id: data.orderId,
// //         handler: async (response) => {
// //           try {
// //             const vRes = await fetch("/api/payment/verify", {
// //               method: "POST",
// //               headers: { "Content-Type": "application/json" },
// //               body: JSON.stringify(response),
// //             });
// //             const vData = await vRes.json();
// //             if (vData.success) window.location.href = `/api/download?id=${solutionId}`;
// //             else setError("Payment verify nahi ho paya. Support se contact karo.");
// //           } catch { setError("Verification mein error"); }
// //           finally { setPaying(false); }
// //         },
// //         modal: { ondismiss: () => setPaying(false) },
// //         prefill: { name: session?.user?.name || "", email: session?.user?.email || "" },
// //         theme: { color: "#D85A30" },
// //       };

// //       const rzp = new window.Razorpay(options);
// //       rzp.on("payment.failed", () => { setError("Payment fail ho gaya"); setPaying(false); });
// //       rzp.open();
// //     } catch (err) {
// //       setError("Kuch galat ho gaya"); setPaying(false);
// //     }
// //   };

// //   if (loading) return (
// //     <main className="min-h-screen bg-gray-50 flex items-center justify-center">
// //       <div className="flex flex-col items-center gap-3">
// //         <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
// //         <p className="text-gray-400 text-sm">Loading...</p>
// //       </div>
// //     </main>
// //   );

// //   if (error && !solution) return (
// //     <main className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
// //       <p className="text-red-500 text-center max-w-md">{error}</p>
// //     </main>
// //   );

// //   const price = parseFloat(solution?.price || 0);

// //   const SOLUTION_TYPE_LABELS = {
// //     complete_notes: "Complete Notes",
// //     important_questions: "Important Questions",
// //     pyq_solutions: "PYQ Solutions",
// //     assignment: "Assignment",
// //   };

// //   return (
// //     <main className="min-h-screen bg-gray-50 py-10">
// //       <div className="max-w-5xl mx-auto px-4">

// //         {/* Breadcrumb */}
// //         <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 flex-wrap">
// //           <span>Home</span><span>/</span>
// //           <span>{solution?.degree_name || "—"}</span><span>/</span>
// //           <span>{solution?.branch_name || "—"}</span><span>/</span>
// //           <span>Sem {solution?.semester_number || "—"}</span><span>/</span>
// //           <span>{solution?.subject_name || "—"}</span><span>/</span>
// //           <span className="text-gray-700 font-medium">Checkout</span>
// //         </div>

// //         <div className="grid lg:grid-cols-3 gap-6 items-start">

// //           {/* ── LEFT: Product ── */}
// //           <div className="lg:col-span-2 space-y-4">

// //             {/* Thumbnail 16:9 */}
// //             <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
// //               <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
// //                 {solution?.thumbnail_blob_name ? (
// //                   <img
// //                     src={`/api/thumbnail?id=${solution.id}`}
// //                     alt={solution.title}
// //                     className="w-full h-full object-cover"
// //                   />
// //                 ) : (
// //                   <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-2">
// //                     <FaFilePdf size={40} className="text-gray-300" />
// //                     <p className="text-sm text-gray-300">No cover image</p>
// //                   </div>
// //                 )}

// //                 {/* Badges over image */}
// //                 <div className="absolute top-3 left-3 flex gap-2">
// //                   <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/90 text-blue-700 border border-blue-100">
// //                     Sem {solution?.semester_number}
// //                   </span>
// //                   {(solution?.is_premium === 1 || solution?.is_premium === true) && (
// //                     <span className="text-xs font-medium px-2 py-1 rounded-md bg-amber-50/90 text-amber-700 border border-amber-100">
// //                       Premium
// //                     </span>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* Product details below image */}
// //               <div className="p-6">
// //                 <div className="flex gap-2 mb-3 flex-wrap">
// //                   <span className="text-xs font-medium px-2 py-1 rounded-md bg-green-50 text-green-700">
// //                     {SOLUTION_TYPE_LABELS[solution?.solution_type] || solution?.solution_type}
// //                   </span>
// //                 </div>

// //                 <h1 className="text-xl font-semibold text-gray-900 mb-2 leading-snug">
// //                   {solution?.title}
// //                 </h1>

// //                 {solution?.description && (
// //                   <p className="text-sm text-gray-500 leading-relaxed mb-5">
// //                     {solution.description}
// //                   </p>
// //                 )}

// //                 {/* Course meta grid */}
// //                 <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
// //                   Course details
// //                 </p>
// //                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
// //                   {[
// //                     { label: "Degree", val: solution?.degree_name },
// //                     { label: "Branch", val: solution?.branch_name },
// //                     { label: "Semester", val: `Semester ${solution?.semester_number}` },
// //                     { label: "Subject", val: solution?.subject_name },
// //                   ].map((item) => (
// //                     <div key={item.label} className="bg-gray-50 rounded-xl p-3">
// //                       <p className="text-xs text-gray-400 mb-1">{item.label}</p>
// //                       <p className="text-sm font-medium text-gray-800 leading-tight">
// //                         {item.val || "—"}
// //                       </p>
// //                     </div>
// //                   ))}
// //                 </div>

// //                 {/* PDF Preview toggle */}
// //                 {solution?.preview_blob_name && (
// //                   <div>
// //                     <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
// //                       Free preview
// //                     </p>
// //                     <button
// //                       onClick={() => setPreviewOpen(!previewOpen)}
// //                       className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
// //                     >
// //                       {previewOpen ? (
// //                         <><span>Preview band karo</span><span className="text-xs text-gray-400">(pehle 2 pages)</span></>
// //                       ) : (
// //                         <><FaFilePdf className="text-red-400" /><span>Pehle 2 pages dekho — free</span></>
// //                       )}
// //                     </button>

// //                     {previewOpen && (
// //                       <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
// //                         <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-100">
// //                           <span className="text-xs text-gray-500">Preview — pehle 2 pages only</span>
// //                           <span className="text-xs text-gray-400">Baaki pages purchase ke baad</span>
// //                         </div>
// //                         <iframe
// //                           src={`/api/preview?id=${solution.id}`}
// //                           className="w-full"
// //                           style={{ height: "320px", border: "none", display: "block" }}
// //                           title="PDF Preview"
// //                         />
// //                       </div>
// //                     )}
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* ── RIGHT: Order Summary + Pay ── */}
// //           <div className="space-y-4 lg:sticky lg:top-6">

// //             {/* Steps */}
// //             <div className="flex items-center gap-1 text-xs text-gray-400">
// //               {["Product", "Payment", "Download"].map((s, i) => (
// //                 <span key={s} className="flex items-center gap-1">
// //                   <span className={`px-2 py-1 rounded-md ${i < 2 ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-400"}`}>
// //                     {i + 1} {s}
// //                   </span>
// //                   {i < 2 && <span className="text-gray-300">›</span>}
// //                 </span>
// //               ))}
// //             </div>

// //             {/* Order card */}
// //             <div className="bg-white rounded-2xl border border-gray-100 p-5">
// //               <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
// //                 Order summary
// //               </p>

// //               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
// //                 <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center shrink-0">
// //                   <FaFilePdf className="text-red-400" size={18} />
// //                 </div>
// //                 <div className="min-w-0">
// //                   <p className="text-sm font-medium text-gray-800 truncate">{solution?.title}</p>
// //                   <p className="text-xs text-gray-400">
// //                     {solution?.branch_name} · Sem {solution?.semester_number}
// //                   </p>
// //                 </div>
// //               </div>

// //               <div className="space-y-2 text-sm text-gray-500 mb-3">
// //                 <div className="flex justify-between">
// //                   <span>Subtotal</span><span>₹{price.toFixed(0)}</span>
// //                 </div>
// //                 <div className="flex justify-between">
// //                   <span>GST</span><span>₹0</span>
// //                 </div>
// //               </div>
// //               <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
// //                 <span className="font-medium text-gray-800">Total</span>
// //                 <span className="text-2xl font-semibold text-orange-500">₹{price.toFixed(0)}</span>
// //               </div>
// //             </div>

// //             {/* Billing */}
// //             <div className="bg-white rounded-2xl border border-gray-100 p-5">
// //               <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
// //                 Billing details
// //               </p>
// //               {status === "authenticated" ? (
// //                 <div className="space-y-3">
// //                   <div className="flex items-center gap-3">
// //                     <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
// //                       <span className="text-xs font-medium text-blue-700">
// //                         {session?.user?.name?.[0]?.toUpperCase() || "U"}
// //                       </span>
// //                     </div>
// //                     <div>
// //                       <p className="text-sm font-medium text-gray-800">{session?.user?.name}</p>
// //                       <p className="text-xs text-gray-400">{session?.user?.email}</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ) : (
// //                 <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
// //                   Pay karne ke liye pehle Google se login karo
// //                 </div>
// //               )}
// //             </div>

// //             {/* Payment method */}
// //             <div className="bg-white rounded-2xl border border-gray-100 p-5">
// //               <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
// //                 Payment method
// //               </p>
// //               <div className="flex items-center gap-3 p-3 border border-amber-100 bg-amber-50/40 rounded-xl">
// //                 <FaCreditCard className="text-amber-600" size={18} />
// //                 <div>
// //                   <p className="text-sm font-medium text-gray-800">Razorpay</p>
// //                   <p className="text-xs text-gray-400">UPI · Card · Net Banking · Wallets</p>
// //                 </div>
// //                 <FaCheckCircle className="text-green-500 ml-auto" size={14} />
// //               </div>
// //             </div>

// //             {/* Benefits */}
// //             <div className="bg-white rounded-2xl border border-gray-100 p-5">
// //               {[
// //                 { icon: <FaBolt className="text-green-500" size={13} />, text: "Instant download after payment" },
// //                 { icon: <FaInfinity className="text-green-500" size={13} />, text: "Lifetime access" },
// //                 { icon: <FaCheckCircle className="text-green-500" size={13} />, text: "RTU exam pattern ke hisaab se" },
// //                 { icon: <FaHeadset className="text-green-500" size={13} />, text: "Support available" },
// //               ].map((b, i) => (
// //                 <div key={i} className="flex items-center gap-3 py-2 text-sm text-gray-600 border-b border-gray-50 last:border-0">
// //                   {b.icon}{b.text}
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Error */}
// //             {error && (
// //               <p className="text-red-500 text-sm text-center bg-red-50 rounded-xl p-3">{error}</p>
// //             )}

// //             {/* Pay button */}
// //             <button
// //               onClick={handlePay}
// //               disabled={paying || !solution}
// //               className="w-full py-4 rounded-xl font-semibold text-white text-base flex items-center justify-center gap-2 transition"
// //               style={{ background: paying || !solution ? "#d1d5db" : "#D85A30" }}
// //             >
// //               <FaLock size={14} />
// //               {paying ? "Processing..." : `Pay ₹${price.toFixed(0)} securely`}
// //             </button>

// //             <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
// //               <FaLock size={10} /> 100% secure · Powered by Razorpay
// //             </p>
// //           </div>

// //         </div>
// //       </div>
// //     </main>
// //   );
// // }

// // export default function CheckoutPage() {
// //   return (
// //     <Suspense fallback={
// //       <main className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <p className="text-gray-400">Loading...</p>
// //       </main>
// //     }>
// //       <CheckoutContent />
// //     </Suspense>
// //   );
// // }






// "use client";

// import { Suspense, useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useSession, signIn } from "next-auth/react";
// import {
//   FaLock, FaCreditCard, FaCheckCircle,
//   FaFilePdf, FaBolt, FaInfinity, FaHeadset,
//   FaYoutube, FaDownload,
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

//   const TYPE_LABELS = {
//     complete_notes: "Complete Notes",
//     important_questions: "Important Questions",
//     pyq_solutions: "PYQ Solutions",
//     assignment: "Assignment",
//   };

//   // Razorpay script
//   useEffect(() => {
//     if (document.getElementById("rzp-script")) { setScriptLoaded(true); return; }
//     const s = document.createElement("script");
//     s.id = "rzp-script";
//     s.src = "https://checkout.razorpay.com/v1/checkout.js";
//     s.onload = () => setScriptLoaded(true);
//     s.onerror = () => setError("Payment gateway failed to load. Check internet connection.");
//     document.body.appendChild(s);
//   }, []);

//   // Fetch solution
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

//   // ── Loading ──
//   if (loading) return (
//     <main className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="flex flex-col items-center gap-3">
//         <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
//         <p className="text-sm text-gray-400">Loading...</p>
//       </div>
//     </main>
//   );

//   // ── Error ──
//   if (error && !solution) return (
//     <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
//       <p className="text-red-500 text-center max-w-sm text-sm">{error}</p>
//     </main>
//   );

//   const price = parseFloat(solution?.price || 0);
//   const isPremium = solution?.is_premium === 1 || solution?.is_premium === true;

//   return (
//     <main className="min-h-screen bg-gray-100">

//       {/* ── Top bar ── */}
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

//         {/* Mobile: stack | Desktop: 2 col */}
//         <div className="flex flex-col lg:flex-row gap-5 items-start">

//           {/* ══════════════════════════════
//               LEFT — Product Info
//           ══════════════════════════════ */}
//           <div className="w-full lg:flex-1 space-y-4 min-w-0">

//             {/* Thumbnail card */}
//             <div className="bg-white rounded-2xl overflow-hidden border border-gray-200">

//               {/* 16:9 thumbnail */}
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

//                 {/* Overlay badges */}
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

//               {/* Product body */}
//               <div className="p-5">

//                 {/* Type badge */}
//                 <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 border border-green-100 mb-3">
//                   {TYPE_LABELS[solution?.solution_type] || solution?.solution_type}
//                 </span>

//                 {/* Title */}
//                 <h1 className="text-lg font-bold text-gray-900 leading-snug mb-2">
//                   {solution?.title}
//                 </h1>

//                 {/* Description */}
//                 {solution?.description && (
//                   <p className="text-sm text-gray-500 leading-relaxed mb-4">
//                     {solution.description}
//                   </p>
//                 )}

//                 {/* Course details grid */}
//                 <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
//                   Course Details
//                 </p>
//                 <div className="grid grid-cols-2 gap-2 mb-5">
//                   {[
//                     { label: "Degree", val: solution?.degree_name },
//                     { label: "Branch", val: solution?.branch_name },
//                     { label: "Semester", val: solution?.semester_number ? `Semester ${solution.semester_number}` : null },
//                     { label: "Subject", val: solution?.subject_name },
//                   ].map((item) => (
//                     <div key={item.label} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
//                       <p className="text-[10px] text-gray-400 mb-1 font-medium uppercase tracking-wide">
//                         {item.label}
//                       </p>
//                       <p className="text-sm font-semibold text-gray-800 leading-tight">
//                         {item.val || "—"}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* PDF Preview */}
//                 {solution?.preview_blob_name && (
//                   <div>
//                     <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
//                       Free Preview
//                     </p>
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

//             {/* What you get card */}
//             <div className="bg-white rounded-2xl border border-gray-200 p-5">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
//                 What You Get
//               </p>
//               <div className="space-y-3">
//                 {[
//                   { icon: <FaDownload className="text-orange-500" size={14} />, title: "Instant PDF Download", sub: "Access immediately after payment" },
//                   { icon: <FaInfinity className="text-green-500" size={14} />, title: "Lifetime Access", sub: "Download anytime, no expiry" },
//                   { icon: <FaCheckCircle className="text-blue-500" size={14} />, title: "RTU Exam Pattern", sub: "Prepared according to RTU syllabus" },
//                   ...(solution?.youtube_url ? [{
//                     icon: <FaYoutube className="text-red-500" size={14} />,
//                     title: "Video Explanation",
//                     sub: "YouTube video included with this solution",
//                   }] : []),
//                   { icon: <FaHeadset className="text-purple-500" size={14} />, title: "Support Available", sub: "Contact us if you face any issues" },
//                 ].map((item, i) => (
//                   <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
//                     <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
//                       {item.icon}
//                     </div>
//                     <div>
//                       <p className="text-sm font-semibold text-gray-800">{item.title}</p>
//                       <p className="text-xs text-gray-400">{item.sub}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ══════════════════════════════
//               RIGHT — Order + Pay
//           ══════════════════════════════ */}
//           <div className="w-full lg:w-80 lg:shrink-0 space-y-4 lg:sticky lg:top-4">

//             {/* Progress steps */}
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

//             {/* Order summary */}
//             <div className="bg-white rounded-2xl border border-gray-200 p-5">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
//                 Order Summary
//               </p>

//               {/* Product row */}
//               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4 border border-gray-100">
//                 <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center shrink-0">
//                   <FaFilePdf className="text-red-400" size={16} />
//                 </div>
//                 <div className="min-w-0">
//                   <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2">
//                     {solution?.title}
//                   </p>
//                   <p className="text-xs text-gray-400 mt-0.5">
//                     {solution?.branch_name} · Sem {solution?.semester_number}
//                   </p>
//                 </div>
//               </div>

//               {/* Price breakdown */}
//               <div className="space-y-2 text-sm text-gray-500 mb-3">
//                 <div className="flex justify-between">
//                   <span>Subtotal</span>
//                   <span className="font-medium text-gray-700">₹{price.toFixed(0)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>GST</span>
//                   <span className="font-medium text-gray-700">₹0</span>
//                 </div>
//               </div>
//               <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
//                 <span className="font-bold text-gray-900 text-sm">Total</span>
//                 <span className="text-2xl font-bold text-orange-500">₹{price.toFixed(0)}</span>
//               </div>
//             </div>

//             {/* Billing info */}
//             <div className="bg-white rounded-2xl border border-gray-200 p-5">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
//                 Billing Details
//               </p>
//               {status === "authenticated" ? (
//                 <div className="flex items-center gap-3">
//                   <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center shrink-0">
//                     <span className="text-sm font-bold text-blue-700">
//                       {session?.user?.name?.[0]?.toUpperCase() || "U"}
//                     </span>
//                   </div>
//                   <div className="min-w-0">
//                     <p className="text-sm font-semibold text-gray-800 truncate">{session?.user?.name}</p>
//                     <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
//                   <p className="text-xs font-medium text-amber-800">Login required to proceed with payment</p>
//                   <button
//                     onClick={() => signIn("google")}
//                     className="mt-2 text-xs font-bold text-orange-600 underline"
//                   >
//                     Sign in with Google →
//                   </button>
//                 </div>
//               )}
//             </div>

//             {/* Payment method */}
//             <div className="bg-white rounded-2xl border border-gray-200 p-5">
//               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
//                 Payment Method
//               </p>
//               <div className="flex items-center gap-3 p-3 border border-amber-100 bg-amber-50 rounded-xl">
//                 <FaCreditCard className="text-amber-600 shrink-0" size={18} />
//                 <div className="min-w-0">
//                   <p className="text-sm font-semibold text-gray-800">Razorpay</p>
//                   <p className="text-xs text-gray-500">UPI · Card · Net Banking · Wallets</p>
//                 </div>
//                 <FaCheckCircle className="text-green-500 shrink-0 ml-auto" size={14} />
//               </div>
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="bg-red-50 border border-red-100 rounded-xl p-3">
//                 <p className="text-red-600 text-xs font-medium text-center">{error}</p>
//               </div>
//             )}

//             {/* Pay button */}
//             <button
//               onClick={handlePay}
//               disabled={paying || !solution}
//               className="w-full py-4 rounded-2xl font-bold text-white text-base flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{ background: paying || !solution ? "#9ca3af" : "#D85A30" }}
//             >
//               <FaLock size={14} />
//               {paying ? "Processing..." : `Pay ₹${price.toFixed(0)} Securely`}
//             </button>

//             {/* YouTube button — purchase ke baad milega note */}
//             {solution?.youtube_url && (
//               <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
//                 <FaYoutube className="text-red-500 shrink-0" size={22} />
//                 <div>
//                   <p className="text-sm font-semibold text-gray-800">Video Explanation Included</p>
//                   <p className="text-xs text-gray-500">YouTube video access after purchase</p>
//                 </div>
//               </div>
//             )}

//             {/* Trust badge */}
//             <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
//               <FaLock size={10} />
//               <span>100% Secure Payment · Powered by Razorpay</span>
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