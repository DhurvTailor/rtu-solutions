



// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";
// import DocxMerger from "docx-merger";
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
//       tc.certificate_template_blob_name,
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

// function buildPlaceholderData(report) {
//   return {
//     student_name: report.student_name,
//     roll_no: report.roll_no,
//     college_name: report.college_name,
//     university_name: report.university_name,
//     branch_name: report.branch_name,
//     degree_name: report.degree_name,
//     semester_number: report.semester_number,
//     academic_session: report.academic_session,
//     training_company_name: report.training_company_name,
//     training_start_date: formatDate(report.training_start_date),
//     training_end_date: formatDate(report.training_end_date),
//     guide_name: report.guide_name,
//     hod_name: report.hod_name,
//     subject_name: report.subject_name,
//     report_title: report.template_title,
//   };
// }

// // Ek docx template buffer ko diye gaye data se fill karo, filled buffer return karo
// function renderDocxTemplate(templateBuffer, placeholderData) {
//   const zip = new PizZip(templateBuffer);
//   const doc = new Docxtemplater(zip, {
//     paragraphLoop: true,
//     linebreaks: true,
//     delimiters: { start: "{{", end: "}}" },   // ← YE LINE ADD KARO
//   });
//   doc.render(placeholderData);
//   return doc.getZip().generate({ type: "nodebuffer" });
// }

// // Do docx buffers ko ek document mein merge karo (report ke baad certificate)
// function mergeDocxBuffers(buffers) {
//   return new Promise((resolve, reject) => {
//     try {
//       const merger = new DocxMerger({}, buffers);
//       merger.save("nodebuffer", (data) => resolve(data));
//     } catch (err) {
//       reject(err);
//     }
//   });
// }

// // Template docx mein placeholder tags: {student_name}, {roll_no},
// // {college_name}, {university_name}, {branch_name}, {degree_name},
// // {semester_number}, {academic_session}, {training_company_name},
// // {training_start_date}, {training_end_date}, {guide_name}, {hod_name},
// // {subject_name}, {report_title}
// // Same placeholders company ke certificate template mein bhi kaam karenge.
// export async function generateStudentReportDocx(studentReportId) {
//   const report = await getReportDataForGeneration(studentReportId);
//   if (!report) throw new Error("Student report record nahi mila");

//   await db.query(
//     "UPDATE student_reports SET generation_status = 'processing' WHERE id = ?",
//     [studentReportId]
//   );

//   try {
//     const placeholderData = buildPlaceholderData(report);

//     // 1. Report content template fill karo
//     const reportTemplateFile = await downloadBlobBuffer(report.content_blob_name);
//     if (!reportTemplateFile) throw new Error("Report content template Azure par nahi mila");
//     const filledReportBuffer = renderDocxTemplate(reportTemplateFile.buffer, placeholderData);

//     let finalBuffer = filledReportBuffer;

//     // 2. Agar is training company ka certificate template hai, use bhi fill karke merge karo
//     if (report.certificate_template_blob_name) {
//       const certTemplateFile = await downloadBlobBuffer(report.certificate_template_blob_name);
//       if (certTemplateFile) {
//         const filledCertBuffer = renderDocxTemplate(certTemplateFile.buffer, placeholderData);
//         finalBuffer = await mergeDocxBuffers([filledReportBuffer, filledCertBuffer]);
//       } else {
//         console.warn(
//           `Company certificate blob missing for student_report ${studentReportId}, sirf report bhejenge`
//         );
//       }
//     }

//     const generatedBlobName = generateBlobName(
//       `report-${studentReportId}-${report.roll_no}.docx`
//     );
//     await uploadBufferToAzure(finalBuffer, generatedBlobName, DOCX_CONTENT_TYPE);

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









// import PizZip from "pizzip";
// import Docxtemplater from "docxtemplater";
// import DocxMerger from "docx-merger";
// import db from "./db.js";

// import {
//   downloadBlobBuffer,
//   uploadBufferToAzure,
//   generateBlobName,
// } from "./azureBlob.js";

// const DOCX_CONTENT_TYPE =
//   "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

// /* =========================================================
//    DATE FORMAT
// ========================================================= */

// function formatDate(date) {
//   if (!date) return "";

//   const parsedDate = new Date(date);

//   if (Number.isNaN(parsedDate.getTime())) {
//     return "";
//   }

