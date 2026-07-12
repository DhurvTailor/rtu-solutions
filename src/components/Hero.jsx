// // components/Hero.jsx

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { FaBookOpen, FaFileAlt, FaYoutube, FaQuestionCircle , FaWhatsapp , FaPhone , FaInstagram} from "react-icons/fa";
// import  hero from "../../public/hero.webp";

// export default function Hero() {


//   const ContactUs = () => [
//     {
//       icon: <FaWhatsapp className="text-green-500" size={26} />,
    
//       link: "https://whatsapp.com/channel/0029Vb791ri6WaKwNqG93F1K"
//     },
//     {
//       icon: <FaPhone className="text-blue-500" size={26} />,
     
//       link: "tel:+9521634141"
//     },
//     {
//       icon: <FaInstagram className="text-pink-500" size={26} />,
   
//       link: "https://www.instagram.com/rtu_solutions/"
//     } 

//   ]


//   return (
//     <section className="bg-[#071A3D] md:h-[70vh]  sm:h-auto overflow-hidden">

//       <div className="max-w-7xl mx-auto px-5 py-16">

//         <div className="grid lg:grid-cols-2 gap-12 ">

//           {/* Left Side */}

//           <div className="text-center lg:text-left sm:text-center" >

//             <span className="inline-block bg-white border border-orange-500/30 text-orange-400 px-4 py-2 rounded-full text-sm mb-5">
//               🎓 Your Success, Our Mission
//             </span>

//             <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight">
//               RTU
//               <span className="text-orange-500">
//                 {" "}Solutions
//               </span>
//             </h1>

//             <p className="text-gray-300 text-xl mt-6 leading-8">
//               Your Complete RTU Exam Preparation Platform.
//               Notes, PYQ, Important Questions,
//               Video Lectures and Study Resources
//               All In One Place.
//             </p>

//             {/* Features */}

//             <div className="flex flex-wrap pl-5  lg:pl-0   gap-5 mt-8 text-gray-200">

//               <div className="flex items-center gap-2">
//                 <FaBookOpen className="text-orange-500" />
//                 Notes
//               </div>

//               <div className="flex items-center gap-2">
//                 <FaFileAlt className="text-orange-500" />
//                 PYQ
//               </div>

//               <div className="flex items-center gap-2">
//                 <FaQuestionCircle className="text-orange-500" />
//                 Important Questions
//               </div>

//               <div className="flex items-center gap-2">
//                 <FaYoutube className="text-orange-500" />
//                 Video Lectures
//               </div>

//             </div>

//             {/* Buttons */}

//             <div className="flex  ml-5 lg:ml-0   gap-4 mt-8">

//              <button
//   onClick={() =>
//     document
//       .getElementById("notes-section")
//       ?.scrollIntoView({ behavior: "smooth" })
//   }
//   className="bg-orange-500 hover:bg-orange-600 text-white px-7 py-4 rounded-xl font-semibold transition"
// >
//   Explore Notes
// </button>

//               <Link
//                 href="https://www.youtube.com/@RTU-Solutions"
//                 className="border border-white/20 hover:border-orange-500 text-white px-7 py-4 rounded-xl font-semibold transition"
//               >
//                 Watch Videos
//               </Link>

//             </div>

//           </div>

//           {/* Right Side */}

//           <div className="relative " >

//             <Image
//               src={hero}
//               alt="RTU Solutions"
//               width={400}
//               height={400}
//               priority
//               className="lg:w-137.5 lg:h-137.5  rounded-full"
//             />

//           </div>

//         </div>

//       </div>

//       <div className="fixed right-3 md:right-6 bottom-4 md:bottom-40 z-50 flex flex-col gap-1">
//   {ContactUs().map((contact, index) => (
//     <a
//       key={index}
//       href={contact.link}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="w-12 h-12 md:w-14 md:h-14
//                  flex items-center justify-center
//                  bg-[#ffffff]
//                  text-white
//                  rounded-full
//                  border-2 border-orange-500
//                  shadow-xl
//                  hover:scale-110
//                  hover:shadow-2xl
//                  transition-all duration-300"
//     >
//       {contact.icon}
//     </a>
//   ))}
// </div>


//     </section>
//   );
// }




// components/Hero.jsx

// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import {
//   FaBookOpen,
//   FaFileAlt,
//   FaYoutube,
//   FaQuestionCircle,
//   FaWhatsapp,
//   FaPhone,
//   FaInstagram,
//   FaStar,
//   FaStarHalfAlt,
//   FaArrowRight,
// } from "react-icons/fa";

// export default function Hero() {
//   const ContactUs = () => [
//     {
//       icon: <FaWhatsapp className="text-green-500" size={24} />,
//       label: "Chat with RTU Solutions on WhatsApp",
//       link: "https://whatsapp.com/channel/0029Vb791ri6WaKwNqG93F1K",
//     },
//     {
//       icon: <FaPhone className="text-blue-500" size={24} />,
//       label: "Call RTU Solutions",
//       link: "tel:+9521634141",
//     },
//     {
//       icon: <FaInstagram className="text-pink-500" size={24} />,
//       label: "Follow RTU Solutions on Instagram",
//       link: "https://www.instagram.com/rtu_solutions/",
//     },
//   ];

