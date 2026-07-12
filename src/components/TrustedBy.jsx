// components/TrustedBy.jsx

import {
  FaLaptopCode,
  FaMicrochip,
  FaCogs,
  FaBuilding,
  FaBolt,
} from "react-icons/fa";

const branches = [
  { icon: <FaLaptopCode size={22} />, label: "Computer Science" },
  { icon: <FaMicrochip size={22} />, label: "Electronics & Comm" },
  { icon: <FaCogs size={22} />, label: "Mechanical" },
  { icon: <FaBuilding size={22} />, label: "Civil" },
  { icon: <FaBolt size={22} />, label: "Electrical" },
];

export default function TrustedBy() {
  return (
    <section
      className="py-14 bg-linear-to-br from-blue-50 via-white to-orange-50"
      aria-label="Branches covered by RTU Solutions"
    >
      <div className="max-w-5xl mx-auto px-5">
        {/* Divider heading, matches reference style */}
        <div className="flex items-center gap-4 mb-10">
          <span className="flex-1 h-px bg-gray-200" />
          <p className="text-gray-500 text-sm whitespace-nowrap">
            Trusted by 1000+ RTU B.Tech students across all branches
          </p>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Branch strip */}
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {branches.map((branch, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition"
            >
              {branch.icon}
              <span className="font-semibold text-lg text-gray-700">
                {branch.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}