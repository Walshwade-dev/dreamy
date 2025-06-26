import { fetchYouTubeVideos } from './youtube-fetch.js';
import { customCovers } from './custom-covers.js';
import { playHighlight } from './preview-player.js';

let lastTapTime = 0;

export async function loadMusicCatalogue() {
  const cardsContainer = document.querySelector(".music-catalogue__cards");
  if (!cardsContainer) return;

  const videos = await fetchYouTubeVideos();

  videos.forEach(video => {
    const cover = customCovers[video.videoId] || video.defaultThumb;
    const isLocal = cover.startsWith('/images/');

    const shortTitle = video.title.length > 20
      ? video.title.slice(0, 20) + '...'
      : video.title;

    const card = document.createElement("div");
    card.className = "music-card";

    card.innerHTML = `
      <div class="music-card__image">
        <img src="${cover}" alt="${video.title} cover" class="${isLocal ? 'local-cover' : ''}">
      </div>
      <div class="music-card__info">
        <h3 class="music-title" title="${video.title}">${shortTitle}</h3>
        <p class="release-date">Released: ${video.releaseDate}</p>
        <div class="card-actions">
          <button class="btn-like"><i class="fa-solid fa-heart"></i></button>
          <button class="btn-share"><i class="fa-solid fa-paper-plane"></i></button>
        </div>
        <button class="play-btn" data-video-id="${video.videoId}">
          <i class="fa-solid fa-play"></i>
        </button>
      </div>
    `;

    cardsContainer.appendChild(card);
  });

  // Listen for clicks
  cardsContainer.addEventListener("click", (e) => {
    const playBtn = e.target.closest(".play-btn");
    if (playBtn) {
      const videoId = playBtn.dataset.videoId;
      const now = Date.now();

      if (now - lastTapTime < 400) {
        // Double-tap detected: redirect to YouTube
        window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
        lastTapTime = 0;
      } else {
        // Single-tap: play preview
        playHighlight(videoId);
        lastTapTime = now;
      }
    }
  });
}
