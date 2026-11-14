/* ============================================================
   assets/js/ui/hud.js
============================================================ */

window.HUD = (() => {
  let lastClock = '';

  function accessibleStat(id, label) {
    const stat = document.getElementById(id)?.closest('.stat');
    if (!stat) return;
    if (!stat.hasAttribute('role')) stat.setAttribute('role', 'group');
    stat.tabIndex = 0;
    stat.setAttribute('aria-label', label);
  }

  function describeTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60) % 60;
    return `${hours ? `${hours} horas, ` : ''}${minutes} minutos e ${seconds % 60} segundos`;
  }

  function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const pad = value => String(value).padStart(2, '0');
    return minutes >= 60
      ? `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:${pad(seconds % 60)}`
      : `${pad(minutes)}:${pad(seconds % 60)}`;
  }

  function updateClock() {
    const time = formatTime(GameState.elapsedTime());
    if (time === lastClock) return;
    lastClock = time;
    setText('hud-time', time);
    accessibleStat('hud-time', `Tempo total da partida: ${describeTime(GameState.elapsedTime())}.`);
  }

  function update() {
    updateClock();
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
    accessibleStat('hud-score', `Pontuação: ${GameState.score} pontos.`);
    accessibleStat('hud-sector', `Setor ${roomNum} de 4.`);
    accessibleStat('hud-bugs', `Desafios respondidos: ${GameState.solvedCount} de ${total}.`);
    accessibleStat('hud-diff', `Dificuldade: ${cfg ? cfg.label : 'nenhuma selecionada'}.`);

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
      accessibleStat('hud-points', `${points} pontos por acerto nesta fase.`);
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
    update, updateClock, formatTime, describeTime
  };
})();
