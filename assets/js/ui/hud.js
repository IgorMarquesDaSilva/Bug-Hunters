/* ============================================================
   assets/js/ui/hud.js
============================================================ */

window.HUD = (() => {

  function update() {
    const total = GameState.currentMissions().length || 5;
    const diff = GameState.difficulty;
    const cfg = diff ? CONFIG.difficulties[diff] : null;

    const roomNumMap = {
      sala1: 1,
      sala2: 2,
      sala3: 3
    };

    const roomNum = roomNumMap[GameState.currentRoom] || 1;

    setText("hud-score", GameState.score);
    setText("hud-sector", roomNum);
    setText("hud-bugs", `${GameState.solvedCount}/${total}`);

    const diffEl = document.getElementById("hud-diff");

    if (diffEl) {
      diffEl.textContent = cfg ? cfg.label : "—";
      diffEl.style.color = cfg ? cfg.color : "";
    }

    const maxLives = cfg ? cfg.lives : 3;
    const livesEl = document.getElementById("hud-lives");

    if (livesEl) {
      let hearts = "";

      for (let i = 0; i < maxLives; i++) {
        hearts += i < GameState.lives ? "♥ " : "♡ ";
      }

      livesEl.textContent = hearts.trim();
      livesEl.style.color = GameState.lives <= 1 ? "#ff4444" : "";
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);

    if (el) {
      el.textContent = value;
    }
  }

  return {
    update
  };

})();