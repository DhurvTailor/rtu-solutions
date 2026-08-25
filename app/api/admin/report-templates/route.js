import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { addReportTemplate, updateReportTemplate, getReportTemplates } from "@/services/reportTemplateService";
import { deleteBlob } from "@/lib/azureBlob";

export async function GET() {
  return NextResponse.json(await getReportTemplates());
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const {
      subject_id, title, content_blob_name, preview_blob_name = null,
      price, is_active = 1, update_id = null,
      old_content_blob_name = null, old_preview_blob_name = null,
    } = body;

    if (!subject_id || !title || !content_blob_name || price === undefined) {
      return NextResponse.json(
        { error: "Subject, Title, Content docx aur Price required hai" },
        { status: 400 }
      );
    }

    if (update_id) {
      await updateReportTemplate(update_id, subject_id, title, content_blob_name, preview_blob_name, price, is_active);
      if (old_content_blob_name && old_content_blob_name !== content_blob_name) {
        try { await deleteBlob(old_content_blob_name); } catch (e) { console.error(e); }
      }
      if (old_preview_blob_name && old_preview_blob_name !== preview_blob_name) {
        try { await deleteBlob(old_preview_blob_name); } catch (e) { console.error(e); }
      }
    } else {
      await addReportTemplate(subject_id, title, content_blob_name, preview_blob_name, price, is_active);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}