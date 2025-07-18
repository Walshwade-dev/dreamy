import { loadMusicCatalogue } from './music-render.js';
import { playHighlight, hidePreviewModal, allowFullPlayback } from './preview-player.js';
import { loadEvents } from './events.js';
import { loadComments } from './comments.js';
import { customCovers } from './custom-covers.js';





import AOS from 'aos';
import 'aos/dist/aos.css';




const scrollBtn = document.querySelector('.scroll-to-top');

window.addEventListener('scroll', () => {
  scrollBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
});

scrollBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


export function showDefaultHeroImage() {
  const heroImageContainer = document.getElementById("heroImageContainer");
  if (!heroImageContainer) return;

  heroImageContainer.innerHTML = '';

  const img = document.createElement("img");
  img.src = "/images/instruments.png";
  img.alt = "Musical instruments";
  img.className = "default-hero-image";

  heroImageContainer.appendChild(img);
}

document.addEventListener("DOMContentLoaded", () => {
  // === AOS Animations ===
  AOS.init({ duration: 800, offset: 120 });

  loadEvents();
  loadComments();


  const imgSaxa = document.querySelector('.saxa');
  const imgTwo = document.querySelector('.img-two');


  if (imgTwo && customCovers['about-pallet']) {
    imgTwo.src = customCovers['about-pallet'];
  }


  if (imgSaxa && customCovers['about-saxa']) {
    imgSaxa.src = customCovers['about-saxa'];
  }



  document.getElementById("footerYear").textContent = new Date().getFullYear();

  const scrollBtn = document.querySelector(".scroll-to-top");
  scrollBtn.addEventListener("click", () => {
    document.getElementById("home")?.scrollIntoView({
      behavior: "smooth"
    });
  });

  // === DOM Elements ===
  const listenNowBtn = document.getElementById("listenNowBtn");
  const cardsContainer = document.querySelector(".music-catalogue__cards");
  const heroImageContainer = document.getElementById("heroImageContainer");

  const modal = document.getElementById("previewEndModal");
  const closeBtn = document.getElementById("closePreviewBtn");
  const userNameInput = document.getElementById("userNameInput");
  const greetingText = document.getElementById("greetingText");
  const unlockBtn = document.getElementById("unlockBtn");

  const shareBtns = document.querySelectorAll(".share-btn");

  let hasShared = false;
  let userName = "";

  // === Init state ===
  showDefaultHeroImage();
  loadMusicCatalogue();

  // === Close Modal Button ===
  closeBtn?.addEventListener("click", hidePreviewModal);

  // === Listen Now Random Button ===
  listenNowBtn?.addEventListener("click", () => {
    const cards = [...cardsContainer.querySelectorAll(".music-card")];
    if (!cards.length) return;

    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    const playBtn = randomCard.querySelector(".play-btn");
    const coverSrc = randomCard.querySelector("img")?.src;

    if (!playBtn || !coverSrc) return;

    // Optional: CD spin logic
    heroImageContainer.innerHTML = '';

    const wrapper = document.createElement("div");
    wrapper.className = "now-playing-wrapper spinning-cd";

    const disc = document.createElement("div");
    disc.className = "cd-disc";

    const img = document.createElement("img");
    img.src = coverSrc;
    img.alt = "Now Playing";
    img.className = "cd-image";

    const centerHole = document.createElement("div");
    centerHole.className = "cd-hole";

    disc.appendChild(img);
    disc.appendChild(centerHole);
    wrapper.appendChild(disc);
    heroImageContainer.appendChild(wrapper);

    AOS.refresh();

    // ✅ Simulate real click
    playBtn.click();
  });



  // === Modal Logic ===
  userNameInput?.addEventListener("input", () => {
    userName = userNameInput.value.trim();
    updateGreeting();
    updateUnlockBtnState();
  });

  function updateGreeting() {
    greetingText.innerHTML = userName.length > 0
      ? `🎧 Hello <strong>${userName}</strong>, please share this vibe to unlock full access!`
      : `🎧 Enjoying the vibe?`;
  }

  shareBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const platform = btn.dataset.platform;
      const url = window.currentFallbackUrl || "https://youtube.com";

      const encodedText = encodeURIComponent(`🎵 Check out this vibe from Minguni Dreamland!\n${url}`);

      let shareUrl = "#";

      switch (platform) {
        case "whatsapp":
          shareUrl = `https://wa.me/?text=${encodedText}`;
          break;
        case "twitter":
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
          break;
        case "instagram":
          alert("📸 Instagram sharing must be done manually.");
          return;
        case "tiktok":
          alert("🎬 TikTok sharing must be done manually.");
          return;
      }

      window.open(shareUrl, "_blank");
      hasShared = true;
      updateUnlockBtnState();
    });
  });

  function updateUnlockBtnState() {
    unlockBtn.disabled = !(hasShared && userName.length > 0);
  }

  unlockBtn?.addEventListener("click", () => {
    alert(`🎉 Thanks ${userName}! Full song unlocked.`);
    allowFullPlayback(); // signal to allow full playback
    modal.classList.add("hidden");
  });

  // === Modal Display Triggered by Preview End ===
  window.addEventListener("highlightPreviewEnded", (e) => {

    console.log("🔥 highlightPreviewEnded received:", e.detail);

    const modal = document.getElementById("previewEndModal");

    showDefaultHeroImage();

    if (modal) {
      modal.classList.remove("hidden");
      hasShared = false;
      userName = "";
      userNameInput.value = "";
      updateGreeting();
      updateUnlockBtnState();
    }
  });

  // === Dark Mode Toggle ===
  const darkToggleBtn = document.getElementById("darkModeToggle");
  const icon = darkToggleBtn?.querySelector("i");
  const root = document.documentElement;

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    root.classList.add("dark");
    if (icon) icon.className = "fa-regular fa-sun-bright";
  }

  darkToggleBtn?.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (icon) icon.className = isDark ? "fa-regular fa-sun-bright" : "fa fa-moon";
  });

  // === Mobile Nav ===
  const hamburgerBtn = document.getElementById("hamburgerToggle");
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburgerBtn?.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("active");
    hamburgerIcon.className = isOpen
      ? "fa-sharp fa-solid fa-bars"
      : "fa-sharp fa-solid fa-xmark";

    mobileMenu.style.display = isOpen ? "none" : "flex";
    setTimeout(() => {
      mobileMenu.classList.toggle("active", !isOpen);
    }, isOpen ? 600 : 10);
  });

  mobileMenu?.querySelectorAll("a")?.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      hamburgerIcon.className = "fa-sharp fa-solid fa-bars";
      setTimeout(() => (mobileMenu.style.display = "none"), 600);
    });
  });

  // === About Section Animations ===
  const aboutSection = document.querySelector(".about");
  const aboutButtonWrapper = document.querySelector(".about__button-wrapper");
  const journeyContent = document.querySelector(".content-info-journey");
  const inspirationContent = document.querySelector(".content-info-inspiration");

  if (aboutSection && aboutButtonWrapper && journeyContent && inspirationContent) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        aboutButtonWrapper.classList.toggle("animate", visible);
        journeyContent.classList.toggle("animate", visible);
        inspirationContent.classList.toggle("animate", visible);
      },
      { threshold: 0.15, rootMargin: "0px 0px -20% 0px" }
    );

    observer.observe(aboutSection);
  }
});


document.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-share");
  if (!btn) return;

  const platform = btn.dataset.platform;
  const url = btn.dataset.url || window.currentFallbackUrl;

  const encoded = encodeURIComponent(`🎵 Check out this vibe: ${url}`);

  let link = "#";
  switch (platform) {
    case "whatsapp":
      link = `https://wa.me/?text=${encoded}`; break;
    case "twitter":
      link = `https://twitter.com/intent/tweet?text=${encoded}`; break;
    case "instagram":
    case "tiktok":
      alert(`Share manually via ${platform}.`); return;
  }

  window.open(link, "_blank");
});

document.getElementById("subscribeBtn").addEventListener("click", function () {
  this.innerHTML = '<i class="fa-solid  fa-burst"></i> Subscribed';
  this.style.backgroundColor = "green"; // Optional: change color
  this.disabled = true; // Optional: disable after subscribing
});