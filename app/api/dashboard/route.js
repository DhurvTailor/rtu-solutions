// import { getDegrees } from "@/services/degreeService";
// import { getBranches } from "@/services/branchService";
// import { getSemesters } from "@/services/semesterService";
// import { getSubjects } from "@/services/subjectService";
// import { getSolutions } from "@/services/solutionService";
// import { getUsers } from "@/services/userService";

// export async function GET() {
//   try {
//     const [degrees, branches, semesters, subjects, solutions, users] =
//       await Promise.all([
//         getDegrees(),
//         getBranches(),
//         getSemesters(),
//         getSubjects(),
//         getSolutions(),
//         getUsers(),
//       ]);

//     return Response.json({
//       degrees: degrees.length,
//       branches: branches.length,
//       semesters: semesters.length,
//       subjects: subjects.length,
//       solutions: solutions.length,
//       users: users.length,
//     });
//   } catch (error) {
//     console.log(error);
//     return Response.json(
//       { message: "Failed to fetch stats" },
//       { status: 500 }
//     );
//   }
// }


import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Basic counts
    const [[{ degrees }]] = await db.query("SELECT COUNT(*) AS degrees FROM degrees");
    const [[{ branches }]] = await db.query("SELECT COUNT(*) AS branches FROM branch");
    const [[{ semesters }]] = await db.query("SELECT COUNT(*) AS semesters FROM semesters");
    const [[{ subjects }]] = await db.query("SELECT COUNT(*) AS subjects FROM subjects");
    const [[{ solutions }]] = await db.query("SELECT COUNT(*) AS solutions FROM solutions");
    const [[{ users }]] = await db.query("SELECT COUNT(*) AS users FROM users");

    // Revenue stats
    const [[{ totalRevenue }]] = await db.query(
      "SELECT COALESCE(SUM(amount_paid), 0) AS totalRevenue FROM purchases WHERE payment_status = 'paid'"
    );
    const [[{ totalSales }]] = await db.query(
      "SELECT COUNT(*) AS totalSales FROM purchases WHERE payment_status = 'paid'"
    );
    const [[{ todayRevenue }]] = await db.query(
      "SELECT COALESCE(SUM(amount_paid), 0) AS todayRevenue FROM purchases WHERE payment_status = 'paid' AND DATE(purchased_at) = CURDATE()"
    );
    const [[{ totalDownloads }]] = await db.query(
      "SELECT COUNT(*) AS totalDownloads FROM download_history"
    );
    const [[{ trialDownloads }]] = await db.query(
      "SELECT COUNT(*) AS trialDownloads FROM download_history WHERE was_trial = 1"
    );

    // Top 5 best selling PDFs
    const [topPdfs] = await db.query(
      `SELECT 
        s.id,
        s.title,
        s.price,
        COUNT(p.id) AS sales,
        SUM(p.amount_paid) AS revenue
       FROM purchases p
       JOIN solutions s ON p.solution_id = s.id
       WHERE p.payment_status = 'paid'
       GROUP BY s.id
       ORDER BY sales DESC
       LIMIT 5`
    );

    // Last 5 transactions
    const [recentSales] = await db.query(
      `SELECT 
        p.id,
        u.name AS user_name,
        u.email,
        s.title,
        p.amount_paid,
        p.purchased_at
       FROM purchases p
       JOIN users u ON p.user_id = u.id
       JOIN solutions s ON p.solution_id = s.id
       WHERE p.payment_status = 'paid'
       ORDER BY p.purchased_at DESC
       LIMIT 5`
    );

    // Last 7 days revenue
    const [weeklyRevenue] = await db.query(
      `SELECT 
        DATE(purchased_at) AS date,
        SUM(amount_paid) AS revenue,
        COUNT(*) AS sales
       FROM purchases
       WHERE payment_status = 'paid'
         AND purchased_at >= NOW() - INTERVAL 7 DAY
       GROUP BY DATE(purchased_at)
       ORDER BY date ASC`
    );

    return Response.json({
      degrees: Number(degrees),
      branches: Number(branches),
      semesters: Number(semesters),
      subjects: Number(subjects),
      solutions: Number(solutions),
      users: Number(users),
      totalRevenue: Number(totalRevenue),
      totalSales: Number(totalSales),
      todayRevenue: Number(todayRevenue),
      totalDownloads: Number(totalDownloads),
      trialDownloads: Number(trialDownloads),
      topPdfs,
      recentSales,
      weeklyRevenue,
    });
  } catch (error) {
    console.error("dashboard error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}