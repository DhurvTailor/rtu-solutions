import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Razorpay from "razorpay";
import { getStudentReportById, attachRazorpayOrder } from "@/services/studentReportService";

function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) throw new Error("Razorpay keys .env mein missing hain");
  return new Razorpay({ key_id, key_secret });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Login karo pehle" }, { status: 401 });

  try {
    const { student_report_id } = await req.json();
    if (!student_report_id) {
      return NextResponse.json({ error: "student_report_id chahiye" }, { status: 400 });
    }

    const report = await getStudentReportById(student_report_id);
    if (!report) return NextResponse.json({ error: "Report nahi mila" }, { status: 404 });

    const userId = (session.user as any).id;
    if (report.user_id !== userId) {
      return NextResponse.json({ error: "Ye report aapka nahi hai" }, { status: 403 });
    }
    if (report.payment_status === "paid") {
      return NextResponse.json({ error: "Ye report pehle se paid hai" }, { status: 400 });
    }

    const priceRupees = parseFloat(report.amount_paid);
    if (!priceRupees || isNaN(priceRupees) || priceRupees <= 0) {
      return NextResponse.json({ success: false, error: "Report ka price invalid hai" }, { status: 400 });
    }

    const amountInPaise = Math.round(priceRupees * 100);
    if (amountInPaise < 100) {
      return NextResponse.json({ success: false, error: "Amount kam se kam ₹1 hona chahiye" }, { status: 400 });
    }

    const razorpayOrder = await getRazorpayClient().orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rpt_${student_report_id}_${Date.now()}`,
    });

    await attachRazorpayOrder(student_report_id, razorpayOrder.id);

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      keyId: process.env.RAZORPAY_KEY_ID,
      title: report.template_title,
    });
  } catch (error: any) {
    console.error("report create-order error:", error);
    const message = error?.error?.description || error?.message || String(error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}