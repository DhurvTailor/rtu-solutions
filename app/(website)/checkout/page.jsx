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

//   // ── Razorpay checkout script load karo (ek hi baar) ──
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

//   // ── Solution ki details fetch karo (price, title) ──
//   useEffect(() => {
//     if (!solutionId) {
//       setError("Solution ID URL mein missing hai");
//       setLoading(false);
//       return;
//     }
//     fetch(`/api/solutions?id=${solutionId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         // FIX: Agar API ne purane format mein (poori list) response
//         // bheja, ya koi error object aaya, ya khud null/undefined hai,
//         // to silently 0 price dikhane ke bajaye clear error dikhao.
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
//         // ── Yahi handler QR/UPI/card sab dikhata hai modal mein ──
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

//               <div className="border-t mt-6 pt-6">
//                 <div className="flex items-center gap-3">
//                   <FaFilePdf className="text-red-500" size={25} />
//                   <div>
//                     <h3 className="font-semibold">{solution?.title || "—"}</h3>
//                     <p className="text-sm text-gray-500">
//                       {solution?.solution_type || ""}
//                     </p>
//                   </div>
//                 </div>
//               </div>

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

// // ── Suspense boundary zaroori hai — useSearchParams() ko bina ise
// // ke build par error aata hai ("should be wrapped in a suspense boundary")
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



"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  FaLock,
  FaCreditCard,
  FaCheckCircle,
  FaFilePdf,
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

  useEffect(() => {
    if (document.getElementById("razorpay-checkout-script")) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-checkout-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setScriptLoaded(true);
    script.onerror = () =>
      setError("Payment gateway load nahi ho paya. Internet check karo.");
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!solutionId) {
      setError("Solution ID URL mein missing hai");
      setLoading(false);
      return;
    }
    fetch(`/api/solutions?id=${solutionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data || data.error) {
          setError("Solution nahi mila");
        } else if (Array.isArray(data)) {
          setError(
            "Solution load nahi hua (API ne list bheji, single solution nahi). /api/solutions/route.js ka 'id' param check karo."
          );
        } else if (!data.id) {
          setError("Solution data incomplete hai");
        } else {
          setSolution(data);
        }
      })
      .catch(() => setError("Solution load karne mein error aaya"))
      .finally(() => setLoading(false));
  }, [solutionId]);

  const handlePay = async () => {
    if (status !== "authenticated") {
      signIn("google");
      return;
    }
    if (!scriptLoaded) {
      alert("Payment gateway abhi load ho raha hai, ek second ruko");
      return;
    }
    setError("");
    setPaying(true);
    try {
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ solution_id: solutionId }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Order create nahi hua");
        setPaying(false);
        return;
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: "INR",
        name: "RTU Solutions",
        description: data.title,
        order_id: data.orderId,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              window.location.href = `/api/download?id=${solutionId}`;
            } else {
              setError(
                "Payment verify nahi ho paya. Agar paisa kat gaya hai to support contact karo."
              );
            }
          } catch {
            setError("Verification mein error aaya");
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        theme: { color: "#E8700A" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setError("Payment fail ho gaya, dobara try karo");
        setPaying(false);
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      setError("Kuch galat ho gaya, dobara try karo");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  if (error && !solution) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-5">
        <p className="text-red-500 font-medium text-center max-w-md">{error}</p>
      </main>
    );
  }

  const price = solution ? parseFloat(solution.price || 0) : 0;

  return (
    <main className="min-h-screen bg-gray-100 py-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-[#071A3D]">Secure Checkout</h1>
          <p className="text-gray-500 mt-4">
            Complete your purchase and unlock premium study materials.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-[#071A3D] mb-8">
                Billing Details
              </h2>
              <div className="space-y-3 text-gray-600">
                <p>
                  <span className="font-semibold">Name:</span>{" "}
                  {session?.user?.name || "Login karo pehle"}
                </p>
                <p>
                  <span className="font-semibold">Email:</span>{" "}
                  {session?.user?.email || "—"}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm mt-8">
              <h2 className="text-2xl font-bold text-[#071A3D] mb-6">
                Payment Method
              </h2>
              <div className="border border-orange-200 rounded-2xl p-5 flex items-center gap-4">
                <FaCreditCard size={30} className="text-orange-500" />
                <div>
                  <h3 className="font-semibold">Razorpay Payment Gateway</h3>
                  <p className="text-gray-500 text-sm">
                    UPI (QR), Debit Card, Credit Card, Net Banking
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-3xl p-8 shadow-sm sticky top-24">
              <h2 className="text-2xl font-bold text-[#071A3D]">Order Summary</h2>

              {/* ── NEW: PDF preview ek choti thumbnail jaisi, product image ki tarah ── */}
              <div className="border-t mt-6 pt-6">
                {solution?.preview_blob_name ? (
                  <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
                    <iframe
                      src={`/api/preview?id=${solution.id}`}
                      className="w-full h-[260px]"
                      title="PDF preview"
                    />
                  </div>
                ) : null}

                <div className="flex items-center gap-3">
                  <FaFilePdf className="text-red-500" size={25} />
                  <div>
                    <h3 className="font-semibold">{solution?.title || "—"}</h3>
                    <p className="text-sm text-gray-500">
                      {solution?.solution_type || ""}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-orange-500">₹{price.toFixed(0)}</span>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <div className="flex gap-3 items-center">
                  <FaCheckCircle className="text-green-500" />
                  <p>Instant Access</p>
                </div>
                <div className="flex gap-3 items-center">
                  <FaCheckCircle className="text-green-500" />
                  <p>Premium Notes</p>
                </div>
                <div className="flex gap-3 items-center">
                  <FaCheckCircle className="text-green-500" />
                  <p>Lifetime Access</p>
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm mt-4 text-center">{error}</p>
              )}

              <button
                onClick={handlePay}
                disabled={paying || !solution}
                className="w-full mt-8 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-semibold transition"
              >
                {paying ? "Processing..." : `Pay ₹${price.toFixed(0)}`}
              </button>

              <div className="flex justify-center items-center gap-2 mt-5 text-gray-500 text-sm">
                <FaLock />
                <span>100% Secure Payment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}