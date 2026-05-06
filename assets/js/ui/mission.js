/* ============================================================
   assets/js/ui/mission.js
   Lógica do quiz.
   Agora, ao acertar uma missão, o objeto HTML/CSS correspondente
   deixa de piscar em vermelho e recebe estado resolvido.
   ============================================================ */

   const MissionSystem = (() => {

    function startMission() {
      const idx = GameState.activeIdx;
  
      if (idx === -1 || !GameState.bugs[idx]) return;
  
      const bug = GameState.bugs[idx];
      const mission = GameState.currentMissions()[bug.missionIdx];
  
      if (!mission) return;
  
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
  
      const total = GameState.currentMissions().length;
  
      document.getElementById("progress-bar").style.width =
        ((GameState.solvedCount / total) * 100) + "%";
  
      const container = document.getElementById("choices-container");
      container.innerHTML = "";
  
      mission.choices.forEach((choice, i) => {
        const btn = document.createElement("button");
  
        btn.className = "choice-btn";
        btn.textContent = String.fromCharCode(65 + i) + ")  " + choice;
        btn.setAttribute(
          "aria-label",
          `Opção ${String.fromCharCode(65 + i)}: ${choice}`
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
      if (!bug) return;
  
      const mission = GameState.currentMissions()[bug.missionIdx];
      if (!mission) return;
  
      document.querySelectorAll(".choice-btn").forEach(button => {
        button.disabled = true;
      });
  
      const expBox = document.getElementById("explanation-box");
      expBox.textContent = mission.explanation;
      expBox.style.display = "block";
  
      const feedback = document.getElementById("feedback-msg");
      const diff = GameState.difficulty;
  
      if (idx === mission.correct) {
        btn.classList.add("correct");
  
        BugSystem.markSolved(activeIdx);
        GameState.solvedCount++;
  
        const pts = CONFIG.score.pointsPerHit[diff];
        GameState.score = Math.min(100, GameState.score + pts);
  
        feedback.textContent = `✓ CORRETO! +${pts} pts`;
        feedback.className = "feedback ok";
  
        const total = GameState.currentMissions().length;
  
        document.getElementById("progress-bar").style.width =
          ((GameState.solvedCount / total) * 100) + "%";
  
      } else {
        btn.classList.add("wrong");
  
        const btns = document.querySelectorAll(".choice-btn");
  
        if (btns[mission.correct]) {
          btns[mission.correct].classList.add("correct");
        }
  
        const pen = CONFIG.score.penaltyPerWrong[diff];
  
        GameState.score = Math.max(0, GameState.score - pen);
        GameState.lives = Math.max(0, GameState.lives - 1);
  
        feedback.textContent =
          pen > 0
            ? `✗ ERRADO! -${pen} pts`
            : "✗ ERRADO! Veja a resposta correta.";
  
        feedback.className = "feedback err";
  
        if (GameState.lives === 0) {
          HUD.update();
  
          const btnNext = document.getElementById("btn-next");
          btnNext.style.display = "inline-block";
          btnNext.textContent = "▶ VER RESULTADO";
          btnNext.onclick = () => _gameOver();
  
          return;
        }
      }
  
      HUD.update();
  
      const btnNext = document.getElementById("btn-next");
      btnNext.style.display = "inline-block";
      btnNext.textContent = "▶ CONTINUAR";
      btnNext.onclick = () => closeMission();
    }
  
    function closeMission() {
      GameState.activeIdx = -1;
      GameState.popupCooldown = 90;
  
      const total = GameState.currentMissions().length;
      const done = GameState.solvedCount >= total;
  
      UI.showScreen(null);
  
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
      UI.showScreen(null);
  
      TransitionSystem.play(() => {
        GameState.currentRoom = "sala2";
        GameState.solvedCount = 0;
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
      });
    }
  
    function _finishGame() {
      document.getElementById("final-score").textContent = GameState.score;
  
      document.getElementById("final-diff").textContent =
        CONFIG.difficulties[GameState.difficulty].label;
  
      sendFinalScore({
        score: GameState.score,
        difficulty: CONFIG.difficulties[GameState.difficulty].label
      });
  
      UI.showScreen("screen-win");
    }
  
    function _gameOver() {
      GameState.isGameOver = true;
      GameState.activeIdx = -1;
  
      sendFinalScore({
        score: GameState.score,
        difficulty: CONFIG.difficulties[GameState.difficulty].label
      });
  
      document.getElementById("gameover-score").textContent = GameState.score;
  
      UI.showScreen("screen-gameover");
    }
  
    return {
      startMission,
      selectAnswer,
      closeMission,
      openPortal,
      goToNextRoom
    };
  
  })();