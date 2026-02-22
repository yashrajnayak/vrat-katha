import { hasSeenInstallPrompt, markInstallPromptSeen } from './storage.js';

const PROMPT_ID = 'a2hs-install-prompt';

let deferredPrompt = null;
let isVisible = false;

function isMobileDevice() {
  const hasTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
  const compactViewport = window.matchMedia('(max-width: 900px)').matches;
  return hasTouch && compactViewport;
}

function isStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isiOS() {
  return /iPad|iPhone|iPod/.test(window.navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

function shouldShowPrompt() {
  return isMobileDevice() && !isStandaloneMode() && !hasSeenInstallPrompt();
}

function getPromptMessage() {
  if (deferredPrompt) {
    return 'नीचे दिए गए बटन से ऐप को होम स्क्रीन पर जोड़ें और जल्दी खोलें।';
  }

  if (isiOS()) {
    return 'Safari में शेयर बटन दबाएं और "Add to Home Screen" चुनें।';
  }

  return 'ब्राउज़र मेनू खोलें और "Add to Home screen" विकल्प चुनें।';
}

function getPrimaryLabel() {
  return deferredPrompt ? 'होम स्क्रीन में जोड़ें' : 'समझ गया';
}

function updatePromptContent() {
  const promptNode = document.getElementById(PROMPT_ID);
  if (!promptNode) return;

  const messageNode = promptNode.querySelector('[data-role="message"]');
  const actionNode = promptNode.querySelector('[data-role="action"]');

  if (messageNode) messageNode.textContent = getPromptMessage();
  if (actionNode) actionNode.textContent = getPrimaryLabel();
}

function removePrompt() {
  const promptNode = document.getElementById(PROMPT_ID);
  if (promptNode) promptNode.remove();
  isVisible = false;
}

function dismissPrompt() {
  removePrompt();
}

async function onPrimaryAction() {
  if (deferredPrompt) {
    const promptEvent = deferredPrompt;
    deferredPrompt = null;

    try {
      await promptEvent.prompt();
      await promptEvent.userChoice;
    } catch {
      // Ignore prompt failures and close once to honor first-use behavior.
    }
  }

  dismissPrompt();
}

function renderPrompt() {
  if (isVisible || document.getElementById(PROMPT_ID) || !shouldShowPrompt()) return;

  const promptNode = document.createElement('div');
  promptNode.id = PROMPT_ID;
  promptNode.className = 'a2hs-prompt';
  promptNode.innerHTML = `
    <div class="a2hs-prompt-card" role="dialog" aria-live="polite" aria-label="Add to Home Screen">
      <div class="a2hs-prompt-title">होम स्क्रीन में जोड़ें</div>
      <div class="a2hs-prompt-message" data-role="message">${getPromptMessage()}</div>
      <div class="a2hs-prompt-actions">
        <button class="a2hs-prompt-btn secondary" type="button" data-role="dismiss">बाद में</button>
        <button class="a2hs-prompt-btn primary" type="button" data-role="action">${getPrimaryLabel()}</button>
      </div>
    </div>
  `;

  promptNode.querySelector('[data-role="dismiss"]')?.addEventListener('click', (event) => {
    event.preventDefault();
    dismissPrompt();
  });

  promptNode.querySelector('[data-role="action"]')?.addEventListener('click', async (event) => {
    event.preventDefault();
    await onPrimaryAction();
  });

  document.body.appendChild(promptNode);
  markInstallPromptSeen();
  isVisible = true;
}

function scheduleInitialPrompt() {
  if (!shouldShowPrompt()) return;
  window.setTimeout(() => {
    if (shouldShowPrompt()) renderPrompt();
  }, 1200);
}

export function initInstallPrompt() {
  if (typeof window === 'undefined') return;

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    updatePromptContent();
    renderPrompt();
  });

  window.addEventListener('appinstalled', () => {
    markInstallPromptSeen();
    deferredPrompt = null;
    removePrompt();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleInitialPrompt, { once: true });
  } else {
    scheduleInitialPrompt();
  }
}
