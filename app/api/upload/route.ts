


// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { addSolution, updateSolution } from "@/services/solutionService";

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session || (session.user as any).role !== "admin") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   try {
//     const body = await req.json();
//     const {
//       blobName,
//       previewBlobName = null, // ← NEW
//       subject_id: subjectId,
//       solution_type: solutionType,
//       price,
//       title,
//       description = "",
//       is_premium: isPremium = "0",
//       update_id: updateId = null,
//     } = body;

//     if (!blobName || !subjectId || !solutionType || !price || !title) {
//       return NextResponse.json(
//         { error: "Subject, Title, Type, Price aur PDF (blobName) sab chahiye" },
//         { status: 400 }
//       );
//     }

//     if (updateId) {
//       await updateSolution(
//         parseInt(updateId),
//         subjectId,
//         title,
//         solutionType,
//         blobName,
//         description,
//         parseInt(isPremium),
//         parseInt(price),
//         previewBlobName
//       );
//     } else {
//       await addSolution(
//         subjectId,
//         title,
//         solutionType,
//         blobName,
//         description,
//         parseInt(isPremium),
//         parseInt(price),
//         previewBlobName
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: updateId ? "Solution update ho gaya!" : "Solution add ho gaya!",
//       blobName,
//     });
//   } catch (error) {
//     console.error("upload (metadata save) error:", error);
//     return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
//   }
// }







import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { addSolution, updateSolution } from "@/services/solutionService";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      blobName,
      previewBlobName = null,
      thumbnailBlobName = null,   // ← NEW
      subject_id: subjectId,
      solution_type: solutionType,
      price,
      title,
      description = "",
      is_premium: isPremium = "0",
      update_id: updateId = null,
    } = body;

    if (!blobName || !subjectId || !solutionType || !price || !title) {
      return NextResponse.json(
        { error: "Subject, Title, Type, Price aur PDF sab chahiye" },
        { status: 400 }
      );
    }

    if (updateId) {
      await updateSolution(
        parseInt(updateId),
        subjectId,
        title,
        solutionType,
        blobName,
        description,
        parseInt(isPremium),
        parseInt(price),
        previewBlobName,
        thumbnailBlobName   // ← NEW
      );
    } else {
      await addSolution(
        subjectId,
        title,
        solutionType,
        blobName,
        description,
        parseInt(isPremium),
        parseInt(price),
        previewBlobName,
        thumbnailBlobName   // ← NEW
      );
    }

    return NextResponse.json({
      success: true,
      message: updateId ? "Solution update ho gaya!" : "Solution add ho gaya!",
      blobName,
    });
  } catch (error) {
    console.error("upload error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}