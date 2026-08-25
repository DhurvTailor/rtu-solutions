// import db from "../lib/db.js";

// // ---------- Universities ----------
// export async function getUniversities() {
//   const [rows] = await db.query("SELECT * FROM universities ORDER BY name ASC");
//   return rows;
// }
// export async function addUniversity(name) {
//   const [result] = await db.query("INSERT INTO universities (name) VALUES (?)", [name]);
//   return result;
// }
// export async function updateUniversity(id, name) {
//   const [result] = await db.query("UPDATE universities SET name = ? WHERE id = ?", [name, id]);
//   return result;
// }
// export async function deleteUniversity(id) {
//   const [result] = await db.query("DELETE FROM universities WHERE id = ?", [id]);
//   return result;
// }

// // ---------- Colleges ----------
// export async function getColleges() {
//   const [rows] = await db.query(`
//     SELECT colleges.*, universities.name AS university_name
//     FROM colleges
//     JOIN universities ON colleges.university_id = universities.id
//     ORDER BY colleges.name ASC
//   `);
//   return rows;
// }
// export async function getCollegeById(id) {
//   const [rows] = await db.query("SELECT * FROM colleges WHERE id = ?", [id]);
//   return rows[0] || null;
// }
// export async function addCollege(university_id, name, logo_blob_name, city) {
//   const [result] = await db.query(
//     "INSERT INTO colleges (university_id, name, logo_blob_name, city) VALUES (?, ?, ?, ?)",
//     [university_id, name, logo_blob_name, city]
//   );
//   return result;
// }
// export async function updateCollege(id, university_id, name, logo_blob_name, city) {
//   const [result] = await db.query(
//     "UPDATE colleges SET university_id = ?, name = ?, logo_blob_name = ?, city = ? WHERE id = ?",
//     [university_id, name, logo_blob_name, city, id]
//   );
//   return result;
// }
// export async function deleteCollege(id) {
//   const [result] = await db.query("DELETE FROM colleges WHERE id = ?", [id]);
//   return result;
// }

// // ---------- Training Companies ----------
// export async function getTrainingCompanies() {
//   const [rows] = await db.query("SELECT * FROM training_companies ORDER BY name ASC");
//   return rows;
// }
// export async function addTrainingCompany(name) {
//   const [result] = await db.query("INSERT INTO training_companies (name) VALUES (?)", [name]);
//   return result;
// }
// export async function updateTrainingCompany(id, name) {
//   const [result] = await db.query("UPDATE training_companies SET name = ? WHERE id = ?", [name, id]);
//   return result;
// }
// export async function deleteTrainingCompany(id) {
//   const [result] = await db.query("DELETE FROM training_companies WHERE id = ?", [id]);
//   return result;
// }




import db from "../lib/db.js";

// ---------- Universities ----------
export async function getUniversities() {
  const [rows] = await db.query("SELECT * FROM universities ORDER BY name ASC");
  return rows;
}
export async function addUniversity(name) {
  const [result] = await db.query("INSERT INTO universities (name) VALUES (?)", [name]);
  return result;
}
export async function updateUniversity(id, name) {
  const [result] = await db.query("UPDATE universities SET name = ? WHERE id = ?", [name, id]);
  return result;
}
export async function deleteUniversity(id) {
  const [result] = await db.query("DELETE FROM universities WHERE id = ?", [id]);
  return result;
}

// ---------- Colleges ----------
export async function getColleges() {
  const [rows] = await db.query(`
    SELECT colleges.*, universities.name AS university_name
    FROM colleges
    JOIN universities ON colleges.university_id = universities.id
    ORDER BY colleges.name ASC
  `);
  return rows;
}
export async function getCollegeById(id) {
  const [rows] = await db.query("SELECT * FROM colleges WHERE id = ?", [id]);
  return rows[0] || null;
}
export async function addCollege(university_id, name, logo_blob_name, city) {
  const [result] = await db.query(
    "INSERT INTO colleges (university_id, name, logo_blob_name, city) VALUES (?, ?, ?, ?)",
    [university_id, name, logo_blob_name, city]
  );
  return result;
}
export async function updateCollege(id, university_id, name, logo_blob_name, city) {
  const [result] = await db.query(
    "UPDATE colleges SET university_id = ?, name = ?, logo_blob_name = ?, city = ? WHERE id = ?",
    [university_id, name, logo_blob_name, city, id]
  );
  return result;
}
export async function deleteCollege(id) {
  const [result] = await db.query("DELETE FROM colleges WHERE id = ?", [id]);
  return result;
}

// ---------- Training Companies ----------
export async function getTrainingCompanies() {
  const [rows] = await db.query("SELECT * FROM training_companies ORDER BY name ASC");
  return rows;
}
export async function getTrainingCompanyById(id) {
  const [rows] = await db.query("SELECT * FROM training_companies WHERE id = ?", [id]);
  return rows[0] || null;
}
export async function addTrainingCompany(
  name,
  description = null,
  certificate_template_blob_name = null,
  certificate_preview_blob_name = null
) {
  const [result] = await db.query(
    `INSERT INTO training_companies
     (name, description, certificate_template_blob_name, certificate_preview_blob_name)
     VALUES (?, ?, ?, ?)`,
    [name, description, certificate_template_blob_name, certificate_preview_blob_name]
  );
  return result;
}
export async function updateTrainingCompany(
  id,
  name,
  description = null,
  certificate_template_blob_name = null,
  certificate_preview_blob_name = null
) {
  const [result] = await db.query(
    `UPDATE training_companies
     SET name = ?, description = ?, certificate_template_blob_name = ?, certificate_preview_blob_name = ?
     WHERE id = ?`,
    [name, description, certificate_template_blob_name, certificate_preview_blob_name, id]
  );
  return result;
}
export async function deleteTrainingCompany(id) {
  const [result] = await db.query("DELETE FROM training_companies WHERE id = ?", [id]);
  return result;
}