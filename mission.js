const MISSIONS = [
  {
    title: "MISSÃO 01 — Condição de Energia",
    desc: "O robô deve retornar à base quando a energia estiver baixa. Qual palavra completa o código?",
    code: "___ energia < 20:\n    retornar_base()",
    choices: ["if", "for", "while", "def"],
    correct: 0,
    explanation: '"if" verifica uma condição. Se energia < 20 for verdadeiro, a ação é executada.'
  },
  {
    title: "MISSÃO 02 — Loop de Escaneamento",
    desc: "O sistema precisa repetir o escaneamento 5 vezes. Qual estrutura usar?",
    code: "___ i in range(5):\n    escanear(i)",
    choices: ["if", "for", "def", "return"],
    correct: 1,
    explanation: '"for" repete um bloco de código várias vezes — ideal para percorrer listas ou intervalos.'
  },
  {
    title: "MISSÃO 03 — Valor Inicial",
    desc: "O contador de bugs deve começar em zero. Qual opção está correta?",
    code: "bugs = ___\nprint(bugs)",
    choices: ['"zero"', "true", "0", "vazio"],
    correct: 2,
    explanation: 'Para guardar o número zero, usamos 0 (sem aspas). Aspas indicariam texto, não número.'
  },
  {
    title: "MISSÃO 04 — Operador Lógico",
    desc: "O sistema só age se a energia estiver ok E o status for 'ativo'. Qual operador usar?",
    code: "if energia > 10 ___ status == 'ativo':\n    continuar()",
    choices: ["or", "not", "and", "+"],
    correct: 2,
    explanation: '"and" exige que AMBAS as condições sejam verdadeiras. "or" bastaria apenas uma delas.'
  },
  {
    title: "MISSÃO 05 — Definindo Função",
    desc: "O programador quer criar uma função chamada verificar_erro. Como começar?",
    code: "___ verificar_erro():\n    return True",
    choices: ["var", "function", "def", "create"],
    correct: 2,
    explanation: 'Em Python, usamos "def" para definir (criar) uma função. Em JavaScript seria "function".'
  }
];

const mission = {
  bugs: [],
  activeBugIdx: -1,
  missionActive: false,
  solvedCount: 0,
  score: 0,
  lives: 3
};

function hideAll() {
  document.getElementById("missionPopup").style.display  = "none";
  document.getElementById("missionScreen").style.display = "none";
  document.getElementById("winScreen").style.display     = "none";
}

function showOverlay(id) {
  hideAll();
  if (id) document.getElementById(id).style.display = "flex";
}

function initBugs() {
  const positions = [
    { x: 740, y: 60  },
    { x: 600, y: 300 },
    { x: 200, y: 340 },
    { x: 440, y: 140 },
    { x: 320, y: 220 }
  ];
  mission.bugs = MISSIONS.map((m, i) => ({
    x: positions[i].x,
    y: positions[i].y,
    w: 28,
    h: 28,
    solved: false,
    pulse: Math.random() * Math.PI * 2,
    missionIdx: i
  }));
}

