import {
  getSemesters,
  addSemester,
  deleteSemester,
  updateSemester,
  getSemestersByBranch,
} from "@/services/semesterService";
import { getCached, setCache, clearCache } from "@/lib/cache";   // 🆕 NEW LINE

// GET
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const branchId = searchParams.get("branch_id");

    const cacheKey = branchId ? `semesters-${branchId}` : "semesters-all";  // 🆕 NEW
    const cached = getCached(cacheKey);                                     // 🆕 NEW
    if (cached) return Response.json(cached);                               // 🆕 NEW

    let data;

    if (branchId) {
      data = await getSemestersByBranch(branchId);
    } else {
      data = await getSemesters();
    }

    setCache(cacheKey, data, 86400);                                        // 🆕 NEW

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Failed to fetch semesters" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(request) {
  try {
    const body = await request.json();
    const branch_id = body.branch_id;
    const semester_number = body.semester_number;

    if (!branch_id || !semester_number) {
      return Response.json(
        { message: "Branch and Semester are required" },
        { status: 400 }
      );
    }

    await addSemester(branch_id, semester_number);
    clearCache(`semesters-${branch_id}`);   // 🆕 NEW
    clearCache("semesters-all");             // 🆕 NEW

    return Response.json({
      success: true,
      message: "Semester Added Successfully",
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

    await updateSemester(body.id, body.branch_id, body.semester_number);
    clearCache(`semesters-${body.branch_id}`);   // 🆕 NEW
    clearCache("semesters-all");                  // 🆕 NEW

    return Response.json({
      success: true,
      message: "Semester Updated Successfully",
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

    await deleteSemester(id);
    clearCache("semesters-all");   // 🆕 NEW — simple approach (branch)

    return Response.json({
      success: true,
      message: "Semester Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}


// import {
//   getSemesters,
//   addSemester,
//   deleteSemester,
//   updateSemester,
//   getSemestersByBranch,
// } from "@/services/semesterService";

// // GET
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);

//     const branchId = searchParams.get("branch_id");

//     let data;

//     if (branchId) {
//       data = await getSemestersByBranch(branchId);
//     } else {
//       data = await getSemesters();
//     }

//     return Response.json(data);
//   } catch (error) {
//     console.log(error);

//     return Response.json(
//       { message: "Failed to fetch semesters" },
//       { status: 500 }
//     );
//   }
// }

// // POST
// export async function POST(request) {
//   try {
//     const body = await request.json();

//     const branch_id = body.branch_id;
//     const semester_number =
//       body.semester_number;

//     if (
//       !branch_id ||
//       !semester_number
//     ) {
//       return Response.json(
//         {
//           message:
//             "Branch and Semester are required",
//         },
//         { status: 400 }
//       );
//     }

//     await addSemester(
//       branch_id,
//       semester_number
//     );

//     return Response.json({
//       success: true,
//       message:
//         "Semester Added Successfully",
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

//     await updateSemester(
//       body.id,
//       body.branch_id,
//       body.semester_number
//     );

//     return Response.json({
//       success: true,
//       message:
//         "Semester Updated Successfully",
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
//     const { searchParams } =
//       new URL(request.url);

//     const id =
//       searchParams.get("id");

//     await deleteSemester(id);

//     return Response.json({
//       success: true,
//       message:
//         "Semester Deleted Successfully",
//     });
//   } catch (error) {
//     console.log(error);

//     return Response.json(
//       { message: error.message },
//       { status: 500 }
//     );
//   }
// }