//   return (
//     <section
//       className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-orange-50"
//       aria-label="RTU Solutions Hero Section"
//     >
//       {/* Soft decorative glow — purely visual, no SEO impact */}
//       <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
//       <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-orange-200/40 blur-3xl" />

//       <div className="relative max-w-5xl mx-auto px-5 py-20 md:py-28 text-center">
//         {/* Eyebrow badge */}
//         <span className="inline-block bg-white border border-orange-500/30 text-orange-500 px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-sm">
//           🎓 Your Success, Our Mission
//         </span>

//         {/* Main H1 — keyword-rich for SEO, visually split for design */}
//         <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-[#0B1F3F] leading-[1.1] tracking-tight">
//           RTU Solutions
//           <br />
//           <span className="text-orange-500">
//             Notes, PYQ &amp; Video Lectures
//           </span>
//         </h1>

//         {/* Subtitle */}
//         <p className="text-gray-600 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-8">
//           Rajasthan Technical University ke students ke liye complete exam
//           preparation platform — Notes, Previous Year Papers, Important
//           Questions aur Video Lectures, sab ek jagah.
//         </p>

//         {/* Feature chips */}
//         <div className="flex flex-wrap justify-center gap-5 mt-8 text-gray-700 text-sm md:text-base">
//           <div className="flex items-center gap-2">
//             <FaBookOpen className="text-orange-500" /> Notes
//           </div>
//           <div className="flex items-center gap-2">
//             <FaFileAlt className="text-orange-500" /> PYQ
//           </div>
//           <div className="flex items-center gap-2">
//             <FaQuestionCircle className="text-orange-500" /> Important
//             Questions
//           </div>
//           <div className="flex items-center gap-2">
//             <FaYoutube className="text-orange-500" /> Video Lectures
//           </div>
//         </div>

//         {/* CTA buttons */}
//         <div className="flex flex-wrap justify-center gap-4 mt-10">
//           <button
//             onClick={() =>
//               document
//                 .getElementById("notes-section")
//                 ?.scrollIntoView({ behavior: "smooth" })
//             }
//             className="group flex items-center gap-2 bg-[#0B1F3F] hover:bg-[#132a52] text-white pl-6 pr-3 py-3 rounded-full font-semibold transition"
//           >
//             Explore Notes
//             <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-[#0B1F3F] group-hover:translate-x-0.5 transition-transform">
//               <FaArrowRight size={12} />
//             </span>
//           </button>

//           <Link
//             href="https://www.youtube.com/@RTU-Solutions"
//             className="flex items-center px-6 py-3 rounded-full font-semibold text-[#0B1F3F] border border-gray-300 hover:border-orange-500 hover:text-orange-500 transition"
//           >
//             Watch Videos
//           </Link>
//         </div>

//         {/* Trust row — avatars + rating, matches reference design */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
//           <div className="flex -space-x-3">
//             {["A", "S", "R", "P"].map((letter, i) => (
//               <div
//                 key={i}
//                 className="w-9 h-9 rounded-full border-2 border-white bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shadow-sm"
//                 aria-hidden="true"
//               >
//                 {letter}
//               </div>
//             ))}
//           </div>

//           <div className="flex items-center gap-2">
//             <div className="flex text-orange-500">
//               <FaStar />
//               <FaStar />
//               <FaStar />
//               <FaStar />
//               <FaStarHalfAlt />
//             </div>
//             <span className="text-gray-500 text-sm">
//               Trusted by 1000+ RTU students
//             </span>
//           </div>
//         </div>

      
//       </div>

//       {/* Floating contact icons */}
//       <div className="fixed right-3 md:right-6 bottom-4 md:bottom-40 z-50 flex flex-col gap-1">
//         {ContactUs().map((contact, index) => (
//           <a
//             key={index}
//             href={contact.link}
//             target="_blank"
//             rel="noopener noreferrer"
//             aria-label={contact.label}
//             title={contact.label}
//             className="w-12 h-12 md:w-14 md:h-14
//                        flex items-center justify-center
//                        bg-white
//                        rounded-full
//                        border-2 border-orange-500
//                        shadow-xl
//                        hover:scale-110
//                        hover:shadow-2xl
//                        transition-all duration-300"
//           >
//             {contact.icon}
//           </a>
//         ))}
//       </div>
//     </section>
//   );
// }




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

        <p className="text-gray-600 text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-8">
          Rajasthan Technical University ke students ke liye complete exam
          preparation platform — Notes, Previous Year Papers, Important
          Questions aur Video Lectures, sab ek jagah.
        </p>

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
            {["A", "S", "R", "P"].map((letter, i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-full border-2 border-white bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center shadow-sm"
                aria-hidden="true"
              >
                {letter}
              </div>
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