"use client";

import React, { useEffect, useState } from "react";
import { SiGoogledrive } from "react-icons/si";
import {
  FiSearch, FiDownload, FiX,
  FiBookOpen, FiFilter, FiLock, FiEye,
} from "react-icons/fi";
import { FaGift } from "react-icons/fa";

const SOLUTION_TYPE_LABELS = {
  complete_notes: "Complete Notes",
  important_questions: "Important Questions",
  pyq_solutions: "PYQ Solutions",
  assignment: "Assignment",
};

function truncateDesc(text, limit = 80) {
  if (!text) return null;
  return text.length > limit ? text.slice(0, limit).trimEnd() + "..." : text;
}

function StatusBadge({ sol, isFree }) {
  if (sol.is_premium && isFree) {
    return (
      <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-green-400 text-green-950 border border-green-500">
        <FaGift size={8} />
        FREE Trial
      </span>
    );
  }
  if (sol.is_premium) {
    return (
      <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-amber-950 border border-amber-500">
        <FiLock size={8} />
        Premium · ₹{parseFloat(sol.price || 0).toFixed(0)}
      </span>
    );
  }
  return (
    <span className="absolute top-2 left-2 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-400 text-emerald-950 border border-emerald-500">
      Free
    </span>
  );
}

function TypeBadge({ type }) {
  return (
    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#071A3D] text-white">
      {SOLUTION_TYPE_LABELS[type] || type}
    </span>
  );
}


function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}


function slugify(text) {
  if (!text) return "";
  return text
    .replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/[–—]/g, "-")
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .trim()
    .replace(/^-|-$/g, "");
}



function SeePdfButton({ sol }) {
  return (
    <a
      href={`/solutions/${sol.id}-${slugify(sol.title)}`}
      className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 py-2 rounded-lg text-xs font-semibold transition-colors"
    >
      <FiEye size={12} /> Preview
    </a>
  );
}


// function SeePdfButton({ sol }) {
//   return (
//     <a
//       href={`/solutions/${sol.id}`}
//       className="flex-1 flex items-center justify-center gap-1.5 border border-gray-300 text-gray-700 hover:bg-gray-100 py-2 rounded-lg text-xs font-semibold transition-colors"
//     >
//       <FiEye size={12} /> Preview
//     </a>
//   );
// }

function ActionButton({ sol, isFree }) {
  // Premium PDF but trial available — FREE download
  if (sol.is_premium && isFree) {
    return (
      <a
        href={`/checkout?solution_id=${sol.id}`}
        className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs font-bold transition-colors"
      >
        <FaGift size={11} />
        Get FREE
      </a>
    );
  }

  // Premium PDF, no trial left — pay karo
  if (sol.is_premium) {
    return (
      <a
        href={`/checkout?solution_id=${sol.id}`}
        className="flex-1 flex items-center justify-center gap-1.5 bg-[#071A3D] hover:bg-[#0d2a5e] text-white py-2 rounded-lg text-xs font-bold transition-colors"
      >
        <FiLock size={11} />
        Buy ₹{parseFloat(sol.price || 0).toFixed(0)}
      </a>
    );
  }

  // Actually free PDF
  return (
    <a
      href={`/api/download?id=${sol.id}`}
      className="flex-1 flex items-center justify-center gap-1.5 bg-[#E8700A] hover:bg-[#cf6209] text-white py-2 rounded-lg text-xs font-bold transition-colors"
    >
      <FiDownload size={12} /> Download Free
    </a>
  );
}

function SolutionCard({ sol, isFree }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#E8700A]/40 hover:shadow-sm transition-all">
      <div className="relative w-full bg-gray-100" style={{ aspectRatio: "16/9" }}>
        {sol.thumbnail_blob_name ? (
          <img
            src={`/api/thumbnail?id=${sol.id}`}
            alt={sol.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center gap-2">
            <FiBookOpen size={30} className="text-slate-400" />
            <span className="text-[11px] text-slate-400 font-medium">No thumbnail</span>
          </div>
        )}
        <StatusBadge sol={sol} isFree={isFree} />
        <TypeBadge type={sol.solution_type} />
      </div>

      <div className="p-4">
        <h3 className="text-sm font-bold text-[#071A3D] leading-snug mb-1.5 line-clamp-2">
          {sol.title}
        </h3>
        {sol.description ? (
          <p className="text-xs text-gray-500 leading-relaxed mb-3">
            {truncateDesc(sol.description)}
          </p>
        ) : (
          <p className="text-xs text-gray-400 italic mb-3">No description added.</p>
        )}
        <div className="flex gap-2">
          <SeePdfButton sol={sol} />
          <ActionButton sol={sol} isFree={isFree} />
        </div>
      </div>
    </div>
  );
}

