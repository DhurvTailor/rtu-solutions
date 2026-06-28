"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FaPhone, FaUniversity, FaCity,
  FaSave, FaArrowLeft, FaCheckCircle,
} from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

function InputField({ icon, label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-gray-300 text-sm font-medium mb-1.5 block">
        {label}
      </label>
      <div className="flex items-center gap-3 bg-[#071A3D] border border-white/10 focus-within:border-orange-500/60 rounded-xl px-4 py-3 transition">
        <span className="text-sm shrink-0">{icon}</span>
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="bg-transparent text-white text-sm placeholder-gray-500 outline-none w-full"
        />
      </div>
    </div>
  );
}

export default function StudentInfoPage() {
  const { status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    phone_numberA: "",
    phone_numberB: "",
    college: "",
    city: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/profile/student-info")
      .then((r) => r.json())
      .then((data) => {
        if (data.info) {
          setForm({
            phone_numberA: data.info.phone_numberA || "",
            phone_numberB: data.info.phone_numberB || "",
            college: data.info.college || "",
            city: data.info.city || "",
          });
          setSaved(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [status]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaved(false);
  };

  const handleSubmit = async () => {
    if (!form.phone_numberA.trim()) {
      toast.error("Primary phone number zaroori hai");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/profile/student-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Information save ho gayi!");
        setSaved(true);
      } else {
        toast.error(data.error || "Save nahi hua, dobara try karo");
      }
    } catch {
      toast.error("Network error, dobara try karo");
    }
    setSaving(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-[#050f24] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050f24] py-10 px-4">
      <div className="max-w-xl mx-auto">

        {/* Back */}
        <Link
          href="/profile"
          className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition mb-6 text-sm"
        >
          <FaArrowLeft size={12} />
          Back to Profile
        </Link>

        <div className="bg-[#0d2454] border border-orange-500/20 rounded-2xl p-6 space-y-6">

          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-white text-xl font-bold">Student Information</h1>
              <p className="text-gray-400 text-sm mt-1">
                College, phone aur city details save karo
              </p>
            </div>
            {saved && (
              <span className="flex items-center gap-1.5 text-xs text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                <FaCheckCircle size={10} />
                Saved
              </span>
            )}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <InputField
              icon={<FaPhone className="text-orange-400" />}
              label="Primary Phone Number *"
              name="phone_numberA"
              value={form.phone_numberA}
              onChange={handleChange}
              placeholder="e.g. 9876543210"
              type="tel"
            />
            <InputField
              icon={<FaPhone className="text-gray-500" />}
              label="Secondary Phone (optional)"
              name="phone_numberB"
              value={form.phone_numberB}
              onChange={handleChange}
              placeholder="e.g. 9876543211"
              type="tel"
            />
            <InputField
              icon={<FaUniversity className="text-blue-400" />}
              label="College Name"
              name="college"
              value={form.college}
              onChange={handleChange}
              placeholder="e.g. Government Engineering College, Ajmer"
            />
            <InputField
              icon={<FaCity className="text-green-400" />}
              label="City"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="e.g. Jaipur"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition active:scale-95"
          >
            {saving ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FaSave size={14} />
            )}
            {saving ? "Saving..." : "Save Information"}
          </button>
        </div>
      </div>
    </div>
  );
}



// "use client";
// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import { redirect } from "next/navigation";
// import { FaPhone, FaUniversity, FaCity, FaSave, FaArrowLeft } from "react-icons/fa";
// import Link from "next/link";

// export default function StudentInfoPage() {
//   const { data: session, status } = useSession();
//   const [form, setForm] = useState({
//     phone_numberA: "",
//     phone_numberB: "",
//     college: "",
//     city: "",
//   });
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [msg, setMsg] = useState(null); // { type: 'success'|'error', text }

//   // Fetch existing student info
//   useEffect(() => {
//     if (status === "authenticated") {
//       fetch("/api/profile/student-info")
//         .then((r) => r.json())
//         .then((data) => {
//           if (data.info) {
//             setForm({
//               phone_numberA: data.info.phone_numberA || "",
//               phone_numberB: data.info.phone_numberB || "",
//               college: data.info.college || "",
//               city: data.info.city || "",
//             });
//           }
//           setLoading(false);
//         })
//         .catch(() => setLoading(false));
//     }
//   }, [status]);

//   if (status === "loading" || loading) {
//     return (
//       <div className="min-h-screen bg-[#050f24] flex items-center justify-center">
//         <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   if (status === "unauthenticated") redirect("/login");

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//     setMsg(null);
//   };

//   const handleSubmit = async () => {
//     setSaving(true);
//     setMsg(null);
//     try {
//       const res = await fetch("/api/profile/student-info", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (res.ok) {
//         setMsg({ type: "success", text: "Information saved successfully!" });
//       } else {
//         setMsg({ type: "error", text: data.error || "Save failed. Try again." });
//       }
//     } catch {
//       setMsg({ type: "error", text: "Network error. Try again." });
//     }
//     setSaving(false);
//   };

//   return (
//     <div className="min-h-screen bg-[#050f24] py-10 px-4">
//       <div className="max-w-xl mx-auto">
//         {/* Back */}
//         <Link
//           href="/profile"
//           className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition mb-6 text-sm"
//         >
//           <FaArrowLeft />
//           Back to Profile
//         </Link>

//         <div className="bg-[#0d2454] border border-orange-500/20 rounded-2xl p-6 space-y-6">
//           <div>
//             <h1 className="text-white text-xl font-bold">Student Information</h1>
//             <p className="text-gray-400 text-sm mt-1">
//               Ye information sirf tumhare profile mein save hogi
//             </p>
//           </div>

//           {/* Form */}
//           <div className="space-y-4">
//             <InputField
//               icon={<FaPhone className="text-orange-400" />}
//               label="Primary Phone Number"
//               name="phone_numberA"
//               value={form.phone_numberA}
//               onChange={handleChange}
//               placeholder="e.g. 9876543210"
//               type="tel"
//             />
//             <InputField
//               icon={<FaPhone className="text-gray-400" />}
//               label="Secondary Phone (optional)"
//               name="phone_numberB"
//               value={form.phone_numberB}
//               onChange={handleChange}
//               placeholder="e.g. 9876543211"
//               type="tel"
//             />
//             <InputField
//               icon={<FaUniversity className="text-blue-400" />}
//               label="College Name"
//               name="college"
//               value={form.college}
//               onChange={handleChange}
//               placeholder="e.g. Government Engineering College, Ajmer"
//             />
//             <InputField
//               icon={<FaCity className="text-green-400" />}
//               label="City"
//               name="city"
//               value={form.city}
//               onChange={handleChange}
//               placeholder="e.g. Jaipur"
//             />
//           </div>

//           {/* Message */}
//           {msg && (
//             <div
//               className={`text-sm px-4 py-3 rounded-lg ${
//                 msg.type === "success"
//                   ? "bg-green-500/10 text-green-400 border border-green-500/20"
//                   : "bg-red-500/10 text-red-400 border border-red-500/20"
//               }`}
//             >
//               {msg.text}
//             </div>
//           )}

//           {/* Save Button */}
//           <button
//             onClick={handleSubmit}
//             disabled={saving}
//             className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition"
//           >
//             {saving ? (
//               <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//             ) : (
//               <FaSave />
//             )}
//             {saving ? "Saving..." : "Save Information"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function InputField({ icon, label, name, value, onChange, placeholder, type = "text" }) {
//   return (
//     <div>
//       <label className="text-gray-300 text-sm font-medium mb-1.5 block">
//         {label}
//       </label>
//       <div className="flex items-center gap-3 bg-[#071A3D] border border-white/10 focus-within:border-orange-500/60 rounded-xl px-4 py-3 transition">
//         <span className="text-sm">{icon}</span>
//         <input
//           type={type}
//           name={name}
//           value={value}
//           onChange={onChange}
//           placeholder={placeholder}
//           className="bg-transparent text-white text-sm placeholder-gray-500 outline-none w-full"
//         />
//       </div>
//     </div>
//   );
// }