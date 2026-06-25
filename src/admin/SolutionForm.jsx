"use client";

import { useState, useEffect, useRef } from "react";
import { PDFDocument } from "pdf-lib";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const SOLUTION_TYPES = [
  { value: "complete_notes", label: "Complete Notes" },
  { value: "important_questions", label: "Important Questions" },
  { value: "pyq_solutions", label: "PYQ Solutions" },
  { value: "assignment", label: "Assignment" },
];

const TYPE_LABELS = {
  complete_notes: "Complete Notes",
  important_questions: "Important Questions",
  pyq_solutions: "PYQ Solutions",
  assignment: "Assignment",
};

export default function SolutionForm() {
  // ── Dropdown data ──
  const [degrees, setDegrees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [solutions, setSolutions] = useState([]);

  // ── Dropdown selections ──
  const [degreeId, setDegreeId] = useState("");
  const [branchId, setBranchId] = useState("");
  const [semesterId, setSemesterId] = useState("");
  const [subjectId, setSubjectId] = useState("");

  // ── Form fields ──
  const [title, setTitle] = useState("");
  const [solutionType, setSolutionType] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  // ── File states ──
  const [pdfFile, setPdfFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [existingPdfUrl, setExistingPdfUrl] = useState("");
  const [existingPreviewBlobName, setExistingPreviewBlobName] = useState("");
  const [existingThumbnailBlobName, setExistingThumbnailBlobName] = useState("");

  // ── UI states ──
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // ── List filter states ──
  const [filterSem, setFilterSem] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterPremium, setFilterPremium] = useState("all");
  const [search, setSearch] = useState("");
  const [listLoading, setListLoading] = useState(false);

  const fileInputRef = useRef(null);
  const thumbnailInputRef = useRef(null);

  // ── PDF preview generator ──
  const generatePreviewPdf = async (file) => {
    const originalBytes = await file.arrayBuffer();
    const srcDoc = await PDFDocument.load(originalBytes);
    const previewDoc = await PDFDocument.create();
    const pageCount = Math.min(2, srcDoc.getPageCount());
    const pages = await previewDoc.copyPages(srcDoc, [...Array(pageCount).keys()]);
    pages.forEach((p) => previewDoc.addPage(p));
    const previewBytes = await previewDoc.save();
    return new Blob([previewBytes], { type: "application/pdf" });
  };

  // ── Reset form ──
  const resetForm = () => {
    setDegreeId(""); setBranchId(""); setSemesterId(""); setSubjectId("");
    setBranches([]); setSemesters([]); setSubjects([]);
    setTitle(""); setSolutionType(""); setPrice("");
    setDescription(""); setIsPremium(false); setYoutubeUrl("");
    setPdfFile(null); setThumbnailFile(null);
    setExistingPdfUrl(""); setExistingPreviewBlobName(""); setExistingThumbnailBlobName("");
    setEditingId(null); setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  // ── Fetchers ──
  const fetchDegrees = async () => {
    try {
      const res = await fetch("/api/degrees");
      const data = await res.json();
      setDegrees(Array.isArray(data) ? data : (data.data || []));
    } catch (e) { console.error(e); }
  };

  const fetchBranches = async (degId) => {
    if (!degId) { setBranches([]); return; }
    const res = await fetch(`/api/branch?degree_id=${degId}`);
    const data = await res.json();
    setBranches(Array.isArray(data) ? data : (data.data || []));
  };

  const fetchSemesters = async (brId) => {
    if (!brId) { setSemesters([]); return; }
    const res = await fetch(`/api/semesters?branch_id=${brId}`);
    const data = await res.json();
    setSemesters(Array.isArray(data) ? data : (data.data || []));
  };

  const fetchSubjects = async (semId) => {
    if (!semId) { setSubjects([]); return; }
    const res = await fetch(`/api/subjects?semester_id=${semId}`);
    const data = await res.json();
    setSubjects(Array.isArray(data) ? data : (data.data || []));
  };

  const fetchSolutions = async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/solutions");
      const data = await res.json();
      setSolutions(Array.isArray(data) ? data : (data.data || []));
    } catch (e) { console.error(e); }
    finally { setListLoading(false); }
  };

  useEffect(() => { fetchDegrees(); fetchSolutions(); }, []);
  useEffect(() => { fetchBranches(degreeId); }, [degreeId]);
  useEffect(() => { fetchSemesters(branchId); }, [branchId]);
  useEffect(() => { fetchSubjects(semesterId); }, [semesterId]);

  // ── Dropdown handlers ──
  const handleDegreeChange = (e) => {
    setDegreeId(e.target.value);
    setBranchId(""); setSemesterId(""); setSubjectId("");
    setSemesters([]); setSubjects([]);
  };

  const handleBranchChange = (e) => {
    setBranchId(e.target.value);
    setSemesterId(""); setSubjectId(""); setSubjects([]);
  };

  // ── File handlers ──
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") { alert("Only PDF allowed"); return; }
    if (file.size > 50 * 1024 * 1024) { alert("Max 50MB allowed"); return; }
    setPdfFile(file);
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Only image files allowed (JPG, PNG, WebP)"); return; }
    if (file.size > 5 * 1024 * 1024) { alert("Max 5MB allowed"); return; }
    setThumbnailFile(file);
  };

  // ── Submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!degreeId || !branchId || !semesterId || !subjectId) {
      alert("Please select Degree, Branch, Semester and Subject"); return;
    }
    if (!title || !solutionType || !price) {
      alert("Please fill Title, Type and Price"); return;
    }
    if (!editingId && !pdfFile) { alert("Please select a PDF file"); return; }

    try {
      setLoading(true);
      let finalBlobName = existingPdfUrl;
      let finalPreviewBlobName = existingPreviewBlobName;
      let finalThumbnailBlobName = existingThumbnailBlobName;

      // ── Upload new PDF ──
      if (!editingId || pdfFile) {
        setUploadProgress("Getting upload URL...");
        const urlRes = await fetch("/api/upload-url", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: pdfFile.name }),
        });
        const urlData = await urlRes.json();
        if (!urlData.success) throw new Error(urlData.error || "Upload URL failed");

        const previewUrlRes = await fetch("/api/upload-url", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName: `preview-${pdfFile.name}` }),
        });
        const previewUrlData = await previewUrlRes.json();
        if (!previewUrlData.success) throw new Error("Preview URL failed");

        setUploadProgress("Generating 2-page preview...");
        const previewBlob = await generatePreviewPdf(pdfFile);

        setUploadProgress("Uploading PDF to Azure...");
        const azRes = await fetch(urlData.uploadUrl, {
          method: "PUT",
          headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": "application/pdf" },
          body: pdfFile,
        });
        if (!azRes.ok) throw new Error("PDF upload failed — check CORS settings");

        setUploadProgress("Uploading preview PDF...");
        const pvRes = await fetch(previewUrlData.uploadUrl, {
          method: "PUT",
          headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": "application/pdf" },
          body: previewBlob,
        });
        if (!pvRes.ok) throw new Error("Preview upload failed");

        finalBlobName = urlData.blobName;
        finalPreviewBlobName = previewUrlData.blobName;
      }

      // ── Upload thumbnail ──
      if (thumbnailFile) {
        setUploadProgress("Uploading cover thumbnail...");
        const thRes = await fetch("/api/upload-url", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileName: `thumb-${thumbnailFile.name}`,
            contentType: thumbnailFile.type,
          }),
        });
        const thData = await thRes.json();
        if (!thData.success) throw new Error("Thumbnail URL failed");

        const thAzRes = await fetch(thData.uploadUrl, {
          method: "PUT",
          headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": thumbnailFile.type },
          body: thumbnailFile,
        });
        if (!thAzRes.ok) throw new Error("Thumbnail upload failed");
        finalThumbnailBlobName = thData.blobName;
      }

      // ── Save to DB ──
      setUploadProgress("Saving to database...");

      if (!editingId || pdfFile) {
        const res = await fetch("/api/upload", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blobName: finalBlobName,
            previewBlobName: finalPreviewBlobName,
            thumbnailBlobName: finalThumbnailBlobName,
            youtube_url: youtubeUrl.trim() || null,
            oldBlobName: editingId && pdfFile ? existingPdfUrl : null,
            oldPreviewBlobName: editingId && pdfFile ? existingPreviewBlobName : null,
            oldThumbnailBlobName: editingId && thumbnailFile ? existingThumbnailBlobName : null,
            subject_id: subjectId,
            solution_type: solutionType,
            price, title, description,
            is_premium: isPremium ? "1" : "0",
            update_id: editingId?.toString() || null,
          }),
        });
        const result = await res.json();
        if (!result.success) throw new Error(result.error || "Save failed");
      } else {
        const res = await fetch("/api/solutions", {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingId, subject_id: subjectId, title,
            solution_type: solutionType, pdf_url: finalBlobName,
            preview_blob_name: finalPreviewBlobName,
            thumbnail_blob_name: finalThumbnailBlobName,
            youtube_url: youtubeUrl.trim() || null,
            description, price: parseFloat(price),
            is_premium: isPremium ? 1 : 0,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Update failed");
      }

      setUploadProgress("✅ Done!");
      alert(editingId ? "Solution updated successfully!" : "Solution added successfully!");
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

  // ── Edit prefill ──
  const handleEdit = (solution) => {
    setEditingId(solution.id);
    setDegreeId(solution.degree_id?.toString() || "");
    setBranchId(solution.branch_id?.toString() || "");
    setSemesterId(solution.semester_id?.toString() || "");
    setSubjectId(solution.subject_id?.toString() || "");
    setTitle(solution.title);
    setSolutionType(solution.solution_type);
    setPrice(solution.price?.toString() || "");
    setDescription(solution.description || "");
    setIsPremium(solution.is_premium === 1 || solution.is_premium === true);
    setYoutubeUrl(solution.youtube_url || "");
    setExistingPdfUrl(solution.file_url || solution.pdf_url || "");
    setExistingPreviewBlobName(solution.preview_blob_name || "");
    setExistingThumbnailBlobName(solution.thumbnail_blob_name || "");
    setPdfFile(null); setThumbnailFile(null); setUploadProgress("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Delete ──
  const handleDelete = async (id) => {
    if (!confirm("Delete this solution?")) return;
    try {
      const res = await fetch(`/api/solutions?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert(data.message);
      fetchSolutions();
    } catch (err) { alert(err.message); }
  };

  // ── Filtered list ──
  const semestersInData = [...new Set(solutions.map((s) => s.semester_number))].sort((a, b) => a - b);

  const filtered = solutions.filter((s) => {
    const matchSem = filterSem === "all" || String(s.semester_number) === filterSem;
    const matchType = filterType === "all" || s.solution_type === filterType;
    const matchPremium =
      filterPremium === "all" ||
      (filterPremium === "premium" && (s.is_premium === 1 || s.is_premium === true)) ||
      (filterPremium === "free" && !s.is_premium);
    const matchSearch =
      !search ||
      s.title?.toLowerCase().includes(search.toLowerCase()) ||
      s.subject_name?.toLowerCase().includes(search.toLowerCase());
    return matchSem && matchType && matchPremium && matchSearch;
  });

  // ── Shared styles ──
  const sel = "w-full h-12 px-4 border border-gray-300 rounded-xl bg-white text-sm text-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-400";

  const pill = (active) =>
    `px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer select-none transition-all ${
      active
        ? "bg-[#142647] text-white border-[#142647]"
        : "bg-white text-gray-600 border-gray-300 hover:border-[#142647] hover:text-[#142647]"
    }`;

  return (
    <div className="space-y-8">

      {/* ════════════════════════════════════
          FORM CARD
      ════════════════════════════════════ */}
      <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-[#142647] text-white">
          <CardTitle className="text-xl">
            {editingId ? "✏️ Edit Solution" : "➕ Add New Solution"}
          </CardTitle>
          <p className="text-sm text-gray-300">
            {editingId ? "Update the solution details below" : "Fill in all required fields to add a solution"}
          </p>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Course details */}
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">
                Course Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <select value={degreeId} onChange={handleDegreeChange} className={sel}>
                  <option value="">Degree *</option>
                  {degrees.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
                <select value={branchId} onChange={handleBranchChange} disabled={!degreeId} className={sel}>
                  <option value="">{degreeId ? "Branch *" : "Select degree first"}</option>
                  {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <select value={semesterId} onChange={(e) => { setSemesterId(e.target.value); setSubjectId(""); }} disabled={!branchId} className={sel}>
                  <option value="">{branchId ? "Semester *" : "Select branch first"}</option>
                  {semesters.map((s) => <option key={s.id} value={s.id}>Semester {s.semester_number}</option>)}
                </select>
                <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} disabled={!semesterId} className={sel}>
                  <option value="">{semesterId ? "Subject *" : "Select semester first"}</option>
                  {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
            </div>

            {/* Solution details */}
            <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">
                Solution Details
              </p>
              <Input
                placeholder="Solution title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-xl border-gray-300"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select value={solutionType} onChange={(e) => setSolutionType(e.target.value)} className={sel}>
                  <option value="">Solution type *</option>
                  {SOLUTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
                <Input
                  placeholder="Price (₹) *"
                  type="number" min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="h-12 rounded-xl border-gray-300"
                />
              </div>
              <textarea
                placeholder="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-20 border border-gray-300 rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isPremium}
                  onChange={(e) => setIsPremium(e.target.checked)}
                  className="w-4 h-4 accent-orange-500"
                />
                <span className="text-sm font-medium text-gray-700">Premium content</span>
              </label>
            </div>

            {/* YouTube URL */}
            <div className="rounded-2xl border border-gray-200 p-4">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-3">
                YouTube Video (Optional)
              </p>
              <div className="flex items-center gap-3 border border-gray-300 rounded-xl px-4 h-12 bg-white focus-within:ring-2 focus-within:ring-orange-400">
                <svg className="w-5 h-5 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
                </svg>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
                />
                {youtubeUrl && (
                  <button
                    type="button"
                    onClick={() => setYoutubeUrl("")}
                    className="text-gray-400 hover:text-red-500 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Student will get access to this video after purchase
              </p>
            </div>

            {/* PDF Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                PDF File {editingId ? "(upload new or keep existing)" : "*"}
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files[0];
                  if (file?.type === "application/pdf") setPdfFile(file);
                }}
                className="w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
                style={{
                  borderColor: pdfFile ? "#16a34a" : "#d1d5db",
                  background: pdfFile ? "#f0fdf4" : "#fafafa",
                }}
              >
                {pdfFile ? (
                  <div>
                    <p className="font-semibold text-green-700">✅ {pdfFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-xs text-blue-500 mt-1">First 2 pages preview will be auto-generated</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setPdfFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      className="text-xs text-red-500 mt-2 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : editingId && existingPdfUrl ? (
                  <div>
                    <p className="text-sm text-gray-600">📄 Current PDF is saved</p>
                    <p className="text-xs text-blue-500 mt-1">Click or drag to replace with new PDF</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-400 text-sm">📁 Click or drag PDF file here</p>
                    <p className="text-xs text-gray-300 mt-1">Max 50 MB · PDF only</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Cover Thumbnail
                <span className="ml-2 text-xs font-normal text-gray-400">
                  (JPG / PNG / WebP · 16:9 recommended · Max 5MB)
                </span>
              </label>
              <div
                onClick={() => thumbnailInputRef.current?.click()}
                className="w-full border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors hover:border-orange-400"
                style={{
                  borderColor: thumbnailFile ? "#16a34a" : (existingThumbnailBlobName ? "#f97316" : "#d1d5db"),
                  background: thumbnailFile ? "#f0fdf4" : "#fafafa",
                }}
              >
                {thumbnailFile ? (
                  <div>
                    <img
                      src={URL.createObjectURL(thumbnailFile)}
                      alt="preview"
                      className="rounded-xl mx-auto mb-2 object-cover"
                      style={{ width: "160px", aspectRatio: "16/9" }}
                    />
                    <p className="font-semibold text-green-700 text-sm">✅ {thumbnailFile.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(thumbnailFile.size / 1024).toFixed(0)} KB</p>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setThumbnailFile(null); if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""; }}
                      className="text-xs text-red-500 mt-2 underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : existingThumbnailBlobName ? (
                  <div>
                    <img
                      src={`/api/thumbnail?id=${editingId}`}
                      alt="current thumbnail"
                      className="rounded-xl mx-auto mb-2 object-cover"
                      style={{ width: "160px", aspectRatio: "16/9" }}
                    />
                    <p className="text-sm text-orange-600 font-medium">Current thumbnail saved</p>
                    <p className="text-xs text-blue-500 mt-1">Click to replace</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-3xl mb-2">🖼️</p>
                    <p className="text-gray-400 text-sm">Click to select cover image</p>
                    <p className="text-xs text-gray-300 mt-1">JPG · PNG · WebP · Max 5MB</p>
                  </div>
                )}
              </div>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: "none" }}
                onChange={handleThumbnailChange}
              />
            </div>

            {uploadProgress && (
              <div className="text-sm font-medium px-4 py-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
                {uploadProgress}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#ff6900] hover:bg-orange-600 text-white h-11 px-8 rounded-xl"
              >
                {loading ? "Please wait..." : editingId ? "Update Solution" : "Add Solution"}
              </Button>
              {editingId && (
                <Button type="button" variant="outline" onClick={resetForm} className="h-11 px-6 rounded-xl">
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* ════════════════════════════════════
          SOLUTION LIST CARD
      ════════════════════════════════════ */}
      <div className="rounded-3xl border border-gray-200 overflow-hidden bg-white shadow-xl">

        {/* List header */}
        <div className="bg-[#142647] px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">Solution List</h3>
            <p className="text-gray-400 text-xs mt-0.5">{solutions.length} total records</p>
          </div>
          <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            {filtered.length} shown
          </span>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 space-y-4">

          {/* Search */}
          <input
            type="text"
            placeholder="Search by title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 px-4 border border-gray-300 rounded-xl text-sm text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400"
          />

          {/* Semester pills */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Semester</p>
            <div className="flex flex-wrap gap-2">
              <span className={pill(filterSem === "all")} onClick={() => setFilterSem("all")}>All</span>
              {semestersInData.map((sem) => (
                <span
                  key={sem}
                  className={pill(filterSem === String(sem))}
                  onClick={() => setFilterSem(String(sem))}
                >
                  Sem {sem}
                </span>
              ))}
            </div>
          </div>

          {/* Type + Access row */}
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Type</p>
              <div className="flex flex-wrap gap-2">
                <span className={pill(filterType === "all")} onClick={() => setFilterType("all")}>All</span>
                {Object.entries(TYPE_LABELS).map(([val, label]) => (
                  <span key={val} className={pill(filterType === val)} onClick={() => setFilterType(val)}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Access</p>
              <div className="flex gap-2">
                {[["all", "All"], ["premium", "Premium"], ["free", "Free"]].map(([val, label]) => (
                  <span key={val} className={pill(filterPremium === val)} onClick={() => setFilterPremium(val)}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        {listLoading ? (
          <div className="py-16 text-center text-gray-400 text-sm">Loading solutions...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-gray-400 text-sm">No solutions match the selected filters</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  {["#", "Thumb", "Subject / Course", "Title", "Type", "Price", "Access", "YT", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((s, i) => (
                  <tr key={s.id} className={`hover:bg-orange-50/30 transition-colors ${editingId === s.id ? "bg-orange-50" : ""}`}>

                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>

                    {/* Thumbnail */}
                    <td className="px-4 py-3">
                      {s.thumbnail_blob_name ? (
                        <img
                          src={`/api/thumbnail?id=${s.id}`}
                          alt="thumb"
                          className="rounded-lg object-cover border border-gray-200"
                          style={{ width: "56px", aspectRatio: "16/9" }}
                        />
                      ) : (
                        <div
                          className="rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center text-gray-300 text-[9px] font-medium"
                          style={{ width: "56px", aspectRatio: "16/9" }}
                        >
                          No img
                        </div>
                      )}
                    </td>

                    {/* Subject */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 text-xs">{s.subject_name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {s.branch_name} · Sem {s.semester_number}
                      </p>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3 max-w-40">
                      <p className="text-gray-800 font-medium text-xs leading-snug line-clamp-2">{s.title}</p>
                    </td>

                    {/* Type */}
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100 whitespace-nowrap">
                        {TYPE_LABELS[s.solution_type] || s.solution_type}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 font-bold text-gray-800 text-xs whitespace-nowrap">
                      ₹{s.price || 0}
                    </td>

                    {/* Premium */}
                    <td className="px-4 py-3">
                      {(s.is_premium === 1 || s.is_premium === true) ? (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                          Premium
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-green-50 text-green-700">
                          Free
                        </span>
                      )}
                    </td>

                    {/* YouTube */}
                    <td className="px-4 py-3 text-center">
                      {s.youtube_url ? (
                        <a
                          href={s.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-red-100 hover:bg-red-200 transition-colors"
                          title="YouTube video linked"
                        >
                          <svg className="w-3.5 h-3.5 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-gray-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 px-3 rounded-lg"
                          onClick={() => handleEdit(s)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="text-xs h-8 px-3 rounded-lg"
                          onClick={() => handleDelete(s.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


// "use client";

// import { useState, useEffect, useRef } from "react";
// import { PDFDocument } from "pdf-lib";
// import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Button } from "../components/ui/button";

// const SOLUTION_TYPES = [
//   { value: "complete_notes", label: "Complete Notes" },
//   { value: "important_questions", label: "Important Questions" },
//   { value: "pyq_solutions", label: "PYQ Solutions" },
//   { value: "assignment", label: "Assignment" },
// ];

// export default function SolutionForm({ onSaved }) {
//   const [degrees, setDegrees] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [subjects, setSubjects] = useState([]);

//   const [degreeId, setDegreeId] = useState("");
//   const [branchId, setBranchId] = useState("");
//   const [semesterId, setSemesterId] = useState("");
//   const [subjectId, setSubjectId] = useState("");

//   const [title, setTitle] = useState("");
//   const [solutionType, setSolutionType] = useState("");
//   const [price, setPrice] = useState("");
//   const [description, setDescription] = useState("");
//   const [isPremium, setIsPremium] = useState(false);
//   const [youtubeUrl, setYoutubeUrl] = useState(""); // ← NEW

//   const [pdfFile, setPdfFile] = useState(null);
//   const [thumbnailFile, setThumbnailFile] = useState(null);
//   const [existingPdfUrl, setExistingPdfUrl] = useState("");
//   const [existingPreviewBlobName, setExistingPreviewBlobName] = useState("");
//   const [existingThumbnailBlobName, setExistingThumbnailBlobName] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState("");

//   const fileInputRef = useRef(null);
//   const thumbnailInputRef = useRef(null);

//   const generatePreviewPdf = async (file) => {
//     const originalBytes = await file.arrayBuffer();
//     const srcDoc = await PDFDocument.load(originalBytes);
//     const previewDoc = await PDFDocument.create();
//     const pageCount = Math.min(2, srcDoc.getPageCount());
//     const pages = await previewDoc.copyPages(srcDoc, [...Array(pageCount).keys()]);
//     pages.forEach((p) => previewDoc.addPage(p));
//     const previewBytes = await previewDoc.save();
//     return new Blob([previewBytes], { type: "application/pdf" });
//   };

//   const resetForm = () => {
//     setDegreeId(""); setBranchId(""); setSemesterId(""); setSubjectId("");
//     setBranches([]); setSemesters([]); setSubjects([]);
//     setTitle(""); setSolutionType(""); setPrice("");
//     setDescription(""); setIsPremium(false); setYoutubeUrl(""); // ← NEW
//     setPdfFile(null); setThumbnailFile(null);
//     setExistingPdfUrl(""); setExistingPreviewBlobName("");
//     setExistingThumbnailBlobName("");
//     setEditingId(null); setUploadProgress("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//     if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
//   };

//   // Expose prefill for parent (SolutionList edit button)
//   const prefill = (solution) => {
//     setEditingId(solution.id);
//     setDegreeId(solution.degree_id?.toString() || "");
//     setBranchId(solution.branch_id?.toString() || "");
//     setSemesterId(solution.semester_id?.toString() || "");
//     setSubjectId(solution.subject_id?.toString() || "");
//     setTitle(solution.title);
//     setSolutionType(solution.solution_type);
//     setPrice(solution.price?.toString() || "");
//     setDescription(solution.description || "");
//     setIsPremium(solution.is_premium === 1 || solution.is_premium === true);
//     setYoutubeUrl(solution.youtube_url || ""); // ← NEW
//     setExistingPdfUrl(solution.file_url || solution.pdf_url || "");
//     setExistingPreviewBlobName(solution.preview_blob_name || "");
//     setExistingThumbnailBlobName(solution.thumbnail_blob_name || "");
//     setPdfFile(null); setThumbnailFile(null); setUploadProgress("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//     if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   // Expose prefill via ref pattern — parent calls window.__prefillSolutionForm
//   useEffect(() => {
//     window.__prefillSolutionForm = prefill;
//     return () => { delete window.__prefillSolutionForm; };
//   }, []);

//   const fetchDegrees = async () => {
//     try {
//       const res = await fetch("/api/degrees");
//       const data = await res.json();
//       setDegrees(Array.isArray(data) ? data : (data.data || []));
//     } catch (e) { console.error(e); }
//   };

//   const fetchBranches = async (degId) => {
//     if (!degId) { setBranches([]); return; }
//     const res = await fetch(`/api/branch?degree_id=${degId}`);
//     const data = await res.json();
//     setBranches(Array.isArray(data) ? data : (data.data || []));
//   };

//   const fetchSemesters = async (brId) => {
//     if (!brId) { setSemesters([]); return; }
//     const res = await fetch(`/api/semesters?branch_id=${brId}`);
//     const data = await res.json();
//     setSemesters(Array.isArray(data) ? data : (data.data || []));
//   };

//   const fetchSubjects = async (semId) => {
//     if (!semId) { setSubjects([]); return; }
//     const res = await fetch(`/api/subjects?semester_id=${semId}`);
//     const data = await res.json();
//     setSubjects(Array.isArray(data) ? data : (data.data || []));
//   };

//   useEffect(() => { fetchDegrees(); }, []);
//   useEffect(() => { fetchBranches(degreeId); }, [degreeId]);
//   useEffect(() => { fetchSemesters(branchId); }, [branchId]);
//   useEffect(() => { fetchSubjects(semesterId); }, [semesterId]);

//   const handleDegreeChange = (e) => {
//     setDegreeId(e.target.value);
//     setBranchId(""); setSemesterId(""); setSubjectId("");
//     setSemesters([]); setSubjects([]);
//   };

//   const handleBranchChange = (e) => {
//     setBranchId(e.target.value);
//     setSemesterId(""); setSubjectId(""); setSubjects([]);
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (file.type !== "application/pdf") { alert("Only PDF allowed"); return; }
//     if (file.size > 50 * 1024 * 1024) { alert("Max 50MB"); return; }
//     setPdfFile(file);
//   };

//   const handleThumbnailChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) { alert("Only image allowed (JPG, PNG, WebP)"); return; }
//     if (file.size > 5 * 1024 * 1024) { alert("Max 5MB"); return; }
//     setThumbnailFile(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!degreeId || !branchId || !semesterId || !subjectId) {
//       alert("Select Degree, Branch, Semester and Subject"); return;
//     }
//     if (!title || !solutionType || !price) {
//       alert("Fill Title, Type and Price"); return;
//     }
//     if (!editingId && !pdfFile) { alert("Select PDF file"); return; }

//     try {
//       setLoading(true);
//       let finalBlobName = existingPdfUrl;
//       let finalPreviewBlobName = existingPreviewBlobName;
//       let finalThumbnailBlobName = existingThumbnailBlobName;

//       if (!editingId || pdfFile) {
//         setUploadProgress("Getting upload URL...");
//         const urlRes = await fetch("/api/upload-url", {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ fileName: pdfFile.name }),
//         });
//         const urlData = await urlRes.json();
//         if (!urlData.success) throw new Error(urlData.error || "Upload URL failed");

//         const previewUrlRes = await fetch("/api/upload-url", {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ fileName: `preview-${pdfFile.name}` }),
//         });
//         const previewUrlData = await previewUrlRes.json();
//         if (!previewUrlData.success) throw new Error("Preview URL failed");

//         setUploadProgress("Generating preview PDF...");
//         const previewBlob = await generatePreviewPdf(pdfFile);

//         setUploadProgress("Uploading PDF to Azure...");
//         const azRes = await fetch(urlData.uploadUrl, {
//           method: "PUT",
//           headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": "application/pdf" },
//           body: pdfFile,
//         });
//         if (!azRes.ok) throw new Error("PDF upload failed");

//         setUploadProgress("Uploading preview...");
//         const pvRes = await fetch(previewUrlData.uploadUrl, {
//           method: "PUT",
//           headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": "application/pdf" },
//           body: previewBlob,
//         });
//         if (!pvRes.ok) throw new Error("Preview upload failed");

//         finalBlobName = urlData.blobName;
//         finalPreviewBlobName = previewUrlData.blobName;
//       }

//       if (thumbnailFile) {
//         setUploadProgress("Uploading thumbnail...");
//         const thRes = await fetch("/api/upload-url", {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ fileName: `thumb-${thumbnailFile.name}`, contentType: thumbnailFile.type }),
//         });
//         const thData = await thRes.json();
//         if (!thData.success) throw new Error("Thumbnail URL failed");

//         const thAzRes = await fetch(thData.uploadUrl, {
//           method: "PUT",
//           headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": thumbnailFile.type },
//           body: thumbnailFile,
//         });
//         if (!thAzRes.ok) throw new Error("Thumbnail upload failed");
//         finalThumbnailBlobName = thData.blobName;
//       }

//       setUploadProgress("Saving details...");

//       if (!editingId || pdfFile) {
//         const res = await fetch("/api/upload", {
//           method: "POST", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             blobName: finalBlobName,
//             previewBlobName: finalPreviewBlobName,
//             thumbnailBlobName: finalThumbnailBlobName,
//             youtube_url: youtubeUrl.trim() || null, // ← NEW
//             oldBlobName: editingId && pdfFile ? existingPdfUrl : null,
//             oldPreviewBlobName: editingId && pdfFile ? existingPreviewBlobName : null,
//             oldThumbnailBlobName: editingId && thumbnailFile ? existingThumbnailBlobName : null,
//             subject_id: subjectId, solution_type: solutionType,
//             price, title, description,
//             is_premium: isPremium ? "1" : "0",
//             update_id: editingId?.toString() || null,
//           }),
//         });
//         const result = await res.json();
//         if (!result.success) throw new Error(result.error || "Save failed");
//       } else {
//         const res = await fetch("/api/solutions", {
//           method: "PUT", headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             id: editingId, subject_id: subjectId, title,
//             solution_type: solutionType, pdf_url: finalBlobName,
//             preview_blob_name: finalPreviewBlobName,
//             thumbnail_blob_name: finalThumbnailBlobName,
//             youtube_url: youtubeUrl.trim() || null, // ← NEW
//             description, price: parseFloat(price),
//             is_premium: isPremium ? 1 : 0,
//           }),
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Update failed");
//       }

//       setUploadProgress("✅ Done!");
//       alert(editingId ? "Solution updated!" : "Solution added!");
//       resetForm();
//       onSaved?.(); // parent ko refresh signal
//     } catch (err) {
//       console.error(err);
//       alert(err.message || "Something went wrong");
//       setUploadProgress("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sel = "w-full h-12 px-4 border rounded-xl bg-white text-sm text-gray-800 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-400";

//   return (
//     <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
//       <CardHeader className="bg-[#142647] text-white">
//         <CardTitle className="text-xl">
//           {editingId ? "Edit Solution" : "Add New Solution"}
//         </CardTitle>
//         <p className="text-sm text-gray-300">Fill in all required fields</p>
//       </CardHeader>

//       <CardContent className="p-6">
//         <form onSubmit={handleSubmit} className="space-y-5">

//           {/* Course */}
//           <div className="rounded-2xl border border-gray-200 p-4">
//             <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">Course Details</p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//               <select value={degreeId} onChange={handleDegreeChange} className={sel}>
//                 <option value="">Degree *</option>
//                 {degrees.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
//               </select>
//               <select value={branchId} onChange={handleBranchChange} disabled={!degreeId} className={sel}>
//                 <option value="">{degreeId ? "Branch *" : "Select degree first"}</option>
//                 {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
//               </select>
//               <select value={semesterId} onChange={(e) => { setSemesterId(e.target.value); setSubjectId(""); }} disabled={!branchId} className={sel}>
//                 <option value="">{branchId ? "Semester *" : "Select branch first"}</option>
//                 {semesters.map((s) => <option key={s.id} value={s.id}>Semester {s.semester_number}</option>)}
//               </select>
//               <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} disabled={!semesterId} className={sel}>
//                 <option value="">{semesterId ? "Subject *" : "Select semester first"}</option>
//                 {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Solution details */}
//           <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
//             <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">Solution Details</p>
//             <Input placeholder="Solution title *" value={title} onChange={(e) => setTitle(e.target.value)} className="h-12 rounded-xl" />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <select value={solutionType} onChange={(e) => setSolutionType(e.target.value)} className={sel}>
//                 <option value="">Solution type *</option>
//                 {SOLUTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
//               </select>
//               <Input placeholder="Price (₹) *" type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} className="h-12 rounded-xl" />
//             </div>
//             <textarea
//               placeholder="Description (optional)"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full min-h-20 border rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"
//             />
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input type="checkbox" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="w-4 h-4 accent-orange-500" />
//               <span className="text-sm font-medium text-gray-700">Premium content</span>
//             </label>
//           </div>

//           {/* YouTube URL ← NEW */}
//           <div className="rounded-2xl border border-gray-200 p-4">
//             <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">YouTube Video (Optional)</p>
//             <div className="flex items-center gap-3 border rounded-xl px-4 h-12 bg-white focus-within:ring-2 focus-within:ring-orange-400">
//               <svg className="w-5 h-5 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
//                 <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
//               </svg>
//               <input
//                 type="url"
//                 placeholder="https://www.youtube.com/watch?v=..."
//                 value={youtubeUrl}
//                 onChange={(e) => setYoutubeUrl(e.target.value)}
//                 className="flex-1 bg-transparent text-sm text-gray-800 outline-none placeholder-gray-400"
//               />
//             </div>
//             <p className="text-xs text-gray-400 mt-2">
//               Student ko purchase ke baad ye video access milega
//             </p>
//           </div>

//           {/* PDF Upload */}
//           <div>
//             <label className="block text-sm font-semibold mb-2 text-gray-700">
//               PDF File {editingId ? "(upload new or keep existing)" : "*"}
//             </label>
//             <div
//               onClick={() => fileInputRef.current?.click()}
//               onDragOver={(e) => e.preventDefault()}
//               onDrop={(e) => {
//                 e.preventDefault();
//                 const file = e.dataTransfer.files[0];
//                 if (file?.type === "application/pdf") setPdfFile(file);
//               }}
//               className="w-full border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors"
//               style={{ borderColor: pdfFile ? "#16a34a" : "#d1d5db", background: pdfFile ? "#f0fdf4" : "#fafafa" }}
//             >
//               {pdfFile ? (
//                 <div>
//                   <p className="font-semibold text-green-700">✅ {pdfFile.name}</p>
//                   <p className="text-xs text-gray-500 mt-1">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
//                   <button type="button" onClick={(e) => { e.stopPropagation(); setPdfFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
//                     className="text-xs text-red-500 mt-2 underline">Remove</button>
//                 </div>
//               ) : editingId && existingPdfUrl ? (
//                 <div>
//                   <p className="text-sm text-gray-600">📄 Current PDF is saved</p>
//                   <p className="text-xs text-blue-500 mt-1">Click or drag to replace</p>
//                 </div>
//               ) : (
//                 <div>
//                   <p className="text-gray-400 text-sm">📁 Click or drag PDF here</p>
//                   <p className="text-xs text-gray-300 mt-1">Max 50 MB · PDF only</p>
//                 </div>
//               )}
//             </div>
//             <input ref={fileInputRef} type="file" accept=".pdf" style={{ display: "none" }} onChange={handleFileChange} />
//           </div>

//           {/* Thumbnail */}
//           <div>
//             <label className="block text-sm font-semibold mb-2 text-gray-700">
//               Cover Thumbnail
//               <span className="ml-2 text-xs font-normal text-gray-400">(JPG/PNG/WebP · 16:9 recommended · Max 5MB)</span>
//             </label>
//             <div
//               onClick={() => thumbnailInputRef.current?.click()}
//               className="w-full border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors hover:border-orange-400"
//               style={{
//                 borderColor: thumbnailFile ? "#16a34a" : (existingThumbnailBlobName ? "#f97316" : "#d1d5db"),
//                 background: thumbnailFile ? "#f0fdf4" : "#fafafa",
//               }}
//             >
//               {thumbnailFile ? (
//                 <div>
//                   <img src={URL.createObjectURL(thumbnailFile)} alt="preview"
//                     className="w-40 h-auto rounded-lg mx-auto mb-2 object-cover" style={{ aspectRatio: "16/9" }} />
//                   <p className="font-semibold text-green-700 text-sm">✅ {thumbnailFile.name}</p>
//                   <button type="button" onClick={(e) => { e.stopPropagation(); setThumbnailFile(null); if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""; }}
//                     className="text-xs text-red-500 mt-2 underline">Remove</button>
//                 </div>
//               ) : existingThumbnailBlobName ? (
//                 <div>
//                   <img src={`/api/thumbnail?id=${editingId}`} alt="current"
//                     className="w-40 rounded-lg mx-auto mb-2 object-cover" style={{ aspectRatio: "16/9" }} />
//                   <p className="text-sm text-orange-600 font-medium">Current thumbnail saved</p>
//                   <p className="text-xs text-blue-500 mt-1">Click to replace</p>
//                 </div>
//               ) : (
//                 <div>
//                   <p className="text-3xl mb-2">🖼️</p>
//                   <p className="text-gray-400 text-sm">Click to select cover image</p>
//                   <p className="text-xs text-gray-300 mt-1">JPG · PNG · WebP · Max 5MB</p>
//                 </div>
//               )}
//             </div>
//             <input ref={thumbnailInputRef} type="file" accept="image/jpeg,image/png,image/webp"
//               style={{ display: "none" }} onChange={handleThumbnailChange} />
//           </div>

//           {uploadProgress && (
//             <div className="text-sm font-medium px-4 py-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-100">
//               {uploadProgress}
//             </div>
//           )}

//           <div className="flex gap-3 pt-2">
//             <Button type="submit" disabled={loading}
//               className="bg-[#ff6900] hover:bg-orange-600 text-white h-11 px-8 rounded-xl">
//               {loading ? "Please wait..." : editingId ? "Update Solution" : "Add Solution"}
//             </Button>
//             {editingId && (
//               <Button type="button" variant="outline" onClick={resetForm} className="h-11 px-6 rounded-xl">
//                 Cancel
//               </Button>
//             )}
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { PDFDocument } from "pdf-lib";
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
//   const [degrees, setDegrees] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [semesters, setSemesters] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [solutions, setSolutions] = useState([]);

//   const [degreeId, setDegreeId] = useState("");
//   const [branchId, setBranchId] = useState("");
//   const [semesterId, setSemesterId] = useState("");
//   const [subjectId, setSubjectId] = useState("");

//   const [title, setTitle] = useState("");
//   const [solutionType, setSolutionType] = useState("");
//   const [price, setPrice] = useState("");
//   const [description, setDescription] = useState("");
//   const [isPremium, setIsPremium] = useState(false);

//   const [pdfFile, setPdfFile] = useState(null);
//   const [thumbnailFile, setThumbnailFile] = useState(null);        // ← NEW
//   const [existingPdfUrl, setExistingPdfUrl] = useState("");
//   const [existingPreviewBlobName, setExistingPreviewBlobName] = useState("");
//   const [existingThumbnailBlobName, setExistingThumbnailBlobName] = useState(""); // ← NEW
//   const [editingId, setEditingId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState("");

//   const fileInputRef = useRef(null);
//   const thumbnailInputRef = useRef(null);  // ← NEW

//   const generatePreviewPdf = async (file) => {
//     const originalBytes = await file.arrayBuffer();
//     const srcDoc = await PDFDocument.load(originalBytes);
//     const previewDoc = await PDFDocument.create();
//     const pageCount = Math.min(2, srcDoc.getPageCount());
//     const pages = await previewDoc.copyPages(srcDoc, [...Array(pageCount).keys()]);
//     pages.forEach((p) => previewDoc.addPage(p));
//     const previewBytes = await previewDoc.save();
//     return new Blob([previewBytes], { type: "application/pdf" });
//   };

//   const resetForm = () => {
//     setDegreeId(""); setBranchId(""); setSemesterId(""); setSubjectId("");
//     setBranches([]); setSemesters([]); setSubjects([]);
//     setTitle(""); setSolutionType(""); setPrice("");
//     setDescription(""); setIsPremium(false);
//     setPdfFile(null); setThumbnailFile(null);           // ← NEW
//     setExistingPdfUrl(""); setExistingPreviewBlobName("");
//     setExistingThumbnailBlobName("");                   // ← NEW
//     setEditingId(null); setUploadProgress("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//     if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""; // ← NEW
//   };

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
//       const res = await fetch(`/api/branch?degree_id=${degId}`);
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

//   useEffect(() => { fetchDegrees(); fetchSolutions(); }, []);
//   useEffect(() => { fetchBranches(degreeId); }, [degreeId]);
//   useEffect(() => { fetchSemesters(branchId); }, [branchId]);
//   useEffect(() => { fetchSubjects(semesterId); }, [semesterId]);

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

//   // PDF drag & drop
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

//   // ── NEW: Thumbnail image change handler ──
//   const handleThumbnailChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) { alert("Sirf image file allowed hai (JPG, PNG, WebP)"); return; }
//     if (file.size > 5 * 1024 * 1024) { alert("Image 5MB se badi nahi honi chahiye"); return; }
//     setThumbnailFile(file);
//   };

//   // ── Submit ──
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

//       let finalBlobName = existingPdfUrl;
//       let finalPreviewBlobName = existingPreviewBlobName;
//       let finalThumbnailBlobName = existingThumbnailBlobName; // ← NEW

//       // ── NEW PDF upload ──
//       if (!editingId || pdfFile) {
//         setUploadProgress("Upload URL generate ho rahi hai...");
//         const urlRes = await fetch("/api/upload-url", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ fileName: pdfFile.name }),
//         });
//         const urlData = await urlRes.json();
//         if (!urlRes.ok || !urlData.success) throw new Error(urlData.error || "Upload URL nahi mili");

//         const previewUrlRes = await fetch("/api/upload-url", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ fileName: `preview-${pdfFile.name}` }),
//         });
//         const previewUrlData = await previewUrlRes.json();
//         if (!previewUrlRes.ok || !previewUrlData.success) throw new Error("Preview upload URL nahi mili");

//         setUploadProgress("Preview PDF ban rahi hai...");
//         const previewBlob = await generatePreviewPdf(pdfFile);

//         setUploadProgress("PDF Azure par upload ho rahi hai...");
//         const azureRes = await fetch(urlData.uploadUrl, {
//           method: "PUT",
//           headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": "application/pdf" },
//           body: pdfFile,
//         });
//         if (!azureRes.ok) throw new Error("Azure PDF upload fail. Network ya CORS check karo.");

//         setUploadProgress("Preview Azure par upload ho rahi hai...");
//         const previewAzureRes = await fetch(previewUrlData.uploadUrl, {
//           method: "PUT",
//           headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": "application/pdf" },
//           body: previewBlob,
//         });
//         if (!previewAzureRes.ok) throw new Error("Preview upload fail.");

//         finalBlobName = urlData.blobName;
//         finalPreviewBlobName = previewUrlData.blobName;
//       }

//       // ── NEW: Thumbnail upload (agar naya image select kiya) ──
//       if (thumbnailFile) {
//         setUploadProgress("Thumbnail upload URL le raha hai...");
//         const thumbUrlRes = await fetch("/api/upload-url", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             fileName: `thumb-${thumbnailFile.name}`,
//             contentType: thumbnailFile.type,
//           }),
//         });
//         const thumbUrlData = await thumbUrlRes.json();
//         if (!thumbUrlRes.ok || !thumbUrlData.success) throw new Error("Thumbnail upload URL nahi mili");

//         setUploadProgress("Thumbnail Azure par upload ho rahi hai...");
//         const thumbAzureRes = await fetch(thumbUrlData.uploadUrl, {
//           method: "PUT",
//           headers: {
//             "x-ms-blob-type": "BlockBlob",
//             "Content-Type": thumbnailFile.type,
//           },
//           body: thumbnailFile,
//         });
//         if (!thumbAzureRes.ok) throw new Error("Thumbnail upload fail.");

//         finalThumbnailBlobName = thumbUrlData.blobName;
//       }

//       // ── Save to DB ──
//       setUploadProgress("Details save ho rahi hain...");

//       if (!editingId || pdfFile) {
//         // New solution ya new PDF wala edit — /api/upload use karo
//         // const res = await fetch("/api/upload", {
//         //   method: "POST",
//         //   headers: { "Content-Type": "application/json" },
//         //   body: JSON.stringify({
//         //     blobName: finalBlobName,
//         //     previewBlobName: finalPreviewBlobName,
//         //     thumbnailBlobName: finalThumbnailBlobName,   // ← NEW
//         //     subject_id: subjectId,
//         //     solution_type: solutionType,
//         //     price,
//         //     title,
//         //     description,
//         //     is_premium: isPremium ? "1" : "0",
//         //     update_id: editingId ? editingId.toString() : null,
//         //   }),
//         // });
           
//         const res = await fetch("/api/upload", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     blobName: finalBlobName,
//     previewBlobName: finalPreviewBlobName,
//     thumbnailBlobName: finalThumbnailBlobName,
//     // ── NEW: cleanup ke liye purane blob names bhejo ──
//     oldBlobName: editingId && pdfFile ? existingPdfUrl : null,
//     oldPreviewBlobName: editingId && pdfFile ? existingPreviewBlobName : null,
//     oldThumbnailBlobName: editingId && thumbnailFile ? existingThumbnailBlobName : null,
//     subject_id: subjectId,
//     solution_type: solutionType,
//     price,
//     title,
//     description,
//     is_premium: isPremium ? "1" : "0",
//     update_id: editingId ? editingId.toString() : null,
//   }),
// });


//         const result = await res.json();
//         if (!res.ok || !result.success) throw new Error(result.error || "Save failed");
//       } else {
//         // Same PDF, sirf metadata update
//         const res = await fetch("/api/solutions", {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             id: editingId,
//             subject_id: subjectId,
//             title,
//             solution_type: solutionType,
//             pdf_url: finalBlobName,
//             preview_blob_name: finalPreviewBlobName,
//             thumbnail_blob_name: finalThumbnailBlobName,  // ← NEW
//             description,
//             price: parseFloat(price),
//             is_premium: isPremium ? 1 : 0,
//           }),
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.message || "Something went wrong");
//       }

//       setUploadProgress("✅ Ho gaya!");
//       alert(editingId ? "Solution update ho gaya!" : "Solution add ho gaya!");
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

//   const handleEdit = (solution) => {
//     setEditingId(solution.id);
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
//     setExistingPreviewBlobName(solution.preview_blob_name || "");
//     setExistingThumbnailBlobName(solution.thumbnail_blob_name || ""); // ← NEW
//     setPdfFile(null);
//     setThumbnailFile(null);  // ← NEW
//     setUploadProgress("");
//     if (fileInputRef.current) fileInputRef.current.value = "";
//     if (thumbnailInputRef.current) thumbnailInputRef.current.value = ""; // ← NEW
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

//   const renderDropZone = () => {
//     if (pdfFile) return (
//       <div>
//         <p className="font-semibold text-green-700">✅ {pdfFile.name}</p>
//         <p className="text-xs text-gray-500 mt-1">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
//         <p className="text-xs text-blue-500 mt-1">Pehle 2 page ka preview automatic ban jayega</p>
//         <button type="button"
//           onClick={(e) => { e.stopPropagation(); setPdfFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
//           className="text-xs text-red-500 mt-2 underline">Remove</button>
//       </div>
//     );
//     if (editingId && existingPdfUrl) return (
//       <div>
//         <p className="text-sm text-gray-600">📄 Current PDF saved hai</p>
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

//   const selectClass = "w-full h-12 px-4 border rounded-lg bg-white text-black disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed";

//   return (
//     <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
//       <CardHeader className="bg-[#142647] text-white">
//         <CardTitle className="text-2xl">Solution management</CardTitle>
//         <p className="text-sm text-gray-300">Add and manage all solutions</p>
//       </CardHeader>

//       <CardContent className="p-6">
//         <form onSubmit={handleSubmit} className="space-y-6 mb-8">

//           {/* Course details */}
//           <div className="rounded-2xl border border-gray-200 p-4">
//             <p className="text-xs font-bold tracking-wide text-gray-400 uppercase mb-3">Course details</p>
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
//               <select value={degreeId} onChange={handleDegreeChange} className={selectClass}>
//                 <option value="">Select degree *</option>
//                 {degrees.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
//               </select>
//               <select value={branchId} onChange={handleBranchChange} disabled={!degreeId} className={selectClass}>
//                 <option value="">{degreeId ? "Select branch *" : "Pehle degree select karo"}</option>
//                 {branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
//               </select>
//               <select value={semesterId} onChange={handleSemesterChange} disabled={!branchId} className={selectClass}>
//                 <option value="">{branchId ? "Select semester *" : "Pehle branch select karo"}</option>
//                 {semesters.map((s) => <option key={s.id} value={s.id}>Semester {s.semester_number}</option>)}
//               </select>
//               <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} disabled={!semesterId} className={selectClass}>
//                 <option value="">{semesterId ? "Select subject *" : "Pehle semester select karo"}</option>
//                 {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Solution details */}
//           <div className="rounded-2xl border border-gray-200 p-4 space-y-3">
//             <p className="text-xs font-bold tracking-wide text-gray-400 uppercase mb-1">Solution details</p>
//             <Input placeholder="Solution title *" value={title}
//               onChange={(e) => setTitle(e.target.value)} className="h-12" />
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//               <select value={solutionType} onChange={(e) => setSolutionType(e.target.value)} className={selectClass}>
//                 <option value="">Select solution type *</option>
//                 {SOLUTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
//               </select>
//               <Input placeholder="Price (₹) *" type="number" min="0"
//                 value={price} onChange={(e) => setPrice(e.target.value)} className="h-12" />
//             </div>
//             <textarea placeholder="Description (optional)" value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full min-h-20 border rounded-lg p-3 text-sm resize-none" />
//             <label className="flex items-center gap-2 cursor-pointer select-none">
//               <input type="checkbox" checked={isPremium}
//                 onChange={(e) => setIsPremium(e.target.checked)} className="w-4 h-4" />
//               <span className="text-sm font-medium">Premium content</span>
//             </label>
//           </div>

//           {/* PDF Upload */}
//           <div>
//             <label className="block text-sm font-semibold mb-2 text-gray-700">
//               PDF file {editingId ? "(naya upload karo ya same rakho)" : "*"}
//             </label>
//             <div
//               onClick={() => fileInputRef.current?.click()}
//               onDragOver={handleDragOver}
//               onDrop={handleDrop}
//               className="w-full border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors"
//               style={{ borderColor: pdfFile ? "#16a34a" : "#d1d5db", background: pdfFile ? "#f0fdf4" : "#fafafa" }}
//             >
//               {renderDropZone()}
//             </div>
//             <input ref={fileInputRef} type="file" accept=".pdf"
//               style={{ display: "none" }} onChange={handleFileChange} />
//           </div>

//           {/* ── NEW: Thumbnail Image Upload ── */}
//           <div>
//             <label className="block text-sm font-semibold mb-2 text-gray-700">
//               Cover Image / Thumbnail
//               <span className="ml-2 text-xs font-normal text-gray-400">
//                 (JPG, PNG, WebP · Max 5MB · Checkout page par dikhega)
//               </span>
//             </label>

//             <div
//               onClick={() => thumbnailInputRef.current?.click()}
//               className="w-full border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors hover:border-orange-400"
//               style={{
//                 borderColor: thumbnailFile ? "#16a34a" : (existingThumbnailBlobName ? "#f97316" : "#d1d5db"),
//                 background: thumbnailFile ? "#f0fdf4" : "#fafafa",
//               }}
//             >
//               {thumbnailFile ? (
//                 <div>
//                   {/* Preview of selected image */}
//                   <img
//                     src={URL.createObjectURL(thumbnailFile)}
//                     alt="Thumbnail preview"
//                     className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
//                   />
//                   <p className="font-semibold text-green-700 text-sm">✅ {thumbnailFile.name}</p>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {(thumbnailFile.size / 1024).toFixed(0)} KB
//                   </p>
//                   <button
//                     type="button"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       setThumbnailFile(null);
//                       if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
//                     }}
//                     className="text-xs text-red-500 mt-2 underline"
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ) : existingThumbnailBlobName ? (
//                 <div>
//                   {/* Existing thumbnail show karo */}
//                   <img
//                     src={`/api/thumbnail?id=${editingId}`}
//                     alt="Current thumbnail"
//                     className="w-32 h-32 object-cover rounded-lg mx-auto mb-2"
//                   />
//                   <p className="text-sm text-orange-600 font-medium">📷 Current thumbnail saved hai</p>
//                   <p className="text-xs text-blue-500 mt-1">Click karo naya image replace karne ke liye</p>
//                 </div>
//               ) : (
//                 <div>
//                   <p className="text-4xl mb-2">🖼️</p>
//                   <p className="text-gray-400 text-sm">Click karo cover image select karne ke liye</p>
//                   <p className="text-xs text-gray-300 mt-1">JPG · PNG · WebP · Max 5MB</p>
//                 </div>
//               )}
//             </div>

//             <input
//               ref={thumbnailInputRef}
//               type="file"
//               accept="image/jpeg,image/png,image/webp"
//               style={{ display: "none" }}
//               onChange={handleThumbnailChange}
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

//         {/* Solutions Table */}
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
//                   <TableHead className="font-bold">Thumb</TableHead>
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
//                     <TableCell colSpan={8} className="text-center py-10 text-gray-400">
//                       No solutions found. Add one above.
//                     </TableCell>
//                   </TableRow>
//                 ) : solutions.map((s, i) => (
//                   <TableRow key={s.id} className={editingId === s.id ? "bg-orange-50" : ""}>
//                     <TableCell>{i + 1}</TableCell>

//                     {/* Thumbnail preview in table */}
//                     <TableCell>
//                       {s.thumbnail_blob_name ? (
//                         <img
//                           src={`/api/thumbnail?id=${s.id}`}
//                           alt="thumb"
//                           className="w-12 h-12 object-cover rounded-lg border"
//                         />
//                       ) : (
//                         <div className="w-12 h-12 rounded-lg border bg-gray-100 flex items-center justify-center text-gray-300 text-xs">
//                           No img
//                         </div>
//                       )}
//                     </TableCell>

//                     <TableCell className="max-w-50">
//                       <p className="truncate font-medium">{s.subject_name}</p>
//                       <p className="text-xs text-gray-400 truncate">
//                         {s.branch_name} · Sem {s.semester_number}
//                       </p>
//                     </TableCell>
//                     <TableCell className="max-w-45 truncate">{s.title}</TableCell>
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



