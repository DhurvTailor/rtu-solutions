// // // import { NextRequest, NextResponse } from "next/server";
// // // import { getSolutionById } from "@/services/solutionService";
// // // import { getSecureDownloadURL } from "@/lib/azureBlob";

// // // export async function GET(req: NextRequest) {
// // //   try {
// // //     const { searchParams } = new URL(req.url);
// // //     const id = searchParams.get("id");

// // //     if (!id) {
// // //       return NextResponse.json(
// // //         { error: "Solution ID chahiye" },
// // //         { status: 400 }
// // //       );
// // //     }

// // //     const solution = await getSolutionById(id);
// // //     if (!solution) {
// // //       return NextResponse.json(
// // //         { error: "Solution nahi mila" },
// // //         { status: 404 }
// // //       );
// // //     }

// // //     if (!solution.pdf_url) {
// // //       return NextResponse.json(
// // //         { error: "Is solution ke saath koi PDF attach nahi hai" },
// // //         { status: 404 }
// // //       );
// // //     }

// // //     // NOTE: solution.pdf_url yahan blobName hai (poora URL nahi),
// // //     // isliye seedha getSecureDownloadURL ko pass kar rahe hain.
// // //     // Dusra argument filename hai — isse browser file ko save karte
// // //     // waqt solution ka title use karega, blobName ka random naam nahi.
// // //     // TODO (baad mein add karna): Agar solution.is_premium === 1 hai,
// // //     // to yahan check karo ki logged-in user ne purchases table mein
// // //     // is solution_id ke against payment_status = 'paid' kiya hai ya nahi.
// // //     // Abhi ke liye sab downloads free hain.
// // //     const downloadFileName = `${solution.title || "solution"}.pdf`;
// // //     const sasUrl = await getSecureDownloadURL(solution.pdf_url, downloadFileName);

// // //     return NextResponse.redirect(sasUrl);
// // //   } catch (error) {
// // //     console.error("Download error:", error);
// // //     return NextResponse.json(
// // //       { error: "Download link generate nahi ho paaya", details: String(error) },
// // //       { status: 500 }
// // //     );
// // //   }
// // // }



// // import { NextRequest, NextResponse } from "next/server";
// // import { getServerSession } from "next-auth";
// // import { authOptions } from "@/lib/authOptions";
// // import { getSolutionById } from "@/services/solutionService";
// // import { hasUserPurchased } from "@/services/purchaseService";
// // import { getSecureDownloadURL } from "@/lib/azureBlob";

// // export async function GET(req: NextRequest) {
// //   try {
// //     const { searchParams } = new URL(req.url);
// //     const id = searchParams.get("id");
// //     if (!id) {
// //       return NextResponse.json({ error: "Solution ID chahiye" }, { status: 400 });
// //     }

// //     const solution = await getSolutionById(id);
// //     if (!solution) {
// //       return NextResponse.json({ error: "Solution nahi mila" }, { status: 404 });
// //     }
// //     if (!solution.pdf_url) {
// //       return NextResponse.json({ error: "Is solution ke saath koi PDF attach nahi hai" }, { status: 404 });
// //     }

// //     // ── NEW: premium solution hai to payment verify karna zaroori hai ──
// //     if (solution.is_premium) {
// //       const session = await getServerSession(authOptions);
// //       if (!session) {
// //         return NextResponse.json(
// //           { error: "Ye premium PDF hai, pehle login aur payment karo" },
// //           { status: 401 }
// //         );
// //       }
// //       const userId = (session.user as any).id;
// //       const purchased = await hasUserPurchased(userId, solution.id);
// //       if (!purchased) {
// //         return NextResponse.json(
// //           { error: "Pehle payment complete karo, tabhi download hoga" },
// //           { status: 403 }
// //         );
// //       }
// //     }

// //     const downloadFileName = `${solution.title || "solution"}.pdf`;
// //     const sasUrl = await getSecureDownloadURL(solution.pdf_url, downloadFileName);
// //     return NextResponse.redirect(sasUrl);
// //   } catch (error) {
// //     console.error("Download error:", error);
// //     return NextResponse.json(
// //       { error: "Download link generate nahi ho paaya", details: String(error) },
// //       { status: 500 }
// //     );
// //   }
// // }




// import { NextRequest, NextResponse } from "next/server";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/authOptions";
// import { getSolutionById } from "@/services/solutionService";
// import { hasUserPurchased } from "@/services/purchaseService";
// import { getSecureDownloadURL } from "@/lib/azureBlob";
// import { logDownload } from "@/services/downloadHistoryService";

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

//     // ── NEW: history track karne ke liye ab har download ke liye login zaroori hai ──
//     // (free aur premium dono ke liye), warna userId hi nahi milega log karne ke liye.
//     const session = await getServerSession(authOptions);
//     if (!session) {
//       return NextResponse.redirect(new URL("/login", req.url));
//     }
//     const userId = (session.user as any).id;

//     // Premium hai to purchase verify karo
//     if (solution.is_premium) {
//       const purchased = await hasUserPurchased(userId, solution.id);
//       if (!purchased) {
//         return NextResponse.json(
//           { error: "Pehle payment complete karo, tabhi download hoga" },
//           { status: 403 }
//         );
//       }
//     }

//     const downloadFileName = `${solution.title || "solution"}.pdf`;
//     const sasUrl = await getSecureDownloadURL(solution.pdf_url, downloadFileName);

//     // ── NEW: har successful download history mein log karo ──
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
import db from "@/lib/db";

const FREE_TRIAL_LIMIT = 2;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Solution ID chahiye" }, { status: 400 });
    }

    const solution = await getSolutionById(id);
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
        // 2. Purchase nahi kiya — trial check karo
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