import { getKathaForDay, getTodayDayIndex } from '../data.js';
import { navigate, goBack } from '../router.js';
import {
  getFontSizeLevel,
  setFontSizeLevel,
  getFontConfig,
  canIncrease,
  canDecrease,
  increaseLevel,
  decreaseLevel,
} from '../storage.js';
import { renderEmptyKathaMarkup, renderKathaMarkup } from './templates/katha-template.js';

const TAB_LABELS = { katha: 'कथा', vidhi: 'व्रत विधि', aarti: 'आरती' };

let state = {
  dayIndex: 0,
  activeTab: 'katha',
  fontLevel: 'medium',
};

let kathasData = [];

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
  state.fontLevel = getFontSizeLevel();

  render({ animate: true });
}

function render(options = {}) {
  const { animate = false } = options;
  const app = document.getElementById('app');
  const katha = getKathaForDay(kathasData, state.dayIndex);

  if (!katha) {
    app.innerHTML = renderEmptyKathaMarkup(animate);
    return;
  }

  const maxDayIndex = Math.max(kathasData.length - 1, 0);
  const canPrev = state.dayIndex > 0;
  const canNext = state.dayIndex < maxDayIndex;
  const prevKatha = canPrev ? getKathaForDay(kathasData, state.dayIndex - 1) : null;
  const nextKatha = canNext ? getKathaForDay(kathasData, state.dayIndex + 1) : null;

  app.innerHTML = renderKathaMarkup({
    katha,
    animate,
    isToday: state.dayIndex === getTodayDayIndex(),
    activeTab: state.activeTab,
    canPrev,
    canNext,
    prevKatha,
    nextKatha,
    tabLabels: TAB_LABELS,
  });

  bindEvents(katha);
  applyStateToView(katha);
}

function applyStateToView(katha) {
  const $ = (id) => document.getElementById(id);
  const fontConfig = getFontConfig(state.fontLevel);

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    const isActive = btn.dataset.tab === state.activeTab;
    btn.classList.toggle('active', isActive);
  });

  const contentText = $('content-text');
  if (contentText) {
    contentText.textContent = katha[state.activeTab] || '';
    contentText.style.fontSize = `${fontConfig.body}px`;
    contentText.style.lineHeight = `${fontConfig.lineHeight}px`;
  }

  const fontLabel = $('font-size-label');
  if (fontLabel) fontLabel.textContent = fontConfig.label;

  const decreaseBtn = $('font-decrease');
  if (decreaseBtn) decreaseBtn.disabled = !canDecrease(state.fontLevel);

  const increaseBtn = $('font-increase');
  if (increaseBtn) increaseBtn.disabled = !canIncrease(state.fontLevel);
}

function bindEvents(katha) {
  const $ = (id) => document.getElementById(id);

  $('back-btn')?.addEventListener('click', (event) => {
    event.preventDefault();
    goBack();
  });

  document.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', (event) => {
      event.preventDefault();
      const tab = btn.dataset.tab;
      if (!Object.prototype.hasOwnProperty.call(TAB_LABELS, tab) || state.activeTab === tab) return;
      state.activeTab = tab;
      applyStateToView(katha);
    });
  });

  $('font-decrease')?.addEventListener('click', (event) => {
    event.preventDefault();
    if (!canDecrease(state.fontLevel)) return;
    state.fontLevel = decreaseLevel(state.fontLevel);
    setFontSizeLevel(state.fontLevel);
    applyStateToView(katha);
  });

  $('font-increase')?.addEventListener('click', (event) => {
    event.preventDefault();
    if (!canIncrease(state.fontLevel)) return;
    state.fontLevel = increaseLevel(state.fontLevel);
    setFontSizeLevel(state.fontLevel);
    applyStateToView(katha);
  });

  $('nav-prev')?.addEventListener('click', (event) => {
    event.preventDefault();
    if (state.dayIndex > 0) navigate(`#/katha/${state.dayIndex - 1}`);
  });

  $('nav-next')?.addEventListener('click', (event) => {
    event.preventDefault();
    if (state.dayIndex < kathasData.length - 1) navigate(`#/katha/${state.dayIndex + 1}`);
  });
}
