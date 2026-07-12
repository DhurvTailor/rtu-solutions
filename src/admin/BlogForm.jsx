"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const CATEGORIES = [
  "Exam Updates",
  "Syllabus Guide",
  "Study Tips",
  "Placement",
  "General",
];

export default function BlogForm({ editingBlog, onSuccess, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [authorName, setAuthorName] = useState("RTU Solutions Team");
  const [category, setCategory] = useState("General");
  const [isPublished, setIsPublished] = useState(false);

  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverBlobName, setCoverBlobName] = useState(null); // naya uploaded blob
  const [oldCoverBlobName, setOldCoverBlobName] = useState(null); // purana (edit case)

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const textareaRef = useRef(null);

  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title || "");
      setDescription(editingBlog.description || "");
      setContent(editingBlog.content || "");
      setAuthorName(editingBlog.author_name || "RTU Solutions Team");
      setCategory(editingBlog.category || "General");
      setIsPublished(!!editingBlog.is_published);
      setOldCoverBlobName(editingBlog.cover_blob_name || null);
      if (editingBlog.cover_blob_name) {
        setCoverPreview(`/api/blogs/thumbnail?blob=${editingBlog.cover_blob_name}`);
      }
    }
  }, [editingBlog]);

  // ── Cover image select karte hi local preview dikhao ──
  function handleCoverSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  // ── Cover image ko Azure pe seedha upload karo (SAS URL flow) ──
  async function uploadCoverIfNeeded() {
    if (!coverFile) return coverBlobName || oldCoverBlobName || null;

    setUploading(true);
    try {
      const res = await fetch("/api/blogs/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: coverFile.name,
          contentType: coverFile.type || "image/webp",
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Upload URL fail hui");

      const uploadRes = await fetch(data.uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": coverFile.type || "image/webp",
        },
        body: coverFile,
      });

      if (!uploadRes.ok) throw new Error("Azure upload fail hua");

      setCoverBlobName(data.blobName);
      return data.blobName;
    } finally {
      setUploading(false);
    }
  }

  // ── Toolbar: selected text ko HTML tag se wrap karo ──
  function wrapSelection(before, after = before) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = content.substring(start, end) || "text";
    const newContent =
      content.substring(0, start) + before + selected + after + content.substring(end);
    setContent(newContent);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + selected.length;
    }, 0);
  }

  function insertAtCursor(snippet) {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const newContent = content.substring(0, start) + snippet + content.substring(start);
    setContent(newContent);
    setTimeout(() => {
      ta.focus();
      ta.selectionStart = ta.selectionEnd = start + snippet.length;
    }, 0);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !content.trim()) {
      setError("Title, description aur content zaroori hain");
      return;
    }

    setSaving(true);
    try {
      const finalCoverBlobName = await uploadCoverIfNeeded();

      const payload = {
        title,
        description,
        content,
        cover_blob_name: finalCoverBlobName,
        author_name: authorName,
        category,
        is_published: isPublished,
      };

      let res;
      if (editingBlog) {
        res = await fetch("/api/blogs", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editingBlog.id,
            ...payload,
            old_cover_blob_name:
              oldCoverBlobName && oldCoverBlobName !== finalCoverBlobName
                ? oldCoverBlobName
                : null,
          }),
        });
      } else {
        res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!data.success) throw new Error(data.message || "Save fail hua");

      onSuccess?.();
    } catch (err) {
      setError(err.message || "Kuch galat ho gaya");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-muted">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          {editingBlog ? "Blog Edit Karo" : "Naya Blog Likho"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2 rounded-md border border-red-200">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-sm font-medium mb-1 block">Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. RTU B.Tech 3rd Semester Exam Date Sheet 2026"
              required
            />
          </div>

          {/* Meta description */}
          <div>
            <label className="text-sm font-medium mb-1 block">
              Meta Description * <span className="text-muted-foreground">(Google search snippet)</span>
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="150-160 characters mein blog ka summary"
              maxLength={500}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">{description.length}/160 recommended</p>
          </div>

          {/* Category + Author */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category chuno" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Author Name</label>
              <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
            </div>
          </div>

          {/* Cover image */}
          <div>
            <label className="text-sm font-medium mb-1 block">Cover Image</label>
            <div className="flex items-center gap-4">
              {coverPreview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-32 h-20 object-cover rounded-md border"
                />
              )}
              <Input type="file" accept="image/*" onChange={handleCoverSelect} className="max-w-xs" />
            </div>
            {uploading && <p className="text-xs text-blue-600 mt-1">Image upload ho rahi hai...</p>}
          </div>

          {/* Content editor with toolbar */}
          <div>
            <label className="text-sm font-medium mb-1 block">Content *</label>
            <div className="flex flex-wrap gap-1 mb-2 border rounded-md p-1.5 bg-muted/40">
              <ToolbarBtn onClick={() => wrapSelection("<strong>", "</strong>")} label="B" bold />
              <ToolbarBtn onClick={() => wrapSelection("<em>", "</em>")} label="I" italic />
              <ToolbarBtn onClick={() => wrapSelection("<h2>", "</h2>")} label="H2" />
              <ToolbarBtn onClick={() => wrapSelection("<h3>", "</h3>")} label="H3" />
              <ToolbarBtn onClick={() => wrapSelection("<p>", "</p>")} label="P" />
              <ToolbarBtn
                onClick={() => insertAtCursor("<ul>\n  <li>Point 1</li>\n  <li>Point 2</li>\n</ul>\n")}
                label="List"
              />
              <ToolbarBtn
                onClick={() => wrapSelection('<a href="https://" target="_blank">', "</a>")}
                label="Link"
              />
              <ToolbarBtn
                onClick={() => insertAtCursor('<img src="" alt="" class="rounded-lg my-4" />\n')}
                label="Img"
              />
            </div>
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={14}
              placeholder="<p>Apna blog content yahan likho. Toolbar se HTML tags select karke wrap kar sakte ho.</p>"
              className="w-full border rounded-md p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/40"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Content HTML format mein save hota hai — toolbar buttons use karo formatting ke liye.
            </p>
          </div>

          {/* Publish toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_published"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="h-4 w-4"
            />
            <label htmlFor="is_published" className="text-sm font-medium">
              Publish karo (live karo website par)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={saving || uploading}>
              {saving ? "Save ho raha hai..." : editingBlog ? "Update Karo" : "Blog Banao"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

function ToolbarBtn({ onClick, label, bold, italic }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 text-xs rounded border bg-background hover:bg-muted transition-colors ${
        bold ? "font-bold" : ""
      } ${italic ? "italic" : ""}`}
    >
      {label}
    </button>
  );
}