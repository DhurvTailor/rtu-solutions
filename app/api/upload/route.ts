


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
//       previewBlobName = null,
//       thumbnailBlobName = null,   // ← NEW
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
//         { error: "Subject, Title, Type, Price aur PDF sab chahiye" },
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
//         previewBlobName,
//         thumbnailBlobName   // ← NEW
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
//         previewBlobName,
//         thumbnailBlobName   // ← NEW
//       );
//     }

//     return NextResponse.json({
//       success: true,
//       message: updateId ? "Solution update ho gaya!" : "Solution add ho gaya!",
//       blobName,
//     });
//   } catch (error) {
//     console.error("upload error:", error);
//     return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
//   }
// }





// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { addSolution, updateSolution } from "@/services/solutionService";
// import { deleteBlob } from "@/lib/azureBlob";

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session || (session.user as any).role !== "admin") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   try {
//     const body = await req.json();
//     const {
//       blobName,
//       previewBlobName = null,
//       thumbnailBlobName = null,
//       // ── NEW: purane blob names — cleanup ke liye ──
//       oldBlobName = null,
//       oldPreviewBlobName = null,
//       oldThumbnailBlobName = null,
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
//         { error: "Subject, Title, Type, Price aur PDF sab chahiye" },
//         { status: 400 }
//       );
//     }

//     // ── Pehle DB mein save karo ──
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
//         previewBlobName,
//         thumbnailBlobName
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
//         previewBlobName,
//         thumbnailBlobName
//       );
//     }

//     // ── DB save ke BAAD purane blobs delete karo ──
//     // (pehle nahi — agar save fail ho to purana data safe rahe)
//     // Try-catch alag rakha hai taaki ek blob fail hone par
//     // doosre bhi delete hote rahein aur main response crash na ho

//     if (updateId) {
//       // Purana PDF delete karo (sirf tab jab naya alag blob name aaya ho)
//       if (oldBlobName && oldBlobName !== blobName) {
//         try {
//           await deleteBlob(oldBlobName);
//         } catch (e) {
//           console.error("Old PDF blob delete failed:", e);
//         }
//       }

//       // Purana preview delete karo
//       if (oldPreviewBlobName && oldPreviewBlobName !== previewBlobName) {
//         try {
//           await deleteBlob(oldPreviewBlobName);
//         } catch (e) {
//           console.error("Old preview blob delete failed:", e);
//         }
//       }

//       // Purana thumbnail delete karo
//       if (oldThumbnailBlobName && oldThumbnailBlobName !== thumbnailBlobName) {
//         try {
//           await deleteBlob(oldThumbnailBlobName);
//         } catch (e) {
//           console.error("Old thumbnail blob delete failed:", e);
//         }
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: updateId ? "Solution update ho gaya!" : "Solution add ho gaya!",
//       blobName,
//     });
//   } catch (error) {
//     console.error("upload error:", error);
//     return NextResponse.json(
//       { success: false, error: String(error) },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { addSolution, updateSolution } from "@/services/solutionService";
import { deleteBlob } from "@/lib/azureBlob";

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
      thumbnailBlobName = null,
      youtube_url = null,
      oldBlobName = null,
      oldPreviewBlobName = null,
      oldThumbnailBlobName = null,
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
        { error: "Subject, Title, Type, Price and PDF are all required" },
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
        thumbnailBlobName,
        youtube_url
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
        thumbnailBlobName,
        youtube_url
      );
    }

    // Delete old blobs after DB save succeeds
    if (updateId) {
      if (oldBlobName && oldBlobName !== blobName) {
        try { await deleteBlob(oldBlobName); } catch (e) { console.error("Old PDF delete failed:", e); }
      }
      if (oldPreviewBlobName && oldPreviewBlobName !== previewBlobName) {
        try { await deleteBlob(oldPreviewBlobName); } catch (e) { console.error("Old preview delete failed:", e); }
      }
      if (oldThumbnailBlobName && oldThumbnailBlobName !== thumbnailBlobName) {
        try { await deleteBlob(oldThumbnailBlobName); } catch (e) { console.error("Old thumbnail delete failed:", e); }
      }
    }

    return NextResponse.json({
      success: true,
      message: updateId ? "Solution updated successfully!" : "Solution added successfully!",
      blobName,
    });
  } catch (error) {
    console.error("upload error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}