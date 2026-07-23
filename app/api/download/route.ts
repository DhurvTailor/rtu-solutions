


// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { getSolutionById } from "@/services/solutionService";
// import { hasUserPurchased } from "@/services/purchaseService";
// import { getSecureDownloadURL } from "@/lib/azureBlob";
// import { logDownload } from "@/services/downloadHistoryService";
// import db from "@/lib/db";

// const FREE_TRIAL_LIMIT = 2;

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get("id");
//     if (!id) {
//       return NextResponse.json({ error: "Solution ID chahiye" }, { status: 400 });
//     }

//     const solution = await getSolutionById(id);
//     if (!solution) {
//       return NextResponse.json({ error: "Solution nahi mila" }, { status: 404 });
//     }
//     if (!solution.pdf_url) {
//       return NextResponse.json(
//         { error: "Is solution ke saath koi PDF attach nahi hai" },
//         { status: 404 }
//       );
//     }

//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//     const userId = (session.user as any).id;

//     // Premium hai to check karo
//     if (solution.is_premium) {
//       // 1. Pehle check karo — kya purchase kiya hai?
//       const purchased = await hasUserPurchased(userId, solution.id);

//       if (!purchased) {
//         // 2. Purchase nahi kiya — trial check karo
//         const [[{ trialCount }]]: any = await db.query(
//           "SELECT COUNT(*) AS trialCount FROM download_history WHERE user_id = ? AND was_trial = 1",
//           [userId]
//         );

//         const trialsUsed = Number(trialCount);

//         if (trialsUsed >= FREE_TRIAL_LIMIT) {
//           // Trial bhi khatam — block karo
//           return NextResponse.json(
//             { error: "Pehle payment complete karo, tabhi download hoga" },
//             { status: 403 }
//           );
//         }

//         // Trial available hai — record karo aur download karne do
//         await db.query(
//           `INSERT IGNORE INTO download_history (user_id, solution_id, was_trial)
//            VALUES (?, ?, 1)`,
//           [userId, id]
//         );

//         const downloadFileName = `${solution.title || "solution"}.pdf`;
//         const sasUrl = await getSecureDownloadURL(solution.pdf_url, downloadFileName);
//         return NextResponse.redirect(sasUrl);
//       }
//     }

//     // Free solution ya purchased premium — seedha download
//     const downloadFileName = `${solution.title || "solution"}.pdf`;
//     const sasUrl = await getSecureDownloadURL(solution.pdf_url, downloadFileName);
//     await logDownload(userId, solution.id, false);

//     return NextResponse.redirect(sasUrl);
//   } catch (error) {
//     console.error("Download error:", error);
//     return NextResponse.json(
//       { error: "Download link generate nahi ho paaya", details: String(error) },
//       { status: 500 }
//     );
//   }
// }


import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getSolutionById } from "@/services/solutionService";
import { hasUserPurchased } from "@/services/purchaseService";
import { getSecureDownloadURL } from "@/lib/azureBlob";
import { logDownload } from "@/services/downloadHistoryService";
import { getCached, setCache } from "@/lib/cache";
import db from "@/lib/db";

const FREE_TRIAL_LIMIT = 2;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Solution ID chahiye" }, { status: 400 });
    }

    // Solution metadata — 5 min cache (pdf_url, title, is_premium kabhi nahi badlta)
    let solution = getCached(`solution:${id}`);
    if (!solution) {
      solution = await getSolutionById(id);
      if (solution) setCache(`solution:${id}`, solution, 300);
    }

    if (!solution) {
      return NextResponse.json({ error: "Solution nahi mila" }, { status: 404 });
    }
    if (!solution.pdf_url) {
      return NextResponse.json(
        { error: "Is solution ke saath koi PDF attach nahi hai" },
        { status: 404 }
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const userId = (session.user as any).id;

    // Premium hai to check karo
    if (solution.is_premium) {
      // 1. Pehle check karo — kya purchase kiya hai?
      const purchased = await hasUserPurchased(userId, solution.id);

      if (!purchased) {
        // 2. Purchase nahi kiya — trial check karo (real-time, no cache)
        const [[{ trialCount }]]: any = await db.query(
          "SELECT COUNT(*) AS trialCount FROM download_history WHERE user_id = ? AND was_trial = 1",
          [userId]
        );

        const trialsUsed = Number(trialCount);

        if (trialsUsed >= FREE_TRIAL_LIMIT) {
          // Trial bhi khatam — block karo
          return NextResponse.json(
            { error: "Pehle payment complete karo, tabhi download hoga" },
            { status: 403 }
          );
        }

        // Trial available hai — record karo aur download karne do
        await db.query(
          `INSERT IGNORE INTO download_history (user_id, solution_id, was_trial)
           VALUES (?, ?, 1)`,
          [userId, id]
        );

        const downloadFileName = `${solution.title || "solution"}.pdf`;
        const sasUrl = await getSecureDownloadURL(solution.pdf_url, downloadFileName);
        return NextResponse.redirect(sasUrl);
      }
    }

    // Free solution ya purchased premium — seedha download
    const downloadFileName = `${solution.title || "solution"}.pdf`;
    const sasUrl = await getSecureDownloadURL(solution.pdf_url, downloadFileName);
    await logDownload(userId, solution.id, false);

    return NextResponse.redirect(sasUrl);
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Download link generate nahi ho paaya", details: String(error) },
      { status: 500 }
    );
  }
}