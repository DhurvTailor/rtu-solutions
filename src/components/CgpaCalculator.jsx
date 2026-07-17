

"use client";
import { useState, useMemo } from "react";

// ─────────────────────────────────────────────────────────────
// RTU Official CGPA → Percentage Conversion (RTUDAT-2019)
// Formula: Percentage = (CGPA × 10) − 7.5
// Reference: Office of PG/PhD Admissions, RTU Kota
// ─────────────────────────────────────────────────────────────

const CONVERSION_TABLE = [
  { cgpa: 6.25, percentage: 55 },
  { cgpa: 6.75, percentage: 60 },
  { cgpa: 7.25, percentage: 65 },
  { cgpa: 7.75, percentage: 70 },
  { cgpa: 8.25, percentage: 75 },
];

function cgpaToPercentage(cgpa) {
  return parseFloat((cgpa * 10 - 7.5).toFixed(2));
}

function calculateWeightedCGPA(semesters) {
  let totalPoints = 0;
  let totalCredits = 0;
  semesters.forEach((s) => {
    const sgpa = parseFloat(s.sgpa);
    const credits = parseFloat(s.credits);
    if (!isNaN(sgpa) && !isNaN(credits) && credits > 0 && sgpa >= 0 && sgpa <= 10) {
      totalPoints += sgpa * credits;
      totalCredits += credits;
    }
  });
  if (totalCredits === 0) return 0;
  return parseFloat((totalPoints / totalCredits).toFixed(2));
}

// Standard division cut-offs based on aggregate percentage.
// Per RTU norm: "minimum 60% aggregate = equivalent to First Division"
// when a class/division isn't directly awarded by the grading system.
function getDivision(percentage) {
  if (percentage >= 75) return { label: "First Division with Distinction", tier: "distinction" };
  if (percentage >= 60) return { label: "First Division", tier: "first" };
  if (percentage >= 50) return { label: "Second Division", tier: "second" };
  if (percentage >= 40) return { label: "Third Division", tier: "third" };
  return { label: "Not Passing", tier: "fail" };
}

// Safe integer parse helper — never returns NaN
function safeInt(val, fallback, min, max) {
  const n = parseInt(val, 10);
  if (isNaN(n)) return fallback;
  console.log("safeInt:", val, "->", n, `(min=${min}, max=${max})`);
  return Math.min(max, Math.max(min, n));
}

// ─────────────────────────────────────────────────────────────
// Icons (inline SVG, no emoji, no external icon library needed)
// ─────────────────────────────────────────────────────────────

