/* ============================================================
   assets/js/ui/ui.js
   Controle das telas e popups do jogo
============================================================ */

window.UI = (() => {
  let activeScreenId = null;
  let supportReturn = null;

  function displayScreen(screenId, preferredFocus = null) {
    const proximityPrompt = document.getElementById("screen-bug-popup");
    const wasProximityPromptOpen =
      proximityPrompt && getComputedStyle(proximityPrompt).display !== "none";
    const abandonsProximityPrompt =
      wasProximityPromptOpen &&
      screenId !== "screen-bug-popup" &&
      screenId !== "screen-mission";

    if (abandonsProximityPrompt) {
      GameState.activeIdx = -1;
      GameState.popupCooldown = 0;
    }

    // Parar o alarme de bug na hora que abrir a tela da missão/task ou trocar de tela
    if (screenId === "screen-mission" || abandonsProximityPrompt) {
      if (window.GameAudio && typeof window.GameAudio.stopBugAlert === "function") {
        window.GameAudio.stopBugAlert();
      }
    }

    document.querySelectorAll(".overlay").forEach(screen => {
      screen.style.display = "none";
    });

    activeScreenId = screenId;
    document.body.dataset.activeScreen = screenId || "gameplay";
    document.body.classList.toggle("in-game-session", Boolean(GameState.difficulty) &&
      !["screen-main-menu", "screen-difficulty"].includes(screenId));

    const missionScreen = document.getElementById("screen-mission");
    const opensHardMission =
      screenId === "screen-mission" &&
      missionScreen?.classList.contains("mission-screen-hard");
    const opensProximityPrompt = screenId === "screen-bug-popup";

    document.body.classList.toggle("hard-mission-open", opensHardMission);
    document.body.classList.toggle("proximity-popup-open", opensProximityPrompt);
    document.body.classList.toggle(
      "overlay-open",
      Boolean(screenId) && !opensProximityPrompt
    );
    document.body.classList.toggle(
      "gameplay-active",
      !screenId || opensProximityPrompt
    );

    if (screenId && !opensProximityPrompt) {
      window.Player?.clearDirectionInput?.();
      window.MobileControls?.releaseAll?.();
    }

    if (screenId) {
      const screen = document.getElementById(screenId);

      if (screen) {
        screen.style.display = "flex";
        GameState.isPaused = !opensProximityPrompt;
        window.KeyboardNavigation?.screenChanged(screenId, { preferredFocus });
      }

      return;
    }

    GameState.isPaused = false;
    window.KeyboardNavigation?.screenChanged(null, { preferredFocus });
  }

  function showScreen(screenId) {
    supportReturn = null;
    displayScreen(screenId);
  }

  function openSupport(screenId) {
    if (activeScreenId === screenId) return false;
    if (!supportReturn) {
      const origin = activeScreenId === "screen-bug-popup" ? null : activeScreenId;
      supportReturn = {
        screenId: origin,
        focus: origin
          ? window.KeyboardNavigation?.getScreenFocus(origin)
          : document.activeElement
      };
    }
    displayScreen(screenId);
    return true;
  }

  function closeSupport() {
    const origin = supportReturn;
    supportReturn = null;
    // A missão continua montada: alternativas, cartas e ligações não mudam.
    displayScreen(origin?.screenId || null, origin?.focus || null);
  }

  function closePopup() {
    showScreen(null);
    GameState.activeIdx = -1;
    GameState.popupCooldown = 60;
    if (window.GameAudio && typeof window.GameAudio.stopBugAlert === "function") {
      window.GameAudio.stopBugAlert();
    }
  }

  function showMainMenu() {
    GameState.isPaused = true;
    showScreen("screen-main-menu");
  }

  return {
    showScreen,
    openSupport,
    closeSupport,
    getActiveScreen: () => activeScreenId,
    isInGameSession: () => document.body.classList.contains("in-game-session"),
    closePopup,
    showMainMenu
  };

})();

/* ============================================================
   Funções globais usadas pelos botões da tela inicial
============================================================ */

function startGameFromMenu() {
  UI.showScreen("screen-difficulty");
}

function openSettingsMenu() {
  UI.showScreen("screen-settings");
}

function openAccessibilityMenu() {
  UI.showScreen("screen-accessibility");
}

function backToMainMenu() {
  UI.showScreen("screen-main-menu");
}
