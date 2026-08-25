import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { createStudentReport, getMyStudentReports } from "@/services/studentReportService";
import { getReportTemplateById } from "@/services/reportTemplateService";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Login karo pehle" }, { status: 401 });
  return NextResponse.json(await getMyStudentReports(session.user.id));
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Login karo pehle" }, { status: 401 });

  try {
    const body = await req.json();
    const {
      content_template_id, college_id, training_company_id,
      branch_id, degree_id, semester_id, academic_session,
      student_name, roll_no, guide_name, hod_name,
      training_start_date, training_end_date,
    } = body;

    const required = {
      content_template_id, college_id, training_company_id, branch_id, degree_id, semester_id,
      academic_session, student_name, roll_no, guide_name, hod_name, training_start_date, training_end_date,
    };
    for (const [key, value] of Object.entries(required)) {
      if (!value) return NextResponse.json({ error: `${key} required hai` }, { status: 400 });
    }

    // Price HAMESHA DB se — client se kabhi accept mat karna
    const template = await getReportTemplateById(content_template_id);
    if (!template || !template.is_active) {
      return NextResponse.json({ error: "Report template available nahi hai" }, { status: 404 });
    }

    const insertId = await createStudentReport({
      user_id: session.user.id,
      content_template_id, college_id, training_company_id,
      branch_id, degree_id, semester_id, academic_session,
      student_name, roll_no, guide_name, hod_name,
      training_start_date, training_end_date,
      amount_paid: template.price,
    });

    return NextResponse.json({ success: true, id: insertId, amount: template.price });
  } catch (error) {
    console.error("student-report create error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}