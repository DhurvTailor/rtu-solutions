import db from "@/lib/db";

// Get All Solutions
export async function getSolutions() {
  const [rows] = await db.query(`
    SELECT
      solutions.*,
      subjects.name AS subject_name
    FROM solutions
    JOIN subjects
    ON solutions.subject_id = subjects.id
    ORDER BY solutions.id DESC
  `);

  return rows;
}

// Add Solution
export async function addSolution(
  subject_id,
  title,
  solution_type,
  pdf_url,
  description,
  is_premium
) {
  const [result] = await db.query(
    `
    INSERT INTO solutions
    (
      subject_id,
      title,
      solution_type,
      pdf_url,
      description,
      is_premium
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      subject_id,
      title,
      solution_type,
      pdf_url,
      description,
      is_premium,
    ]
  );

  return result;
}

// Update Solution
export async function updateSolution(
  id,
  subject_id,
  title,
  solution_type,
  pdf_url,
  description,
  is_premium
) {
  const [result] = await db.query(
    `
    UPDATE solutions
    SET
      subject_id = ?,
      title = ?,
      solution_type = ?,
      pdf_url = ?,
      description = ?,
      is_premium = ?
    WHERE id = ?
    `,
    [
      subject_id,
      title,
      solution_type,
      pdf_url,
      description,
      is_premium,
      id,
    ]
  );

  return result;
}

// Delete Solution
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
    SELECT
      solutions.*,
      subjects.name AS subject_name
    FROM solutions
    JOIN subjects
      ON solutions.subject_id = subjects.id
    WHERE solutions.subject_id = ?
    ORDER BY solutions.id DESC
    `,
    [subjectId]
  );

  return rows;
}