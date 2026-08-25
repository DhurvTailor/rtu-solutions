import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getStudentReportByIdAdmin } from "@/services/studentReportService";
import { getSecureDownloadURL } from "@/lib/azureBlob";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const report = await getStudentReportByIdAdmin(params.id);
    if (!report) {
      return NextResponse.json({ error: "Report nahi mila" }, { status: 404 });
    }
    if (!report.generated_report_blob_name) {
      return NextResponse.json({ error: "Generated file abhi taiyaar nahi hai" }, { status: 404 });
    }

    const downloadFileName = `${report.student_name || "training-report"}.docx`;
    const sasUrl = await getSecureDownloadURL(report.generated_report_blob_name, downloadFileName);
    return NextResponse.redirect(sasUrl);
  } catch (error) {
    console.error("admin report download error:", error);
    return NextResponse.json({ error: "Download link generate nahi ho paaya" }, { status: 500 });
  }
}