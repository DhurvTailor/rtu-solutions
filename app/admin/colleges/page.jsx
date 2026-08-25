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

const emptyForm = {
  id: null,
  university_id: "",
  name: "",
  city: "",
  logo_blob_name: null,
};

export default function CollegesPage() {
  const [colleges, setColleges] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadData() {
    setLoading(true);
    try {
      const [collegesRes, uniRes] = await Promise.all([
        fetch("/api/admin/colleges"),
        fetch("/api/admin/universities"),
      ]);
      setColleges(await collegesRes.json());
      setUniversities(await uniRes.json());
    } catch (e) {
      setError("Data load nahi ho paaya");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  async function uploadLogoIfNeeded() {
    if (!logoFile) return form.logo_blob_name;

    const urlRes = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: logoFile.name,
        contentType: logoFile.type || "image/webp",
      }),
    });
    const urlData = await urlRes.json();
    if (!urlData.success) throw new Error(urlData.error || "Upload URL nahi mila");

    const putRes = await fetch(urlData.uploadUrl, {
      method: "PUT",
      headers: {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": logoFile.type || "image/webp",
      },
      body: logoFile,
    });
    if (!putRes.ok) throw new Error("Azure par logo upload fail hua");

    return urlData.blobName;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.university_id || !form.name.trim()) {
      setError("University aur Name required hain");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const newLogoBlobName = await uploadLogoIfNeeded();

      const payload = {
        university_id: form.university_id,
        name: form.name.trim(),
        city: form.city.trim() || null,
        logo_blob_name: newLogoBlobName,
      };

      let res;
      if (form.id) {
        payload.old_logo_blob_name =
          logoFile && form.logo_blob_name ? form.logo_blob_name : null;
        res = await fetch(`/api/admin/colleges/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/colleges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Save fail hua");

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setForm(emptyForm);
    setLogoFile(null);
    setLogoPreview(null);
  }

  function handleEdit(college) {
    setForm({
      id: college.id,
      university_id: String(college.university_id),
      name: college.name,
      city: college.city || "",
      logo_blob_name: college.logo_blob_name,
    });
    setLogoFile(null);
    setLogoPreview(college.logo_url || null);
  }

  async function handleDelete(id) {
    if (!confirm("Ye college delete karna hai? Logo bhi Azure se hat jayega.")) return;
    try {
      const res = await fetch(`/api/admin/colleges/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Delete fail hua");
      await loadData();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-4">Colleges</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8 border rounded-lg p-4">
        <div className="grid grid-cols-2 gap-3">
          <Select
            value={form.university_id}
            onValueChange={(val) => setForm((f) => ({ ...f, university_id: val }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="University select karo" />
            </SelectTrigger>
            <SelectContent>
              {universities.map((uni) => (
                <SelectItem key={uni.id} value={String(uni.id)}>
                  {uni.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="College ka naam"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />

          <Input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />

          <div className="flex items-center gap-3">
            <Input type="file" accept="image/*" onChange={handleLogoChange} />
            {logoPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="Logo preview" className="h-10 w-10 object-contain rounded border" />
            )}
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {form.id ? "Update College" : "Add College"}
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
              <TableHead>Logo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>University</TableHead>
              <TableHead>City</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {colleges.map((college) => (
              <TableRow key={college.id}>
                <TableCell>
                  {college.logo_blob_name ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={college.logo_url}
                      alt={college.name}
                      className="h-8 w-8 object-contain rounded border"
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No logo</span>
                  )}
                </TableCell>
                <TableCell>{college.name}</TableCell>
                <TableCell>{college.university_name}</TableCell>
                <TableCell>{college.city || "-"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(college)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(college.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {colleges.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500">
                  Koi college nahi hai abhi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}