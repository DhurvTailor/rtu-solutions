"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

export default function SolutionForm() {
  const [subjects, setSubjects] = useState([]);
  const [solutions, setSolutions] = useState([]);

  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [solutionType, setSolutionType] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ─── Reset form ───────────────────────────────────────────
  const resetForm = () => {
    setSubjectId("");
    setTitle("");
    setSolutionType("");
    setPdfUrl("");
    setDescription("");
    setIsPremium(false);
    setEditingId(null);
  };

  // ─── Fetch Subjects ───────────────────────────────────────
  const fetchSubjects = async () => {
    try {
      const res = await fetch("/api/subjects");
      const data = await res.json();
      // API {success, data} format handle karo
      if (data.success) {
        setSubjects(data.data);
      } else {
        setSubjects(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.log("fetchSubjects error:", error);
    }
  };

  // ─── Fetch Solutions ──────────────────────────────────────
  const fetchSolutions = async () => {
    try {
      const res = await fetch("/api/solutions");
      const data = await res.json();
      // API {success, data} format handle karo
      if (data.success) {
        setSolutions(data.data);
      } else {
        setSolutions(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.log("fetchSolutions error:", error);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchSolutions();
  }, []);

  // ─── Add / Update ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subjectId || !title || !solutionType || !pdfUrl) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        subject_id: subjectId,
        title,
        solution_type: solutionType,
        pdf_url: pdfUrl,
        description,
        // MySQL TINYINT ke liye 1/0 bhejo
        is_premium: isPremium ? 1 : 0,
      };

      const res = await fetch("/api/solutions", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingId ? { id: editingId, ...payload } : payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      alert(data.message);
      resetForm();
      fetchSolutions();
    } catch (error) {
      console.log(error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ─── Edit ─────────────────────────────────────────────────
  const handleEdit = (solution) => {
    setEditingId(solution.id);
    setSubjectId(solution.subject_id);
    setTitle(solution.title);
    setSolutionType(solution.solution_type);
    setPdfUrl(solution.pdf_url);
    setDescription(solution.description || "");
    // MySQL 0/1 ko boolean me convert karo
    setIsPremium(solution.is_premium === 1 || solution.is_premium === true);
    // Form ke upar scroll karo
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Delete ───────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm("Delete this solution?")) return;

    try {
      const res = await fetch(`/api/solutions?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Something went wrong");

      alert(data.message);
      fetchSolutions();
    } catch (error) {
      console.log(error);
      alert(error.message || "Something went wrong");
    }
  };

  // ─── UI ───────────────────────────────────────────────────
  return (
    <Card className="border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-[#142647] text-white">
        <CardTitle className="text-2xl">Solution Management</CardTitle>
        <p className="text-sm text-gray-300">Add and manage all solutions</p>
      </CardHeader>

      <CardContent className="p-6">
        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          {/* Subject dropdown */}
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            className="w-full h-12 px-4 border rounded-lg bg-white text-black"
          >
            <option value="">Select Subject *</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>

          <Input
            placeholder="Solution Title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12"
          />

          {/* Solution type dropdown */}
          <select
            value={solutionType}
            onChange={(e) => setSolutionType(e.target.value)}
            className="w-full h-12 px-4 border rounded-lg bg-white text-black"
          >
            <option value="">Select Solution Type *</option>
            <option value="Notes">Notes</option>
            <option value="PYQ">PYQ</option>
            <option value="Important Questions">Important Questions</option>
            <option value="Assignment">Assignment</option>
          </select>

          <Input
            placeholder="PDF URL *"
            value={pdfUrl}
            onChange={(e) => setPdfUrl(e.target.value)}
            className="h-12"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full min-h-25 border rounded-lg p-3 text-sm resize-none"
          />

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPremium}
              onChange={(e) => setIsPremium(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Premium Content</span>
          </label>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#ff6900] hover:bg-orange-600 text-white h-11 px-6"
            >
              {loading ? "Saving..." : editingId ? "Update Solution" : "Add Solution"}
            </Button>

            {/* Cancel edit button — sirf editing mode me dikhega */}
            {editingId && (
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                className="h-11 px-6"
              >
                Cancel Edit
              </Button>
            )}
          </div>
        </form>

        {/* ── Solution List ── */}
        <div className="rounded-2xl border overflow-hidden">
          <div className="bg-[#142647] px-4 py-3 flex items-center justify-between">
            <h3 className="text-white font-semibold">Solution List</h3>
            <span className="text-gray-300 text-sm">{solutions.length} records</span>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead className="font-bold">S.No</TableHead>
                  <TableHead className="font-bold">Subject</TableHead>
                  <TableHead className="font-bold">Title</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold text-center">Premium</TableHead>
                  <TableHead className="font-bold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {solutions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10 text-gray-400">
                      No solutions found. Add one above.
                    </TableCell>
                  </TableRow>
                ) : (
                  solutions.map((solution, index) => (
                    <TableRow
                      key={solution.id}
                      className={editingId === solution.id ? "bg-orange-50" : ""}
                    >
                      <TableCell className="text-sm">{index + 1}</TableCell>
                      <TableCell className="text-sm">{solution.subject_name}</TableCell>
                      <TableCell className="text-sm max-w-50 truncate">{solution.title}</TableCell>
                      <TableCell>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {solution.solution_type}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {solution.is_premium === 1 || solution.is_premium === true ? (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-700">
                            Premium
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">Free</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => handleEdit(solution)}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(solution.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}