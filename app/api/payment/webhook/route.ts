import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Signature missing" }, { status: 400 });
    }

    // Webhook signature verify karo
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (expectedSignature !== signature) {
      console.error("Webhook signature mismatch");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(rawBody);

    // Sirf payment.captured event handle karo
    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const razorpay_order_id = payment.order_id;
      const razorpay_payment_id = payment.id;

      // Purchase dhundo
      const [rows]: any = await db.query(
        "SELECT * FROM purchases WHERE razorpay_order_id = ?",
        [razorpay_order_id]
      );

      if (rows.length === 0) {
        console.error("Webhook: Purchase nahi mila for order", razorpay_order_id);
        return NextResponse.json({ received: true });
      }

      const purchase = rows[0];

      // Agar already paid hai toh skip karo
      if (purchase.payment_status === "paid") {
        return NextResponse.json({ received: true });
      }

      // Payment status paid karo
      await db.query(
        `UPDATE purchases 
         SET payment_status = 'paid', 
             payment_id = ?,
             razorpay_signature = 'webhook_captured'
         WHERE razorpay_order_id = ?`,
        [razorpay_payment_id, razorpay_order_id]
      );

      console.log(`✅ Webhook: Purchase paid - order ${razorpay_order_id}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}