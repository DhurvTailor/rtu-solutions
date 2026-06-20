
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   Card, CardContent, CardHeader, CardTitle,
// } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";
// import {
//   Table, TableBody, TableCell, TableHead,
//   TableHeader, TableRow,
// } from "../components/ui/table";

// const SOLUTION_TYPES = [
//   { value: "complete_notes", label: "Complete notes" },
//   { value: "important_questions", label: "Important questions" },
//   { value: "pyq_solutions", label: "PYQ solutions" },
//   { value: "assignment", label: "Assignment" },
// ];

// export default function SolutionForm() {
//   // ── Cascading dropdown data ──────────────────────────────
//   const [degrees, setDegrees] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [solutions, setSolutions] = useState([]);

//   // ── Cascading dropdown selections ────────────────────────
//   const [degreeId, setDegreeId] = useState("");
//   const [branchId, setBranchId] = useState("");
//   const [semesterId, setSemesterId] = useState("");
//   const [subjectId, setSubjectId] = useState("");

//   // ── Solution fields ───────────────────────────────────────
//   const [title, setTitle] = useState("");
//   const [solutionType, setSolutionType] = useState("");
//   const [price, setPrice] = useState("");
//   const [description, setDescription] = useState("");
//   const [isPremium, setIsPremium] = useState(false);

//   const [pdfFile, setPdfFile] = useState(null);
//   const [existingPdfUrl, setExistingPdfUrl] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState("");

//   const fileInputRef = useRef(null);

//   // ── Reset ─────────────────────────────────────────────────
//   const resetForm = () => {
//     setDegreeId(""); setBranchId(""); setSemesterId(""); setSubjectId("");
//     setBranches([]); setSemesters([]); setSubjects([]);
//     setTitle(""); setSolutionType(""); setPrice("");
//     setDescription(""); setIsPremium(false);
//     setPdfFile(null); setExistingPdfUrl("");
//     setEditingId(null); setUploadProgress("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//   };

//   // ── Fetchers ──────────────────────────────────────────────
//   const fetchDegrees = async () => {
//     try {
//       const res = await fetch("/api/degrees");
//       const data = await res.json();
//       setDegrees(data.success ? data.data : (Array.isArray(data) ? data : []));
//     } catch (e) { console.error(e); }
//   };

//   const fetchBranches = async (degId) => {
//     if (!degId) { setBranches([]); return; }
//     try {
//       const res = await fetch(`/api/branches?degree_id=${degId}`);
//       const data = await res.json();
//       setBranches(data.success ? data.data : (Array.isArray(data) ? data : []));
//     } catch (e) { console.error(e); }
//   };

//   const fetchSemesters = async (brId) => {
//     if (!brId) { setSemesters([]); return; }
//     try {
//       const res = await fetch(`/api/semesters?branch_id=${brId}`);
//       const data = await res.json();
//       setSemesters(data.success ? data.data : (Array.isArray(data) ? data : []));
//     } catch (e) { console.error(e); }
//   };

//   const fetchSubjects = async (semId) => {
//     if (!semId) { setSubjects([]); return; }
//     try {
//       const res = await fetch(`/api/subjects?semester_id=${semId}`);
//       const data = await res.json();
//       setSubjects(data.success ? data.data : (Array.isArray(data) ? data : []));
//     } catch (e) { console.error(e); }
//   };

//   const fetchSolutions = async () => {
//     try {
//       const res = await fetch("/api/solutions");
//       const data = await res.json();
//       setSolutions(data.success ? data.data : (Array.isArray(data) ? data : []));
//     } catch (e) { console.error(e); }
//   };

//   // Initial load
//   useEffect(() => { fetchDegrees(); fetchSolutions(); }, []);

//   // Cascading fetches — fire whenever the parent selection changes
//   // (works for both manual selection AND edit-mode prefill)
//   useEffect(() => { fetchBranches(degreeId); }, [degreeId]);
//   useEffect(() => { fetchSemesters(branchId); }, [branchId]);
//   useEffect(() => { fetchSubjects(semesterId); }, [semesterId]);

//   // ── Dropdown change handlers — clear everything downstream ──
//   const handleDegreeChange = (e) => {
//     setDegreeId(e.target.value);
//     setBranchId(""); setSemesterId(""); setSubjectId("");
//     setSemesters([]); setSubjects([]);
//   };

