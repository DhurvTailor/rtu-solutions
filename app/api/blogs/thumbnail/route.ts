import { NextRequest, NextResponse } from "next/server";
import { downloadBlobBuffer } from "@/lib/azureBlob";

// Public route — koi auth nahi, kyunki cover images publicly visible honi chahiye (SEO ke liye bhi)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const blobName = searchParams.get("blob");

    if (!blobName) {
      return NextResponse.json({ error: "blob param chahiye" }, { status: 400 });
    }

    const result = await downloadBlobBuffer(blobName);
    if (!result) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return new NextResponse(new Uint8Array(result.buffer), {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Cache-Control": "public, max-age=86400, s-maxage=604800", // 1 din browser, 7 din CDN
      },
    });
  } catch (error) {
    console.error("blog thumbnail error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}