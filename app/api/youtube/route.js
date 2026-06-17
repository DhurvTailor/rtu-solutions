import { google } from "googleapis";

export async function GET() {
  try {
    const youtube = google.youtube({
      version: "v3",
      auth: process.env.YOUTUBE_API_KEY,
    });

    const response = await youtube.search.list({
      part: ["snippet"],
      channelId: "UCxZxyvd-Gy9NRvsTRuncSvA",
      maxResults: 20,
      order: "date",
      type: ["video"],
    });

    return Response.json(response.data);

  } catch (error) {
    console.error(error);

    return Response.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
  }
}