//   const handleBranchChange = (e) => {
//     setBranchId(e.target.value);
//     setSemesterId(""); setSubjectId("");
//     setSubjects([]);
//   };

//   const handleSemesterChange = (e) => {
//     setSemesterId(e.target.value);
//     setSubjectId("");
//   };

//   // ── Drag & Drop handlers ──────────────────────────────────
//   const handleDragOver = (e) => e.preventDefault();

//   const handleDrop = (e) => {
//     e.preventDefault();
//     const file = e.dataTransfer.files[0];
//     if (!file) return;
//     if (file.type !== "application/pdf") { alert("Sirf PDF allowed hai"); return; }
//     if (file.size > 50 * 1024 * 1024) { alert("PDF 50MB se badi nahi honi chahiye"); return; }
//     setPdfFile(file);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.type !== "application/pdf") { alert("Sirf PDF allowed hai"); return; }
//     if (file.size > 50 * 1024 * 1024) { alert("PDF 50MB se badi nahi honi chahiye"); return; }
//     setPdfFile(file);
//   };

//   // ── Submit ────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!degreeId || !branchId || !semesterId || !subjectId) {
//       alert("Degree, Branch, Semester aur Subject sab select karo");
//       return;
//     }
//     if (!title || !solutionType || !price) {
//       alert("Title, Solution type aur Price bharo");
//       return;
//     }
//     if (!editingId && !pdfFile) {
//       alert("PDF file select karo");
//       return;
//     }

//     try {
//       setLoading(true);

//       // New solution OR edit with new PDF → use upload API
//       if (!editingId || pdfFile) {
//         setUploadProgress(pdfFile && editingId ? "Naya PDF upload ho rahi hai..." : "PDF Azure par upload ho rahi hai...");

//         const fd = new FormData();
//         fd.append("pdf", pdfFile);
//         fd.append("subject_id", subjectId);
//         fd.append("solution_type", solutionType);
//         fd.append("price", price);
//         fd.append("title", title);
//         fd.append("description", description);
//         fd.append("is_premium", isPremium ? "1" : "0");
//         if (editingId) fd.append("update_id", editingId.toString());

//         const res = await fetch("/api/upload", { method: "POST", body: fd });
//         const result = await res.json();
//         if (!res.ok || !result.success) throw new Error(result.error || "Upload failed");

//         setUploadProgress("✅ Upload ho gaya!");
//         alert(editingId ? "Solution update ho gaya!" : "Solution add ho gaya!");
//         resetForm();
//         fetchSolutions();
//         return;
//       }

//       // Edit with same PDF → only update metadata
//       setUploadProgress("Updating...");
//       const res = await fetch("/api/solutions", {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           id: editingId, subject_id: subjectId, title,
//           solution_type: solutionType, pdf_url: existingPdfUrl,
//           description, price: parseFloat(price),
//           is_premium: isPremium ? 1 : 0,
//         }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Something went wrong");
//       alert(data.message);
//       resetForm();
//       fetchSolutions();

//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Something went wrong");
//       setUploadProgress("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Edit — prefill the whole chain in one shot ──────────────
//   const handleEdit = (solution) => {
//     setEditingId(solution.id);

//     // Cascading effects (degreeId -> branches, branchId -> semesters,
//     // semesterId -> subjects) automatically fire and populate the
//     // option lists; setting all 4 ids together makes every select
//     // land on the correct value once its list arrives.
//     setDegreeId(solution.degree_id ? solution.degree_id.toString() : "");
//     setBranchId(solution.branch_id ? solution.branch_id.toString() : "");
//     setSemesterId(solution.semester_id ? solution.semester_id.toString() : "");
//     setSubjectId(solution.subject_id ? solution.subject_id.toString() : "");

//     setTitle(solution.title);
//     setSolutionType(solution.solution_type);
//     setPrice(solution.price ? solution.price.toString() : "");
//     setDescription(solution.description || "");
//     setIsPremium(solution.is_premium === 1 || solution.is_premium === true);
//     setExistingPdfUrl(solution.file_url || solution.pdf_url || "");
//     setPdfFile(null);
//     setUploadProgress("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this solution?")) return;
//     try {
//       const res = await fetch(`/api/solutions?id=${id}`, { method: "DELETE" });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Something went wrong");
//       alert(data.message);
//       fetchSolutions();
//     } catch (err) {
//       alert(err.message || "Something went wrong");
//     }
//   };

