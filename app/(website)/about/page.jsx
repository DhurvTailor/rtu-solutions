// // app/about/page.jsx

// import {
//   ArrowRight,
//   BadgeCheck,
//   BookOpen,
//   ChevronDown,
//   FileText,
//   GraduationCap,
//   HelpCircle,
//   Layers3,
//   ShieldCheck,
//   Sparkles,
//   Users,
//   Video,
// } from "lucide-react";

// export const metadata = {
//   title: "About Us",
// };

// function AboutImageFrame({ src, alt, className = "", fallbackLabel, Icon = HelpCircle }) {
//   if (!src) {
//     return (
//       <div
//         className={`flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50 px-6 py-10 text-center ${className}`}
//       >
//         <Icon className="h-10 w-10 text-orange-400" />
//         <p className="max-w-xs text-sm font-medium leading-relaxed text-orange-500">
//           {fallbackLabel || "Add image here"}
//         </p>
//       </div>
//     );
//   }

//   return (
//     <img
//       src={src}
//       alt={alt}
//       className={className}
//     />
//   );
// }

// const highlightCards = [
//   {
//     title: "Study Resources in One Place",
//     description:
//       "Notes, PYQs, important questions, and subject-wise material are organized so students can find what they need faster.",
//     icon: BookOpen,
//     imgSrc: "",
//     imgAlt: "Study resources illustration",
//     imgLabel: "Add image: about-study-resources.png",
//   },
//   {
//     title: "Video Learning Support",
//     description:
//       "Video lectures and visual explanations help students understand difficult topics without jumping across multiple websites.",
//     icon: Video,
//     imgSrc: "",
//     imgAlt: "Video learning illustration",
//     imgLabel: "Add image: about-video-learning.png",
//   },
//   {
//     title: "RTU Student Guidance",
//     description:
//       "The platform is designed around RTU semesters, branches, and exam needs so the content stays practical and relevant.",
//     icon: GraduationCap,
//     imgSrc: "",
//     imgAlt: "RTU guidance illustration",
//     imgLabel: "Add image: about-rtu-guidance.png",
//   },
// ];

// const sections = [
//   {
//     icon: ShieldCheck,
//     title: "What RTU Solutions Does",
//     content: [
//       "Provides easy access to semester notes, previous year questions, and topic-wise study help.",
//       "Organizes educational content for RTU students in a simple, mobile-friendly layout.",
//       "Helps students prepare for exams with material that is practical, fast to access, and easy to understand.",
//     ],
//   },
//   {
//     icon: Layers3,
//     title: "What You Can Add Here",
//     content: [
//       "Branch-specific notes and syllabus information for each semester.",
//       "Screenshots, banners, or student-focused images to make the page more engaging.",
//       "Short feature highlights like notes, solutions, downloads, and learning support.",
//     ],
//   },
//   {
//     icon: Users,
//     title: "Who This Platform Is For",
//     content: [
//       "RTU students looking for subject notes and previous year papers.",
//       "Learners who want quick access to important study resources before exams.",
//       "Students who prefer a single platform instead of searching multiple sources.",
//     ],
//   },
//   {
//     icon: FileText,
//     title: "Content Focus",
//     content: [
//       "Notes, PYQs, important questions, and solution material are the main content types.",
//       "The page can be expanded with department-wise and semester-wise details.",
//       "You can add more images, icons, and short descriptions later without changing the layout.",
//     ],
//   },
// ];

// const quickFacts = [
//   {
//     icon: BookOpen,
//     title: "Notes",
//     value: "Semester-wise study material",
//   },
//   {
//     icon: FileText,
//     title: "PYQs",
//     value: "Previous year papers and practice help",
//   },
//   {
//     icon: Video,
//     title: "Videos",
//     value: "Learning support through video content",
//   },
// ];

// const faqs = [
//   {
//     question: "Can I add my own images on this page?",
//     answer:
//       "Yes. Each image block is designed as an easy replacement slot, so you can drop in any relevant banner, illustration, or screenshot later.",
//   },
//   {
//     question: "What kind of information should I add here?",
//     answer:
//       "Add short, useful points about RTU Solutions, the available resources, the supported branches, and the value students get from the platform.",
//   },
//   {
//     question: "Will this layout stay consistent with privacy-policy?",
//     answer:
//       "Yes. The page uses the same flat navy and orange brand language, card style, spacing, and section rhythm as the privacy-policy page.",
//   },
// ];

