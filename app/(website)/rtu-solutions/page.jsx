"use client";

import { useState, useMemo } from "react";

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const ALL_DATA = [
  // 1st Year - Sem 1
  { id: 1,  year: "1st Year", sem: "Sem 1", subj: "Mathematics", type: "Notes", title: "Maths Unit 1 Notes",           driveLink: "#", viewLink: "#" },
  { id: 2,  year: "1st Year", sem: "Sem 1", subj: "Mathematics", type: "Notes", title: "Maths Unit 2 Notes",           driveLink: "#", viewLink: "#" },
  { id: 3,  year: "1st Year", sem: "Sem 1", subj: "Mathematics", type: "PYQ",   title: "Maths PYQ 2023",               driveLink: "#", viewLink: "#" },
  { id: 4,  year: "1st Year", sem: "Sem 1", subj: "Mathematics", type: "IQ",    title: "Maths Important Questions",    driveLink: "#", viewLink: "#" },
  { id: 5,  year: "1st Year", sem: "Sem 1", subj: "Physics",     type: "Notes", title: "Physics Unit 1 Notes",         driveLink: "#", viewLink: "#" },
  { id: 6,  year: "1st Year", sem: "Sem 1", subj: "Physics",     type: "Video", title: "Physics Lecture Series",       driveLink: "#", viewLink: "#" },
  { id: 7,  year: "1st Year", sem: "Sem 1", subj: "Physics",     type: "PYQ",   title: "Physics PYQ 2023",             driveLink: "#", viewLink: "#" },
  { id: 8,  year: "1st Year", sem: "Sem 2", subj: "Chemistry",   type: "Notes", title: "Chemistry Unit 1 Notes",       driveLink: "#", viewLink: "#" },
  { id: 9,  year: "1st Year", sem: "Sem 2", subj: "Chemistry",   type: "PYQ",   title: "Chemistry PYQ 2022",           driveLink: "#", viewLink: "#" },
  { id: 10, year: "1st Year", sem: "Sem 2", subj: "English",     type: "Notes", title: "English Grammar Notes",        driveLink: "#", viewLink: "#" },
  { id: 11, year: "1st Year", sem: "Sem 2", subj: "English",     type: "IQ",    title: "English Important Questions",  driveLink: "#", viewLink: "#" },
  // 2nd Year - Sem 3
  { id: 12, year: "2nd Year", sem: "Sem 3", subj: "DBMS",  type: "Notes", title: "DBMS Unit 1 Notes",          driveLink: "#", viewLink: "#" },
  { id: 13, year: "2nd Year", sem: "Sem 3", subj: "DBMS",  type: "Notes", title: "DBMS Unit 2 Notes",          driveLink: "#", viewLink: "#" },
  { id: 14, year: "2nd Year", sem: "Sem 3", subj: "DBMS",  type: "Notes", title: "ER Model Notes",             driveLink: "#", viewLink: "#" },
  { id: 15, year: "2nd Year", sem: "Sem 3", subj: "DBMS",  type: "Notes", title: "Normalization Notes",        driveLink: "#", viewLink: "#" },
  { id: 16, year: "2nd Year", sem: "Sem 3", subj: "DBMS",  type: "Notes", title: "SQL Notes",                  driveLink: "#", viewLink: "#" },
  { id: 17, year: "2nd Year", sem: "Sem 3", subj: "DBMS",  type: "Notes", title: "Transaction Management",     driveLink: "#", viewLink: "#" },
  { id: 18, year: "2nd Year", sem: "Sem 3", subj: "DBMS",  type: "PYQ",   title: "DBMS PYQ 2024",              driveLink: "#", viewLink: "#" },
  { id: 19, year: "2nd Year", sem: "Sem 3", subj: "DBMS",  type: "PYQ",   title: "DBMS PYQ 2023",              driveLink: "#", viewLink: "#" },
  { id: 20, year: "2nd Year", sem: "Sem 3", subj: "DBMS",  type: "Video", title: "Introduction to DBMS",       driveLink: "#", viewLink: "#" },
  { id: 21, year: "2nd Year", sem: "Sem 3", subj: "DBMS",  type: "Video", title: "ER Model in DBMS",           driveLink: "#", viewLink: "#" },
  { id: 22, year: "2nd Year", sem: "Sem 3", subj: "DBMS",  type: "IQ",    title: "DBMS Important Questions",   driveLink: "#", viewLink: "#" },
  { id: 23, year: "2nd Year", sem: "Sem 3", subj: "CN",    type: "Notes", title: "CN Unit 1 Notes",            driveLink: "#", viewLink: "#" },
  { id: 24, year: "2nd Year", sem: "Sem 3", subj: "CN",    type: "Notes", title: "CN Unit 2 Notes",            driveLink: "#", viewLink: "#" },
  { id: 25, year: "2nd Year", sem: "Sem 3", subj: "CN",    type: "PYQ",   title: "CN PYQ 2023",                driveLink: "#", viewLink: "#" },
  { id: 26, year: "2nd Year", sem: "Sem 3", subj: "CN",    type: "IQ",    title: "CN Important Questions",     driveLink: "#", viewLink: "#" },
  { id: 27, year: "2nd Year", sem: "Sem 3", subj: "DCCN",  type: "Notes", title: "DCCN Unit 1 Notes",          driveLink: "#", viewLink: "#" },
  { id: 28, year: "2nd Year", sem: "Sem 3", subj: "DCCN",  type: "Video", title: "DCCN Lecture 1",             driveLink: "#", viewLink: "#" },
  { id: 29, year: "2nd Year", sem: "Sem 3", subj: "DCCN",  type: "PYQ",   title: "DCCN PYQ 2023",              driveLink: "#", viewLink: "#" },
  // 2nd Year - Sem 4
  { id: 30, year: "2nd Year", sem: "Sem 4", subj: "TOC",   type: "Notes", title: "TOC Unit 1 Notes",           driveLink: "#", viewLink: "#" },
  { id: 31, year: "2nd Year", sem: "Sem 4", subj: "TOC",   type: "PYQ",   title: "TOC PYQ 2024",               driveLink: "#", viewLink: "#" },
  { id: 32, year: "2nd Year", sem: "Sem 4", subj: "TOC",   type: "IQ",    title: "TOC Important Questions",    driveLink: "#", viewLink: "#" },
  { id: 33, year: "2nd Year", sem: "Sem 4", subj: "OS",    type: "Notes", title: "OS Unit 1 Notes",            driveLink: "#", viewLink: "#" },
  { id: 34, year: "2nd Year", sem: "Sem 4", subj: "OS",    type: "Notes", title: "OS Unit 2 Notes",            driveLink: "#", viewLink: "#" },
  { id: 35, year: "2nd Year", sem: "Sem 4", subj: "OS",    type: "Video", title: "Process Scheduling in OS",   driveLink: "#", viewLink: "#" },
  { id: 36, year: "2nd Year", sem: "Sem 4", subj: "OS",    type: "PYQ",   title: "OS PYQ 2023",                driveLink: "#", viewLink: "#" },
  { id: 37, year: "2nd Year", sem: "Sem 4", subj: "SE",    type: "Notes", title: "SE Unit 1 Notes",            driveLink: "#", viewLink: "#" },
  { id: 38, year: "2nd Year", sem: "Sem 4", subj: "SE",    type: "PYQ",   title: "SE PYQ 2023",                driveLink: "#", viewLink: "#" },
  { id: 39, year: "2nd Year", sem: "Sem 4", subj: "DS",    type: "Notes", title: "DS Unit 1 Notes",            driveLink: "#", viewLink: "#" },
  { id: 40, year: "2nd Year", sem: "Sem 4", subj: "DS",    type: "Video", title: "DS Lecture — Arrays",        driveLink: "#", viewLink: "#" },
  // 3rd Year - Sem 5
  { id: 41, year: "3rd Year", sem: "Sem 5", subj: "CD",    type: "Notes", title: "Compiler Design Notes",      driveLink: "#", viewLink: "#" },
  { id: 42, year: "3rd Year", sem: "Sem 5", subj: "CD",    type: "IQ",    title: "CD Important Questions",     driveLink: "#", viewLink: "#" },
  { id: 43, year: "3rd Year", sem: "Sem 6", subj: "CD",    type: "PYQ",   title: "CD PYQ 2024",                driveLink: "#", viewLink: "#" },
  // 4th Year
  { id: 44, year: "4th Year", sem: "Sem 7", subj: "AI",    type: "Notes", title: "AI Unit 1 Notes",            driveLink: "#", viewLink: "#" },
  { id: 45, year: "4th Year", sem: "Sem 7", subj: "AI",    type: "Video", title: "ML Introduction",            driveLink: "#", viewLink: "#" },
  { id: 46, year: "4th Year", sem: "Sem 8", subj: "AI",    type: "PYQ",   title: "AI PYQ 2024",                driveLink: "#", viewLink: "#" },
  { id: 47, year: "4th Year", sem: "Sem 8", subj: "AI",    type: "IQ",    title: "AI Important Questions",     driveLink: "#", viewLink: "#" },
];