//   // ── Drop zone display logic ───────────────────────────────
//   const renderDropZone = () => {
//     if (pdfFile) return (
//       <div>
//         <p className="font-semibold text-green-700">✅ {pdfFile.name}</p>
//         <p className="text-xs text-gray-500 mt-1">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
//         <button
//           type="button"
//           onClick={(e) => { e.stopPropagation(); setPdfFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
//           className="text-xs text-red-500 mt-2 underline"
//         >
//           Remove
//         </button>
//       </div>
//     );
//     if (editingId && existingPdfUrl) return (
//       <div>
//         <p className="text-sm text-gray-600">📄 Current PDF saved hai</p>
//         <p className="text-xs text-gray-400 mt-1 truncate max-w-xs mx-auto">
//           {existingPdfUrl.split("/").pop().slice(0, 50)}
//         </p>
//         <p className="text-xs text-blue-500 mt-2">Click karo ya drag karo naya PDF replace karne ke liye</p>
//       </div>
//     );
//     return (
//       <div>
//         <p className="text-gray-400 text-sm">📁 Click karo ya PDF yahan drag karo</p>
//         <p className="text-xs text-gray-300 mt-1">Max 50 MB · PDF only</p>
//       </div>
//     );
//   };

//   // Shared select styling — disabled selects look visibly inactive
//   const selectClass = "w-full h-12 px-4 border rounded-lg bg-white text-black disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

//   return (
//     <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
//       <CardHeader className="bg-[#142647] text-white">
//         <CardTitle className="text-2xl">Solution management</CardTitle>
//         <p className="text-sm text-gray-300">Add and manage all solutions</p>
//       </CardHeader>

//       <CardContent className="p-6">
//         <form onSubmit={handleSubmit} className="space-y-6 mb-8">

//           {/* ── Step 1: Course hierarchy ── */}
//           <div className="rounded-2xl border border-gray-200 p-4">
//             <p className="text-xs font-bold tracking-wide text-gray-400 uppercase mb-3">
//               Course details
//             </p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//               <select
//                 value={degreeId}
//                 onChange={handleDegreeChange}
//                 className={selectClass}
//               >
//                 <option value="">Select degree *</option>
//                 {degrees.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
//               </select>

//               <select
//                 value={branchId}
//                 onChange={handleBranchChange}
//                 disabled={!degreeId}
//                 className={selectClass}
//               >
//                 <option value="">{degreeId ? "Select branch *" : "Pehle degree select karo"}</option>
//                 {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
//               </select>

//               <select
//                 value={semesterId}
//                 onChange={handleSemesterChange}
//                 disabled={!branchId}
//                 className={selectClass}
//               >
//                 <option value="">{branchId ? "Select semester *" : "Pehle branch select karo"}</option>
//                 {semesters.map((s) => (
//                   <option key={s.id} value={s.id}>Semester {s.semester_number}</option>
//                 ))}
//               </select>

//               <select
//                 value={subjectId}
//                 onChange={(e) => setSubjectId(e.target.value)}
//                 disabled={!semesterId}
//                 className={selectClass}
//               >
//                 <option value="">{semesterId ? "Select subject *" : "Pehle semester select karo"}</option>
//                 {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* ── Step 2: Solution details ── */}
//           <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
//             <p className="text-xs font-bold tracking-wide text-gray-400 uppercase mb-1">
//               Solution details
//             </p>

//             <Input placeholder="Solution title *" value={title}
//               onChange={(e) => setTitle(e.target.value)} className="h-12" />

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <select value={solutionType} onChange={(e) => setSolutionType(e.target.value)}
//                 className={selectClass}>
//                 <option value="">Select solution type *</option>
//                 {SOLUTION_TYPES.map((t) => (
//                   <option key={t.value} value={t.value}>{t.label}</option>
//                 ))}
//               </select>

//               <Input placeholder="Price (₹) *" type="number" min="0"
//                 value={price} onChange={(e) => setPrice(e.target.value)} className="h-12" />
//             </div>

//             <textarea
//               placeholder="Description (optional)"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full min-h-[80px] border rounded-lg p-3 text-sm resize-none"
//             />

//             <label className="flex items-center gap-2 cursor-pointer select-none">
//               <input type="checkbox" checked={isPremium}
//                 onChange={(e) => setIsPremium(e.target.checked)} className="w-4 h-4" />
//               <span className="text-sm font-medium">Premium content</span>
//             </label>
//           </div>

