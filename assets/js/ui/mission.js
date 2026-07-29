/* ============================================================
   assets/js/ui/mission.js
   Sistema de missoes, pontuacao por fase e progressao.
============================================================ */

const MissionSystem = (() => {
  const ROOM_ORDER = ["sala1", "sala2", "sala3", "sala4"];

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function getRoomNumber(room = GameState.currentRoom) {
    const index = ROOM_ORDER.indexOf(room);
    return index === -1 ? 1 : index + 1;
  }

  function getRoomRestarts(room = GameState.currentRoom) {
    return GameState.roomRestarts?.[room] ?? 0;
  }

  function getPointsPerQuestion(room = GameState.currentRoom) {
    const restarts = getRoomRestarts(room);
    const scoreCfg = CONFIG.score;

    return Math.max(
      scoreCfg.minPointsPerQuestion,
      scoreCfg.basePointsPerQuestion - restarts
    );
  }

  function getMinimumPhaseScore(room = GameState.currentRoom) {
    const scoreCfg = CONFIG.score;
    const minCorrect = scoreCfg.minCorrectByRoom[room] ?? 2;
    const minimumByQuestions = minCorrect * getPointsPerQuestion(room);

    return Math.max(scoreCfg.minimumPhaseFloor, minimumByQuestions);
  }

  function getRequiredScoreToAdvance(room = GameState.currentRoom) {
    return GameState.clearedMinimumScore + getMinimumPhaseScore(room);
  }

  function updateProgressBar() {
    const total = GameState.currentMissions().length || CONFIG.minBugsToPass;
    const progress = total > 0 ? (GameState.solvedCount / total) * 100 : 0;
    const bar = document.getElementById("progress-bar");

    if (bar) bar.style.width = progress + "%";
  }

  function startMission() {
    const idx = GameState.activeIdx;

    if (idx === -1 || !GameState.bugs[idx]) return;

    const bug = GameState.bugs[idx];
    const mission = GameState.currentMissions()[bug.missionIdx];

    if (!mission) return;

    const isHardMode = GameState.difficulty === "dificil";
    const missionScreen = document.getElementById("screen-mission");
    const missionPanel = missionScreen?.querySelector(".mission-panel");
    const questionLabel = document.getElementById("question-label");
    const codeBlock = document.getElementById("mission-code")?.parentElement;
    const hardMissionSector = document.getElementById("hard-mission-sector");

    missionScreen?.classList.toggle("mission-screen-hard", isHardMode);
    missionPanel?.classList.toggle("mission-panel-hard", isHardMode);

    if (questionLabel) {
      questionLabel.textContent = isHardMode
        ? "▶ SELECIONE O BLOCO DE CÓDIGO CORRETO:"
        : "▶ SELECIONE A RESPOSTA CORRETA:";
    }

    if (codeBlock) {
      codeBlock.dataset.fileLabel = isHardMode
        ? "■ CONTEXTO.ptg"
        : "■ CODIGO.ptg";
    }

    if (hardMissionSector) {
      hardMissionSector.textContent =
        `SETOR ${String(getRoomNumber()).padStart(2, "0")}`;
    }

    document.getElementById("mission-title").textContent = mission.title;
    document.getElementById("mission-desc").textContent = mission.desc;
    document.getElementById("mission-code").textContent = mission.code;

    const feedback = document.getElementById("feedback-msg");
    feedback.textContent = "";
    feedback.className = "feedback";

    const expBox = document.getElementById("explanation-box");
    expBox.textContent = "";
    expBox.style.display = "none";

    const btnNext = document.getElementById("btn-next");
    btnNext.style.display = "none";
    btnNext.textContent = "▶ CONTINUAR";
    btnNext.onclick = null;

    updateProgressBar();

    const container = document.getElementById("choices-container");
    container.innerHTML = "";

    mission.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      const choiceLetter = String.fromCharCode(65 + i);

      btn.className = isHardMode
        ? "choice-btn code-choice-btn"
        : "choice-btn";

      if (isHardMode) {
        const marker = document.createElement("span");
        marker.className = "code-choice-marker";
        marker.textContent = choiceLetter;
        marker.setAttribute("aria-hidden", "true");

        const code = document.createElement("pre");
        code.className = "code-choice-content";
        code.textContent = choice;
        code.setAttribute("aria-hidden", "true");

        btn.append(marker, code);
      } else {
        btn.textContent = `${choiceLetter})  ${choice}`;
      }

      btn.setAttribute(
        "aria-label",
        isHardMode
          ? `Opcao ${choiceLetter}, bloco de codigo: ${choice}`
          : `Opcao ${choiceLetter}: ${choice}`
      );

      btn.onclick = () => selectAnswer(i, btn);

      container.appendChild(btn);
    });

    UI.showScreen("screen-mission");
  }

  function selectAnswer(idx, btn) {
    const activeIdx = GameState.activeIdx;

    if (activeIdx === -1) return;

    const bug = GameState.bugs[activeIdx];

    if (!bug || bug.solved) return;

    const mission = GameState.currentMissions()[bug.missionIdx];

    if (!mission) return;

    document.querySelectorAll(".choice-btn").forEach(button => {
      button.disabled = true;
    });

    const expBox = document.getElementById("explanation-box");
    expBox.textContent = mission.explanation;
    expBox.style.display = "block";

    const feedback = document.getElementById("feedback-msg");
    const answeredCorrectly = idx === mission.correct;

    if (answeredCorrectly) {
      const pts = getPointsPerQuestion();

      btn.classList.add("correct");
      GameState.score = Math.min(100, GameState.score + pts);
      GameState.roomScore += pts;

      feedback.textContent = `✓ CORRETO! +${pts} pts`;
      feedback.className = "feedback ok";
      if (window.GameAudio) GameAudio.playConfirm();
    } else {
      btn.classList.add("wrong");

      const btns = document.querySelectorAll(".choice-btn");
      if (btns[mission.correct]) btns[mission.correct].classList.add("correct");

      feedback.textContent = "✗ ERRADO! +0 pts. Veja a resposta correta.";
      feedback.className = "feedback err";
      if (window.GameAudio) GameAudio.playError();
    }

    BugSystem.markSolved(activeIdx);
    GameState.solvedCount++;
    updateProgressBar();
    HUD.update();

    const btnNext = document.getElementById("btn-next");
    btnNext.style.display = "inline-block";
    btnNext.textContent = "▶ CONTINUAR";
    btnNext.onclick = () => closeMission();
  }

  function closeMission() {
    GameState.activeIdx = -1;
    GameState.popupCooldown = 90;

    const total = GameState.currentMissions().length || CONFIG.minBugsToPass;
    const done = GameState.solvedCount >= total;

    UI.showScreen(null);

    if (done) {
      setTimeout(showRoomResult, 100);
    }
  }

  function showRoomResult() {
    const requiredScore = getRequiredScoreToAdvance();

    if (GameState.score >= requiredScore) {
      setText("room-clear-score", GameState.score);
      setText("room-clear-required", requiredScore);
      UI.showScreen("screen-room-clear");
      return;
    }

    const nextRestart = getRoomRestarts() + 1;

    if (nextRestart >= CONFIG.score.gameOverRestartCount) {
      _gameOver("A pontuacao minima nao pode mais ser alcancada nesta fase.");
      return;
    }

    fillRetryScreen(requiredScore, nextRestart);
    UI.showScreen("screen-room-retry");
  }

  function fillRetryScreen(requiredScore, nextRestart) {
    const nextPoints = Math.max(
      CONFIG.score.minPointsPerQuestion,
      CONFIG.score.basePointsPerQuestion - nextRestart
    );

    setText("retry-room", getRoomNumber());
    setText("retry-current-score", GameState.score);
    setText("retry-required-score", requiredScore);
    setText("retry-room-score", GameState.roomScore);
    setText("retry-next-points", nextPoints);
  }

  function restartCurrentRoom() {
    const room = GameState.currentRoom;
    const nextRestart = getRoomRestarts(room) + 1;

    if (nextRestart >= CONFIG.score.gameOverRestartCount) {
      _gameOver("A pontuacao minima nao pode mais ser alcancada nesta fase.");
      return;
    }

    GameState.score = Math.max(0, GameState.score - GameState.roomScore);
    GameState.roomScore = 0;
    GameState.solvedCount = 0;
    GameState.activeIdx = -1;
    GameState.popupCooldown = 0;
    GameState.portal = { visible: false, triggered: false, pulse: 0 };
    GameState.roomRestarts[room] = nextRestart;

    Renderer.loadRoomBackground();
    CollisionSystem.loadZones();
    BugSystem.spawnBugs();
    Player.resetToRoomStart();
    HUD.update();
    UI.showScreen(null);
  }

  function openPortal() {
    GameState.portal.visible = true;
    UI.showScreen(null);
  }

  function getNextRoom() {
    const currentIndex = ROOM_ORDER.indexOf(GameState.currentRoom);

    return ROOM_ORDER[currentIndex + 1] || null;
  }

  function goToNextRoom() {
    UI.showScreen(null);

    const requiredScore = getRequiredScoreToAdvance();
    const nextRoom = getNextRoom();

    GameState.clearedMinimumScore = requiredScore;

    if (!nextRoom) {
      _finishGame();
      return;
    }

    TransitionSystem.play(() => {
      GameState.currentRoom = nextRoom;
      GameState.solvedCount = 0;
      GameState.roomScore = 0;
      GameState.portal = {
        visible: false,
        triggered: false,
        pulse: 0
      };

      GameState.activeIdx = -1;
      GameState.popupCooldown = 0;

      Renderer.loadRoomBackground();
      CollisionSystem.loadZones();
      BugSystem.spawnBugs();
      Player.resetToRoomStart();
      HUD.update();
      if (window.GameAudio) GameAudio.playRoom(GameState.currentRoom);
    });
  }

  function _finishGame() {
    document.getElementById("final-score").textContent = GameState.score;

    document.getElementById("final-diff").textContent =
      CONFIG.difficulties[GameState.difficulty].label;

    sendFinalScore({
      score: GameState.score,
      difficulty: getPlatformDifficulty() || GameState.difficulty
    });

    if (window.GameAudio) GameAudio.playVictory();

    UI.showScreen("screen-win");
  }

  function _gameOver(reason) {
    GameState.isGameOver = true;
    GameState.activeIdx = -1;

    sendFinalScore({
      score: GameState.score,
      difficulty: getPlatformDifficulty() || GameState.difficulty
    });

    setText("gameover-reason", reason || "A pontuacao minima nao foi atingida.");
    setText("gameover-score", GameState.score);

    if (window.GameAudio) GameAudio.playGameOver();

    UI.showScreen("screen-gameover");
  }

  return {
    startMission,
    selectAnswer,
    closeMission,
    openPortal,
    goToNextRoom,
    restartCurrentRoom,
    getPointsPerQuestion,
    getMinimumPhaseScore,
    getRequiredScoreToAdvance
  };
})();
