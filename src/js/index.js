// === DARK MODE ===
const darkToggleBtn = document.getElementById("darkModeToggle");
const icon = darkToggleBtn.querySelector("i");
const root = document.documentElement;

function setThemeIcon(isDark) {
  icon.className = isDark
    ? "fa-regular fa-sun-bright"
    : "fa fa-moon";
}

const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  root.classList.add("dark");
  setThemeIcon(true);
} else {
  setThemeIcon(false);
}

darkToggleBtn.addEventListener("click", () => {
  const isDark = root.classList.toggle("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  setThemeIcon(isDark);
});

// === HAMBURGER TOGGLE WITH SLIDE ANIMATION ===
const hamburgerBtn = document.getElementById("hamburgerToggle");
const hamburgerIcon = document.getElementById("hamburgerIcon");
const mobileMenu = document.getElementById("mobileMenu");

hamburgerBtn.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.contains("active");

  if (isOpen) {
    // Animate out
    mobileMenu.classList.remove("active");
    setTimeout(() => {
      mobileMenu.classList.add("hidden");
    }, 1200); // matches CSS transition duration
    hamburgerIcon.className = "fa-sharp fa-solid fa-bars";
  } else {
    // Animate in
    mobileMenu.classList.remove("hidden");
    mobileMenu.classList.add("active");
    hamburgerIcon.className = "fa-sharp fa-solid fa-xmark";
  }
});

// === CLOSE MENU ON NAV LINK CLICK (WITH DELAY) ===
const navLinks = mobileMenu.querySelectorAll("a");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    setTimeout(() => {
      mobileMenu.classList.remove("active");

      setTimeout(() => {
        mobileMenu.classList.add("hidden");
        hamburgerIcon.className = "fa-sharp fa-solid fa-bars";
      }, 1200); // delay to let slide-out complete
    }, 300); // small delay for click feedback
  });
});
