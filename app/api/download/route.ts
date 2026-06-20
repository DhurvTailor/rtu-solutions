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

    // NOTE: solution.pdf_url yahan blobName hai (poora URL nahi),
    // isliye seedha getSecureDownloadURL ko pass kar rahe hain.
    // Dusra argument filename hai — isse browser file ko save karte
    // waqt solution ka title use karega, blobName ka random naam nahi.
    // TODO (baad mein add karna): Agar solution.is_premium === 1 hai,
    // to yahan check karo ki logged-in user ne purchases table mein
    // is solution_id ke against payment_status = 'paid' kiya hai ya nahi.
    // Abhi ke liye sab downloads free hain.
    const downloadFileName = `${solution.title || "solution"}.pdf`;
    const sasUrl = await getSecureDownloadURL(solution.pdf_url, downloadFileName);

    return NextResponse.redirect(sasUrl);
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Download link generate nahi ho paaya", details: String(error) },
      { status: 500 }
    );
  }
}