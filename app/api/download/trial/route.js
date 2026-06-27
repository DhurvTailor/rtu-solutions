import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { hasTrialRemaining, recordTrialDownload } from "@/lib/trialService";

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

    const canDownload = await hasTrialRemaining(session.user.id);
    if (!canDownload) {
      return Response.json({ success: false, error: "No free trials remaining" });
    }

    await recordTrialDownload(session.user.id, solution_id);

    return Response.json({ success: true });
  } catch (error) {
    console.error("trial download error:", error);
    return Response.json({ success: false, error: "Server error" });
  }
}