import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getTrialCount, FREE_TRIAL_LIMIT } from "@/lib/trialService";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ trialsUsed: 0, trialsLeft: 0, isFree: false });
    }

    const trialsUsed = await getTrialCount(session.user.id);
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