//   return parsedDate.toLocaleDateString("en-IN", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//   });
// }

// /* =========================================================
//    GET REPORT DATA
// ========================================================= */

// async function getReportDataForGeneration(studentReportId) {
//   const [rows] = await db.query(
//     `
//     SELECT
//       sr.*,

//       rct.content_blob_name,
//       rct.title AS template_title,

//       subjects.name AS subject_name,

//       col.name AS college_name,

//       uni.name AS university_name,

//       tc.name AS training_company_name,
//       tc.certificate_template_blob_name,

//       br.name AS branch_name,

//       deg.name AS degree_name,

//       sem.semester_number

//     FROM student_reports sr

//     JOIN report_content_templates rct
//       ON sr.content_template_id = rct.id

//     JOIN subjects
//       ON rct.subject_id = subjects.id

//     JOIN colleges col
//       ON sr.college_id = col.id

//     JOIN universities uni
//       ON col.university_id = uni.id

//     JOIN training_companies tc
//       ON sr.training_company_id = tc.id

//     JOIN branch br
//       ON sr.branch_id = br.id

//     JOIN degrees deg
//       ON sr.degree_id = deg.id

//     JOIN semesters sem
//       ON sr.semester_id = sem.id

//     WHERE sr.id = ?

//     LIMIT 1
//     `,
//     [studentReportId]
//   );

//   return rows?.[0] || null;
// }

// /* =========================================================
//    BUILD PLACEHOLDER DATA
// ========================================================= */

// function buildPlaceholderData(report) {
//   return {
//     student_name: report.student_name ?? "",
//     roll_no: report.roll_no ?? "",

//     college_name: report.college_name ?? "",
//     university_name: report.university_name ?? "",

//     branch_name: report.branch_name ?? "",
//     degree_name: report.degree_name ?? "",

//     semester_number: report.semester_number ?? "",
//     academic_session: report.academic_session ?? "",

//     training_company_name:
//       report.training_company_name ?? "",

//     training_start_date:
//       formatDate(report.training_start_date),

//     training_end_date:
//       formatDate(report.training_end_date),

//     guide_name: report.guide_name ?? "",
//     hod_name: report.hod_name ?? "",

//     subject_name: report.subject_name ?? "",

//     report_title: report.template_title ?? "",
//   };
// }

// /* =========================================================
//    DOCX ERROR
// ========================================================= */

// function explainDocxError(error) {
//   if (!error) {
//     return "Unknown DOCX error";
//   }

//   const errors = error?.properties?.errors;

//   if (Array.isArray(errors) && errors.length > 0) {
//     return errors
//       .map((item) => {
//         const tag =
//           item?.properties?.xtag ||
//           item?.properties?.id ||
//           "unknown";

//         const explanation =
//           item?.properties?.explanation ||
//           item?.message ||
//           "Unknown template error";

//         return `[tag: ${tag}] ${explanation}`;
//       })
//       .join(" | ");
//   }

//   if (error?.properties?.explanation) {
//     return error.properties.explanation;
//   }

//   return error?.message || String(error);
// }

// /* =========================================================
//    RENDER DOCX TEMPLATE
// ========================================================= */

// function renderDocxTemplate(templateBuffer, placeholderData) {
//   if (!templateBuffer) {
//     throw new Error("DOCX template buffer empty hai");
//   }

//   try {
//     const zip = new PizZip(templateBuffer);

//     const doc = new Docxtemplater(zip, {
//       paragraphLoop: true,
//       linebreaks: true,

//       /*
//         IMPORTANT:

//         DOCX TEMPLATE MEIN:

//         [[student_name]]
//         [[roll_no]]
//         [[college_name]]

//         use karna hai.
//       */

//       delimiters: {
//         start: "[[",
//         end: "]]",
//       },

//       nullGetter: (part) => {
//         console.warn(
//           `Missing placeholder: ${part?.value || "unknown"}`
//         );

//         return "";
//       },
//     });

//     doc.render(placeholderData);

//     return doc.getZip().generate({
//       type: "nodebuffer",
//       compression: "DEFLATE",
//     });
//   } catch (error) {
//     console.error("DOCX render error:", error);

//     throw new Error(explainDocxError(error));
//   }
// }

// /* =========================================================
//    MERGE DOCX
// ========================================================= */

