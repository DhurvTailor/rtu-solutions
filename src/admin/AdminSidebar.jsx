"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin",
    },
    {
      name: "Degrees",
      path: "/admin/degrees",
    },
    {
      name: "Branches",
      path: "/admin/branches",
    },
    {
      name: "Semesters",
      path: "/admin/semesters",
    },
    {
      name: "Subjects",
      path: "/admin/subjects",
    },
    {
      name: "Solutions",
      path: "/admin/solutions",
    },
    {
      name: "Videos",
      path: "/admin/videos",
    },
    {
      name: "Users",
      path: "/admin/users",
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#142647] text-white">

      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold">
          RTU Admin
        </h2>

        <p className="text-sm text-gray-300 mt-1">
          Management Panel
        </p>
      </div>

      {/* Menu */}
      <nav className="p-4">

        <ul className="space-y-2">

          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`block px-4 py-3 rounded-lg transition-all duration-200
                  
                  ${
                    pathname === item.path
                      ? "bg-[#ff6900] text-white"
                      : "hover:bg-white/10"
                  }
                `}
              >
                {item.name}
              </Link>
            </li>
          ))}

        </ul>

      </nav>

    </aside>
  );
}