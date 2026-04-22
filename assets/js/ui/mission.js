/* ============================================================
   assets/js/ui/mission.js
   Lógica do quiz: abrir, responder, fechar, avançar de sala.
   FIX: closeMission reseta activeIdx ANTES de chamar showScreen
        selectAnswer verifica activeIdx ainda válido
        Game over quando vidas chegam a 0
   ============================================================ */

const MissionSystem = (() => {

  function startMission() {
    const idx = GameState.activeIdx;
    if (idx === -1 || !GameState.bugs[idx]) return;

    const bug     = GameState.bugs[idx];
    const mission = GameState.currentMissions()[bug.missionIdx];
    if (!mission) return;

    document.getElementById("mission-title").textContent = mission.title;
    document.getElementById("mission-desc").textContent  = mission.desc;
    document.getElementById("mission-code").textContent  = mission.code;

    const feedback = document.getElementById("feedback-msg");
    feedback.textContent = ""; feedback.className = "feedback";

    const expBox = document.getElementById("explanation-box");
    expBox.textContent = ""; expBox.style.display = "none";

    document.getElementById("btn-next").style.display = "none";

    const total = GameState.currentMissions().length;
    document.getElementById("progress-bar").style.width =
      ((GameState.solvedCount / total) * 100) + "%";

    const container = document.getElementById("choices-container");
    container.innerHTML = "";
    mission.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className   = "choice-btn";
      btn.textContent = String.fromCharCode(65 + i) + ")  " + choice;
      btn.setAttribute("aria-label", `Opção ${String.fromCharCode(65+i)}: ${choice}`);
      btn.onclick = () => selectAnswer(i, btn);
      container.appendChild(btn);
    });

    UI.showScreen("screen-mission");
  }

  function selectAnswer(idx, btn) {
    // FIX: valida que ainda temos um bug ativo
    const activeIdx = GameState.activeIdx;
    if (activeIdx === -1) return;

    const bug     = GameState.bugs[activeIdx];
    const mission = GameState.currentMissions()[bug.missionIdx];
    if (!mission) return;

    document.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);

    const expBox   = document.getElementById("explanation-box");
    expBox.textContent   = mission.explanation;
    expBox.style.display = "block";

    const feedback = document.getElementById("feedback-msg");
    const diff     = GameState.difficulty;

    if (idx === mission.correct) {
      btn.classList.add("correct");
      bug.solved = true;
      GameState.solvedCount++;

      const pts = CONFIG.score.pointsPerHit[diff];
      GameState.score = Math.min(100, GameState.score + pts);
      feedback.textContent = `✓ CORRETO! +${pts} pts`;
      feedback.className   = "feedback ok";

      const total = GameState.currentMissions().length;
      document.getElementById("progress-bar").style.width =
        ((GameState.solvedCount / total) * 100) + "%";

    } else {
      btn.classList.add("wrong");
      const btns = document.querySelectorAll(".choice-btn");
      if (btns[mission.correct]) btns[mission.correct].classList.add("correct");

      const pen = CONFIG.score.penaltyPerWrong[diff];
      GameState.score = Math.max(0, GameState.score - pen);
      GameState.lives = Math.max(0, GameState.lives - 1);

      feedback.textContent = pen > 0 ? `✗ ERRADO! -${pen} pts` : "✗ ERRADO! Veja a resposta correta.";
      feedback.className   = "feedback err";

      // Game over sem vidas
      if (GameState.lives === 0) {
        HUD.update();
        document.getElementById("btn-next").style.display = "inline-block";
        document.getElementById("btn-next").textContent   = "▶ VER RESULTADO";
        document.getElementById("btn-next").onclick       = () => _gameOver();
        return;
      }
    }

    HUD.update();
    document.getElementById("btn-next").style.display  = "inline-block";
    document.getElementById("btn-next").textContent    = "▶ CONTINUAR";
    document.getElementById("btn-next").onclick        = () => closeMission();
  }

  function closeMission() {
    // FIX: reseta activeIdx ANTES de mudar tela para evitar re-trigger
    GameState.activeIdx    = -1;
    GameState.popupCooldown = 90; // ~1.5s cooldown

    const total = GameState.currentMissions().length;
    const done  = GameState.solvedCount >= total;

    UI.showScreen(null); // fecha tela

    if (done) {
      if (GameState.currentRoom === "sala1") {
        setTimeout(() => UI.showScreen("screen-room-clear"), 100);
      } else {
        setTimeout(() => _finishGame(), 100);
      }
    }
  }

  function openPortal() {
    GameState.portal.visible = true;
    UI.showScreen(null);
  }

  function goToNextRoom() {
    GameState.currentRoom   = "sala2";
    GameState.solvedCount   = 0;
    GameState.portal        = { visible: false, triggered: false, pulse: 0 };
    GameState.activeIdx     = -1;
    GameState.popupCooldown = 0;

    CollisionSystem.loadZones();
    Renderer.loadRoomBackground();
    BugSystem.spawnBugs();
    Player.resetToRoomStart();
    HUD.update();
    UI.showScreen(null);
  }

  function _finishGame() {
    document.getElementById("final-score").textContent = GameState.score;
    document.getElementById("final-diff").textContent  =
      CONFIG.difficulties[GameState.difficulty].label;

    sendFinalScore({
      score:      GameState.score,
      difficulty: CONFIG.difficulties[GameState.difficulty].label
    });

    UI.showScreen("screen-win");
  }

  function _gameOver() {
    GameState.isGameOver = true;
    GameState.activeIdx  = -1;

    sendFinalScore({
      score:      GameState.score,
      difficulty: CONFIG.difficulties[GameState.difficulty].label
    });

    document.getElementById("gameover-score").textContent = GameState.score;
    UI.showScreen("screen-gameover");
  }

  return { startMission, selectAnswer, closeMission, openPortal, goToNextRoom };
})();