// function mergeDocxBuffers(buffers) {
//   return new Promise((resolve, reject) => {
//     try {
//       if (!Array.isArray(buffers) || buffers.length === 0) {
//         reject(new Error("DOCX buffers nahi mile"));
//         return;
//       }

//       const merger = new DocxMerger({}, buffers);

//       merger.save("nodebuffer", (data) => {
//         if (!data) {
//           reject(new Error("Merged DOCX empty hai"));
//           return;
//         }

//         resolve(data);
//       });
//     } catch (error) {
//       reject(error);
//     }
//   });
// }

// /* =========================================================
//    GENERATE STUDENT REPORT
// ========================================================= */

// export async function generateStudentReportDocx(
//   studentReportId
// ) {
//   if (!studentReportId) {
//     throw new Error("studentReportId required hai");
//   }

//   /* -------------------------------------------------------
//      GET REPORT
//   ------------------------------------------------------- */

//   const report =
//     await getReportDataForGeneration(studentReportId);

//   if (!report) {
//     throw new Error("Student report record nahi mila");
//   }

//   /* -------------------------------------------------------
//      STATUS = PROCESSING
//   ------------------------------------------------------- */

//   await db.query(
//     `
//     UPDATE student_reports
//     SET generation_status = 'processing'
//     WHERE id = ?
//     `,
//     [studentReportId]
//   );

//   try {
//     /* -----------------------------------------------------
//        PLACEHOLDER DATA
//     ----------------------------------------------------- */

//     const placeholderData =
//       buildPlaceholderData(report);

//     console.log(
//       "Generating report:",
//       studentReportId
//     );

//     /* -----------------------------------------------------
//        DOWNLOAD REPORT TEMPLATE
//     ----------------------------------------------------- */

//     const reportTemplateFile =
//       await downloadBlobBuffer(
//         report.content_blob_name
//       );

//     if (!reportTemplateFile?.buffer) {
//       throw new Error(
//         "Report template Azure Blob Storage par nahi mila"
//       );
//     }

//     /* -----------------------------------------------------
//        RENDER REPORT
//     ----------------------------------------------------- */

//     const filledReportBuffer =
//       renderDocxTemplate(
//         reportTemplateFile.buffer,
//         placeholderData
//       );

//     let finalBuffer = filledReportBuffer;

//     /* -----------------------------------------------------
//        CERTIFICATE
//     ----------------------------------------------------- */

//     if (report.certificate_template_blob_name) {
//       const certificateTemplateFile =
//         await downloadBlobBuffer(
//           report.certificate_template_blob_name
//         );

//       if (certificateTemplateFile?.buffer) {
//         const filledCertificateBuffer =
//           renderDocxTemplate(
//             certificateTemplateFile.buffer,
//             placeholderData
//           );

//         finalBuffer = await mergeDocxBuffers([
//           filledReportBuffer,
//           filledCertificateBuffer,
//         ]);
//       }
//     }

//     /* -----------------------------------------------------
//        AZURE BLOB NAME
//     ----------------------------------------------------- */

//     const safeRollNo = String(
//       report.roll_no || studentReportId
//     ).replace(/[^a-zA-Z0-9_-]/g, "_");

//     const generatedBlobName =
//       generateBlobName(
//         `report-${studentReportId}-${safeRollNo}.docx`
//       );

//     /* -----------------------------------------------------
//        UPLOAD FINAL DOCX
//     ----------------------------------------------------- */

//     await uploadBufferToAzure(
//       finalBuffer,
//       generatedBlobName,
//       DOCX_CONTENT_TYPE
//     );

//     /* -----------------------------------------------------
//        STATUS = DONE
//     ----------------------------------------------------- */

//     await db.query(
//       `
//       UPDATE student_reports
//       SET
//         generated_report_blob_name = ?,
//         generation_status = 'done'
//       WHERE id = ?
//       `,
//       [generatedBlobName, studentReportId]
//     );

//     console.log(
//       "Report generated successfully:",
//       generatedBlobName
//     );

//     return generatedBlobName;
//   } catch (error) {
//     /* -----------------------------------------------------
//        STATUS = FAILED
//     ----------------------------------------------------- */

//     console.error(
//       `Report generation failed [${studentReportId}]:`,
//       error
//     );

//     try {
//       await db.query(
//         `
//         UPDATE student_reports
//         SET generation_status = 'failed'
//         WHERE id = ?
//         `,
//         [studentReportId]
//       );
//     } catch (dbError) {
//       console.error(
//         "Failed to update generation status:",
//         dbError
//       );
//     }

