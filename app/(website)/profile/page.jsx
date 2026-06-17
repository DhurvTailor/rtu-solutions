"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FaUser,
  FaEnvelope,
  FaShieldAlt,
  FaEdit,
  FaGraduationCap,
  FaCalendarAlt,
} from "react-icons/fa";

export default function ProfilePage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#050f24] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    redirect("/login");
  }

  const user = session?.user;

  return (
    <div className="min-h-screen bg-[#050f24] py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-[#0d2454] border border-orange-500/20 rounded-2xl overflow-hidden">
          {/* Banner */}
          <div className="h-28 bg-linear-to-rrom-orange-600 via-orange-500 to-amber-500" />
          
          {/* Avatar + Name */}
          <div className="px-6 pb-6">
            <div className="flex items-end gap-5 -mt-12 mb-4">
              <Image
                src={user?.image || "/default-avatar.png"}
                alt={user?.name || "User"}
                width={90}
                height={90}
                className="rounded-full border-4 border-[#0d2454] shadow-xl"
              />
              <div className="mb-2">
                <h1 className="text-white text-2xl font-bold">{user?.name}</h1>
                <span className="text-xs bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full capitalize font-medium">
                  {user?.role || "Student"}
                </span>
              </div>
              <Link
                href="/profile/student-info"
                className="ml-auto mb-2 flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                <FaEdit className="text-xs" />
                Edit Info
              </Link>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <InfoCard
                icon={<FaEnvelope className="text-orange-400" />}
                label="Email"
                value={user?.email}
              />
              <InfoCard
                icon={<FaShieldAlt className="text-blue-400" />}
                label="Role"
                value={user?.role || "Student"}
              />
              <InfoCard
                icon={<FaUser className="text-green-400" />}
                label="User ID"
                value={`#${user?.id || "—"}`}
              />
              <InfoCard
                icon={<FaCalendarAlt className="text-purple-400" />}
                label="Account"
                value="Google Verified"
              />
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <QuickCard
            href="/profile/student-info"
            icon={<FaGraduationCap className="text-2xl text-blue-400" />}
            title="Student Information"
            desc="Update your college, phone number, and city"
            color="blue"
          />
          <QuickCard
            href="/profile/saved"
            icon={<span className="text-2xl">❤️</span>}
            title="Saved Notes"
            desc="Your bookmarked study material"
            color="pink"
          />
          <QuickCard
            href="/profile/history"
            icon={<span className="text-2xl">🕐</span>}
            title="View History"
            desc="Recently viewed notes and papers"
            color="green"
          />
          <QuickCard
            href="/profile/settings"
            icon={<span className="text-2xl">⚙️</span>}
            title="Settings"
            desc="Account preferences"
            color="gray"
          />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-[#071A3D] border border-white/5 rounded-xl p-4 flex items-center gap-3">
      <div className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-gray-400 text-xs">{label}</p>
        <p className="text-white text-sm font-medium truncate max-w-45">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function QuickCard({ href, icon, title, desc, color }) {
  const borders = {
    blue: "hover:border-blue-500/40",
    pink: "hover:border-pink-500/40",
    green: "hover:border-green-500/40",
    gray: "hover:border-gray-500/40",
  };
  return (
    <Link
      href={href}
      className={`bg-[#0d2454] border border-white/5 ${borders[color]} rounded-xl p-5 flex items-center gap-4 hover:bg-[#0d2454]/80 transition group`}
    >
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition">
        {icon}
      </div>
      <div>
        <p className="text-white font-semibold text-sm">{title}</p>
        <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
      </div>
    </Link>
  );
}