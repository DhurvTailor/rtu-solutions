

// import db from "../lib/db.js";

// export async function getSolutions() {
//   const [rows] = await db.query(`
//     SELECT
//       solutions.*,
//       subjects.name              AS subject_name,
//       subjects.semester_id       AS semester_id,
//       semesters.semester_number  AS semester_number,
//       semesters.branch_id        AS branch_id,
//       branch.name                AS branch_name,
//       branch.degree_id           AS degree_id,
//       degrees.name               AS degree_name
//     FROM solutions
//     JOIN subjects  ON solutions.subject_id = subjects.id
//     JOIN semesters ON subjects.semester_id = semesters.id
//     JOIN branch    ON semesters.branch_id  = branch.id
//     JOIN degrees   ON branch.degree_id     = degrees.id
//     ORDER BY solutions.id DESC
//   `);
//   return rows;
// }

// // FIX: preview_blob_name naya param add kiya (9th)
// export async function addSolution(
//   subject_id,
//   title,
//   solution_type,
//   pdf_url,
//   description,
//   is_premium,
//   price,
//   preview_blob_name = null
// ) {
//   const [result] = await db.query(
//     `
//     INSERT INTO solutions
//     (subject_id, title, solution_type, pdf_url, description, is_premium, price, preview_blob_name)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `,
//     [subject_id, title, solution_type, pdf_url, description, is_premium, price, preview_blob_name]
//   );
//   return result;
// }

// // FIX: preview_blob_name naya param add kiya (9th)
// export async function updateSolution(
//   id,
//   subject_id,
//   title,
//   solution_type,
//   pdf_url,
//   description,
//   is_premium,
//   price,
//   preview_blob_name = null
// ) {
//   const [result] = await db.query(
//     `
//     UPDATE solutions
//     SET subject_id = ?, title = ?, solution_type = ?, pdf_url = ?,
//         description = ?, is_premium = ?, price = ?, preview_blob_name = ?
//     WHERE id = ?
//     `,
//     [subject_id, title, solution_type, pdf_url, description, is_premium, price, preview_blob_name, id]
//   );
//   return result;
// }

// export async function deleteSolution(id) {
//   const [result] = await db.query("DELETE FROM solutions WHERE id = ?", [id]);
//   return result;
// }

// export async function getSolutionsBySubject(subjectId) {
//   const [rows] = await db.query(
//     `
//     SELECT solutions.*, subjects.name AS subject_name
//     FROM solutions
//     JOIN subjects ON solutions.subject_id = subjects.id
//     WHERE solutions.subject_id = ?
//     ORDER BY solutions.id DESC
//     `,
//     [subjectId]
//   );
//   return rows;
// }

// export async function getSolutionById(id) {
//   const [rows] = await db.query(
//     `
//     SELECT solutions.*, subjects.name AS subject_name
//     FROM solutions
//     JOIN subjects ON solutions.subject_id = subjects.id
//     WHERE solutions.id = ?
//     `,
//     [id]
//   );
//   return rows[0];
// }





// import db from "../lib/db.js";

// export async function getSolutions() {
//   const [rows] = await db.query(`
//     SELECT
//       solutions.*,
//       subjects.name              AS subject_name,
//       subjects.semester_id       AS semester_id,
//       semesters.semester_number  AS semester_number,
//       semesters.branch_id        AS branch_id,
//       branch.name                AS branch_name,
//       branch.degree_id           AS degree_id,
//       degrees.name               AS degree_name
//     FROM solutions
//     JOIN subjects  ON solutions.subject_id = subjects.id
//     JOIN semesters ON subjects.semester_id = semesters.id
//     JOIN branch    ON semesters.branch_id  = branch.id
//     JOIN degrees   ON branch.degree_id     = degrees.id
//     ORDER BY solutions.id DESC
//   `);
//   return rows;
// }

// export async function addSolution(
//   subject_id,
//   title,
//   solution_type,
//   pdf_url,
//   description,
//   is_premium,
//   price,
//   preview_blob_name = null,
//   thumbnail_blob_name = null   // ← NEW
// ) {
//   const [result] = await db.query(
//     `
//     INSERT INTO solutions
//     (subject_id, title, solution_type, pdf_url, description, is_premium, price, preview_blob_name, thumbnail_blob_name)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `,
//     [subject_id, title, solution_type, pdf_url, description, is_premium, price, preview_blob_name, thumbnail_blob_name]
//   );
//   return result;
// }

