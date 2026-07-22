// import db from "@/lib/db";

// const VIDEO_IDS = [
//   "QZUhCYttZg0",
//   "8J742kB1tQg",
//   "XmZHgPr9f4I",
// ];

// const MAX_TESTIMONIALS = 50;

// // GET — frontend ke liye saare comments fetch karo
// export async function GET() {
//   try {
//     const [rows] = await db.query(
//       `SELECT * FROM testimonials ORDER BY likes DESC, published_at DESC`
//     );
//     return Response.json(rows);
//   } catch (error) {
//     return Response.json({ message: error.message }, { status: 500 });
//   }
// }

// // POST — YouTube se sync karo (admin manually trigger karega)
// export async function POST() {
//   try {
//     const apiKey = process.env.YOUTUBE_API_KEY;
//     if (!apiKey) {
//       return Response.json(
//         { message: "YOUTUBE_API_KEY missing hai .env mein" },
//         { status: 500 }
//       );
//     }

//     let allComments = [];

//     // Teen videos ke comments fetch karo
//     for (const videoId of VIDEO_IDS) {
//       try {
//         const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&order=relevance&key=${apiKey}`;
//         const res = await fetch(url);
//         const data = await res.json();

//         if (data.error) {
//           console.error(`Video ${videoId} error:`, data.error.message);
//           continue;
//         }

//         const comments = (data.items || []).map((item) => {
//           const snippet = item.snippet.topLevelComment.snippet;
//           return {
//             youtube_comment_id: item.id,
//             video_id: videoId,
//             author_name: snippet.authorDisplayName,
//             author_img: snippet.authorProfileImageUrl,
//             comment_text: snippet.textDisplay,
//             likes: snippet.likeCount || 0,
//             published_at: new Date(snippet.publishedAt),
//           };
//         });

//         allComments = [...allComments, ...comments];
//       } catch (err) {
//         console.error(`Video ${videoId} fetch failed:`, err.message);
//       }
//     }

//     if (allComments.length === 0) {
//       return Response.json({ message: "Koi comment nahi mila" });
//     }

//     // Sirf meaningful comments rakho (3+ words, 10+ characters)
//     const filtered = allComments.filter(
//       (c) =>
//         c.comment_text.length > 10 &&
//         c.comment_text.split(" ").length >= 3
//     );

//     // Likes ke hisaab se sort karo — best comments upar
//     filtered.sort((a, b) => b.likes - a.likes);

//     let inserted = 0;
//     let skipped = 0;

//     for (const comment of filtered) {
//       // UNIQUE constraint ki wajah se duplicate check hoga automatically
//       try {
//         // Current count check karo
//         const [[{ count }]] = await db.query(
//           "SELECT COUNT(*) AS count FROM testimonials"
//         );

//         if (count >= MAX_TESTIMONIALS) {
//           // Sliding window — sabse purana/kam liked delete karo
//           await db.query(
//             `DELETE FROM testimonials 
//              ORDER BY likes ASC, published_at ASC 
//              LIMIT 1`
//           );
//         }

//         await db.query(
//           `INSERT IGNORE INTO testimonials 
//            (youtube_comment_id, video_id, author_name, author_img, comment_text, likes, published_at)
//            VALUES (?, ?, ?, ?, ?, ?, ?)`,
//           [
//             comment.youtube_comment_id,
//             comment.video_id,
//             comment.author_name,
//             comment.author_img,
//             comment.comment_text,
//             comment.likes,
//             comment.published_at,
//           ]
//         );
//         inserted++;
//       } catch (err) {
//         if (err.code === "ER_DUP_ENTRY") {
//           skipped++;
//         } else {
//           console.error("Insert error:", err.message);
//         }
//       }
//     }

//     return Response.json({
//       success: true,
//       message: `Sync complete — ${inserted} naye comments add hue, ${skipped} already the`,
//       total: filtered.length,
//     });
//   } catch (error) {
//     return Response.json({ message: error.message }, { status: 500 });
//   }
// }





import db from "@/lib/db";
import { getCached, setCache ,clearCache } from "@/lib/cache.js";   // 🆕 NEW LINE

const VIDEO_IDS = [
  "QZUhCYttZg0",
  "8J742kB1tQg",
  "XmZHgPr9f4I",
];

const MAX_TESTIMONIALS = 50;

// GET — frontend ke liye saare comments fetch karo
export async function GET() {
  try {
    const cached = getCached("testimonials");                    // 🆕 NEW
    if (cached) return Response.json(cached);                     // 🆕 NEW

    const [rows] = await db.query(
      `SELECT * FROM testimonials ORDER BY likes DESC, published_at DESC`
    );

    setCache("testimonials", rows, 3600);                          // 🆕 NEW

    return Response.json(rows);
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}

// POST — YouTube se sync karo (admin manually trigger karega)
export async function POST() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return Response.json(
        { message: "YOUTUBE_API_KEY missing hai .env mein" },
        { status: 500 }
      );
    }

    let allComments = [];

    // Teen videos ke comments fetch karo
    for (const videoId of VIDEO_IDS) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=20&order=relevance&key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.error) {
          console.error(`Video ${videoId} error:`, data.error.message);
          continue;
        }

        const comments = (data.items || []).map((item) => {
          const snippet = item.snippet.topLevelComment.snippet;
          return {
            youtube_comment_id: item.id,
            video_id: videoId,
            author_name: snippet.authorDisplayName,
            author_img: snippet.authorProfileImageUrl,
            comment_text: snippet.textDisplay,
            likes: snippet.likeCount || 0,
            published_at: new Date(snippet.publishedAt),
          };
        });

        allComments = [...allComments, ...comments];
      } catch (err) {
        console.error(`Video ${videoId} fetch failed:`, err.message);
      }
    }

    if (allComments.length === 0) {
      return Response.json({ message: "Koi comment nahi mila" });
    }

    // Sirf meaningful comments rakho (3+ words, 10+ characters)
    const filtered = allComments.filter(
      (c) =>
        c.comment_text.length > 10 &&
        c.comment_text.split(" ").length >= 3
    );

    // Likes ke hisaab se sort karo — best comments upar
    filtered.sort((a, b) => b.likes - a.likes);

    let inserted = 0;
    let skipped = 0;

    for (const comment of filtered) {
      // UNIQUE constraint ki wajah se duplicate check hoga automatically
      try {
        // Current count check karo
        const [[{ count }]] = await db.query(
          "SELECT COUNT(*) AS count FROM testimonials"
        );

        if (count >= MAX_TESTIMONIALS) {
          // Sliding window — sabse purana/kam liked delete karo
          await db.query(
            `DELETE FROM testimonials 
             ORDER BY likes ASC, published_at ASC 
             LIMIT 1`
          );
        }

        await db.query(
          `INSERT IGNORE INTO testimonials 
           (youtube_comment_id, video_id, author_name, author_img, comment_text, likes, published_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            comment.youtube_comment_id,
            comment.video_id,
            comment.author_name,
            comment.author_img,
            comment.comment_text,
            comment.likes,
            comment.published_at,
          ]
        );
        inserted++;
      } catch (err) {
        if (err.code === "ER_DUP_ENTRY") {
          skipped++;
        } else {
          console.error("Insert error:", err.message);
        }
      }
    }

    clearCache("testimonials");   // 🆕 NEW — sync ke baad purana cache hatao

    return Response.json({
      success: true,
      message: `Sync complete — ${inserted} naye comments add hue, ${skipped} already the`,
      total: filtered.length,
    });
  } catch (error) {
    return Response.json({ message: error.message }, { status: 500 });
  }
}