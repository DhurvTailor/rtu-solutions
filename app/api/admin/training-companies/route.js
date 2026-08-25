import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getTrainingCompanies, addTrainingCompany } from "@/services/masterDataService";

export async function GET() {
  return NextResponse.json(await getTrainingCompanies());
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Name chahiye" }, { status: 400 });
    const result = await addTrainingCompany(name);
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}