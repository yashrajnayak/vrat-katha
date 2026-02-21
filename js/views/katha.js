import { icon } from '../icons.js';
import { getKathaForDay, getTodayDayIndex } from '../data.js';
import { navigate, goBack } from '../router.js';
import {
  getCustomContent, saveCustomContent, resetContent, hasCustomContent,
  getFontSizeLevel, setFontSizeLevel, getFontConfig,
  canIncrease, canDecrease, increaseLevel, decreaseLevel,
} from '../storage.js';

let state = {
  dayIndex: 0,
  activeTab: 'katha',
  isEditing: false,
  fontLevel: 'medium',
};

let kathasData = [];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => {
    if (char === '&') return '&amp;';
    if (char === '<') return '&lt;';
    if (char === '>') return '&gt;';
    if (char === '"') return '&quot;';
    return '&#39;';
  });
}

function clampDayIndex(value, maxIndex) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  if (parsed < 0) return 0;
  if (parsed > maxIndex) return maxIndex;
  return parsed;
}

export function renderKatha(kathas, dayIndex) {
  kathasData = Array.isArray(kathas) ? kathas : [];
  const maxIndex = Math.max(kathasData.length - 1, 0);
  state.dayIndex = clampDayIndex(dayIndex, maxIndex);
  state.activeTab = 'katha';
  state.isEditing = false;
  state.fontLevel = getFontSizeLevel();

  render();
}

function render() {
  const katha = getKathaForDay(kathasData, state.dayIndex);
  const app = document.getElementById('app');

  if (!katha) {
    app.innerHTML = `
      <div class="screen katha-screen fade-in">
        <div class="katha-scroll">
          <div class="content-card">
            <div class="content-title">कथा उपलब्ध नहीं है</div>
          </div>
        </div>
      </div>
    `;
    return;
  }

  const todayIndex = getTodayDayIndex();
  const isToday = state.dayIndex === todayIndex;
  const fontConfig = getFontConfig(state.fontLevel);
  const maxDayIndex = Math.max(kathasData.length - 1, 0);

  const tabLabels = { katha: 'कथा', vidhi: 'व्रत विधि', aarti: 'आरती' };
  const contentTitles = { katha: 'व्रत कथा', vidhi: 'व्रत विधि', aarti: 'आरती' };

  const getOriginal = (tab) => katha[tab];
  const getContent = (tab) => getCustomContent(state.dayIndex, tab) || getOriginal(tab);
  const hasCustom = (tab) => hasCustomContent(state.dayIndex, tab);
  const contentForActiveTab = getContent(state.activeTab);
  const safeContentForActiveTab = escapeHtml(contentForActiveTab);

  const canPrev = state.dayIndex > 0;
  const canNext = state.dayIndex < maxDayIndex;
  const prevKatha = canPrev ? getKathaForDay(kathasData, state.dayIndex - 1) : null;
  const nextKatha = canNext ? getKathaForDay(kathasData, state.dayIndex + 1) : null;

  app.innerHTML = `
    <div class="screen katha-screen fade-in">
      <div class="katha-bg" style="background:linear-gradient(180deg, ${katha.colorLight} 0%, #FFF8F0 60%, #FFFFFF 100%)"></div>

      <div class="katha-header">
        <button class="header-btn" id="back-btn">
          ${icon('chevron-back', 24, '#3E2723')}
        </button>
        <div class="header-center">
          <span class="header-day-name">${katha.dayNameHindi}</span>
        </div>
        ${!state.isEditing
          ? `<button class="header-btn" id="edit-header-btn">${icon('create-outline', 22, '#3E2723')}</button>`
          : '<div class="header-btn"></div>'
        }
      </div>

      <div class="katha-scroll">
        ${!state.isEditing ? `
          <div class="hero-card" style="background:linear-gradient(135deg, ${katha.color}, ${katha.color}CC)">
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
        ` : ''}

        <div class="tabs-container">
          ${['katha', 'vidhi', 'aarti'].map(tab => `
            <button class="tab-btn${state.activeTab === tab ? ' active' : ''}"
              data-tab="${tab}"
              style="${state.activeTab === tab ? `background:${katha.color}` : ''}">
              <span>${tabLabels[tab]}</span>
              ${hasCustom(tab) ? '<span class="tab-custom-dot"></span>' : ''}
            </button>
          `).join('')}
        </div>

        ${!state.isEditing ? `
          <div class="font-size-control">
            <button class="font-size-btn small-text" id="font-decrease"
              ${!canDecrease(state.fontLevel) ? 'disabled' : ''}
              style="color:${canDecrease(state.fontLevel) ? katha.color : '#D7CCC8'}">अ</button>
            <span class="font-size-label">${fontConfig.label}</span>
            <button class="font-size-btn large-text" id="font-increase"
              ${!canIncrease(state.fontLevel) ? 'disabled' : ''}
              style="color:${canIncrease(state.fontLevel) ? katha.color : '#D7CCC8'}">अ</button>
          </div>
        ` : ''}

        <div class="content-card">
          <div class="content-header">
            <div class="content-header-left">
              <div class="content-dot" style="background:${katha.color}"></div>
              <span class="content-title">${contentTitles[state.activeTab]}</span>
            </div>
            ${hasCustom(state.activeTab) && !state.isEditing ? `
              <div class="edited-badge" style="background:${katha.colorLight};color:${katha.color}">
                ${icon('pencil', 11, katha.color)}
                <span>संपादित</span>
              </div>
            ` : ''}
          </div>

          ${state.isEditing ? `
            <textarea class="edit-input" id="edit-input"
              style="font-size:${fontConfig.body}px;line-height:${fontConfig.lineHeight}px"
              placeholder="यहां लिखें..."></textarea>
            <div class="edit-actions">
              ${hasCustom(state.activeTab) ? `
                <button class="edit-action-btn reset-btn" id="reset-btn">
                  ${icon('refresh', 16, '#E65100')}
                  <span>मूल पाठ</span>
                </button>
              ` : '<div></div>'}
              <div class="edit-actions-right">
                <button class="edit-action-btn cancel-btn" id="cancel-btn">
                  ${icon('close', 16, '#8D6E63')}
                  <span>रद्द करें</span>
                </button>
                <button class="edit-action-btn save-btn" id="save-btn" style="background:${katha.color}">
                  ${icon('checkmark', 16, '#FFFFFF')}
                  <span>सहेजें</span>
                </button>
              </div>
            </div>
          ` : `
            <div class="content-text" style="font-size:${fontConfig.body}px;line-height:${fontConfig.lineHeight}px">
              ${safeContentForActiveTab}
            </div>
            <button class="edit-content-btn" id="edit-content-btn"
              style="border-color:${katha.color}40;color:${katha.color}">
              ${icon('create-outline', 16, katha.color)}
              <span>संपादित करें</span>
            </button>
          `}
        </div>

        ${!state.isEditing ? `
          <div class="day-nav">
            <button class="day-nav-btn" id="nav-prev" ${!canPrev ? 'disabled' : ''}>
              ${icon('chevron-back', 18, canPrev ? katha.color : '#D7CCC8')}
              ${canPrev ? `<span style="color:${katha.color}">${prevKatha.dayNameHindi}</span>` : ''}
            </button>
            <button class="day-nav-btn" id="nav-next" ${!canNext ? 'disabled' : ''}>
              ${canNext ? `<span style="color:${katha.color}">${nextKatha.dayNameHindi}</span>` : ''}
              ${icon('chevron-forward', 18, canNext ? katha.color : '#D7CCC8')}
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  bindEvents(katha);

  if (state.isEditing) {
    const input = document.getElementById('edit-input');
    if (input) input.value = contentForActiveTab;
  }
}

