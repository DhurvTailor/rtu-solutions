import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { deleteTrainingCompany, getTrainingCompanyById } from "@/services/masterDataService";
import { deleteBlob } from "@/lib/azureBlob";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const company = await getTrainingCompanyById(params.id);
    await deleteTrainingCompany(params.id);
    if (company?.certificate_template_blob_name) {
      try { await deleteBlob(company.certificate_template_blob_name); } catch (e) { console.error(e); }
    }
    if (company?.certificate_preview_blob_name) {
      try { await deleteBlob(company.certificate_preview_blob_name); } catch (e) { console.error(e); }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}