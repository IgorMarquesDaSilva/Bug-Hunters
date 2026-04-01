// ============================================================
// PERGUNTAS POR DIFICULDADE
// ============================================================

const MISSIONS_FACIL = {
  sala1: [
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
  ],
  sala2: [
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
      explanation: '"while" repete um bloco enquanto a condição for verdadeira.'
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
      desc: "O sistema precisa guardar se o jogador está ativo ou não. Qual valor representa 'verdadeiro'?",
      code: "ativo = ___\nif ativo:\n    jogar()",
      choices: ["1", "sim", "True", "verdade"],
      correct: 2,
      explanation: '"True" é o valor lógico verdadeiro em Python. Faz parte do tipo "bool" (booleano).'
    }
  ]
};

const MISSIONS_MEDIO = {
  sala1: [
    {
      title: "MISSÃO 01 — O que esse código faz?",
      desc: "Leia o código abaixo. O que será impresso quando energia for 15?",
      code: "energia = 15\nif energia < 20:\n    print('Retornando')\nelse:\n    print('Operando')",
      choices: ["Operando", "Retornando", "Nada", "Erro"],
      correct: 1,
      explanation: 'Como energia (15) é menor que 20, a condição "if" é verdadeira e imprime "Retornando".'
    },
    {
      title: "MISSÃO 02 — Quantas vezes repete?",
      desc: "Quantas vezes a função escanear() será chamada?",
      code: "for i in range(3):\n    escanear(i)\n    print(i)",
      choices: ["2 vezes", "3 vezes", "4 vezes", "1 vez"],
      correct: 1,
      explanation: 'range(3) gera os valores 0, 1 e 2 — ou seja, 3 iterações no total.'
    },
    {
      title: "MISSÃO 03 — Resultado da operação",
      desc: "Qual será o valor de resultado após executar o código?",
      code: "x = 10\ny = 3\nresultado = x + y * 2",
      choices: ["26", "16", "13", "23"],
      correct: 1,
      explanation: 'Em Python, multiplicação tem prioridade sobre soma. y * 2 = 6, depois 10 + 6 = 16.'
    },
    {
      title: "MISSÃO 04 — Condição composta",
      desc: "Em quais casos o sistema vai executar 'alerta()'?",
      code: "if energia < 10 or temperatura > 80:\n    alerta()",
      choices: [
        "Só se energia < 10 E temperatura > 80",
        "Se energia < 10 OU temperatura > 80",
        "Nunca executa",
        "Sempre executa"
      ],
      correct: 1,
      explanation: '"or" executa se QUALQUER uma das condições for verdadeira — basta uma delas ser satisfeita.'
    },
    {
      title: "MISSÃO 05 — Valor de retorno",
      desc: "O que a função retorna quando chamada com dobrar(4)?",
      code: "def dobrar(n):\n    return n * 2\n\nresultado = dobrar(4)",
      choices: ["4", "2", "8", "16"],
      correct: 2,
      explanation: 'A função multiplica n por 2. Passando 4, o retorno é 4 * 2 = 8.'
    }
  ],
  sala2: [
    {
      title: "MISSÃO 06 — Saída do loop",
      desc: "Quais números serão impressos por esse código?",
      code: "for i in range(1, 5):\n    if i % 2 == 0:\n        print(i)",
      choices: ["1, 3", "2, 4", "1, 2, 3, 4", "0, 2, 4"],
      correct: 1,
      explanation: 'range(1,5) gera 1,2,3,4. O "%" é o resto da divisão — só 2 e 4 têm resto 0 ao dividir por 2.'
    },
    {
      title: "MISSÃO 07 — While com contador",
      desc: "Quantas vezes 'tick' será impresso?",
      code: "cont = 0\nwhile cont < 3:\n    print('tick')\n    cont += 1",
      choices: ["2 vezes", "3 vezes", "4 vezes", "infinito"],
      correct: 1,
      explanation: 'cont começa em 0 e vai até 2 (menor que 3), executando 3 vezes: cont = 0, 1, 2.'
    },
    {
      title: "MISSÃO 08 — Lista e índice",
      desc: "Qual valor será impresso?",
      code: "setores = ['A', 'B', 'C', 'D']\nprint(setores[2])",
      choices: ["A", "B", "C", "D"],
      correct: 2,
      explanation: 'Listas em Python começam no índice 0. O índice 2 corresponde ao terceiro elemento: "C".'
    },
    {
      title: "MISSÃO 09 — Função com condição",
      desc: "O que a função retorna quando chamada com verificar(5)?",
      code: "def verificar(n):\n    if n > 10:\n        return 'alto'\n    return 'baixo'",
      choices: ["alto", "baixo", "True", "None"],
      correct: 1,
      explanation: '5 não é maior que 10, então o "if" é falso e a função retorna "baixo".'
    },
    {
      title: "MISSÃO 10 — Concatenação",
      desc: "Qual será a saída do código?",
      code: 'nome = "Bug"\ntipo = "Hunter"\nprint(nome + " " + tipo)',
      choices: ["BugHunter", "Bug Hunter", "nome tipo", "Erro"],
      correct: 1,
      explanation: 'O operador "+" junta strings. "Bug" + " " + "Hunter" resulta em "Bug Hunter".'
    }
  ]
};

const MISSIONS_DIFICIL = {
  sala1: [
    {
      title: "MISSÃO 01 — Encontre o Bug",
      desc: "O código abaixo tem um erro. Qual linha está errada?",
      code: "def somar(a, b):\n    resultado = a + b\n    Return resultado",
      choices: [
        "def somar(a, b):",
        "resultado = a + b",
        '"Return" deveria ser "return"',
        "Não há erro"
      ],
      correct: 2,
      explanation: 'Python é case-sensitive. "Return" com R maiúsculo é inválido — o correto é "return" em minúsculo.'
    },
    {
      title: "MISSÃO 02 — Loop Infinito",
      desc: "Por que esse código entra em loop infinito?",
      code: "cont = 0\nwhile cont < 5:\n    print(cont)",
      choices: [
        "range() não foi usado",
        "cont nunca é incrementado",
        "while deveria ser for",
        "print() causa o loop"
      ],
      correct: 1,
      explanation: 'cont sempre vale 0 pois nunca é incrementado. A condição cont < 5 nunca se torna falsa. Falta "cont += 1".'
    },
    {
      title: "MISSÃO 03 — Erro de Índice",
      desc: "O que acontece ao executar esse código?",
      code: "lista = [10, 20, 30]\nprint(lista[3])",
      choices: [
        'Imprime "30"',
        'Imprime "None"',
        "Gera um IndexError",
        'Imprime "0"'
      ],
      correct: 2,
      explanation: 'A lista tem 3 elementos (índices 0, 1, 2). Acessar índice 3 gera IndexError: list index out of range.'
    },
    {
      title: "MISSÃO 04 — Escopo de Variável",
      desc: "O que será impresso ao executar esse código?",
      code: "x = 10\ndef alterar():\n    x = 99\n\nalterar()\nprint(x)",
      choices: ["99", "10", "None", "Erro"],
      correct: 1,
      explanation: 'O "x = 99" dentro da função cria uma variável LOCAL. O "x" global continua valendo 10.'
    },
    {
      title: "MISSÃO 05 — Lógica Invertida",
      desc: "O código deveria imprimir apenas números ímpares, mas está errado. Qual é o problema?",
      code: "for i in range(1, 8):\n    if i % 2 == 0:\n        print(i)",
      choices: [
        "range(1, 8) está errado",
        'Deveria ser "i % 2 != 0"',
        'Deveria ser "i % 2 == 1"',
        "Não há problema"
      ],
      correct: 1,
      explanation: '"i % 2 == 0" seleciona números PARES. Para ímpares, a condição correta é "i % 2 != 0" (resto diferente de zero).'
    }
  ],
  sala2: [
    {
      title: "MISSÃO 06 — Recursão",
      desc: "O que a função retorna quando chamada com fatorial(3)?",
      code: "def fatorial(n):\n    if n == 0:\n        return 1\n    return n * fatorial(n - 1)",
      choices: ["3", "6", "9", "1"],
      correct: 1,
      explanation: 'fatorial(3) = 3 * fatorial(2) = 3 * 2 * fatorial(1) = 3 * 2 * 1 = 6.'
    },
    {
      title: "MISSÃO 07 — Erro de Atribuição",
      desc: "O código tenta comparar x com 5, mas tem um erro. Qual é?",
      code: "x = 10\nif x = 5:\n    print('igual')",
      choices: [
        '"print" está errado',
        '"=" deveria ser "=="',
        '"x" não foi declarado',
        "Não há erro"
      ],
      correct: 1,
      explanation: 'Dentro do "if", "=" é atribuição e causa SyntaxError. Para comparar, use "==" (dois sinais de igual).'
    },
    {
      title: "MISSÃO 08 — Dicionário",
      desc: "Como acessar o valor da chave 'nome' no dicionário?",
      code: 'jogador = {"nome": "Igor", "nivel": 3}\nprint(___)',
      choices: [
        'jogador.nome',
        'jogador["nome"]',
        'jogador(nome)',
        'jogador->nome'
      ],
      correct: 1,
      explanation: 'Em Python, dicionários são acessados com colchetes e a chave entre aspas: jogador["nome"].'
    },
    {
      title: "MISSÃO 09 — Try/Except",
      desc: "O que o bloco 'except' faz nesse código?",
      code: 'try:\n    x = int("abc")\nexcept ValueError:\n    print("Valor inválido")',
      choices: [
        "Ignora o erro silenciosamente",
        'Captura o erro e imprime "Valor inválido"',
        "Faz o programa encerrar",
        "Converte abc para 0"
      ],
      correct: 1,
      explanation: 'int("abc") gera um ValueError. O bloco "except" captura esse erro e executa o print — evitando que o programa quebre.'
    },
    {
      title: "MISSÃO 10 — List Comprehension",
      desc: "O que a variável 'quadrados' vai conter?",
      code: "quadrados = [x**2 for x in range(1, 4)]",
      choices: [
        "[1, 2, 3]",
        "[1, 4, 9]",
        "[2, 4, 6]",
        "[0, 1, 4]"
      ],
      correct: 1,
      explanation: 'range(1,4) gera 1,2,3. Cada valor é elevado ao quadrado: 1²=1, 2²=4, 3²=9. Resultado: [1, 4, 9].'
    }
  ]
};

