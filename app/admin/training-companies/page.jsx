// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/src/components/ui/button";
// import { Input } from "@/src/components/ui/input";
// import {
//   Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
// } from "@/src/components/ui/table";

// export default function TrainingCompaniesPage() {
//   const [companies, setCompanies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [name, setName] = useState("");
//   const [editingId, setEditingId] = useState(null);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState("");

//   async function loadCompanies() {
//     setLoading(true);
//     try {
//       const res = await fetch("/api/admin/training-companies");
//       setCompanies(await res.json());
//     } catch (e) {
//       setError("Companies load nahi ho payi");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadCompanies();
//   }, []);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     if (!name.trim()) return;
//     setSaving(true);
//     setError("");
//     try {
//       const url = editingId
//         ? `/api/admin/training-companies/${editingId}`
//         : "/api/admin/training-companies";
//       const method = editingId ? "PUT" : "POST";
//       const res = await fetch(url, {
//         method,
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ name: name.trim() }),
//       });
//       const data = await res.json();
//       if (!data.success) throw new Error(data.error || "Save fail hua");

//       setName("");
//       setEditingId(null);
//       await loadCompanies();
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setSaving(false);
//     }
//   }

//   function handleEdit(company) {
//     setEditingId(company.id);
//     setName(company.name);
//   }

//   async function handleDelete(id) {
//     if (!confirm("Ye training company delete karni hai?")) return;
//     try {
//       const res = await fetch(`/api/admin/training-companies/${id}`, { method: "DELETE" });
//       const data = await res.json();
//       if (!data.success) throw new Error(data.error || "Delete fail hua");
//       await loadCompanies();
//     } catch (err) {
//       alert(err.message);
//     }
//   }

//   return (
//     <div className="p-6 max-w-3xl">
//       <h1 className="text-2xl font-semibold mb-4">Training Companies</h1>

//       <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
//         <Input
//           placeholder="Company ka naam"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="flex-1"
//         />
//         <Button type="submit" disabled={saving}>
//           {editingId ? "Update" : "Add"}
//         </Button>
//         {editingId && (
//           <Button type="button" variant="outline" onClick={() => { setEditingId(null); setName(""); }}>
//             Cancel
//           </Button>
//         )}
//       </form>

//       {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>ID</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {companies.map((company) => (
//               <TableRow key={company.id}>
//                 <TableCell>{company.id}</TableCell>
//                 <TableCell>{company.name}</TableCell>
//                 <TableCell className="text-right space-x-2">
//                   <Button size="sm" variant="outline" onClick={() => handleEdit(company)}>
//                     Edit
//                   </Button>
//                   <Button size="sm" variant="destructive" onClick={() => handleDelete(company.id)}>
//                     Delete
//                   </Button>
//                 </TableCell>
//               </TableRow>
//             ))}
//             {companies.length === 0 && (
//               <TableRow>
//                 <TableCell colSpan={3} className="text-center text-gray-500">
//                   Koi training company nahi hai abhi
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       )}
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table";

const DOCX_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const emptyForm = {
  id: null,
  name: "",
  description: "",
  certificate_template_blob_name: null,
  certificate_preview_blob_name: null,
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

export default function TrainingCompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [certFile, setCertFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadCompanies() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/training-companies");
      setCompanies(await res.json());
    } catch (e) {
      setError("Companies load nahi ho payi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCompanies();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setCertFile(null);
    setPreviewFile(null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name required hai");
      return;
    }
    setSaving(true);
    setError("");
    try {
      let certificate_template_blob_name = form.certificate_template_blob_name;
      let certificate_preview_blob_name = form.certificate_preview_blob_name;

      if (certFile) {
        certificate_template_blob_name = await uploadToAzure(certFile, DOCX_TYPE);
      }
      if (previewFile) {
        certificate_preview_blob_name = await uploadToAzure(previewFile, "application/pdf");
      }

      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        certificate_template_blob_name,
        certificate_preview_blob_name,
        update_id: form.id,
        old_certificate_template_blob_name: certFile ? form.certificate_template_blob_name : null,
        old_certificate_preview_blob_name: previewFile ? form.certificate_preview_blob_name : null,
      };

      const res = await fetch("/api/admin/training-companies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Save fail hua");

      resetForm();
      await loadCompanies();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(company) {
    setForm({
      id: company.id,
      name: company.name,
      description: company.description || "",
      certificate_template_blob_name: company.certificate_template_blob_name,
      certificate_preview_blob_name: company.certificate_preview_blob_name,
    });
    setCertFile(null);
    setPreviewFile(null);
  }

  async function handleDelete(id) {
    if (!confirm("Ye training company delete karni hai? Certificate template bhi Azure se hat jayega.")) return;
    try {
      const res = await fetch(`/api/admin/training-companies/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Delete fail hua");
      await loadCompanies();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-4">Training Companies</h1>

      <form onSubmit={handleSubmit} className="space-y-3 mb-8 border rounded-lg p-4">
        <Input
          placeholder="Company ka naam (e.g. Teachnook)"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />

        <textarea
          placeholder="Company description (students ko dikhega, e.g. 'Teachnook ek EdTech training partner hai jo...')"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-gray-400 min-h-[90px] text-sm"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Certificate Template (.docx, placeholders ke saath) {form.id && "— chhod do agar badalna nahi"}
            </label>
            <Input
              type="file"
              accept=".docx"
              onChange={(e) => setCertFile(e.target.files?.[0] || null)}
            />
            {form.certificate_template_blob_name && !certFile && (
              <p className="text-xs text-green-600 mt-1">✓ Certificate pehle se upload hai</p>
            )}
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Certificate Preview PDF (optional)
            </label>
            <Input
              type="file"
              accept="application/pdf"
              onChange={(e) => setPreviewFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>
            {form.id ? "Update Company" : "Add Company"}
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
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Certificate</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id}>
                <TableCell>{company.name}</TableCell>
                <TableCell className="max-w-xs truncate text-xs text-gray-500">
                  {company.description || "—"}
                </TableCell>
                <TableCell>
                  {company.certificate_template_blob_name ? (
                    <span className="text-xs text-green-600 font-medium">✓ Uploaded</span>
                  ) : (
                    <span className="text-xs text-red-500">Missing</span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(company)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(company.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {companies.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500">
                  Koi training company nahi hai abhi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}