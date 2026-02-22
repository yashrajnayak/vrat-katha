import { getTodayDayIndex } from '../data.js';
import { navigate } from '../router.js';
import { renderHomeEmptyMarkup, renderHomeMarkup } from './templates/home-template.js';

export function renderHome(kathas) {
  const app = document.getElementById('app');

  if (!Array.isArray(kathas) || kathas.length === 0) {
    app.innerHTML = renderHomeEmptyMarkup();
    return;
  }

  const todayIndex = getTodayDayIndex();
  app.innerHTML = renderHomeMarkup(kathas, todayIndex);

  bindHomeEvents();
  autoScrollTodayCard(todayIndex);
}

function bindHomeEvents() {
  document.querySelector('.today-banner-inner')?.addEventListener('click', (event) => {
    event.preventDefault();
    const day = event.currentTarget.dataset.day;
    navigate(`#/katha/${day}`);
  });

  document.querySelectorAll('.day-card').forEach((card) => {
    card.addEventListener('click', (event) => {
      event.preventDefault();
      navigate(`#/katha/${card.dataset.day}`);
    });
  });
}

function autoScrollTodayCard(todayIndex) {
  if (todayIndex <= 2) return;

  window.setTimeout(() => {
    const list = document.getElementById('day-cards-list');
    if (list) list.scrollTo({ top: todayIndex * 90, behavior: 'smooth' });
  }, 400);
}
