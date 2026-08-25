import db from "../lib/db.js";

export async function createStudentReport(data) {
  const {
    user_id, content_template_id, college_id, training_company_id,
    branch_id, degree_id, semester_id, academic_session,
    student_name, roll_no, guide_name, hod_name,
    training_start_date, training_end_date, amount_paid,
  } = data;

  const [result] = await db.query(
    `INSERT INTO student_reports
     (user_id, content_template_id, college_id, training_company_id, branch_id, degree_id, semester_id,
      academic_session, student_name, roll_no, guide_name, hod_name, training_start_date, training_end_date, amount_paid)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, content_template_id, college_id, training_company_id, branch_id, degree_id, semester_id,
     academic_session, student_name, roll_no, guide_name, hod_name, training_start_date, training_end_date, amount_paid]
  );
  return result.insertId;
}

export async function attachRazorpayOrder(studentReportId, razorpayOrderId) {
  const [result] = await db.query(
    "UPDATE student_reports SET razorpay_order_id = ? WHERE id = ?",
    [razorpayOrderId, studentReportId]
  );
  return result;
}

export async function getStudentReportById(id) {
  const [rows] = await db.query(
    `
    SELECT sr.*, rct.title AS template_title, rct.price AS template_price,
           col.name AS college_name, tc.name AS training_company_name
    FROM student_reports sr
    JOIN report_content_templates rct ON sr.content_template_id = rct.id
    JOIN colleges col ON sr.college_id = col.id
    JOIN training_companies tc ON sr.training_company_id = tc.id
    WHERE sr.id = ?
    `,
    [id]
  );
  return rows[0] || null;
}

export async function getStudentReportByRazorpayOrderId(razorpayOrderId) {
  const [rows] = await db.query(
    "SELECT * FROM student_reports WHERE razorpay_order_id = ? LIMIT 1",
    [razorpayOrderId]
  );
  return rows[0] || null;
}

export async function markStudentReportPaid(razorpayOrderId, paymentId, signature) {
  const [result] = await db.query(
    `UPDATE student_reports
     SET payment_status = 'paid', payment_id = ?, razorpay_signature = ?
     WHERE razorpay_order_id = ?`,
    [paymentId, signature, razorpayOrderId]
  );
  return result;
}

export async function getMyStudentReports(userId) {
  const [rows] = await db.query(
    `
    SELECT sr.id, sr.payment_status, sr.generation_status, sr.amount_paid, sr.created_at,
           rct.title AS template_title, col.name AS college_name
    FROM student_reports sr
    JOIN report_content_templates rct ON sr.content_template_id = rct.id
    JOIN colleges col ON sr.college_id = col.id
    WHERE sr.user_id = ?
    ORDER BY sr.id DESC
    `,
    [userId]
  );
  return rows;
}

// Sirf unpaid reports delete ho sakti hain — paid record kabhi delete nahi hota
export async function deleteUnpaidStudentReport(id, userId) {
  const [result] = await db.query(
    "DELETE FROM student_reports WHERE id = ? AND user_id = ? AND payment_status != 'paid'",
    [id, userId]
  );
  return result;
}

// ================= ADMIN FUNCTIONS =================

// Admin ke liye — saare students ke reports, user info ke saath
export async function getAllStudentReportsAdmin(limit = 200) {
  const [rows] = await db.query(
    `
    SELECT
      sr.id, sr.payment_status, sr.generation_status, sr.amount_paid,
      sr.student_name, sr.roll_no, sr.created_at, sr.generated_report_blob_name,
      rct.title AS template_title,
      col.name AS college_name,
      tc.name AS training_company_name,
      u.name AS user_name, u.email AS user_email
    FROM student_reports sr
    JOIN report_content_templates rct ON sr.content_template_id = rct.id
    JOIN colleges col ON sr.college_id = col.id
    JOIN training_companies tc ON sr.training_company_id = tc.id
    JOIN users u ON sr.user_id = u.id
    ORDER BY sr.id DESC
    LIMIT ?
    `,
    [limit]
  );
  return rows;
}

// Admin download ke liye — ownership check ke bina, sirf ID se
export async function getStudentReportByIdAdmin(id) {
  const [rows] = await db.query("SELECT * FROM student_reports WHERE id = ?", [id]);
  return rows[0] || null;
}