"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiMapPin , FiLock } from "react-icons/fi"; 

const SLIDES = [
  { src: "/contactimg/callimg.webp", caption: "Solved papers, semester-wise" },
  { src: "/contactimg/whatappimg.webp", caption: "Notes made by toppers" },
  { src: "/contactimg/youtubeimg.webp", caption: "Trusted by 1000+ RTU students" },
];

function ContactSlider() {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    clearInterval(timerRef.current);
    setIndex(i);
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
  };

  return (
   <div className="relative w-full aspect-9/16 md:aspect-auto md:h-full overflow-hidden rounded-2xl">
  {SLIDES.map((slide, i) => (
    <div
      key={i}
      className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
        i === index ? "opacity-100" : "opacity-0"
      }`}
    >
      <img
        src={slide.src}
        alt={slide.caption}
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#1B2A4A]/80 via-transparent to-transparent" />
      <p className="absolute bottom-6 left-6 right-6 font-(family-name:--font-fraunces) text-lg font-semibold text-white">
        {slide.caption}
      </p>
    </div>
  ))}

  <div className="absolute bottom-6 right-6 flex gap-2">
    {SLIDES.map((_, i) => (
      <button
        key={i}
        onClick={() => goTo(i)}
        aria-label={`Slide ${i + 1}`}
        className={`h-2 rounded-full transition-all ${
          i === index ? "w-6 bg-[#E8A33D]" : "w-2 bg-white/60"
        }`}
      />
    ))}
  </div>
</div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "student",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Kuch galat ho gaya");
        return;
      }
      toast.success("Aapka message bhej diya gaya hai! Hum jald hi reply karenge.");
      setFormData({ name: "", phone: "", email: "", role: "student", subject: "", message: "" });
    } catch {
      toast.error("Network error, dobara try karein");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent border-b-2 border-[#E4DCC8] focus:border-[#E8A33D] outline-none py-2 text-[15px] text-[#1B2A4A] placeholder:text-[#8A8578] transition-colors";
  const labelClass = "text-xs font-semibold uppercase tracking-wide text-[#8A8578] mb-1 block";

  return (
    <div className="bg-[#FAF6EE] min-h-screen">
      {/* Eyebrow + heading */}
      <div className="max-w-5xl mx-auto px-4 pt-14 pb-8 text-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#E8A33D]">
          Get In Touch
        </span>
        <h1 className="font-(family-name:--font-fraunces) text-3xl md:text-4xl font-semibold text-[#1B2A4A] mt-2">
          Doubt, query & feedback — Send Me
        </h1>
        <p className="text-[#8A8578] mt-2 text-sm max-w-md mx-auto">
          Team RTU Solutions 24 ghanton ke andar reply karti hai — WhatsApp, email ya call par.
        </p>
      </div>

      {/* Slider + Form card with perforated seam */}
      <div className="max-w-5xl mx-auto px-4">
        <div className="relative bg-white rounded-3xl shadow-sm border border-[#E4DCC8] grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Left: slider */}
          <div className="p-3 md:h-full">
            <ContactSlider />
          </div>
          
          {/* Perforated seam (desktop only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-10">
            <div className="h-full border-l-2 border-dashed border-[#E4DCC8]" />
            <span className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-[#FAF6EE]" />
            <span className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-[#FAF6EE]" />
          </div>

          {/* Right: form */}
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Naam *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="Aapka naam" />
              </div>
              <div>
                <label className={labelClass}>Mobile *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required pattern="[6-9]{1}[0-9]{9}" maxLength={10} className={inputClass} placeholder="98XXXXXXXX" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Email *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="you@example.com" />
            </div>

            <div>
              <label className={labelClass}>Aap kaun hain? *</label>
              <select name="role" value={formData.role} onChange={handleChange} required className={`${inputClass} appearance-none cursor-pointer`}>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Subject</label>
              <input type="text" name="subject" value={formData.subject} onChange={handleChange} className={inputClass} placeholder="Kis baare mein?" />
            </div>

            <div>
              <label className={labelClass}>Message *</label>
              <textarea name="message" value={formData.message} onChange={handleChange} required rows={3} className={`${inputClass} resize-none`} placeholder="Apni query likhein..." />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1B2A4A] hover:bg-[#233657] text-white py-3 rounded-xl font-semibold text-sm transition-colors disabled:opacity-60"
            >
              {loading ? "Bhej rahe hain..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>

      {/* Useful info cards below form */}
           {/* Why Contact Us section */}
<div className="max-w-5xl mx-auto px-4 mt-10">
  <div className="bg-white border border-[#E4DCC8] rounded-3xl p-6 md:p-10">
    <h2 className="font-(family-name:--font-fraunces) text-2xl text-center md:text-3xl font-semibold text-[#1B2A4A] mb-8">
      Why Contact RTU Solutions?
    </h2>

 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
  {/* Left Image */}
  <div className="relative">
    <div className="relative overflow-hidden rounded-t-[220px] rounded-b-[32px] border border-[#E8E2D5] bg-white shadow-xl">
      <img
        src="/contactimg/support.webp"
        alt="RTU Solutions Support Team"
        className="w-full h-full object-cover object-top"
      />
    </div>

    {/* Decorative Circle */}
    <div className="absolute -bottom-5 -left-5 w-24 h-24 rounded-full bg-[#1B2A4A]" />

    {/* Floating Badge */}
    <div className="absolute top-6 right-6 bg-white rounded-2xl shadow-lg px-5 py-3 border border-gray-100">
      <p className="text-sm font-medium text-[#1B2A4A]">
        Student Support
      </p>
      <p className="text-xs text-gray-500">
        Fast & Reliable
      </p>
    </div>
  </div>

  {/* Right Content */}
  <div>
    <span className="inline-block px-4 py-1.5 rounded-full bg-[#FFF3E0] text-[#E8A33D] text-sm font-semibold mb-4">
      Why Choose Us
    </span>

    <h2 className="text-3xl md:text-4xl font-bold text-[#1B2A4A] leading-tight">
      We're Always Here <br />
      To Help You
    </h2>

    <p className="mt-5 text-gray-600 leading-7">
      Our support team is dedicated to helping RTU students with
      notes, previous year papers, important questions, and any
      academic queries. Get quick, friendly, and reliable assistance
      whenever you need it.
    </p>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

      {[
        {
          title: "Quick Response",
          desc: "Replies within 24 hours.",
          icon: <FiUser />,
        },
        {
          title: "WhatsApp Support",
          desc: "Connect directly with our team.",
          icon: <FiMail />,
        },
        {
          title: "Real Assistance",
          desc: "Every query answered by real people.",
          icon: <FiUser />,
        },
        {
          title: "Privacy First",
          desc: "Your information stays secure.",
          icon: <FiLock />,
        },
      ].map((item, i) => (
        <div
          key={i}
          className="bg-white border border-[#ECE7DB] rounded-2xl p-5 hover:shadow-lg transition-all duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-[#FFF3E0] flex items-center justify-center text-2xl mb-4">
            {item.icon}
          </div>

          <h3 className="font-semibold text-[#1B2A4A]">
            {item.title}
          </h3>

          <p className="text-sm text-gray-600 mt-2 leading-6">
            {item.desc}
          </p>
        </div>
      ))}

    </div>
  </div>
</div>
  </div>
</div>

      {/* Map */}
      <div className="max-w-5xl mx-auto px-4 mt-10 pb-16">
        <div className="rounded-2xl overflow-hidden border border-[#E4DCC8] shadow-sm">
          <iframe
            title="RTU Solutions Location"
            src="https://www.google.com/maps?q=Suraj+Nagar,+Jhotwara,+Jaipur,+Rajasthan+302012&output=embed"
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}