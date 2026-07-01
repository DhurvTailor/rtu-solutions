// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import crypto from "crypto";
// import { getPurchaseByRazorpayOrderId, markPurchasePaid } from "@/services/purchaseService";

// export async function POST(req: NextRequest) {
//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
//     if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
//       return NextResponse.json({ error: "Payment details missing" }, { status: 400 });
//     }

//     // ── Asli security check: signature ko apni secret key se verify karo ──
//     const expectedSignature = crypto
//       .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
//       .update(`${razorpay_order_id}|${razorpay_payment_id}`)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       return NextResponse.json(
//         { success: false, error: "Signature mismatch — fake payment attempt" },
//         { status: 400 }
//       );
//     }

//     const purchase = await getPurchaseByRazorpayOrderId(razorpay_order_id);
//     if (!purchase) {
//       return NextResponse.json({ success: false, error: "Order nahi mila" }, { status: 404 });
//     }

//     const userId = (session.user as any).id;
//     if (purchase.user_id !== userId) {
//       return NextResponse.json({ success: false, error: "Unauthorized order" }, { status: 403 });
//     }

//     await markPurchasePaid(razorpay_order_id, razorpay_payment_id, razorpay_signature);

//     return NextResponse.json({ success: true, solutionId: purchase.solution_id });
//   } catch (error) {
//     console.error("verify error:", error);
//     return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
//   }
// }



import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import crypto from "crypto";
import { getPurchaseByRazorpayOrderId, markPurchasePaid } from "@/services/purchaseService";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Payment details missing" }, { status: 400 });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error("verify: RAZORPAY_KEY_SECRET missing in env");
      return NextResponse.json(
        { success: false, error: "Server config error — key secret missing" },
        { status: 500 }
      );
    }

    // ── Asli security check: signature ko apni secret key se verify karo ──
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Signature mismatch — fake payment attempt" },
        { status: 400 }
      );
    }

    const purchase = await getPurchaseByRazorpayOrderId(razorpay_order_id);
    if (!purchase) {
      return NextResponse.json({ success: false, error: "Order nahi mila" }, { status: 404 });
    }

    const userId = (session.user as any).id;
    if (purchase.user_id !== userId) {
      return NextResponse.json({ success: false, error: "Unauthorized order" }, { status: 403 });
    }

    await markPurchasePaid(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    return NextResponse.json({ success: true, solutionId: purchase.solution_id });
  } catch (error: any) {
    console.error("verify error (raw):", error);

    const message =
      error?.error?.description ||
      error?.message ||
      (typeof error === "string" ? error : JSON.stringify(error));

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}