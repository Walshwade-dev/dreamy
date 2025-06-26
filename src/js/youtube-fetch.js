// src/js/youtube-fetch.js
const API_KEY = 'AIzaSyDvLZ7SENnqbWlUPR2YsWXGratQqdDvPIE';
const CHANNEL_ID = 'UCd7g2bMxgJHncQn3htSDUMQ';
const MAX_RESULTS = 10;

export async function fetchYouTubeVideos() {
  const endpoint = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet&type=video&maxResults=${MAX_RESULTS}`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    if (!data.items) {
      throw new Error("No video data found. Check quota or channel ID.");
    }

    return data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      releaseDate: new Date(item.snippet.publishedAt).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'short',
      }),
      defaultThumb: item.snippet.thumbnails.high.url,
    }));
  } catch (err) {
    console.error("YouTube Fetch Error:", err);
    return [];
  }
}
