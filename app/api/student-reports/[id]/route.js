// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { getStudentReportById, deleteUnpaidStudentReport } from "@/services/studentReportService";

// export async function GET(req, { params }) {
//   const session = await getServerSession(authOptions);
//   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const report = await getStudentReportById(params.id);
//   if (!report || report.user_id !== session.user.id) {
//     return NextResponse.json({ error: "Report nahi mila" }, { status: 404 });
//   }
//   return NextResponse.json(report);
// }

// export async function DELETE(req, { params }) {
//   const session = await getServerSession(authOptions);
//   if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   try {
//     const result = await deleteUnpaidStudentReport(params.id, session.user.id);
//     if (result.affectedRows === 0) {
//       return NextResponse.json({ error: "Delete nahi ho saka — ya paid hai ya aapka nahi hai" }, { status: 400 });
//     }
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getStudentReportById, deleteUnpaidStudentReport } from "@/services/studentReportService";

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const report = await getStudentReportById(params.id);
  if (!report || report.user_id !== session.user.id) {
    return NextResponse.json({ error: "Report nahi mila" }, { status: 404 });
  }
  return NextResponse.json(report);
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await deleteUnpaidStudentReport(params.id, session.user.id);
    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Delete nahi ho saka — ya paid hai ya aapka nahi hai" }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}