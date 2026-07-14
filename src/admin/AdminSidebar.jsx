


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  FiMenu,
  FiHome,
  FiBook,
  FiLayers,
  FiGrid,
  FiFileText,
  FiEdit3,
  FiVideo,
  FiUsers,
  FiChevronLeft,
  FiPhone,
} from "react-icons/fi";

export default function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: <FiHome size={20} />,
    },
    {
      name: "Degrees",
      path: "/admin/degrees",
      icon: <FiBook size={20} />,
    },
    {
      name: "Branches",
      path: "/admin/branches",
      icon: <FiLayers size={20} />,
    },
    {
      name: "Semesters",
      path: "/admin/semesters",
      icon: <FiGrid size={20} />,
    },
    {
      name: "Subjects",
      path: "/admin/subjects",
      icon: <FiBook size={20} />,
    },
    {
      name: "Solutions",
      path: "/admin/solutions",
      icon: <FiFileText size={20} />,
    },
    {
      name: "Blogs",
      path: "/admin/blogs",
      icon: <FiEdit3 size={20} />,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: <FiUsers size={20} />,
    },
      {
      name: "Contact",
      path: "/admin/contact",
      icon: <FiPhone size={20} />,
    },
  ];

  return (
    <aside
      className={`h-screen sticky top-0 bg-linear-to-b from-[#071A3D] via-[#0d234d] to-[#142647]
      border-r border-white/10 shadow-2xl transition-all duration-300
      ${collapsed ? "w-20" : "w-72"}`}
    >
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-white/10">
        {!collapsed && (
          <div>
            <h2 className="text-white font-bold text-2xl">
              RTU Admin
            </h2>

            <p className="text-xs text-gray-400">
              Management Panel
            </p>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-[#ff6900]
          flex items-center justify-center text-white transition"
        >
          {collapsed ? (
            <FiMenu size={20} />
          ) : (
            <FiChevronLeft size={20} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <ul className="space-y-2">

          {menuItems.map((item) => {
            const active = pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`group flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300

                  ${
                    active
                      ? "bg-[#ff6900] text-white shadow-lg"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span>{item.icon}</span>

                  {!collapsed && (
                    <span className="font-medium">
                      {item.name}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-5 left-5 right-5">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <p className="text-xs text-gray-400">
              RTU Solutions
            </p>

            <h4 className="text-white font-semibold mt-1">
              Admin Panel v1.0
            </h4>
          </div>
        </div>
      )}
    </aside>
  );
}