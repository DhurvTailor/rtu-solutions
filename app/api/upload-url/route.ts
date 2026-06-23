// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { generateBlobName, getUploadSasUrl } from "@/lib/azureBlob";

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session || (session.user as any).role !== "admin") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   try {
//     const body = await req.json();
//     const fileName = body.fileName as string;
//     if (!fileName) {
//       return NextResponse.json({ error: "fileName chahiye" }, { status: 400 });
//     }
//     const blobName = generateBlobName(fileName);
//     const uploadUrl = await getUploadSasUrl(blobName);
//     return NextResponse.json({ success: true, blobName, uploadUrl });
//   } catch (error) {
//     console.error("upload-url error:", error);
//     return NextResponse.json(
//       { success: false, error: String(error) },
//       { status: 500 }
//     );
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { generateBlobName, getUploadSasUrl } from "@/lib/azureBlob";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    const fileName = body.fileName as string;
    const contentType: string = body.contentType || "application/pdf"; // ← NEW

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName chahiye" },
        { status: 400 }
      );
    }

    const blobName = generateBlobName(fileName);
    const uploadUrl = await getUploadSasUrl(blobName, contentType); // ← contentType pass karo

    return NextResponse.json({ success: true, blobName, uploadUrl });

  } catch (error) {
    console.error("upload-url error:", error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}