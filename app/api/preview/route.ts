import { NextRequest, NextResponse } from "next/server";
import { getSolutionById } from "@/services/solutionService";
import { getPreviewURL } from "@/lib/azureBlob";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Solution ID chahiye" }, { status: 400 });
    }

    const solution = await getSolutionById(id);
    if (!solution) {
      return NextResponse.json({ error: "Solution nahi mila" }, { status: 404 });
    }
    if (!solution.preview_blob_name) {
      return NextResponse.json({ error: "Preview is solution ke liye available nahi hai" }, { status: 404 });
    }

    const sasUrl = await getPreviewURL(solution.preview_blob_name);
    return NextResponse.redirect(sasUrl);
  } catch (error) {
    console.error("Preview error:", error);
    return NextResponse.json({ error: "Preview load nahi ho paya" }, { status: 500 });
  }
}