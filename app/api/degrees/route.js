
import {
  getDegrees,
  addDegree,
  updateDegree,
  deleteDegree,
} from "@/services/degreeService";
import { getCached, setCache, clearCache } from "@/lib/cache";   // 🆕 NEW LINE

//GET
export async function GET() {
  try {
    const cached = getCached("degrees");                          // 🆕 NEW
    if (cached) return Response.json(cached);                     // 🆕 NEW

    const degrees = await getDegrees();

    setCache("degrees", degrees, 86400);                          // 🆕 NEW (24hr)
    return Response.json(degrees);
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "Failed to fetch degrees" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(request) {
  try {
    const body = await request.json();
    const name = body.name?.trim();

    if (!name) {
      return Response.json(
        { message: "Degree name is required" },
        { status: 400 }
      );
    }

    await addDegree(name);
    clearCache("degrees");                                        // 🆕 NEW — purana cache hatao

    return Response.json({
      success: true,
      message: "Degree added successfully",
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// PUT
export async function PUT(request) {
  try {
    const body = await request.json();
    const id = body.id;
    const name = body.name?.trim();

    if (!id || !name) {
      return Response.json(
        { message: "Id and Name required" },
        { status: 400 }
      );
    }

    await updateDegree(id, name);
    clearCache("degrees");                                        // 🆕 NEW

    return Response.json({
      success: true,
      message: "Degree updated successfully",
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json({ message: "Id is required" }, { status: 400 });
    }

    await deleteDegree(id);
    clearCache("degrees");                                        // 🆕 NEW

    return Response.json({
      success: true,
      message: "Degree deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// import {
//   getDegrees,
//   addDegree,
//   updateDegree,
//   deleteDegree,
// } from "@/services/degreeService";

//  //GET
// export async function GET() {
//   try {
//     const degrees = await getDegrees();

//     return Response.json(degrees);
//   } catch (error) {
//     console.log(error);

//     return Response.json(
//       { message: "Failed to fetch degrees" },
//       { status: 500 }
//     );
//   }
// }


 


// // POST
// export async function POST(request) {
//   try {
//     const body = await request.json();

//     const name = body.name?.trim();

//     if (!name) {
//       return Response.json(
//         { message: "Degree name is required" },
//         { status: 400 }
//       );
//     }

//     await addDegree(name);

//     return Response.json({
//       success: true,
//       message: "Degree added successfully",
//     });
//   } catch (error) {
//     console.log(error);

//     return Response.json(
//       { message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // PUT
// export async function PUT(request) {
//   try {
//     const body = await request.json();

//     const id = body.id;
//     const name = body.name?.trim();

//     if (!id || !name) {
//       return Response.json(
//         { message: "Id and Name required" },
//         { status: 400 }
//       );
//     }

//     await updateDegree(id, name);

//     return Response.json({
//       success: true,
//       message: "Degree updated successfully",
//     });
//   } catch (error) {
//     console.log(error);

//     return Response.json(
//       { message: error.message },
//       { status: 500 }
//     );
//   }
// }

// // DELETE
// export async function DELETE(request) {
//   try {
//     const { searchParams } = new URL(request.url);

//     const id = searchParams.get("id");

//     if (!id) {
//       return Response.json(
//         { message: "Id is required" },
//         { status: 400 }
//       );
//     }

//     await deleteDegree(id);

//     return Response.json({
//       success: true,
//       message: "Degree deleted successfully",
//     });
//   } catch (error) {
//     console.log(error);

//     return Response.json(
//       { message: error.message },
//       { status: 500 }
//     );
//   }
// }