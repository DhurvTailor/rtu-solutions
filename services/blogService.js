import db from "../lib/db.js";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .trim()
    .replace(/^-|-$/g, "");
}

// Unique slug generate karo (agar same title ho to -2, -3 laga do)
async function generateUniqueSlug(title, excludeId = null) {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 2;

  while (true) {
    const [rows] = await db.query(
      excludeId
        ? "SELECT id FROM blogs WHERE slug = ? AND id != ?"
        : "SELECT id FROM blogs WHERE slug = ?",
      excludeId ? [slug, excludeId] : [slug]
    );
    if (rows.length === 0) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export async function getAllBlogs(onlyPublished = false) {
  const query = onlyPublished
    ? `SELECT * FROM blogs WHERE is_published = 1 ORDER BY published_at DESC`
    : `SELECT * FROM blogs ORDER BY created_at DESC`;
  const [rows] = await db.query(query);
  return rows;
}

export async function getBlogById(id) {
  const numericId = parseInt(id, 10);
  if (isNaN(numericId)) return null;
  const [rows] = await db.query("SELECT * FROM blogs WHERE id = ?", [numericId]);
  return rows[0] || null;
}

export async function getBlogBySlug(slug) {
  const [rows] = await db.query(
    "SELECT * FROM blogs WHERE slug = ? AND is_published = 1",
    [slug]
  );
  return rows[0] || null;
}

// Admin preview ke liye — draft bhi dikhe
export async function getBlogBySlugAdmin(slug) {
  const [rows] = await db.query("SELECT * FROM blogs WHERE slug = ?", [slug]);
  return rows[0] || null;
}

export async function getAllPublishedSlugs() {
  const [rows] = await db.query(
    "SELECT slug, updated_at FROM blogs WHERE is_published = 1"
  );
  return rows;
}

export async function addBlog(
  title,
  description,
  content,
  cover_blob_name,
  author_name,
  category,
  is_published
) {
  const slug = await generateUniqueSlug(title);
  const publishedAt = is_published ? new Date() : null;

  const [result] = await db.query(
    `INSERT INTO blogs
     (title, slug, description, content, cover_blob_name, author_name, category, is_published, published_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, description, content, cover_blob_name, author_name, category, is_published ? 1 : 0, publishedAt]
  );
  return { ...result, slug };
}

export async function updateBlog(
  id,
  title,
  description,
  content,
  cover_blob_name,
  author_name,
  category,
  is_published
) {
  const existing = await getBlogById(id);
  if (!existing) throw new Error("Blog not found");

  // Slug sirf tab regenerate karo jab title badla ho
  const slug =
    existing.title !== title
      ? await generateUniqueSlug(title, id)
      : existing.slug;

  // published_at sirf tab set karo jab pehli baar publish ho raha ho
  const publishedAt =
    is_published && !existing.published_at ? new Date() : existing.published_at;

  const [result] = await db.query(
    `UPDATE blogs
     SET title = ?, slug = ?, description = ?, content = ?, cover_blob_name = ?,
         author_name = ?, category = ?, is_published = ?, published_at = ?
     WHERE id = ?`,
    [title, slug, description, content, cover_blob_name, author_name, category, is_published ? 1 : 0, publishedAt, id]
  );
  return { ...result, slug };
}

export async function deleteBlog(id) {
  const [result] = await db.query("DELETE FROM blogs WHERE id = ?", [id]);
  return result;
}