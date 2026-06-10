/* ============================================================
   assets/js/ui/hud.js
============================================================ */

window.HUD = (() => {
  function update() {
    const total = GameState.currentMissions().length || CONFIG.minBugsToPass;
    const diff = GameState.difficulty;
    const cfg = diff ? CONFIG.difficulties[diff] : null;

    const roomNumMap = {
      sala1: 1,
      sala2: 2,
      sala3: 3,
      sala4: 4
    };

    const roomNum = roomNumMap[GameState.currentRoom] || 1;

    setText("hud-score", GameState.score);
    setText("hud-sector", roomNum);
    setText("hud-bugs", `${GameState.solvedCount}/${total}`);

    const diffEl = document.getElementById("hud-diff");

    if (diffEl) {
      diffEl.textContent = cfg ? cfg.label : "-";
      diffEl.style.color = cfg ? cfg.color : "";
    }

    const pointsEl = document.getElementById("hud-points");

    if (pointsEl) {
      const points =
        typeof MissionSystem !== "undefined" && diff
          ? MissionSystem.getPointsPerQuestion()
          : CONFIG.score.basePointsPerQuestion;

      pointsEl.textContent = `${points} pts`;
      pointsEl.style.color = points <= 2 ? "#ff4444" : "";
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
