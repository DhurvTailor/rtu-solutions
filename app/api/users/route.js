import {
  getUsers,
  addUser,
  updateUserRole,
  deleteUser,
} from "@/services/userService";

// GET
export async function GET() {
  try {
    const users = await getUsers();

    return Response.json(users);
  } catch (error) {
    console.log(error);

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

    await addUser(
      body.google_id,
      body.name,
      body.email,
      body.img,
      body.role
    );

    return Response.json({
      success: true,
      message: "User Added Successfully",
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

    await updateUserRole(
      body.id,
      body.role
    );

    return Response.json({
      success: true,
      message: "Role Updated Successfully",
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
    const { searchParams } =
      new URL(request.url);

    const id =
      searchParams.get("id");

    await deleteUser(id);

    return Response.json({
      success: true,
      message: "User Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}