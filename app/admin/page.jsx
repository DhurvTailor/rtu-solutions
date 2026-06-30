// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function AdminPage() {
//   const [stats, setStats] = useState({
//     degrees: 0,
//     branches: 0,
//     semesters: 0,
//     subjects: 0,
//     solutions: 0,
//     users: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/api/dashboard")
//       .then((res) => res.json())
//       .then((data) => setStats(data))
//       .catch((err) => console.log(err))
//       .finally(() => setLoading(false));
//   }, []);

//   const cards = [
//     {
//       title: "Degrees",
//       description: `${stats.degrees} Degree${stats.degrees !== 1 ? "s" : ""} Added`,
//       link: "/degrees",
//     },
//     {
//       title: "Branches",
//       description: `${stats.branches} Branch${stats.branches !== 1 ? "es" : ""} Added`,
//       link: "/branches",
//     },
//     {
//       title: "Semesters",
//       description: `${stats.semesters} Semester${stats.semesters !== 1 ? "s" : ""} Added`,
//       link: "/semesters",
//     },
//     {
//       title: "Subjects",
//       description: `${stats.subjects} Subject${stats.subjects !== 1 ? "s" : ""} Added`,
//       link: "/subjects",
//     },
//     {
//       title: "Solutions",
//       description: `${stats.solutions} Notes & PYQ Added`,
//       link: "/solutions",
//     },
//     {
//       title: "Users",
//       description: `${stats.users} Registered User${stats.users !== 1 ? "s" : ""}`,
//       link: "/users",
//     },
//   ];

//   return (
//     <div className="space-y-8">
//       <div>
//         <h1 className="text-4xl font-bold text-[#142647]">
//           Admin Dashboard
//         </h1>
//         <p className="text-gray-500 mt-2">
//           Welcome to RTU Solutions Admin Panel
//         </p>
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//         {cards.map((card) => (
//           <Link key={card.title} href={card.link} className="group">
//             <div className="bg-white rounded-2xl p-6 shadow-md border hover:border-[#ff6900] hover:shadow-xl transition-all duration-300">
//               <h2 className="text-2xl font-bold text-[#142647] group-hover:text-[#ff6900]">
//                 {card.title}
//               </h2>
//               <p className="text-gray-500 mt-2">
//                 {loading ? "Loading..." : card.description}
//               </p>
//               <div className="mt-4 text-[#ff6900] font-semibold">
//                 Open →
//               </div>
//             </div>
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// }




"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaRupeeSign, FaShoppingCart, FaUsers,
  FaFilePdf, FaDownload, FaGift,
  FaArrowUp, FaChartBar,
} from "react-icons/fa";
import {
  FiBookOpen, FiGitBranch, FiLayers,
  FiBook, FiFileText, FiTrendingUp,
} from "react-icons/fi";

