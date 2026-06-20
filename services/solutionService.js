// import db from "@/lib/db";

// // Get All Solutions
// export async function getSolutions() {
//   const [rows] = await db.query(`
//     SELECT
//       solutions.*,
//       subjects.name AS subject_name
//     FROM solutions
//     JOIN subjects
//     ON solutions.subject_id = subjects.id
//     ORDER BY solutions.id DESC
//   `);

//   return rows;
// }

// // Add Solution
// export async function addSolution(
//   subject_id,
//   title,
//   solution_type,
//   pdf_url,
//   description,
//   is_premium,
//   price
// ) {
//   const [result] = await db.query(
//     `
//     INSERT INTO solutions
//     (
//       subject_id,
//       title,
//       solution_type,
//       pdf_url,
//       description,
//       is_premium,
//       price
//     )
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//     `,
//     [
//       subject_id,
//       title,
//       solution_type,
//       pdf_url,
//       description,
//       is_premium,
//       price,
//     ]
//   );

//   return result;
// }
// // Update Solution

// export async function updateSolution(
//   id,
//   subject_id,
//   title,
//   solution_type,
//   pdf_url,
//   description,
//   is_premium,
//   price
// ) {
//   const [result] = await db.query(
//     `
//     UPDATE solutions
//     SET
//       subject_id = ?,
//       title = ?,
//       solution_type = ?,
//       pdf_url = ?,
//       description = ?,
//       is_premium = ?,
//       price = ?
//     WHERE id = ?
//     `,
//     [
//       subject_id,
//       title,
//       solution_type,
//       pdf_url,
//       description,
//       is_premium,
//       price,
//       id,
//     ]
//   );

//   return result;
// }





// // Delete Solution
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
//     SELECT
//       solutions.*,
//       subjects.name AS subject_name
//     FROM solutions
//     JOIN subjects
//       ON solutions.subject_id = subjects.id
//     WHERE solutions.subject_id = ?
//     ORDER BY solutions.id DESC
//     `,
//     [subjectId]
//   );

//   return rows;
// }




// // Get Single Solution by ID
// export async function getSolutionById(id) {
//   const [rows] = await db.query(
//     `
//     SELECT
//       solutions.*,
//       subjects.name AS subject_name
//     FROM solutions
//     JOIN subjects
//       ON solutions.subject_id = subjects.id
//     WHERE solutions.id = ?
//     `,
//     [id]
//   );
//   return rows[0];
// }


import db from "@/lib/db";

// Get All Solutions
// FIX: Pehle sirf "subjects" se join hota tha, isliye branch_name,
// semester_number, degree_id, branch_id kabhi response mein aate hi
// nahi the. SolutionForm ki admin table aur Edit-prefill dono isi
// data par depend karte hain — ab poori hierarchy (degrees -> branches
// -> semesters -> subjects) join kar di hai.
export async function getSolutions() {
  const [rows] = await db.query(`
   SELECT
  solutions.*,
  subjects.name AS subject_name,
  subjects.semester_id AS semester_id,
  semesters.semester_number AS semester_number,
  semesters.branch_id AS branch_id,
  branch.name AS branch_name,
  branch.degree_id AS degree_id,
  degrees.name AS degree_name
FROM solutions
JOIN subjects ON solutions.subject_id = subjects.id
JOIN semesters ON subjects.semester_id = semesters.id
JOIN branch ON semesters.branch_id = branch.id
JOIN degrees ON branch.degree_id = degrees.id
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
  is_premium,
  price
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
      is_premium,
      price
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [
      subject_id,
      title,
      solution_type,
      pdf_url,
      description,
      is_premium,
      price,
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
  is_premium,
  price
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
      is_premium = ?,
      price = ?
    WHERE id = ?
    `,
    [
      subject_id,
      title,
      solution_type,
      pdf_url,
      description,
      is_premium,
      price,
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

// Get Single Solution by ID
export async function getSolutionById(id) {
  const [rows] = await db.query(
    `
    SELECT
      solutions.*,
      subjects.name AS subject_name
    FROM solutions
    JOIN subjects
      ON solutions.subject_id = subjects.id
    WHERE solutions.id = ?
    `,
    [id]
  );
  return rows[0];
}