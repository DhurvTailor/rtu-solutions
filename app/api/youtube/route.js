// // import { google } from "googleapis";

// // export async function GET() {
// //   try {
// //     const youtube = google.youtube({
// //       version: "v3",
// //       auth: process.env.YOUTUBE_API_KEY,
// //     });

// //     const response = await youtube.search.list({
// //       part: ["snippet"],
// //       channelId: "UCxZxyvd-Gy9NRvsTRuncSvA",
// //       maxResults: 20,
// //       order: "date",
// //       type: ["video"],
// //     });

// //     return Response.json(response.data);

// //   } catch (error) {
// //     console.error(error);

// //     return Response.json(
// //       { error: "Failed to fetch videos" },
// //       { status: 500 }
// //     );
// //   }
// // }



// import { google } from "googleapis";

// export async function GET() {
//   try {
//     const youtube = google.youtube({
//       version: "v3",
//       auth: process.env.YOUTUBE_API_KEY,
//     });

//     const searchResponse = await youtube.search.list({
//       part: ["snippet"],
//       channelId: "UCxZxyvd-Gy9NRvsTRuncSvA",
//       maxResults: 20,
//       order: "date",
//       type: ["video"],
//     });

//     const items = searchResponse.data.items || [];
//     const videoIds = items
//       .map((item) => item.id?.videoId)
//       .filter(Boolean);

//     // View counts alag call se milte hain, search API me nahi aate
//     let statsMap = {};
//     if (videoIds.length > 0) {
//       const statsResponse = await youtube.videos.list({
//         part: ["statistics"],
//         id: videoIds,
//       });

//       statsResponse.data.items?.forEach((video) => {
//         statsMap[video.id] = video.statistics?.viewCount || "0";
//       });
//     }

//     // Har video item me viewCount inject karo
//     const itemsWithStats = items.map((item) => ({
//       ...item,
//       statistics: {
//         viewCount: statsMap[item.id?.videoId] || "0",
//       },
//     }));

//     return Response.json({ items: itemsWithStats });
//   } catch (error) {
//     console.error(error);
//     return Response.json(
//       { error: "Failed to fetch videos" },
//       { status: 500 }
//     );
//   }
// }




import { google } from "googleapis";
import { getCached, setCache } from "@/lib/cache.js";   // 🆕 NEW LINE

export async function GET() {
  try {
    const cached = getCached("youtube-videos");                    // 🆕 NEW
    if (cached) return Response.json(cached);                       // 🆕 NEW

    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });

    const searchResponse = await youtube.search.list({
      part: ["snippet"],
      channelId: "UCxZxyvd-Gy9NRvsTRuncSvA",
      maxResults: 20,
      order: "date",
      type: ["video"],
    });

    const items = searchResponse.data.items || [];
    const videoIds = items
      .map((item) => item.id?.videoId)
      .filter(Boolean);

    // View counts alag call se milte hain, search API me nahi aate
    let statsMap = {};
    if (videoIds.length > 0) {
      const statsResponse = await youtube.videos.list({
        part: ["statistics"],
        id: videoIds,
      });

      statsResponse.data.items?.forEach((video) => {
        statsMap[video.id] = video.statistics?.viewCount || "0";
      });
    }

    // Har video item me viewCount inject karo
    const itemsWithStats = items.map((item) => ({
      ...item,
      statistics: {
        viewCount: statsMap[item.id?.videoId] || "0",
      },
    }));

    const result = { items: itemsWithStats };

    setCache("youtube-videos", result, 21600);                       // 🆕 NEW (6hr)

    return Response.json(result);
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}