// ============================================================
// ESTADO DO JOGO
// ============================================================

const DIFFICULTY_CONFIG = {
  facil:   { label: "FÁCIL",   lives: 3, scoreBonus: 1 },
  medio:   { label: "MÉDIO",   lives: 2, scoreBonus: 1.5 },
  dificil: { label: "DIFÍCIL", lives: 1, scoreBonus: 2 }
};

const portal = {
  x: 480, y: 280,
  w: 40,  h: 40,
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
  difficulty: null,
  portalTriggered: false
};

// ============================================================
// UTILITÁRIOS
// ============================================================

function hideAll() {
  ["difficultyScreen","missionPopup","missionScreen","roomClearScreen",
   "nextLevelScreen","winScreen"]
    .forEach(id => document.getElementById(id).style.display = "none");
}

function showOverlay(id) {
  hideAll();
  if (id) document.getElementById(id).style.display = "flex";
}

function currentMissions() {
  const pool = mission.difficulty === "facil"   ? MISSIONS_FACIL
             : mission.difficulty === "medio"   ? MISSIONS_MEDIO
             : MISSIONS_DIFICIL;
  return mission.sala === 1 ? pool.sala1 : pool.sala2;
}

// ============================================================
// SELEÇÃO DE DIFICULDADE
// ============================================================

function selectDifficulty(diff) {
  mission.difficulty = diff;
  const cfg = DIFFICULTY_CONFIG[diff];
  mission.lives = cfg.lives;

  document.getElementById("diffVal").textContent  = cfg.label;
  document.getElementById("diffVal").style.color  =
    diff === "facil" ? "#0ff" : diff === "medio" ? "#ffaa44" : "#f0f";

  hideAll();
  initBugs();
  updateHUD();
}

// ============================================================
// BUGS E PORTAL
// ============================================================

function initBugs() {
  const missions = currentMissions();
  mission.bugs = [];
  mission.activeBugIdx    = -1;
  mission.missionActive   = false;
  mission.portalTriggered = false;
  portal.visible          = false;

  const margem  = 60;
  const minDist = 100;
  const maxW    = 1000 - margem;
  const maxH    = 600  - margem;

  missions.forEach((m, i) => {
    let x, y, tentativas = 0, sobrepos;
    do {
      x = Math.floor(Math.random() * (maxW - margem) + margem);
      y = Math.floor(Math.random() * (maxH - margem) + margem);
      sobrepos = mission.bugs.some(b => Math.hypot(b.x - x, b.y - y) < minDist);
      tentativas++;
    } while (sobrepos && tentativas < 50);

    mission.bugs.push({
      x, y, w: 28, h: 28,
      solved: false,
      pulse: Math.random() * Math.PI * 2,
      missionIdx: i
    });
  });
}

function drawPortal(ctx) {
  if (!portal.visible) return;
  portal.pulse += 0.05;
  const glow = Math.sin(portal.pulse) * 6;

  ctx.save();
  ctx.shadowColor = "#aa00ff";
  ctx.shadowBlur  = 20 + glow;
  ctx.fillStyle   = "rgba(120,0,255,0.25)";
  ctx.strokeStyle = `rgba(180,80,255,${0.7 + Math.sin(portal.pulse) * 0.3})`;
  ctx.lineWidth   = 2;
  ctx.fillRect(portal.x, portal.y, portal.w, portal.h);
  ctx.strokeRect(portal.x, portal.y, portal.w, portal.h);
  ctx.shadowBlur  = 0;
  ctx.fillStyle   = "rgba(200,120,255,0.9)";
  ctx.font        = "11px monospace";
  ctx.textAlign   = "center";
  ctx.fillText("NEXT", portal.x + portal.w / 2, portal.y + portal.h / 2 - 2);
  ctx.fillText(">>>",  portal.x + portal.w / 2, portal.y + portal.h / 2 + 10);
  ctx.restore();

  ctx.fillStyle = "rgba(200,150,255,0.8)";
  ctx.font      = "10px monospace";
  ctx.textAlign = "center";
  ctx.fillText("Próxima Sala", portal.x + portal.w / 2, portal.y - 8);
}

function checkPortal(playerX, playerY, playerSize) {
  if (!portal.visible || mission.portalTriggered) return;
  const dist = Math.hypot(
    (playerX + playerSize / 2) - (portal.x + portal.w / 2),
    (playerY + playerSize / 2) - (portal.y + portal.h / 2)
  );
  if (dist < 40) {
    mission.portalTriggered = true;
    showOverlay("nextLevelScreen");
  }
}

