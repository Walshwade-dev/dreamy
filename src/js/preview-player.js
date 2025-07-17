import { fallbackVideos } from './fallback-videos.js';

let player;
let previewTimeout;
let apiReady = false;
let manuallyTriggered = false;
let allowFull = false;

const ytPlayerDiv = document.getElementById("ytPlayer");
const previewModal = document.getElementById("ytPreviewModal");
const endModal = document.getElementById("previewEndModal");

// Fallback audio element
const fallbackAudio = new Audio();
fallbackAudio.volume = 1;

// === Load YouTube API ===
const tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(tag);

// YouTube API Ready
window.onYouTubeIframeAPIReady = () => {
  console.log("✅ YouTube IFrame API is ready");
  player = new YT.Player("ytPlayer", {
    height: "0",
    width: "0",
    events: {
      onReady: () => {
        apiReady = true;
        console.log("✅ YouTube player is ready");
      },
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
};

// === Public API ===
export function allowFullPlayback() {
  allowFull = true;
}

export function playHighlight(videoId, isManual = false) {
  manuallyTriggered = isManual;
  allowFull = isManual;

  console.log("🎬 playHighlight called with:", videoId);

  const fallback = fallbackVideos.find(v => v.videoId === videoId);
  const fallbackAudioUrl = fallback?.audio || `/audio/${videoId}.mp3`;

  window.lastVideoId = videoId;
  window.currentFallbackUrl = fallback?.url || `https://youtube.com/watch?v=${videoId}`;

  if (!apiReady || !player || typeof player.loadVideoById !== "function") {
    console.warn("⏳ Waiting for YouTube API...");
    setTimeout(() => playHighlight(videoId, isManual), 500);
    return;
  }

  // Hide the YouTube modal - audio only
  if (previewModal) {
    previewModal.classList.remove("visible");
    previewModal.classList.add("hidden");
  }

  // Try YouTube
  try {
    player.loadVideoById(videoId);
    console.log("▶️ Loading YouTube video:", videoId);
  } catch (err) {
    console.warn("⚠️ YouTube failed, trying local fallback", err);
    playFallbackAudio(fallbackAudioUrl);
  }

  clearTimeout(previewTimeout);
}

// === Hide Preview Modal ===
export function hidePreviewModal() {
  if (previewModal) {
    previewModal.classList.remove("visible");
    previewModal.classList.add("hidden");
  }

  clearTimeout(previewTimeout);

  if (player && typeof player.stopVideo === "function") {
    player.stopVideo();
  }

  fallbackAudio.pause();
  fallbackAudio.currentTime = 0;

  if (!manuallyTriggered && !allowFull) {
    const evt = new CustomEvent("highlightPreviewEnded", {
      detail: { manuallyTriggered: false }
    });
    window.dispatchEvent(evt);
  }

  manuallyTriggered = false;
}

// === YouTube Playback State ===
function onPlayerStateChange(event) {
  console.log("[YT State]", event.data);

  if (event.data === YT.PlayerState.PLAYING && !allowFull) {
    console.log("✅ YouTube is playing — starting 15s timer");

    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
      console.log("⏰ 15s up — stopping and showing unlock modal");
      hidePreviewModal();
      showPreviewEndModal();
    }, 15000);
  }
}

// === On Error: fallback to local audio ===
function onPlayerError(event) {
  console.warn("❌ YouTube error", event.data);

  const fallback = fallbackVideos.find(v => v.videoId === window.lastVideoId);
  const fallbackAudioUrl = fallback?.audio || `/audio/${window.lastVideoId}.mp3`;

  playFallbackAudio(fallbackAudioUrl);
}

// === Play fallback MP3 ===
function playFallbackAudio(src) {
  fallbackAudio.src = src;

  fallbackAudio.play().then(() => {
    console.log("🎵 Playing fallback audio");
    previewTimeout = setTimeout(() => {
      console.log("⏰ 15s fallback reached — stopping audio");
      fallbackAudio.pause();
      fallbackAudio.currentTime = 0;
      showPreviewEndModal();
    }, 15000);
  }).catch(err => {
    console.error("❌ Fallback audio failed to play:", err);
    showPreviewEndModal();
  });
}

// === Show Unlock Modal ===
export function showPreviewEndModal() {
  if (endModal) {  
    endModal.classList.remove("hidden");
    endModal.classList.add("visible");

    const evt = new CustomEvent("previewUnlockRequired", {
      detail: { videoId: window.lastVideoId }
    });
    window.dispatchEvent(evt);
  }
}
