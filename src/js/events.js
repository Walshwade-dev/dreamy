// src/js/events.js
import { eventsData } from './eventdata.js';

const container = document.getElementById("eventsCardsContainer");

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
        ${event.soldOut ? `<div class="event-card__sold-out">Sold Out</div>` : ""}
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
