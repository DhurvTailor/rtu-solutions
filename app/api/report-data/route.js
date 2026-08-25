// import { NextResponse } from "next/server";
// import { getColleges, getTrainingCompanies } from "@/services/masterDataService";
// import { getActiveReportTemplates } from "@/services/reportTemplateService";
// import { getThumbnailURL } from "@/lib/azureBlob";
// import db from "@/lib/db";

// export async function GET() {
//   try {
//     const [colleges, trainingCompanies, templates] = await Promise.all([
//       getColleges(),
//       getTrainingCompanies(),
//       getActiveReportTemplates(),
//     ]);

//     const collegesWithLogo = await Promise.all(
//       colleges.map(async (c) => ({
//         ...c,
//         logo_url: c.logo_blob_name ? await getThumbnailURL(c.logo_blob_name) : null,
//       }))
//     );

//     const [branches] = await db.query(`
//       SELECT branch.*, degrees.name AS degree_name
//       FROM branch JOIN degrees ON branch.degree_id = degrees.id
//       ORDER BY branch.name
//     `);
//     const [semesters] = await db.query("SELECT * FROM semesters ORDER BY semester_number");
//     const [degrees] = await db.query("SELECT * FROM degrees ORDER BY name");

//     return NextResponse.json({ colleges: collegesWithLogo, trainingCompanies, templates, branches, semesters, degrees });
//   } catch (error) {
//     console.error("report-data error:", error);
//     return NextResponse.json({ error: String(error) }, { status: 500 });
//   }
// }




import { NextResponse } from "next/server";
import { getColleges, getTrainingCompanies } from "@/services/masterDataService";
import { getActiveReportTemplates } from "@/services/reportTemplateService";
import { getThumbnailURL } from "@/lib/azureBlob";
import db from "@/lib/db";

export async function GET() {
  try {
    const [colleges, trainingCompanies, templates] = await Promise.all([
      getColleges(),
      getTrainingCompanies(),
      getActiveReportTemplates(),
    ]);

    const collegesWithLogo = await Promise.all(
      colleges.map(async (c) => ({
        ...c,
        logo_url: c.logo_blob_name ? await getThumbnailURL(c.logo_blob_name) : null,
      }))
    );

    const [branches] = await db.query(`
      SELECT branch.*, degrees.name AS degree_name
      FROM branch JOIN degrees ON branch.degree_id = degrees.id
      ORDER BY branch.name
    `);
    const [semesters] = await db.query("SELECT * FROM semesters ORDER BY semester_number");
    const [degrees] = await db.query("SELECT * FROM degrees ORDER BY name");

    return NextResponse.json({ colleges: collegesWithLogo, trainingCompanies, templates, branches, semesters, degrees });
  } catch (error) {
    console.error("report-data error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}