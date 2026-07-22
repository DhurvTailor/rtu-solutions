import {
  getBranches,
  addBranch,
  deleteBranch,
  updateBranch,
  getBranchesByDegree,
} from "@/services/branchService";
import { getCached, setCache, clearCache } from "@/lib/cache";   // 🆕 NEW LINE

// GET
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const degreeId = searchParams.get("degree_id");

    const cacheKey = degreeId ? `branches-${degreeId}` : "branches-all";  // 🆕 NEW
    const cached = getCached(cacheKey);                                   // 🆕 NEW
    if (cached) return Response.json(cached);                             // 🆕 NEW

    let data;

    if (degreeId) {
      data = await getBranchesByDegree(degreeId);
    } else {
      data = await getBranches();
    }

    setCache(cacheKey, data, 86400);                                      // 🆕 NEW

    return Response.json(data);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Failed to fetch branches" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(request) {
  try {
    const body = await request.json();
    const degree_id = body.degree_id;
    const name = body.name?.trim();

    if (!degree_id || !name) {
      return Response.json(
        { message: "Degree and Branch Name required" },
        { status: 400 }
      );
    }

    await addBranch(degree_id, name);
    clearCache(`branches-${degree_id}`);   // 🆕 NEW — us degree ka cache saaf
    clearCache("branches-all");            // 🆕 NEW — "all" cache bhi saaf

    return Response.json({
      success: true,
      message: "Branch Added Successfully",
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

    await updateBranch(body.id, body.degree_id, body.name);
    clearCache(`branches-${body.degree_id}`);   // 🆕 NEW
    clearCache("branches-all");                  // 🆕 NEW

    return Response.json({
      success: true,
      message: "Branch Updated Successfully",
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
    const degreeId = searchParams.get("degree_id");   // ⚠️ CHECK — neeche note dekh

    await deleteBranch(id);
    if (degreeId) clearCache(`branches-${degreeId}`);   // 🆕 NEW
    clearCache("branches-all");                          // 🆕 NEW

    return Response.json({
      success: true,
      message: "Branch Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: error.message }, { status: 500 });
  }
}


// import {
//   getBranches ,
//   addBranch,
//   deleteBranch,
//   updateBranch, getBranchesByDegree} from "@/services/branchService";


// // GET
// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url);

//     const degreeId = searchParams.get("degree_id");

//     let data;

//     if (degreeId) {
//       data = await getBranchesByDegree(degreeId);
//     } else {
//       data = await getBranches();
//     }

//     return Response.json(data);
//   } catch (error) {
//     console.log(error);

//     return Response.json(
//       { message: "Failed to fetch branches" },
//       { status: 500 }
//     );
//   }
// }


// // POST
// export async function POST(request) {
//   try {
//     const body = await request.json();

//     const degree_id = body.degree_id;
//     const name = body.name?.trim();

//     if (!degree_id || !name) {
//       return Response.json(
//         {
//           message:
//             "Degree and Branch Name required",
//         },
//         { status: 400 }
//       );
//     }

//     await addBranch(
//       degree_id,
//       name
//     );

//     return Response.json({
//       success: true,
//       message:
//         "Branch Added Successfully",
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

//     await updateBranch(
//       body.id,
//       body.degree_id,
//       body.name
//     );

//     return Response.json({
//       success: true,
//       message:
//         "Branch Updated Successfully",
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

//     await deleteBranch(id);

//     return Response.json({
//       success: true,
//       message:
//         "Branch Deleted Successfully",
//     });
//   } catch (error) {
//     console.log(error);

//     return Response.json(
//       { message: error.message },
//       { status: 500 }
//     );
//   }
// }