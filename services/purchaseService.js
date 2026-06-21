import db from "@/lib/db";

// Payment shuru hote hi ek "pending" row daal do (ya agar pehle se hai
// to use update kar do — UNIQUE KEY (user_id, solution_id) isliye hi
// hai taaki ek user-solution combo ka ek hi row rahe, dobara try karne
// par naya row na bane).
export async function createPendingPurchase(userId, solutionId, amountRupees, razorpayOrderId) {
  const [result] = await db.query(
    `
    INSERT INTO purchases (user_id, solution_id, amount_paid, payment_status, razorpay_order_id)
    VALUES (?, ?, ?, 'pending', ?)
    ON DUPLICATE KEY UPDATE
      amount_paid = VALUES(amount_paid),
      payment_status = 'pending',
      razorpay_order_id = VALUES(razorpay_order_id),
      payment_id = NULL,
      razorpay_signature = NULL
    `,
    [userId, solutionId, amountRupees, razorpayOrderId]
  );
  return result;
}

export async function getPurchaseByRazorpayOrderId(razorpayOrderId) {
  const [rows] = await db.query(
    "SELECT * FROM purchases WHERE razorpay_order_id = ? LIMIT 1",
    [razorpayOrderId]
  );
  return rows[0];
}

export async function markPurchasePaid(razorpayOrderId, paymentId, signature) {
  const [result] = await db.query(
    `
    UPDATE purchases
    SET payment_status = 'paid', payment_id = ?, razorpay_signature = ?
    WHERE razorpay_order_id = ?
    `,
    [paymentId, signature, razorpayOrderId]
  );
  return result;
}

// Download route isi se check karega ki user ne paisa diya hai ya nahi
export async function hasUserPurchased(userId, solutionId) {
  const [rows] = await db.query(
    `
    SELECT id FROM purchases
    WHERE user_id = ? AND solution_id = ? AND payment_status = 'paid'
    LIMIT 1
    `,
    [userId, solutionId]
  );
  return rows.length > 0;
}