function drawMission(ctx, playerX, playerY, playerSize) {
  mission.bugs.forEach(b => {
    if (b.solved) {
      ctx.fillStyle   = "rgba(0,255,136,0.15)";
      ctx.strokeStyle = "rgba(0,255,136,0.5)";
      ctx.lineWidth   = 1;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = "rgba(0,255,136,0.8)";
      ctx.font      = "10px monospace";
      ctx.textAlign = "center";
      ctx.fillText("OK", b.x + b.w / 2, b.y + b.h / 2 + 4);
      return;
    }

    b.pulse += 0.06;
    const pulse = Math.sin(b.pulse) * 4;
    ctx.save();
    ctx.shadowColor = "#ff2222";
    ctx.shadowBlur  = 12 + pulse;
    ctx.fillStyle   = "#1a0000";
    ctx.strokeStyle = `rgba(255,${40 + pulse * 5},40,0.9)`;
    ctx.lineWidth   = 1.5;
    ctx.fillRect(b.x, b.y, b.w, b.h);
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.shadowBlur  = 0;
    ctx.fillStyle   = `rgba(255,60,60,${0.7 + Math.sin(b.pulse) * 0.3})`;
    ctx.font        = "bold 14px monospace";
    ctx.textAlign   = "center";
    ctx.fillText("!", b.x + b.w / 2, b.y + b.h / 2 + 5);
    ctx.font      = "9px monospace";
    ctx.fillStyle = "rgba(255,80,80,0.6)";
    ctx.fillText("BUG", b.x + b.w / 2, b.y - 5);
    ctx.restore();

    const dist = Math.hypot(
      (playerX + playerSize / 2) - (b.x + b.w / 2),
      (playerY + playerSize / 2) - (b.y + b.h / 2)
    );
    if (dist < 120) {
      ctx.strokeStyle = `rgba(255,60,60,${(1 - dist / 120) * 0.3})`;
      ctx.lineWidth   = 0.5;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.moveTo(playerX + playerSize / 2, playerY + playerSize / 2);
      ctx.lineTo(b.x + b.w / 2, b.y + b.h / 2);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  });
}

function checkDistance(playerX, playerY, playerSize) {
  if (mission.missionActive) return;
  mission.bugs.forEach((b, i) => {
    if (b.solved) return;
    const dist = Math.hypot(
      (playerX + playerSize / 2) - (b.x + b.w / 2),
      (playerY + playerSize / 2) - (b.y + b.h / 2)
    );
    if (dist < 38 && mission.activeBugIdx === -1) {
      mission.activeBugIdx = i;
      const m = MISSIONS[b.missionIdx];
      document.getElementById("popup-desc").textContent =
        "Erro encontrado: " + m.title.split("—")[1].trim();
      showOverlay("missionPopup");
    }
  });
}

function closePopup() {
  showOverlay(null);
  mission.activeBugIdx = -1;
}

function startMission() {
  const bug = mission.bugs[mission.activeBugIdx];
  const m   = MISSIONS[bug.missionIdx];

  document.getElementById("missionTitle").textContent = m.title;
  document.getElementById("missionDesc").textContent  = m.desc;
  document.getElementById("missionCode").textContent  = m.code;

  const feedbackEl = document.getElementById("feedbackMsg");
  feedbackEl.textContent = "";
  feedbackEl.className   = "feedback";

  const expBox = document.getElementById("explanationBox");
  expBox.textContent    = "";
  expBox.style.display  = "none";

  const nextBtn = document.getElementById("nextBtn");
  nextBtn.style.display = "none";

  document.getElementById("progressBar").style.width =
    ((mission.solvedCount / MISSIONS.length) * 100) + "%";

  const container = document.getElementById("choicesContainer");
  container.innerHTML = "";
  m.choices.forEach((c, i) => {
    const btn       = document.createElement("button");
    btn.className   = "choice-btn";
    btn.textContent = String.fromCharCode(65 + i) + ")  " + c;
    btn.onclick     = () => selectChoice(i, btn);
    container.appendChild(btn);
  });

  mission.missionActive = true;
  showOverlay("missionScreen");
}

function selectChoice(idx, btn) {
  const bug    = mission.bugs[mission.activeBugIdx];
  const m      = MISSIONS[bug.missionIdx];
  const allBtns = document.querySelectorAll(".choice-btn");

  allBtns.forEach(b => (b.disabled = true));

  const expBox = document.getElementById("explanationBox");
  expBox.textContent   = m.explanation;
  expBox.style.display = "block";

  const feedbackEl = document.getElementById("feedbackMsg");

  if (idx === m.correct) {
    btn.classList.add("correct");
    bug.solved = true;
    mission.solvedCount++;
    mission.score += 100;
    feedbackEl.textContent = "✓ Correto! +100 pts";
    feedbackEl.className   = "feedback ok";
    document.getElementById("progressBar").style.width =
      ((mission.solvedCount / MISSIONS.length) * 100) + "%";
  } else {
    btn.classList.add("wrong");
    allBtns[m.correct].classList.add("correct");
    mission.lives = Math.max(0, mission.lives - 1);
    feedbackEl.textContent = "✗ Incorreto. A resposta certa era: " + m.choices[m.correct];
    feedbackEl.className   = "feedback err";
  }

  updateHUD();
  document.getElementById("nextBtn").style.display = "inline-block";
}

function closeMission() {
  mission.missionActive = false;
  mission.activeBugIdx  = -1;
  showOverlay(null);
  if (mission.solvedCount >= MISSIONS.length) {
    document.getElementById("finalScore").textContent = mission.score;
    showOverlay("winScreen");
  }
}

function updateHUD() {
  document.getElementById("scoreVal").textContent = mission.score;
  document.getElementById("bugsVal").textContent  = mission.solvedCount + "/" + MISSIONS.length;
  document.getElementById("livesVal").textContent =
    ["♥","♥","♥"].map((h, i) => (i < mission.lives ? "♥" : "♡")).join("");
}

function restartGame() {
  mission.solvedCount   = 0;
  mission.score         = 0;
  mission.lives         = 3;
  mission.activeBugIdx  = -1;
  mission.missionActive = false;
  showOverlay(null);
  initBugs();
  updateHUD();
}