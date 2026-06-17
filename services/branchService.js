import db from "@/lib/db";

// Get All Branches
export async function getBranches() {
  const [rows] = await db.query(`
    SELECT
      branch.id,
      branch.name,
      branch.degree_id,
      degrees.name AS degree_name,
      branch.created_at
    FROM branch
    JOIN degrees
    ON branch.degree_id = degrees.id
    ORDER BY branch.id DESC
  `);

  return rows;
}


// Degree Wise Branches
export async function getBranchesByDegree(degreeId) {
  const [rows] = await db.query(
    `
    SELECT
      branch.id,
      branch.name,
      branch.degree_id,
      degrees.name AS degree_name,
      branch.created_at
    FROM branch
    JOIN degrees
      ON branch.degree_id = degrees.id
    WHERE branch.degree_id = ?
    ORDER BY branch.id DESC
    `,
    [degreeId]
  );

  return rows;
}



// Add Branch
export async function addBranch(
  degree_id,
  name
) {
  const [result] = await db.query(
    `
    INSERT INTO branch
    (degree_id, name)
    VALUES (?, ?)
    `,
    [degree_id, name]
  );

  return result;
}

// Delete Branch
export async function deleteBranch(id) {
  const [result] = await db.query(
    "DELETE FROM branch WHERE id = ?",
    [id]
  );

  return result;
}

// Update Branch
export async function updateBranch(
  id,
  degree_id,
  name
) {
  const [result] = await db.query(
    `
    UPDATE branch
    SET degree_id = ?, name = ?
    WHERE id = ?
    `,
    [degree_id, name, id]
  );

  return result;
}