//           {/* ── Step 3: PDF Upload ── */}
//           <div>
//             <label className="block text-sm font-semibold mb-2 text-gray-700">
//               PDF file {editingId ? "(naya upload karo ya same rakho)" : "*"}
//             </label>
//             <div
//               onClick={() => fileInputRef.current?.click()}
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//               className="w-full border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors"
//               style={{
//                 borderColor: pdfFile ? "#16a34a" : "#d1d5db",
//                 background: pdfFile ? "#f0fdf4" : "#fafafa",
//               }}
//             >
//               {renderDropZone()}
//             </div>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept=".pdf"
//               style={{ display: "none" }}
//               onChange={handleFileChange}
//             />
//           </div>

//           {uploadProgress && (
//             <div className="text-sm font-medium px-4 py-3 rounded-lg bg-blue-50 text-blue-700">
//               {uploadProgress}
//             </div>
//           )}

//           <div className="flex gap-3">
//             <Button type="submit" disabled={loading}
//               className="bg-[#ff6900] hover:bg-orange-600 text-white h-11 px-6">
//               {loading ? "Please wait..." : editingId ? "Update solution" : "Add solution"}
//             </Button>
//             {editingId && (
//               <Button type="button" variant="outline" onClick={resetForm} className="h-11 px-6">
//                 Cancel edit
//               </Button>
//             )}
//           </div>
//         </form>

//         {/* ── Table ── */}
//         <div className="rounded-2xl border overflow-hidden">
//           <div className="bg-[#142647] px-4 py-3 flex items-center justify-between">
//             <h3 className="text-white font-semibold">Solution list</h3>
//             <span className="text-gray-300 text-sm">{solutions.length} records</span>
//           </div>
//           <div className="overflow-x-auto">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-slate-100">
//                   <TableHead className="font-bold">#</TableHead>
//                   <TableHead className="font-bold">Subject</TableHead>
//                   <TableHead className="font-bold">Title</TableHead>
//                   <TableHead className="font-bold">Type</TableHead>
//                   <TableHead className="font-bold text-center">Price</TableHead>
//                   <TableHead className="font-bold text-center">Premium</TableHead>
//                   <TableHead className="font-bold text-center">Actions</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {solutions.length === 0 ? (
//                   <TableRow>
//                     <TableCell colSpan={7} className="text-center py-10 text-gray-400">
//                       No solutions found. Add one above.
//                     </TableCell>
//                   </TableRow>
//                 ) : solutions.map((s, i) => (
//                   <TableRow key={s.id} className={editingId === s.id ? "bg-orange-50" : ""}>
//                     <TableCell>{i + 1}</TableCell>
//                     <TableCell className="max-w-[200px]">
//                       <p className="truncate font-medium">{s.subject_name}</p>
//                       <p className="text-xs text-gray-400 truncate">
//                         {s.branch_name} · Sem {s.semester_number}
//                       </p>
//                     </TableCell>
//                     <TableCell className="max-w-[180px] truncate">{s.title}</TableCell>
//                     <TableCell>
//                       <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
//                         {s.solution_type}
//                       </span>
//                     </TableCell>
//                     <TableCell className="text-center font-semibold">₹{s.price || 0}</TableCell>
//                     <TableCell className="text-center">
//                       {(s.is_premium === 1 || s.is_premium === true)
//                         ? <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Premium</span>
//                         : <span className="text-xs text-gray-400">Free</span>}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex justify-center gap-2">
//                         <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"
//                           onClick={() => handleEdit(s)}>Edit</Button>
//                         <Button size="sm" variant="destructive"
//                           onClick={() => handleDelete(s.id)}>Delete</Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }






"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card, CardContent, CardHeader, CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "../components/ui/table";

const SOLUTION_TYPES = [
  { value: "complete_notes", label: "Complete notes" },
  { value: "important_questions", label: "Important questions" },
  { value: "pyq_solutions", label: "PYQ solutions" },
  { value: "assignment", label: "Assignment" },
];

