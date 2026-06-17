import db from "@/lib/db";

// Get All Degrees
export async function getDegrees() {
  const [rows] = await db.query(
    "SELECT * FROM degrees ORDER BY id DESC"
  );

  return rows;
}

// Add Degree
export async function addDegree(name) {
  const [result] = await db.query(
    "INSERT INTO degrees (name) VALUES (?)",
    [name]
  );

  return result;
}

// Update Degree
export async function updateDegree(id, name) {
  const [result] = await db.query(
    "UPDATE degrees SET name = ? WHERE id = ?",
    [name, id]
  );

  return result;
}

// Delete Degree
export async function deleteDegree(id) {
  const [result] = await db.query(
    "DELETE FROM degrees WHERE id = ?",
    [id]
  );

  return result;
}