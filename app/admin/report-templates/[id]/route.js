import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getReportTemplateById, deleteReportTemplate } from "@/services/reportTemplateService";
import { deleteBlob } from "@/lib/azureBlob";

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const template = await getReportTemplateById(params.id);
    await deleteReportTemplate(params.id);
    if (template?.content_blob_name) {
      try { await deleteBlob(template.content_blob_name); } catch (e) { console.error(e); }
    }
    if (template?.preview_blob_name) {
      try { await deleteBlob(template.preview_blob_name); } catch (e) { console.error(e); }
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}