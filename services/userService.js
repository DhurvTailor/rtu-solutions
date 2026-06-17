import db from "@/lib/db";

// Get All Users
export async function getUsers() {
  const [rows] = await db.query(`
    SELECT *
    FROM users
    ORDER BY id DESC
  `);

  return rows;
}

// Get Single User
export async function getUser(id) {
  const [rows] = await db.query(
    "SELECT * FROM users WHERE id = ?",
    [id]
  );

  return rows[0];
}

// Add User
export async function addUser(
  google_id,
  name,
  email,
  img,
  role = "user"
) {
  const [result] = await db.query(
    `
    INSERT INTO users
    (
      google_id,
      name,
      email,
      img,
      role
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      google_id,
      name,
      email,
      img,
      role,
    ]
  );

  return result;
}

// Update Role
export async function updateUserRole(
  id,
  role
) {
  const [result] = await db.query(
    `
    UPDATE users
    SET role = ?
    WHERE id = ?
    `,
    [role, id]
  );

  return result;
}

// Delete User
export async function deleteUser(id) {
  const [result] = await db.query(
    "DELETE FROM users WHERE id = ?",
    [id]
  );

  return result;
}