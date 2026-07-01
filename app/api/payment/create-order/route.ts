import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Razorpay from "razorpay";
import { getSolutionById } from "@/services/solutionService";
import { createPendingPurchase } from "@/services/purchaseService";

function getRazorpayClient() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  if (!key_id || !key_secret) {
    throw new Error(
      "RAZORPAY_KEY_ID ya RAZORPAY_KEY_SECRET .env mein missing hai."
    );
  }
  return new Razorpay({ key_id, key_secret });
}

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

    if (!priceRupees || isNaN(priceRupees) || priceRupees <= 0) {
      console.error("create-order: invalid price from DB ->", solution.price);
      return NextResponse.json(
        { success: false, error: "Solution ka price invalid hai (DB check karo)" },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(priceRupees * 100);

    // Razorpay minimum amount check (1 INR = 100 paise)
    if (amountInPaise < 100) {
      return NextResponse.json(
        { success: false, error: "Amount kam se kam ₹1 hona chahiye" },
        { status: 400 }
      );
    }

    const razorpayOrder = await getRazorpayClient().orders.create({
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
  } catch (error: any) {
    console.error("create-order error (raw):", error);

    // Razorpay SDK apna error object alag shape mein bhejta hai:
    // { statusCode: 400, error: { code: "...", description: "..." } }
    const message =
      error?.error?.description || // Razorpay ka format
      error?.message ||             // normal JS Error
      (typeof error === "string" ? error : JSON.stringify(error)); // fallback

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import Razorpay from "razorpay";
// import { getSolutionById } from "@/services/solutionService";
// import { createPendingPurchase } from "@/services/purchaseService";

// function getRazorpayClient() {
//   const key_id = process.env.RAZORPAY_KEY_ID;
//   const key_secret = process.env.RAZORPAY_KEY_SECRET;
//   if (!key_id || !key_secret) {
//     throw new Error(
//       "RAZORPAY_KEY_ID ya RAZORPAY_KEY_SECRET .env mein missing hai."
//     );
//   }
//   return new Razorpay({ key_id, key_secret });
// }

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ error: "Login karo pehle" }, { status: 401 });
//   }

//   try {
//     const { solution_id } = await req.json();
//     if (!solution_id) {
//       return NextResponse.json({ error: "solution_id chahiye" }, { status: 400 });
//     }

//     const solution = await getSolutionById(solution_id);
//     if (!solution) {
//       return NextResponse.json({ error: "Solution nahi mila" }, { status: 404 });
//     }
//     if (!solution.is_premium) {
//       return NextResponse.json({ error: "Ye free solution hai, payment ki zaroorat nahi" }, { status: 400 });
//     }

//     // Price HAMESHA DB se — client se kabhi accept mat karna
//     const priceRupees = parseFloat(solution.price);
//     const amountInPaise = Math.round(priceRupees * 100);

//     const razorpayOrder = await getRazorpayClient().orders.create({
//       amount: amountInPaise,
//       currency: "INR",
//       receipt: `sol_${solution_id}_${Date.now()}`,
//     });

//     const userId = (session.user as any).id;
//     await createPendingPurchase(userId, solution_id, priceRupees, razorpayOrder.id);

//     return NextResponse.json({
//       success: true,
//       orderId: razorpayOrder.id,
//       amount: amountInPaise,
//       keyId: process.env.RAZORPAY_KEY_ID, // public key, expose karna safe hai
//       title: solution.title,
//     });
//   } catch (error) {
//     console.error("create-order error:", error);
//     return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
//   }
// }