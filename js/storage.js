const FONT_SIZE_KEY = 'font_size_preference';
const INSTALL_PROMPT_SEEN_KEY = 'a2hs_prompt_seen';

const LEVELS = ['small', 'medium', 'large', 'xlarge'];
const FONT_CONFIGS = {
  small: { body: 14, lineHeight: 24, label: 'छोटा' },
  medium: { body: 16, lineHeight: 30, label: 'सामान्य' },
  large: { body: 19, lineHeight: 36, label: 'बड़ा' },
  xlarge: { body: 22, lineHeight: 42, label: 'बहुत बड़ा' },
};

function readLocalStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeLocalStorage(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures in private mode or restricted environments.
  }
}

export function getFontSizeLevel() {
  const stored = readLocalStorage(FONT_SIZE_KEY);
  if (stored && LEVELS.includes(stored)) return stored;
  return 'medium';
}

export function setFontSizeLevel(level) {
  writeLocalStorage(FONT_SIZE_KEY, level);
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

export function hasSeenInstallPrompt() {
  return readLocalStorage(INSTALL_PROMPT_SEEN_KEY) === '1';
}

export function markInstallPromptSeen() {
  writeLocalStorage(INSTALL_PROMPT_SEEN_KEY, '1');
}
