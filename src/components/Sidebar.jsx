// // components/Sidebar.jsx

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// import {
//   FaHome,
//   FaBook,
//   FaFilePdf,
//   FaYoutube,
//   FaQuestionCircle,
//   FaCalculator,
//   FaBlog,
//   FaEnvelope,
// } from "react-icons/fa";

// export default function Sidebar() {
//   const pathname = usePathname();

//   const menuItems = [
//     {
//       name: "Home",
//       href: "/",
//       icon: <FaHome />,
//     },
//     {
//       name: "Notes",
//       href: "/notes",
//       icon: <FaBook />,
//     },
//     {
//       name: "PYQ",
//       href: "/pyq",
//       icon: <FaFilePdf />,
//     },
//     {
//       name: "Videos",
//       href: "/videos",
//       icon: <FaYoutube />,
//     },
//     {
//       name: "Important Questions",
//       href: "/important-questions",
//       icon: <FaQuestionCircle />,
//     },
//     {
//       name: "Tools",
//       href: "/tools",
//       icon: <FaCalculator />,
//     },
//     {
//       name: "Blog",
//       href: "/blog",
//       icon: <FaBlog />,
//     },
//     {
//       name: "Contact",
//       href: "/contact",
//       icon: <FaEnvelope />,
//     },
//   ];

//   return (
//     <aside
//       className="
//       w-72
//       min-h-screen
//       bg-[#071A3D]
//       text-white
//       border-r
//       border-white/10
//       "
//     >
//       {/* Logo */}

//       <div className="p-6 border-b border-white/10">
//         <h2 className="text-2xl font-bold">
//           RTU
//           <span className="text-orange-500">
//             {" "}Solutions
//           </span>
//         </h2>

//         <p className="text-gray-400 text-sm mt-2">
//           Student Learning Portal
//         </p>
//       </div>

//       {/* Menu */}

//       <div className="p-4">

//         <ul className="space-y-2">

//           {menuItems.map((item) => (
//             <li key={item.name}>
//               <Link
//                 href={item.href}
//                 className={`
//                   flex
//                   items-center
//                   gap-3
//                   px-4
//                   py-3
//                   rounded-xl
//                   transition-all
//                   ${
//                     pathname === item.href
//                       ? "bg-orange-500 text-white"
//                       : "hover:bg-white/10 text-gray-300"
//                   }
//                 `}
//               >
//                 {item.icon}
//                 {item.name}
//               </Link>
//             </li>
//           ))}

//         </ul>

//       </div>

//       {/* Bottom Card */}

//       <div className="p-4 mt-10">

//         <div
//           className="
//           bg-orange-500
//           rounded-2xl
//           p-5
//           text-center
//           "
//         >
//           <h3 className="font-bold text-lg">
//             Premium Notes
//           </h3>

//           <p className="text-sm mt-2">
//             Unlock premium study material.
//           </p>

//           <Link
//             href="/premium-notes"
//             className="
//             inline-block
//             mt-4
//             bg-white
//             text-orange-500
//             px-5
//             py-2
//             rounded-lg
//             font-semibold
//             "
//           >
//             Explore
//           </Link>
//         </div>

//       </div>
//     </aside>
//   );
// }



"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaBook,
  FaFilePdf,
  FaYoutube,
  FaQuestionCircle,
  FaCalculator,
  FaBlog,
  FaEnvelope,
  FaChevronRight,
} from "react-icons/fa";

const menuItems = [
  { name: "Home", href: "/", icon: FaHome },
  { name: "Notes", href: "/notes", icon: FaBook },
  { name: "PYQ", href: "/pyq", icon: FaFilePdf },
  { name: "Videos", href: "/videos", icon: FaYoutube },
  { name: "Important Questions", href: "/important-questions", icon: FaQuestionCircle },
  { name: "Tools", href: "/tools", icon: FaCalculator },
  { name: "Blog", href: "/blog", icon: FaBlog },
  { name: "Contact", href: "/contact", icon: FaEnvelope },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 xl:w-72 min-h-screen bg-[#071A3D] border-r border-white/8 flex flex-col">

      {/* Logo */}
      <div className="px-5 py-6 border-b border-white/8">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
            <span className="text-white font-black text-xs">RTU</span>
          </div>
          <div>
            <h2 className="text-white font-bold text-base leading-tight">
              RTU Solutions
            </h2>
            <p className="text-gray-500 text-[10px] mt-0.5 tracking-wide">
              Student Learning Portal
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest px-3 mb-2">
          Navigation
        </p>
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                        active
                          ? "bg-white/20"
                          : "bg-white/5 group-hover:bg-white/10"
                      }`}
                    >
                      <Icon size={13} />
                    </div>
                    {item.name}
                  </div>
                  {active && <FaChevronRight size={10} className="opacity-60" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Premium CTA */}
      <div className="p-4 border-t border-white/8">
        <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl p-4 text-center">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
            <FaBook size={16} className="text-white" />
          </div>
          <h3 className="font-bold text-white text-sm">Premium Notes</h3>
          <p className="text-orange-100 text-xs mt-1 leading-relaxed">
            Unlock complete study material for RTU exams.
          </p>
          <Link
            href="/rtu-solutions"
            className="inline-block mt-3 bg-white text-orange-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-50 transition-colors"
          >
            Explore Now →
          </Link>
        </div>
      </div>
    </aside>
  );
}