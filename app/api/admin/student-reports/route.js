import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAllStudentReportsAdmin } from "@/services/studentReportService";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reports = await getAllStudentReportsAdmin();
    return NextResponse.json(reports);
  } catch (error) {
    console.error("admin student-reports list error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}