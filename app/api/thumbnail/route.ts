import { NextRequest, NextResponse } from "next/server";
import { getThumbnailURL } from "@/lib/azureBlob";
import { getSolutionById } from "@/services/solutionService";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Solution id chahiye" },
        { status: 400 }
      );
    }

    const solution = await getSolutionById(id);

    if (!solution || !solution.thumbnail_blob_name) {
      return NextResponse.json(
        { error: "Thumbnail nahi mili" },
        { status: 404 }
      );
    }

    const url = await getThumbnailURL(solution.thumbnail_blob_name);

    // Redirect karo taaki <img src> directly kaam kare
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Thumbnail error:", error);
    return NextResponse.json(
      { error: "Thumbnail load nahi ho paya" },
      { status: 500 }
    );
  }
}