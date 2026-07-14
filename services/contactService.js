import pool from "../lib/db";

// Naya contact submission add karo
export async function addContactSubmission({ name, phone, email, role, subject, message }) {
  const [result] = await pool.query(
    `INSERT INTO contact_submissions (name, phone, email, role, subject, message)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [name, phone, email, role, subject || null, message]
  );
  return { id: result.insertId };
}

// Saare submissions (admin ke liye) - latest pehle
export async function getAllContactSubmissions() {
  const [rows] = await pool.query(
    `SELECT * FROM contact_submissions ORDER BY created_at DESC`
  );
  return rows;
}

// Single submission by id
export async function getContactSubmissionById(id) {
  const [rows] = await pool.query(
    `SELECT * FROM contact_submissions WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}