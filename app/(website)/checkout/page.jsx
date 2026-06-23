"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  FaLock, FaCreditCard, FaCheckCircle,
  FaFilePdf, FaBolt, FaInfinity, FaHeadset,
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
  const [previewOpen, setPreviewOpen] = useState(false); // ← NEW

  // Razorpay script load
  useEffect(() => {
    if (document.getElementById("razorpay-checkout-script")) {
      setScriptLoaded(true); return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => setError("Payment gateway load nahi ho paya.");
    document.body.appendChild(script);
  }, []);

  // Solution fetch
  useEffect(() => {
    if (!solutionId) { setError("Solution ID missing"); setLoading(false); return; }
    fetch(`/api/solutions?id=${solutionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data || !data.id) setError("Solution nahi mila");
        else setSolution(data);
      })
      .catch(() => setError("Solution load karne mein error"))
      .finally(() => setLoading(false));
  }, [solutionId]);

  const handlePay = async () => {
    if (status !== "authenticated") { signIn("google"); return; }
    if (!scriptLoaded) { alert("Payment gateway load ho raha hai"); return; }
    setError(""); setPaying(true);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution_id: solutionId }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.error || "Order create nahi hua"); setPaying(false); return; }

      const options = {
        key: data.keyId, amount: data.amount, currency: "INR",
        name: "RTU Solutions", description: data.title, order_id: data.orderId,
        handler: async (response) => {
          try {
            const vRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            const vData = await vRes.json();
            if (vData.success) window.location.href = `/api/download?id=${solutionId}`;
            else setError("Payment verify nahi ho paya. Support se contact karo.");
          } catch { setError("Verification mein error"); }
          finally { setPaying(false); }
        },
        modal: { ondismiss: () => setPaying(false) },
        prefill: { name: session?.user?.name || "", email: session?.user?.email || "" },
        theme: { color: "#D85A30" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => { setError("Payment fail ho gaya"); setPaying(false); });
      rzp.open();
    } catch (err) {
      setError("Kuch galat ho gaya"); setPaying(false);
    }
  };

  if (loading) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading...</p>
      </div>
    </main>
  );

  if (error && !solution) return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-5">
      <p className="text-red-500 text-center max-w-md">{error}</p>
    </main>
  );

  const price = parseFloat(solution?.price || 0);

  const SOLUTION_TYPE_LABELS = {
    complete_notes: "Complete Notes",
    important_questions: "Important Questions",
    pyq_solutions: "PYQ Solutions",
    assignment: "Assignment",
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-400 mb-6 flex-wrap">
          <span>Home</span><span>/</span>
          <span>{solution?.degree_name || "—"}</span><span>/</span>
          <span>{solution?.branch_name || "—"}</span><span>/</span>
          <span>Sem {solution?.semester_number || "—"}</span><span>/</span>
          <span>{solution?.subject_name || "—"}</span><span>/</span>
          <span className="text-gray-700 font-medium">Checkout</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 items-start">

          {/* ── LEFT: Product ── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Thumbnail 16:9 */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                {solution?.thumbnail_blob_name ? (
                  <img
                    src={`/api/thumbnail?id=${solution.id}`}
                    alt={solution.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-2">
                    <FaFilePdf size={40} className="text-gray-300" />
                    <p className="text-sm text-gray-300">No cover image</p>
                  </div>
                )}

                {/* Badges over image */}
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-white/90 text-blue-700 border border-blue-100">
                    Sem {solution?.semester_number}
                  </span>
                  {(solution?.is_premium === 1 || solution?.is_premium === true) && (
                    <span className="text-xs font-medium px-2 py-1 rounded-md bg-amber-50/90 text-amber-700 border border-amber-100">
                      Premium
                    </span>
                  )}
                </div>
              </div>

              {/* Product details below image */}
              <div className="p-6">
                <div className="flex gap-2 mb-3 flex-wrap">
                  <span className="text-xs font-medium px-2 py-1 rounded-md bg-green-50 text-green-700">
                    {SOLUTION_TYPE_LABELS[solution?.solution_type] || solution?.solution_type}
                  </span>
                </div>

                <h1 className="text-xl font-semibold text-gray-900 mb-2 leading-snug">
                  {solution?.title}
                </h1>

                {solution?.description && (
                  <p className="text-sm text-gray-500 leading-relaxed mb-5">
                    {solution.description}
                  </p>
                )}

                {/* Course meta grid */}
                <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
                  Course details
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                    { label: "Degree", val: solution?.degree_name },
                    { label: "Branch", val: solution?.branch_name },
                    { label: "Semester", val: `Semester ${solution?.semester_number}` },
                    { label: "Subject", val: solution?.subject_name },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                      <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                      <p className="text-sm font-medium text-gray-800 leading-tight">
                        {item.val || "—"}
                      </p>
                    </div>
                  ))}
                </div>

                {/* PDF Preview toggle */}
                {solution?.preview_blob_name && (
                  <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
                      Free preview
                    </p>
                    <button
                      onClick={() => setPreviewOpen(!previewOpen)}
                      className="w-full flex items-center justify-center gap-2 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
                    >
                      {previewOpen ? (
                        <><span>Preview band karo</span><span className="text-xs text-gray-400">(pehle 2 pages)</span></>
                      ) : (
                        <><FaFilePdf className="text-red-400" /><span>Pehle 2 pages dekho — free</span></>
                      )}
                    </button>

                    {previewOpen && (
                      <div className="mt-3 rounded-xl overflow-hidden border border-gray-100">
                        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-100">
                          <span className="text-xs text-gray-500">Preview — pehle 2 pages only</span>
                          <span className="text-xs text-gray-400">Baaki pages purchase ke baad</span>
                        </div>
                        <iframe
                          src={`/api/preview?id=${solution.id}`}
                          className="w-full"
                          style={{ height: "320px", border: "none", display: "block" }}
                          title="PDF Preview"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT: Order Summary + Pay ── */}
          <div className="space-y-4 lg:sticky lg:top-6">

            {/* Steps */}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              {["Product", "Payment", "Download"].map((s, i) => (
                <span key={s} className="flex items-center gap-1">
                  <span className={`px-2 py-1 rounded-md ${i < 2 ? "bg-amber-50 text-amber-700" : "bg-gray-100 text-gray-400"}`}>
                    {i + 1} {s}
                  </span>
                  {i < 2 && <span className="text-gray-300">›</span>}
                </span>
              ))}
            </div>

            {/* Order card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-4">
                Order summary
              </p>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                <div className="w-10 h-10 bg-white border border-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FaFilePdf className="text-red-400" size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{solution?.title}</p>
                  <p className="text-xs text-gray-400">
                    {solution?.branch_name} · Sem {solution?.semester_number}
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-500 mb-3">
                <div className="flex justify-between">
                  <span>Subtotal</span><span>₹{price.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST</span><span>₹0</span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <span className="font-medium text-gray-800">Total</span>
                <span className="text-2xl font-semibold text-orange-500">₹{price.toFixed(0)}</span>
              </div>
            </div>

            {/* Billing */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
                Billing details
              </p>
              {status === "authenticated" ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-700">
                        {session?.user?.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{session?.user?.name}</p>
                      <p className="text-xs text-gray-400">{session?.user?.email}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
                  Pay karne ke liye pehle Google se login karo
                </div>
              )}
            </div>

            {/* Payment method */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">
                Payment method
              </p>
              <div className="flex items-center gap-3 p-3 border border-amber-100 bg-amber-50/40 rounded-xl">
                <FaCreditCard className="text-amber-600" size={18} />
                <div>
                  <p className="text-sm font-medium text-gray-800">Razorpay</p>
                  <p className="text-xs text-gray-400">UPI · Card · Net Banking · Wallets</p>
                </div>
                <FaCheckCircle className="text-green-500 ml-auto" size={14} />
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              {[
                { icon: <FaBolt className="text-green-500" size={13} />, text: "Instant download after payment" },
                { icon: <FaInfinity className="text-green-500" size={13} />, text: "Lifetime access" },
                { icon: <FaCheckCircle className="text-green-500" size={13} />, text: "RTU exam pattern ke hisaab se" },
                { icon: <FaHeadset className="text-green-500" size={13} />, text: "Support available" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3 py-2 text-sm text-gray-600 border-b border-gray-50 last:border-0">
                  {b.icon}{b.text}
                </div>
              ))}
            </div>

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 rounded-xl p-3">{error}</p>
            )}

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={paying || !solution}
              className="w-full py-4 rounded-xl font-semibold text-white text-base flex items-center justify-center gap-2 transition"
              style={{ background: paying || !solution ? "#d1d5db" : "#D85A30" }}
            >
              <FaLock size={14} />
              {paying ? "Processing..." : `Pay ₹${price.toFixed(0)} securely`}
            </button>

            <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
              <FaLock size={10} /> 100% secure · Powered by Razorpay
            </p>
          </div>

        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
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
//   FaLock,
//   FaCreditCard,
//   FaCheckCircle,
//   FaFilePdf,
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

//   useEffect(() => {
//     if (document.getElementById("razorpay-checkout-script")) {
//       setScriptLoaded(true);
//       return;
//     }
//     const script = document.createElement("script");
//     script.id = "razorpay-checkout-script";
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => setScriptLoaded(true);
//     script.onerror = () =>
//       setError("Payment gateway load nahi ho paya. Internet check karo.");
//     document.body.appendChild(script);
//   }, []);

//   useEffect(() => {
//     if (!solutionId) {
//       setError("Solution ID URL mein missing hai");
//       setLoading(false);
//       return;
//     }
//     fetch(`/api/solutions?id=${solutionId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (!data || data.error) {
//           setError("Solution nahi mila");
//         } else if (Array.isArray(data)) {
//           setError(
//             "Solution load nahi hua (API ne list bheji, single solution nahi). /api/solutions/route.js ka 'id' param check karo."
//           );
//         } else if (!data.id) {
//           setError("Solution data incomplete hai");
//         } else {
//           setSolution(data);
//         }
//       })
//       .catch(() => setError("Solution load karne mein error aaya"))
//       .finally(() => setLoading(false));
//   }, [solutionId]);

//   const handlePay = async () => {
//     if (status !== "authenticated") {
//       signIn("google");
//       return;
//     }
//     if (!scriptLoaded) {
//       alert("Payment gateway abhi load ho raha hai, ek second ruko");
//       return;
//     }
//     setError("");
//     setPaying(true);
//     try {
//       const res = await fetch("/api/payment/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ solution_id: solutionId }),
//       });
//       const data = await res.json();
//       if (!data.success) {
//         setError(data.error || "Order create nahi hua");
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
//         handler: async function (response) {
//           try {
//             const verifyRes = await fetch("/api/payment/verify", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               }),
//             });
//             const verifyData = await verifyRes.json();
//             if (verifyData.success) {
//               window.location.href = `/api/download?id=${solutionId}`;
//             } else {
//               setError(
//                 "Payment verify nahi ho paya. Agar paisa kat gaya hai to support contact karo."
//               );
//             }
//           } catch {
//             setError("Verification mein error aaya");
//           } finally {
//             setPaying(false);
//           }
//         },
//         modal: {
//           ondismiss: function () {
//             setPaying(false);
//           },
//         },
//         prefill: {
//           name: session?.user?.name || "",
//           email: session?.user?.email || "",
//         },
//         theme: { color: "#E8700A" },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.on("payment.failed", function () {
//         setError("Payment fail ho gaya, dobara try karo");
//         setPaying(false);
//       });
//       rzp.open();
//     } catch (err) {
//       console.error(err);
//       setError("Kuch galat ho gaya, dobara try karo");
//       setPaying(false);
//     }
//   };

//   if (loading) {
//     return (
//       <main className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <p className="text-gray-500">Loading...</p>
//       </main>
//     );
//   }

//   if (error && !solution) {
//     return (
//       <main className="min-h-screen bg-gray-100 flex items-center justify-center px-5">
//         <p className="text-red-500 font-medium text-center max-w-md">{error}</p>
//       </main>
//     );
//   }

//   const price = solution ? parseFloat(solution.price || 0) : 0;

//   return (
//     <main className="min-h-screen bg-gray-100 py-20">
//       <div className="max-w-6xl mx-auto px-5">
//         <div className="text-center mb-12">
//           <h1 className="text-5xl font-bold text-[#071A3D]">Secure Checkout</h1>
//           <p className="text-gray-500 mt-4">
//             Complete your purchase and unlock premium study materials.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           <div className="lg:col-span-2">
//             <div className="bg-white rounded-3xl p-8 shadow-sm">
//               <h2 className="text-2xl font-bold text-[#071A3D] mb-8">
//                 Billing Details
//               </h2>
//               <div className="space-y-3 text-gray-600">
//                 <p>
//                   <span className="font-semibold">Name:</span>{" "}
//                   {session?.user?.name || "Login karo pehle"}
//                 </p>
//                 <p>
//                   <span className="font-semibold">Email:</span>{" "}
//                   {session?.user?.email || "—"}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">
//               <h2 className="text-2xl font-bold text-[#071A3D] mb-6">
//                 Payment Method
//               </h2>
//               <div className="border border-orange-200 rounded-2xl p-5 flex items-center gap-4">
//                 <FaCreditCard size={30} className="text-orange-500" />
//                 <div>
//                   <h3 className="font-semibold">Razorpay Payment Gateway</h3>
//                   <p className="text-gray-500 text-sm">
//                     UPI (QR), Debit Card, Credit Card, Net Banking
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div>
//             <div className="bg-white rounded-3xl p-8 shadow-sm sticky top-24">
//               <h2 className="text-2xl font-bold text-[#071A3D]">Order Summary</h2>



//               {/* ── NEW: PDF preview ek choti thumbnail jaisi, product image ki tarah ── */}
//               {/* <div className="border-t mt-6 pt-6">
//                 {solution?.preview_blob_name ? (
//                   <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
//                     <iframe
//                       src={`/api/preview?id=${solution.id}`}
//                       className="w-full h-65"
//                       title="PDF preview"
//                     />
//                   </div>
//                 ) : null}

//                 <div className="flex items-center gap-3">
//                   <FaFilePdf className="text-red-500" size={25} />
//                   <div>
//                     <h3 className="font-semibold">{solution?.title || "—"}</h3>
//                     <p className="text-sm text-gray-500">
//                       {solution?.solution_type || ""}
//                     </p>
//                   </div>
//                 </div>
//               </div> */}
               
//              {/* Order Summary - Product Image */}
// <div className="border-t mt-6 pt-6">

//   {/* ── Thumbnail Image ── */}
//   {solution?.thumbnail_blob_name ? (
//     <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
//       <img
//         src={`/api/thumbnail?id=${solution.id}`}
//         alt={solution.title}
//         className="w-full h-48 object-cover"
//       />
//     </div>
//   ) : solution?.preview_blob_name ? (
//     // Fallback: thumbnail nahi hai to PDF preview dikhao
//     <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
//       <iframe
//         src={`/api/preview?id=${solution.id}`}
//         className="w-full h-48"
//         title="PDF preview"
//       />
//     </div>
//   ) : (
//     // Koi bhi nahi — placeholder
//     <div className="rounded-xl border border-dashed border-gray-200 mb-4 h-48 flex flex-col items-center justify-center bg-gray-50">
//       <FaFilePdf className="text-red-400 mb-2" size={40} />
//       <p className="text-gray-400 text-sm">PDF Solution</p>
//     </div>
//   )}

//   <div className="flex items-center gap-3">
//     <FaFilePdf className="text-red-500" size={25} />
//     <div>
//       <h3 className="font-semibold">{solution?.title || "—"}</h3>
//       <p className="text-sm text-gray-500">{solution?.solution_type || ""}</p>
//     </div>
//   </div>
// </div>

//               <div className="mt-8 space-y-4">
//                 <div className="flex justify-between text-xl font-bold">
//                   <span>Total</span>
//                   <span className="text-orange-500">₹{price.toFixed(0)}</span>
//                 </div>
//               </div>

//               <div className="mt-8 space-y-4">
//                 <div className="flex gap-3 items-center">
//                   <FaCheckCircle className="text-green-500" />
//                   <p>Instant Access</p>
//                 </div>
//                 <div className="flex gap-3 items-center">
//                   <FaCheckCircle className="text-green-500" />
//                   <p>Premium Notes</p>
//                 </div>
//                 <div className="flex gap-3 items-center">
//                   <FaCheckCircle className="text-green-500" />
//                   <p>Lifetime Access</p>
//                 </div>
//               </div>

//               {error && (
//                 <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
//               )}

//               <button
//                 onClick={handlePay}
//                 disabled={paying || !solution}
//                 className="w-full mt-8 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition"
//               >
//                 {paying ? "Processing..." : `Pay ₹${price.toFixed(0)}`}
//               </button>

//               <div className="flex justify-center items-center gap-2 mt-5 text-gray-500 text-sm">
//                 <FaLock />
//                 <span>100% Secure Payment</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }

// export default function CheckoutPage() {
//   return (
//     <Suspense
//       fallback={
//         <main className="min-h-screen bg-gray-100 flex items-center justify-center">
//           <p className="text-gray-500">Loading...</p>
//         </main>
//       }
//     >
//       <CheckoutContent />
//     </Suspense>
//   );
// }



