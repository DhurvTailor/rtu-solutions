// import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { getTrainingCompanies, addTrainingCompany } from "@/services/masterDataService";

// export async function GET() {
//   return NextResponse.json(await getTrainingCompanies());
// }

// export async function POST(req) {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user.role !== "admin") {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }
//   try {
//     const { name } = await req.json();
//     if (!name) return NextResponse.json({ error: "Name chahiye" }, { status: 400 });
//     const result = await addTrainingCompany(name);
//     return NextResponse.json({ success: true, id: result.insertId });
//   } catch (error) {
//     return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
//   }
// }



import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getTrainingCompanies, addTrainingCompany, updateTrainingCompany } from "@/services/masterDataService";
import { deleteBlob } from "@/lib/azureBlob";

export async function GET() {
  return NextResponse.json(await getTrainingCompanies());
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      name,
      description = null,
      certificate_template_blob_name = null,
      certificate_preview_blob_name = null,
      update_id = null,
      old_certificate_template_blob_name = null,
      old_certificate_preview_blob_name = null,
    } = body;

    if (!name) return NextResponse.json({ error: "Name chahiye" }, { status: 400 });

    if (update_id) {
      await updateTrainingCompany(
        update_id, name, description, certificate_template_blob_name, certificate_preview_blob_name
      );
      if (old_certificate_template_blob_name && old_certificate_template_blob_name !== certificate_template_blob_name) {
        try { await deleteBlob(old_certificate_template_blob_name); } catch (e) { console.error(e); }
      }
      if (old_certificate_preview_blob_name && old_certificate_preview_blob_name !== certificate_preview_blob_name) {
        try { await deleteBlob(old_certificate_preview_blob_name); } catch (e) { console.error(e); }
      }
      return NextResponse.json({ success: true });
    }

    const result = await addTrainingCompany(
      name, description, certificate_template_blob_name, certificate_preview_blob_name
    );
    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}