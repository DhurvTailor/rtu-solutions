// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";
// import db from "./db.js";
// import { downloadBlobBuffer, uploadBufferToAzure, generateBlobName } from "./azureBlob";

// const DOCX_CONTENT_TYPE =
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// function formatDate(d) {
//   if (!d) return "";
//   return new Date(d).toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }

// // Student report ki poori joined detail nikaalo — jo bhi placeholder
// // docx template mein use karna hai, sab yahan se milega
// async function getReportDataForGeneration(studentReportId) {
//   const [rows] = await db.query(
//     `
//     SELECT
//       sr.*,
//       rct.content_blob_name, rct.title AS template_title,
//       subjects.name AS subject_name,
//       col.name AS college_name,
//       uni.name AS university_name,
//       tc.name AS training_company_name,
//       br.name AS branch_name,
//       deg.name AS degree_name,
//       sem.semester_number
//     FROM student_reports sr
//     JOIN report_content_templates rct ON sr.content_template_id = rct.id
//     JOIN subjects   ON rct.subject_id = subjects.id
//     JOIN colleges col ON sr.college_id = col.id
//     JOIN universities uni ON col.university_id = uni.id
//     JOIN training_companies tc ON sr.training_company_id = tc.id
//     JOIN branch br  ON sr.branch_id = br.id
//     JOIN degrees deg ON sr.degree_id = deg.id
//     JOIN semesters sem ON sr.semester_id = sem.id
//     WHERE sr.id = ?
//     `,
//     [studentReportId]
//   );
//   return rows[0] || null;
// }

// // Template docx mein placeholder tags: {student_name}, {roll_no},
// // {college_name}, {university_name}, {branch_name}, {degree_name},
// // {semester_number}, {academic_session}, {training_company_name},
// // {training_start_date}, {training_end_date}, {guide_name}, {hod_name},
// // {subject_name}, {report_title}
// export async function generateStudentReportDocx(studentReportId) {
//   const report = await getReportDataForGeneration(studentReportId);
//   if (!report) throw new Error("Student report record nahi mila");

//   await db.query(
//     "UPDATE student_reports SET generation_status = 'processing' WHERE id = ?",
//     [studentReportId]
//   );

//   try {
//     const templateFile = await downloadBlobBuffer(report.content_blob_name);
//     if (!templateFile) throw new Error("Template docx Azure par nahi mila");

//     const zip = new PizZip(templateFile.buffer);
//     const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });

//     doc.render({
//       student_name: report.student_name,
//       roll_no: report.roll_no,
//       college_name: report.college_name,
//       university_name: report.university_name,
//       branch_name: report.branch_name,
//       degree_name: report.degree_name,
//       semester_number: report.semester_number,
//       academic_session: report.academic_session,
//       training_company_name: report.training_company_name,
//       training_start_date: formatDate(report.training_start_date),
//       training_end_date: formatDate(report.training_end_date),
//       guide_name: report.guide_name,
//       hod_name: report.hod_name,
//       subject_name: report.subject_name,
//       report_title: report.template_title,
//     });

//     const outBuffer = doc.getZip().generate({ type: "nodebuffer" });
//     const generatedBlobName = generateBlobName(
//       `report-${studentReportId}-${report.roll_no}.docx`
//     );
//     await uploadBufferToAzure(outBuffer, generatedBlobName, DOCX_CONTENT_TYPE);

//     await db.query(
//       "UPDATE student_reports SET generated_report_blob_name = ?, generation_status = 'done' WHERE id = ?",
//       [generatedBlobName, studentReportId]
//     );

//     return generatedBlobName;
//   } catch (err) {
//     console.error("Report generation failed:", err);
//     await db.query(
//       "UPDATE student_reports SET generation_status = 'failed' WHERE id = ?",
//       [studentReportId]
//     );
//     throw err;
//   }
// }




import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import DocxMerger from "docx-merger";
import db from "./db.js";
import { downloadBlobBuffer, uploadBufferToAzure, generateBlobName } from "./azureBlob";

const DOCX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

