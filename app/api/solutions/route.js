


// app/api/solutions/route.js

import {
  getSolutions,
  addSolution,
  updateSolution,
  deleteSolution,
  getSolutionsBySubject,
  getSolutionById,
  searchSolutions,
} from "../../../services/solutionService";
import { deleteBlob } from "../../../lib/azureBlob";

// GET — handles: ?id=, ?subject_id=, ?q= (search), or all solutions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id        = searchParams.get("id");
    const subjectId = searchParams.get("subject_id");
    const query     = searchParams.get("q");

    let data;

    if (query !== null) {
      // Search mode
      if (query.trim().length < 2) {
        return Response.json([]);
      }
      data = await searchSolutions(query);
    } else if (id) {
      data = await getSolutionById(id);
    } else if (subjectId) {
      data = await getSolutionsBySubject(subjectId);
    } else {
      data = await getSolutions();
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// POST
export async function POST(request) {
  try {
    const body = await request.json();
    await addSolution(
      body.subject_id,
      body.title,
      body.solution_type,
      body.pdf_url,
      body.description,
      body.is_premium,
      body.price
    );
    return Response.json({ success: true, message: "Solution Added Successfully" });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// PUT
export async function PUT(request) {
  try {
    const body = await request.json();
    await updateSolution(
      body.id,
      body.subject_id,
      body.title,
      body.solution_type,
      body.pdf_url,
      body.description,
      body.is_premium,
      body.price,
      body.preview_blob_name  ?? null,
      body.thumbnail_blob_name ?? null,
      body.youtube_url        ?? null
    );
    return Response.json({ success: true, message: "Solution Updated Successfully" });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ message: "Solution id required" }, { status: 400 });
    }

    const solution = await getSolutionById(id);
    if (!solution) {
      return Response.json({ message: "Solution not found" }, { status: 404 });
    }

    if (solution.pdf_url) {
      try { await deleteBlob(solution.pdf_url); }
      catch (e) { console.error("PDF blob delete failed:", e); }
    }
    if (solution.preview_blob_name) {
      try { await deleteBlob(solution.preview_blob_name); }
      catch (e) { console.error("Preview blob delete failed:", e); }
    }
    if (solution.thumbnail_blob_name) {
      try { await deleteBlob(solution.thumbnail_blob_name); }
      catch (e) { console.error("Thumbnail blob delete failed:", e); }
    }

    await deleteSolution(id);

    return Response.json({
      success: true,
      message: "Solution and all associated files deleted successfully",
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}