// ── Mini bar chart component ──
function MiniBarChart({ data }) {
  if (!data || data.length === 0) return (
    <div className="flex items-end justify-center gap-1 h-16 opacity-30">
      {[4, 7, 3, 8, 5, 9, 6].map((h, i) => (
        <div key={i} className="w-6 bg-orange-400 rounded-t" style={{ height: `${h * 7}px` }} />
      ))}
    </div>
  );

  const max = Math.max(...data.map((d) => Number(d.revenue)), 1);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div
            className="w-full bg-orange-400 rounded-t transition-all"
            style={{ height: `${(Number(d.revenue) / max) * 56}px`, minHeight: "4px" }}
          />
          <span className="text-[9px] text-gray-500">
            {new Date(d.date).toLocaleDateString("en-IN", { day: "2-digit" })}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const contentCards = [
    { title: "Degrees", icon: <FiBookOpen size={18} />, count: stats?.degrees, link: "/admin/degrees", color: "blue" },
    { title: "Branches", icon: <FiGitBranch size={18} />, count: stats?.branches, link: "/admin/branches", color: "purple" },
    { title: "Semesters", icon: <FiLayers size={18} />, count: stats?.semesters, link: "/admin/semesters", color: "teal" },
    { title: "Subjects", icon: <FiBook size={18} />, count: stats?.subjects, link: "/admin/subjects", color: "green" },
    { title: "Solutions", icon: <FiFileText size={18} />, count: stats?.solutions, link: "/admin/solutions", color: "orange" },
    { title: "Users", icon: <FaUsers size={18} />, count: stats?.users, link: "/admin/users", color: "pink" },
  ];

  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    teal: "bg-teal-50 text-teal-600 border-teal-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    pink: "bg-pink-50 text-pink-600 border-pink-100",
  };

  return (
    <div className="space-y-8 p-2">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#142647]">Admin Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">RTU Solutions — Live Overview</p>
      </div>

      {/* Revenue Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: `₹${Number(stats?.totalRevenue || 0).toFixed(0)}`,
            icon: <FaRupeeSign size={16} />,
            sub: `${stats?.totalSales || 0} paid orders`,
            color: "bg-orange-500",
          },
          {
            label: "Today's Revenue",
            value: `₹${Number(stats?.todayRevenue || 0).toFixed(0)}`,
            icon: <FaArrowUp size={16} />,
            sub: "Aaj ki kamai",
            color: "bg-green-500",
          },
          {
            label: "Total Downloads",
            value: stats?.totalDownloads || 0,
            icon: <FaDownload size={16} />,
            sub: `${stats?.trialDownloads || 0} trial downloads`,
            color: "bg-blue-500",
          },
          {
            label: "Total Users",
            value: stats?.users || 0,
            icon: <FaUsers size={16} />,
            sub: "Registered students",
            color: "bg-purple-500",
          },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
            <div className={`w-9 h-9 ${item.color} rounded-xl flex items-center justify-center text-white mb-3`}>
              {item.icon}
            </div>
            <p className="text-2xl font-bold text-[#142647]">
              {loading ? "—" : item.value}
            </p>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">{item.label}</p>
            <p className="text-[11px] text-gray-400 mt-1">{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Weekly Chart + Top PDFs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Weekly Revenue Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-orange-500" size={16} />
            <p className="font-bold text-[#142647] text-sm">Last 7 Days Revenue</p>
          </div>
          {loading ? (
            <div className="h-16 bg-gray-50 rounded-xl animate-pulse" />
          ) : (
            <MiniBarChart data={stats?.weeklyRevenue || []} />
          )}
          <div className="mt-3 flex justify-between text-xs text-gray-400">
            <span>7 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Top PDFs */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <FaChartBar className="text-orange-500" size={14} />
            <p className="font-bold text-[#142647] text-sm">Top Selling PDFs</p>
          </div>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-gray-50 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : stats?.topPdfs?.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">Abhi koi sales nahi</p>
          ) : (
            <div className="space-y-2">
              {stats?.topPdfs?.map((pdf, i) => (
                <div key={pdf.id} className="flex items-center gap-3 py-1.5">
                  <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#142647] truncate">{pdf.title}</p>
                    <p className="text-[10px] text-gray-400">{pdf.sales} sales · ₹{Number(pdf.revenue).toFixed(0)}</p>
                  </div>
                  <span className="text-xs font-bold text-orange-500">₹{Number(pdf.revenue).toFixed(0)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FaShoppingCart className="text-orange-500" size={14} />
          <p className="font-bold text-[#142647] text-sm">Recent Sales</p>
        </div>
        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-gray-50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : stats?.recentSales?.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Abhi koi sales nahi</p>
        ) : (
          <div className="space-y-2">
            {stats?.recentSales?.map((sale) => (
              <div key={sale.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center shrink-0">
                  <FaFilePdf className="text-orange-500" size={13} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#142647] truncate">{sale.title}</p>
                  <p className="text-[11px] text-gray-400 truncate">{sale.user_name} · {sale.email}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-green-600">₹{Number(sale.amount_paid).toFixed(0)}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(sale.purchased_at).toLocaleDateString("en-IN", {
                      day: "2-digit", month: "short",
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Content Management Cards */}
      <div>
        <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Content Management</p>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {contentCards.map((card) => (
            <Link key={card.title} href={card.link} className="group">
              <div className="bg-white rounded-2xl p-4 border border-gray-100 hover:border-orange-300 hover:shadow-md transition-all text-center">
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mx-auto mb-3 ${colorMap[card.color]}`}>
                  {card.icon}
                </div>
                <p className="text-xl font-bold text-[#142647]">
                  {loading ? "—" : (card.count ?? 0)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">{card.title}</p>
                <p className="text-[10px] text-orange-500 mt-2 font-semibold group-hover:underline">
                  Manage →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}