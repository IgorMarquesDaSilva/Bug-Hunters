/* Entrada por teclado e foco compartilhados por todas as telas. */
window.KeyboardNavigation = (() => {
  const selector = 'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex="0"]';
  let activeScreen = null;
  let returnTarget = null;
  const screenFocus = new Map();

  function focusable(root) {
    return Array.from(root.querySelectorAll(selector)).filter(element =>
      !element.closest('[inert]') && element.getClientRects().length &&
      getComputedStyle(element).visibility !== 'hidden'
    );
  }

  function currentItems() {
    const items = activeScreen ? focusable(activeScreen) : [];
    const hud = document.querySelector('.hud-panel');
    if (hud && !hud.inert) items.push(...focusable(hud));
    return items;
  }

  document.addEventListener('focusin', event => {
    const screen = event.target.closest('.overlay');
    if (screen) screenFocus.set(screen.id, event.target);
  });

  function screenChanged(screenId, { preferredFocus = null } = {}) {
    const previous = activeScreen;
    const screen = screenId ? document.getElementById(screenId) : null;
    const modal = Boolean(screen && screenId !== 'screen-bug-popup');
    if ((!previous || previous.id === 'screen-bug-popup') && screen && !document.activeElement.closest('.overlay')) {
      returnTarget = document.activeElement;
    }
    activeScreen = screen;
    document.querySelectorAll('#room-map, #mobile-controls, #gameCanvas').forEach(element => {
      element.inert = modal;
    });
    const inGame = Boolean(window.UI?.isInGameSession());
    const hud = document.querySelector('.hud-panel');
    if (hud) hud.inert = !inGame;
    if (modal) {
      screen.setAttribute('role', 'dialog');
      // Durante a partida, os apoios da barra lateral também são interativos.
      screen.setAttribute('aria-modal', String(!inGame));
      if (!screen.hasAttribute('aria-labelledby') && !screen.hasAttribute('aria-label')) {
        screen.setAttribute('aria-label', screen.querySelector('.popup-header, h1, h2, .settings-title')?.textContent.trim() || 'Menu do jogo');
      }
      screen.tabIndex = -1;
      const preferred = preferredFocus && currentItems().includes(preferredFocus)
        ? preferredFocus : screenId === 'screen-mission'
          ? screen.querySelector('#mission-desc') : null;
      (preferred || focusable(screen)[0] || screen).focus();
    } else if (!screen && (previous || preferredFocus)) {
      const target = preferredFocus || returnTarget;
      returnTarget = null;
      if (target?.isConnected && !target.closest('.overlay, [inert]') && target.matches(selector) && target.getClientRects().length) {
        target.focus();
      } else {
        document.getElementById('gameCanvas')?.focus();
      }
    }
  }

  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey) return;
    const modal = activeScreen && activeScreen.id !== 'screen-bug-popup';
    if (modal && event.key === 'Tab') {
      const items = currentItems();
      const index = items.indexOf(document.activeElement);
      if (!items.length) {
        event.preventDefault();
        activeScreen.focus();
      } else if (index === -1 || (event.shiftKey && index === 0) || (!event.shiftKey && index === items.length - 1)) {
        event.preventDefault();
        items[event.shiftKey ? items.length - 1 : 0].focus();
      }
      return;
    }
    if (event.key === 'Escape' && activeScreen) {
      const actions = {
        'screen-difficulty': () => window.backToMainMenu(),
        'screen-settings': () => window.closeSettingsMenu(),
        'screen-accessibility': () => window.backToMainMenu(),
        'screen-glossary': () => window.Glossary.close(),
        'screen-shortcuts': () => window.ShortcutHelp.close(),
        'screen-tutorial': () => TutorialSystem.close(),
        'screen-bug-popup': () => UI.closePopup()
      };
      if (actions[activeScreen.id]) {
        event.preventDefault();
        actions[activeScreen.id]();
      }
      return;
    }
    // A notificação não rouba o foco nem interrompe a exploração.
    if (event.key === 'Enter' && !event.repeat && activeScreen?.id === 'screen-bug-popup' && event.target.id === 'gameCanvas') {
      event.preventDefault();
      MissionSystem.startMission();
    }
    // Setas percorrem grupos de opções; controles de volume e blocos
    // de texto mantêm o comportamento nativo de ajuste e rolagem.
    const group = event.target.closest?.('.diff-btn')?.parentElement ||
      event.target.closest?.('.choice-btn, .matching-item, .memory-card')?.parentElement;
    if (group && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      const items = focusable(group);
      if (!items.length) return;
      const index = items.indexOf(event.target);
      const backwards = ['ArrowUp', 'ArrowLeft'].includes(event.key);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 :
        (index + (backwards ? -1 : 1) + items.length) % items.length;
      event.preventDefault();
      items[next].focus();
    }
  });

  return { screenChanged, getScreenFocus: id => screenFocus.get(id) };
})();