function drawMission(ctx, playerX, playerY, playerSize) {
  drawPortal(ctx);

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
  checkPortal(playerX, playerY, playerSize);
  mission.bugs.forEach((b, i) => {
    if (b.solved) return;
    const dist = Math.hypot(
      (playerX + playerSize / 2) - (b.x + b.w / 2),
      (playerY + playerSize / 2) - (b.y + b.h / 2)
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

// ============================================================
// MISSÃO
// ============================================================

function closePopup() {
  showOverlay(null);
  mission.activeBugIdx = -1;
}

function startMission() {
  const bug = mission.bugs[mission.activeBugIdx];
  const m   = currentMissions()[bug.missionIdx];

  document.getElementById("missionTitle").textContent = m.title;
  document.getElementById("missionDesc").textContent  = m.desc;
  document.getElementById("missionCode").textContent  = m.code;

  const feedbackEl = document.getElementById("feedbackMsg");
  feedbackEl.textContent = "";
  feedbackEl.className   = "feedback";

  const expBox = document.getElementById("explanationBox");
  expBox.textContent   = "";
  expBox.style.display = "none";

  document.getElementById("nextBtn").style.display = "none";

  const total = currentMissions().length;
  document.getElementById("progressBar").style.width =
    ((mission.solvedCount / total) * 100) + "%";

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
  const bug     = mission.bugs[mission.activeBugIdx];
  const m       = currentMissions()[bug.missionIdx];
  const allBtns = document.querySelectorAll(".choice-btn");

  allBtns.forEach(b => (b.disabled = true));

  const expBox = document.getElementById("explanationBox");
  expBox.textContent   = m.explanation;
  expBox.style.display = "block";

  const feedbackEl = document.getElementById("feedbackMsg");
  const cfg        = DIFFICULTY_CONFIG[mission.difficulty];

  if (idx === m.correct) {
    btn.classList.add("correct");
    bug.solved = true;
    mission.solvedCount++;
    const pts = Math.round(100 * cfg.scoreBonus);
    mission.score += pts;
    feedbackEl.textContent = `✓ Correto! +${pts} pts`;
    feedbackEl.className   = "feedback ok";
    const total = currentMissions().length;
    document.getElementById("progressBar").style.width =
      ((mission.solvedCount / total) * 100) + "%";
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

  const total = currentMissions().length;
  if (mission.solvedCount >= total) {
    if (mission.sala === 1) {
      showOverlay("roomClearScreen");
    } else {
      document.getElementById("finalScore").textContent = mission.score;
      document.getElementById("finalDiff").textContent  =
        DIFFICULTY_CONFIG[mission.difficulty].label;
      showOverlay("winScreen");
    }
  }
}

function enterPortal() {
  portal.visible = true;
  showOverlay(null);
}

function goToNextRoom() {
  mission.sala        = 2;
  mission.solvedCount = 0;
  player.x = 50;
  player.y = 50;
  initBugs();
  updateHUD();
  showOverlay(null);
}

// ============================================================
// HUD E RESTART
// ============================================================

function updateHUD() {
  const total = currentMissions().length;
  document.getElementById("scoreVal").textContent = mission.score;
  document.getElementById("salaVal").textContent  = mission.sala;
  document.getElementById("bugsVal").textContent  = mission.solvedCount + "/" + total;
  document.getElementById("livesVal").textContent =
    Array.from({ length: 3 }, (_, i) => i < mission.lives ? "♥" : "♡").join("");
}

function backToMenu() {
  mission.solvedCount    = 0;
  mission.score          = 0;
  mission.lives          = 3;
  mission.activeBugIdx   = -1;
  mission.missionActive  = false;
  mission.sala           = 1;
  mission.difficulty     = null;
  mission.portalTriggered = false;
  portal.visible         = false;
  player.x = 50;
  player.y = 50;
  document.getElementById("diffVal").textContent = "—";
  document.getElementById("diffVal").style.color = "";
  showOverlay("difficultyScreen");
  initBugs();
  updateHUD();
}

function restartGame() {
  const diff = mission.difficulty;
  backToMenu();
  if (diff) selectDifficulty(diff);
}
// ============================================================
// GLOSSÁRIO
// ============================================================

const GLOSSARY = [
  {
    category: "Estruturas de Controle",
    terms: [
      {
        term: "if",
        definition: `O "if" é a estrutura de decisão mais fundamental da programação. Ele avalia uma condição e executa um bloco de código SOMENTE se essa condição for verdadeira (True). Se a condição for falsa, o bloco é completamente ignorado e o programa continua na próxima linha após o bloco.

Em Python, o bloco do "if" é definido pela indentação (recuo de 4 espaços ou 1 tab). Tudo que estiver indentado abaixo do "if:" faz parte daquele bloco.`,
        tip: `Imagine que você está na portaria de um evento. O segurança verifica: "A pessoa tem ingresso?" SE sim, ela entra. SE não, fica do lado de fora. O "if" funciona exatamente assim — ele é o segurança do seu código, deixando passar apenas o que atende à condição.`,
        examples: [
          {
            label: "Estrutura básica",
            code: `energia = 15

if energia < 20:
    print("Bateria fraca!")
    print("Retornando à base...")

print("Esta linha sempre executa")`
          },
          {
            label: "Com else (senão)",
            code: `nota = 7

if nota >= 6:
    print("Aprovado!")
else:
    print("Reprovado.")
    print("Tente novamente.")`
          },
          {
            label: "Comparando strings",
            code: `status = "ativo"

if status == "ativo":
    print("Sistema ligado")
else:
    print("Sistema desligado")`
          }
        ],
        errors: [
          {
            label: "❌ Erro: esquecer os dois pontos",
            code: `# ERRADO
if energia < 20
    print("Baixa!")

# CORRETO
if energia < 20:
    print("Baixa!")`
          },
          {
            label: "❌ Erro: indentação incorreta",
            code: `# ERRADO — print não está indentado
if energia < 20:
print("Baixa!")

# CORRETO
if energia < 20:
    print("Baixa!")`
          }
        ],
        related: ["else", "elif", "and", "or", "bool"]
      },
      {
        term: "else",
        definition: `O "else" é sempre usado em conjunto com o "if". Ele define o bloco de código que será executado quando a condição do "if" for FALSA. É o "caso contrário" do seu código.

O "else" não tem condição própria — ele simplesmente captura tudo que não passou pelo "if". Por isso, nunca escreva uma condição após o "else".

Você pode ter um "if" sem "else", mas nunca um "else" sem "if".`,
        tip: `Pense no "if/else" como um interruptor de luz: SE o interruptor estiver para cima, a luz acende. SENÃO (else), a luz apaga. Sempre um dos dois acontece, nunca os dois ao mesmo tempo.`,
        examples: [
          {
            label: "if / else simples",
            code: `temperatura = 35

if temperatura > 30:
    print("Está muito quente hoje!")
else:
    print("Temperatura agradável.")`
          },
          {
            label: "Verificando login",
            code: `senha_correta = "python123"
senha_digitada = "abc"

if senha_digitada == senha_correta:
    print("Acesso liberado!")
else:
    print("Senha incorreta. Tente novamente.")`
          }
        ],
        errors: [
          {
            label: "❌ Erro: colocar condição no else",
            code: `# ERRADO — else não recebe condição
if nota >= 6:
    print("Aprovado")
else nota < 6:
    print("Reprovado")

# CORRETO
if nota >= 6:
    print("Aprovado")
else:
    print("Reprovado")`
          }
        ],
        related: ["if", "elif"]
      },
      {
        term: "elif",
        definition: `O "elif" (abreviação de "else if") permite verificar múltiplas condições em sequência. É usado quando você tem mais de duas possibilidades e precisa tratar cada uma de forma diferente.

Python verifica as condições NA ORDEM em que aparecem e executa APENAS o primeiro bloco cuja condição for verdadeira. Depois disso, pula todos os outros elif/else.

Você pode ter quantos "elif" quiser entre um "if" e um "else".`,
        tip: `Imagine uma triagem médica: PRIMEIRO o médico verifica se é emergência → SE não, verifica se é urgente → SE não, verifica se é consulta normal → SENÃO, manda para casa. O "elif" funciona exatamente como essa fila de verificações.`,
        examples: [
          {
            label: "Sistema de notas",
            code: `nota = 7.5

if nota >= 9:
    print("Excelente!")
elif nota >= 7:
    print("Bom!")
elif nota >= 5:
    print("Regular.")
else:
    print("Insuficiente.")`
          },
          {
            label: "Nível do jogador",
            code: `pontos = 850

if pontos >= 1000:
    nivel = "Mestre"
elif pontos >= 500:
    nivel = "Avançado"
elif pontos >= 100:
    nivel = "Iniciante"
else:
    nivel = "Novato"

print("Nível:", nivel)`
          }
        ],
        errors: [
          {
            label: "❌ Erro: ordem errada das condições",
            code: `nota = 9.5

# ERRADO — a condição >= 5 captura tudo antes
if nota >= 5:
    print("Regular")  # sempre cai aqui!
elif nota >= 7:
    print("Bom")
elif nota >= 9:
    print("Excelente")

# CORRETO — do maior para o menor
if nota >= 9:
    print("Excelente")
elif nota >= 7:
    print("Bom")
elif nota >= 5:
    print("Regular")`
          }
        ],
        related: ["if", "else"]
      },
      {
        term: "for",
        definition: `O "for" é uma estrutura de repetição usada para percorrer sequências: listas, strings, intervalos numéricos, e qualquer objeto iterável. A cada repetição (iteração), a variável de controle recebe automaticamente o próximo valor da sequência.

A sintaxe é: for VARIÁVEL in SEQUÊNCIA:

Diferente do "while", o "for" é ideal quando você SABE quantas vezes quer repetir ou quando quer percorrer todos os elementos de uma coleção.

O bloco do "for" também é definido por indentação.`,
        tip: `Imagine que você tem uma pilha de provas para corrigir. Você pega a PRIMEIRA prova, corrige, coloca de lado. Pega a SEGUNDA, corrige, coloca de lado. Repete até acabar a pilha. O "for" faz exatamente isso: pega cada item da sequência, processa, e vai para o próximo automaticamente.`,
        examples: [
          {
            label: "Com range() — repetir N vezes",
            code: `# Repete 5 vezes (0, 1, 2, 3, 4)
for i in range(5):
    print("Repetição número", i)

# range(início, fim, passo)
for i in range(1, 11, 2):
    print(i)  # 1, 3, 5, 7, 9`
          },
          {
            label: "Percorrendo uma lista",
            code: `setores = ["Alpha", "Beta", "Gamma", "Delta"]

for setor in setores:
    print("Escaneando setor:", setor)

print("Escaneamento concluído!")`
          },
          {
            label: "Percorrendo uma string",
            code: `palavra = "Python"

for letra in palavra:
    print(letra)
# Imprime cada letra em uma linha`
          },
          {
            label: "Acumulando resultado",
            code: `numeros = [10, 20, 30, 40, 50]
total = 0

for n in numeros:
    total += n

print("Soma total:", total)  # 150`
          }
        ],
        errors: [
          {
            label: "❌ Erro: modificar a lista durante o loop",
            code: `# ERRADO — pode causar comportamento inesperado
lista = [1, 2, 3, 4, 5]
for item in lista:
    lista.remove(item)  # perigoso!

# CORRETO — use uma cópia ou outra abordagem
lista = [1, 2, 3, 4, 5]
nova_lista = []
for item in lista:
    if item % 2 == 0:
        nova_lista.append(item)`
          }
        ],
        related: ["while", "range", "break", "continue", "list"]
      },
      {
        term: "while",
        definition: `O "while" repete um bloco de código enquanto uma condição for verdadeira. A condição é verificada ANTES de cada repetição — se já começar falsa, o bloco nunca executa.

Diferente do "for", o "while" é usado quando NÃO sabemos quantas repetições serão necessárias. O número de repetições depende de quando a condição se torna falsa.

ATENÇÃO: se a condição nunca se tornar falsa, o programa entra em loop infinito e trava. Sempre garanta que algo dentro do loop vai eventualmente tornar a condição falsa.`,
        tip: `Pense no "while" como uma cancela automática de estacionamento. ENQUANTO a fila de carros não estiver vazia, a cancela continua abrindo para o próximo carro. Quando não há mais carros, a cancela para. O while para quando não há mais "carros" (condição falsa).`,
        examples: [
          {
            label: "Contador básico",
            code: `cont = 0

while cont < 5:
    print("Contagem:", cont)
    cont += 1  # IMPORTANTE: incrementar!

print("Loop encerrado")`
          },
          {
            label: "Aguardando condição",
            code: `energia = 100

while energia > 0:
    print("Energia:", energia)
    energia -= 25

print("Sem energia! Game over.")`
          },
          {
            label: "Loop com break",
            code: `tentativas = 0
senha = "1234"

while True:  # loop infinito controlado
    digitada = input("Digite a senha: ")
    tentativas += 1
    
    if digitada == senha:
        print("Acesso liberado!")
        break
    
    if tentativas >= 3:
        print("Bloqueado!")
        break`
          }
        ],
        errors: [
          {
            label: "❌ Erro: loop infinito",
            code: `# ERRADO — cont nunca muda, loop infinito!
cont = 0
while cont < 5:
    print(cont)
    # esqueceu o cont += 1

# CORRETO
cont = 0
while cont < 5:
    print(cont)
    cont += 1`
          }
        ],
        related: ["for", "break", "continue", "bool"]
      },
      {
        term: "break",
        definition: `O "break" interrompe imediatamente a execução de um loop (for ou while), saindo dele independentemente da condição. O programa continua na primeira linha após o loop.

O "break" é útil quando você encontrou o que procurava e não precisa continuar percorrendo, ou quando uma condição especial exige parar tudo imediatamente.

Em loops aninhados (loop dentro de loop), o "break" sai apenas do loop mais interno.`,
        tip: `O "break" é o botão de parada de emergência do loop. Imagine uma busca numa lista de suspeitos: assim que você encontra o culpado, para de procurar imediatamente — não precisa verificar o restante da lista.`,
        examples: [
          {
            label: "Busca em lista",
            code: `bugs = ["erro_404", "null_pointer", "overflow", "syntax_err"]

for bug in bugs:
    print("Verificando:", bug)
    if bug == "overflow":
        print("Bug crítico encontrado! Parando.")
        break

print("Busca encerrada")`
          },
          {
            label: "Limite de tentativas",
            code: `max_tentativas = 3

for tentativa in range(max_tentativas):
    resposta = "errada"  # simulando resposta
    
    if resposta == "correta":
        print("Acertou!")
        break
    
    print(f"Tentativa {tentativa + 1} incorreta")
else:
    # executa se o for terminar SEM break
    print("Esgotou as tentativas!")`
          }
        ],
        errors: [
          {
            label: "❌ Erro: break fora de loop",
            code: `# ERRADO — break só funciona dentro de loops
x = 10
if x > 5:
    break  # SyntaxError!

# CORRETO — use return em funções ou
# reestruture a lógica com if/else`
          }
        ],
        related: ["for", "while", "continue"]
      },
      {
        term: "continue",
        definition: `O "continue" pula o restante do código da iteração atual e vai direto para a próxima repetição do loop. Diferente do "break" que sai do loop, o "continue" apenas pula aquela rodada.

Quando o Python encontra um "continue", ignora todo o código abaixo dele dentro do bloco e volta para verificar a condição (while) ou pegar o próximo item (for).`,
        tip: `Imagine que você está revisando redações. Você pega uma redação, olha o nome, e percebe que já corrigiu esta. Você pula (continue) para a próxima redação sem ler novamente. O loop continua — você só pulou aquela redação específica.`,
        examples: [
          {
            label: "Pular valores específicos",
            code: `for i in range(10):
    if i % 2 != 0:  # se for ímpar
        continue    # pula para o próximo
    print(i)  # só imprime pares: 0,2,4,6,8`
          },
          {
            label: "Filtrar lista",
            code: `setores = ["Alpha", "", "Beta", "", "Gamma"]

for setor in setores:
    if setor == "":  # ignora vazios
        continue
    print("Processando:", setor)`
          }
        ],
        errors: [
          {
            label: "❌ Diferença entre break e continue",
            code: `numeros = [1, 2, 3, 4, 5]

# COM break — para no 3:
for n in numeros:
    if n == 3:
        break
    print(n)  # imprime: 1, 2

# COM continue — pula o 3:
for n in numeros:
    if n == 3:
        continue
    print(n)  # imprime: 1, 2, 4, 5`
          }
        ],
        related: ["for", "while", "break"]
      }
    ]
  },
  {
    category: "Funções e Variáveis",
    terms: [
      {
        term: "def",
        definition: `O "def" é a palavra-chave usada para DEFINIR (criar) uma função em Python. Uma função é um bloco de código reutilizável que executa uma tarefa específica e pode ser chamado quantas vezes for necessário.

Estrutura: def NOME(parâmetros):

Vantagens de usar funções:
- Reutilização: escreva uma vez, use em qualquer lugar
- Organização: divide o código em partes menores e compreensíveis
- Manutenção: ao corrigir a função, todos os usos são corrigidos automaticamente

A função só executa quando é CHAMADA — apenas defini-la não faz nada.`,
        tip: `Pense em uma função como uma máquina de café. Você configura a máquina uma vez (def). Depois, sempre que quiser café, aperta o botão (chama a função). Você pode pedir café com leite (passando parâmetros diferentes) sem precisar reconfigurar tudo — a máquina já sabe o que fazer.`,
        examples: [
          {
            label: "Função sem parâmetros",
            code: `def saudar():
    print("Olá, Operador!")
    print("Sistema inicializado.")

# Chamando a função
saudar()
saudar()  # pode chamar várias vezes`
          },
          {
            label: "Com parâmetros e retorno",
            code: `def calcular_dano(ataque, defesa):
    dano = ataque - defesa
    if dano < 0:
        dano = 0
    return dano

resultado = calcular_dano(50, 20)
print("Dano causado:", resultado)  # 30`
          },
          {
            label: "Parâmetro com valor padrão",
            code: `def criar_jogador(nome, vidas=3, nivel=1):
    print(f"Jogador: {nome}")
    print(f"Vidas: {vidas}, Nível: {nivel}")

criar_jogador("Igor")          # usa padrão
criar_jogador("Maria", 5, 2)   # personalizado`
          }
        ],
        errors: [
          {
            label: "❌ Erros comuns com def",
            code: `# ERRO 1: chamar antes de definir
saudar()  # NameError!
def saudar():
    print("Olá")

# ERRO 2: esquecer parênteses na chamada
def saudar():
    print("Olá")

saudar   # não chama! só referencia
saudar() # correto!`
          }
        ],
        related: ["return", "variável", "parâmetro"]
      },
      {
        term: "return",
        definition: `O "return" encerra a execução de uma função e opcionalmente retorna um valor para quem a chamou. Após o "return", nenhuma linha da função é executada.

Uma função pode ter vários "return" (por exemplo, dentro de condicionais), mas apenas um será executado por chamada.

Se uma função não tiver "return" (ou tiver "return" sem valor), ela retorna automaticamente o valor especial "None".

Diferença importante:
- print() apenas MOSTRA o valor na tela
- return ENTREGA o valor para ser usado no código`,
        tip: `Imagine que você pediu um relatório para um colega. O "return" é ele te entregando o relatório — você pode ler, guardar numa pasta ou mandar para outra pessoa. Já o "print" seria ele lendo o relatório em voz alta — você ouve, mas não fica com nada nas mãos.`,
        examples: [
          {
            label: "Return vs Print",
            code: `# Com print — só exibe, não guarda
def dobrar_print(n):
    print(n * 2)

resultado = dobrar_print(5)  # exibe 10
print(resultado)  # None! não retornou nada

# Com return — entrega o valor
def dobrar_return(n):
    return n * 2

resultado = dobrar_return(5)  # guarda 10
print(resultado)  # 10`
          },
          {
            label: "Múltiplos returns",
            code: `def classificar_nota(nota):
    if nota >= 9:
        return "Excelente"
    elif nota >= 7:
        return "Bom"
    elif nota >= 5:
        return "Regular"
    else:
        return "Insuficiente"

print(classificar_nota(8.5))  # Bom`
          },
          {
            label: "Usando o valor retornado",
            code: `def area_retangulo(largura, altura):
    return largura * altura

area = area_retangulo(5, 3)  # 15
dobro = area_retangulo(4, 4) * 2  # 32
print(area, dobro)`
          }
        ],
        errors: [
          {
            label: "❌ Código após return é ignorado",
            code: `def verificar(n):
    if n > 0:
        return "positivo"
        print("isso nunca executa!")  # ignorado!
    return "negativo"

# return encerra a função imediatamente`
          }
        ],
        related: ["def", "None", "variável"]
      },
      {
        term: "variável",
        definition: `Uma variável é um espaço nomeado na memória do computador usado para armazenar dados que podem ser usados e modificados ao longo do programa.

Em Python, você cria uma variável simplesmente atribuindo um valor a um nome com o operador "=". Não é necessário declarar o tipo — Python descobre automaticamente.

Regras para nomes de variáveis:
- Pode conter letras, números e underscore (_)
- Deve começar com letra ou underscore (não com número)
- Não pode ser uma palavra reservada (if, for, def, etc.)
- Python diferencia maiúsculas de minúsculas (nome ≠ Nome)

Convenção: use snake_case (palavras separadas por underscore).`,
        tip: `Uma variável é como uma caixa com uma etiqueta. A etiqueta é o nome (pontos, vidas, nome_jogador), e o conteúdo é o valor. Você pode abrir a caixa para ver o conteúdo (ler a variável), trocar o conteúdo por outro (modificar), ou usar o conteúdo em uma receita (usar em expressões).`,
        examples: [
          {
            label: "Criando e modificando",
            code: `# Criando variáveis
nome = "Igor"
vidas = 3
energia = 100.0
ativo = True

# Modificando
vidas -= 1
energia = energia - 25.0
nome = "Igor Marques"

print(nome, vidas, energia)`
          },
          {
            label: "Nomes válidos e inválidos",
            code: `# VÁLIDOS
pontuacao = 100
nome_jogador = "Ana"
nivel2 = 5
_privado = "interno"

# INVÁLIDOS
# 2nivel = 5      (começa com número)
# meu-nome = "x" (hífen não é permitido)
# if = 10         (palavra reservada)`
          },
          {
            label: "Variáveis são case-sensitive",
            code: `nome = "Igor"
Nome = "Maria"
NOME = "João"

# Três variáveis DIFERENTES!
print(nome)   # Igor
print(Nome)   # Maria
print(NOME)   # João`
          }
        ],
        errors: [
          {
            label: "❌ Usar antes de criar",
            code: `# ERRADO — variável não existe ainda
print(pontos)  # NameError!

# CORRETO — crie antes de usar
pontos = 0
print(pontos)`
          }
        ],
        related: ["int", "str", "float", "bool", "def"]
      },
      {
        term: "print",
        definition: `A função print() exibe valores na tela (saída padrão). É uma das funções mais usadas em Python e fundamental para depurar código e comunicar resultados.

Recursos do print():
- Aceita múltiplos valores separados por vírgula
- O parâmetro sep define o separador (padrão: espaço)
- O parâmetro end define o que vem após (padrão: nova linha)
- Com f-strings, você pode inserir variáveis diretamente no texto`,
        tip: `O print() é sua janela para o mundo dentro do programa. Durante o desenvolvimento, use-o para "espiar" o valor das variáveis em diferentes momentos — é a forma mais simples de entender o que seu código está fazendo. Programadores chamam isso de "debug com print".`,
        examples: [
          {
            label: "Formas de usar",
            code: `# Texto simples
print("Olá, mundo!")

# Variáveis
nome = "Bug Hunter"
print(nome)

# Múltiplos valores
print("Nome:", nome, "| Nível:", 5)

# f-string (mais moderno e legível)
nivel = 5
print(f"Jogador {nome} está no nível {nivel}")`
          },
          {
            label: "Parâmetros especiais",
            code: `# sep: muda o separador entre valores
print("A", "B", "C", sep="-")  # A-B-C

# end: muda o que vem no final
print("Carregando", end="")
print("...")  # Carregando...

# Linha em branco
print()`
          },
          {
            label: "Expressões dentro do print",
            code: `x = 10
y = 3

print(x + y)        # 13
print(x * y)        # 30
print(x > y)        # True
print(f"{x} / {y} = {x/y:.2f}")  # 10 / 3 = 3.33`
          }
        ],
        errors: [
          {
            label: "❌ Confundir print com return",
            code: `# print apenas MOSTRA — não guarda valor
def somar(a, b):
    print(a + b)  # exibe mas não retorna

resultado = somar(3, 5)  # exibe 8
print(resultado)  # None! (função não retornou)

# CORRETO para guardar o resultado:
def somar(a, b):
    return a + b`
          }
        ],
        related: ["str", "variável", "return", "def"]
      },
      {
        term: "range",
        definition: `range() é uma função nativa que gera uma sequência de números inteiros. É amplamente usada com o "for" para controlar repetições.

Três formas de usar:
- range(fim) → de 0 até fim-1
- range(início, fim) → de início até fim-1
- range(início, fim, passo) → de início até fim-1, pulando de "passo" em passo

O range() não cria uma lista na memória — ele gera os números um por vez conforme necessário, o que é muito eficiente para sequências grandes.`,
        tip: `Pense no range como régua numerada. range(5) é uma régua de 0 a 4. range(1, 6) começa no 1. range(0, 10, 2) é uma régua que pula de 2 em 2. O número final NUNCA é incluído — pense que você vai até a última marcação mas não pisa nela.`,
        examples: [
          {
            label: "As três formas",
            code: `# range(fim) — começa em 0
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# range(início, fim)
for i in range(1, 6):
    print(i)  # 1, 2, 3, 4, 5

# range(início, fim, passo)
for i in range(0, 11, 2):
    print(i)  # 0, 2, 4, 6, 8, 10`
          },
          {
            label: "Contagem regressiva",
            code: `# Passo negativo para contar de trás
for i in range(10, 0, -1):
    print(i)  # 10, 9, 8, ..., 1

print("Lançamento!")`
          },
          {
            label: "Convertendo para lista",
            code: `# range não é lista, mas pode virar uma
sequencia = list(range(1, 6))
print(sequencia)  # [1, 2, 3, 4, 5]

pares = list(range(0, 11, 2))
print(pares)  # [0, 2, 4, 6, 8, 10]`
          }
        ],
        errors: [
          {
            label: "❌ Confundir início e fim",
            code: `# range(5) vai de 0 a 4, NÃO de 1 a 5!
for i in range(5):
    print(i)  # 0, 1, 2, 3, 4

# Para ir de 1 a 5:
for i in range(1, 6):
    print(i)  # 1, 2, 3, 4, 5`
          }
        ],
        related: ["for", "int", "list"]
      }
    ]
  },
  {
    category: "Tipos de Dados",
    terms: [
      {
        term: "int",
        definition: `int (integer = inteiro) é o tipo de dado para números inteiros: sem vírgula, sem ponto decimal. Pode ser positivo, negativo ou zero, com tamanho praticamente ilimitado em Python.

Operações com int:
- + (soma), - (subtração), * (multiplicação)
- // (divisão inteira — descarta a parte decimal)
- % (módulo — resto da divisão)
- ** (potenciação)

Quando você divide dois inteiros com /, o resultado é float. Use // para manter o resultado como inteiro.`,
        tip: `Use int para qualquer coisa que você conta: número de vidas, pontuação, posição em uma lista, quantidade de itens. Se o valor nunca vai ter vírgula, provavelmente é int. Se tiver dúvida entre int e float, pergunte-se: "Este valor pode ser 7.5?" Se não, use int.`,
        examples: [
          {
            label: "Operações com int",
            code: `vidas = 3
pontos = 150
nivel = -2  # pode ser negativo

# Operações
print(pontos + 50)   # 200
print(vidas * 2)     # 6
print(pontos // 7)   # 21 (divisão inteira)
print(pontos % 7)    # 3  (resto)
print(2 ** 8)        # 256 (potência)`
          },
          {
            label: "Divisão: / vs //",
            code: `a = 10
b = 3

print(a / b)   # 3.3333... (float!)
print(a // b)  # 3 (inteiro — descarta decimal)
print(a % b)   # 1 (resto da divisão)`
          },
          {
            label: "Convertendo tipos",
            code: `texto = "42"
numero = int(texto)  # converte str para int
print(numero + 8)    # 50

# Cuidado: não funciona com texto não numérico
# int("abc")  → ValueError!`
          }
        ],
        errors: [
          {
            label: "❌ Confundir / e //",
            code: `# Se você quer um inteiro como resultado:
print(10 / 2)   # 5.0 (float! não int)
print(10 // 2)  # 5   (int — correto)`
          }
        ],
        related: ["float", "str", "bool", "variável"]
      },
      {
        term: "float",
        definition: `float (floating point = ponto flutuante) é o tipo de dado para números com parte decimal. Em Python, o separador decimal é o PONTO, não a vírgula.

O nome "ponto flutuante" vem da forma como computadores representam números decimais internamente — o ponto decimal pode "flutuar" para diferentes posições.

Atenção: operações com float podem ter pequenas imprecisões devido à forma como computadores representam decimais em binário. Por isso, evite comparar floats diretamente com ==.`,
        tip: `Use float para medidas, médias, porcentagens e qualquer valor que possa ter casas decimais. Notas de escola (7.5), distâncias (3.14 km), velocidades (60.5 km/h). Se o valor pode ter vírgula, provavelmente é float.`,
        examples: [
          {
            label: "Criando floats",
            code: `nota = 8.5
pi = 3.14159
temperatura = -2.7
velocidade = 0.0  # zero também pode ser float

print(type(nota))  # <class 'float'>`
          },
          {
            label: "Operações",
            code: `a = 10.5
b = 3.2

print(a + b)   # 13.7
print(a * b)   # 33.6
print(a / b)   # 3.28125
print(round(a / b, 2))  # 3.28 (arredondado)`
          },
          {
            label: "Convertendo para float",
            code: `inteiro = 5
decimal = float(inteiro)  # 5.0

texto = "3.14"
numero = float(texto)     # 3.14

media = (7 + 8 + 9) / 3
print(media)  # 8.0`
          }
        ],
        errors: [
          {
            label: "❌ Imprecisão de ponto flutuante",
            code: `# Cuidado com comparações diretas!
print(0.1 + 0.2)         # 0.30000000000000004
print(0.1 + 0.2 == 0.3)  # False! (imprecisão)

# CORRETO — use round() para comparar
print(round(0.1 + 0.2, 1) == 0.3)  # True`
          }
        ],
        related: ["int", "str", "variável"]
      },
      {
        term: "str",
        definition: `str (string) é o tipo de dado para texto. Uma string é uma sequência de caracteres (letras, números, símbolos, espaços) delimitada por aspas simples ('') ou duplas ("").

Strings são imutáveis — você não pode alterar um caractere específico. Qualquer operação que "modifica" uma string na verdade cria uma nova string.

Operações com strings:
- + (concatenação — junta duas strings)
- * (repetição — repete a string N vezes)
- len() (tamanho — número de caracteres)
- .upper(), .lower() (maiúsculas/minúsculas)
- .strip() (remove espaços das bordas)
- .split() (divide em lista)`,
        tip: `Tudo entre aspas é texto, mesmo que pareça número. "42" é uma string, não um número — você não pode somar "42" + 8. Para converter, use int("42") ou float("42"). F-strings (f"...") são a forma mais moderna e legível de combinar texto com variáveis.`,
        examples: [
          {
            label: "Criando e operando",
            code: `nome = "Bug Hunter"
titulo = 'Operador'

# Concatenação
print(nome + " // " + titulo)

# Repetição
print("-" * 20)

# Tamanho
print(len(nome))  # 10`
          },
          {
            label: "Métodos de string",
            code: `texto = "  Python é incrível!  "

print(texto.strip())    # remove espaços
print(texto.upper())    # TUDO MAIÚSCULO
print(texto.lower())    # tudo minúsculo
print(texto.replace("incrível", "poderoso"))

palavras = "a,b,c,d".split(",")
print(palavras)  # ['a', 'b', 'c', 'd']`
          },
          {
            label: "F-strings",
            code: `nome = "Igor"
nivel = 7
energia = 85.5

# Forma antiga (menos legível)
print("Jogador: " + nome + ", Nível: " + str(nivel))

# F-string (moderno e legível)
print(f"Jogador: {nome}, Nível: {nivel}")
print(f"Energia: {energia:.1f}%")  # 1 decimal`
          }
        ],
        errors: [
          {
            label: "❌ Misturar str com números",
            code: `idade = 15
# ERRADO — não pode somar str com int
print("Idade: " + idade)  # TypeError!

# CORRETO — opção 1: converter com str()
print("Idade: " + str(idade))

# CORRETO — opção 2: f-string (mais fácil)
print(f"Idade: {idade}")`
          }
        ],
        related: ["int", "float", "print", "variável"]
      },
      {
        term: "bool",
        definition: `bool (booleano) é o tipo de dado lógico com apenas dois valores possíveis: True (verdadeiro) ou False (falso). O nome vem do matemático George Boole, criador da álgebra lógica.

Em Python, True e False são escritos com a primeira letra maiúscula.

Qualquer valor em Python pode ser avaliado como True ou False em um contexto booleano:
- São False: 0, 0.0, "" (string vazia), [] (lista vazia), None
- Todo o resto é considerado True`,
        tip: `Booleanos são como interruptores: ligado (True) ou desligado (False). Toda comparação que você faz (>, <, ==, !=) retorna um booleano. Use variáveis booleanas como "bandeiras" (flags) para controlar o estado do programa: jogo_ativo = True, missao_concluida = False.`,
        examples: [
          {
            label: "Valores booleanos",
            code: `ativo = True
morto = False

print(type(ativo))  # <class 'bool'>
print(5 > 3)        # True
print(5 == 3)       # False
print(10 != 10)     # False`
          },
          {
            label: "Valores truthy e falsy",
            code: `# São False (falsy):
print(bool(0))     # False
print(bool(""))    # False
print(bool([]))    # False
print(bool(None))  # False

# São True (truthy):
print(bool(1))     # True
print(bool("a"))   # True
print(bool([1]))   # True`
          },
          {
            label: "Usando como flag",
            code: `jogo_ativo = True
boss_derrotado = False

while jogo_ativo:
    print("Jogando...")
    
    if boss_derrotado:
        print("Você venceu!")
        jogo_ativo = False  # encerra o loop`
          }
        ],
        errors: [
          {
            label: "❌ Maiúsculas importam",
            code: `# ERRADO — Python não reconhece
ativo = true   # NameError!
ativo = false  # NameError!

# CORRETO
ativo = True
ativo = False`
          }
        ],
        related: ["if", "and", "or", "not", "variável"]
      },
      {
        term: "list",
        definition: `list (lista) é uma coleção ordenada e mutável que pode armazenar múltiplos valores em uma única variável. Os elementos ficam entre colchetes [], separados por vírgulas.

Características importantes:
- Ordenada: os elementos mantêm a ordem em que foram inseridos
- Mutável: você pode adicionar, remover e modificar elementos
- Índices começam em 0: o primeiro elemento é lista[0]
- Aceita tipos mistos: pode ter int, str, bool na mesma lista
- Índices negativos: lista[-1] acessa o último elemento

Métodos principais:
- .append(item) — adiciona ao final
- .remove(item) — remove primeira ocorrência
- .pop(índice) — remove e retorna pelo índice
- len(lista) — quantidade de elementos`,
        tip: `Uma lista é como uma fila numerada. A fila começa na posição 0 (não 1!). O último da fila tem índice len(lista)-1. Você pode ver quem está em qualquer posição, chamar alguém para sair da fila (remove/pop), ou colocar alguém no final (append).`,
        examples: [
          {
            label: "Criando e acessando",
            code: `setores = ["Alpha", "Beta", "Gamma", "Delta"]

print(setores[0])   # Alpha (primeiro)
print(setores[2])   # Gamma (terceiro)
print(setores[-1])  # Delta (último)
print(len(setores)) # 4`
          },
          {
            label: "Modificando a lista",
            code: `bugs = ["erro_404", "null_ptr", "overflow"]

# Adicionar
bugs.append("timeout")
print(bugs)  # 4 bugs agora

# Remover
bugs.remove("null_ptr")
print(bugs)  # 3 bugs

# Modificar
bugs[0] = "erro_500"
print(bugs)`
          },
          {
            label: "Percorrendo com for",
            code: `pontuacoes = [85, 92, 78, 96, 88]
total = 0

for p in pontuacoes:
    total += p

media = total / len(pontuacoes)
print(f"Média: {media:.1f}")`
          }
        ],
        errors: [
          {
            label: "❌ IndexError — índice fora do range",
            code: `lista = ["A", "B", "C"]  # índices: 0, 1, 2

# ERRADO
print(lista[3])   # IndexError! não existe
print(lista[-4])  # IndexError!

# CORRETO
print(lista[2])   # "C" (último válido)
print(lista[-1])  # "C" (último pelo negativo)`
          }
        ],
        related: ["for", "range", "int", "variável"]
      }
    ]
  },
  {
    category: "Operadores",
    terms: [
      {
        term: "and",
        definition: `"and" é um operador lógico que retorna True SOMENTE SE ambas as condições forem verdadeiras. Se qualquer uma for falsa, o resultado é False.

Tabela verdade do AND:
- True  and True  → True
- True  and False → False
- False and True  → False
- False and False → False

Python usa avaliação em curto-circuito: se a primeira condição já for False, a segunda nem é verificada (pois o resultado já será False de qualquer forma).`,
        tip: `O "and" é exigente: TODOS precisam ser verdadeiros. É como precisar de duas chaves para abrir um cofre — ter apenas uma não adianta. Se uma condição falhar, não importa o resultado das outras.`,
        examples: [
          {
            label: "Uso básico",
            code: `energia = 80
status = "ativo"
nivel = 5

if energia > 50 and status == "ativo":
    print("Sistema operacional")

if energia > 50 and status == "ativo" and nivel >= 3:
    print("Pode acessar área restrita")`
          },
          {
            label: "Tabela verdade",
            code: `print(True and True)   # True
print(True and False)  # False
print(False and True)  # False
print(False and False) # False

# Comparações
x = 10
print(x > 5 and x < 20)  # True (5 < 10 < 20)
print(x > 5 and x < 8)   # False (10 não < 8)`
          },
          {
            label: "Validação de dados",
            code: `nome = "Igor"
idade = 15
senha = "abc123"

if len(nome) > 0 and idade >= 13 and len(senha) >= 6:
    print("Cadastro válido!")
else:
    print("Dados inválidos.")`
          }
        ],
        errors: [
          {
            label: "❌ Usar & em vez de and",
            code: `x = 5

# ERRADO para lógica booleana
if x > 0 & x < 10:  # & é bitwise, não lógico!
    print("ok")

# CORRETO
if x > 0 and x < 10:
    print("ok")`
          }
        ],
        related: ["or", "not", "if", "bool"]
      },
      {
        term: "or",
        definition: `"or" é um operador lógico que retorna True se PELO MENOS UMA das condições for verdadeira. Só retorna False quando TODAS as condições são falsas.

Tabela verdade do OR:
- True  or True  → True
- True  or False → True
- False or True  → True
- False or False → False

Assim como o "and", Python usa curto-circuito: se a primeira condição for True, a segunda nem é verificada.`,
        tip: `O "or" é generoso: QUALQUER UM pode ser verdadeiro para passar. É como uma catraca que aceita cartão OU dinheiro OU QR code — basta ter uma das formas de pagamento. Só bloqueia quem não tem nenhuma.`,
        examples: [
          {
            label: "Uso básico",
            code: `energia = 8
temperatura = 90

if energia < 10 or temperatura > 80:
    print("ALERTA CRÍTICO!")
    print("Verificar sistema imediatamente")`
          },
          {
            label: "Tabela verdade",
            code: `print(True or True)    # True
print(True or False)   # True
print(False or True)   # True
print(False or False)  # False

x = 15
print(x < 5 or x > 10)   # True (10 < 15)
print(x < 5 or x > 20)   # False`
          },
          {
            label: "Verificando múltiplas opções",
            code: `dia = "sábado"

if dia == "sábado" or dia == "domingo":
    print("Final de semana! Sem aula.")
else:
    print("Dia de semana. Hora de estudar!")`
          }
        ],
        errors: [
          {
            label: "❌ Confundir and com or",
            code: `# Queremos verificar se x está FORA do intervalo [5, 10]
x = 15

# ERRADO — essa condição nunca é True para nenhum x!
if x < 5 and x > 10:  # impossível ser os dois!
    print("Fora do intervalo")

# CORRETO — use or para "fora do intervalo"
if x < 5 or x > 10:
    print("Fora do intervalo")`
          }
        ],
        related: ["and", "not", "if", "bool"]
      },
      {
        term: "not",
        definition: `"not" é um operador lógico unário que inverte o valor booleano. True vira False e False vira True. É o operador de negação lógica.

Tabela verdade do NOT:
- not True  → False
- not False → True

O "not" tem precedência maior que "and" e "or", mas menor que operadores de comparação. Em expressões complexas, use parênteses para deixar a intenção clara.`,
        tip: `O "not" é o "ao contrário de". "not True" é "ao contrário de verdadeiro" = falso. Use-o para tornar condições mais legíveis: "if not conectado:" é mais natural que "if conectado == False:". Ambos funcionam, mas o primeiro parece mais com linguagem humana.`,
        examples: [
          {
            label: "Uso básico",
            code: `conectado = False
pausado = True

if not conectado:
    print("Sem conexão! Verificando rede...")

if not pausado:
    print("Jogo em andamento")
else:
    print("Jogo pausado")`
          },
          {
            label: "Equivalências",
            code: `x = 10

# Estas expressões são equivalentes:
print(not (x > 5))   # False
print(x <= 5)         # False

print(not (x == 10))  # False
print(x != 10)        # False`
          },
          {
            label: "Com and e or",
            code: `logado = True
admin = False

# Verifica se logado mas NÃO é admin
if logado and not admin:
    print("Usuário comum logado")

# not tem precedência, use parênteses
if not (logado and admin):
    print("Não é admin logado")`
          }
        ],
        errors: [
          {
            label: "❌ Dupla negação confusa",
            code: `ativo = True

# Confuso — dupla negação
if not not ativo:
    print("ativo é True")

# Simplificado — muito mais claro
if ativo:
    print("ativo é True")`
          }
        ],
        related: ["and", "or", "bool", "if"]
      },
      {
        term: "==",
        definition: `"==" é o operador de igualdade. Compara dois valores e retorna True se forem iguais, False se forem diferentes.

ATENÇÃO: não confunda "==" com "=":
- = é o operador de ATRIBUIÇÃO (guarda um valor em uma variável)
- == é o operador de COMPARAÇÃO (verifica se dois valores são iguais)

Esta é uma das confusões mais comuns para iniciantes em programação. Usar "=" dentro de um "if" causa um erro de sintaxe em Python.

O "==" compara o VALOR, não a identidade do objeto. Para verificar se dois objetos são exatamente o mesmo na memória, use "is".`,
        tip: `Lembre assim: um "=" significa "recebe" (atribuição). Dois "==" significa "é igual a?" (pergunta/comparação). Toda vez que você estiver PERGUNTANDO algo no if, use dois sinais.`,
        examples: [
          {
            label: "Atribuição vs Comparação",
            code: `# = (atribuição) — guarda valor
x = 10
nome = "Igor"
ativo = True

# == (comparação) — faz uma pergunta
print(x == 10)      # True
print(x == 5)       # False
print(nome == "Igor")  # True`
          },
          {
            label: "Comparando diferentes tipos",
            code: `print(5 == 5)      # True
print(5 == 5.0)    # True (int e float)
print(5 == "5")    # False (int e str)
print("" == False) # False
print(0 == False)  # True (0 é False)`
          },
          {
            label: "Em condicionais",
            code: `dificuldade = "medio"

if dificuldade == "facil":
    vidas = 3
elif dificuldade == "medio":
    vidas = 2
elif dificuldade == "dificil":
    vidas = 1

print(f"Vidas: {vidas}")`
          }
        ],
        errors: [
          {
            label: "❌ Usar = no lugar de ==",
            code: `x = 5

# ERRADO — causa SyntaxError em Python
if x = 10:
    print("igual")

# CORRETO
if x == 10:
    print("igual")`
          }
        ],
        related: ["!=", "if", "bool", "variável"]
      },
      {
        term: "!=",
        definition: `"!=" é o operador de diferença (não igual). Compara dois valores e retorna True se forem DIFERENTES, False se forem iguais. É o oposto exato do "==".

O símbolo "!" em muitas linguagens significa "não" ou "negação". Então "!=" se lê como "não igual" ou "diferente de".

É matematicamente equivalente a usar "not" com "==": (a != b) é o mesmo que (not a == b).`,
        tip: `Use "!=" quando quiser verificar que algo é diferente do esperado. É muito útil para criar condições de saída: "enquanto status != 'concluido'" ou "se resposta != 'sair'". Leia em voz alta: "se resposta é DIFERENTE de sair".`,
        examples: [
          {
            label: "Uso básico",
            code: `status = "ativo"

if status != "pausado":
    print("Sistema em execução")

# Equivalente com not
if not (status == "pausado"):
    print("Sistema em execução")`
          },
          {
            label: "Em loops",
            code: `resposta = ""

while resposta != "sair":
    resposta = input("Digite um comando: ")
    
    if resposta != "sair":
        print(f"Executando: {resposta}")

print("Sistema encerrado.")`
          },
          {
            label: "Filtrando valores",
            code: `notas = [7, 0, 9, 0, 8, 5, 0]

validas = []
for n in notas:
    if n != 0:  # ignora zeros
        validas.append(n)

print(validas)  # [7, 9, 8, 5]`
          }
        ],
        errors: [
          {
            label: "❌ Confundir != com not ==",
            code: `x = 5
y = 10

# Estas expressões são equivalentes:
print(x != y)         # True — mais comum
print(not (x == y))   # True — mais verboso
print(not x == y)     # True — cuidado com precedência!

# A mais legível é a primeira: x != y`
          }
        ],
        related: ["==", "if", "bool", "not"]
      },
      {
        term: "+=",
        definition: `"+=" é um operador de atribuição composta que soma um valor à variável e guarda o resultado na própria variável. É um atalho para a operação "x = x + valor".

Existem operadores similares para outras operações:
- -= : subtração composta (x -= 1 → x = x - 1)
- *= : multiplicação composta (x *= 2 → x = x * 2)
- /= : divisão composta (x /= 2 → x = x / 2)
- //= : divisão inteira composta
- %= : módulo composto
- **= : potenciação composta`,
        tip: `O "+=" é o operador favorito dos loops! Toda vez que você precisa "adicionar à variável e guardar", use +=. É mais curto, mais legível e menos propenso a erros do que escrever "pontos = pontos + 100" toda hora.`,
        examples: [
          {
            label: "Formas equivalentes",
            code: `pontos = 0

# Forma longa (equivalente)
pontos = pontos + 100

# Forma curta com +=
pontos += 100
pontos += 50

print(pontos)  # 250`
          },
          {
            label: "Todos os operadores compostos",
            code: `x = 10

x += 5    # x = 15
print(x)

x -= 3    # x = 12
print(x)

x *= 2    # x = 24
print(x)

x //= 5   # x = 4
print(x)

x **= 3   # x = 64
print(x)`
          },
          {
            label: "Acumulando em loop",
            code: `notas = [7, 8, 9, 6, 10]
total = 0

for nota in notas:
    total += nota  # acumula a soma

media = total / len(notas)
print(f"Média: {media}")  # 8.0`
          }
        ],
        errors: [
          {
            label: "❌ Usar antes de inicializar",
            code: `# ERRADO — variável não existe ainda
pontos += 100  # UnboundLocalError!

# CORRETO — inicialize antes
pontos = 0
pontos += 100  # agora funciona`
          }
        ],
        related: ["variável", "while", "for", "int"]
      }
    ]
  }
];

let glossaryOpen = false;

function openGlossary() {
  if (!mission.difficulty) return; // só abre se o jogo tiver começado
  glossaryOpen = true;
  mission.missionActive = true; // pausa o jogo
  buildGlossarySidebar();
  document.getElementById("glossaryScreen").style.display = "flex";
}

function closeGlossary() {
  glossaryOpen = false;
  mission.missionActive = false; // despausa
  document.getElementById("glossaryScreen").style.display = "none";
}

function buildGlossarySidebar() {
  const sidebar = document.getElementById("glossarySidebar");
  sidebar.innerHTML = "";

  GLOSSARY.forEach(cat => {
    const catLabel = document.createElement("div");
    catLabel.className = "glossary-category";
    catLabel.textContent = cat.category;
    sidebar.appendChild(catLabel);

    cat.terms.forEach(t => {
      const btn = document.createElement("button");
      btn.className = "glossary-term-btn";
      btn.textContent = t.term;
      btn.onclick = () => showTerm(t, btn);
      sidebar.appendChild(btn);
    });
  });
}

function showTerm(termObj, btn) {
  // remove active de todos
  document.querySelectorAll(".glossary-term-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const detail = document.getElementById("glossaryDetail");

  let examplesHTML = termObj.examples.map(ex => `
    <div class="gd-code-block">
      <div class="gd-code-label">${ex.label}</div>
      <pre>${ex.code}</pre>
    </div>
  `).join("");

  let relatedHTML = termObj.related.map(r => `
    <button class="gd-related-tag" onclick="openTermByName('${r}')">${r}</button>
  `).join("");

  detail.innerHTML = `
    <div class="gd-term">${termObj.term}</div>
    <div class="gd-category-tag">${getCategoryOf(termObj.term)}</div>
    <hr class="gd-divider">
    <div class="gd-section-label">DEFINIÇÃO</div>
    <div class="gd-definition">${termObj.definition}</div>
    <div class="gd-tip">💡 ${termObj.tip}</div>
    <hr class="gd-divider">
    <div class="gd-section-label">EXEMPLOS DE CÓDIGO</div>
    ${examplesHTML}
    <div class="gd-related">
      <div class="gd-related-label">VER TAMBÉM</div>
      <div class="gd-related-tags">${relatedHTML}</div>
    </div>
  `;
}

function getCategoryOf(termName) {
  for (const cat of GLOSSARY) {
    if (cat.terms.some(t => t.term === termName)) return cat.category;
  }
  return "";
}

function openTermByName(name) {
  for (const cat of GLOSSARY) {
    const found = cat.terms.find(t => t.term === name);
    if (found) {
      const btns = document.querySelectorAll(".glossary-term-btn");
      btns.forEach(b => {
        if (b.textContent === name) showTerm(found, b);
      });
      return;
    }
  }
}

// Fechar glossário com ESC
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && glossaryOpen) closeGlossary();
});