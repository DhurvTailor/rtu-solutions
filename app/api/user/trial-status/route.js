import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";

const FREE_TRIAL_LIMIT = 2;

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ trialsUsed: 0, trialsLeft: 0, isFree: false });
    }

    const userId = session.user.id;

    const [[{ count }]] = await db.query(
      "SELECT COUNT(*) AS count FROM download_history WHERE user_id = ? AND was_trial = 1",
      [userId]
    );

    const trialsUsed = Number(count);
    const trialsLeft = Math.max(0, FREE_TRIAL_LIMIT - trialsUsed);

    return Response.json({
      trialsUsed,
      trialsLeft,
      freeLimit: FREE_TRIAL_LIMIT,
      isFree: trialsLeft > 0,
    });
  } catch (error) {
    console.error("trial-status error:", error);
    return Response.json({ trialsUsed: 0, trialsLeft: 0, isFree: false });
  }
}