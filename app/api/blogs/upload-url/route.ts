import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/authOptions";
import { generateBlobName, getUploadSasUrl } from "../../../../lib/azureBlob";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const fileName = body.fileName as string;
    const contentType: string = body.contentType || "image/webp";

    if (!fileName) {
      return NextResponse.json({ error: "fileName chahiye" }, { status: 400 });
    }

    // Blog cover images alag prefix se identify honge (thumbnail proxy mein kaam aayega)
    const blobName = `blog-cover-${generateBlobName(fileName)}`;
    const uploadUrl = await getUploadSasUrl(blobName, contentType);

    return NextResponse.json({ success: true, blobName, uploadUrl });
  } catch (error) {
    console.error("blog upload-url error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}