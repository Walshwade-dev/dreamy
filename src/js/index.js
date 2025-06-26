import { loadMusicCatalogue } from './music-render.js';
import { playHighlight, hidePreviewModal } from './preview-player.js';

document.addEventListener("DOMContentLoaded", () => {
  // === Close Preview Button ===
  const closeBtn = document.getElementById("closePreviewBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", hidePreviewModal);
  }

  // === Dark Mode ===
  const darkToggleBtn = document.getElementById("darkModeToggle");
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

  // === Hamburger Toggle (Mobile Menu) ===
  const hamburgerBtn = document.getElementById("hamburgerToggle");
  const hamburgerIcon = document.getElementById("hamburgerIcon");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburgerBtn?.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.contains("active");

    if (isOpen) {
      mobileMenu.classList.remove("active");
      hamburgerIcon.className = "fa-sharp fa-solid fa-bars";
      setTimeout(() => {
        mobileMenu.style.display = "none";
      }, 600);
    } else {
      mobileMenu.style.display = "flex";
      setTimeout(() => {
        mobileMenu.classList.add("active");
        hamburgerIcon.className = "fa-sharp fa-solid fa-xmark";
      }, 10);
    }
  });

  const navLinks = mobileMenu?.querySelectorAll("a");
  navLinks?.forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      hamburgerIcon.className = "fa-sharp fa-solid fa-bars";
      setTimeout(() => {
        mobileMenu.style.display = "none";
      }, 600);
    });
  });

  // === Music Cards Initialization ===
  loadMusicCatalogue();

  // === Say Hi Modal Button ===
  const sayHiBtn = document.getElementById("sayHiBtn");
  if (sayHiBtn) {
    sayHiBtn.addEventListener("click", () => {
      alert("👋 You're awesome! Stay tuned for more vibes!");
      document.getElementById("previewEndModal").classList.add("hidden");
    });
  }
});
