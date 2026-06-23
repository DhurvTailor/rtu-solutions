import { YOUTUBE_CHANNEL_ID } from "@/src/data/socialStats";

// YouTube subscriber count fetch karo
// Same YOUTUBE_API_KEY use ho raha hai jo already .env mein hai
export async function GET() {
  try {
    const apiKey = process.env.YOUTUBE_API_KEY;
    if (!apiKey) {
      return Response.json(
        { error: "YOUTUBE_API_KEY missing" },
        { status: 500 }
      );
    }

    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL_ID}&key=${apiKey}`;
    const res = await fetch(url, {
      // Next.js cache — 1 ghante mein ek baar hi YouTube se fetch karega
      // (quota bachane ke liye)
      next: { revalidate: 3600 },
    });

    const data = await res.json();

    if (data.error) {
      return Response.json(
        { error: data.error.message },
        { status: 500 }
      );
    }

    const stats = data.items?.[0]?.statistics;
    if (!stats) {
      return Response.json({ error: "Channel nahi mila" }, { status: 404 });
    }

    const subscriberCount = parseInt(stats.subscriberCount || 0);
    const viewCount = parseInt(stats.viewCount || 0);
    const videoCount = parseInt(stats.videoCount || 0);

    // Readable format banao (1200 → "1.2K", 1500000 → "1.5M")
    function formatCount(num) {
      if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M+";
      if (num >= 1_000) return (num / 1_000).toFixed(1) + "K+";
      return num.toString() + "+";
    }

    return Response.json({
      success: true,
      subscribers: {
        raw: subscriberCount,
        formatted: formatCount(subscriberCount),
      },
      views: {
        raw: viewCount,
        formatted: formatCount(viewCount),
      },
      videos: {
        raw: videoCount,
        formatted: videoCount.toString(),
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}