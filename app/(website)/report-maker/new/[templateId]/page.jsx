// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import Image from "next/image";
// import Script from "next/script";
// import { FaCheckCircle } from "react-icons/fa";

// const emptyForm = {
//   college_id: "",
//   training_company_id: "",
//   branch_id: "",
//   degree_id: "",
//   semester_id: "",
//   academic_session: "",
//   student_name: "",
//   roll_no: "",
//   guide_name: "",
//   hod_name: "",
//   training_start_date: "",
//   training_end_date: "",
// };

// export default function NewReportPage() {
//   const { templateId } = useParams();
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   const [reportData, setReportData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [form, setForm] = useState(emptyForm);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [selectedCollege, setSelectedCollege] = useState(null);

//   useEffect(() => {
//     async function loadData() {
//       try {
//         const res = await fetch("/api/report-data");
//         const data = await res.json();
//         if (data.error) throw new Error(data.error);
//         setReportData(data);
//       } catch (e) {
//         setError("Form data load nahi ho paaya");
//       } finally {
//         setLoading(false);
//       }
//     }
//     loadData();
//   }, []);

//   useEffect(() => {
//     if (!reportData || !form.college_id) {
//       setSelectedCollege(null);
//       return;
//     }
//     const college = reportData.colleges.find(
//       (c) => String(c.id) === String(form.college_id)
//     );
//     setSelectedCollege(college || null);
//   }, [form.college_id, reportData]);

//   function handleChange(field, value) {
//     setForm((f) => ({ ...f, [field]: value }));
//   }

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");

//     if (status !== "authenticated") {
//       router.push("/login");
//       return;
//     }

//     for (const [key, value] of Object.entries(form)) {
//       if (!value) {
//         setError("Sabhi fields fill karna zaroori hai");
//         return;
//       }
//     }

//     setSubmitting(true);
//     try {
//       // 1. Student report record banao (pending)
//       const createRes = await fetch("/api/student-reports", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           content_template_id: templateId,
//           ...form,
//         }),
//       });
//       const createData = await createRes.json();
//       if (!createData.success) throw new Error(createData.error || "Report create nahi hua");

//       const studentReportId = createData.id;

//       // 2. Razorpay order banao
//       const orderRes = await fetch("/api/payment/report/create-order", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ student_report_id: studentReportId }),
//       });
//       const orderData = await orderRes.json();
//       if (!orderData.success) throw new Error(orderData.error || "Payment order nahi bana");

//       // 3. Razorpay checkout kholo
//       const rzp = new window.Razorpay({
//         key: orderData.keyId,
//         amount: orderData.amount,
//         currency: "INR",
//         name: "RTU Solutions",
//         description: orderData.title,
//         order_id: orderData.orderId,
//         theme: { color: "#0B1F3F" },
//         handler: async function (response) {
//           try {
//             const verifyRes = await fetch("/api/payment/report/verify", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               }),
//             });
//             const verifyData = await verifyRes.json();
//             if (!verifyData.success) throw new Error(verifyData.error || "Payment verify fail hua");

//             router.push(`/report-maker/success/${studentReportId}`);
//           } catch (err) {
//             setError(err.message);
//             setSubmitting(false);
//           }
//         },
//         modal: {
//           ondismiss: function () {
//             setSubmitting(false);
//           },
//         },
//       });

//       rzp.on("payment.failed", function (resp) {
//         setError(resp.error?.description || "Payment fail ho gaya");
//         setSubmitting(false);
//       });

//       rzp.open();
//     } catch (err) {
//       setError(err.message);
//       setSubmitting(false);
//     }
//   }

//   if (loading) {
//     return <div className="max-w-3xl mx-auto px-5 py-16 text-center">Loading...</div>;
//   }

//   if (error && !reportData) {
//     return <div className="max-w-3xl mx-auto px-5 py-16 text-center text-red-600">{error}</div>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto px-5 py-10">
//       <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

//       <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3F] mb-1">
//         Report Details Fill Karo
//       </h1>
//       <p className="text-gray-500 mb-8">
//         Sahi details bharo — yehi report ke andar aur certificate par print hongi.
//       </p>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div className="grid sm:grid-cols-2 gap-5">
//           <div>
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               Student Name
//             </label>
//             <input
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
//               value={form.student_name}
//               onChange={(e) => handleChange("student_name", e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               Roll No. / Enrollment No.
//             </label>
//             <input
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
//               value={form.roll_no}
//               onChange={(e) => handleChange("roll_no", e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               Degree
//             </label>
//             <select
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F] bg-white"
//               value={form.degree_id}
//               onChange={(e) => handleChange("degree_id", e.target.value)}
//             >
//               <option value="">Select karo</option>
//               {reportData.degrees.map((d) => (
//                 <option key={d.id} value={d.id}>{d.name}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               Branch / Department
//             </label>
//             <select
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F] bg-white"
//               value={form.branch_id}
//               onChange={(e) => handleChange("branch_id", e.target.value)}
//             >
//               <option value="">Select karo</option>
//               {reportData.branches.map((b) => (
//                 <option key={b.id} value={b.id}>
//                   {b.name} ({b.degree_name})
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               Semester
//             </label>
//             <select
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F] bg-white"
//               value={form.semester_id}
//               onChange={(e) => handleChange("semester_id", e.target.value)}
//             >
//               <option value="">Select karo</option>
//               {reportData.semesters.map((s) => (
//                 <option key={s.id} value={s.id}>Semester {s.semester_number}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               Academic Session
//             </label>
//             <input
//               placeholder="e.g. 2024-25"
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
//               value={form.academic_session}
//               onChange={(e) => handleChange("academic_session", e.target.value)}
//             />
//           </div>

