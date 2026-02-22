import { icon } from '../../icons.js';
import { withHexAlpha } from '../../utils/color.mjs';

export function renderEmptyKathaMarkup(animate) {
  return `
    <div class="screen katha-screen${animate ? ' fade-in' : ''}">
      <div class="katha-scroll">
        <div class="content-card">
          <div class="content-title">कथा उपलब्ध नहीं है</div>
        </div>
      </div>
    </div>
  `;
}

export function renderKathaMarkup({
  katha,
  animate,
  isToday,
  activeTab,
  canPrev,
  canNext,
  prevKatha,
  nextKatha,
  tabLabels,
}) {
  return `
    <div
      class="screen katha-screen${animate ? ' fade-in' : ''}"
      style="--katha-bg-start:${katha.colorLight};--hero-start:${katha.color};--hero-end:${withHexAlpha(katha.color, 'CC')};--accent-color:${katha.color}">
      <div class="katha-bg"></div>

      <div class="katha-header">
        <button class="header-btn" id="back-btn" type="button">
          ${icon('chevron-back', 24, '#3E2723')}
        </button>
        <div class="header-center">
          <span class="header-day-name">${katha.dayNameHindi}</span>
        </div>
        <div class="header-btn" aria-hidden="true"></div>
      </div>

      <div class="katha-scroll" id="katha-scroll">
        <div class="hero-card">
          <div class="hero-icon-wrap">
            ${icon(katha.deityIcon, 36, '#FFFFFF')}
          </div>
          <div class="hero-title">${katha.title}</div>
          <div class="hero-deity">${katha.deity}</div>
          ${isToday ? `
            <div class="hero-badge">
              ${icon('today', 14, '#FFFFFF')}
              <span class="hero-badge-text">आज का व्रत</span>
            </div>
          ` : ''}
        </div>

        <div class="tabs-container">
          ${['katha', 'vidhi', 'aarti'].map((tab) => `
            <button
              class="tab-btn${activeTab === tab ? ' active' : ''}"
              type="button"
              data-tab="${tab}">
              <span>${tabLabels[tab]}</span>
            </button>
          `).join('')}
        </div>

        <div class="font-size-control">
          <button class="font-size-btn small-text" id="font-decrease" type="button">अ</button>
          <span class="font-size-label" id="font-size-label"></span>
          <button class="font-size-btn large-text" id="font-increase" type="button">अ</button>
        </div>

        <div class="content-card">
          <div class="content-text" id="content-text"></div>
        </div>

        <div class="day-nav">
          <button class="day-nav-btn" id="nav-prev" type="button" ${!canPrev ? 'disabled' : ''}>
            ${icon('chevron-back', 18)}
            ${canPrev ? `<span class="day-nav-label">${prevKatha.dayNameHindi}</span>` : ''}
          </button>
          <button class="day-nav-btn" id="nav-next" type="button" ${!canNext ? 'disabled' : ''}>
            ${canNext ? `<span class="day-nav-label">${nextKatha.dayNameHindi}</span>` : ''}
            ${icon('chevron-forward', 18)}
          </button>
        </div>
      </div>
    </div>
  `;
}
