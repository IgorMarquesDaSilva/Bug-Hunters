/* ============================================================
   assets/js/ui/ui.js
   Controle das telas e popups do jogo
============================================================ */

window.UI = (() => {

  function showScreen(screenId) {
    document.querySelectorAll(".overlay").forEach(screen => {
      screen.style.display = "none";
    });

    if (screenId) {
      const screen = document.getElementById(screenId);

      if (screen) {
        screen.style.display = "flex";
        GameState.isPaused = true;
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

  return {
    showScreen,
    closePopup
  };

})();