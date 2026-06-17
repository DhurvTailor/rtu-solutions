import db from "@/lib/db";

// Get All Semesters
export async function getSemesters() {
  const [rows] = await db.query(`
    SELECT
      semesters.id,
      semesters.branch_id,
      semesters.semester_number,
      semesters.created_at,
      branch.name AS branch_name
    FROM semesters
    JOIN branch
    ON semesters.branch_id = branch.id
    ORDER BY semesters.id DESC
  `);

  return rows;
}

// Add Semester
export async function addSemester(
  branch_id,
  semester_number
) {
  const [result] = await db.query(
    `
    INSERT INTO semesters
    (branch_id, semester_number)
    VALUES (?, ?)
    `,
    [branch_id, semester_number]
  );

  return result;
}

// Delete Semester
export async function deleteSemester(id) {
  const [result] = await db.query(
    "DELETE FROM semesters WHERE id = ?",
    [id]
  );

  return result;
}

// Update Semester
export async function updateSemester(
  id,
  branch_id,
  semester_number
) {
  const [result] = await db.query(
    `
    UPDATE semesters
    SET
      branch_id = ?,
      semester_number = ?
    WHERE id = ?
    `,
    [branch_id, semester_number, id]
  );

  return result;
}





export async function getSemestersByBranch(branchId) {
  const [rows] = await db.query(
    `
    SELECT
      semesters.id,
      semesters.branch_id,
      semesters.semester_number,
      semesters.created_at,
      branch.name AS branch_name
    FROM semesters
    JOIN branch
      ON semesters.branch_id = branch.id
    WHERE semesters.branch_id = ?
    ORDER BY semesters.semester_number ASC
    `,
    [branchId]
  );

  return rows;
}