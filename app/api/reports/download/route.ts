import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getStudentReportById } from "@/services/studentReportService";
import { getSecureDownloadURL } from "@/lib/azureBlob";
import { generateStudentReportDocx } from "@/lib/reportGenerator";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Report ID chahiye" }, { status: 400 });

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.redirect(new URL("/login", req.url));
    const userId = (session.user as any).id;

    const report = await getStudentReportById(id);
    if (!report) return NextResponse.json({ error: "Report nahi mila" }, { status: 404 });
    if (report.user_id !== userId) {
      return NextResponse.json({ error: "Ye report aapka nahi hai" }, { status: 403 });
    }
    if (report.payment_status !== "paid") {
      return NextResponse.json({ error: "Pehle payment complete karo" }, { status: 403 });
    }

    // Generation kisi wajah se pending/failed hai to yahin retry
    if (report.generation_status !== "done" || !report.generated_report_blob_name) {
      try {
        await generateStudentReportDocx(report.id);
      } catch (e) {
        return NextResponse.json({ error: "Report abhi taiyaar nahi hai, thodi der baad try karo" }, { status: 409 });
      }
    }

    const fresh = await getStudentReportById(id);
    if (!fresh?.generated_report_blob_name) {
      return NextResponse.json({ error: "Report file nahi mili" }, { status: 404 });
    }

    const downloadFileName = `${fresh.student_name || "training-report"}.docx`;
    const sasUrl = await getSecureDownloadURL(fresh.generated_report_blob_name, downloadFileName);
    return NextResponse.redirect(sasUrl);
  } catch (error) {
    console.error("report download error:", error);
    return NextResponse.json({ error: "Download link generate nahi ho paaya" }, { status: 500 });
  }
}