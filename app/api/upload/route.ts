


// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { uploadPDFToAzure } from "@/lib/azureBlob";
// import { addSolution, updateSolution } from "@/services/solutionService";

// export async function POST(req: NextRequest) {
//   console.log("=== UPLOAD API HIT ===");

//   // ── Auth check ──
//   const session = await getServerSession(authOptions);
//   console.log("Session:", JSON.stringify(session?.user));

//   if (!session || (session.user as any).role !== "admin") {
//     console.log("UNAUTHORIZED — role:", (session?.user as any)?.role);
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     console.log("ENV CHECK:", {
//       connection: process.env.AZURE_STORAGE_CONNECTION_STRING ? "SET ✅" : "MISSING ❌",
//       container: process.env.AZURE_STORAGE_CONTAINER_NAME || "MISSING ❌",
//     });

//     const formData = await req.formData();

//     const file         = formData.get("pdf") as File;
//     const subjectId    = formData.get("subject_id") as string;
//     const solutionType = formData.get("solution_type") as string;
//     const price        = formData.get("price") as string;
//     const title        = formData.get("title") as string;
//     const description  = (formData.get("description") as string) || "";
//     const isPremium    = (formData.get("is_premium") as string) || "0";
//     const updateId     = (formData.get("update_id") as string) || null;

//     console.log("FormData received:", {
//       file: file ? `${file.name} (${file.size} bytes, ${file.type})` : "NULL ❌",
//       subjectId, solutionType, price, title, updateId,
//     });

//     // Validation
//     if (!file || !subjectId || !solutionType || !price || !title) {
//       return NextResponse.json(
//         { error: "Subject, Title, Type, Price aur PDF sab chahiye" },
//         { status: 400 }
//       );
//     }

//     if (file.type !== "application/pdf") {
//       return NextResponse.json({ error: "Sirf PDF file allowed hai" }, { status: 400 });
//     }

//     if (file.size > 50 * 1024 * 1024) {
//       return NextResponse.json({ error: "PDF 50MB se badi nahi honi chahiye" }, { status: 400 });
//     }

//     console.log("Starting Azure upload...");
//     const bytes  = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     const blobName = await uploadPDFToAzure(buffer, file.name);
//     console.log("Azure upload done. blobName:", blobName);

//     if (updateId) {
//       await updateSolution(
//         parseInt(updateId), subjectId, title, solutionType,
//         blobName, description, parseInt(isPremium), parseInt(price)
//       );
//     } else {
//       await addSolution(
//         subjectId, title, solutionType,
//         blobName, description, parseInt(isPremium), parseInt(price)
//       );
//     }

//     console.log("MySQL save done ✅");

//     return NextResponse.json({
//       success: true,
//       message: updateId ? "Solution update ho gaya!" : "Solution add ho gaya!",
//       blobName,
//     });

//   } catch (error) {
//   console.error(error);

//   return NextResponse.json(
//     {
//       success: false,
//       error: String(error),
//     },
//     { status: 500 }
//   );
// }
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
        { error: "Subject, Title, Type, Price aur PDF (blobName) sab chahiye" },
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
        parseInt(price)
      );
    } else {
      await addSolution(
        subjectId,
        title,
        solutionType,
        blobName,
        description,
        parseInt(isPremium),
        parseInt(price)
      );
    }
    return NextResponse.json({
      success: true,
      message: updateId ? "Solution update ho gaya!" : "Solution add ho gaya!",
      blobName,
    });
  } catch (error) {
    console.error("upload (metadata save) error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}