// export default function AboutPage() {
//   return (
//     <main className="min-h-screen bg-slate-50">
//       <section className="relative overflow-hidden bg-[#0B1F3F] text-white">
//         <div className="absolute inset-0 bg-black/10" />
//         <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
//         <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-white/5 blur-2xl" />

//         <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-24">
//           <div>
//             <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-orange-100">
//               <ShieldCheck className="h-4 w-4" />
//               About RTU Solutions
//             </div>
//             <h1 className="text-4xl font-bold leading-tight md:text-5xl">
//               A simple study platform built for RTU students.
//             </h1>
//             <p className="mt-5 max-w-xl text-lg leading-8 text-orange-100">
//               RTU Solutions brings notes, previous year papers, video help, and
//               exam-focused resources together in one clean place so students can
//               prepare faster and smarter.
//             </p>
//             <div className="mt-8 flex flex-wrap gap-3">
//               <a
//                 href="#about-details"
//                 className="inline-flex items-center gap-2 rounded-xl bg-[#ff6900] px-6 py-3 font-semibold text-white transition hover:bg-[#e85f00]"
//               >
//                 Explore the details
//                 <ArrowRight className="h-4 w-4" />
//               </a>
//               <a
//                 href="/contact"
//                 className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
//               >
//                 Contact us
//               </a>
//             </div>
//           </div>

//           <div>
//             <AboutImageFrame
//               src=""
//               alt="About RTU Solutions hero image"
//               className="h-80 w-full md:h-96"
//               fallbackLabel="Add image: about-hero.png (RTU students, books, or study workspace illustration)"
//               Icon={HelpCircle}
//             />
//           </div>
//         </div>
//       </section>

//       <div className="mx-auto max-w-6xl px-6">
//         <div className="-mt-8 mb-14">
//           <div className="flex items-start gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-xl">
//             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
//               <ShieldCheck className="h-6 w-6 text-orange-600" />
//             </div>
//             <div>
//               <h2 className="mb-1 text-lg font-semibold text-gray-800">
//                 Built for easier RTU exam preparation
//               </h2>
//               <p className="text-sm leading-relaxed text-gray-600">
//                 This page follows the same flat brand system as privacy-policy:
//                 deep navy background, orange highlights, clean cards, and a
//                 section-by-section layout that is easy to edit later.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mb-16 grid gap-6 md:grid-cols-3">
//           {highlightCards.map((card, index) => (
//             <div
//               key={index}
//               className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg"
//             >
//               <AboutImageFrame
//                 src={card.imgSrc}
//                 alt={card.imgAlt}
//                 className="h-48 w-full rounded-none"
//                 fallbackLabel={card.imgLabel}
//                 Icon={card.icon}
//               />
//               <div className="p-6">
//                 <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
//                   <card.icon className="h-5 w-5 text-orange-600" />
//                 </div>
//                 <h3 className="mb-2 text-base font-semibold text-gray-800">
//                   {card.title}
//                 </h3>
//                 <p className="text-sm leading-relaxed text-gray-500">
//                   {card.description}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div id="about-details" className="scroll-mt-24 pb-4">
//           <div className="mb-8 text-center">
//             <h2 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
//               More about RTU Solutions
//             </h2>
//             <p className="mx-auto max-w-xl text-sm text-gray-500">
//               Use these sections to add deeper information about the platform,
//               student support, and any new image or content blocks later.
//             </p>
//           </div>

//           <div className="grid gap-6">
//             {sections.map((section, index) => (
//               <div
//                 key={index}
//                 className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-md"
//               >
//                 <div className="flex items-center gap-3 border-b border-gray-50 bg-white px-6 py-4">
//                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100">
//                     <section.icon className="h-5 w-5 text-orange-600" />
//                   </div>
//                   <h2 className="text-lg font-semibold text-gray-800">
//                     {section.title}
//                   </h2>
//                 </div>
//                 <ul className="space-y-3 px-6 py-5">
//                   {section.content.map((item, itemIndex) => (
//                     <li
//                       key={itemIndex}
//                       className="flex items-start gap-3 text-sm text-gray-600"
//                     >
//                       <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
//                       {item}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="mt-20 grid items-start gap-10 md:grid-cols-2">
//           <div className="space-y-6">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-800 md:text-3xl">
//                 Quick facts
//               </h2>
//               <p className="mt-2 text-sm text-gray-500">
//                 Short, high-value points you can keep updating as the project
//                 grows.
//               </p>
//             </div>

