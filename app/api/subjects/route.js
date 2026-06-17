import {
  getSubjects,
  addSubject,
  updateSubject,
  deleteSubject,
} from "@/services/subjectService";

// GET
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const semester_id = searchParams.get("semester_id");

    const data = await getSubjects(semester_id);
    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(request) {
  try {
    const body = await request.json();
    const semester_id = body.semester_id;
    const name = body.name?.trim();
    if (!semester_id || !name) {
      return Response.json(
        { message: "Semester and Subject Name required" },
        { status: 400 }
      );
    }
    await addSubject(semester_id, name);
    return Response.json({
      success: true,
      message: "Subject Added Successfully",
    });
  } catch (error) {
    console.log(error);
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
    await updateSubject(body.id, body.semester_id, body.name);
    return Response.json({
      success: true,
      message: "Subject Updated Successfully",
    });
  } catch (error) {
    console.log(error);
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
    await deleteSubject(id);
    return Response.json({
      success: true,
      message: "Subject Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}