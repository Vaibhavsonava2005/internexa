"use server";

import ytSearch from "yt-search";

export async function searchYouTubeVideo(query: string) {
  try {
    const r = await ytSearch(query);
    const videos = r.videos;
    if (videos && videos.length > 0) {
      return { success: true, url: videos[0].url };
    }
    return { success: false, error: "No videos found" };
  } catch (error: any) {
    console.error("YouTube search error:", error);
    return { success: false, error: error.message };
  }
}