//     throw new Error(
//       error?.message ||
//         "Report generation failed"
//     );
//   }
// }







import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import DocxMerger from "docx-merger";

import db from "./db.js";

import {
  downloadBlobBuffer,
  uploadBufferToAzure,
  generateBlobName,
} from "./azureBlob.js";

const DOCX_CONTENT_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/* =========================================================
   FORMAT DATE
========================================================= */

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/* =========================================================
   GET REPORT DATA
========================================================= */

async function getReportDataForGeneration(studentReportId) {
  const [rows] = await db.query(
    `
    SELECT
      sr.*,
      rct.content_blob_name,
      rct.title AS template_title,
      subjects.name AS subject_name,
      col.name AS college_name,
      uni.name AS university_name,
      tc.name AS training_company_name,
      tc.certificate_template_blob_name,
      br.name AS branch_name,
      deg.name AS degree_name,
      sem.semester_number

    FROM student_reports sr

    JOIN report_content_templates rct
      ON sr.content_template_id = rct.id

    JOIN subjects
      ON rct.subject_id = subjects.id

    JOIN colleges col
      ON sr.college_id = col.id

    JOIN universities uni
      ON col.university_id = uni.id

    JOIN training_companies tc
      ON sr.training_company_id = tc.id

    JOIN branch br
      ON sr.branch_id = br.id

    JOIN degrees deg
      ON sr.degree_id = deg.id

    JOIN semesters sem
      ON sr.semester_id = sem.id

    WHERE sr.id = ?

    LIMIT 1
    `,
    [studentReportId]
  );

  return rows?.[0] || null;
}

/* =========================================================
   BUILD PLACEHOLDER DATA
========================================================= */

function buildPlaceholderData(report) {
  return {
    student_name: report.student_name ?? "",
    roll_no: report.roll_no ?? "",

    college_name: report.college_name ?? "",
    university_name: report.university_name ?? "",

    branch_name: report.branch_name ?? "",
    degree_name: report.degree_name ?? "",

    semester_number: report.semester_number ?? "",
    academic_session: report.academic_session ?? "",

    training_company_name:
      report.training_company_name ?? "",

    training_start_date:
      formatDate(report.training_start_date),

    training_end_date:
      formatDate(report.training_end_date),

    guide_name: report.guide_name ?? "",
    hod_name: report.hod_name ?? "",

    subject_name: report.subject_name ?? "",

    report_title: report.template_title ?? "",
  };
}

/* =========================================================
   EXPLAIN DOCX ERROR
========================================================= */

function explainDocxError(error) {
  if (!error) {
    return "Unknown DOCX error";
  }

  const errors = error?.properties?.errors;

  if (Array.isArray(errors) && errors.length > 0) {
    return errors
      .map((item) => {
        const tag =
          item?.properties?.xtag ||
          item?.properties?.id ||
          "unknown";

        const explanation =
          item?.properties?.explanation ||
          item?.message ||
          "Unknown template error";

        return `[tag: ${tag}] ${explanation}`;
      })
      .join(" | ");
  }

  if (error?.properties?.explanation) {
    return error.properties.explanation;
  }

  return error?.message || String(error);
}

/* =========================================================
   RENDER DOCX
========================================================= */

function renderDocxTemplate(templateBuffer, placeholderData) {
  if (!templateBuffer) {
    throw new Error("DOCX template buffer empty hai");
  }

  try {
    const zip = new PizZip(templateBuffer);

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,

      /*
       * DOCX TEMPLATE:
       *
       * [[student_name]]
       * [[roll_no]]
       * [[college_name]]
       */

      delimiters: {
        start: "[[",
        end: "]]",
      },

      nullGetter: (part) => {
        console.warn(
          `Missing DOCX placeholder: ${part?.value || "unknown"}`
        );

        return "";
      },
    });

    doc.render(placeholderData);

    return doc.getZip().generate({
      type: "nodebuffer",
      compression: "DEFLATE",
    });
  } catch (error) {
    console.error("DOCX rendering error:", error);

    throw new Error(explainDocxError(error));
  }
}

/* =========================================================
   MERGE DOCX FILES
========================================================= */

