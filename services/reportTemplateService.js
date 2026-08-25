import db from "../lib/db.js";

export async function getReportTemplates() {
  const [rows] = await db.query(`
    SELECT rct.*, subjects.name AS subject_name,
           semesters.semester_number, branch.name AS branch_name, degrees.name AS degree_name
    FROM report_content_templates rct
    JOIN subjects  ON rct.subject_id = subjects.id
    JOIN semesters ON subjects.semester_id = semesters.id
    JOIN branch    ON semesters.branch_id = branch.id
    JOIN degrees   ON branch.degree_id = degrees.id
    ORDER BY rct.id DESC
  `);
  return rows;
}

export async function getActiveReportTemplates() {
  const [rows] = await db.query(`
    SELECT rct.id, rct.title, rct.price, rct.preview_blob_name, subjects.name AS subject_name
    FROM report_content_templates rct
    JOIN subjects ON rct.subject_id = subjects.id
    WHERE rct.is_active = 1
    ORDER BY rct.id DESC
  `);
  return rows;
}

export async function getReportTemplateById(id) {
  const [rows] = await db.query("SELECT * FROM report_content_templates WHERE id = ?", [id]);
  return rows[0] || null;
}

export async function addReportTemplate(subject_id, title, content_blob_name, preview_blob_name, price, is_active) {
  const [result] = await db.query(
    `INSERT INTO report_content_templates
     (subject_id, title, content_blob_name, preview_blob_name, price, is_active)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [subject_id, title, content_blob_name, preview_blob_name, price, is_active]
  );
  return result;
}

export async function updateReportTemplate(id, subject_id, title, content_blob_name, preview_blob_name, price, is_active) {
  const [result] = await db.query(
    `UPDATE report_content_templates
     SET subject_id = ?, title = ?, content_blob_name = ?, preview_blob_name = ?, price = ?, is_active = ?
     WHERE id = ?`,
    [subject_id, title, content_blob_name, preview_blob_name, price, is_active, id]
  );
  return result;
}

export async function deleteReportTemplate(id) {
  const [result] = await db.query("DELETE FROM report_content_templates WHERE id = ?", [id]);
  return result;
}


