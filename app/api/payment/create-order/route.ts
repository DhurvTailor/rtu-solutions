import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Razorpay from "razorpay";
import { getSolutionById } from "@/services/solutionService";
import { createPendingPurchase } from "@/services/purchaseService";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Login karo pehle" }, { status: 401 });
  }

  try {
    const { solution_id } = await req.json();
    if (!solution_id) {
      return NextResponse.json({ error: "solution_id chahiye" }, { status: 400 });
    }

    const solution = await getSolutionById(solution_id);
    if (!solution) {
      return NextResponse.json({ error: "Solution nahi mila" }, { status: 404 });
    }
    if (!solution.is_premium) {
      return NextResponse.json({ error: "Ye free solution hai, payment ki zaroorat nahi" }, { status: 400 });
    }

    // Price HAMESHA DB se — client se kabhi accept mat karna
    const priceRupees = parseFloat(solution.price);
    const amountInPaise = Math.round(priceRupees * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `sol_${solution_id}_${Date.now()}`,
    });

    const userId = (session.user as any).id;
    await createPendingPurchase(userId, solution_id, priceRupees, razorpayOrder.id);

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      keyId: process.env.RAZORPAY_KEY_ID, // public key, expose karna safe hai
      title: solution.title,
    });
  } catch (error) {
    console.error("create-order error:", error);
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}