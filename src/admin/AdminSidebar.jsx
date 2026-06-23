// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function AdminSidebar() {
//   const pathname = usePathname();

//   const menuItems = [
//     {
//       name: "Dashboard",
//       path: "/admin",
//     },
//     {
//       name: "Degrees",
//       path: "/admin/degrees",
//     },
//     {
//       name: "Branches",
//       path: "/admin/branches",
//     },
//     {
//       name: "Semesters",
//       path: "/admin/semesters",
//     },
//     {
//       name: "Subjects",
//       path: "/admin/subjects",
//     },
//     {
//       name: "Solutions",
//       path: "/admin/solutions",
//     },
//     {
//       name: "Videos",
//       path: "/admin/videos",
//     },
//     {
//       name: "Users",
//       path: "/admin/users",
//     },
//   ];

//   return (
//     <aside className="w-64 min-h-screen bg-[#142647] text-white">

//       {/* Logo */}
//       <div className="p-6 border-b border-white/10">
//         <h2 className="text-2xl font-bold">
//           RTU Admin
//         </h2>

//         <p className="text-sm text-gray-300 mt-1">
//           Management Panel
//         </p>
//       </div>

//       {/* Menu */}
//       <nav className="p-4">

//         <ul className="space-y-2">

//           {menuItems.map((item) => (
//             <li key={item.path}>
//               <Link
//                 href={item.path}
//                 className={`block px-4 py-3 rounded-lg transition-all duration-200
                  
//                   ${
//                     pathname === item.path
//                       ? "bg-[#ff6900] text-white"
//                       : "hover:bg-white/10"
//                   }
//                 `}
//               >
//                 {item.name}
//               </Link>
//             </li>
//           ))}

//         </ul>

//       </nav>

//     </aside>
//   );
// }




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
  FiVideo,
  FiUsers,
  FiChevronLeft,
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
      name: "Users",
      path: "/admin/users",
      icon: <FiUsers size={20} />,
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