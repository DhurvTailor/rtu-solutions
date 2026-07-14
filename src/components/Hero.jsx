


"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FaBookOpen,
  FaFileAlt,
  FaYoutube,
  FaQuestionCircle,
  FaWhatsapp,
  FaPhone,
  FaInstagram,
  FaStar,
  FaStarHalfAlt,
  FaArrowRight,
} from "react-icons/fa";
import SolutionSearchBar from "./SolutionSearchBar"; // ← NEW

export default function Hero() {
   
  const students = [
  "/studentimg/student1.webp",
  "/studentimg/student2.webp",
  "/studentimg/student3.webp",
  "/studentimg/student4.webp",
];

  const ContactUs = () => [
    {
      icon: <FaWhatsapp className="text-green-500" size={24} />,
      label: "Chat with RTU Solutions on WhatsApp",
      link: "https://whatsapp.com/channel/0029Vb791ri6WaKwNqG93F1K",
    },
    {
      icon: <FaPhone className="text-blue-500" size={24} />,
      label: "Call RTU Solutions",
      link: "tel:+9521634141",
    },
    {
      icon: <FaInstagram className="text-pink-500" size={24} />,
      label: "Follow RTU Solutions on Instagram",
      link: "https://www.instagram.com/rtu_solutions/",
    },
  ];

  return (
    <section
      className="relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-orange-50"
      aria-label="RTU Solutions Hero Section"
    >
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28 text-center">
        <span className="inline-block bg-white border border-orange-500/30 text-orange-500 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
          🎓 Your Success, Our Mission
        </span>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#0B1F3F] leading-[1.1] tracking-tight">
          RTU Solutions
          <br />
          <span className="text-orange-500">
            Notes, PYQ &amp; Video Lectures
          </span>
        </h1>

  

        {/* NEW: RTU Sold Paper Search */}
        <div className="mt-10">
          <SolutionSearchBar />
        </div>

        <div className="flex flex-wrap justify-center gap-5 mt-8 text-gray-700 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <FaBookOpen className="text-orange-500" /> Notes
          </div>
          <div className="flex items-center gap-2">
            <FaFileAlt className="text-orange-500" /> PYQ
          </div>
          <div className="flex items-center gap-2">
            <FaQuestionCircle className="text-orange-500" /> Important
            Questions
          </div>
          <div className="flex items-center gap-2">
            <FaYoutube className="text-orange-500" /> Video Lectures
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <button
            onClick={() =>
              document
                .getElementById("notes-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="group flex items-center gap-2 bg-[#0B1F3F] hover:bg-[#132a52] text-white pl-6 pr-3 py-3 rounded-full font-semibold transition"
          >
            Explore Notes
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#0B1F3F] group-hover:translate-x-0.5 transition-transform">
              <FaArrowRight size={12} />
            </span>
          </button>

          <Link
            href="https://www.youtube.com/@RTU-Solutions"
            className="flex items-center px-6 py-3 rounded-full font-semibold text-[#0B1F3F] border border-gray-300 hover:border-orange-500 hover:text-orange-500 transition"
          >
            Watch Videos
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
        <div className="flex -space-x-3">
          {students.map((student, index) => (
            <Image
              key={index}   
              src={student}
              alt={`Student ${index + 1}`}
              width={40}
              height={20} 
              className="rounded-full border-2 border-white shadow-sm"
            />  
          ))}
          </div>
        


          <div className="flex items-center gap-2">
            <div className="flex text-orange-500">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStarHalfAlt />
            </div>
            <span className="text-gray-500 text-sm">
              Trusted by 1000+ RTU students
            </span>
          </div>
        </div>
      </div>

      <div className="fixed right-3 md:right-6 bottom-4 md:bottom-40 z-50 flex flex-col gap-1">
        {ContactUs().map((contact, index) => (
          <a
            key={index}
            href={contact.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={contact.label}
            title={contact.label}
            className="w-12 h-12 md:w-14 md:h-14
                       flex items-center justify-center
                       bg-white
                       rounded-full
                       border-2 border-orange-500
                       shadow-xl
                       hover:scale-110
                       hover:shadow-2xl
                       transition-all duration-300"
          >
            {contact.icon}
          </a>
        ))}
      </div>
    </section>
  );
}