async function getReportDataForGeneration(studentReportId) {
  const [rows] = await db.query(
    `
    SELECT
      sr.*,
      rct.content_blob_name, rct.title AS template_title,
      subjects.name AS subject_name,
      col.name AS college_name,
      uni.name AS university_name,
      tc.name AS training_company_name,
      tc.certificate_template_blob_name,
      br.name AS branch_name,
      deg.name AS degree_name,
      sem.semester_number
    FROM student_reports sr
    JOIN report_content_templates rct ON sr.content_template_id = rct.id
    JOIN subjects   ON rct.subject_id = subjects.id
    JOIN colleges col ON sr.college_id = col.id
    JOIN universities uni ON col.university_id = uni.id
    JOIN training_companies tc ON sr.training_company_id = tc.id
    JOIN branch br  ON sr.branch_id = br.id
    JOIN degrees deg ON sr.degree_id = deg.id
    JOIN semesters sem ON sr.semester_id = sem.id
    WHERE sr.id = ?
    `,
    [studentReportId]
  );
  return rows[0] || null;
}

function buildPlaceholderData(report) {
  return {
    student_name: report.student_name,
    roll_no: report.roll_no,
    college_name: report.college_name,
    university_name: report.university_name,
    branch_name: report.branch_name,
    degree_name: report.degree_name,
    semester_number: report.semester_number,
    academic_session: report.academic_session,
    training_company_name: report.training_company_name,
    training_start_date: formatDate(report.training_start_date),
    training_end_date: formatDate(report.training_end_date),
    guide_name: report.guide_name,
    hod_name: report.hod_name,
    subject_name: report.subject_name,
    report_title: report.template_title,
  };
}

// Ek docx template buffer ko diye gaye data se fill karo, filled buffer return karo
function renderDocxTemplate(templateBuffer, placeholderData) {
  const zip = new PizZip(templateBuffer);
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true });
  doc.render(placeholderData);
  return doc.getZip().generate({ type: "nodebuffer" });
}

// Do docx buffers ko ek document mein merge karo (report ke baad certificate)
function mergeDocxBuffers(buffers) {
  return new Promise((resolve, reject) => {
    try {
      const merger = new DocxMerger({}, buffers);
      merger.save("nodebuffer", (data) => resolve(data));
    } catch (err) {
      reject(err);
    }
  });
}

// Template docx mein placeholder tags: {student_name}, {roll_no},
// {college_name}, {university_name}, {branch_name}, {degree_name},
// {semester_number}, {academic_session}, {training_company_name},
// {training_start_date}, {training_end_date}, {guide_name}, {hod_name},
// {subject_name}, {report_title}
// Same placeholders company ke certificate template mein bhi kaam karenge.
export async function generateStudentReportDocx(studentReportId) {
  const report = await getReportDataForGeneration(studentReportId);
  if (!report) throw new Error("Student report record nahi mila");

  await db.query(
    "UPDATE student_reports SET generation_status = 'processing' WHERE id = ?",
    [studentReportId]
  );

  try {
    const placeholderData = buildPlaceholderData(report);

    // 1. Report content template fill karo
    const reportTemplateFile = await downloadBlobBuffer(report.content_blob_name);
    if (!reportTemplateFile) throw new Error("Report content template Azure par nahi mila");
    const filledReportBuffer = renderDocxTemplate(reportTemplateFile.buffer, placeholderData);

    let finalBuffer = filledReportBuffer;

    // 2. Agar is training company ka certificate template hai, use bhi fill karke merge karo
    if (report.certificate_template_blob_name) {
      const certTemplateFile = await downloadBlobBuffer(report.certificate_template_blob_name);
      if (certTemplateFile) {
        const filledCertBuffer = renderDocxTemplate(certTemplateFile.buffer, placeholderData);
        finalBuffer = await mergeDocxBuffers([filledReportBuffer, filledCertBuffer]);
      } else {
        console.warn(
          `Company certificate blob missing for student_report ${studentReportId}, sirf report bhejenge`
        );
      }
    }

    const generatedBlobName = generateBlobName(
      `report-${studentReportId}-${report.roll_no}.docx`
    );
    await uploadBufferToAzure(finalBuffer, generatedBlobName, DOCX_CONTENT_TYPE);

    await db.query(
      "UPDATE student_reports SET generated_report_blob_name = ?, generation_status = 'done' WHERE id = ?",
      [generatedBlobName, studentReportId]
    );

    return generatedBlobName;
  } catch (err) {
    console.error("Report generation failed:", err);
    await db.query(
      "UPDATE student_reports SET generation_status = 'failed' WHERE id = ?",
      [studentReportId]
    );
    throw err;
  }
}