//             <div className="grid gap-4">
//               {quickFacts.map((fact, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
//                 >
//                   <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
//                     <fact.icon className="h-5 w-5 text-orange-600" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-gray-800">
//                       {fact.title}
//                     </h3>
//                     <p className="text-sm text-gray-500">{fact.value}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
//             <div className="mb-4 flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
//                 <Sparkles className="h-5 w-5 text-orange-600" />
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold text-gray-800">
//                   Add more information here
//                 </h2>
//                 <p className="text-sm text-gray-500">
//                   This section is ready for custom content and images.
//                 </p>
//               </div>
//             </div>

//             <AboutImageFrame
//               src=""
//               alt="Additional about section image"
//               className="h-64 w-full"
//               fallbackLabel="Add image: about-secondary.png (team, students, campus, or study resources)"
//               Icon={Users}
//             />

//             <div className="mt-5 space-y-3 text-sm leading-7 text-gray-600">
//               <p>
//                 Use this area to explain your vision, highlight branches or
//                 semesters, or introduce future features like downloads and
//                 solution support.
//               </p>
//               <p>
//                 You can also add another image, a testimonial block, or a short
//                 founder message without changing the overall page design.
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="mt-20 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
//           {faqs.map((faq, index) => (
//             <div
//               key={index}
//               className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
//             >
//               <details className="group">
//                 <summary className="flex cursor-pointer list-none items-center gap-3 px-5 py-4 select-none">
//                   <BadgeCheck className="h-4 w-4 shrink-0 text-orange-500" />
//                   <h3 className="flex-1 text-sm font-medium text-gray-800">
//                     {faq.question}
//                   </h3>
//                   <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
//                 </summary>
//                 <div className="px-5 pb-4 pl-12">
//                   <p className="text-sm leading-relaxed text-gray-500">
//                     {faq.answer}
//                   </p>
//                 </div>
//               </details>
//             </div>
//           ))}
//         </div>

//         <div className="mt-20 mb-20 rounded-2xl bg-[#0B1F3F] p-8 text-center text-white md:p-10">
//           <Sparkles className="mx-auto mb-3 h-8 w-8 text-orange-200" />
//           <h3 className="mb-2 text-xl font-bold md:text-2xl">
//             Want to expand this page further?
//           </h3>
//           <p className="mx-auto mb-6 max-w-xl text-sm text-orange-100">
//             Add more RTU-specific information, a founder note, branch details,
//             or extra image sections whenever you want.
//           </p>
//           <a
//             href="/contact"
//             className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-[#0B1F3F] transition hover:bg-orange-50"
//           >
//             Contact us
//             <ArrowRight className="h-4 w-4" />
//           </a>
//         </div>

//         <section className="pb-20">
//           <div className="mx-auto max-w-4xl text-center">
//             <h2 className="text-3xl font-bold text-[#0B1F3F] md:text-4xl">
//               Founder
//             </h2>
//             <p className="mt-6 text-gray-600 leading-8">
//               RTU Solutions is created and managed by <strong>Dhruv Tailor</strong>
//               with the goal of helping engineering students reach quality study
//               material quickly and without friction.
//             </p>
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }




"use client";
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  ChevronDown,
  FileText,
  GraduationCap,
  HelpCircle,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

/**
 * PlaceholderImage
 * -----------------
 * Har jagah jaha image chahiye, wahan is component ko use kiya hai.
 * Bas `src` prop mai apni image ka path daal do (public/images/... mai image daal kar).
 * Agar image nahi milegi (404 ya path galat), to ek clean dashed placeholder box dikhega
 * jisme bataya hoga ki yaha kaunsi image expected hai — broken image icon kabhi nahi dikhega.
 */
