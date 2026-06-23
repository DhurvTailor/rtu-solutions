// components/Hero.jsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { FaBookOpen, FaFileAlt, FaYoutube, FaQuestionCircle , FaWhatsapp , FaPhone , FaInstagram} from "react-icons/fa";
import  hero from "../../public/hero.webp";

export default function Hero() {


  const ContactUs = () => [
    {
      icon: <FaWhatsapp className="text-green-500" size={26} />,
    
      link: "https://wa.me/1234567890"
    },
    {
      icon: <FaPhone className="text-blue-500" size={26} />,
     
      link: "tel:+1234567890"
    },
    {
      icon: <FaInstagram className="text-pink-500" size={26} />,
   
      link: "https://instagram.com/rtu_solutions"
    } 

  ]


  return (
    <section className="bg-[#071A3D] h-[70vh] overflow-hidden">

      <div className="max-w-7xl mx-auto px-5 py-16">

        <div className="grid lg:grid-cols-2 gap-12 ">

          {/* Left Side */}

          <div className="text-center lg:text-left" >

            <span className="inline-block bg-white border border-orange-500/30 text-orange-400 px-4 py-2 rounded-full text-sm mb-5">
              🎓 Your Success, Our Mission
            </span>

            <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
              RTU
              <span className="text-orange-500">
                {" "}Solutions
              </span>
            </h1>

            <p className="text-gray-300 text-xl mt-6 leading-8">
              Your Complete RTU Exam Preparation Platform.
              Notes, PYQ, Important Questions,
              Video Lectures and Study Resources
              All In One Place.
            </p>

            {/* Features */}

            <div className="flex flex-wrap gap-5 mt-8 text-gray-200">

              <div className="flex items-center gap-2">
                <FaBookOpen className="text-orange-500" />
                Notes
              </div>

              <div className="flex items-center gap-2">
                <FaFileAlt className="text-orange-500" />
                PYQ
              </div>

              <div className="flex items-center gap-2">
                <FaQuestionCircle className="text-orange-500" />
                Important Questions
              </div>

              <div className="flex items-center gap-2">
                <FaYoutube className="text-orange-500" />
                Video Lectures
              </div>

            </div>

            {/* Buttons */}

            <div className="flex gap-4 mt-8">

             <button
  onClick={() =>
    document
      .getElementById("notes-section")
      ?.scrollIntoView({ behavior: "smooth" })
  }
  className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-4 rounded-xl font-semibold transition"
>
  Explore Notes
</button>

              <Link
                href="https://www.youtube.com/@RTU-Solutions"
                className="border border-white/20 hover:border-orange-500 text-white px-7 py-4 rounded-xl font-semibold transition"
              >
                Watch Videos
              </Link>

            </div>

          </div>

          {/* Right Side */}

          <div className="relative " >

            <Image
              src={hero}
              alt="RTU Solutions"
              width={400}
              height={400}
              priority
              className="w-137.5 h-137.5 rounded-full object-contain"
            />

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
      className="w-12 h-12 md:w-14 md:h-14
                 flex items-center justify-center
                 bg-[#ffffff]
                 text-white
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
