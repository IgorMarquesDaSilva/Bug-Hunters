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