"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/src/components/ui/select";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table";

const DOCX_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const emptyForm = {
  id: null,
  degree_id: "",
  branch_id: "",
  semester_id: "",
  subject_id: "",
  title: "",
  price: "",
  is_active: true,
  content_blob_name: null,
  preview_blob_name: null,
};

async function uploadToAzure(file, contentType) {
  const urlRes = await fetch("/api/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileName: file.name, contentType }),
  });
  const urlData = await urlRes.json();
  if (!urlData.success) throw new Error(urlData.error || "Upload URL nahi mila");

  const putRes = await fetch(urlData.uploadUrl, {
    method: "PUT",
    headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": contentType },
    body: file,
  });
  if (!putRes.ok) throw new Error("Azure par upload fail hua");

  return urlData.blobName;
}

export default function ReportTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [docxFile, setDocxFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Degrees, branches, semesters — ek baar full list, client-side filter karenge
  async function loadStaticData() {
    try {
      const [templatesRes, degreesRes, branchRes, semRes] = await Promise.all([
        fetch("/api/admin/report-templates"),
        fetch("/api/degrees"),
        fetch("/api/branch"),
        fetch("/api/semesters"),
      ]);
      setTemplates(await templatesRes.json());
      setDegrees(await degreesRes.json());
      setBranches(await branchRes.json());
      setSemesters(await semRes.json());
    } catch (e) {
      setError("Data load nahi ho paaya");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStaticData();
  }, []);

  // Semester badalte hi subjects fetch karo (existing /api/subjects?semester_id= pattern)
  useEffect(() => {
    if (!form.semester_id) {
      setSubjects([]);
      return;
    }
    fetch(`/api/subjects?semester_id=${form.semester_id}`)
      .then((res) => res.json())
      .then((data) => setSubjects(Array.isArray(data) ? data : []))
      .catch(() => setSubjects([]));
  }, [form.semester_id]);

  const filteredBranches = branches.filter(
    (b) => String(b.degree_id) === String(form.degree_id)
  );
  const filteredSemesters = semesters.filter(
    (s) => String(s.branch_id) === String(form.branch_id)
  );

  function resetForm() {
    setForm(emptyForm);
    setDocxFile(null);
    setPreviewFile(null);
    setSubjects([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.subject_id || !form.title.trim() || !form.price) {
      setError("Subject, Title aur Price required hain");
      return;
    }
    if (!form.id && !docxFile) {
      setError("Naya template banane ke liye docx file chahiye");
      return;
    }

    setSaving(true);
    setError("");
    try {
      let content_blob_name = form.content_blob_name;
      let preview_blob_name = form.preview_blob_name;

      if (docxFile) {
        content_blob_name = await uploadToAzure(docxFile, DOCX_TYPE);
      }
      if (previewFile) {
        preview_blob_name = await uploadToAzure(previewFile, "application/pdf");
      }

      const payload = {
        subject_id: form.subject_id,
        title: form.title.trim(),
        price: parseFloat(form.price),
        is_active: form.is_active ? 1 : 0,
        content_blob_name,
        preview_blob_name,
        update_id: form.id,
        old_content_blob_name: docxFile ? form.content_blob_name : null,
        old_preview_blob_name: previewFile ? form.preview_blob_name : null,
      };

      const res = await fetch("/api/admin/report-templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Save fail hua");

      resetForm();
      await loadStaticData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(template) {
    // Edit mein purani chain (degree/branch/semester) pata nahi hoti — sirf
    // subject_id DB mein hai. Isliye edit karte waqt subject wahi rakho, aur
    // cascading dropdowns khaali chhod do (subject change karna ho to naye
    // sirey se select karna hoga)
    setForm({
      id: template.id,
      degree_id: "",
      branch_id: "",
      semester_id: "",
      subject_id: String(template.subject_id),
      title: template.title,
      price: String(template.price),
      is_active: !!template.is_active,
      content_blob_name: template.content_blob_name,
      preview_blob_name: template.preview_blob_name,
    });
    setDocxFile(null);
    setPreviewFile(null);
  }

  async function handleDelete(id) {
    if (!confirm("Ye template delete karna hai? Docx aur preview Azure se bhi hat jayenge.")) return;
    try {
      const res = await fetch(`/api/admin/report-templates/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Delete fail hua");
      await loadStaticData();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-4">Report Content Templates</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8 border rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3">
          <Select
            value={form.degree_id}
            onValueChange={(val) =>
              setForm((f) => ({ ...f, degree_id: val, branch_id: "", semester_id: "", subject_id: "" }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Degree select karo" />
            </SelectTrigger>
            <SelectContent>
              {degrees.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>{d.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.branch_id}
            onValueChange={(val) =>
              setForm((f) => ({ ...f, branch_id: val, semester_id: "", subject_id: "" }))
            }
            disabled={!form.degree_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Branch select karo" />
            </SelectTrigger>
            <SelectContent>
              {filteredBranches.map((b) => (
                <SelectItem key={b.id} value={String(b.id)}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.semester_id}
            onValueChange={(val) => setForm((f) => ({ ...f, semester_id: val, subject_id: "" }))}
            disabled={!form.branch_id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Semester select karo" />
            </SelectTrigger>
            <SelectContent>
              {filteredSemesters.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>Semester {s.semester_number}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={form.subject_id}
            onValueChange={(val) => setForm((f) => ({ ...f, subject_id: val }))}
            disabled={!form.semester_id && !form.id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Subject select karo" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Report title (e.g. Data Science Training Report)"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />

          <Input
            type="number"
            placeholder="Price (₹)"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            />
            Active (students ko dikhega)
          </label>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Content Template (.docx, placeholders ke saath) {form.id && "— chhod do agar badalna nahi"}
            </label>
            <Input type="file" accept=".docx" onChange={(e) => setDocxFile(e.target.files?.[0] || null)} />
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Preview PDF (optional, students dekhenge)
            </label>
            <Input type="file" accept="application/pdf" onChange={(e) => setPreviewFile(e.target.files?.[0] || null)} />
          </div>
        </div>

        {form.id && (
          <p className="text-xs text-gray-400">
            Edit mode mein subject dropdown chain reset hai — subject badalna ho to
            Degree se dubara select karo, warna current subject wahi rahega.
          </p>
        )}

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {form.id ? "Update Template" : "Add Template"}
          </Button>
          {form.id && (
            <Button type="button" variant="outline" onClick={resetForm}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.map((t) => (
              <TableRow key={t.id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.subject_name}</TableCell>
                <TableCell>₹{t.price}</TableCell>
                <TableCell>{t.is_active ? "Yes" : "No"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(t)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(t.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
            {templates.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Koi template nahi hai abhi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}