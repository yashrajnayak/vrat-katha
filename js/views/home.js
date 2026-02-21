import { icon } from '../icons.js';
import { getTodayDayIndex } from '../data.js';
import { navigate } from '../router.js';

export function renderHome(kathas) {
  const app = document.getElementById('app');

  if (!Array.isArray(kathas) || kathas.length === 0) {
    app.innerHTML = `
      <div class="screen home-screen fade-in">
        <div class="home-header">
          <h1 class="home-title">व्रत कथा</h1>
          <p class="home-subtitle">सामग्री लोड नहीं हो सकी। कृपया पेज दोबारा खोलें।</p>
        </div>
      </div>
    `;
    return;
  }

  const todayIndex = getTodayDayIndex();
  const today = kathas.find(k => k.dayIndex === todayIndex) || kathas[0];
  app.innerHTML = `
    <div class="screen home-screen fade-in">
      <div class="home-header">
        <h1 class="home-title">व्रत कथा</h1>
        <p class="home-subtitle">सप्ताह के सातों दिनों की व्रत कथाएं</p>
      </div>

      <div class="today-banner">
        <div class="today-banner-inner" data-day="${today.dayIndex}" style="background:linear-gradient(135deg, ${today.color}, ${today.color}BB)">
          <div class="today-banner-content">
            <div class="today-banner-left">
              <div class="today-banner-icon">
                ${icon(today.deityIcon, 28, '#FFFFFF')}
              </div>
              <div>
                <div class="today-banner-label">आज की कथा</div>
                <div class="today-banner-title">${today.title}</div>
                <div class="today-banner-deity">${today.deity}</div>
              </div>
            </div>
            <div class="today-banner-arrow">
              ${icon('arrow-forward', 20, '#FFFFFF')}
            </div>
          </div>
        </div>
      </div>

      <div class="section-header">
        <h2 class="section-title">सभी व्रत कथाएं</h2>
      </div>

      <div class="day-cards-list" id="day-cards-list">
        ${kathas.map((k, i) => renderDayCard(k, k.dayIndex === todayIndex, i)).join('')}
      </div>
    </div>
  `;

  app.querySelector('.today-banner-inner').addEventListener('click', () => {
    navigate(`#/katha/${today.dayIndex}`);
  });

  app.querySelectorAll('.day-card').forEach(card => {
    card.addEventListener('click', () => {
      navigate(`#/katha/${card.dataset.day}`);
    });
  });

  if (todayIndex > 2) {
    setTimeout(() => {
      const list = document.getElementById('day-cards-list');
      if (list) list.scrollTo({ top: todayIndex * 90, behavior: 'smooth' });
    }, 400);
  }
}

function renderDayCard(katha, isToday, index) {
  const bgStyle = isToday
    ? `background:linear-gradient(135deg, ${katha.color}, ${katha.color}CC)`
    : 'background:linear-gradient(135deg, #FFFFFF, #FAFAFA)';

  const iconBg = isToday ? 'rgba(255,255,255,0.25)' : katha.colorLight;
  const iconColor = isToday ? '#FFFFFF' : katha.color;

  return `
    <div class="day-card" data-day="${katha.dayIndex}" style="animation-delay:${index * 0.08}s">
      <div class="day-card-inner${isToday ? ' today' : ''}" style="${bgStyle}">
        <div class="day-card-left">
          <div class="day-card-icon" style="background:${iconBg}">
            ${icon(katha.deityIcon, 24, iconColor)}
          </div>
          <div class="day-card-info">
            <div class="day-row">
              <span class="day-name">${katha.dayNameHindi}</span>
              ${isToday ? '<span class="today-badge">आज</span>' : ''}
            </div>
            <div class="deity-name">${katha.deity}</div>
          </div>
        </div>
        <span class="day-card-chevron">${icon('chevron-forward', 18, isToday ? 'rgba(255,255,255,0.7)' : '#BCAAA4')}</span>
      </div>
    </div>
  `;
}