function PlaceholderImage({ src, alt, className = "", fallbackIcon: Icon = FileText, fallbackLabel }) {
  const [error, setError] = useState(!src);

  if (error) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-2 bg-orange-50 border-2 border-dashed border-orange-300 rounded-2xl ${className}`}
      >
        <Icon className="w-8 h-8 text-orange-400" strokeWidth={1.5} />
        <span className="text-xs text-orange-400 font-medium px-4 text-center leading-relaxed">
          {fallbackLabel || "Add image here"}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

export default function AboutPage() {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-out-cubic" });
  }, []);

  const highlightCards = [
    {
      icon: BookOpen,
      title: "Study Resources in One Place",
      description:
        "Notes, PYQs, important questions, and subject-wise material are organized so students can find what they need faster.",
      imgSrc: "/pageimg/Study Resources.webp",
      imgAlt: "Study resources illustration",
      imgLabel: "Add image: about-study-resources.png",
    },
    {
      icon: Video,
      title: "Video Learning Support",
      description:
        "Video lectures and visual explanations help students understand difficult topics without jumping across multiple websites.",
      imgSrc: "/pageimg/Video Learning.webp",
      imgAlt: "Video learning illustration",
      imgLabel: "Add image: about-video-learning.png",
    },
    {
      icon: GraduationCap,
      title: "RTU Student Guidance",
      description:
        "The platform is designed around RTU semesters, branches, and exam needs so the content stays practical and relevant.",
      imgSrc: "/pageimg/RTUcollege.webp",
      imgAlt: "RTU guidance illustration",
      imgLabel: "Add image: about-rtu-guidance.png",
    },
  ];

  const sections = [
    {
      icon: ShieldCheck,
      title: "What RTU Solutions Does",
      content: `Provides easy access to semester notes, previous year questions, and topic-wise study help. Organizes educational content for RTU students in a simple, mobile-friendly layout. Helps students prepare for exams with material that is practical, fast to access, and easy to understand.`,
    },
    {
      icon: Layers3,
      title: "What You Can Add Here",
      content: `Branch-specific notes and syllabus information for each semester. Screenshots, banners, or student-focused images to make the page more engaging. Short feature highlights like notes, solutions, downloads, and learning support.`,
    },
    {
      icon: Users,
      title: "Who This Platform Is For",
      content: `RTU students looking for subject notes and previous year papers. Learners who want quick access to important study resources before exams. Students who prefer a single platform instead of searching multiple sources.`,
    },
    {
      icon: FileText,
      title: "Content Focus",
      content: `Notes, PYQs, important questions, and solution material are the main content types. The page can be expanded with department-wise and semester-wise details. You can add more images, icons, and short descriptions later without changing the layout.`,
    },
  ];

  const quickFacts = [
    {
      icon: BookOpen,
      title: "Notes",
      value: "Semester-wise study material",
    },
    {
      icon: FileText,
      title: "PYQs",
      value: "Previous year papers and practice help",
    },
    {
      icon: Video,
      title: "Videos",
      value: "Learning support through video content",
    },
  ];

  const faqs = [
    {
      question: "Can I add my own images on this page?",
      answer:
        "Yes. Each image block is designed as an easy replacement slot, so you can drop in any relevant banner, illustration, or screenshot later.",
    },
    {
      question: "What kind of information should I add here?",
      answer:
        "Add short, useful points about RTU Solutions, the available resources, the supported branches, and the value students get from the platform.",
    },
    {
      question: "Will this layout stay consistent with terms & privacy pages?",
      answer:
        "Yes. The page uses the same flat navy and orange brand language, card style, spacing, and section rhythm as the terms and privacy-policy pages.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ---------------- Hero Section ---------------- */}
      <section className="relative overflow-hidden bg-[#0B1F3F] text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full bg-white/5 blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
          {/* Left: text */}
          <div data-aos="fade-right">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              About RTU Solutions
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              A simple study platform built for RTU students.
            </h1>
            <p className="text-orange-100 text-lg max-w-lg mb-8">
              RTU Solutions brings notes, previous year papers, video help, and
              exam-focused resources together in one clean place so students can
              prepare faster and smarter.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#about-details"
                className="inline-flex items-center gap-2 bg-[#ff6900] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#e85f00] transition"
              >
                Explore the details
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 border border-white/20 bg-white/5 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition"
              >
                Contact us
              </a>
            </div>
          </div>

          {/* Right: hero image */}
          <div data-aos="fade-left" data-aos-delay="150" className="relative">
            <PlaceholderImage
              src="/pageimg/About Hero.webp"
              alt="About RTU Solutions hero illustration"
              className="w-full h-80 md:h-96 object-contain rounded-3xl"
              fallbackIcon={HelpCircle}
              fallbackLabel="Add image: about-hero.png (RTU students, books, or study workspace illustration)"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* ---------------- Intro strip ---------------- */}
        <div data-aos="fade-up" className="-mt-8 mb-14">
          <div className="flex items-start gap-4 rounded-2xl border border-orange-100 bg-white p-6 shadow-xl">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
              <ShieldCheck className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h2 className="mb-1 text-lg font-semibold text-gray-800">
                Built for easier RTU exam preparation
              </h2>
              <p className="text-sm leading-relaxed text-gray-600">
                This page follows the same flat brand system as the terms and
                privacy-policy pages: deep navy background, orange highlights,
                clean cards, and a section-by-section layout that is easy to
                edit later.
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- Highlight Cards with Images ---------------- */}
        <div className="grid md:grid-cols-3 gap-6 my-14">
          {highlightCards.map((card, i) => (
            <div
              key={i}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-200 hover:-translate-y-1 transition-all duration-300"
            >
              <PlaceholderImage
                src={card.imgSrc}
                alt={card.imgAlt}
                className="w-full h-48 object-contain bg-gray-50 p-2"
                fallbackIcon={card.icon}
                fallbackLabel={card.imgLabel}
              />
              <div className="p-6">
                <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
                  <card.icon className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-800 text-base mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------------- Detailed About Accordion ---------------- */}
        <div id="about-details" className="scroll-mt-24">
          <div data-aos="fade-up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              More about RTU Solutions
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Tap on any section below to expand and read the details.
            </p>
          </div>

          <div className="space-y-4">
            {sections.map((section, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md hover:border-orange-200 transition-all duration-300"
              >
                <details className="group">
                  <summary className="flex items-center gap-4 px-6 py-4 cursor-pointer list-none select-none">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-orange-100 flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-orange-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800 text-base flex-1">
                      {section.title}
                    </h3>
                    <ChevronDown className="w-5 h-5 text-gray-400 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <div className="px-6 pb-5 pt-1 pl-18 border-t border-gray-50">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {section.content}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- Quick Facts + Extra Info ---------------- */}
        <div className="mt-20 grid md:grid-cols-2 gap-10 items-start">
          <div data-aos="fade-right" className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                Quick facts
              </h2>
              <p className="text-gray-500 text-sm mt-2">
                Short, high-value points you can keep updating as the project
                grows.
              </p>
            </div>

            <div className="grid gap-4">
              {quickFacts.map((fact, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                    <fact.icon className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {fact.title}
                    </h3>
                    <p className="text-sm text-gray-500">{fact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            data-aos="fade-left"
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
                <Sparkles className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Add more information here
                </h2>
                <p className="text-sm text-gray-500">
                  This section is ready for custom content and images.
                </p>
              </div>
            </div>

            <PlaceholderImage
              src="/pageimg/About Secondary.webp"
              alt="Additional about section illustration"
              className="w-full h-64 object-contain rounded-2xl"
              fallbackIcon={Users}
              fallbackLabel="Add image: about-secondary.png (team, students, campus, or study resources)"
            />

            <div className="mt-5 space-y-3 text-sm leading-7 text-gray-600">
              <p>
                Use this area to explain your vision, highlight branches or
                semesters, or introduce future features like downloads and
                solution support.
              </p>
              <p>
                You can also add another image, a testimonial block, or a short
                founder message without changing the overall page design.
              </p>
            </div>
          </div>
        </div>

        {/* ---------------- FAQ Section ---------------- */}
        <div className="mt-20">
          <div data-aos="fade-up" className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
              Frequently asked questions
            </h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">
              Common questions people ask about this page and how to build on
              it.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                data-aos="fade-up"
                data-aos-delay={i * 50}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:border-orange-200 transition-colors duration-300"
              >
                <details className="group">
                  <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer list-none select-none">
                    <BadgeCheck className="w-4 h-4 text-orange-500 shrink-0" />
                    <h3 className="font-medium text-gray-800 text-sm flex-1">
                      {faq.question}
                    </h3>
                    <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform duration-200 shrink-0" />
                  </summary>
                  <div className="px-5 pb-4 pl-12">
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        {/* ---------------- CTA ---------------- */}
        <div
          data-aos="zoom-in"
          className="mt-20 relative overflow-hidden bg-[#0B1F3F] rounded-2xl p-8 md:p-10 text-white text-center"
        >
          <Sparkles className="w-8 h-8 mx-auto mb-3 text-orange-200" />
          <h3 className="text-xl md:text-2xl font-bold mb-2">
            Want to expand this page further?
          </h3>
          <p className="text-orange-100 mb-6 text-sm max-w-md mx-auto">
            Add more RTU-specific information, a founder note, branch details,
            or extra image sections whenever you want.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-white text-[#0B1F3F] font-semibold px-6 py-2.5 rounded-xl hover:bg-orange-50 transition"
          >
            Contact us
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* ---------------- Founder ---------------- */}
        <section data-aos="fade-up" className="mt-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3F]">
              Founder
            </h2>
            <p className="mt-6 text-gray-600 leading-8">
              RTU Solutions is created and managed by{" "}
              <strong>Dhruv Tailor</strong> with the goal of helping
              engineering students reach quality study material quickly and
              without friction.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}