

import {
  getSolutions,
  addSolution,
  updateSolution,
  deleteSolution,
  getSolutionsBySubject,
  getSolutionById,
} from "@/services/solutionService";
import { deleteBlob } from "@/lib/azureBlob";

// GET
// FIX: "id" param add kiya — checkout page single solution fetch
// karne ke liye isi ka use karta hai. Pehle is param ko handle hi
// nahi kiya jaata tha, isliye hamesha poori list return hoti thi.
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const subjectId = searchParams.get("subject_id");
    const id = searchParams.get("id");

    let data;
    if (id) {
      data = await getSolutionById(id);
    } else if (subjectId) {
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
      body.is_premium,
      body.price
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
// export async function PUT(request) {
//   try {
//     const body = await request.json();
//     await updateSolution(
//       body.id,
//       body.subject_id,
//       body.title,
//       body.solution_type,
//       body.pdf_url,
//       body.description,
//       body.is_premium,
//       body.price
//     );
//     return Response.json({
//       success: true,
//       message: "Solution Updated Successfully",
//     });
//   } catch (error) {
//     return Response.json(
//       { message: error.message },
//       { status: 500 }
//     );
//   }
// }

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
      body.preview_blob_name ?? null // ← NEW
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
// FIX: Pehle sirf MySQL row delete hoti thi, Azure blob kabhi delete
// nahi hota tha. Ab pehle solution dhoondh ke uska blobName (pdf_url)
// nikalte hain, Azure se delete karte hain, phir DB row delete karte hain.
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return Response.json(
        { message: "Solution id chahiye" },
        { status: 400 }
      );
    }

    const solution = await getSolutionById(id);
    if (!solution) {
      return Response.json(
        { message: "Solution nahi mila" },
        { status: 404 }
      );
    }

    // Pehle Azure se PDF delete karo
    if (solution.pdf_url) {
      try {
        await deleteBlob(solution.pdf_url);
      } catch (blobError) {
        console.error("Azure blob delete failed:", blobError);
        // Blob delete fail hua to bhi DB row delete kar denge taaki
        // admin panel mein bekar entry na atki rahe — warning console
        // mein log ho jaayegi taaki baad mein manually check kar sako.
      }
    }

    await deleteSolution(id);

    return Response.json({
      success: true,
      message: "Solution aur uski PDF dono delete ho gayi",
    });
  } catch (error) {
    return Response.json(
      { message: error.message },
      { status: 500 }
    );
  }
}




