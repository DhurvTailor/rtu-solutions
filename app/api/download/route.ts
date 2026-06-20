import { NextRequest, NextResponse } from "next/server";
import { getSolutionById } from "@/services/solutionService";
import { getSecureDownloadURL } from "@/lib/azureBlob";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Solution ID chahiye" },
        { status: 400 }
      );
    }

    const solution = await getSolutionById(id);

    if (!solution) {
      return NextResponse.json(
        { error: "Solution nahi mila" },
        { status: 404 }
      );
    }

    if (!solution.pdf_url) {
      return NextResponse.json(
        { error: "Is solution ke saath koi PDF attach nahi hai" },
        { status: 404 }
      );
    }

    // NOTE: Yahan pe solution.pdf_url woh blobName hai jo upload ke time
    // Azure ne return kiya tha (poora URL nahi), isliye seedha
    // getSecureDownloadURL ko pass kar rahe hain.

    // TODO (baad mein add karna): Agar solution.is_premium === 1 hai,
    // to yahan check karo ki logged-in user ne purchases table mein
    // is solution_id ke against payment_status = 'paid' kiya hai ya nahi.
    // Abhi ke liye sab downloads free hain.

    const sasUrl = await getSecureDownloadURL(solution.pdf_url);

    return NextResponse.redirect(sasUrl);
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Download link generate nahi ho paaya", details: String(error) },
      { status: 500 }
    );
  }
}