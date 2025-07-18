import { fetchYouTubeVideos } from './youtube-fetch.js';
import { customCovers } from './custom-covers.js';
import { playHighlight } from './preview-player.js';
import { fetchSongs } from './firebase/fetchSongs.js';
import { createMusicCard } from './music-card.js';
import { loadComments } from './comments.js'; // If songId-specific

let lastTapTime = 0;

export async function loadMusicCatalogue() {
  const cardsContainer = document.querySelector(".music-catalogue__cards");
  if (!cardsContainer) return;

  const songs = await fetchSongs();

  if (songs.length > 0) {
    songs.forEach(song => {
      const card = createMusicCard(song);
      cardsContainer.appendChild(card);

      attachCardEvents({
        card,
        id: song.id,
        isFirebase: true
      });
    });
  } else {
    loadFallbackVideos(cardsContainer);
  }
}

async function loadFallbackVideos(container) {
  const videos = await fetchYouTubeVideos();

  videos.forEach(video => {
    const cover = customCovers[video.videoId] || video.defaultThumb;
    const shortTitle = video.title.length > 20 ? video.title.slice(0, 20) + '...' : video.title;

    const card = document.createElement("div");
    card.className = "music-card";

    card.innerHTML = `
      <div class="music-card__image" style="background-image: url('${cover}')">
        <img src="${cover}" alt="${video.title}" loading="lazy"/>
      </div>
      <div class="music-card__info">
        <h3 class="music-title" title="${video.title}">
          <span class="title-short">${shortTitle}</span>
          <span class="music-title-inner">${video.title}</span>
        </h3>
        <p class="release-date">${video.releaseDate}</p>
        <div class="card-actions">
          <button class="btn-like"><i class="fa-solid fa-heart"></i><span class="like-count">0</span></button>
          <button class="btn-share" data-url="${video.url}" data-video-id="${video.videoId}">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <button class="play-btn" data-video-id="${video.videoId}">
          <i class="fa-solid fa-play"></i>
        </button>
      </div>
    `;

    container.appendChild(card);

    attachCardEvents({
      card,
      id: video.videoId,
      shareUrl: video.url,
      isFirebase: false
    });
  });
}

function attachCardEvents({ card, id, shareUrl, isFirebase }) {
  const likeBtn = card.querySelector(".btn-like");
  const likeCount = likeBtn.querySelector(".like-count");
  const playBtn = card.querySelector(".play-btn");
  const shareBtn = card.querySelector(".btn-share");

  const storageKey = `like-${id}`;
  const storedLike = localStorage.getItem(storageKey);

  if (storedLike) {
    likeBtn.classList.add("liked");
    likeCount.textContent = storedLike;
  }

  likeBtn.addEventListener("click", () => {
    let count = parseInt(likeCount.textContent) || 0;
    const liked = likeBtn.classList.toggle("liked");

    if (liked) {
      count++;
      localStorage.setItem(storageKey, count);
    } else {
      count = Math.max(0, count - 1);
      localStorage.removeItem(storageKey);
    }

    likeCount.textContent = count;
  });

  playBtn.addEventListener("click", () => {
    const now = Date.now();

    window.currentSongId = id;
    loadComments(id);

    if (now - lastTapTime < 400) {
      window.open(`https://www.youtube.com/watch?v=${id}`, "_blank");
      lastTapTime = 0;
    } else {
      playHighlight(id);
      lastTapTime = now;
    }
  });

  shareBtn.addEventListener("click", () => {
    const modal = document.getElementById("shareModal");
    modal.classList.remove("hidden");
    modal.classList.add("visible");
    modal.dataset.url = shareUrl || `https://www.youtube.com/watch?v=${id}`;
  });

  // 🔄 Optionally load comments for Firebase songs
  if (isFirebase) {
    window.currentSongId = id;
    loadComments(id);
  }
}
