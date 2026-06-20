"use client";
import { useState, useCallback } from "react";
import {
  RTU_SUBJECTS,
  RTU_GRADING,
  BRANCHES,
  getGradeFromMarks,
  calculateSGPA,
  calculateCGPA,
} from "@/src/data/rtuSubjects";

// ─── Small helper components ──────────────────────────────────────────────────

function GradeBadge({ grade }) {
  if (!grade) return <span className="text-gray-400 text-sm">—</span>;
  const colors = {
    O:  "bg-purple-100 text-purple-800 border border-purple-300",
    "A+": "bg-green-100 text-green-800 border border-green-300",
    A:  "bg-blue-100 text-blue-800 border border-blue-300",
    "B+": "bg-teal-100 text-teal-800 border border-teal-300",
    B:  "bg-yellow-100 text-yellow-800 border border-yellow-300",
    C:  "bg-orange-100 text-orange-800 border border-orange-300",
    F:  "bg-red-100 text-red-800 border border-red-300",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-bold ${colors[grade.grade] || ""}`}>
      {grade.grade}
    </span>
  );
}

function CgpaBar({ value }) {
  const pct = Math.min((value / 10) * 100, 100);
  const color =
    value >= 8.5 ? "bg-purple-500" :
    value >= 7.5 ? "bg-green-500" :
    value >= 6.5 ? "bg-blue-500" :
    value >= 5.5 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
      <div
        className={`${color} h-3 rounded-full transition-all duration-700`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function getDivision(cgpa) {
  if (cgpa >= 8.5) return { label: "First Division with Distinction", color: "text-purple-700" };
  if (cgpa >= 6.5) return { label: "First Division", color: "text-green-700" };
  if (cgpa >= 5.0) return { label: "Second Division", color: "text-yellow-700" };
  if (cgpa >= 4.5) return { label: "Third Division", color: "text-orange-700" };
  return { label: "Fail", color: "text-red-700" };
}

// ─── Step 1: Branch Select ────────────────────────────────────────────────────

function StepBranch({ onSelect }) {
  return (
    <div className="max-w-xl mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Select Your Branch</h2>
      <p className="text-gray-500 mb-8 text-sm">RTU Kota — B.Tech (8 Semesters)</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {BRANCHES.map((b) => {
          const icons = { CSE: "💻", ECE: "📡", ME: "⚙️", CE: "🏗️", EE: "⚡" };
          const full = {
            CSE: "Computer Science",
            ECE: "Electronics & Comm",
            ME: "Mechanical",
            CE: "Civil",
            EE: "Electrical",
          };
          return (
            <button
              key={b}
              onClick={() => onSelect(b)}
              className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-gray-200
                         hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <span className="text-3xl">{icons[b]}</span>
              <span className="font-bold text-gray-800 group-hover:text-blue-700">{b}</span>
              <span className="text-xs text-gray-400 group-hover:text-blue-500">{full[b]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 2: Semester Select ──────────────────────────────────────────────────

function StepSemesters({ branch, onSelect }) {
  const [chosen, setChosen] = useState([]);

  const toggle = (s) =>
    setChosen((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s].sort((a, b) => a - b)
    );

  const selectAll = () => setChosen([1, 2, 3, 4, 5, 6, 7, 8]);
  const clearAll  = () => setChosen([]);

  return (
    <div className="max-w-lg mx-auto text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">
        Select Semesters — {branch}
      </h2>
      <p className="text-gray-500 text-sm mb-6">
        Jo semesters complete ho gaye hain unhe select karo
      </p>

      <div className="grid grid-cols-4 gap-3 mb-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
          <button
            key={s}
            onClick={() => toggle(s)}
            className={`py-4 rounded-xl font-bold text-lg border-2 transition-all
              ${chosen.includes(s)
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-400"
              }`}
          >
            Sem {s}
          </button>
        ))}
      </div>

      <div className="flex gap-2 justify-center mb-6">
        <button onClick={selectAll}
          className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600">
          Select All 8
        </button>
        <button onClick={clearAll}
          className="text-xs px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600">
          Clear
        </button>
      </div>

      <button
        disabled={chosen.length === 0}
        onClick={() => onSelect(chosen)}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg
                   hover:bg-blue-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Continue →  {chosen.length > 0 && `(${chosen.length} sem selected)`}
      </button>
    </div>
  );
}

// ─── Step 3: Marks Entry ──────────────────────────────────────────────────────

function SemesterCard({ sem, branch, marks, onChange }) {
  const subjects = RTU_SUBJECTS[branch]?.[sem] || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
      {/* Header */}
      <div className="bg-linear-to-r from-blue-600 to-blue-700 px-5 py-3 flex items-center justify-between">
        <h3 className="text-white font-bold text-lg">Semester {sem}</h3>
        <span className="text-blue-200 text-sm">
          {subjects.reduce((s, sub) => s + sub.credits, 0)} credits
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-2 text-gray-500 font-medium">Subject</th>
              <th className="text-center px-3 py-2 text-gray-500 font-medium w-16">Credits</th>
              <th className="text-center px-3 py-2 text-gray-500 font-medium w-28">Marks (0-100)</th>
              <th className="text-center px-3 py-2 text-gray-500 font-medium w-16">Grade</th>
              <th className="text-center px-3 py-2 text-gray-500 font-medium w-16">Points</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub, idx) => {
              const m = marks[idx] ?? "";
              const grade = getGradeFromMarks(m);
              return (
                <tr key={idx} className={`border-b border-gray-50 ${grade?.grade === "F" ? "bg-red-50" : ""}`}>
                  <td className="px-4 py-2 text-gray-700">{sub.name}</td>
                  <td className="px-3 py-2 text-center text-gray-500">{sub.credits}</td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={m}
                      onChange={(e) => onChange(idx, e.target.value)}
                      placeholder="—"
                      className={`w-20 text-center border rounded-lg px-2 py-1 text-sm
                        focus:outline-none focus:ring-2 focus:ring-blue-400
                        ${grade?.grade === "F"
                          ? "border-red-300 bg-red-50 text-red-700"
                          : "border-gray-200"
                        }`}
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <GradeBadge grade={grade} />
                  </td>
                  <td className="px-3 py-2 text-center font-semibold text-gray-700">
                    {grade ? grade.gradePoints : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StepMarks({ branch, semesters, onCalculate }) {
  // marksData[sem][subjectIndex] = marks string
  const [marksData, setMarksData] = useState(() => {
    const init = {};
    semesters.forEach((s) => (init[s] = {}));
    return init;
  });

  const handleChange = useCallback((sem, idx, val) => {
    setMarksData((prev) => ({
      ...prev,
      [sem]: { ...prev[sem], [idx]: val },
    }));
  }, []);

  const handleCalculate = () => {
    // Build results
    const results = semesters.map((sem) => {
      const subjects = (RTU_SUBJECTS[branch]?.[sem] || []).map((sub, idx) => ({
        ...sub,
        marks: marksData[sem][idx] ?? "",
      }));
      const { sgpa, totalCredits, hasBacklog } = calculateSGPA(subjects);
      return { sem, sgpa, totalCredits, hasBacklog, subjects };
    });
    onCalculate(results);
  };

  // Check if at least all entered marks are filled
  const filledCount = semesters.reduce((acc, sem) => {
    const subjLen = RTU_SUBJECTS[branch]?.[sem]?.length || 0;
    const filled = Object.values(marksData[sem] || {}).filter((v) => v !== "").length;
    return acc + (filled === subjLen ? 1 : 0);
  }, 0);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Enter Your Marks</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {branch} | Semester{semesters.length > 1 ? "s" : ""}: {semesters.join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {filledCount}/{semesters.length} sem complete
          </span>
          <button
            onClick={handleCalculate}
            className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-xl
                       hover:bg-green-700 transition-all shadow-sm"
          >
            Calculate CGPA →
          </button>
        </div>
      </div>

      {/* Grading legend */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6 flex flex-wrap gap-2">
        <span className="text-xs text-blue-600 font-medium mr-1">RTU Grading:</span>
        {RTU_GRADING.map((g) => (
          <span key={g.grade} className="text-xs text-gray-600">
            <strong>{g.grade}</strong> ({g.minMarks}–{g.maxMarks}) = {g.gradePoints}pts
            {g !== RTU_GRADING[RTU_GRADING.length - 1] && " •"}
          </span>
        ))}
      </div>

      {semesters.map((sem) => (
        <SemesterCard
          key={sem}
          sem={sem}
          branch={branch}
          marks={marksData[sem] || {}}
          onChange={(idx, val) => handleChange(sem, idx, val)}
        />
      ))}

      <div className="text-center mt-4 mb-8">
        <button
          onClick={handleCalculate}
          className="px-10 py-3 bg-green-600 text-white font-bold text-lg rounded-xl
                     hover:bg-green-700 transition-all shadow-md"
        >
          🎯 Calculate My CGPA
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: Result ───────────────────────────────────────────────────────────

function StepResult({ branch, results, onReset, onRecalculate }) {
  const cgpa = calculateCGPA(results.map((r) => ({ sgpa: r.sgpa, totalCredits: r.totalCredits })));
  const totalCredits = results.reduce((s, r) => s + r.totalCredits, 0);
  const totalBacklogs = results.filter((r) => r.hasBacklog).length;
  const division = getDivision(cgpa);
  const [expandedSem, setExpandedSem] = useState(null);

  return (
    <div className="max-w-2xl mx-auto">
      {/* CGPA Hero Card */}
      <div className="bg-linear-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white text-center mb-6 shadow-xl">
        <p className="text-blue-200 text-sm mb-1">{branch} — B.Tech RTU Kota</p>
        <div className="text-7xl font-black mb-1">{cgpa}</div>
        <div className="text-blue-200 text-lg mb-3">CGPA / 10.0</div>
        <CgpaBar value={cgpa} />
        <div className={`mt-4 text-lg font-semibold ${division.color.replace("text-", "text-white opacity-")}`}>
          🎓 {division.label}
        </div>
        <div className="flex justify-center gap-8 mt-5 text-sm">
          <div>
            <div className="text-2xl font-bold">{results.length}</div>
            <div className="text-blue-200">Semesters</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{totalCredits}</div>
            <div className="text-blue-200">Total Credits</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${totalBacklogs > 0 ? "text-red-300" : "text-green-300"}`}>
              {totalBacklogs}
            </div>
            <div className="text-blue-200">Backlogs</div>
          </div>
        </div>
      </div>

      {/* Per-Semester Breakdown */}
      <h3 className="font-bold text-gray-700 mb-3 text-lg">Semester-wise Breakdown</h3>
      <div className="space-y-3 mb-6">
        {results.map((r) => (
          <div key={r.sem} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <button
              onClick={() => setExpandedSem(expandedSem === r.sem ? null : r.sem)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700">Semester {r.sem}</span>
                {r.hasBacklog && (
                  <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                    Backlog ⚠️
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="font-black text-blue-700 text-xl">{r.sgpa}</div>
                  <div className="text-xs text-gray-400">SGPA ({r.totalCredits} cr)</div>
                </div>
                <span className="text-gray-400">{expandedSem === r.sem ? "▲" : "▼"}</span>
              </div>
            </button>

            {expandedSem === r.sem && (
              <div className="border-t border-gray-100 px-5 pb-4 pt-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400 text-xs">
                      <th className="text-left py-1">Subject</th>
                      <th className="text-center py-1">Cr</th>
                      <th className="text-center py-1">Marks</th>
                      <th className="text-center py-1">Grade</th>
                      <th className="text-center py-1">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {r.subjects.map((sub, i) => {
                      const grade = getGradeFromMarks(sub.marks);
                      return (
                        <tr key={i} className={`border-t border-gray-50 ${grade?.grade === "F" ? "bg-red-50" : ""}`}>
                          <td className="py-1.5 text-gray-600 text-xs">{sub.name}</td>
                          <td className="text-center text-gray-500 text-xs">{sub.credits}</td>
                          <td className="text-center font-medium">{sub.marks || "—"}</td>
                          <td className="text-center"><GradeBadge grade={grade} /></td>
                          <td className="text-center font-semibold text-gray-700">
                            {grade ? grade.gradePoints : "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
        <h3 className="font-bold text-gray-700 mb-3">Grade Distribution</h3>
        <div className="flex flex-wrap gap-2">
          {RTU_GRADING.map((g) => {
            const count = results.flatMap((r) => r.subjects).filter((sub) => {
              const grade = getGradeFromMarks(sub.marks);
              return grade?.grade === g.grade;
            }).length;
            if (count === 0) return null;
            return (
              <div key={g.grade}
                className="flex flex-col items-center bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
                <span className="text-lg font-black text-gray-700">{count}</span>
                <GradeBadge grade={g} />
                <span className="text-xs text-gray-400 mt-0.5">{g.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap">
        <button
          onClick={onRecalculate}
          className="flex-1 py-3 rounded-xl border-2 border-blue-500 text-blue-600
                     font-semibold hover:bg-blue-50 transition-all"
        >
          ✏️ Edit Marks
        </button>
        <button
          onClick={onReset}
          className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600
                     font-semibold hover:bg-gray-200 transition-all"
        >
          🔄 Start Over
        </button>
        <button
          onClick={() => window.print()}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white
                     font-semibold hover:bg-blue-700 transition-all"
        >
          🖨️ Print / Save
        </button>
      </div>
    </div>
  );
}

// ─── Main Calculator Component ────────────────────────────────────────────────

export default function CgpaCalculator() {
  const [step, setStep]       = useState(1); // 1=branch, 2=sems, 3=marks, 4=result
  const [branch, setBranch]   = useState(null);
  const [semesters, setSemesters] = useState([]);
  const [results, setResults] = useState([]);

  const reset = () => {
    setStep(1);
    setBranch(null);
    setSemesters([]);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700
                          text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            🎓 RTU Kota — Official Grading System
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">CGPA Calculator</h1>
          <p className="text-gray-500">
            B.Tech | Rajasthan Technical University | All Branches
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {["Branch", "Semesters", "Marks", "Result"].map((label, i) => {
            const num = i + 1;
            const active  = step === num;
            const done    = step > num;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all
                  ${active ? "bg-blue-600 text-white" :
                    done   ? "bg-green-100 text-green-700" :
                             "bg-gray-100 text-gray-400"}`}>
                  <span>{done ? "✓" : num}</span>
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < 3 && <div className={`h-px w-6 ${done ? "bg-green-400" : "bg-gray-200"}`} />}
              </div>
            );
          })}
        </div>

        {/* Steps */}
        {step === 1 && (
          <StepBranch onSelect={(b) => { setBranch(b); setStep(2); }} />
        )}
        {step === 2 && (
          <StepSemesters
            branch={branch}
            onSelect={(sems) => { setSemesters(sems); setStep(3); }}
          />
        )}
        {step === 3 && (
          <StepMarks
            branch={branch}
            semesters={semesters}
            onCalculate={(res) => { setResults(res); setStep(4); }}
          />
        )}
        {step === 4 && (
          <StepResult
            branch={branch}
            results={results}
            onReset={reset}
            onRecalculate={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
}