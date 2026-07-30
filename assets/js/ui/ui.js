/* ============================================================
   assets/js/ui/ui.js
   Controle das telas e popups do jogo
============================================================ */

window.UI = (() => {

  function showScreen(screenId) {
    document.querySelectorAll(".overlay").forEach(screen => {
      screen.style.display = "none";
    });

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
      }

      return;
    }

    GameState.isPaused = false;
  }

  function closePopup() {
    showScreen(null);
    GameState.activeIdx = -1;
    GameState.popupCooldown = 60;
  }

  function showMainMenu() {
    GameState.isPaused = true;
    showScreen("screen-main-menu");
  }

  return {
    showScreen,
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
