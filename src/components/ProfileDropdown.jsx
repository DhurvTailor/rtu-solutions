"use client";
import { useState, useRef, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {
  FaUser,
  FaGraduationCap,
  FaHeart,
  FaHistory,
  FaCog,
  FaSignOutAlt,
  FaChevronDown,
  FaCrown,
} from "react-icons/fa";

export default function ProfileDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Outside click se close karo
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session) return null;

  const isAdmin = session.user.role === "admin";

  const menuItems = [
    {
      icon: <FaUser className="text-orange-400" />,
      label: "My Profile",
      desc: "Personal info & photo",
      href: "/profile",
    },
    {
      icon: <FaGraduationCap className="text-blue-400" />,
      label: "Student Info",
      desc: "College, phone, city",
      href: "/profile/student-info",
    },
  

  
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 group"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <div className="relative">
          <Image
            src={session.user.image || "/default-avatar.png"}
            alt={session.user.name || "User"}
            width={40}
            height={40}
            className="rounded-full border-2 border-orange-500 group-hover:border-orange-400 transition"
          />
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#071A3D] rounded-full" />
        </div>
        <span className="text-white font-medium hidden md:block text-sm max-w-25 truncate">
          {session.user.name?.split(" ")[0]}
        </span>
        <FaChevronDown
          className={`text-gray-400 text-xs transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div className="absolute right-0 mt-3 w-72 bg-[#ffffff] hover:bg-[#f3f4f6] border border-orange-500/20 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 animate-fade-in">
          {/* User Header */}
          <div className="bg-linear-to-r from-[#071A3D] to-[#0d2454] px-4 py-4 border-b border-orange-500/10">
            <div className="flex items-center gap-3">
              <Image
                src={session.user.image || "/default-avatar.png"}
                alt={session.user.name || "User"}
                width={48}
                height={48}
                className="rounded-full border-2 border-orange-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-semibold text-sm truncate">
                    {session.user.name}
                  </p>
                  {isAdmin && (
                    <span className="flex items-center gap-1 bg-orange-500/20 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <FaCrown className="text-[8px]" /> Admin
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-xs truncate mt-0.5">
                  {session.user.email}
                </p>
                <span className="inline-block mt-1 text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full capitalize">
                  {session.user.role || "Student"}
                </span>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-sm group-hover:bg-white/10 transition">
                  {item.icon}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
              </Link>
            ))}

            {/* Admin Panel Link */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-orange-500/10 transition group border-t border-orange-500/10"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-sm">
                  <FaCrown className="text-orange-400" />
                </div>
                <div>
                  <p className="text-orange-400 text-sm font-medium">
                    Admin Panel
                  </p>
                  <p className="text-gray-500 text-xs">Manage content & users</p>
                </div>
              </Link>
            )}
          </div>

          {/* Logout */}
          <div className="border-t border-orange-500/10 px-4 py-3">
            <button
              onClick={() => {
                setOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full flex items-center gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-lg transition"
            >
              <FaSignOutAlt />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}