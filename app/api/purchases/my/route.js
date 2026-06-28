import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Login karo pehle" }, { status: 401 });
    }

    const [rows] = await db.query(
      `SELECT 
        p.id,
        p.solution_id,
        p.amount_paid,
        p.payment_status,
        p.purchased_at,
        s.title,
        s.solution_type,
        s.thumbnail_blob_name,
        s.price,
        sub.name AS subject_name,
        b.name AS branch_name,
        sem.semester_number,
        d.name AS degree_name
      FROM purchases p
      JOIN solutions s ON p.solution_id = s.id
      JOIN subjects sub ON s.subject_id = sub.id
      JOIN semesters sem ON sub.semester_id = sem.id
      JOIN branch b ON sem.branch_id = b.id
      JOIN degrees d ON b.degree_id = d.id
      WHERE p.user_id = ? AND p.payment_status = 'paid'
      ORDER BY p.purchased_at DESC`,
      [session.user.id]
    );

    return Response.json(rows);
  } catch (error) {
    console.error("my purchases error:", error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}