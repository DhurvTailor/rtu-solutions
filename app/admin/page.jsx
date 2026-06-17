"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminPage() {
  const [stats, setStats] = useState({
    degrees: 0,
    branches: 0,
    semesters: 0,
    subjects: 0,
    solutions: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    {
      title: "Degrees",
      description: `${stats.degrees} Degree${stats.degrees !== 1 ? "s" : ""} Added`,
      link: "/degrees",
    },
    {
      title: "Branches",
      description: `${stats.branches} Branch${stats.branches !== 1 ? "es" : ""} Added`,
      link: "/branches",
    },
    {
      title: "Semesters",
      description: `${stats.semesters} Semester${stats.semesters !== 1 ? "s" : ""} Added`,
      link: "/semesters",
    },
    {
      title: "Subjects",
      description: `${stats.subjects} Subject${stats.subjects !== 1 ? "s" : ""} Added`,
      link: "/subjects",
    },
    {
      title: "Solutions",
      description: `${stats.solutions} Notes & PYQ Added`,
      link: "/solutions",
    },
    {
      title: "Users",
      description: `${stats.users} Registered User${stats.users !== 1 ? "s" : ""}`,
      link: "/users",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-[#142647]">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Welcome to RTU Solutions Admin Panel
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Link key={card.title} href={card.link} className="group">
            <div className="bg-white rounded-2xl p-6 shadow-md border hover:border-[#ff6900] hover:shadow-xl transition-all duration-300">
              <h2 className="text-2xl font-bold text-[#142647] group-hover:text-[#ff6900]">
                {card.title}
              </h2>
              <p className="text-gray-500 mt-2">
                {loading ? "Loading..." : card.description}
              </p>
              <div className="mt-4 text-[#ff6900] font-semibold">
                Open →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}