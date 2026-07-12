"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import BlogForm from "@/admin/BlogForm";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  async function fetchBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Blogs fetch error:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  function handleAddNew() {
    setEditingBlog(null);
    setShowForm(true);
  }

  function handleEdit(blog) {
    setEditingBlog(blog);
    setShowForm(true);
  }

  function handleFormSuccess() {
    setShowForm(false);
    setEditingBlog(null);
    fetchBlogs();
  }

  async function handleDelete(id) {
    if (!confirm("Pakka is blog ko delete karna hai? Ye undo nahi ho sakta.")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/blogs?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      fetchBlogs();
    } catch (e) {
      alert("Delete fail hua: " + e.message);
    } finally {
      setDeletingId(null);
    }
  }

  if (showForm) {
    return (
      <div className="p-6">
        <BlogForm
          editingBlog={editingBlog}
          onSuccess={handleFormSuccess}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Button onClick={handleAddNew}>+ Naya Blog</Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : blogs.length === 0 ? (
        <p className="text-muted-foreground">Abhi tak koi blog nahi hai.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell className="font-medium max-w-xs truncate">{blog.title}</TableCell>
                  <TableCell>{blog.category || "—"}</TableCell>
                  <TableCell>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        blog.is_published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {blog.is_published ? "Published" : "Draft"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {blog.created_at ? new Date(blog.created_at).toLocaleDateString("en-IN") : "—"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === blog.id}
                      onClick={() => handleDelete(blog.id)}
                    >
                      {deletingId === blog.id ? "..." : "Delete"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}