export default function Notes() {
  const [degrees, setDegrees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [solutions, setSolutions] = useState([]);

  const [degree, setDegree] = useState("");
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [search, setSearch] = useState("");

  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingSolutions, setLoadingSolutions] = useState(false);

  // Trial status
  const [trialsLeft, setTrialsLeft] = useState(0);

  useEffect(() => {
    fetch("/api/user/trial-status")
      .then((r) => r.json())
      .then((data) => setTrialsLeft(data.trialsLeft || 0))
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch("/api/degrees")
      .then((r) => r.json())
      .then((data) => {
        setDegrees(data);
        if (data.length > 0) setDegree(String(data[0].id));
      });
  }, []);

  useEffect(() => {
    if (!degree) return;
    fetch(`/api/branch?degree_id=${degree}`)
      .then((r) => r.json())
      .then((data) => {
        setBranches(data);
        setSemesters([]); setSubjects([]); setSolutions([]);
        setSemester(""); setSubject("");
        if (data.length > 0) setBranch(String(data[0].id));
        else setBranch("");
      });
  }, [degree]);

  useEffect(() => {
    if (!branch) return;
    fetch(`/api/semesters?branch_id=${branch}`)
      .then((r) => r.json())
      .then((data) => {
        setSemesters(data);
        setSubjects([]); setSolutions([]);
        setSemester(""); setSubject("");
        if (data.length > 0) setSemester(String(data[0].id));
      });
  }, [branch]);

  useEffect(() => {
    if (!semester) return;
    setLoadingSubjects(true);
    fetch(`/api/subjects?semester_id=${semester}`)
      .then((r) => r.json())
      .then((data) => {
        setSubjects(data);
        setSolutions([]); setSubject("");
        if (data.length > 0) setSubject(String(data[0].id));
      })
      .finally(() => setLoadingSubjects(false));
  }, [semester]);

  useEffect(() => {
    if (!subject) return;
    setLoadingSolutions(true);
    fetch(`/api/solutions?subject_id=${subject}`)
      .then((r) => r.json())
      .then((data) => setSolutions(data))
      .finally(() => setLoadingSolutions(false));
  }, [subject]);

  const filteredSolutions = solutions.filter((sol) =>
    sol.title?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedDegreeName = degrees.find((d) => String(d.id) === degree)?.name;
  const selectedBranchName = branches.find((b) => String(b.id) === branch)?.name;
  const selectedSemester = semesters.find((s) => String(s.id) === semester);
  const hasPath = degree || branch || semester;

  const resetAll = () => {
    setDegree(""); setBranch(""); setSemester(""); setSubject(""); setSearch("");
  };

  const selectClass =
    "h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm font-semibold text-[#071A3D] outline-none transition focus:border-[#E8700A] focus:ring-2 focus:ring-[#E8700A]/20 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";

  const labelClass =
    "block mb-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-500";

  return (
    <section id="notes-section" className="min-h-screen bg-gray-100">

      <div className="sticky top-0 z-30 bg-[#071A3D] shadow-lg">
        <div className="max-w-6xl mx-auto text-center px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center text-center justify-between gap-3">
            <div className="justify-center text-center">
              <h1 className="flex text-center gap-2 text-lg sm:text-2xl font-bold text-white">
                <span>RTU Paper</span>Solutions<SiGoogledrive size={18} className="text-[#E8700A]" />
              </h1>
            </div>
            {hasPath && (
              <button
                onClick={resetAll}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1.5 rounded-lg transition"
              >
                <FiX size={13} /> Reset
              </button>
            )}
          </div>

          {/* Trial banner */}
          {trialsLeft > 0 && (
            <div className="mt-2 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/40 px-3 py-1.5 rounded-lg">
              <FaGift size={11} className="text-green-400" />
              <span className="text-xs font-semibold text-green-300">
                {trialsLeft} Free PDF{trialsLeft > 1 ? "s" : ""} remaining — Download any premium PDF free!
              </span>
            </div>
          )}

          {hasPath && (
            <div className="mt-2 flex items-center gap-1.5 overflow-x-auto text-xs text-gray-400 whitespace-nowrap">
              <span className="text-gray-500">Path:</span>
              {selectedDegreeName && <span className="text-gray-300">{selectedDegreeName}</span>}
              {selectedBranchName && (
                <><span className="text-gray-600">/</span>
                <span className="text-gray-300">{selectedBranchName}</span></>
              )}
              {selectedSemester && (
                <><span className="text-gray-600">/</span>
                <span className="text-gray-300">
                  Semester {selectedSemester.semester_number || selectedSemester.name}
                </span></>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
            <FiFilter size={13} className="text-[#E8700A]" />
            Select your course
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Degree</label>
              <select className={selectClass} value={degree} onChange={(e) => setDegree(e.target.value)}>
                <option value="">Select degree</option>
                {degrees.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Branch</label>
              <select className={selectClass} value={branch} onChange={(e) => setBranch(e.target.value)} disabled={!degree}>
                <option value="">Select branch</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Semester</label>
              <select className={selectClass} value={semester} onChange={(e) => setSemester(e.target.value)} disabled={!branch}>
                <option value="">Select semester</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>Semester {s.semester_number || s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 max-w-6xl w-full mx-auto">
          {semester && (
            <div className="w-full lg:w-[320px] xl:w-87.5 bg-[#071A3D] rounded-2xl border border-gray-200 p-5">
              <div className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-300">
                <FiBookOpen size={13} className="text-[#E8700A]" />
                Select Subject
              </div>
              {loadingSubjects ? (
                <p className="text-gray-300 text-sm">Loading subjects...</p>
              ) : subjects.length === 0 ? (
                <p className="text-gray-300 text-sm">No subjects found for this semester.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {subjects.map((sub) => {
                    const active = String(subject) === String(sub.id);
                    return (
                      <button
                        key={sub.id}
                        onClick={() => setSubject(sub.id)}
                        className={`w-full px-4 py-2 text-sm font-semibold rounded-lg border transition-all active:scale-95 ${
                          active
                            ? "bg-[#E8700A] text-white border-[#E8700A]"
                            : "bg-white text-[#071A3D] border-gray-300 hover:border-[#E8700A] hover:bg-orange-50 hover:text-[#E8700A]"
                        }`}
                      >
                        {sub.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="flex-1 bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center gap-3 bg-gray-50">
              <FiSearch size={16} className="text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder={subject ? "Search by title..." : "Select a subject first"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={!subject}
                className="flex-1 bg-transparent text-sm font-medium text-[#071A3D] placeholder-gray-400 outline-none disabled:cursor-not-allowed"
              />
              {filteredSolutions.length > 0 && (
                <span className="hidden sm:inline text-xs font-semibold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full">
                  {filteredSolutions.length} result{filteredSolutions.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {loadingSolutions ? (
              <div className="py-20 text-center text-gray-400 text-sm">Loading notes...</div>
            ) : filteredSolutions.length === 0 ? (
              <div className="py-20 text-center px-6">
                <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <FiBookOpen size={24} className="text-[#E8700A]" />
                </div>
                <h4 className="text-base font-bold text-[#071A3D]">
                  {subject ? "No notes found" : "Select a subject"}
                </h4>
                <p className="text-gray-500 mt-1 text-sm">
                  {subject
                    ? "No notes have been uploaded for this subject yet."
                    : "Choose a subject above to browse available notes."}
                </p>
              </div>
            ) : (
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredSolutions.map((sol) => (
                    <SolutionCard
                      key={sol.id}
                      sol={sol}
                      isFree={trialsLeft > 0}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}