//           <div className="sm:col-span-2">
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               College
//             </label>
//             <select
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F] bg-white"
//               value={form.college_id}
//               onChange={(e) => handleChange("college_id", e.target.value)}
//             >
//               <option value="">Select karo</option>
//               {reportData.colleges.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name} — {c.university_name}
//                 </option>
//               ))}
//             </select>

//             {selectedCollege && (
//               <div className="flex items-center gap-3 mt-3 bg-gray-50 rounded-xl px-4 py-3">
//                 {selectedCollege.logo_url ? (
//                   <Image
//                     src={selectedCollege.logo_url}
//                     alt={selectedCollege.name}
//                     width={36}
//                     height={36}
//                     className="rounded-full object-contain bg-white"
//                   />
//                 ) : (
//                   <div className="w-9 h-9 rounded-full bg-gray-200" />
//                 )}
//                 <div className="text-sm">
//                   <p className="font-medium text-[#0B1F3F]">{selectedCollege.name}</p>
//                   <p className="text-gray-500 text-xs">{selectedCollege.university_name}</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               Training Company
//             </label>
//             <select
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F] bg-white"
//               value={form.training_company_id}
//               onChange={(e) => handleChange("training_company_id", e.target.value)}
//             >
//               <option value="">Select karo</option>
//               {reportData.trainingCompanies.map((c) => (
//                 <option key={c.id} value={c.id}>{c.name}</option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               Guide Name
//             </label>
//             <input
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
//               value={form.guide_name}
//               onChange={(e) => handleChange("guide_name", e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               HOD Name
//             </label>
//             <input
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
//               value={form.hod_name}
//               onChange={(e) => handleChange("hod_name", e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               Training Start Date
//             </label>
//             <input
//               type="date"
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
//               value={form.training_start_date}
//               onChange={(e) => handleChange("training_start_date", e.target.value)}
//             />
//           </div>

//           <div>
//             <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
//               Training End Date
//             </label>
//             <input
//               type="date"
//               className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
//               value={form.training_end_date}
//               onChange={(e) => handleChange("training_end_date", e.target.value)}
//             />
//           </div>
//         </div>

//         {error && <p className="text-red-600 text-sm">{error}</p>}

//         <button
//           type="submit"
//           disabled={submitting}
//           className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-60"
//         >
//           {submitting ? "Processing..." : (
//             <>
//               <FaCheckCircle /> Payment Karke Report Banao
//             </>
//           )}
//         </button>
//       </form>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Script from "next/script";
import { FaCheckCircle, FaBuilding } from "react-icons/fa";

const emptyForm = {
  college_id: "",
  training_company_id: "",
  branch_id: "",
  degree_id: "",
  semester_id: "",
  academic_session: "",
  student_name: "",
  roll_no: "",
  guide_name: "",
  hod_name: "",
  training_start_date: "",
  training_end_date: "",
};

