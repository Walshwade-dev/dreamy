import { fetchYouTubeVideos } from './youtube-fetch.js';
import { customCovers } from './custom-covers.js';
import { playHighlight } from './preview-player.js';

import { fetchSongs } from './firebase/fetchSongs.js';
import { createMusicCard } from './music-card.js';

let lastTapTime = 0;

export async function loadMusicCatalogue() {
  const cardsContainer = document.querySelector(".music-catalogue__cards");
  if (!cardsContainer) return;

  // === Try to load Firebase songs first
  const songs = await fetchSongs();

  if (songs.length > 0) {
    songs.forEach(song => {
      const card = createMusicCard(song);
      cardsContainer.appendChild(card);

      const likeBtn = card.querySelector(".btn-like");
      const playBtn = card.querySelector(".play-btn");
      const shareBtn = card.querySelector(".btn-share");
      const likeCount = likeBtn.querySelector(".like-count");
      const storageKey = `like-${song.id}`;
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
        if (now - lastTapTime < 400) {
          window.open(`https://www.youtube.com/watch?v=${song.id}`, "_blank");
          lastTapTime = 0;
        } else {
          playHighlight(song.id);
          lastTapTime = now;
        }
      });

      shareBtn.addEventListener("click", () => {
        const modal = document.getElementById("shareModal");
        modal.classList.remove("hidden");
        modal.classList.add("visible");
        modal.dataset.url = `https://www.youtube.com/watch?v=${song.id}`;
      });
    });
  } else {
    // 🔄 Fallback to YouTube if no Firebase songs
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

    const likeBtn = card.querySelector(".btn-like");
    const likeCount = card.querySelector(".like-count");
    const shareBtn = card.querySelector(".btn-share");
    const playBtn = card.querySelector(".play-btn");

    // === Like
    const storageKey = `like-${video.videoId}`;
    if (localStorage.getItem(storageKey)) {
      likeBtn.classList.add("liked");
      likeCount.textContent = "1";
    }

    likeBtn.addEventListener("click", () => {
      const liked = likeBtn.classList.toggle("liked");
      if (liked) {
        likeCount.textContent = "1";
        localStorage.setItem(storageKey, "1");
      } else {
        likeCount.textContent = "0";
        localStorage.removeItem(storageKey);
      }
    });

    // === Play
    playBtn.addEventListener("click", () => {
      const now = Date.now();
      if (now - lastTapTime < 400) {
        window.open(`https://www.youtube.com/watch?v=${video.videoId}`, "_blank");
        lastTapTime = 0;
      } else {
        playHighlight(video.videoId);
        lastTapTime = now;
      }
    });

    // === Share
    shareBtn.addEventListener("click", () => {
      const modal = document.getElementById("shareModal");
      modal.classList.remove("hidden");
      modal.classList.add("visible");
      modal.dataset.url = shareBtn.dataset.url;
    });
  });
}
