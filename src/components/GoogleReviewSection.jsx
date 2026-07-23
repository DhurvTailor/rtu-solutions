"use client";

import Image from "next/image";
import Link from "next/link";
import { FaGoogle, FaStar, FaCheckCircle } from "react-icons/fa";

export default function GoogleReviewSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-6"> 
          <h2 className="mt-5 text-center text-2xl md:text-5xl font-extrabold text-gray-900 leading-tight">
    Rate RTU Solutions on Google 
   
  </h2>
        <div className=" rounded-3xl   overflow-hidden">
     
          <div className="grid lg:grid-cols-2 gap-10 items-center p-8 md:p-12">

            {/* Left Side */}
<div className="flex justify-center">
  <div className="bg-white border-4 border-blue-100 rounded-3xl p-5 shadow-lg hover:scale-105 duration-300">
       
    {/* Scanner Wrapper */}
    <div className="relative rounded-xl overflow-hidden border border-blue-100">
      
      <Image
        src="/google-review-qr.webp"
        alt="RTU Solutions Google Review QR"
        width={280}
        height={280}
        className="rounded-xl block"
      />

      {/* Scanning Line */}
      <div className="scan-line" />

      {/* Corner Brackets */}
      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />

    </div>

    {/* Label */}
    <div className="mt-3 flex items-center justify-center gap-2">
      <FaGoogle className="text-[#4285F4] text-sm" />
      <span className="text-xs font-semibold text-[#4285F4] tracking-wide">SCAN TO REVIEW</span>
    </div>

  </div>
</div>

            {/* Right Side */}
<div>

  {/* Header */}
  <div className="flex items-start gap-4 mb-5">
    <div className="bg-[#E8F0FE] border border-[#c5d8fd] w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
      <FaGoogle className="text-[#4285F4] text-xl" />
    </div>
    <div>
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="text-2xl font-bold text-gray-900 leading-tight">
          Scan & Review
        </h2>
        {/* <span className="bg-[#E8F0FE] text-[#185FA5] text-xs font-bold px-3 py-1 rounded-full border border-[#c5d8fd] tracking-wide">
          RTU Solutions
        </span> */}
      </div>
      <div className="flex items-center gap-1 mt-1.5">
        <FaStar className="text-yellow-400 text-sm" />
        <FaStar className="text-yellow-400 text-sm" />
        <FaStar className="text-yellow-400 text-sm" />
        <FaStar className="text-yellow-400 text-sm" />
        <FaStar className="text-yellow-400 text-sm" />
        <span className="text-xs text-gray-500 ml-1 font-medium">5.0 · Google Reviews</span>
      </div>
    </div>
  </div>

  {/* Description - left accent border */}
  <div className="bg-[#F8FAFF] border border-[#E0EAFF] border-l-[3px] border-l-[#4285F4] rounded-xl px-4 py-3 mb-6">
    <p className="text-sm text-gray-700 leading-7">
      Your review helps thousands of RTU students discover trusted
      study notes, previous year papers, important questions and
      exam-focused learning resources.
    </p>
  </div>

  {/* Checklist - card style */}
  <div className="flex flex-col gap-2.5 mb-7">
    {[
      "Trusted by RTU Students",
      "Quality Notes & PYQs",
      "Fast & Easy Learning",
      "Your Feedback Makes Us Better",
    ].map((item) => (
      <div
        key={item}
        className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 py-2.5"
      >
        <div className="bg-green-100 rounded-full w-7 h-7 flex items-center justify-center flex-shrink-0">
          <FaCheckCircle className="text-green-600 text-sm" />
        </div>
        <span className="text-sm text-gray-800 font-medium">{item}</span>
      </div>
    ))}
  </div>

  {/* CTA */}
  <div className="flex items-center gap-4 flex-wrap">
    <Link
      href="https://g.page/r/CTBqRkf_jgrlEAE/review"
      target="_blank"
      className="inline-flex items-center gap-2.5 bg-[#4285F4] hover:bg-[#3367D6] text-white px-7 py-3.5 rounded-full font-semibold text-[15px] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
    >
      <FaGoogle />
      Leave a Google Review
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{opacity: 0.7}}>
        <path d="M7 17L17 7M17 7H7M17 7v10"/>
      </svg>
    </Link>
    <span className="text-xs text-gray-400 flex items-center gap-1">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
      Opens in Google
    </span>
  </div>

</div>

          </div>

        </div>
      </div>
    </section>
  );
}