// export async function updateSolution(
//   id,
//   subject_id,
//   title,
//   solution_type,
//   pdf_url,
//   description,
//   is_premium,
//   price,
//   preview_blob_name = null,
//   thumbnail_blob_name = null   // ← NEW
// ) {
//   const [result] = await db.query(
//     `
//     UPDATE solutions
//     SET subject_id = ?, title = ?, solution_type = ?, pdf_url = ?,
//         description = ?, is_premium = ?, price = ?, preview_blob_name = ?,
//         thumbnail_blob_name = ?
//     WHERE id = ?
//     `,
//     [subject_id, title, solution_type, pdf_url, description, is_premium, price, preview_blob_name, thumbnail_blob_name, id]
//   );
//   return result;
// }

// export async function deleteSolution(id) {
//   const [result] = await db.query(
//     "DELETE FROM solutions WHERE id = ?",
//     [id]
//   );
//   return result;
// }

// export async function getSolutionsBySubject(subjectId) {
//   const [rows] = await db.query(
//     `
//     SELECT solutions.*, subjects.name AS subject_name
//     FROM solutions
//     JOIN subjects ON solutions.subject_id = subjects.id
//     WHERE solutions.subject_id = ?
//     ORDER BY solutions.id DESC
//     `,
//     [subjectId]
//   );
//   return rows;
// }

// export async function getSolutionById(id) {
//   const [rows] = await db.query(
//     `
//     SELECT solutions.*, subjects.name AS subject_name
//     FROM solutions
//     JOIN subjects ON solutions.subject_id = subjects.id
//     WHERE solutions.id = ?
//     `,
//     [id]
//   );
//   return rows[0];
// }





import db from "../lib/db.js";

export async function getSolutions() {
  const [rows] = await db.query(`
    SELECT
      solutions.*,
      subjects.name              AS subject_name,
      subjects.semester_id       AS semester_id,
      semesters.semester_number  AS semester_number,
      semesters.branch_id        AS branch_id,
      branch.name                AS branch_name,
      branch.degree_id           AS degree_id,
      degrees.name               AS degree_name
    FROM solutions
    JOIN subjects  ON solutions.subject_id = subjects.id
    JOIN semesters ON subjects.semester_id = semesters.id
    JOIN branch    ON semesters.branch_id  = branch.id
    JOIN degrees   ON branch.degree_id     = degrees.id
    ORDER BY solutions.id DESC
  `);
  return rows;
}

export async function addSolution(
  subject_id,
  title,
  solution_type,
  pdf_url,
  description,
  is_premium,
  price,
  preview_blob_name = null,
  thumbnail_blob_name = null,
  youtube_url = null          // ← NEW
) {
  const [result] = await db.query(
    `
    INSERT INTO solutions
    (subject_id, title, solution_type, pdf_url, description, is_premium, price, preview_blob_name, thumbnail_blob_name, youtube_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [subject_id, title, solution_type, pdf_url, description, is_premium, price, preview_blob_name, thumbnail_blob_name, youtube_url]
  );
  return result;
}

export async function updateSolution(
  id,
  subject_id,
  title,
  solution_type,
  pdf_url,
  description,
  is_premium,
  price,
  preview_blob_name = null,
  thumbnail_blob_name = null,
  youtube_url = null          // ← NEW
) {
  const [result] = await db.query(
    `
    UPDATE solutions
    SET subject_id = ?, title = ?, solution_type = ?, pdf_url = ?,
        description = ?, is_premium = ?, price = ?, preview_blob_name = ?,
        thumbnail_blob_name = ?, youtube_url = ?
    WHERE id = ?
    `,
    [subject_id, title, solution_type, pdf_url, description, is_premium, price, preview_blob_name, thumbnail_blob_name, youtube_url, id]
  );
  return result;
}

export async function deleteSolution(id) {
  const [result] = await db.query(
    "DELETE FROM solutions WHERE id = ?",
    [id]
  );
  return result;
}

export async function getSolutionsBySubject(subjectId) {
  const [rows] = await db.query(
    `
    SELECT solutions.*, subjects.name AS subject_name
    FROM solutions
    JOIN subjects ON solutions.subject_id = subjects.id
    WHERE solutions.subject_id = ?
    ORDER BY solutions.id DESC
    `,
    [subjectId]
  );
  return rows;
}

export async function getSolutionById(id) {
  const [rows] = await db.query(
    `
    SELECT solutions.*, subjects.name AS subject_name
    FROM solutions
    JOIN subjects ON solutions.subject_id = subjects.id
    WHERE solutions.id = ?
    `,
    [id]
  );
  return rows[0];
}