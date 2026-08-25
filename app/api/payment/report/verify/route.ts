import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import crypto from "crypto";
import { getStudentReportByRazorpayOrderId, markStudentReportPaid } from "@/services/studentReportService";
import { generateStudentReportDocx } from "@/lib/reportGenerator";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Payment details missing" }, { status: 400 });
    }
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({ success: false, error: "Server config error" }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Signature mismatch — fake payment attempt" }, { status: 400 });
    }

    const report = await getStudentReportByRazorpayOrderId(razorpay_order_id);
    if (!report) return NextResponse.json({ success: false, error: "Order nahi mila" }, { status: 404 });

    const userId = (session.user as any).id;
    if (report.user_id !== userId) {
      return NextResponse.json({ success: false, error: "Unauthorized order" }, { status: 403 });
    }

    await markStudentReportPaid(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    // Payment confirm hote hi turant personalized docx generate karo
    try {
      await generateStudentReportDocx(report.id);
    } catch (genError) {
      // Payment ho chuka hai — generation fail hone par bhi success bolna hai,
      // generation_status 'failed' rahega, download route par retry ho jayega
      console.error("Post-payment generation failed:", genError);
    }

    return NextResponse.json({ success: true, studentReportId: report.id });
  } catch (error: any) {
    console.error("report verify error:", error);
    const message = error?.error?.description || error?.message || String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}