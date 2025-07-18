import { likeSong } from './firebase/likeSong.js';


// song = { id, title, cover, releaseDate, likes }
export function createMusicCard(song) {
    const card = document.createElement("div");
    card.className = "music-card";

    const shortTitle = song.title.length > 20 ? song.title.slice(0, 20) + '...' : song.title;

    card.innerHTML = `
    <div class="music-card__image" style="background-image: url('${song.cover}')">
      <img src="${song.cover}" alt="${song.title}" loading="lazy"/>
    </div>
    <div class="music-card__info">
      <h3 class="music-title" title="${song.title}">
        <span class="title-short">${shortTitle}</span>
        <span class="music-title-inner">${song.title}</span>
      </h3>
      <p class="release-date">${song.releaseDate}</p>
      <div class="card-actions">
        <button class="btn-like"><i class="fa-solid fa-heart"></i>
          <span class="like-count">${song.likes || 0}</span>
        </button>
        <button class="btn-share" data-url="https://www.youtube.com/watch?v=${song.id}" data-video-id="${song.id}">
          <i class="fa-solid fa-paper-plane"></i>
        </button>
      </div>
      <button class="play-btn" data-video-id="${song.id}">
        <i class="fa-solid fa-play"></i>
      </button>
    </div>
  `;

    // Optional: attach event listeners here, or do it in loadMusicCatalogue()
    likeButton.addEventListener('click', async () => {
        await likeSong(song.id);
        likeCountSpan.textContent = parseInt(likeCountSpan.textContent) + 1;
    });

    return card;
}