function mergeDocxBuffers(buffers) {
  return new Promise((resolve, reject) => {
    try {
      if (!Array.isArray(buffers) || buffers.length === 0) {
        reject(new Error("DOCX buffers nahi mile"));
        return;
      }

      const merger = new DocxMerger({}, buffers);

      merger.save("nodebuffer", (data) => {
        if (!data) {
          reject(
            new Error("Merged DOCX buffer empty hai")
          );
          return;
        }

        resolve(data);
      });
    } catch (error) {
      console.error("DOCX merge error:", error);
      reject(error);
    }
  });
}

/* =========================================================
   MAIN EXPORT
========================================================= */

export async function generateStudentReportDocx(
  studentReportId
) {
  if (!studentReportId) {
    throw new Error("studentReportId required hai");
  }

  /* -------------------------------------------------------
     GET REPORT
  ------------------------------------------------------- */

  const report =
    await getReportDataForGeneration(studentReportId);

  if (!report) {
    throw new Error(
      "Student report record nahi mila"
    );
  }

  /* -------------------------------------------------------
     PROCESSING
  ------------------------------------------------------- */

  await db.query(
    `
    UPDATE student_reports
    SET generation_status = 'processing'
    WHERE id = ?
    `,
    [studentReportId]
  );

  try {
    /* -----------------------------------------------------
       PLACEHOLDER DATA
    ----------------------------------------------------- */

    const placeholderData =
      buildPlaceholderData(report);

    console.log(
      `Generating student report: ${studentReportId}`
    );

    /* -----------------------------------------------------
       DOWNLOAD REPORT TEMPLATE
    ----------------------------------------------------- */

    const reportTemplateFile =
      await downloadBlobBuffer(
        report.content_blob_name
      );

    if (!reportTemplateFile?.buffer) {
      throw new Error(
        "Report content template Azure Blob Storage par nahi mila"
      );
    }

    /* -----------------------------------------------------
       RENDER REPORT
    ----------------------------------------------------- */

    const filledReportBuffer =
      renderDocxTemplate(
        reportTemplateFile.buffer,
        placeholderData
      );

    let finalBuffer = filledReportBuffer;

    /* -----------------------------------------------------
       CERTIFICATE
    ----------------------------------------------------- */

    if (report.certificate_template_blob_name) {
      console.log(
        `Certificate template found for report: ${studentReportId}`
      );

      const certificateTemplateFile =
        await downloadBlobBuffer(
          report.certificate_template_blob_name
        );

      if (certificateTemplateFile?.buffer) {
        const filledCertificateBuffer =
          renderDocxTemplate(
            certificateTemplateFile.buffer,
            placeholderData
          );

        finalBuffer =
          await mergeDocxBuffers([
            filledReportBuffer,
            filledCertificateBuffer,
          ]);
      } else {
        console.warn(
          "Certificate template Azure Blob Storage par nahi mila"
        );
      }
    }

    /* -----------------------------------------------------
       BLOB NAME
    ----------------------------------------------------- */

    const safeRollNo = String(
      report.roll_no || studentReportId
    ).replace(
      /[^a-zA-Z0-9_-]/g,
      "_"
    );

    const generatedBlobName =
      generateBlobName(
        `report-${studentReportId}-${safeRollNo}.docx`
      );

    /* -----------------------------------------------------
       UPLOAD
    ----------------------------------------------------- */

    await uploadBufferToAzure(
      finalBuffer,
      generatedBlobName,
      DOCX_CONTENT_TYPE
    );

    /* -----------------------------------------------------
       DONE
    ----------------------------------------------------- */

    await db.query(
      `
      UPDATE student_reports

      SET
        generated_report_blob_name = ?,
        generation_status = 'done'

      WHERE id = ?
      `,
      [
        generatedBlobName,
        studentReportId,
      ]
    );

    console.log(
      `Student report generated successfully: ${generatedBlobName}`
    );

    return generatedBlobName;
  } catch (error) {
    console.error(
      `Report generation failed for ${studentReportId}:`,
      error
    );

    /* -----------------------------------------------------
       FAILED
    ----------------------------------------------------- */

    try {
      await db.query(
        `
        UPDATE student_reports

        SET generation_status = 'failed'

        WHERE id = ?
        `,
        [studentReportId]
      );
    } catch (dbError) {
      console.error(
        "Failed to update report status:",
        dbError
      );
    }

    throw new Error(
      error?.message ||
        "Report generation failed"
    );
  }
}

