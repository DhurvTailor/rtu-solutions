import db from "@/lib/db";

// Get Subjects (filtered by semester_id if provided, otherwise all)
export async function getSubjects(semester_id) {
  let query = `
    SELECT
      subjects.id,
      subjects.name,
      subjects.semester_id,
      subjects.created_at,
      semesters.semester_number
    FROM subjects
    JOIN semesters
    ON subjects.semester_id = semesters.id
  `;
  const params = [];

  if (semester_id) {
    query += " WHERE subjects.semester_id = ? ";
    params.push(semester_id);
  }

  query += " ORDER BY subjects.id DESC ";

  const [rows] = await db.query(query, params);
  return rows;
}

// Add Subject
export async function addSubject(semester_id, name) {
  const [result] = await db.query(
    `
    INSERT INTO subjects
    (semester_id, name)
    VALUES (?, ?)
    `,
    [semester_id, name]
  );
  return result;
}

// Update Subject
export async function updateSubject(id, semester_id, name) {
  const [result] = await db.query(
    `
    UPDATE subjects
    SET semester_id = ?, name = ?
    WHERE id = ?
    `,
    [semester_id, name, id]
  );
  return result;
}

// Delete Subject
export async function deleteSubject(id) {
  const [result] = await db.query(
    "DELETE FROM subjects WHERE id = ?",
    [id]
  );
  return result;
}