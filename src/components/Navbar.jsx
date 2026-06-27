


"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaSearch, FaBars, FaTimes } from "react-icons/fa";
import { useSession } from "next-auth/react";
import ProfileDropdown from "./ProfileDropdown";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rtu-solutions", label: "RTU Solutions" },
  { href: "/cgpa", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#ff6900]/95 backdrop-blur-md border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="RTU Solutions"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <h2 className="text-white font-bold text-xl">
                RTU <span className="text-white">Solutions</span>
              </h2>
              <p className="text-xs text-gray-900">
                Notes • PYQ • Videos
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-white font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-black transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* <button className="text-white text-lg hover:text- transition">
              <FaSearch />
            </button> */}

            {/* Loading state */}
            {status === "loading" && (
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse" />
            )}

            {/* Not logged in */}
            {status === "unauthenticated" && (
              <Link
                href="/login"
                className="bg-white border border-orange-500 px-5 py-2 rounded-lg text-orange-500 hover:text-black transition text-sm font-medium"
              >
                Login
              </Link>
            )}

            {/* Logged in - Profile Dropdown */}
            {status === "authenticated" && <ProfileDropdown />}

            {/* Mobile hamburger */}
            <button
              className="lg:hidden text-white text-xl"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#071A3D] border-t border-orange-500/10 px-5 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white hover:text-orange-500 transition font-medium py-1"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}