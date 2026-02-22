import { icon } from '../../icons.js';
import { withHexAlpha } from '../../utils/color.mjs';

export function renderHomeEmptyMarkup() {
  return `
    <div class="screen home-screen fade-in">
      <div class="home-header">
        <h1 class="home-title">व्रत कथा</h1>
        <p class="home-subtitle">सामग्री लोड नहीं हो सकी। कृपया पेज दोबारा खोलें।</p>
      </div>
    </div>
  `;
}

export function renderHomeMarkup(kathas, todayIndex) {
  const today = kathas.find((katha) => katha.dayIndex === todayIndex) || kathas[0];

  return `
    <div class="screen home-screen fade-in">
      <div class="home-header">
        <h1 class="home-title">व्रत कथा</h1>
        <p class="home-subtitle">सप्ताह के सातों दिनों की व्रत कथाएं</p>
      </div>

      <div class="today-banner">
        <div
          class="today-banner-inner"
          data-day="${today.dayIndex}"
          style="--today-banner-start:${today.color};--today-banner-end:${withHexAlpha(today.color, 'BB')}">
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
        ${kathas.map((katha, index) => renderDayCardMarkup(katha, katha.dayIndex === todayIndex, index)).join('')}
      </div>
    </div>
  `;
}

function renderDayCardMarkup(katha, isToday, index) {
  const dayCardStart = isToday ? katha.color : '#FFFFFF';
  const dayCardEnd = isToday ? withHexAlpha(katha.color, 'CC') : '#FAFAFA';
  const iconBg = isToday ? 'rgba(255,255,255,0.25)' : katha.colorLight;
  const iconColor = isToday ? '#FFFFFF' : katha.color;
  const chevronColor = isToday ? 'rgba(255,255,255,0.7)' : '#BCAAA4';

  return `
    <div
      class="day-card"
      data-day="${katha.dayIndex}"
      style="--day-card-delay:${index * 0.08}s;--day-card-bg-start:${dayCardStart};--day-card-bg-end:${dayCardEnd};--day-icon-bg:${iconBg};--day-chevron-color:${chevronColor}">
      <div class="day-card-inner${isToday ? ' today' : ''}">
        <div class="day-card-left">
          <div class="day-card-icon">
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
        <span class="day-card-chevron">${icon('chevron-forward', 18)}</span>
      </div>
    </div>
  `;
}
