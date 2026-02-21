const CUSTOM_CONTENT_KEY = 'vrat_katha_custom_content';
const FONT_SIZE_KEY = 'font_size_preference';

export function getCustomContent(dayIndex, tab) {
  try {
    const data = JSON.parse(localStorage.getItem(CUSTOM_CONTENT_KEY) || '{}');
    return data[`${dayIndex}_${tab}`] || null;
  } catch { return null; }
}

export function saveCustomContent(dayIndex, tab, text) {
  try {
    const data = JSON.parse(localStorage.getItem(CUSTOM_CONTENT_KEY) || '{}');
    data[`${dayIndex}_${tab}`] = text;
    localStorage.setItem(CUSTOM_CONTENT_KEY, JSON.stringify(data));
  } catch (e) { console.error('Save failed:', e); }
}

export function resetContent(dayIndex, tab) {
  try {
    const data = JSON.parse(localStorage.getItem(CUSTOM_CONTENT_KEY) || '{}');
    delete data[`${dayIndex}_${tab}`];
    localStorage.setItem(CUSTOM_CONTENT_KEY, JSON.stringify(data));
  } catch (e) { console.error('Reset failed:', e); }
}

export function hasCustomContent(dayIndex, tab) {
  return getCustomContent(dayIndex, tab) !== null;
}

const LEVELS = ['small', 'medium', 'large', 'xlarge'];
const FONT_CONFIGS = {
  small: { body: 14, lineHeight: 24, label: 'छोटा' },
  medium: { body: 16, lineHeight: 30, label: 'सामान्य' },
  large: { body: 19, lineHeight: 36, label: 'बड़ा' },
  xlarge: { body: 22, lineHeight: 42, label: 'बहुत बड़ा' },
};

export function getFontSizeLevel() {
  try {
    const stored = localStorage.getItem(FONT_SIZE_KEY);
    if (stored && LEVELS.includes(stored)) return stored;
  } catch {}
  return 'medium';
}

export function setFontSizeLevel(level) {
  try { localStorage.setItem(FONT_SIZE_KEY, level); } catch {}
}

export function getFontConfig(level) {
  return FONT_CONFIGS[level || 'medium'];
}

export function canIncrease(level) {
  return LEVELS.indexOf(level) < LEVELS.length - 1;
}

export function canDecrease(level) {
  return LEVELS.indexOf(level) > 0;
}

export function increaseLevel(level) {
  const i = LEVELS.indexOf(level);
  return i < LEVELS.length - 1 ? LEVELS[i + 1] : level;
}

export function decreaseLevel(level) {
  const i = LEVELS.indexOf(level);
  return i > 0 ? LEVELS[i - 1] : level;
}
