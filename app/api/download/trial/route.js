import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";

const FREE_TRIAL_LIMIT = 2;

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ success: false, error: "Login required" }, { status: 401 });
    }

    const { solution_id } = await req.json();
    if (!solution_id) {
      return Response.json({ success: false, error: "Solution ID missing" });
    }

    const userId = session.user.id;

    // Check kitne trials use hue
    const [[{ count }]] = await db.query(
      "SELECT COUNT(*) AS count FROM download_history WHERE user_id = ? AND was_trial = 1",
      [userId]
    );

    const trialsUsed = Number(count);
    if (trialsUsed >= FREE_TRIAL_LIMIT) {
      return Response.json({ success: false, error: "No free trials remaining" });
    }

    // Record trial download
    await db.query(
      `INSERT IGNORE INTO download_history (user_id, solution_id, was_trial) VALUES (?, ?, 1)`,
      [userId, solution_id]
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("trial download error:", error);
    return Response.json({ success: false, error: "Server error" });
  }
}