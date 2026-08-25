import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getColleges, addCollege } from "@/services/masterDataService";

export async function GET() {
  return NextResponse.json(await getColleges());
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { university_id, name, logo_blob_name = null, city = null } = await req.json();
    if (!university_id || !name) {
      return NextResponse.json({ error: "University aur Name chahiye" }, { status: 400 });
    }
    const result = await addCollege(university_id, name, logo_blob_name, city);
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}