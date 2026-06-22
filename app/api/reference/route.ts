import { ApiReference } from "@scalar/nextjs-api-reference";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

// ── SECURITY: Ye page sirf admin dekh sakta hai ──
// Public access = hacker ko poora API map de dena — kabhi mat karo
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return NextResponse.json(
      { error: "Unauthorized — sirf admin access kar sakta hai" },
      { status: 401 }
    );
  }

  return ApiReference({
    url: "/openapi.json",
    theme: "purple",
  })(req);
}