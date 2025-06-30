let player;
let previewTimeout;
let apiReady = false;
let pendingVideoId = null;
let highlightManuallyTriggered = false;

// ⏯️ Called externally
export function playHighlight(videoId, isManual = false) {
  highlightManuallyTriggered = isManual;

  if (!apiReady || !player || typeof player.loadVideoById !== "function") {
    pendingVideoId = videoId;
    setTimeout(() => playHighlight(videoId, isManual), 500);
    return;
  }

  document.getElementById("ytPreviewModal").style.display = "block";
  player.loadVideoById(videoId);
}

// 🧹 Stop + show end modal
export function hidePreviewModal() {
  const modal = document.getElementById("ytPreviewModal");
  if (modal) modal.style.display = "none";

  if (player && typeof player.stopVideo === "function") {
    player.stopVideo();
  }

  clearTimeout(previewTimeout);

  // ✅ Always fire event, indicate source
  const event = new CustomEvent("highlightPreviewEnded", {
    detail: { manuallyTriggered: highlightManuallyTriggered }
  });
  window.dispatchEvent(event);

  highlightManuallyTriggered = false; // reset flag
}


// 🎯 Called automatically by player
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
      hidePreviewModal(); // Will not re-fire modal if manually triggered
    }, 15000);
  }
}
