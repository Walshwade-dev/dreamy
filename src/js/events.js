// src/js/events.js
import { eventsData } from './eventdata.js';

const container = document.getElementById("eventsCardsContainer");
const subscribeBtn = document.querySelector("#events__subscribe button");


subscribeBtn.addEventListener("click", () => {
  // Change button text
  subscribeBtn.textContent = "🎉 Subscribed";

  // Disable further clicks
  subscribeBtn.disabled = true;

  // Optional: celebrate with confetti
  showConfettiEffect();

  // Show welcome modal
  showSubscribeModal();
});


function showConfettiEffect() {
  const confetti = document.createElement("div");
  confetti.className = "confetti-wrapper";

  for (let i = 0; i < 100; i++) {
    const flake = document.createElement("div");
    flake.className = "confetti";
    flake.style.left = Math.random() * 100 + "vw";
    flake.style.animationDelay = Math.random() * 2 + "s";
    confetti.appendChild(flake);
  }

  document.body.appendChild(confetti);

  // Remove confetti after 5s
  setTimeout(() => confetti.remove(), 5000);
}

function showSubscribeModal() {
  const modal = document.createElement("div");
  modal.className = "subscribe-modal";
  modal.innerHTML = `
    <div class="subscribe-modal__content">
      <h2>Welcome Aboard! 🎧</h2>
      <p>You’re now subscribed to all upcoming updates, podcasts, and events!</p>
      <button class="subscribe-modal__close">Close</button>
    </div>
  `;
  document.body.appendChild(modal);

  modal.querySelector(".subscribe-modal__close").addEventListener("click", () => {
    modal.remove();
  });
}



function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric', year: 'numeric' };
  return date.toLocaleDateString(undefined, options); // default locale
}

export function loadEvents() {
  container.innerHTML = "";

  eventsData.forEach(event => {
    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
      <div class="event-card__image">
        <img src="${event.image}" alt="${event.title}" />
        ${event.soldOut ? `<div class="event-card__sold-out">on radio</div>` : ""}
      </div>

      <div class="event-card__info">
        <h3>${event.title}</h3>
        <div class="event-card__detail">
          <i class="fa-solid fa-calendar-days"></i>
          <span>${formatDate(event.date)}</span>
        </div>
        <div class="event-card__detail">
          <i class="fa-solid fa-location-dot"></i>
          <span>${event.location}</span>
        </div>
        ${event.type === "concert" ? `
          <button class="event-card__button" ${event.soldOut ? "disabled" : ""}>
            <i class="fa-solid fa-ticket"></i> Get Ticket
          </button>` :
        `<button class="event-card__button" ${event.soldOut ? "disabled" : ""}>
            <i class="fa-solid fa-bell"></i> ${event.type === "podcast" ? "Subscribe" : "Notify Me"}
          </button>`}
      </div>
    `;

    container.appendChild(card);
  });
}
