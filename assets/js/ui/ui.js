/* ============================================================
   assets/js/ui/ui.js  —  Gerencia telas e overlays
   FIX: isPaused só é false quando null (gameplay livre)
        Tela de bug-popup não pausa o gameloop completamente —
        apenas bloqueia movimento; assim o player não "trava".
   ============================================================ */

const UI = (() => {

  const ALL_SCREENS = [
    "screen-difficulty",
    "screen-bug-popup",
    "screen-mission",
    "screen-room-clear",
    "screen-next-level",
    "screen-win",
    "screen-gameover"
  ];

  function showScreen(id) {
    ALL_SCREENS.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.style.display = "none";
    });

    if (id) {
      const el = document.getElementById(id);
      if (el) el.style.display = "flex";
    }

    // Pausa MOVIMENTO do player sempre que qualquer tela está aberta
    GameState.isPaused = !!id;
  }

  // Fecha popup de aproximação — RESETA activeIdx para não retravar
  function closePopup() {
    GameState.activeIdx    = -1;
    GameState.popupCooldown = 120; // 2 segundos de cooldown antes de reativar
    showScreen(null);
  }

  return { showScreen, closePopup };
})();
