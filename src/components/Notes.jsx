"use client";

import React, { useEffect, useState } from "react";
import { SiGoogledrive } from "react-icons/si";
import {
  FiSearch,
  FiDownload,
  FiX,
  FiBookOpen,
  FiFilter,
  FiLock,
} from "react-icons/fi";

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

  useEffect(() => {
    fetch("/api/degrees")
      .then((res) => res.json())
      .then((data) => setDegrees(data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!degree) return;
    fetch(`/api/branch?degree_id=${degree}`)
      .then((res) => res.json())
      .then((data) => {
        setBranches(data);
        setSemesters([]);
        setSubjects([]);
        setSolutions([]);
        setBranch("");
        setSemester("");
        setSubject("");
      })
      .catch((err) => console.log(err));
  }, [degree]);

  useEffect(() => {
    if (!branch) return;
    fetch(`/api/semesters?branch_id=${branch}`)
      .then((res) => res.json())
      .then((data) => {
        setSemesters(data);
        setSubjects([]);
        setSolutions([]);
        setSemester("");
        setSubject("");
      })
      .catch((err) => console.log(err));
  }, [branch]);

  useEffect(() => {
    if (!semester) return;
    setLoadingSubjects(true);
    fetch(`/api/subjects?semester_id=${semester}`)
      .then((res) => res.json())
      .then((data) => {
        setSubjects(data);
        setSolutions([]);
        setSubject("");
      })
      .catch((err) => console.log(err))
      .finally(() => setLoadingSubjects(false));
  }, [semester]);

  useEffect(() => {
    if (!subject) return;
    setLoadingSolutions(true);
    fetch(`/api/solutions?subject_id=${subject}`)
      .then((res) => res.json())
      .then((data) => setSolutions(data))
      .catch((err) => console.log(err))
      .finally(() => setLoadingSolutions(false));
  }, [subject]);

  const filteredSolutions = solutions.filter((sol) =>
    sol.title?.toLowerCase().includes(search.toLowerCase())
  );

  const selectedDegreeName = degrees.find(
    (d) => String(d.id) === String(degree)
  )?.name;
  const selectedBranchName = branches.find(
    (b) => String(b.id) === String(branch)
  )?.name;
  const selectedSemester = semesters.find(
    (s) => String(s.id) === String(semester)
  );

  const resetAll = () => {
    setDegree("");
    setBranch("");
    setSemester("");
    setSubject("");
    setSearch("");
  };

  const selectClass =
    "h-12 w-full rounded-lg border border-[#142647]/15 bg-white px-4 text-sm font-medium text-[#142647] outline-none transition focus:border-[#E8700A] focus:ring-2 focus:ring-[#E8700A]/30 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

  const labelClass =
    "block mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400";

  const hasPath = degree || branch || semester;

  // ─── Download Button — premium ho to checkout pe le jaata hai (preview wahin dikhega) ──
  function DownloadButton({ sol }) {
    if (sol.is_premium) {
      return (
        <a
          href={`/checkout?solution_id=${sol.id}`}
          className="inline-flex items-center gap-1.5 bg-[#071A3D] hover:bg-[#0d2a5e] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          <FiLock size={13} />
          Buy ₹{parseFloat(sol.price || 0).toFixed(0)}
        </a>
      );
    }
    return (
      <a
        href={`/api/download?id=${sol.id}`}
        className="inline-flex items-center gap-1.5 bg-[#E8700A] hover:bg-[#cf6209] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
      >
        <FiDownload size={14} /> Download
      </a>
    );
  }

  function StatusBadge({ sol }) {
    if (sol.is_premium) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#E8700A] border border-[#E8700A]/20">
          <FiLock size={10} />
          Premium
          {sol.price && sol.price > 0 && (
            <span className="ml-1 font-bold">
              • ₹{parseFloat(sol.price).toFixed(0)}
            </span>
          )}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
        Free
      </span>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-30 bg-[#071A3D] shadow-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#E8700A]">
                RTU Solutions
              </span>
              <h1 className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-white">
                Library <SiGoogledrive size={18} />
              </h1>
            </div>
          </div>

          {hasPath && (
            <div className="mt-2 flex items-center gap-2 overflow-x-auto">
              <div className="flex items-center gap-1.5 text-xs text-gray-300 whitespace-nowrap">
                {selectedDegreeName && <span>{selectedDegreeName}</span>}
                {selectedBranchName && (
                  <>
                    <span className="text-gray-500">/</span>
                    <span>{selectedBranchName}</span>
                  </>
                )}
                {selectedSemester && (
                  <>
                    <span className="text-gray-500">/</span>
                    <span>
                      Sem {selectedSemester.semester_number || selectedSemester.name}
                    </span>
                  </>
                )}
              </div>
              <button
                onClick={resetAll}
                aria-label="Reset filters"
                className="ml-auto flex items-center gap-1 text-xs text-gray-300 hover:text-white transition"
              >
                <FiX size={14} /> Reset
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-5">
          <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
            <FiFilter size={13} /> Apna course chuno
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Degree</label>
              <select
                className={selectClass}
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
              >
                <option value="">Select degree</option>
                {degrees.map((deg) => (
                  <option key={deg.id} value={deg.id}>
                    {deg.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Branch</label>
              <select
                className={selectClass}
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                disabled={!degree}
              >
                <option value="">Select branch</option>
                {branches.map((br) => (
                  <option key={br.id} value={br.id}>
                    {br.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Semester</label>
              <select
                className={selectClass}
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                disabled={!branch}
              >
                <option value="">Select semester</option>
                {semesters.map((sem) => (
                  <option key={sem.id} value={sem.id}>
                    Semester {sem.semester_number || sem.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {semester && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-5">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
              <FiBookOpen size={13} /> Subject chuno
            </div>

            {loadingSubjects ? (
              <p className="text-gray-400 text-sm px-1 py-2">Loading subjects...</p>
            ) : subjects.length === 0 ? (
              <p className="text-gray-400 text-sm px-1 py-2">
                Is semester ke liye subjects available nahi hain.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {subjects.map((sub) => {
                  const active = String(subject) === String(sub.id);
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSubject(sub.id)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all border active:scale-95 ${
                        active
                          ? "bg-[#E8700A] text-white border-[#E8700A] shadow-sm"
                          : "bg-white text-[#071A3D] border-gray-200 hover:border-[#E8700A]/40 hover:bg-orange-50"
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <div className="relative">
              <FiSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={17}
              />
              <input
                type="text"
                placeholder={
                  subject ? "Title se search karo..." : "Pehle subject select karo"
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={!subject}
                className="h-12 w-full rounded-lg border border-[#142647]/15 bg-white pl-10 pr-4 text-sm font-medium text-[#142647] outline-none transition focus:border-[#E8700A] focus:ring-2 focus:ring-[#E8700A]/30 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
              />
            </div>

            {filteredSolutions.length > 0 && (
              <p className="mt-2 text-xs font-medium text-gray-400">
                {filteredSolutions.length} item
                {filteredSolutions.length > 1 ? "s" : ""} mile
              </p>
            )}
          </div>

          {loadingSolutions ? (
            <div className="px-6 py-16 text-center text-gray-400 text-sm">
              Notes load ho rahe hain...
            </div>
          ) : filteredSolutions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center">
                <FiBookOpen className="text-[#E8700A]" size={20} />
              </div>
              <h4 className="text-lg font-semibold text-[#071A3D]">
                {subject ? "Koi notes nahi mile" : "Subject select karo"}
              </h4>
              <p className="text-gray-400 mt-1 text-sm">
                {subject
                  ? "Is subject ke liye abhi koi notes upload nahi hue."
                  : "Notes dekhne ke liye upar se subject chuno."}
              </p>
            </div>
          ) : (
            <>
              {/* ── Mobile: card list ── */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredSolutions.map((sol) => (
                  <div key={sol.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-semibold text-[#071A3D] leading-snug">
                          {sol.title}
                        </p>
                        {sol.description && (
                          <p className="text-gray-400 text-xs mt-1">
                            {sol.description}
                          </p>
                        )}
                      </div>
                      <StatusBadge sol={sol} />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs uppercase font-medium text-gray-400">
                        {sol.solution_type}
                      </span>
                      <DownloadButton sol={sol} />
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Desktop: table ── */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#071A3D]/3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Status & Price</th>
                      <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredSolutions.map((sol) => (
                      <tr
                        key={sol.id}
                        className="hover:bg-orange-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#071A3D]">
                            {sol.title}
                          </p>
                          {sol.description && (
                            <p className="text-gray-400 text-xs mt-0.5">
                              {sol.description}
                            </p>
                          )}
                        </td>
                        <td className="px-6 py-4 capitalize text-gray-500">
                          {sol.solution_type}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge sol={sol} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DownloadButton sol={sol} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// "use client";

// import React, { useEffect, useState } from "react";
// import { SiGoogledrive } from "react-icons/si";
// import {
//   FiSearch,
//   FiDownload,
//   FiX,
//   FiBookOpen,
//   FiFilter,
//   FiLock,
//   FiEye,
// } from "react-icons/fi";

// export default function Notes() {
//   const [degrees, setDegrees] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [solutions, setSolutions] = useState([]);

//   const [degree, setDegree] = useState("");
//   const [branch, setBranch] = useState("");
//   const [semester, setSemester] = useState("");
//   const [subject, setSubject] = useState("");
//   const [search, setSearch] = useState("");

//   const [loadingSubjects, setLoadingSubjects] = useState(false);
//   const [loadingSolutions, setLoadingSolutions] = useState(false);

//   useEffect(() => {
//     fetch("/api/degrees")
//       .then((res) => res.json())
//       .then((data) => setDegrees(data))
//       .catch((err) => console.log(err));
//   }, []);

//   useEffect(() => {
//     if (!degree) return;
//     fetch(`/api/branch?degree_id=${degree}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setBranches(data);
//         setSemesters([]);
//         setSubjects([]);
//         setSolutions([]);
//         setBranch("");
//         setSemester("");
//         setSubject("");
//       })
//       .catch((err) => console.log(err));
//   }, [degree]);

//   useEffect(() => {
//     if (!branch) return;
//     fetch(`/api/semesters?branch_id=${branch}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setSemesters(data);
//         setSubjects([]);
//         setSolutions([]);
//         setSemester("");
//         setSubject("");
//       })
//       .catch((err) => console.log(err));
//   }, [branch]);

//   useEffect(() => {
//     if (!semester) return;
//     setLoadingSubjects(true);
//     fetch(`/api/subjects?semester_id=${semester}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setSubjects(data);
//         setSolutions([]);
//         setSubject("");
//       })
//       .catch((err) => console.log(err))
//       .finally(() => setLoadingSubjects(false));
//   }, [semester]);

//   useEffect(() => {
//     if (!subject) return;
//     setLoadingSolutions(true);
//     fetch(`/api/solutions?subject_id=${subject}`)
//       .then((res) => res.json())
//       .then((data) => setSolutions(data))
//       .catch((err) => console.log(err))
//       .finally(() => setLoadingSolutions(false));
//   }, [subject]);

//   const filteredSolutions = solutions.filter((sol) =>
//     sol.title?.toLowerCase().includes(search.toLowerCase())
//   );

//   const selectedDegreeName = degrees.find(
//     (d) => String(d.id) === String(degree)
//   )?.name;
//   const selectedBranchName = branches.find(
//     (b) => String(b.id) === String(branch)
//   )?.name;
//   const selectedSemester = semesters.find(
//     (s) => String(s.id) === String(semester)
//   );

//   const resetAll = () => {
//     setDegree("");
//     setBranch("");
//     setSemester("");
//     setSubject("");
//     setSearch("");
//   };

//   const selectClass =
//     "h-12 w-full rounded-lg border border-[#142647]/15 bg-white px-4 text-sm font-medium text-[#142647] outline-none transition focus:border-[#E8700A] focus:ring-2 focus:ring-[#E8700A]/30 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400";

//   const labelClass =
//     "block mb-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400";

//   const hasPath = degree || branch || semester;

//   // ─── See PDF Button — preview page ke liye, page khulte hi 2 page dikhega ──
//   function SeePdfButton({ sol }) {
//     return (
//       <a
//         href={`/solutions/${sol.id}`}
//         className="inline-flex items-center gap-1.5 border border-[#071A3D]/20 text-[#071A3D] hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
//       >
//         <FiEye size={14} /> See PDF
//       </a>
//     );
//   }

//   // ─── Download Button ───────────────────────────────────────────────────────
//   function DownloadButton({ sol }) {
//     if (sol.is_premium) {
//       return (
//         <a
//           href={`/checkout?solution_id=${sol.id}`}
//           className="inline-flex items-center gap-1.5 bg-[#071A3D] hover:bg-[#0d2a5e] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
//         >
//           <FiLock size={13} />
//           Buy ₹{parseFloat(sol.price || 0).toFixed(0)}
//         </a>
//       );
//     }
//     return (
//       <a
//         href={`/api/download?id=${sol.id}`}
//         className="inline-flex items-center gap-1.5 bg-[#E8700A] hover:bg-[#cf6209] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
//       >
//         <FiDownload size={14} /> Download
//       </a>
//     );
//   }

//   function StatusBadge({ sol }) {
//     if (sol.is_premium) {
//       return (
//         <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#E8700A] border border-[#E8700A]/20">
//           <FiLock size={10} />
//           Premium
//           {sol.price && sol.price > 0 && (
//             <span className="ml-1 font-bold">
//               • ₹{parseFloat(sol.price).toFixed(0)}
//             </span>
//           )}
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
//         Free
//       </span>
//     );
//   }

//   return (
//     <section className="min-h-screen bg-gray-50">
//       <div className="sticky top-0 z-30 bg-[#071A3D] shadow-md">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
//           <div className="flex items-center justify-between gap-3">
//             <div>
//               <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[#E8700A]">
//                 RTU Solutions
//               </span>
//               <h1 className="flex items-center gap-2 text-lg sm:text-2xl font-bold text-white">
//                 Library <SiGoogledrive size={18} />
//               </h1>
//             </div>
//           </div>

//           {hasPath && (
//             <div className="mt-2 flex items-center gap-2 overflow-x-auto">
//               <div className="flex items-center gap-1.5 text-xs text-gray-300 whitespace-nowrap">
//                 {selectedDegreeName && <span>{selectedDegreeName}</span>}
//                 {selectedBranchName && (
//                   <>
//                     <span className="text-gray-500">/</span>
//                     <span>{selectedBranchName}</span>
//                   </>
//                 )}
//                 {selectedSemester && (
//                   <>
//                     <span className="text-gray-500">/</span>
//                     <span>
//                       Sem {selectedSemester.semester_number || selectedSemester.name}
//                     </span>
//                   </>
//                 )}
//               </div>
//               <button
//                 onClick={resetAll}
//                 aria-label="Reset filters"
//                 className="ml-auto flex items-center gap-1 text-xs text-gray-300 hover:text-white transition"
//               >
//                 <FiX size={14} /> Reset
//               </button>
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-5">
//           <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
//             <FiFilter size={13} /> Apna course chuno
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//             <div>
//               <label className={labelClass}>Degree</label>
//               <select
//                 className={selectClass}
//                 value={degree}
//                 onChange={(e) => setDegree(e.target.value)}
//               >
//                 <option value="">Select degree</option>
//                 {degrees.map((deg) => (
//                   <option key={deg.id} value={deg.id}>
//                     {deg.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className={labelClass}>Branch</label>
//               <select
//                 className={selectClass}
//                 value={branch}
//                 onChange={(e) => setBranch(e.target.value)}
//                 disabled={!degree}
//               >
//                 <option value="">Select branch</option>
//                 {branches.map((br) => (
//                   <option key={br.id} value={br.id}>
//                     {br.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className={labelClass}>Semester</label>
//               <select
//                 className={selectClass}
//                 value={semester}
//                 onChange={(e) => setSemester(e.target.value)}
//                 disabled={!branch}
//               >
//                 <option value="">Select semester</option>
//                 {semesters.map((sem) => (
//                   <option key={sem.id} value={sem.id}>
//                     Semester {sem.semester_number || sem.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//         </div>

//         {semester && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5 mb-5">
//             <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
//               <FiBookOpen size={13} /> Subject chuno
//             </div>

//             {loadingSubjects ? (
//               <p className="text-gray-400 text-sm px-1 py-2">Loading subjects...</p>
//             ) : subjects.length === 0 ? (
//               <p className="text-gray-400 text-sm px-1 py-2">
//                 Is semester ke liye subjects available nahi hain.
//               </p>
//             ) : (
//               <div className="flex flex-wrap gap-2">
//                 {subjects.map((sub) => {
//                   const active = String(subject) === String(sub.id);
//                   return (
//                     <button
//                       key={sub.id}
//                       onClick={() => setSubject(sub.id)}
//                       className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all border active:scale-95 ${
//                         active
//                           ? "bg-[#E8700A] text-white border-[#E8700A] shadow-sm"
//                           : "bg-white text-[#071A3D] border-gray-200 hover:border-[#E8700A]/40 hover:bg-orange-50"
//                       }`}
//                     >
//                       {sub.name}
//                     </button>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         )}

//         <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//           <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
//             <div className="relative">
//               <FiSearch
//                 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 size={17}
//               />
//               <input
//                 type="text"
//                 placeholder={
//                   subject ? "Title se search karo..." : "Pehle subject select karo"
//                 }
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 disabled={!subject}
//                 className="h-12 w-full rounded-lg border border-[#142647]/15 bg-white pl-10 pr-4 text-sm font-medium text-[#142647] outline-none transition focus:border-[#E8700A] focus:ring-2 focus:ring-[#E8700A]/30 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
//               />
//             </div>

//             {filteredSolutions.length > 0 && (
//               <p className="mt-2 text-xs font-medium text-gray-400">
//                 {filteredSolutions.length} item
//                 {filteredSolutions.length > 1 ? "s" : ""} mile
//               </p>
//             )}
//           </div>

//           {loadingSolutions ? (
//             <div className="px-6 py-16 text-center text-gray-400 text-sm">
//               Notes load ho rahe hain...
//             </div>
//           ) : filteredSolutions.length === 0 ? (
//             <div className="px-6 py-16 text-center">
//               <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-orange-50 flex items-center justify-center">
//                 <FiBookOpen className="text-[#E8700A]" size={20} />
//               </div>
//               <h4 className="text-lg font-semibold text-[#071A3D]">
//                 {subject ? "Koi notes nahi mile" : "Subject select karo"}
//               </h4>
//               <p className="text-gray-400 mt-1 text-sm">
//                 {subject
//                   ? "Is subject ke liye abhi koi notes upload nahi hue."
//                   : "Notes dekhne ke liye upar se subject chuno."}
//               </p>
//             </div>
//           ) : (
//             <>
//               {/* ── Mobile: card list ── */}
//               <div className="md:hidden divide-y divide-gray-100">
//                 {filteredSolutions.map((sol) => (
//                   <div key={sol.id} className="p-4">
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="min-w-0">
//                         <p className="font-semibold text-[#071A3D] leading-snug">
//                           {sol.title}
//                         </p>
//                         {sol.description && (
//                           <p className="text-gray-400 text-xs mt-1">
//                             {sol.description}
//                           </p>
//                         )}
//                       </div>
//                       <StatusBadge sol={sol} />
//                     </div>

//                     <div className="mt-3 flex items-center justify-between">
//                       <span className="text-xs uppercase font-medium text-gray-400">
//                         {sol.solution_type}
//                       </span>
//                       <div className="flex items-center gap-2">
//                         <SeePdfButton sol={sol} />
//                         <DownloadButton sol={sol} />
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* ── Desktop: table ── */}
//               <div className="hidden md:block overflow-x-auto">
//                 <table className="w-full text-sm">
//                   <thead>
//                     <tr className="bg-[#071A3D]/3 text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
//                       <th className="px-6 py-3">Title</th>
//                       <th className="px-6 py-3">Type</th>
//                       <th className="px-6 py-3">Status & Price</th>
//                       <th className="px-6 py-3 text-right">Action</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-100">
//                     {filteredSolutions.map((sol) => (
//                       <tr
//                         key={sol.id}
//                         className="hover:bg-orange-50/50 transition-colors"
//                       >
//                         <td className="px-6 py-4">
//                           <p className="font-semibold text-[#071A3D]">
//                             {sol.title}
//                           </p>
//                           {sol.description && (
//                             <p className="text-gray-400 text-xs mt-0.5">
//                               {sol.description}
//                             </p>
//                           )}
//                         </td>
//                         <td className="px-6 py-4 capitalize text-gray-500">
//                           {sol.solution_type}
//                         </td>
//                         <td className="px-6 py-4">
//                           <StatusBadge sol={sol} />
//                         </td>
//                         <td className="px-6 py-4 text-right">
//                           <div className="flex items-center justify-end gap-3">
//                             <SeePdfButton sol={sol} />
//                             <DownloadButton sol={sol} />
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }





