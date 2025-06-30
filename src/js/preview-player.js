import { showDefaultHeroImage } from './index.js'; // ← this won't work in modules unless exported properly


let player;
let previewTimeout;
let apiReady = false;
let pendingVideoId = null;

// Load YouTube IFrame API once if not already present
if (typeof YT === "undefined") {
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(script);
}

// YouTube API callback
window.onYouTubeIframeAPIReady = () => {
  player = new YT.Player("ytPlayer", {
    height: "360",
    width: "640",
    videoId: "",
    events: {
      onReady: () => {
        apiReady = true;
        if (pendingVideoId) {
          playHighlight(pendingVideoId);
          pendingVideoId = null;
        }
      },
      onStateChange: onPlayerStateChange,
    },
  });
};

// Play highlight preview (invisible)
export function playHighlight(videoId) {
  if (!apiReady || !player || typeof player.loadVideoById !== "function") {
    console.warn("Player not ready yet, retrying...");
    pendingVideoId = videoId;
    setTimeout(() => playHighlight(videoId), 500);
    return;
  }

  document.getElementById("ytPreviewModal").style.display = "block";
  player.loadVideoById(videoId);
}

// Hide preview modal and stop audio
export function hidePreviewModal() {
  const modal = document.getElementById("ytPreviewModal");
  if (modal) modal.style.display = "none";

  if (player && typeof player.stopVideo === "function") {
    player.stopVideo();
  }

  clearTimeout(previewTimeout);

  // 👋 Show "Say Hi" modal
  const endModal = document.getElementById("previewEndModal");
  if (endModal) endModal.classList.remove("hidden");
}

// Auto-stop after 15 seconds
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
      hidePreviewModal();
    }, 15000);
  }
}
