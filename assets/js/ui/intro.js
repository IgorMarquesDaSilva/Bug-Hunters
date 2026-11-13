/* Fala digitada no primeiro acesso; a exploração só volta pelo botão de início. */
window.StoryIntro = (() => {
  const STORAGE_KEY = 'bh_story_seen';
  const SUPPORT_SCREENS = new Set(['screen-tutorial', 'screen-glossary', 'screen-shortcuts', 'screen-settings', 'screen-accessibility']);
  let timer = null;
  let active = false;
  let characters = [];
  let index = 0;
  let lastSound = -Infinity;
  let followText = true;
  const message = document.getElementById('intro-message');
  const fullText = document.getElementById('intro-complete-text').textContent.trim();
  const typed = document.getElementById('intro-typed-text');
  // A narração recebe uma única mensagem completa, sem anunciar letras isoladas.
  message.setAttribute('aria-label', fullText);

  function stopTimer() {
    clearTimeout(timer);
    timer = null;
  }

  function canType() {
    return active && index < characters.length && !document.hidden && UI.getActiveScreen() === 'screen-intro';
  }

  function schedule(delay = 28) {
    if (canType()) timer = setTimeout(typeNext, delay);
  }

  function complete() {
    if (!active) return;
    stopTimer();
    index = characters.length;
    typed.textContent = fullText;
    message.classList.remove('is-typing');
  }

  function typeNext() {
    timer = null;
    if (!canType()) return;
    const character = characters[index++];
    typed.textContent += character;
    const now = performance.now();
    if (/[\p{L}\p{N}]/u.test(character) && now - lastSound >= 65) {
      window.GameAudio?.playDialogueKey();
      lastSound = now;
    }
    if (followText) message.scrollTop = Math.max(0, typed.offsetHeight - message.clientHeight);
    if (index === characters.length) {
      message.classList.remove('is-typing');
      return;
    }
    const delay = /[.!?]/.test(character) ? 180 : /[,;:\n]/.test(character) ? 90 : 28;
    schedule(delay);
  }

  function screenChanged(screenId) {
    stopTimer();
    if (screenId !== 'screen-intro') {
      if (!SUPPORT_SCREENS.has(screenId)) {
        active = false;
        message.classList.remove('is-typing');
      }
      return;
    }
    schedule(90);
  }

  function hasBeenSeen() {
    return localStorage.getItem(STORAGE_KEY) === '1';
  }

  function open() {
    if (hasBeenSeen() || !GameState.difficulty || GameState.isGameOver) return false;
    stopTimer();
    active = true;
    characters = Array.from(fullText);
    index = 0;
    lastSound = -Infinity;
    followText = true;
    typed.textContent = '';
    message.scrollTop = 0;
    message.classList.add('is-typing');
    localStorage.setItem(STORAGE_KEY, '1');
    UI.showScreen('screen-intro');
    return true;
  }

  function close() {
    if (UI.getActiveScreen() !== 'screen-intro') return;
    active = false;
    stopTimer();
    message.classList.remove('is-typing');
    UI.showScreen(null);
    GameState.popupCooldown = 90;
    document.getElementById('gameCanvas')?.focus();
    window.AccessibilitySystem?.speak?.('Missão iniciada! Explore o setor e encontre os objetos com bugs.');
  }

  message.addEventListener('keydown', event => {
    if (event.ctrlKey || event.altKey || event.metaKey) return;
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(event.key)) followText = false;
    if (['Enter', ' '].includes(event.key) && !event.repeat) {
      event.preventDefault();
      complete();
    }
  });
  message.addEventListener('wheel', () => { followText = false; }, { passive: true });
  message.addEventListener('touchstart', () => { followText = false; }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    stopTimer();
    if (!document.hidden) schedule(90);
  });

  return { open, close, complete, screenChanged, hasBeenSeen };
})();
