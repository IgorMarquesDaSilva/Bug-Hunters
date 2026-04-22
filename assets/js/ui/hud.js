/* ============================================================
   assets/js/ui/hud.js  —  Atualiza o painel lateral
   ============================================================ */

const HUD = (() => {

  function update() {
    const total   = GameState.currentMissions().length || 5;
    const diff    = GameState.difficulty;
    const cfg     = diff ? CONFIG.difficulties[diff] : null;
    const roomNum = GameState.currentRoom === "sala1" ? 1 : 2;

    _set("hud-score",  GameState.score);
    _set("hud-sector", roomNum);
    _set("hud-bugs",   `${GameState.solvedCount}/${total}`);

    const diffEl = document.getElementById("hud-diff");
    if (diffEl) {
      diffEl.textContent = cfg ? cfg.label : "—";
      diffEl.style.color = cfg ? cfg.color : "";
    }

    // Vidas como sprites de coração pixel art
    const maxLives  = cfg ? cfg.lives : 3;
    const livesEl   = document.getElementById("hud-lives");
    if (livesEl) {
      let hearts = "";
      for (let i = 0; i < maxLives; i++) {
        hearts += i < GameState.lives ? "♥ " : "♡ ";
      }
      livesEl.textContent = hearts.trim();
      livesEl.style.color = GameState.lives === 1 ? "#ff4444" :
                            GameState.lives === 0 ? "#ff4444" : "";
    }
  }

  function _set(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }

  return { update };
})();
