import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import db from "@/lib/db";
import { getCached, setCache } from "@/lib/cache";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Basic counts — 10 min cache
    let staticCounts = getCached("dashboard:static-counts");
    if (!staticCounts) {
      const [[{ degrees }]]   = await db.query("SELECT COUNT(*) AS degrees FROM degrees");
      const [[{ branches }]]  = await db.query("SELECT COUNT(*) AS branches FROM branch");
      const [[{ semesters }]] = await db.query("SELECT COUNT(*) AS semesters FROM semesters");
      const [[{ subjects }]]  = await db.query("SELECT COUNT(*) AS subjects FROM subjects");
      const [[{ solutions }]] = await db.query("SELECT COUNT(*) AS solutions FROM solutions");
      const [[{ users }]]     = await db.query("SELECT COUNT(*) AS users FROM users");
      const [[{ reportTemplates }]] = await db.query("SELECT COUNT(*) AS reportTemplates FROM report_content_templates");
      const [[{ studentReports }]]  = await db.query("SELECT COUNT(*) AS studentReports FROM student_reports");
      staticCounts = {
        degrees:   Number(degrees),
        branches:  Number(branches),
        semesters: Number(semesters),
        subjects:  Number(subjects),
        solutions: Number(solutions),
        users:     Number(users),
        reportTemplates: Number(reportTemplates),
        studentReports:  Number(studentReports),
      };
      setCache("dashboard:static-counts", staticCounts, 600);
    }

    // Revenue stats — 2 min cache (ab solutions + reports dono ka revenue combined hai)
    let revenueStats = getCached("dashboard:revenue-stats");
    if (!revenueStats) {
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

      // Report revenue alag se — student_reports ka apna payment flow hai
      const [[{ reportRevenue }]] = await db.query(
        "SELECT COALESCE(SUM(amount_paid), 0) AS reportRevenue FROM student_reports WHERE payment_status = 'paid'"
      );
      const [[{ reportSales }]] = await db.query(
        "SELECT COUNT(*) AS reportSales FROM student_reports WHERE payment_status = 'paid'"
      );
      const [[{ reportTodayRevenue }]] = await db.query(
        "SELECT COALESCE(SUM(amount_paid), 0) AS reportTodayRevenue FROM student_reports WHERE payment_status = 'paid' AND DATE(created_at) = CURDATE()"
      );
      const [[{ failedGenerations }]] = await db.query(
        "SELECT COUNT(*) AS failedGenerations FROM student_reports WHERE payment_status = 'paid' AND generation_status = 'failed'"
      );

      revenueStats = {
        totalRevenue:   Number(totalRevenue) + Number(reportRevenue),
        totalSales:     Number(totalSales) + Number(reportSales),
        todayRevenue:   Number(todayRevenue) + Number(reportTodayRevenue),
        totalDownloads: Number(totalDownloads),
        trialDownloads: Number(trialDownloads),
        reportRevenue:  Number(reportRevenue),
        reportSales:    Number(reportSales),
        failedGenerations: Number(failedGenerations),
      };
      setCache("dashboard:revenue-stats", revenueStats, 120);
    }

    // Top 5 best selling PDFs — 5 min cache
    let topPdfs = getCached("dashboard:top-pdfs");
    if (!topPdfs) {
      const [rows] = await db.query(
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
      topPdfs = rows;
      setCache("dashboard:top-pdfs", topPdfs, 300);
    }

    // Last 5 transactions — NO cache (admin ko live chahiye)
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

    // Last 7 days revenue (solutions + reports combined) — 5 min cache
    let weeklyRevenue = getCached("dashboard:weekly-revenue");
    if (!weeklyRevenue) {
      const [solutionRows] = await db.query(
        `SELECT DATE(purchased_at) AS date, SUM(amount_paid) AS revenue
         FROM purchases
         WHERE payment_status = 'paid' AND purchased_at >= NOW() - INTERVAL 7 DAY
         GROUP BY DATE(purchased_at)`
      );
      const [reportRows] = await db.query(
        `SELECT DATE(created_at) AS date, SUM(amount_paid) AS revenue
         FROM student_reports
         WHERE payment_status = 'paid' AND created_at >= NOW() - INTERVAL 7 DAY
         GROUP BY DATE(created_at)`
      );

      // Dono ko date ke hisaab se merge karo
      const merged = {};
      for (const row of solutionRows) {
        const key = row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date;
        merged[key] = (merged[key] || 0) + Number(row.revenue);
      }
      for (const row of reportRows) {
        const key = row.date instanceof Date ? row.date.toISOString().slice(0, 10) : row.date;
        merged[key] = (merged[key] || 0) + Number(row.revenue);
      }
      weeklyRevenue = Object.entries(merged)
        .map(([date, revenue]) => ({ date, revenue }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      setCache("dashboard:weekly-revenue", weeklyRevenue, 300);
    }

    return Response.json({
      ...staticCounts,
      ...revenueStats,
      topPdfs,
      recentSales,
      weeklyRevenue,
    });
  } catch (error) {
    console.error("dashboard error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}


// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import db from "@/lib/db";
// import { getCached, setCache } from "@/lib/cache";

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || session.user.role !== "admin") {
//       return Response.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Basic counts — 10 min cache
//     let staticCounts = getCached("dashboard:static-counts");
//     if (!staticCounts) {
//       const [[{ degrees }]]   = await db.query("SELECT COUNT(*) AS degrees FROM degrees");
//       const [[{ branches }]]  = await db.query("SELECT COUNT(*) AS branches FROM branch");
//       const [[{ semesters }]] = await db.query("SELECT COUNT(*) AS semesters FROM semesters");
//       const [[{ subjects }]]  = await db.query("SELECT COUNT(*) AS subjects FROM subjects");
//       const [[{ solutions }]] = await db.query("SELECT COUNT(*) AS solutions FROM solutions");
//       const [[{ users }]]     = await db.query("SELECT COUNT(*) AS users FROM users");
//       staticCounts = {
//         degrees:   Number(degrees),
//         branches:  Number(branches),
//         semesters: Number(semesters),
//         subjects:  Number(subjects),
//         solutions: Number(solutions),
//         users:     Number(users),
//       };
//       setCache("dashboard:static-counts", staticCounts, 600);
//     }

//     // Revenue stats — 2 min cache
//     let revenueStats = getCached("dashboard:revenue-stats");
//     if (!revenueStats) {
//       const [[{ totalRevenue }]] = await db.query(
//         "SELECT COALESCE(SUM(amount_paid), 0) AS totalRevenue FROM purchases WHERE payment_status = 'paid'"
//       );
//       const [[{ totalSales }]] = await db.query(
//         "SELECT COUNT(*) AS totalSales FROM purchases WHERE payment_status = 'paid'"
//       );
//       const [[{ todayRevenue }]] = await db.query(
//         "SELECT COALESCE(SUM(amount_paid), 0) AS todayRevenue FROM purchases WHERE payment_status = 'paid' AND DATE(purchased_at) = CURDATE()"
//       );
//       const [[{ totalDownloads }]] = await db.query(
//         "SELECT COUNT(*) AS totalDownloads FROM download_history"
//       );
//       const [[{ trialDownloads }]] = await db.query(
//         "SELECT COUNT(*) AS trialDownloads FROM download_history WHERE was_trial = 1"
//       );
//       revenueStats = {
//         totalRevenue:   Number(totalRevenue),
//         totalSales:     Number(totalSales),
//         todayRevenue:   Number(todayRevenue),
//         totalDownloads: Number(totalDownloads),
//         trialDownloads: Number(trialDownloads),
//       };
//       setCache("dashboard:revenue-stats", revenueStats, 120);
//     }

//     // Top 5 best selling PDFs — 5 min cache
//     let topPdfs = getCached("dashboard:top-pdfs");
//     if (!topPdfs) {
//       const [rows] = await db.query(
//         `SELECT 
//           s.id,
//           s.title,
//           s.price,
//           COUNT(p.id) AS sales,
//           SUM(p.amount_paid) AS revenue
//          FROM purchases p
//          JOIN solutions s ON p.solution_id = s.id
//          WHERE p.payment_status = 'paid'
//          GROUP BY s.id
//          ORDER BY sales DESC
//          LIMIT 5`
//       );
//       topPdfs = rows;
//       setCache("dashboard:top-pdfs", topPdfs, 300);
//     }

//     // Last 5 transactions — NO cache (admin ko live chahiye)
//     const [recentSales] = await db.query(
//       `SELECT 
//         p.id,
//         u.name AS user_name,
//         u.email,
//         s.title,
//         p.amount_paid,
//         p.purchased_at
//        FROM purchases p
//        JOIN users u ON p.user_id = u.id
//        JOIN solutions s ON p.solution_id = s.id
//        WHERE p.payment_status = 'paid'
//        ORDER BY p.purchased_at DESC
//        LIMIT 5`
//     );

//     // Last 7 days revenue — 5 min cache
//     let weeklyRevenue = getCached("dashboard:weekly-revenue");
//     if (!weeklyRevenue) {
//       const [rows] = await db.query(
//         `SELECT 
//           DATE(purchased_at) AS date,
//           SUM(amount_paid) AS revenue,
//           COUNT(*) AS sales
//          FROM purchases
//          WHERE payment_status = 'paid'
//            AND purchased_at >= NOW() - INTERVAL 7 DAY
//          GROUP BY DATE(purchased_at)
//          ORDER BY date ASC`
//       );
//       weeklyRevenue = rows;
//       setCache("dashboard:weekly-revenue", weeklyRevenue, 300);
//     }

//     return Response.json({
//       ...staticCounts,
//       ...revenueStats,
//       topPdfs,
//       recentSales,
//       weeklyRevenue,
//     });
//   } catch (error) {
//     console.error("dashboard error:", error);
//     return Response.json({ error: String(error) }, { status: 500 });
//   }
// }