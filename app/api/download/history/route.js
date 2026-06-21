import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getDownloadHistoryForUser } from "@/services/downloadHistoryService";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return Response.json({ error: "Login karo pehle" }, { status: 401 });
  }
  try {
    const data = await getDownloadHistoryForUser(session.user.id);
    return Response.json(data);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}