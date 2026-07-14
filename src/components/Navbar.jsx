


// "use client";
// import Link from "next/link";
// import Image from "next/image";
// import { useState } from "react";
// import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
// import { useSession } from "next-auth/react";
// import ProfileDropdown from "./ProfileDropdown";

// const navLinks = [
//   { href: "/", label: "Home" },
//   { href: "/rtu-solutions", label: "RTU Solutions" },
//   { href: "/cgpa", label: "Tools" },
//   { href: "/blog", label: "Blog" },
//   { href: "/about", label: "About" },
//   { href: "/contact", label: "Contact" },
// ];

// export default function Navbar() {
//   const { data: session, status } = useSession();
//   const [mobileOpen, setMobileOpen] = useState(false);

//   return (
//     <header className="sticky top-0 z-50 bg-[#ff6900]/95 backdrop-blur-md border-b border-orange-500/20">
//       <div className="max-w-7xl mx-auto px-5">
//         <div className="flex items-center justify-between h-20">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-3">
//             <Image
//               src="/logo.jpg"
//               alt="RTU Solutions"
//               width={50}
//               height={50}
//               className="rounded-full"
//             />
//             <div>
//               <h2 className="text-white font-bold text-xl">
//                 RTU <span className="text-white">Solutions</span>
//               </h2>
//               <p className="text-xs text-gray-900">
//                 Notes • PYQ • Videos
//               </p>
//             </div>
//           </Link>

//           {/* Desktop Nav */}
//           <nav className="hidden lg:flex items-center gap-8 text-white font-medium">
//             {navLinks.map((link) => (
//               <Link
//                 key={link.href}
//                 href={link.href}
//                 className="hover:text-black transition"
//               >
//                 {link.label}
//               </Link>
//             ))}
//           </nav>

//           {/* Right Side */}
//           <div className="flex items-center gap-4">
//             {/* <button className="text-white text-lg hover:text- transition">
//               <FaSearch />
//             </button> */}

//             {/* Loading state */}
//             {status === "loading" && (
//               <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
//             )}

//             {/* Not logged in */}
//             {status === "unauthenticated" && (
//               <Link
//                 href="/login"
//                 className="bg-white border border-orange-500 px-5 py-2 rounded-lg text-orange-500 hover:text-black transition text-sm font-medium"
//               >
//                 Login
//               </Link>
//             )}

//             {/* Logged in - Profile Dropdown */}
//             {status === "authenticated" && <ProfileDropdown />}

//             {/* Mobile hamburger */}
//             <button
//               className="lg:hidden text-white text-xl"
//               onClick={() => setMobileOpen((v) => !v)}
//             >
//               {mobileOpen ? <FaTimes /> : <FaBars />}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Mobile Menu */}
//       {mobileOpen && (
//         <div className="lg:hidden bg-[#071A3D] border-t border-orange-500/10 px-5 py-4 flex flex-col gap-4">
//           {navLinks.map((link) => (
//             <Link
//               key={link.href}
//               href={link.href}
//               className="text-white hover:text-orange-500 transition font-medium py-1"
//               onClick={() => setMobileOpen(false)}
//             >
//               {link.label}
//             </Link>
//           ))}
//         </div>
//       )}
//     </header>
//   );
// }




"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes, FaArrowRight } from "react-icons/fa";
import { useSession } from "next-auth/react";
import ProfileDropdown from "./ProfileDropdown";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rtu-solutions", label: "PDF" },
  { href: "/cgpa", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100"
      role="banner"
    >
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between h-22 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/logo.webp"
              alt="RTU Solutions Logo"
              width={80}
              height={40}
              className="rounded-full"
              priority
            />
            <div>
              <h2 className="text-[#0B1F3F] font-bold text-lg leading-tight">
                RTU <span className="text-orange-500">Solutions</span>
              </h2>
              <p className="text-[11px] text-gray-500 leading-tight">
                Notes • PYQ • Videos
              </p>
            </div>
          </Link>

          {/* Desktop Nav — pill style, active state */}
          <nav
            className="hidden lg:flex items-center gap-1 bg-gray-100/40 rounded-full px-2 py-2"
            aria-label="Primary navigation"
          >
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-[#0B1F3F] shadow-sm"
                      : "text-gray-600 hover:text-[#0B1F3F]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Loading state */}
            {status === "loading" && (
              <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
            )}

            {/* Not logged in */}
            {status === "unauthenticated" && (
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-2 bg-[#0B1F3F] hover:bg-[#132a52] text-white pl-5 pr-2 py-2 rounded-full text-sm font-semibold transition"
              >
                Login
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-[#0B1F3F]">
                  <FaArrowRight size={11} />
                </span>
              </Link>
            )}

            {/* Logged in - Profile Dropdown */}
            {status === "authenticated" && <ProfileDropdown />}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-[#0B1F3F] text-xl p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-1"
        >
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`px-4 py-3 rounded-xl font-medium transition ${
                  isActive
                    ? "bg-gray-100 text-[#0B1F3F] "
                    : "text-gry-800 hover:bg-gray-50 hover:text-[#0B1F3F]"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            );
          })}

          {status === "unauthenticated" && (
            <Link
              href="/login"
              className="mt-2 flex items-center justify-center gap-2 bg-[#0B1F3F] text-white px-5 py-3 rounded-xl font-semibold"
              onClick={() => setMobileOpen(false)}
            >
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
}