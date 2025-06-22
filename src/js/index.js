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
    // Start closing animation
    mobileMenu.classList.remove("active");
    hamburgerIcon.className = "fa-sharp fa-solid fa-bars";

    // Wait for animation to finish, then hide it
    setTimeout(() => {
      mobileMenu.style.display = "none";
    }, 600); // match longest transition (transform or opacity)
  } else {
    // Show the menu immediately
    mobileMenu.style.display = "flex";

    // Slight delay so browser can register the style change before animation
    setTimeout(() => {
      mobileMenu.classList.add("active");
      hamburgerIcon.className = "fa-sharp fa-solid fa-xmark";
    }, 10);
  }
});


// === CLOSE MENU ON NAV LINK CLICK (WITH DELAY) ===
const navLinks = mobileMenu.querySelectorAll("a");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    // Close the menu smoothly
    mobileMenu.classList.remove("active");
    hamburgerIcon.className = "fa-sharp fa-solid fa-bars";

    setTimeout(() => {
      mobileMenu.style.display = "none"; // ✅ Use display instead of .hidden
    }, 600); // Match your transition time
  });
});

