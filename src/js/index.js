import { loadMusicCatalogue } from './music-render.js';
import { playHighlight, hidePreviewModal } from './preview-player.js';

import AOS from 'aos';
import 'aos/dist/aos.css';

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
  // === AOS Initialization ===
  AOS.init(
    { 
    duration: 800, 
    offset: 120, 
    once: false,
    disable:false //force enable on mobile.
  });

  // === DOM Elements (MOVED INSIDE DOMContentLoaded) ===
  const listenNowBtn = document.getElementById("listenNowBtn");
  const cardsContainer = document.querySelector(".music-catalogue__cards");
  const heroImageContainer = document.getElementById("heroImageContainer");
  const closeBtn = document.getElementById("closePreviewBtn");
  const sayHiBtn = document.getElementById("sayHiBtn");
  const darkToggleBtn = document.getElementById("darkModeToggle");
  const hamburgerBtn = document.getElementById("hamburgerToggle");
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  const mobileMenu = document.getElementById("mobileMenu");

  // === Set default hero image on page load ===
  showDefaultHeroImage();

  // === Close Preview Button ===
  closeBtn?.addEventListener("click", hidePreviewModal);

  // === Say Hi Modal Button ===
  sayHiBtn?.addEventListener("click", () => {
    alert("👋 You're awesome! Stay tuned for more vibes!");
    document.getElementById("previewEndModal")?.classList.add("hidden");
  });

  // === Load Music Cards ===
  loadMusicCatalogue();

  // === Listen Now Button Logic ===
// === Listen Now Button Logic ===
listenNowBtn?.addEventListener("click", () => {
  const musicCards = [...cardsContainer.querySelectorAll(".music-card")];
  if (!musicCards.length) return;

  const randomCard = musicCards[Math.floor(Math.random() * musicCards.length)];
  const videoId = randomCard.querySelector(".play-btn")?.dataset?.videoId;
  const imgEl = randomCard.querySelector("img");
  const coverSrc = imgEl?.src;

  heroImageContainer.innerHTML = '';

  if (videoId && coverSrc) {
    const wrapper = document.createElement("div");
    wrapper.className = "now-playing-wrapper spinning-cd";

    const disc = document.createElement("div");
    disc.className = "cd-disc";

    const img = document.createElement("img");
    img.src = coverSrc;
    img.alt = "Now Playing";
    img.className = "cd-image";

    disc.appendChild(img);

    const centerHole = document.createElement("div");
    centerHole.className = "cd-hole";

    disc.appendChild(centerHole);
    wrapper.appendChild(disc);
    heroImageContainer.appendChild(wrapper);

    AOS.refresh();

    // Play snippet
    playHighlight(videoId, true); // manually triggered = no event

    // Fallback: Show modal after 15s
    setTimeout(() => {
      const modal = document.getElementById("previewEndModal");
      if (modal) {
        if(modal.classList.contains("hidden")){
          modal.classList.remove("hidden")
        } else {
          modal.classList.add("hidden");
      }
    }
      showDefaultHeroImage();
    }, 15000); // match player timeout
  }
});



  // === Dark Mode Logic ===
  const icon = darkToggleBtn?.querySelector("i");
  const root = document.documentElement;

  function setThemeIcon(isDark) {
    if (!icon) return;
    icon.className = isDark ? "fa-regular fa-sun-bright" : "fa fa-moon";
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    root.classList.add("dark");
    setThemeIcon(true);
  } else {
    setThemeIcon(false);
  }

  darkToggleBtn?.addEventListener("click", () => {
    const isDark = root.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
    setThemeIcon(isDark);
  });

  // === Mobile Menu Toggle ===
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

  // === About Section Animations on Scroll (≥768px only) ===
  const aboutSection = document.querySelector(".about");
  const aboutButtonWrapper = document.querySelector(".about__button-wrapper");
  const journeyContent = document.querySelector(".content-info-journey");
  const inspirationContent = document.querySelector(".content-info-inspiration");

  if (
    aboutSection &&
    aboutButtonWrapper &&
    journeyContent &&
    inspirationContent
  ) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        aboutButtonWrapper.classList.toggle("animate", visible);
        journeyContent.classList.toggle("animate", visible);
        inspirationContent.classList.toggle("animate", visible);
      },
      { threshold: 0.15,
        rootMargin: "0px 0px -20% 0px", // triggers before fully visible
       }
      
    );

    observer.observe(aboutSection);
  }

  // This remains
    window.addEventListener("highlightPreviewEnded", (e) => {
    const isManual = e.detail?.manuallyTriggered;

    // Show modal only for automatic preview endings
    if (!isManual) {
      const modal = document.getElementById("previewEndModal");
      if (modal) modal.classList.remove("hidden");
    }

    // ✅ Always restore the default hero image
    showDefaultHeroImage();
  });



});
