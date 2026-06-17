
import {
  getSolutions,
  addSolution,
  updateSolution,
  deleteSolution,
  getSolutionsBySubject,
} from "@/services/solutionService";

// GET
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    const subjectId = searchParams.get("subject_id");

    let data;

    if (subjectId) {
      data = await getSolutionsBySubject(subjectId);
    } else {
      data = await getSolutions();
    }

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
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
      body.is_premium
    );

    return Response.json({
      success: true,
      message: "Solution Added Successfully",
    });
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
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
      body.is_premium
    );

    return Response.json({
      success: true,
      message: "Solution Updated Successfully",
    });
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");

    await deleteSolution(id);

    return Response.json({
      success: true,
      message: "Solution Deleted Successfully",
    });
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}