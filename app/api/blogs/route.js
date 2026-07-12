import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/authOptions";
import {
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  getBlogBySlugAdmin,
  addBlog,
  updateBlog,
  deleteBlog,
} from "../../../services/blogService";
import { deleteBlob } from "../../../lib/azureBlob";

// GET — public: ?slug=xxx (published only) | admin: ?id=xxx or ?admin_slug=xxx or all
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const slug = searchParams.get("slug");
    const adminSlug = searchParams.get("admin_slug");

    let data;
    if (slug) {
      data = await getBlogBySlug(slug); // sirf published
    } else if (adminSlug) {
      data = await getBlogBySlugAdmin(adminSlug); // draft bhi
    } else if (id) {
      data = await getBlogById(id);
    } else {
      const session = await getServerSession(authOptions);
      const isAdmin = session && session.user.role === "admin";
      data = await getAllBlogs(!isAdmin); // admin ko draft bhi dikhein
    }

    if (!data) {
      return Response.json({ message: "Blog not found" }, { status: 404 });
    }
    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// POST — naya blog banao
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, content, cover_blob_name, author_name, category, is_published } = body;

    if (!title || !description || !content) {
      return Response.json(
        { message: "Title, description aur content zaroori hain" },
        { status: 400 }
      );
    }

    const result = await addBlog(
      title,
      description,
      content,
      cover_blob_name || null,
      author_name || "RTU Solutions Team",
      category || null,
      is_published ? 1 : 0
    );

    return Response.json({
      success: true,
      message: "Blog created successfully",
      slug: result.slug,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// PUT — blog update karo
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, title, description, content, cover_blob_name, author_name, category, is_published, old_cover_blob_name } = body;

    if (!id || !title || !description || !content) {
      return Response.json(
        { message: "Id, title, description aur content zaroori hain" },
        { status: 400 }
      );
    }

    const result = await updateBlog(
      id,
      title,
      description,
      content,
      cover_blob_name || null,
      author_name || "RTU Solutions Team",
      category || null,
      is_published ? 1 : 0
    );

    // Purani cover image delete karo agar naya blob upload hua
    if (old_cover_blob_name && old_cover_blob_name !== cover_blob_name) {
      try {
        await deleteBlob(old_cover_blob_name);
      } catch (e) {
        console.error("Old cover blob delete failed:", e);
      }
    }

    return Response.json({
      success: true,
      message: "Blog updated successfully",
      slug: result.slug,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ message: "Blog id required" }, { status: 400 });
    }

    const blog = await getBlogById(id);
    if (!blog) {
      return Response.json({ message: "Blog not found" }, { status: 404 });
    }

    if (blog.cover_blob_name) {
      try {
        await deleteBlob(blog.cover_blob_name);
      } catch (e) {
        console.error("Cover blob delete failed:", e);
      }
    }

    await deleteBlog(id);

    return Response.json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}