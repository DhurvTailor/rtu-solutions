// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { getStudentReportByIdAdmin } from "@/services/studentReportService";
// import { generateStudentReportDocx } from "@/lib/reportGenerator";

// export async function POST(req, { params }) {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "admin") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const report = await getStudentReportByIdAdmin(params.id);
//     if (!report) {
//       return NextResponse.json({ error: "Report nahi mila" }, { status: 404 });
//     }
//     if (report.payment_status !== "paid") {
//       return NextResponse.json(
//         { error: "Ye report paid nahi hai, generation retry nahi ho sakta" },
//         { status: 400 }
//       );
//     }

//     await generateStudentReportDocx(report.id);
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error("retry generation error:", error);
//     return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
//   }
// }




import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getStudentReportByIdAdmin } from "@/services/studentReportService";
import { generateStudentReportDocx } from "@/lib/reportGenerator";

export async function POST(req, context) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Next.js 15 mein params ab Promise hai — await karna zaroori hai,
    // warna id hamesha undefined milega aur DB query kabhi match nahi karegi
    const { id } = await context.params;

    const report = await getStudentReportByIdAdmin(id);
    if (!report) {
      return NextResponse.json({ error: "Report nahi mila" }, { status: 404 });
    }
    if (report.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Ye report paid nahi hai, generation retry nahi ho sakta" },
        { status: 400 }
      );
    }

    await generateStudentReportDocx(report.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("retry generation error:", error);
    return NextResponse.json({ success: false, error: String(error?.message || error) }, { status: 500 });
  }
}