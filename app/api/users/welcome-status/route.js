import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";

// Ye check karta hai ki user genuinely naya hai ya nahi:
// - Koi paid purchase nahi
// - Koi download history nahi
// Dono zero hone par hi "isNew: true" return hoga
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ isNew: false }, { status: 401 });
    }

    const userId = session.user.id;

    // Purchases check
    const [[{ purchaseCount }]] = await db.query(
      "SELECT COUNT(*) AS purchaseCount FROM purchases WHERE user_id = ? AND payment_status = 'paid'",
      [userId]
    );

    // Download history check
    const [[{ downloadCount }]] = await db.query(
      "SELECT COUNT(*) AS downloadCount FROM download_history WHERE user_id = ?",
      [userId]
    );

    const isNew = purchaseCount === 0 && downloadCount === 0;

    return Response.json({
      isNew,
      freeLimit: 2,
      userId,
    });
  } catch (error) {
    console.error("welcome-status error:", error);
    return Response.json({ isNew: false }, { status: 500 });
  }
}