function bindEvents(katha) {
  const $ = (id) => document.getElementById(id);

  $('back-btn')?.addEventListener('click', () => {
    if (state.isEditing) {
      state.isEditing = false;
      render();
    } else {
      goBack();
    }
  });

  $('edit-header-btn')?.addEventListener('click', startEdit);
  $('edit-content-btn')?.addEventListener('click', startEdit);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (state.isEditing) {
        if (confirm('बिना सहेजे टैब बदलें? आपके बदलाव खो जाएंगे।')) {
          state.isEditing = false;
          state.activeTab = tab;
          render();
        }
      } else {
        state.activeTab = tab;
        render();
      }
    });
  });

  $('font-decrease')?.addEventListener('click', () => {
    state.fontLevel = decreaseLevel(state.fontLevel);
    setFontSizeLevel(state.fontLevel);
    render();
  });

  $('font-increase')?.addEventListener('click', () => {
    state.fontLevel = increaseLevel(state.fontLevel);
    setFontSizeLevel(state.fontLevel);
    render();
  });

  $('save-btn')?.addEventListener('click', () => {
    const text = $('edit-input')?.value || '';
    const original = katha[state.activeTab];
    if (text.trim() === original.trim()) {
      resetContent(state.dayIndex, state.activeTab);
    } else {
      saveCustomContent(state.dayIndex, state.activeTab, text);
    }
    state.isEditing = false;
    render();
  });

  $('cancel-btn')?.addEventListener('click', () => {
    state.isEditing = false;
    render();
  });

  $('reset-btn')?.addEventListener('click', () => {
    if (confirm('क्या आप मूल पाठ पर वापस जाना चाहते हैं? आपके संपादन हटा दिए जाएंगे।')) {
      resetContent(state.dayIndex, state.activeTab);
      state.isEditing = false;
      render();
    }
  });

  $('nav-prev')?.addEventListener('click', () => {
    if (state.dayIndex > 0) {
      navigate(`#/katha/${state.dayIndex - 1}`);
    }
  });

  $('nav-next')?.addEventListener('click', () => {
    if (state.dayIndex < kathasData.length - 1) {
      navigate(`#/katha/${state.dayIndex + 1}`);
    }
  });
}

function startEdit() {
  state.isEditing = true;
  render();
  setTimeout(() => {
    const input = document.getElementById('edit-input');
    if (input) input.focus();
  }, 100);
}