function IconSeal({ className = "w-8 h-8" }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="20" r="14" stroke="currentColor" strokeWidth="2" />
      <path d="M24 12l2.47 5.01 5.53.8-4 3.9.94 5.5L24 24.6l-4.94 2.6.94-5.5-4-3.9 5.53-.8L24 12z"
        fill="currentColor" />
      <path d="M17 31l-2.5 9L20 37l4 4 4-4 5.5 3-2.5-9" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function IconChevronRight({ className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEdit({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 20h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRefresh({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M21 12a9 9 0 11-3-6.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconPrint({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M6 9V3h12v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="4" y="9" width="16" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
      <path d="M6 17v4h12v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck({ className = "w-4 h-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 1 — How many semesters
// ─────────────────────────────────────────────────────────────

function StepCount({ onSelect }) {
  const [count, setCount] = useState("8");

  const handleContinue = () => {
    const n = safeInt(count, 8, 1, 12);
    onSelect(n);
    console.log("Selected semesters:", n);
  };

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#0b2545] text-amber-400 mb-5">
        <IconSeal className="w-9 h-9" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-1">CGPA Calculator</h2>
      <p className="text-sm text-slate-500 mb-8">
        Rajasthan Technical University — Official Conversion Formula (RTUDAT-2019)
      </p>

      <label className="block text-sm font-semibold text-slate-600 mb-2 text-left">
        Kitne semester ka result dena hai?
      </label>
      <input
        type="number"
        min={1}
        max={12}
        value={count}
        onChange={(e) => setCount(e.target.value)}
        className="w-full text-center text-lg font-semibold border-2 border-slate-200 rounded-xl px-4 py-3
                   focus:outline-none focus:border-[#0b2545] focus:ring-2 focus:ring-slate-200"
      />

      <button
        type="button"
        onClick={handleContinue}
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl
                   bg-[#0b2545] text-white font-semibold hover:bg-[#123a68] transition-colors
                   active:scale-[0.99]"
      >
        Continue <IconChevronRight />
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 2 — Enter SGPA (with optional custom credits)
// ─────────────────────────────────────────────────────────────

function StepSgpa({ totalSemesters, onCalculate, onBack }) {
  const [rows, setRows] = useState(
    Array.from({ length: totalSemesters }, (_, i) => ({
      sem: i + 1,
      sgpa: "",
      credits: 20,
    }))
  );
  const [advanced, setAdvanced] = useState(false);

  const update = (idx, field, value) => {
    setRows((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const filledCount = rows.filter(
    (r) => r.sgpa !== "" && !isNaN(parseFloat(r.sgpa))
  ).length;

  const allValid = rows.every((r) => {
    const v = parseFloat(r.sgpa);
    return r.sgpa !== "" && !isNaN(v) && v >= 0 && v <= 10;
  });

  const handleCalculate = () => {
    if (!allValid) return;
    onCalculate(rows);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Enter SGPA</h2>
        <p className="text-sm text-slate-500 mt-1">
          Har semester ka SGPA daalo (0.00 – 10.00)
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
        {/* Table Header */}
        <div
          className={`grid bg-slate-50 border-b border-slate-100 px-4 py-2 text-xs font-semibold text-slate-500
            ${advanced ? "grid-cols-12" : "grid-cols-9"}`}
        >
          <div className="col-span-5">Semester</div>
          <div className="col-span-4">SGPA</div>
          {advanced && <div className="col-span-3">Credits</div>}
        </div>

        {/* Rows */}
        {rows.map((r, idx) => {
          const v = parseFloat(r.sgpa);
          const isInvalid = r.sgpa !== "" && (isNaN(v) || v < 0 || v > 10);

          return (
            <div
              key={r.sem}
              className={`grid items-center px-4 py-2.5 border-b border-slate-50 last:border-0
                ${advanced ? "grid-cols-12" : "grid-cols-9"}`}
            >
              {/* Semester label */}
              <div className="col-span-5 text-sm font-medium text-slate-700">
                Semester {r.sem}
              </div>

              {/* SGPA input */}
              <div className="col-span-4">
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  placeholder="e.g. 7.8"
                  value={r.sgpa}
                  onChange={(e) => update(idx, "sgpa", e.target.value)}
                  className={`w-24 border rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-colors
                    ${isInvalid
                      ? "border-red-300 bg-red-50 text-red-700"
                      : "border-slate-200"
                    }`}
                />
              </div>

              {/* Credits input — only in advanced mode */}
              {advanced && (
                <div className="col-span-3">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={r.credits}
                    onChange={(e) => update(idx, "credits", e.target.value)}
                    className="w-20 border border-slate-200 rounded-lg px-2 py-1.5 text-sm
                               focus:outline-none focus:ring-2 focus:ring-slate-200"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setAdvanced((a) => !a)}
        className="text-xs font-medium text-[#0b2545] underline underline-offset-2 mb-6 block"
      >
        {advanced
          ? "Hide credit customisation"
          : "Semesters mein credits alag-alag hain? (advanced)"}
      </button>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          disabled={!allValid}
          onClick={handleCalculate}
          className="flex-[2] flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0b2545] text-white font-semibold
                     hover:bg-[#123a68] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Calculate CGPA <IconChevronRight />
        </button>
      </div>

      {/* Progress */}
      <p className="text-center text-xs text-slate-400 mt-3">
        {filledCount}/{rows.length} semester filled
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Step 3 — Official Result
// ─────────────────────────────────────────────────────────────

function StepResult({ rows, onReset, onRecalculate }) {
  const cgpa = useMemo(() => calculateWeightedCGPA(rows), [rows]);
  const percentage = useMemo(() => cgpaToPercentage(cgpa), [cgpa]);
  const division = getDivision(percentage);

  const tierColor = {
    distinction: "text-purple-700 bg-purple-50 border-purple-200",
    first: "text-emerald-700 bg-emerald-50 border-emerald-200",
    second: "text-amber-700 bg-amber-50 border-amber-200",
    third: "text-orange-700 bg-orange-50 border-orange-200",
    fail: "text-red-700 bg-red-50 border-red-200",
  }[division.tier];

  return (
    <div className="max-w-2xl mx-auto">
      {/* Certificate-style result card */}
      <div className="bg-white border-2 border-[#0b2545]/15 rounded-2xl shadow-sm overflow-hidden mb-6">
        <div className="bg-[#0b2545] px-6 py-5 flex items-center gap-3">
          <IconSeal className="w-8 h-8 text-amber-400" />
          <div>
            <p className="text-white font-semibold leading-tight">Rajasthan Technical University</p>
            <p className="text-slate-300 text-xs">Result Statement — CGPA Summary</p>
          </div>
        </div>

        <div className="p-8 text-center">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
            Cumulative Grade Point Average
          </p>
          <div className="text-6xl font-black text-[#0b2545] mb-1">{cgpa.toFixed(2)}</div>
          <div className="text-slate-400 text-sm mb-6">out of 10.00</div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="border border-slate-200 rounded-xl py-4">
              <p className="text-xs text-slate-400 font-medium mb-1">Equivalent Percentage</p>
              <p className="text-2xl font-bold text-slate-800">{percentage}%</p>
            </div>
            <div className={`border rounded-xl py-4 ${tierColor}`}>
              <p className="text-xs font-medium mb-1 opacity-70">Division</p>
              <p className="text-base font-bold leading-tight px-2">{division.label}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-left">
            <p className="text-xs font-semibold text-slate-500 mb-1">Official Conversion Formula (RTUDAT-2019)</p>
            <p className="text-sm text-slate-700 font-mono">
              Percentage = (CGPA × 10) − 7.5 = ({cgpa.toFixed(2)} × 10) − 7.5 = <strong>{percentage}%</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Semester-wise SGPA used */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="font-bold text-slate-700 mb-3 text-sm">Semester-wise SGPA Used</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {rows.map((r) => (
            <div key={r.sem} className="text-center bg-slate-50 rounded-lg py-2 border border-slate-100">
              <p className="text-xs text-slate-400">Sem {r.sem}</p>
              <p className="font-bold text-slate-700 text-sm">{r.sgpa}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reference conversion table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="font-bold text-slate-700 mb-3 text-sm flex items-center gap-2">
          <IconCheck className="w-4 h-4 text-slate-400" />
          RTU Sample Conversion Reference
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-slate-400 text-xs">
              <th className="text-left py-1">Grade Point</th>
              <th className="text-right py-1">Equivalent Percentage</th>
            </tr>
          </thead>
          <tbody>
            {CONVERSION_TABLE.map((row) => (
              <tr key={row.cgpa} className="border-t border-slate-50">
                <td className="py-1.5 text-slate-600">{row.cgpa.toFixed(2)}</td>
                <td className="py-1.5 text-right font-semibold text-slate-700">{row.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-400 mt-2">
          Note: Division cut-offs (First ≥60%, Second ≥50%, Third ≥40%) follow standard
          university convention. RTU norm states a minimum of 60% aggregate is treated as
          equivalent to First Division where a division is not directly awarded.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={onRecalculate}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-[#0b2545]
                     text-[#0b2545] font-semibold hover:bg-slate-50 transition-colors"
        >
          <IconEdit /> Edit SGPA
        </button>
        <button
          type="button"
          onClick={onReset}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-600
                     font-semibold hover:bg-slate-200 transition-colors"
        >
          <IconRefresh /> Start Over
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0b2545] text-white
                     font-semibold hover:bg-[#123a68] transition-colors"
        >
          <IconPrint /> Print / Save
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────

export default function CgpaCalculator() {
  const [step, setStep] = useState(1); // 1=count, 2=sgpa entry, 3=result
  const [totalSemesters, setTotalSemesters] = useState(8);
  const [finalRows, setFinalRows] = useState([]);

  const reset = () => {
    setStep(1);
    setTotalSemesters(8);
    setFinalRows([]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {["Semesters", "SGPA", "Result"].map((label, i) => {
            const num = i + 1;
            const active = step === num;
            const done = step > num;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-colors
                  ${active ? "bg-[#0b2545] text-white" : done ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-400"}`}
                >
                  {done ? <IconCheck className="w-3.5 h-3.5" /> : <span>{num}</span>}
                  <span className="hidden sm:inline">{label}</span>
                </div>
                {i < 2 && <div className={`h-px w-6 ${done ? "bg-emerald-300" : "bg-slate-200"}`} />}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <StepCount
            onSelect={(n) => {
              setTotalSemesters(n);
              setStep(2);
            }}
          />
        )}
        {step === 2 && (
          <StepSgpa
            totalSemesters={totalSemesters}
            onBack={() => setStep(1)}
            onCalculate={(rows) => {
              setFinalRows(rows);
              setStep(3);
            }}
          />
        )}
        {step === 3 && (
          <StepResult
            rows={finalRows}
            onReset={reset}
            onRecalculate={() => setStep(2)}
          />
        )}
      </div>
    </div>
  );
}