export default function NewReportPage() {
  const { templateId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/report-data");
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setReportData(data);
      } catch (e) {
        setError("Form data load nahi ho paaya");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!reportData || !form.college_id) {
      setSelectedCollege(null);
      return;
    }
    const college = reportData.colleges.find(
      (c) => String(c.id) === String(form.college_id)
    );
    setSelectedCollege(college || null);
  }, [form.college_id, reportData]);

  useEffect(() => {
    if (!reportData || !form.training_company_id) {
      setSelectedCompany(null);
      return;
    }
    const company = reportData.trainingCompanies.find(
      (c) => String(c.id) === String(form.training_company_id)
    );
    setSelectedCompany(company || null);
  }, [form.training_company_id, reportData]);

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (status !== "authenticated") {
      router.push("/login");
      return;
    }

    for (const [key, value] of Object.entries(form)) {
      if (!value) {
        setError("Sabhi fields fill karna zaroori hai");
        return;
      }
    }

    setSubmitting(true);
    try {
      // 1. Student report record banao (pending)
      const createRes = await fetch("/api/student-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_template_id: templateId,
          ...form,
        }),
      });
      const createData = await createRes.json();
      if (!createData.success) throw new Error(createData.error || "Report create nahi hua");

      const studentReportId = createData.id;

      // 2. Razorpay order banao
      const orderRes = await fetch("/api/payment/report/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_report_id: studentReportId }),
      });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error(orderData.error || "Payment order nahi bana");

      // 3. Razorpay checkout kholo
      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: "INR",
        name: "RTU Solutions",
        description: orderData.title,
        order_id: orderData.orderId,
        theme: { color: "#0B1F3F" },
        handler: async function (response) {
          try {
            const verifyRes = await fetch("/api/payment/report/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyData.success) throw new Error(verifyData.error || "Payment verify fail hua");

            router.push(`/report-maker/success/${studentReportId}`);
          } catch (err) {
            setError(err.message);
            setSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      });

      rzp.on("payment.failed", function (resp) {
        setError(resp.error?.description || "Payment fail ho gaya");
        setSubmitting(false);
      });

      rzp.open();
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-5 py-16 text-center">Loading...</div>;
  }

  if (error && !reportData) {
    return <div className="max-w-3xl mx-auto px-5 py-16 text-center text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <h1 className="text-2xl md:text-3xl font-bold text-[#0B1F3F] mb-1">
        Report Details Fill Karo
      </h1>
      <p className="text-gray-500 mb-8">
        Sahi details bharo — yehi report ke andar aur certificate par print hongi.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              Student Name
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
              value={form.student_name}
              onChange={(e) => handleChange("student_name", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              Roll No. / Enrollment No.
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
              value={form.roll_no}
              onChange={(e) => handleChange("roll_no", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              Degree
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F] bg-white"
              value={form.degree_id}
              onChange={(e) => handleChange("degree_id", e.target.value)}
            >
              <option value="">Select karo</option>
              {reportData.degrees.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              Branch / Department
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F] bg-white"
              value={form.branch_id}
              onChange={(e) => handleChange("branch_id", e.target.value)}
            >
              <option value="">Select karo</option>
              {reportData.branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.degree_name})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              Semester
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F] bg-white"
              value={form.semester_id}
              onChange={(e) => handleChange("semester_id", e.target.value)}
            >
              <option value="">Select karo</option>
              {reportData.semesters.map((s) => (
                <option key={s.id} value={s.id}>Semester {s.semester_number}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              Academic Session
            </label>
            <input
              placeholder="e.g. 2024-25"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
              value={form.academic_session}
              onChange={(e) => handleChange("academic_session", e.target.value)}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              College
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F] bg-white"
              value={form.college_id}
              onChange={(e) => handleChange("college_id", e.target.value)}
            >
              <option value="">Select karo</option>
              {reportData.colleges.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.university_name}
                </option>
              ))}
            </select>

            {selectedCollege && (
              <div className="flex items-center gap-3 mt-3 bg-gray-50 rounded-xl px-4 py-3">
                {selectedCollege.logo_url ? (
                  <Image
                    src={selectedCollege.logo_url}
                    alt={selectedCollege.name}
                    width={36}
                    height={36}
                    className="rounded-full object-contain bg-white"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-200" />
                )}
                <div className="text-sm">
                  <p className="font-medium text-[#0B1F3F]">{selectedCollege.name}</p>
                  <p className="text-gray-500 text-xs">{selectedCollege.university_name}</p>
                </div>
              </div>
            )}
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              Training Company
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F] bg-white"
              value={form.training_company_id}
              onChange={(e) => handleChange("training_company_id", e.target.value)}
            >
              <option value="">Select karo</option>
              {reportData.trainingCompanies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {selectedCompany && (
              <div className="flex items-start gap-3 mt-3 bg-gray-50 rounded-xl px-4 py-3">
                <div className="w-9 h-9 rounded-full bg-[#0B1F3F]/5 flex items-center justify-center text-[#0B1F3F] shrink-0">
                  <FaBuilding size={14} />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-[#0B1F3F]">{selectedCompany.name}</p>
                  {selectedCompany.description && (
                    <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">
                      {selectedCompany.description}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              Guide Name
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
              value={form.guide_name}
              onChange={(e) => handleChange("guide_name", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              HOD Name
            </label>
            <input
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
              value={form.hod_name}
              onChange={(e) => handleChange("hod_name", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              Training Start Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
              value={form.training_start_date}
              onChange={(e) => handleChange("training_start_date", e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[#0B1F3F] block mb-1.5">
              Training End Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-[#0B1F3F]"
              value={form.training_end_date}
              onChange={(e) => handleChange("training_end_date", e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-60"
        >
          {submitting ? "Processing..." : (
            <>
              <FaCheckCircle /> Payment Karke Report Banao
            </>
          )}
        </button>
      </form>
    </div>
  );
}