export default function SolutionForm() {
  // ── Cascading dropdown data ──────────────────────────────
  const [degrees, setDegrees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [solutions, setSolutions] = useState([]);

  // ── Cascading dropdown selections ────────────────────────
  const [degreeId, setDegreeId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  // ── Solution fields ───────────────────────────────────────
  const [title, setTitle] = useState("");
  const [solutionType, setSolutionType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const [pdfFile, setPdfFile] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  const fileInputRef = useRef(null);

  // ── Reset ─────────────────────────────────────────────────
  const resetForm = () => {
    setDegreeId(""); setBranchId(""); setSemesterId(""); setSubjectId("");
    setBranches([]); setSemesters([]); setSubjects([]);
    setTitle(""); setSolutionType(""); setPrice("");
    setDescription(""); setIsPremium(false);
    setPdfFile(null); setExistingPdfUrl("");
    setEditingId(null); setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Fetchers ──────────────────────────────────────────────
  const fetchDegrees = async () => {
    try {
      const res = await fetch("/api/degrees");
      const data = await res.json();
      setDegrees(data.success ? data.data : (Array.isArray(data) ? data : []));
    } catch (e) { console.error(e); }
  };

  const fetchBranches = async (degId) => {
    if (!degId) { setBranches([]); return; }
    try {
      const res = await fetch(`/api/branches?degree_id=${degId}`);
      const data = await res.json();
      setBranches(data.success ? data.data : (Array.isArray(data) ? data : []));
    } catch (e) { console.error(e); }
  };

  const fetchSemesters = async (brId) => {
    if (!brId) { setSemesters([]); return; }
    try {
      const res = await fetch(`/api/semesters?branch_id=${brId}`);
      const data = await res.json();
      setSemesters(data.success ? data.data : (Array.isArray(data) ? data : []));
    } catch (e) { console.error(e); }
  };

  const fetchSubjects = async (semId) => {
    if (!semId) { setSubjects([]); return; }
    try {
      const res = await fetch(`/api/subjects?semester_id=${semId}`);
      const data = await res.json();
      setSubjects(data.success ? data.data : (Array.isArray(data) ? data : []));
    } catch (e) { console.error(e); }
  };

  const fetchSolutions = async () => {
    try {
      const res = await fetch("/api/solutions");
      const data = await res.json();
      setSolutions(data.success ? data.data : (Array.isArray(data) ? data : []));
    } catch (e) { console.error(e); }
  };

  // Initial load
  useEffect(() => { fetchDegrees(); fetchSolutions(); }, []);

  // Cascading fetches — fire whenever the parent selection changes
  // (works for both manual selection AND edit-mode prefill)
  useEffect(() => { fetchBranches(degreeId); }, [degreeId]);
  useEffect(() => { fetchSemesters(branchId); }, [branchId]);
  useEffect(() => { fetchSubjects(semesterId); }, [semesterId]);

  // ── Dropdown change handlers — clear everything downstream ──
  const handleDegreeChange = (e) => {
    setDegreeId(e.target.value);
    setBranchId(""); setSemesterId(""); setSubjectId("");
    setSemesters([]); setSubjects([]);
  };

  const handleBranchChange = (e) => {
    setBranchId(e.target.value);
    setSemesterId(""); setSubjectId("");
    setSubjects([]);
  };

  const handleSemesterChange = (e) => {
    setSemesterId(e.target.value);
    setSubjectId("");
  };

  // ── Drag & Drop handlers ──────────────────────────────────
  const handleDragOver = (e) => e.preventDefault();

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") { alert("Sirf PDF allowed hai"); return; }
    if (file.size > 50 * 1024 * 1024) { alert("PDF 50MB se badi nahi honi chahiye"); return; }
    setPdfFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { alert("Sirf PDF allowed hai"); return; }
    if (file.size > 50 * 1024 * 1024) { alert("PDF 50MB se badi nahi honi chahiye"); return; }
    setPdfFile(file);
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!degreeId || !branchId || !semesterId || !subjectId) {
      alert("Degree, Branch, Semester aur Subject sab select karo");
      return;
    }
    if (!title || !solutionType || !price) {
      alert("Title, Solution type aur Price bharo");
      return;
    }
    if (!editingId && !pdfFile) {
      alert("PDF file select karo");
      return;
    }

    try {
      setLoading(true);

      // New solution OR edit with new PDF → 3-step direct-to-Azure upload
      // (file Vercel se hokar nahi guzarta, isliye size limit ka issue nahi aata)
      if (!editingId || pdfFile) {
        // Step 1: secure upload URL maango
        setUploadProgress("Upload URL generate ho rahi hai...");
        const urlRes = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: pdfFile.name }),
        });
        const urlData = await urlRes.json();
        if (!urlRes.ok || !urlData.success) throw new Error(urlData.error || "Upload URL nahi mili");

        // Step 2: PDF seedha Azure par upload karo (Vercel server bypass)
        setUploadProgress("PDF Azure par directly upload ho rahi hai...");
        const azureRes = await fetch(urlData.uploadUrl, {
          method: "PUT",
          headers: {
            "x-ms-blob-type": "BlockBlob",
            "Content-Type": "application/pdf",
          },
          body: pdfFile,
        });
        if (!azureRes.ok) throw new Error("Azure upload fail ho gaya. Network ya CORS check karo.");

        // Step 3: chhota sa JSON bhejo DB mein save karne ke liye
        setUploadProgress("Details save ho rahi hain...");
        const res = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blobName: urlData.blobName,
            subject_id: subjectId,
            solution_type: solutionType,
            price,
            title,
            description,
            is_premium: isPremium ? "1" : "0",
            update_id: editingId ? editingId.toString() : null,
          }),
        });
        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.error || "Save failed");

        setUploadProgress("✅ Upload ho gaya!");
        alert(editingId ? "Solution update ho gaya!" : "Solution add ho gaya!");
        resetForm();
        fetchSolutions();
        return;
      }

      // Edit with same PDF → only update metadata
      setUploadProgress("Updating...");
      const res = await fetch("/api/solutions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId, subject_id: subjectId, title,
          solution_type: solutionType, pdf_url: existingPdfUrl,
          description, price: parseFloat(price),
          is_premium: isPremium ? 1 : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      alert(data.message);
      resetForm();
      fetchSolutions();

    } catch (err) {
      console.error(err);
      alert(err.message || "Something went wrong");
      setUploadProgress("");
    } finally {
      setLoading(false);
    }
  };

  // ── Edit — prefill the whole chain in one shot ──────────────
  const handleEdit = (solution) => {
    setEditingId(solution.id);

    // Cascading effects (degreeId -> branches, branchId -> semesters,
    // semesterId -> subjects) automatically fire and populate the
    // option lists; setting all 4 ids together makes every select
    // land on the correct value once its list arrives.
    setDegreeId(solution.degree_id ? solution.degree_id.toString() : "");
    setBranchId(solution.branch_id ? solution.branch_id.toString() : "");
    setSemesterId(solution.semester_id ? solution.semester_id.toString() : "");
    setSubjectId(solution.subject_id ? solution.subject_id.toString() : "");

    setTitle(solution.title);
    setSolutionType(solution.solution_type);
    setPrice(solution.price ? solution.price.toString() : "");
    setDescription(solution.description || "");
    setIsPremium(solution.is_premium === 1 || solution.is_premium === true);
    setExistingPdfUrl(solution.file_url || solution.pdf_url || "");
    setPdfFile(null);
    setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this solution?")) return;
    try {
      const res = await fetch(`/api/solutions?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");
      alert(data.message);
      fetchSolutions();
    } catch (err) {
      alert(err.message || "Something went wrong");
    }
  };

  // ── Drop zone display logic ───────────────────────────────
  const renderDropZone = () => {
    if (pdfFile) return (
      <div>
        <p className="font-semibold text-green-700">✅ {pdfFile.name}</p>
        <p className="text-xs text-gray-500 mt-1">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setPdfFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
          className="text-xs text-red-500 mt-2 underline"
        >
          Remove
        </button>
      </div>
    );
    if (editingId && existingPdfUrl) return (
      <div>
        <p className="text-sm text-gray-600">📄 Current PDF saved hai</p>
        <p className="text-xs text-gray-400 mt-1 truncate max-w-xs mx-auto">
          {existingPdfUrl.split("/").pop().slice(0, 50)}
        </p>
        <p className="text-xs text-blue-500 mt-2">Click karo ya drag karo naya PDF replace karne ke liye</p>
      </div>
    );
    return (
      <div>
        <p className="text-gray-400 text-sm">📁 Click karo ya PDF yahan drag karo</p>
        <p className="text-xs text-gray-300 mt-1">Max 50 MB · PDF only</p>
      </div>
    );
  };

  // Shared select styling — disabled selects look visibly inactive
  const selectClass = "w-full h-12 px-4 border rounded-lg bg-white text-black disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-[#142647] text-white">
        <CardTitle className="text-2xl">Solution management</CardTitle>
        <p className="text-sm text-gray-300">Add and manage all solutions</p>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6 mb-8">

          {/* ── Step 1: Course hierarchy ── */}
          <div className="rounded-2xl border border-gray-200 p-4">
            <p className="text-xs font-bold tracking-wide text-gray-400 uppercase mb-3">
              Course details
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <select
                value={degreeId}
                onChange={handleDegreeChange}
                className={selectClass}
              >
                <option value="">Select degree *</option>
                {degrees.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>

              <select
                value={branchId}
                onChange={handleBranchChange}
                disabled={!degreeId}
                className={selectClass}
              >
                <option value="">{degreeId ? "Select branch *" : "Pehle degree select karo"}</option>
                {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>

              <select
                value={semesterId}
                onChange={handleSemesterChange}
                disabled={!branchId}
                className={selectClass}
              >
                <option value="">{branchId ? "Select semester *" : "Pehle branch select karo"}</option>
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>Semester {s.semester_number}</option>
                ))}
              </select>

              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                disabled={!semesterId}
                className={selectClass}
              >
                <option value="">{semesterId ? "Select subject *" : "Pehle semester select karo"}</option>
                {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          {/* ── Step 2: Solution details ── */}
          <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
            <p className="text-xs font-bold tracking-wide text-gray-400 uppercase mb-1">
              Solution details
            </p>

            <Input placeholder="Solution title *" value={title}
              onChange={(e) => setTitle(e.target.value)} className="h-12" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select value={solutionType} onChange={(e) => setSolutionType(e.target.value)}
                className={selectClass}>
                <option value="">Select solution type *</option>
                {SOLUTION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>

              <Input placeholder="Price (₹) *" type="number" min="0"
                value={price} onChange={(e) => setPrice(e.target.value)} className="h-12" />
            </div>

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[80px] border rounded-lg p-3 text-sm resize-none"
            />

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" checked={isPremium}
                onChange={(e) => setIsPremium(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm font-medium">Premium content</span>
            </label>
          </div>

          {/* ── Step 3: PDF Upload ── */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-700">
              PDF file {editingId ? "(naya upload karo ya same rakho)" : "*"}
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="w-full border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors"
              style={{
                borderColor: pdfFile ? "#16a34a" : "#d1d5db",
                background: pdfFile ? "#f0fdf4" : "#fafafa",
              }}
            >
              {renderDropZone()}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>

          {uploadProgress && (
            <div className="text-sm font-medium px-4 py-3 rounded-lg bg-blue-50 text-blue-700">
              {uploadProgress}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}
              className="bg-[#ff6900] hover:bg-orange-600 text-white h-11 px-6">
              {loading ? "Please wait..." : editingId ? "Update solution" : "Add solution"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm} className="h-11 px-6">
                Cancel edit
              </Button>
            )}
          </div>
        </form>

        {/* ── Table ── */}
        <div className="rounded-2xl border overflow-hidden">
          <div className="bg-[#142647] px-4 py-3 flex items-center justify-between">
            <h3 className="text-white font-semibold">Solution list</h3>
            <span className="text-gray-300 text-sm">{solutions.length} records</span>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="font-bold">#</TableHead>
                  <TableHead className="font-bold">Subject</TableHead>
                  <TableHead className="font-bold">Title</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold text-center">Price</TableHead>
                  <TableHead className="font-bold text-center">Premium</TableHead>
                  <TableHead className="font-bold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solutions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                      No solutions found. Add one above.
                    </TableCell>
                  </TableRow>
                ) : solutions.map((s, i) => (
                  <TableRow key={s.id} className={editingId === s.id ? "bg-orange-50" : ""}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="max-w-[200px]">
                      <p className="truncate font-medium">{s.subject_name}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {s.branch_name} · Sem {s.semester_number}
                      </p>
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">{s.title}</TableCell>
                    <TableCell>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                        {s.solution_type}
                      </span>
                    </TableCell>
                    <TableCell className="text-center font-semibold">₹{s.price || 0}</TableCell>
                    <TableCell className="text-center">
                      {(s.is_premium === 1 || s.is_premium === true)
                        ? <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">Premium</span>
                        : <span className="text-xs text-gray-400">Free</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleEdit(s)}>Edit</Button>
                        <Button size="sm" variant="destructive"
                          onClick={() => handleDelete(s.id)}>Delete</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}