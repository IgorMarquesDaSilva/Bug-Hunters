// ==================== Dados das Missões ====================
const MISSIONS_SALA1 = [
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

const MISSIONS_SALA2 = [
  {
    title: "MISSÃO 06 — Saída do Programa",
    desc: "O robô precisa exibir uma mensagem na tela. Qual função usamos em Python?",
    code: '___ ("Sistema online!")',
    choices: ["echo", "print", "show", "display"],
    correct: 1,
    explanation: '"print()" é a função do Python para exibir informações na tela.'
  },
  {
    title: "MISSÃO 07 — Comparação",
    desc: "O sistema verifica se dois valores são iguais. Qual operador usar?",
    code: "if nivel ___ 3:\n    subir_nivel()",
    choices: ["=", "=>", "==", "!="],
    correct: 2,
    explanation: '"==" compara se dois valores são iguais. "=" é usado para atribuir valor a uma variável.'
  },
  {
    title: "MISSÃO 08 — Repetição com Condição",
    desc: "O robô deve continuar patrulhando enquanto não encontrar um bug. Qual estrutura usar?",
    code: "___ bug_encontrado == False:\n    patrulhar()",
    choices: ["if", "for", "while", "def"],
    correct: 2,
    explanation: '"while" repete um bloco enquanto a condição for verdadeira — diferente do "for" que repete um número fixo de vezes.'
  },
  {
    title: "MISSÃO 09 — Tipo de Dado",
    desc: "O nome do jogador é um texto. Qual tipo de dado representa texto em Python?",
    code: 'nome = ___("Igor")\nprint(nome)',
    choices: ["int", "float", "str", "bool"],
    correct: 2,
    explanation: '"str" (string) representa texto. "int" é número inteiro, "float" é decimal e "bool" é verdadeiro/falso.'
  },
  {
    title: "MISSÃO 10 — Valor Lógico",
    desc: "O sistema precisa guardar se o jogador está ativo ou não. Qual valor representa 'verdadeiro' em Python?",
    code: "ativo = ___\nif ativo:\n    jogar()",
    choices: ["1", "sim", "True", "verdade"],
    correct: 2,
    explanation: '"True" é o valor lógico verdadeiro em Python. Faz parte do tipo "bool" (booleano).'
  }
];

// ==================== Constantes ====================
const PONTOS_PERGUNTA = 5;
const BONUS_CONCLUSAO = 25;
const MIN_ACERTOS = { 1: 2, 2: 5 };

// Portal centralizado no canvas 1000x600
const portal = {
  x: 480, y: 280,
  w: 40, h: 40,
  visible: false,
  pulse: 0
};

const mission = {
  bugs: [],
  activeBugIdx: -1,
  missionActive: false,
  solvedCount: 0,
  score: 0,
  lives: 3,
  sala: 1,
  portalTriggered: false,
  retryUsed: false,
  salaScore: 0
};

// ==================== Funções Auxiliares ====================
function hideAll() {
  ["missionPopup","missionScreen","winScreen","roomClearScreen",
   "nextLevelScreen","retryScreen"].forEach(id => {
     const el = document.getElementById(id);
     if (el) el.style.display = "none";
   });
}

function showOverlay(id) {
  hideAll();
  if (id) {
    const el = document.getElementById(id);
    if (el) el.style.display = "flex";
  }
}

function currentMissions() {
  return mission.sala === 1 ? MISSIONS_SALA1 : MISSIONS_SALA2;
}

// ==================== Inicialização dos Bugs ====================
function initBugs() {
  const missions = currentMissions();
  mission.bugs = [];
  mission.activeBugIdx = -1;
  mission.missionActive = false;
  mission.portalTriggered = false;
  portal.visible = false;

  const margem = 60;
  const minDist = 80;
  const maxW = 1000 - margem;   // canvas agora tem 1000px
  const maxH = 600 - margem;    // canvas agora tem 600px

  missions.forEach((m, i) => {
    let x, y, tentativas = 0, sobrepos;
    do {
      x = Math.floor(Math.random() * (maxW - margem) + margem);
      y = Math.floor(Math.random() * (maxH - margem) + margem);
      sobrepos = mission.bugs.some(b => Math.hypot(b.x - x, b.y - y) < minDist);
      tentativas++;
    } while (sobrepos && tentativas < 50);

    mission.bugs.push({
      x, y,
      w: 28, h: 28,
      solved: false,
      attempted: false,
      pulse: Math.random() * Math.PI * 2,
      missionIdx: i
    });
  });
}

// ==================== Desenho do Portal ====================
function drawPortal(ctx) {
  if (!portal.visible) return;
  portal.pulse += 0.05;
  const glow = Math.sin(portal.pulse) * 6;

  ctx.save();
  ctx.shadowColor = "#aa00ff";
  ctx.shadowBlur = 20 + glow;
  ctx.fillStyle = "rgba(120,0,255,0.25)";
  ctx.strokeStyle = `rgba(180,80,255,${0.7 + Math.sin(portal.pulse)*0.3})`;
  ctx.lineWidth = 2;
  ctx.fillRect(portal.x, portal.y, portal.w, portal.h);
  ctx.strokeRect(portal.x, portal.y, portal.w, portal.h);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(200,120,255,0.9)";
  ctx.font = "11px monospace";
  ctx.textAlign = "center";
  ctx.fillText("NEXT", portal.x + portal.w/2, portal.y + portal.h/2 - 2);
  ctx.fillText(">>>", portal.x + portal.w/2, portal.y + portal.h/2 + 10);
  ctx.restore();

  ctx.fillStyle = "rgba(200,150,255,0.8)";
  ctx.font = "10px monospace";
  ctx.fillText("Próxima Sala", portal.x + portal.w/2, portal.y - 8);
}

// ==================== Verificação do Portal ====================
function checkPortal(playerX, playerY, playerSize) {
  if (!portal.visible || mission.portalTriggered) return;
  const dist = Math.hypot(
    (playerX + playerSize/2) - (portal.x + portal.w/2),
    (playerY + playerSize/2) - (portal.y + portal.h/2)
  );
  if (dist < 40) {
    mission.portalTriggered = true;
    showOverlay("nextLevelScreen");
  }
}

// ==================== Desenho das Missões (bugs) ====================
function drawMission(ctx, playerX, playerY, playerSize) {
  drawPortal(ctx);

  mission.bugs.forEach(b => {
    if (b.solved) {
      ctx.fillStyle = "rgba(0,255,136,0.15)";
      ctx.strokeStyle = "rgba(0,255,136,0.5)";
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = "rgba(0,255,136,0.8)";
      ctx.font = "10px monospace";
      ctx.fillText("✓", b.x + b.w/2, b.y + b.h/2 + 4);
    } 
    else if (b.attempted && !b.solved) {
      ctx.fillStyle = "rgba(255,0,0,0.15)";
      ctx.strokeStyle = "rgba(255,0,0,0.5)";
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = "#ff4444";
      ctx.font = "bold 12px monospace";
      ctx.fillText("✗", b.x + b.w/2, b.y + b.h/2 + 4);
    }
    else {
      b.pulse += 0.06;
      const pulse = Math.sin(b.pulse) * 4;
      ctx.save();
      ctx.shadowColor = "#ff2222";
      ctx.shadowBlur = 12 + pulse;
      ctx.fillStyle = "#1a0000";
      ctx.strokeStyle = `rgba(255,${40 + pulse*5},40,0.9)`;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.strokeRect(b.x, b.y, b.w, b.h);
      ctx.shadowBlur = 0;
      ctx.fillStyle = `rgba(255,60,60,${0.7 + Math.sin(b.pulse)*0.3})`;
      ctx.font = "bold 14px monospace";
      ctx.fillText("!", b.x + b.w/2, b.y + b.h/2 + 5);
      ctx.font = "9px monospace";
      ctx.fillStyle = "rgba(255,80,80,0.6)";
      ctx.fillText("BUG", b.x + b.w/2, b.y - 5);
      ctx.restore();
    }

    if (!b.solved && !b.attempted) {
      const dist = Math.hypot(
        (playerX + playerSize/2) - (b.x + b.w/2),
        (playerY + playerSize/2) - (b.y + b.h/2)
      );
      if (dist < 120) {
        ctx.strokeStyle = `rgba(255,60,60,${(1 - dist/120)*0.3})`;
        ctx.lineWidth = 0.5;
        ctx.setLineDash([3,5]);
        ctx.beginPath();
        ctx.moveTo(playerX + playerSize/2, playerY + playerSize/2);
        ctx.lineTo(b.x + b.w/2, b.y + b.h/2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  });
}

// ==================== Verificação de Distância (Abrir Popup) ====================
function checkDistance(playerX, playerY, playerSize) {
  if (mission.missionActive) return;
  checkPortal(playerX, playerY, playerSize);
  mission.bugs.forEach((b, i) => {
    if (b.solved || b.attempted) return;
    const dist = Math.hypot(
      (playerX + playerSize/2) - (b.x + b.w/2),
      (playerY + playerSize/2) - (b.y + b.h/2)
    );
    if (dist < 38 && mission.activeBugIdx === -1) {
      mission.activeBugIdx = i;
      const m = currentMissions()[b.missionIdx];
      document.getElementById("popup-desc").textContent =
        "Erro encontrado: " + m.title.split("—")[1].trim();
      showOverlay("missionPopup");
    }
  });
}

// ==================== Fechar Popup ====================
function closePopup() {
  showOverlay(null);
  mission.activeBugIdx = -1;
}

// ==================== Iniciar Missão ====================
function startMission() {
  const bug = mission.bugs[mission.activeBugIdx];
  const m = currentMissions()[bug.missionIdx];

  document.getElementById("missionTitle").textContent = m.title;
  document.getElementById("missionDesc").textContent = m.desc;
  document.getElementById("missionCode").textContent = m.code;

  const feedbackEl = document.getElementById("feedbackMsg");
  feedbackEl.textContent = "";
  feedbackEl.className = "feedback";

  const expBox = document.getElementById("explanationBox");
  expBox.textContent = "";
  expBox.style.display = "none";

  document.getElementById("nextBtn").style.display = "none";

  const total = currentMissions().length;
  document.getElementById("progressBar").style.width =
    ((mission.solvedCount / total) * 100) + "%";

  const container = document.getElementById("choicesContainer");
  container.innerHTML = "";
  m.choices.forEach((c, i) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.textContent = String.fromCharCode(65 + i) + ")  " + c;
    btn.onclick = () => selectChoice(i, btn);
    container.appendChild(btn);
  });

  mission.missionActive = true;
  showOverlay("missionScreen");
}

// ==================== Escolha da Alternativa ====================
function selectChoice(idx, btn) {
  const bug = mission.bugs[mission.activeBugIdx];
  const m = currentMissions()[bug.missionIdx];
  const allBtns = document.querySelectorAll(".choice-btn");

  allBtns.forEach(b => (b.disabled = true));

  const expBox = document.getElementById("explanationBox");
  expBox.textContent = m.explanation;
  expBox.style.display = "block";

  const feedbackEl = document.getElementById("feedbackMsg");

  bug.attempted = true;

  if (idx === m.correct) {
    btn.classList.add("correct");
    bug.solved = true;
    mission.solvedCount++;
    mission.score += PONTOS_PERGUNTA;
    mission.salaScore += PONTOS_PERGUNTA;
    feedbackEl.textContent = "✓ Correto! +" + PONTOS_PERGUNTA + " pts";
    feedbackEl.className = "feedback ok";
    const total = currentMissions().length;
    document.getElementById("progressBar").style.width =
      ((mission.solvedCount / total) * 100) + "%";
  } else {
    btn.classList.add("wrong");
    allBtns[m.correct].classList.add("correct");
    mission.lives = Math.max(0, mission.lives - 1);
    feedbackEl.textContent = "✗ Incorreto. A resposta certa era: " + m.choices[m.correct];
    feedbackEl.className = "feedback err";
    if (mission.lives === 0) {
      feedbackEl.textContent += " — GAME OVER! Recarregue a página para recomeçar.";
      document.getElementById("nextBtn").style.display = "none";
      setTimeout(() => {
        alert("Você perdeu todas as vidas! O jogo será reiniciado.");
        restartGame();
      }, 1500);
      return;
    }
  }

  updateHUD();
  document.getElementById("nextBtn").style.display = "inline-block";
}

// ==================== Fechar Missão (Após Responder) ====================
function closeMission() {
  // Fecha o overlay da missão
  showOverlay(null);
  
  // Reseta flags
  mission.missionActive = false;
  mission.activeBugIdx = -1;

  const total = currentMissions().length;
  const minAcertos = MIN_ACERTOS[mission.sala] || total;
  const bugsAttempted = mission.bugs.filter(b => b.attempted).length;

  // Se todas as perguntas foram respondidas
  if (bugsAttempted === total) {
    if (mission.solvedCount >= minAcertos) {
      mission.score += BONUS_CONCLUSAO;
      mission.salaScore += BONUS_CONCLUSAO;
      updateHUD();

      if (mission.sala === 1) {
        showOverlay("roomClearScreen");
      } else {
        document.getElementById("finalScore").textContent = mission.score + " / 100";
        showOverlay("winScreen");
      }
    } else {
      showRetryScreen();
    }
  }
}

// ==================== Tela de Retry ====================
function showRetryScreen() {
  const minAcertos = MIN_ACERTOS[mission.sala];
  document.getElementById("retryMsg").textContent =
    "Você acertou " + mission.solvedCount + " de " + mission.bugs.length +
    " perguntas. O mínimo para avançar é " + minAcertos + " acerto(s).";
  document.getElementById("retryBtn").style.display =
    mission.retryUsed ? "none" : "inline-block";
  document.getElementById("retryUsedMsg").style.display =
    mission.retryUsed ? "block" : "none";
  showOverlay("retryScreen");
}

// ==================== Reiniciar Fase (Retry) ====================
function retryPhase() {
  mission.retryUsed = true;
  mission.score -= mission.salaScore;
  mission.salaScore = 0;
  mission.solvedCount = 0;
  mission.lives = 3;
  player.x = 50;
  player.y = 50;
  initBugs();
  updateHUD();
  showOverlay(null);
}

// ==================== Ir para Próxima Sala ====================
function goToNextRoom() {
  mission.sala = 2;
  mission.solvedCount = 0;
  mission.salaScore = 0;
  mission.lives = 3;
  player.x = 50;
  player.y = 50;
  initBugs();
  updateHUD();
  showOverlay(null);
}

// ==================== Entrar no Portal ====================
function enterPortal() {
  portal.visible = true;
  showOverlay(null);
}

// ==================== Atualizar HUD ====================
function updateHUD() {
  const total = currentMissions().length;
  document.getElementById("scoreVal").textContent = mission.score;
  document.getElementById("bugsVal").textContent = mission.solvedCount + "/" + total;
  document.getElementById("salaVal").textContent = mission.sala;
  const livesSpan = document.getElementById("livesVal");
  livesSpan.textContent = "♥".repeat(mission.lives) + "♡".repeat(3 - mission.lives);
}

// ==================== Reiniciar Jogo Completo ====================
function restartGame() {
  mission.solvedCount = 0;
  mission.score = 0;
  mission.salaScore = 0;
  mission.lives = 3;
  mission.activeBugIdx = -1;
  mission.missionActive = false;
  mission.sala = 1;
  mission.portalTriggered = false;
  mission.retryUsed = false;
  portal.visible = false;
  player.x = 50;
  player.y = 50;
  showOverlay(null);
  initBugs();
  updateHUD();
}