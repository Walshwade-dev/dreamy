import { fallbackVideos } from './fallback-videos.js';

let player;
let previewTimeout;
let apiReady = false;
let highlightManuallyTriggered = false;

// Optional: remember current video ID
let currentVideoId = null;

// ⏯️ External Trigger
export function playHighlight(videoId, isManual = false) {
  highlightManuallyTriggered = isManual;

  // ⛔ Stop any existing preview (including timeout + modal trigger)
  if (player && typeof player.stopVideo === "function") {
    player.stopVideo();
  }
  clearTimeout(previewTimeout);

  // ✅ Set new video ID
  currentVideoId = videoId;

  // Delay load if player isn't ready
  if (!apiReady || !player || typeof player.loadVideoById !== "function") {
    setTimeout(() => playHighlight(videoId, isManual), 500);
    return;
  }

  // Show modal
  document.getElementById("ytPreviewModal").style.display = "block";
  player.loadVideoById(videoId);

  // Set new timeout only if not manually triggered
  if (!isManual) {
    previewTimeout = setTimeout(() => {
      // Ensure we're still previewing the same video
      if (currentVideoId === videoId) {
        hidePreviewModal(); // Will fire custom event
      }
    }, 15000);
  }
}

// 🧹 Cleanup
export function hidePreviewModal() {
  const modal = document.getElementById("ytPreviewModal");
  if (modal) modal.style.display = "none";

  if (player && typeof player.stopVideo === "function") {
    player.stopVideo();
  }

  clearTimeout(previewTimeout);

  // 🚫 Only dispatch modal if not manually triggered
  if (!highlightManuallyTriggered) {
    window.dispatchEvent(new Event("highlightPreviewEnded"));
  }

  highlightManuallyTriggered = false;
  currentVideoId = null;
}

// 🎯 Optional: player state hook (if still using)
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
      hidePreviewModal();
    }, 15000);
  }
}
