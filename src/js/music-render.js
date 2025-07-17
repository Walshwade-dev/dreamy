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
    const shortTitle = video.title.length > 20
      ? video.title.slice(0, 20) + '...'
      : video.title;

    const card = document.createElement("div");
    card.className = "music-card";

    card.innerHTML = `
      <div class="music-card__image" style="background-image: url('${cover}')">
        <img src="${cover}" alt="${video.title}" />
      </div>
      <div class="music-card__info">
        <h3 class="music-title" title="${video.title}">
          <span class="title-short">${shortTitle}</span>
          <span class="music-title-inner">${video.title}</span>
        </h3>
        <p class="release-date">${video.releaseDate}</p>
        <div class="card-actions">
          <button class="btn-like"><i class="fa-solid fa-heart"></i><span class="like-count"></span></button>
          <button class="btn-share" data-url="${video.url}" data-video-id="${video.videoId}">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
        <button class="play-btn" data-video-id="${video.videoId}">
          <i class="fa-solid fa-play"></i>
        </button>
      </div>
    `;

    cardsContainer.appendChild(card);


    // Share Modal Events
    const shareModal = document.getElementById("shareModal");
    const closeBtn = shareModal.querySelector(".share-modal__close");
    const options = shareModal.querySelectorAll(".share-option");

    closeBtn.addEventListener("click", () => {
      shareModal.classList.remove("visible");
    });

    shareModal.addEventListener("click", (e) => {
      if (e.target.id === "shareModal") {
        shareModal.classList.remove("visible");
      }
    });

    options.forEach((btn) => {
      btn.addEventListener("click", () => {
        const url = encodeURIComponent(shareModal.dataset.url);
        const text = encodeURIComponent("Check out this music!");
        let link;

        switch (btn.dataset.app) {
          case "whatsapp":
            link = `https://wa.me/?text=${text}%20${url}`;
            break;
          case "twitter":
            link = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
            break;
          case "instagram":
            alert("Instagram doesn't support direct link sharing via browser. Share manually.");
            return;
          case "copy":
            navigator.clipboard.writeText(shareModal.dataset.url).then(() => {
              btn.textContent = "Copied!";
              setTimeout(() => (btn.textContent = "Copy Link"), 1500);
            });
            return;
        }

        window.open(link, "_blank");
        shareModal.classList.remove("visible");
      });
    });


    // === LIKE Button Logic ===
    const likeBtn = card.querySelector(".btn-like");
    const likeCount = likeBtn.querySelector(".like-count");
    const storageKey = `like-${video.videoId}`;
    const storedLike = localStorage.getItem(storageKey);

    if (storedLike) {
      likeBtn.classList.add("liked");
      likeCount.textContent = "1";
    }

    likeBtn.addEventListener("click", () => {
      if (likeBtn.classList.contains("liked")) {
        likeBtn.classList.remove("liked");
        likeCount.textContent = "";
        localStorage.removeItem(storageKey);
      } else {
        likeBtn.classList.add("liked");
        likeCount.textContent = "1";
        localStorage.setItem(storageKey, "1");
      }
    });

    // === SHARE Button Logic ===
    const shareBtn = card.querySelector(".btn-share");
    shareBtn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const modal = document.getElementById("shareModal");
      modal.classList.remove("hidden");
      modal.classList.add("visible");
      modal.dataset.url = shareBtn.dataset.url;
    });
  });

  cardsContainer.addEventListener("click", (e) => {
    const playBtn = e.target.closest(".play-btn");
    const shareBtn = e.target.closest(".btn-share");

    if (playBtn) {
      const videoId = playBtn.dataset.videoId;

      // Find the associated share button in the same card to get its data-url
      const card = playBtn.closest(".music-card");
      const shareBtn = card.querySelector(".btn-share");
      const shareUrl = shareBtn?.dataset?.url || `https://www.youtube.com/watch?v=${videoId}`;

      window.currentFallbackUrl = shareUrl;

      const now = Date.now();
      if (now - lastTapTime < 400) {
        window.open(`https://www.youtube.com/watch?v=${videoId}`, "_blank");
        lastTapTime = 0;
      } else {
        playHighlight(videoId);
        lastTapTime = now;
      }
    }

  });
}
