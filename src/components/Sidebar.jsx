// components/Sidebar.jsx

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
} from "react-icons/fa";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Home",
      href: "/",
      icon: <FaHome />,
    },
    {
      name: "Notes",
      href: "/notes",
      icon: <FaBook />,
    },
    {
      name: "PYQ",
      href: "/pyq",
      icon: <FaFilePdf />,
    },
    {
      name: "Videos",
      href: "/videos",
      icon: <FaYoutube />,
    },
    {
      name: "Important Questions",
      href: "/important-questions",
      icon: <FaQuestionCircle />,
    },
    {
      name: "Tools",
      href: "/tools",
      icon: <FaCalculator />,
    },
    {
      name: "Blog",
      href: "/blog",
      icon: <FaBlog />,
    },
    {
      name: "Contact",
      href: "/contact",
      icon: <FaEnvelope />,
    },
  ];

  return (
    <aside
      className="
      w-72
      min-h-screen
      bg-[#071A3D]
      text-white
      border-r
      border-white/10
      "
    >
      {/* Logo */}

      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold">
          RTU
          <span className="text-orange-500">
            {" "}Solutions
          </span>
        </h2>

        <p className="text-gray-400 text-sm mt-2">
          Student Learning Portal
        </p>
      </div>

      {/* Menu */}

      <div className="p-4">

        <ul className="space-y-2">

          {menuItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  transition-all
                  ${
                    pathname === item.href
                      ? "bg-orange-500 text-white"
                      : "hover:bg-white/10 text-gray-300"
                  }
                `}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}

        </ul>

      </div>

      {/* Bottom Card */}

      <div className="p-4 mt-10">

        <div
          className="
          bg-orange-500
          rounded-2xl
          p-5
          text-center
          "
        >
          <h3 className="font-bold text-lg">
            Premium Notes
          </h3>

          <p className="text-sm mt-2">
            Unlock premium study material.
          </p>

          <Link
            href="/premium-notes"
            className="
            inline-block
            mt-4
            bg-white
            text-orange-500
            px-5
            py-2
            rounded-lg
            font-semibold
            "
          >
            Explore
          </Link>
        </div>

      </div>
    </aside>
  );
}