let player;
let previewTimeout;
let apiReady = false;
let pendingVideoId = null;

// Load IFrame API if not already present
if (typeof YT === "undefined") {
  const script = document.createElement("script");
  script.src = "https://www.youtube.com/iframe_api";
  document.body.appendChild(script);
}

// Called automatically by YouTube API
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

export function hidePreviewModal() {
  document.getElementById("ytPreviewModal").style.display = "none";
  if (player && typeof player.stopVideo === "function") {
    player.stopVideo();
  }
  clearTimeout(previewTimeout);
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => {
      player.stopVideo();
      hidePreviewModal();
    }, 15000); // Stop after 15s
  }
}
