"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/src/components/ui/table";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function loadUniversities() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/universities");
      const data = await res.json();
      setUniversities(data);
    } catch (e) {
      setError("Universities load nahi ho payi");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUniversities();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError("");
    try {
      const url = editingId
        ? `/api/admin/universities/${editingId}`
        : "/api/admin/universities";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Save fail hua");

      setName("");
      setEditingId(null);
      await loadUniversities();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(uni) {
    setEditingId(uni.id);
    setName(uni.name);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setName("");
  }

  async function handleDelete(id) {
    if (!confirm("Ye university delete karni hai? Agar iske colleges linked hain to fail ho sakta hai.")) return;
    try {
      const res = await fetch(`/api/admin/universities/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Delete fail hua");
      await loadUniversities();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-4">Universities</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <Input
          placeholder="University ka naam"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={saving}>
          {editingId ? "Update" : "Add"}
        </Button>
        {editingId && (
          <Button type="button" variant="outline" onClick={handleCancelEdit}>
            Cancel
          </Button>
        )}
      </form>

      {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {universities.map((uni) => (
              <TableRow key={uni.id}>
                <TableCell>{uni.id}</TableCell>
                <TableCell>{uni.name}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(uni)}>
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(uni.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {universities.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  Koi university nahi hai abhi
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}