const YEARS    = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const SEMS_BY_YEAR = {
  "1st Year": ["Sem 1", "Sem 2"],
  "2nd Year": ["Sem 3", "Sem 4"],
  "3rd Year": ["Sem 5", "Sem 6"],
  "4th Year": ["Sem 7", "Sem 8"],
};
const ALL_SEMS = ["Sem 1","Sem 2","Sem 3","Sem 4","Sem 5","Sem 6","Sem 7","Sem 8"];

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
export default function RTUSolutionsPage() {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSem,  setSelectedSem]  = useState(null);
  const [selectedSubj, setSelectedSubj] = useState("All Subjects");
  const [query,        setQuery]        = useState("");

  // Sidebar subjects — year+sem ke hisaab se
  const sidebarSubjects = useMemo(() => {
    const filtered = ALL_DATA.filter((d) => {
      if (selectedYear && d.year !== selectedYear) return false;
      if (selectedSem  && d.sem  !== selectedSem)  return false;
      return true;
    });
    const unique = [...new Set(filtered.map((d) => d.subj))].sort();
    return ["All Subjects", ...unique];
  }, [selectedYear, selectedSem]);

  // Semester dropdown options
  const semOptions = selectedYear
    ? ["Select Semester", ...SEMS_BY_YEAR[selectedYear]]
    : ["Select Semester", ...ALL_SEMS];

  // Table rows
  const results = useMemo(() => {
    return ALL_DATA.filter((d) => {
      if (selectedYear && d.year !== selectedYear) return false;
      if (selectedSem  && d.sem  !== selectedSem)  return false;
      if (selectedSubj && selectedSubj !== "All Subjects" && d.subj !== selectedSubj) return false;
      if (query) {
        const q = query.toLowerCase();
        return (
          d.title.toLowerCase().includes(q) ||
          d.subj.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [selectedYear, selectedSem, selectedSubj, query]);

  function handleYearChange(e) {
    const y = e.target.value;
    setSelectedYear(y === "Select Year" ? null : y);
    setSelectedSem(null);
    setSelectedSubj("All Subjects");
    setQuery("");
  }

  function handleSemChange(e) {
    const s = e.target.value;
    setSelectedSem(s === "Select Semester" ? null : s);
    setSelectedSubj("All Subjects");
    setQuery("");
  }

  function handleSubjClick(subj) {
    setSelectedSubj(subj);
    setQuery("");
  }

  // sem label for table column
  const semLabel = selectedSem || (selectedYear ? SEMS_BY_YEAR[selectedYear]?.join(", ") : "All Sem");

  return (
    <main className="min-h-screen bg-gray-50">

      {/* ── Top bar: Year dropdown + Sem dropdown + Search ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center gap-3">
        {/* Year select */}
        <select
          onChange={handleYearChange}
          defaultValue="Select Year"
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#E8700A] bg-white cursor-pointer"
        >
          <option>Select Year</option>
          {YEARS.map((y) => <option key={y}>{y}</option>)}
        </select>

        {/* Semester select */}
        <select
          onChange={handleSemChange}
          value={selectedSem || "Select Semester"}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 outline-none focus:border-[#E8700A] bg-white cursor-pointer"
        >
          {semOptions.map((s) => <option key={s}>{s}</option>)}
        </select>

        {/* Search */}
        <div className="relative flex-1 min-w-50">
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); }}
            placeholder="Search notes..."
            className="w-full border border-gray-300 rounded-md pl-3 pr-9 py-2 text-sm outline-none focus:border-[#E8700A] bg-white"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">🔍</span>
        </div>
      </div>

      {/* ── Body: Sidebar + Table ── */}
      <div className="flex min-h-[calc(100vh-120px)]">

        {/* ── Left Sidebar ── */}
        <aside className="w-44 bg-[#071A3D] shrink-0">
          <ul>
            {sidebarSubjects.map((subj) => (
              <li key={subj}>
                <button
                  onClick={() => handleSubjClick(subj)}
                  className={`
                    w-full text-left px-5 py-3 text-sm font-medium transition-colors border-b border-white/5
                    ${selectedSubj === subj
                      ? "bg-[#E8700A] text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {subj}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Right: Table ── */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-5 py-3 font-semibold text-gray-600 w-1/2">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Semester</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">File</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? (
                  results.map((item, idx) => (
                    <tr
                      key={item.id}
                      className={`border-b border-gray-100 hover:bg-orange-50 transition-colors ${idx % 2 === 0 ? "" : "bg-gray-50/50"}`}
                    >
                      {/* Title */}
                      <td className="px-5 py-3 text-gray-800 font-medium">{item.title}</td>

                      {/* Semester */}
                      <td className="px-4 py-3 text-gray-500">{item.sem}</td>

                      {/* File — Google Drive icon */}
                      <td className="px-4 py-3">
                        <a href={item.driveLink} target="_blank" rel="noreferrer" title="View on Google Drive">
                          {/* Google Drive color icon */}
                          <svg width="22" height="20" viewBox="0 0 87.3 78" xmlns="http://www.w3.org/2000/svg">
                            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z" fill="#ea4335"/>
                            <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#00832d"/>
                            <path d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z" fill="#2684fc"/>
                            <path d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 27h27.45c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
                          </svg>
                        </a>
                      </td>

                      {/* Action — Download button */}
                      <td className="px-4 py-3">
                        <a
                          href={item.driveLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block bg-[#E8700A] hover:bg-[#c45f00] text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-colors"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center text-gray-400">
                      <p className="text-2xl mb-2">🔍</p>
                      <p className="font-medium">Koi result nahi mila</p>
                      <p className="text-xs mt-1">Filter ya search change karo</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Result count */}
          {results.length > 0 && (
            <p className="text-xs text-gray-400 mt-3 text-right">
              {results.length} items found
            </p>
          )}
        </div>
      </div>
    </main>
  );
}