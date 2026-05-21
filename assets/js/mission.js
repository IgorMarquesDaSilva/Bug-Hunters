// ============================================================
// PERGUNTAS POR DIFICULDADE
// ============================================================

const MISSIONS_FACIL = {
  sala1: [
    {
      title: "MISSÃO 01 — Condição de Energia",
      desc: "O robô deve retornar à base quando a energia estiver baixa. Qual palavra completa o código?",
      code: "___ energia < 20 entao\n    retornarBase()",
      choices: ["se", "para", "enquanto", "procedimento"],
      correct: 0,
      explanation: '"se" verifica uma condição. Se energia < 20 for verdadeiro, a ação é executada.'
    },
    {
      title: "MISSÃO 02 — Loop de Escaneamento",
      desc: "O sistema precisa repetir o escaneamento 5 vezes. Qual estrutura usar?",
      code: "___ i de 1 ate 5 faca\n    escanear(i)",
      choices: ["se", "para", "procedimento", "retorne"],
      correct: 1,
      explanation: '"para" repete um bloco de código várias vezes — ideal para percorrer intervalos numéricos.'
    },
    {
      title: "MISSÃO 03 — Valor Inicial",
      desc: "O contador de bugs deve começar em zero. Qual opção está correta?",
      code: "inteiro bugs <- ___\nescreva(bugs)",
      choices: ['"zero"', "verdadeiro", "0", "vazio"],
      correct: 2,
      explanation: 'Para guardar o número zero, usamos 0 (sem aspas). Aspas indicariam texto, não número.'
    },
    {
      title: "MISSÃO 04 — Operador Lógico",
      desc: "O sistema só age se a energia estiver ok E o status for ativo. Qual operador usar?",
      code: "se energia > 10 ___ status = \"ativo\" entao\n    continuar()",
      choices: ["ou", "nao", "e", "+"],
      correct: 2,
      explanation: '"e" exige que AMBAS as condições sejam verdadeiras. "ou" bastaria apenas uma delas.'
    },
    {
      title: "MISSÃO 05 — Definindo Procedimento",
      desc: "O programador quer criar um procedimento chamado verificarErro. Como começar?",
      code: "___ verificarErro()\n    retorne verdadeiro",
      choices: ["var", "funcao", "procedimento", "criar"],
      correct: 2,
      explanation: 'Em Portugol, usamos "procedimento" para definir um bloco de código reutilizável sem retorno de valor.'
    }
  ],
  sala2: [
    {
      title: "MISSÃO 06 — Saída do Programa",
      desc: "O robô precisa exibir uma mensagem na tela. Qual comando usamos em Portugol?",
      code: '___ ("Sistema online!")',
      choices: ["imprima", "escreva", "mostre", "exiba"],
      correct: 1,
      explanation: '"escreva()" é o comando do Portugol para exibir informações na tela.'
    },
    {
      title: "MISSÃO 07 — Comparação",
      desc: "O sistema verifica se dois valores são iguais. Qual operador usar?",
      code: "se nivel ___ 3 entao\n    subirNivel()",
      choices: ["<-", "=>", "=", "<>"],
      correct: 2,
      explanation: '"=" compara se dois valores são iguais em Portugol. "<-" é usado para atribuir valor a uma variável.'
    },
    {
      title: "MISSÃO 08 — Repetição com Condição",
      desc: "O robô deve continuar patrulhando enquanto não encontrar um bug. Qual estrutura usar?",
      code: "___ bugEncontrado = falso faca\n    patrulhar()",
      choices: ["se", "para", "enquanto", "procedimento"],
      correct: 2,
      explanation: '"enquanto" repete um bloco enquanto a condição for verdadeira.'
    },
    {
      title: "MISSÃO 09 — Tipo de Dado",
      desc: "O nome do jogador é um texto. Qual tipo de dado representa texto em Portugol?",
      code: '___ nome <- "Igor"\nescreva(nome)',
      choices: ["inteiro", "real", "caractere", "logico"],
      correct: 2,
      explanation: '"caractere" representa texto em Portugol. "inteiro" é número inteiro, "real" é decimal e "logico" é verdadeiro/falso.'
    },
    {
      title: "MISSÃO 10 — Valor Lógico",
      desc: "O sistema precisa guardar se o jogador está ativo ou não. Qual valor representa 'verdadeiro'?",
      code: "logico ativo <- ___\nse ativo entao\n    jogar()",
      choices: ["1", "sim", "verdadeiro", "true"],
      correct: 2,
      explanation: '"verdadeiro" é o valor lógico verdadeiro em Portugol. Faz parte do tipo "logico" (booleano).'
    }
  ]
};

const MISSIONS_MEDIO = {
  sala1: [
    {
      title: "MISSÃO 01 — O que esse código faz?",
      desc: "Leia o código abaixo. O que será exibido quando energia for 15?",
      code: "inteiro energia <- 15\nse energia < 20 entao\n    escreva(\"Retornando\")\nsenao\n    escreva(\"Operando\")\nfimse",
      choices: ["Operando", "Retornando", "Nada", "Erro"],
      correct: 1,
      explanation: 'Como energia (15) é menor que 20, a condição "se" é verdadeira e exibe "Retornando".'
    },
    {
      title: "MISSÃO 02 — Quantas vezes repete?",
      desc: "Quantas vezes a função escanear() será chamada?",
      code: "para i de 1 ate 3 faca\n    escanear(i)\n    escreva(i)\nfimpara",
      choices: ["2 vezes", "3 vezes", "4 vezes", "1 vez"],
      correct: 1,
      explanation: '"para i de 1 ate 3" gera os valores 1, 2 e 3 — ou seja, 3 iterações no total.'
    },
    {
      title: "MISSÃO 03 — Resultado da operação",
      desc: "Qual será o valor de resultado após executar o código?",
      code: "inteiro x <- 10\ninteiro y <- 3\ninteiro resultado <- x + y * 2",
      choices: ["26", "16", "13", "23"],
      correct: 1,
      explanation: 'Em Portugol, multiplicação tem prioridade sobre soma. y * 2 = 6, depois 10 + 6 = 16.'
    },
    {
      title: "MISSÃO 04 — Condição composta",
      desc: "Em quais casos o sistema vai executar alerta()?",
      code: "se energia < 10 ou temperatura > 80 entao\n    alerta()\nfimse",
      choices: [
        "Só se energia < 10 E temperatura > 80",
        "Se energia < 10 OU temperatura > 80",
        "Nunca executa",
        "Sempre executa"
      ],
      correct: 1,
      explanation: '"ou" executa se QUALQUER uma das condições for verdadeira — basta uma delas ser satisfeita.'
    },
    {
      title: "MISSÃO 05 — Valor de retorno",
      desc: "O que a função retorna quando chamada com dobrar(4)?",
      code: "funcao inteiro dobrar(inteiro n)\n    retorne n * 2\nfimfuncao\n\nresultado <- dobrar(4)",
      choices: ["4", "2", "8", "16"],
      correct: 2,
      explanation: 'A função multiplica n por 2. Passando 4, o retorno é 4 * 2 = 8.'
    }
  ],
  sala2: [
    {
      title: "MISSÃO 06 — Saída do loop",
      desc: "Quais números serão impressos por esse código?",
      code: "para i de 1 ate 4 faca\n    se i % 2 = 0 entao\n        escreva(i)\n    fimse\nfimpara",
      choices: ["1, 3", "2, 4", "1, 2, 3, 4", "0, 2, 4"],
      correct: 1,
      explanation: '"para i de 1 ate 4" gera 1,2,3,4. O "%" é o resto da divisão — só 2 e 4 têm resto 0 ao dividir por 2.'
    },
    {
      title: "MISSÃO 07 — Enquanto com contador",
      desc: "Quantas vezes 'tick' será exibido?",
      code: "inteiro cont <- 0\nenquanto cont < 3 faca\n    escreva(\"tick\")\n    cont <- cont + 1\nfimenquanto",
      choices: ["2 vezes", "3 vezes", "4 vezes", "infinito"],
      correct: 1,
      explanation: 'cont começa em 0 e vai até 2 (menor que 3), executando 3 vezes: cont = 0, 1, 2.'
    },
    {
      title: "MISSÃO 08 — Vetor e índice",
      desc: "Qual valor será exibido?",
      code: "caractere setores[4] <- {\"A\", \"B\", \"C\", \"D\"}\nescreva(setores[3])",
      choices: ["A", "B", "C", "D"],
      correct: 2,
      explanation: 'Em Portugol, vetores geralmente começam no índice 1. O índice 3 corresponde ao terceiro elemento: "C".'
    },
    {
      title: "MISSÃO 09 — Função com condição",
      desc: "O que a função retorna quando chamada com verificar(5)?",
      code: "funcao caractere verificar(inteiro n)\n    se n > 10 entao\n        retorne \"alto\"\n    fimse\n    retorne \"baixo\"\nfimfuncao",
      choices: ["alto", "baixo", "verdadeiro", "nulo"],
      correct: 1,
      explanation: '5 não é maior que 10, então o "se" é falso e a função retorna "baixo".'
    },
    {
      title: "MISSÃO 10 — Concatenação",
      desc: "Qual será a saída do código?",
      code: 'caractere nome <- "Bug"\ncaractere tipo <- "Hunter"\nescreva(nome + " " + tipo)',
      choices: ["BugHunter", "Bug Hunter", "nome tipo", "Erro"],
      correct: 1,
      explanation: 'O operador "+" junta textos. "Bug" + " " + "Hunter" resulta em "Bug Hunter".'
    }
  ]
};

const MISSIONS_DIFICIL = {
  sala1: [
    {
      title: "MISSÃO 01 — Encontre o Bug",
      desc: "O código abaixo tem um erro. Qual linha está errada?",
      code: "funcao inteiro somar(inteiro a, inteiro b)\n    inteiro resultado <- a + b\n    Retorne resultado\nfimfuncao",
      choices: [
        "funcao inteiro somar(inteiro a, inteiro b)",
        "inteiro resultado <- a + b",
        '"Retorne" deveria ser "retorne"',
        "Não há erro"
      ],
      correct: 2,
      explanation: 'Portugol é case-sensitive. "Retorne" com R maiúsculo é inválido — o correto é "retorne" em minúsculo.'
    },
    {
      title: "MISSÃO 02 — Loop Infinito",
      desc: "Por que esse código entra em loop infinito?",
      code: "inteiro cont <- 0\nenquanto cont < 5 faca\n    escreva(cont)\nfimenquanto",
      choices: [
        "O intervalo não foi definido",
        "cont nunca é incrementado",
        "enquanto deveria ser para",
        "escreva() causa o loop"
      ],
      correct: 1,
      explanation: 'cont sempre vale 0 pois nunca é incrementado. A condição cont < 5 nunca se torna falsa. Falta "cont <- cont + 1".'
    },
    {
      title: "MISSÃO 03 — Erro de Índice",
      desc: "O que acontece ao executar esse código?",
      code: "inteiro lista[3] <- {10, 20, 30}\nescreva(lista[4])",
      choices: [
        'Exibe "30"',
        'Exibe "nulo"',
        "Gera um erro de índice inválido",
        'Exibe "0"'
      ],
      correct: 2,
      explanation: 'O vetor tem 3 elementos (índices 1, 2, 3). Acessar o índice 4 gera um erro de índice fora do intervalo.'
    },
    {
      title: "MISSÃO 04 — Escopo de Variável",
      desc: "O que será exibido ao executar esse código?",
      code: "inteiro x <- 10\n\nprocedimento alterar()\n    inteiro x <- 99\nfimprocedimento\n\nalterar()\nescreva(x)",
      choices: ["99", "10", "nulo", "Erro"],
      correct: 1,
      explanation: 'O "inteiro x <- 99" dentro do procedimento cria uma variável LOCAL. O "x" global continua valendo 10.'
    },
    {
      title: "MISSÃO 05 — Lógica Invertida",
      desc: "O código deveria exibir apenas números ímpares, mas está errado. Qual é o problema?",
      code: "para i de 1 ate 7 faca\n    se i % 2 = 0 entao\n        escreva(i)\n    fimse\nfimpara",
      choices: [
        "O intervalo \"de 1 ate 7\" está errado",
        'Deveria ser "i % 2 <> 0"',
        'Deveria ser "i % 2 = 1"',
        "Não há problema"
      ],
      correct: 1,
      explanation: '"i % 2 = 0" seleciona números PARES. Para ímpares, a condição correta é "i % 2 <> 0" (resto diferente de zero).'
    }
  ],
  sala2: [
    {
      title: "MISSÃO 06 — Recursão",
      desc: "O que a função retorna quando chamada com fatorial(3)?",
      code: "funcao inteiro fatorial(inteiro n)\n    se n = 0 entao\n        retorne 1\n    fimse\n    retorne n * fatorial(n - 1)\nfimfuncao",
      choices: ["3", "6", "9", "1"],
      correct: 1,
      explanation: 'fatorial(3) = 3 * fatorial(2) = 3 * 2 * fatorial(1) = 3 * 2 * 1 = 6.'
    },
    {
      title: "MISSÃO 07 — Erro de Atribuição",
      desc: "O código tenta comparar x com 5, mas tem um erro. Qual é?",
      code: "inteiro x <- 10\nse x <- 5 entao\n    escreva(\"igual\")\nfimse",
      choices: [
        '"escreva" está errado',
        '"<-" deveria ser "="',
        '"x" não foi declarado',
        "Não há erro"
      ],
      correct: 1,
      explanation: 'Dentro do "se", "<-" é atribuição e causa erro de sintaxe. Para comparar, use "=" (sinal de igual simples).'
    },
    {
      title: "MISSÃO 08 — Registro",
      desc: "Como acessar o campo 'nome' em um registro em Portugol?",
      code: 'tipo Jogador\n    caractere nome\n    inteiro nivel\nfimtipo\n\nJogador jogador\njogador.nome <- "Igor"\nescreva(___)',
      choices: [
        'jogador["nome"]',
        'jogador.nome',
        'jogador(nome)',
        'jogador->nome'
      ],
      correct: 1,
      explanation: 'Em Portugol, os campos de um registro são acessados com ponto: jogador.nome'
    },
    {
      title: "MISSÃO 09 — Tratamento de Erro",
      desc: "Qual é a forma correta de evitar que o programa quebre ao receber um valor inválido?",
      code: "funcao inteiro converter(caractere valor)\n    se ___\n        retorne inteiro(valor)\n    senao\n        escreva(\"Valor invalido\")\n        retorne 0\n    fimse\nfimfuncao",
      choices: [
        "sempre verdadeiro entao",
        "valor <> \"\" e ehNumero(valor) entao",
        "valor = 0 entao",
        "nao verdadeiro entao"
      ],
      correct: 1,
      explanation: 'Antes de converter, é necessário verificar se o valor não está vazio e se é um número válido — evitando erros em tempo de execução.'
    },
    {
      title: "MISSÃO 10 — Vetor Dinâmico",
      desc: "O que o vetor 'quadrados' vai conter após o código?",
      code: "inteiro quadrados[3]\npara i de 1 ate 3 faca\n    quadrados[i] <- i * i\nfimpara",
      choices: [
        "[1, 2, 3]",
        "[1, 4, 9]",
        "[2, 4, 6]",
        "[0, 1, 4]"
      ],
      correct: 1,
      explanation: 'Para i de 1 até 3: 1²=1, 2²=4, 3²=9. O vetor ficará com os valores {1, 4, 9}.'
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
        term: "se",
        definition: `O "se" é a estrutura de decisão mais fundamental do Portugol. Ele avalia uma condição e executa um bloco de código SOMENTE se essa condição for verdadeira. Se a condição for falsa, o bloco é completamente ignorado e o programa continua na próxima linha após o "fimse".

Em Portugol, o bloco do "se" é delimitado pelas palavras-chave "entao" e "fimse". Tudo que estiver entre elas faz parte daquele bloco.`,
        tip: `Imagine que você está na portaria de um evento. O segurança verifica: "A pessoa tem ingresso?" SE sim, ela entra. SE não, fica do lado de fora. O "se" funciona exatamente assim — ele é o segurança do seu código, deixando passar apenas o que atende à condição.`,
        examples: [
          {
            label: "Estrutura básica",
            code: `inteiro energia <- 15

se energia < 20 entao
    escreva("Bateria fraca!")
    escreva("Retornando à base...")
fimse

escreva("Esta linha sempre executa")`
          },
          {
            label: "Com senao",
            code: `inteiro nota <- 7

se nota >= 6 entao
    escreva("Aprovado!")
senao
    escreva("Reprovado.")
    escreva("Tente novamente.")
fimse`
          },
          {
            label: "Comparando textos",
            code: `caractere status <- "ativo"

se status = "ativo" entao
    escreva("Sistema ligado")
senao
    escreva("Sistema desligado")
fimse`
          }
        ],
        errors: [
          {
            label: "❌ Erro: esquecer o entao ou fimse",
            code: `// ERRADO
se energia < 20
    escreva("Baixa!")

// CORRETO
se energia < 20 entao
    escreva("Baixa!")
fimse`
          },
          {
            label: "❌ Erro: usar <- dentro do se para comparar",
            code: `// ERRADO — <- é atribuição, não comparação
se energia <- 20 entao
    escreva("Baixa!")
fimse

// CORRETO — use = para comparar
se energia = 20 entao
    escreva("Baixa!")
fimse`
          }
        ],
        related: ["senao", "senaose", "e", "ou", "logico"]
      },
      {
        term: "senao",
        definition: `O "senao" é sempre usado em conjunto com o "se". Ele define o bloco de código que será executado quando a condição do "se" for FALSA. É o "caso contrário" do seu código.

O "senao" não tem condição própria — ele simplesmente captura tudo que não passou pelo "se". Por isso, nunca escreva uma condição após o "senao".

Você pode ter um "se" sem "senao", mas nunca um "senao" sem "se".`,
        tip: `Pense no "se/senao" como um interruptor de luz: SE o interruptor estiver para cima, a luz acende. SENÃO, a luz apaga. Sempre um dos dois acontece, nunca os dois ao mesmo tempo.`,
        examples: [
          {
            label: "se / senao simples",
            code: `inteiro temperatura <- 35

se temperatura > 30 entao
    escreva("Está muito quente hoje!")
senao
    escreva("Temperatura agradável.")
fimse`
          },
          {
            label: "Verificando login",
            code: `caractere senhaCorreta <- "portugol123"
caractere senhaDigitada <- "abc"

se senhaDigitada = senhaCorreta entao
    escreva("Acesso liberado!")
senao
    escreva("Senha incorreta. Tente novamente.")
fimse`
          }
        ],
        errors: [
          {
            label: "❌ Erro: colocar condição no senao",
            code: `// ERRADO — senao não recebe condição
se nota >= 6 entao
    escreva("Aprovado")
senao nota < 6 entao
    escreva("Reprovado")
fimse

// CORRETO
se nota >= 6 entao
    escreva("Aprovado")
senao
    escreva("Reprovado")
fimse`
          }
        ],
        related: ["se", "senaose"]
      },
      {
        term: "senaose",
        definition: `O "senaose" permite verificar múltiplas condições em sequência. É usado quando você tem mais de duas possibilidades e precisa tratar cada uma de forma diferente.

Portugol verifica as condições NA ORDEM em que aparecem e executa APENAS o primeiro bloco cuja condição for verdadeira. Depois disso, pula todos os outros senaose/senao.

Você pode ter quantos "senaose" quiser entre um "se" e um "senao".`,
        tip: `Imagine uma triagem médica: PRIMEIRO o médico verifica se é emergência → SE não, verifica se é urgente → SE não, verifica se é consulta normal → SENÃO, manda para casa. O "senaose" funciona exatamente como essa fila de verificações.`,
        examples: [
          {
            label: "Sistema de notas",
            code: `real nota <- 7.5

se nota >= 9 entao
    escreva("Excelente!")
senaose nota >= 7 entao
    escreva("Bom!")
senaose nota >= 5 entao
    escreva("Regular.")
senao
    escreva("Insuficiente.")
fimse`
          },
          {
            label: "Nível do jogador",
            code: `inteiro pontos <- 850
caractere nivel

se pontos >= 1000 entao
    nivel <- "Mestre"
senaose pontos >= 500 entao
    nivel <- "Avançado"
senaose pontos >= 100 entao
    nivel <- "Iniciante"
senao
    nivel <- "Novato"
fimse

escreva("Nível: " + nivel)`
          }
        ],
        errors: [
          {
            label: "❌ Erro: ordem errada das condições",
            code: `inteiro nota <- 9

// ERRADO — a condição >= 5 captura tudo antes
se nota >= 5 entao
    escreva("Regular")  // sempre cai aqui!
senaose nota >= 7 entao
    escreva("Bom")
senaose nota >= 9 entao
    escreva("Excelente")
fimse

// CORRETO — do maior para o menor
se nota >= 9 entao
    escreva("Excelente")
senaose nota >= 7 entao
    escreva("Bom")
senaose nota >= 5 entao
    escreva("Regular")
fimse`
          }
        ],
        related: ["se", "senao"]
      },
      {
        term: "para",
        definition: `O "para" é uma estrutura de repetição usada para percorrer intervalos numéricos. A cada repetição (iteração), a variável de controle é incrementada automaticamente até atingir o valor final.

A sintaxe é: para VARIÁVEL de INÍCIO ate FIM faca

Diferente do "enquanto", o "para" é ideal quando você SABE quantas vezes quer repetir. O bloco do "para" é delimitado por "faca" e "fimpara".`,
        tip: `Imagine que você tem uma pilha de provas para corrigir. Você pega a PRIMEIRA prova, corrige, coloca de lado. Pega a SEGUNDA, corrige, coloca de lado. Repete até acabar a pilha. O "para" faz exatamente isso: percorre cada número do intervalo e executa o bloco automaticamente.`,
        examples: [
          {
            label: "Repetir N vezes",
            code: `// Repete 5 vezes (1, 2, 3, 4, 5)
para i de 1 ate 5 faca
    escreva("Repetição número " + i)
fimpara`
          },
          {
            label: "Com passo personalizado",
            code: `// Conta de 2 em 2
para i de 0 ate 10 passo 2 faca
    escreva(i)  // 0, 2, 4, 6, 8, 10
fimpara`
          },
          {
            label: "Acumulando resultado",
            code: `inteiro total <- 0

para i de 1 ate 5 faca
    total <- total + i
fimpara

escreva("Soma total: " + total)  // 15`
          }
        ],
        errors: [
          {
            label: "❌ Erro: esquecer o fimpara",
            code: `// ERRADO
para i de 1 ate 5 faca
    escreva(i)

// CORRETO
para i de 1 ate 5 faca
    escreva(i)
fimpara`
          }
        ],
        related: ["enquanto", "fimpara", "inteiro"]
      },
      {
        term: "enquanto",
        definition: `O "enquanto" repete um bloco de código enquanto uma condição for verdadeira. A condição é verificada ANTES de cada repetição — se já começar falsa, o bloco nunca executa.

Diferente do "para", o "enquanto" é usado quando NÃO sabemos quantas repetições serão necessárias. O bloco é delimitado por "faca" e "fimenquanto".

ATENÇÃO: se a condição nunca se tornar falsa, o programa entra em loop infinito e trava. Sempre garanta que algo dentro do loop vai eventualmente tornar a condição falsa.`,
        tip: `Pense no "enquanto" como uma cancela automática de estacionamento. ENQUANTO a fila de carros não estiver vazia, a cancela continua abrindo para o próximo carro. Quando não há mais carros, a cancela para.`,
        examples: [
          {
            label: "Contador básico",
            code: `inteiro cont <- 0

enquanto cont < 5 faca
    escreva("Contagem: " + cont)
    cont <- cont + 1  // IMPORTANTE: incrementar!
fimenquanto

escreva("Loop encerrado")`
          },
          {
            label: "Aguardando condição",
            code: `inteiro energia <- 100

enquanto energia > 0 faca
    escreva("Energia: " + energia)
    energia <- energia - 25
fimenquanto

escreva("Sem energia! Game over.")`
          }
        ],
        errors: [
          {
            label: "❌ Erro: loop infinito",
            code: `// ERRADO — cont nunca muda, loop infinito!
inteiro cont <- 0
enquanto cont < 5 faca
    escreva(cont)
    // esqueceu cont <- cont + 1
fimenquanto

// CORRETO
inteiro cont <- 0
enquanto cont < 5 faca
    escreva(cont)
    cont <- cont + 1
fimenquanto`
          }
        ],
        related: ["para", "logico", "fimenquanto"]
      }
    ]
  },
  {
    category: "Funções e Variáveis",
    terms: [
      {
        term: "procedimento",
        definition: `O "procedimento" é usado para definir um bloco de código reutilizável que executa uma tarefa específica, mas NÃO retorna nenhum valor. É o equivalente ao "def" sem retorno.

Estrutura: procedimento NOME(parâmetros)

Vantagens de usar procedimentos:
- Reutilização: escreva uma vez, use em qualquer lugar
- Organização: divide o código em partes menores e compreensíveis
- Manutenção: ao corrigir o procedimento, todos os usos são corrigidos automaticamente

O procedimento só executa quando é CHAMADO — apenas defini-lo não faz nada.`,
        tip: `Pense em um procedimento como uma receita de bolo. Você escreve a receita uma vez (procedimento). Depois, sempre que quiser fazer o bolo, você segue a receita (chama o procedimento). Você pode fazer bolos diferentes passando ingredientes diferentes (parâmetros).`,
        examples: [
          {
            label: "Procedimento sem parâmetros",
            code: `procedimento saudar()
    escreva("Olá, Operador!")
    escreva("Sistema inicializado.")
fimprocedimento

// Chamando o procedimento
saudar()
saudar()  // pode chamar várias vezes`
          },
          {
            label: "Com parâmetros",
            code: `procedimento exibirJogador(caractere nome, inteiro vidas)
    escreva("Jogador: " + nome)
    escreva("Vidas: " + vidas)
fimprocedimento

exibirJogador("Igor", 3)
exibirJogador("Maria", 5)`
          }
        ],
        errors: [
          {
            label: "❌ Erros comuns com procedimento",
            code: `// ERRO: chamar antes de definir
saudar()  // erro!
procedimento saudar()
    escreva("Olá")
fimprocedimento

// ERRO: esquecer os parênteses na chamada
procedimento saudar()
    escreva("Olá")
fimprocedimento

saudar   // não chama! só referencia
saudar() // correto!`
          }
        ],
        related: ["funcao", "retorne", "variavel"]
      },
      {
        term: "funcao",
        definition: `A "funcao" é usada para definir um bloco de código reutilizável que executa uma tarefa e RETORNA um valor para quem a chamou. Diferente do procedimento, a função sempre devolve um resultado.

Estrutura: funcao TIPO nomeDaFuncao(parâmetros)

O tipo antes do nome indica qual tipo de dado a função vai retornar: inteiro, real, caractere, logico.

A função precisa obrigatoriamente ter pelo menos um "retorne" dentro dela.`,
        tip: `Imagine que você pediu um relatório para um colega. A "funcao" é ele te entregando o relatório (retorne) — você pode ler, guardar numa variável ou usar em outra parte do código. O "procedimento" seria ele fazendo uma tarefa sem te entregar nada.`,
        examples: [
          {
            label: "Função com retorno inteiro",
            code: `funcao inteiro dobrar(inteiro n)
    retorne n * 2
fimfuncao

inteiro resultado <- dobrar(4)
escreva(resultado)  // 8`
          },
          {
            label: "Função com condição",
            code: `funcao caractere classificar(inteiro nota)
    se nota >= 9 entao
        retorne "Excelente"
    senaose nota >= 7 entao
        retorne "Bom"
    senaose nota >= 5 entao
        retorne "Regular"
    senao
        retorne "Insuficiente"
    fimse
fimfuncao

escreva(classificar(8))  // Bom`
          }
        ],
        errors: [
          {
            label: "❌ Esquecer o retorne",
            code: `// ERRADO — função sem retorne
funcao inteiro dobrar(inteiro n)
    inteiro resultado <- n * 2
    // esqueceu o retorne!
fimfuncao

// CORRETO
funcao inteiro dobrar(inteiro n)
    retorne n * 2
fimfuncao`
          }
        ],
        related: ["retorne", "procedimento", "variavel"]
      },
      {
        term: "retorne",
        definition: `O "retorne" encerra a execução de uma função e devolve um valor para quem a chamou. Após o "retorne", nenhuma linha da função é executada.

Uma função pode ter vários "retorne" (por exemplo, dentro de condicionais), mas apenas um será executado por chamada.

Diferença importante:
- escreva() apenas MOSTRA o valor na tela
- retorne ENTREGA o valor para ser usado no código`,
        tip: `O "retorne" é a função te entregando o resultado nas mãos. Sem ele, a função faz o trabalho mas você nunca recebe o produto final — como um padeiro que assa o pão mas não te entrega.`,
        examples: [
          {
            label: "Retorne vs Escreva",
            code: `// Com escreva — só exibe, não guarda
procedimento dobrarExibe(inteiro n)
    escreva(n * 2)
fimprocedimento

// Com retorne — entrega o valor
funcao inteiro dobrarRetorna(inteiro n)
    retorne n * 2
fimfuncao

inteiro resultado <- dobrarRetorna(5)
escreva(resultado)  // 10`
          },
          {
            label: "Múltiplos retornes",
            code: `funcao caractere verificar(inteiro n)
    se n > 0 entao
        retorne "positivo"
    senaose n < 0 entao
        retorne "negativo"
    senao
        retorne "zero"
    fimse
fimfuncao`
          }
        ],
        errors: [
          {
            label: "❌ Código após retorne é ignorado",
            code: `funcao inteiro verificar(inteiro n)
    se n > 0 entao
        retorne 1
        escreva("isso nunca executa!")  // ignorado!
    fimse
    retorne 0
fimfuncao`
          }
        ],
        related: ["funcao", "procedimento", "variavel"]
      },
      {
        term: "variavel",
        definition: `Uma variável é um espaço nomeado na memória do computador usado para armazenar dados que podem ser usados e modificados ao longo do programa.

Em Portugol, você DEVE declarar o tipo da variável antes de usá-la, e o operador de atribuição é "<-" (seta para a esquerda).

Tipos disponíveis: inteiro, real, caractere, logico

Regras para nomes de variáveis:
- Pode conter letras, números e underscore (_)
- Deve começar com letra
- Não pode ser uma palavra reservada (se, para, enquanto, etc.)
- Portugol diferencia maiúsculas de minúsculas`,
        tip: `Uma variável é como uma caixa com uma etiqueta. A etiqueta é o nome (pontos, vidas, nomeJogador), e o conteúdo é o valor. O tipo da variável define que tipo de coisa pode ficar dentro da caixa — uma caixa "inteiro" só aceita números inteiros.`,
        examples: [
          {
            label: "Declarando e atribuindo",
            code: `inteiro vidas <- 3
real energia <- 100.0
caractere nome <- "Igor"
logico ativo <- verdadeiro

// Modificando
vidas <- vidas - 1
energia <- energia - 25.0
nome <- "Igor Marques"

escreva(nome + " tem " + vidas + " vidas")`
          },
          {
            label: "Nomes válidos e inválidos",
            code: `// VÁLIDOS
inteiro pontuacao <- 100
caractere nomeJogador <- "Ana"
inteiro nivel2 <- 5

// INVÁLIDOS
// inteiro 2nivel <- 5    (começa com número)
// inteiro meu-nome <- 0  (hífen não é permitido)
// inteiro se <- 10       (palavra reservada)`
          }
        ],
        errors: [
          {
            label: "❌ Usar antes de declarar",
            code: `// ERRADO — variável não existe ainda
escreva(pontos)  // erro!

// CORRETO — declare antes de usar
inteiro pontos <- 0
escreva(pontos)`
          }
        ],
        related: ["inteiro", "real", "caractere", "logico", "funcao"]
      },
      {
        term: "escreva",
        definition: `O comando escreva() exibe valores na tela (saída padrão). É um dos comandos mais usados em Portugol e fundamental para comunicar resultados ao usuário.

Variantes:
- escreva() — exibe sem pular linha
- escreval() — exibe e pula para a próxima linha automaticamente

Para combinar texto com variáveis, use o operador "+" para concatenar.`,
        tip: `O escreva() é sua janela para o mundo dentro do programa. Durante o desenvolvimento, use-o para "espiar" o valor das variáveis em diferentes momentos — é a forma mais simples de entender o que seu código está fazendo.`,
        examples: [
          {
            label: "Formas de usar",
            code: `// Texto simples
escreva("Olá, mundo!")

// Variáveis
caractere nome <- "Bug Hunter"
escreva(nome)

// Combinando texto e variável
inteiro nivel <- 5
escreva("Jogador " + nome + " está no nível " + nivel)`
          },
          {
            label: "Escreva vs Escreval",
            code: `escreva("Carregando")
escreva("...")
// Saída: Carregando...

escreval("Linha 1")
escreval("Linha 2")
// Saída:
// Linha 1
// Linha 2`
          },
          {
            label: "Expressões dentro do escreva",
            code: `inteiro x <- 10
inteiro y <- 3

escreva(x + y)        // 13
escreva(x * y)        // 30
escreva(x > y)        // verdadeiro`
          }
        ],
        errors: [
          {
            label: "❌ Confundir escreva com retorne",
            code: `// escreva apenas MOSTRA — não guarda valor
procedimento somar(inteiro a, inteiro b)
    escreva(a + b)  // exibe mas não retorna
fimprocedimento

// Para guardar o resultado, use funcao + retorne:
funcao inteiro somar(inteiro a, inteiro b)
    retorne a + b
fimfuncao`
          }
        ],
        related: ["caractere", "variavel", "retorne", "funcao"]
      }
    ]
  },
  {
    category: "Tipos de Dados",
    terms: [
      {
        term: "inteiro",
        definition: `inteiro é o tipo de dado para números inteiros: sem vírgula, sem ponto decimal. Pode ser positivo, negativo ou zero.

Operações com inteiro:
- + (soma), - (subtração), * (multiplicação)
- div (divisão inteira — descarta a parte decimal)
- mod (módulo — resto da divisão)
- ** (potenciação)

Quando você divide dois inteiros com /, o resultado pode ser real. Use div para manter o resultado como inteiro.`,
        tip: `Use inteiro para qualquer coisa que você conta: número de vidas, pontuação, posição em um vetor, quantidade de itens. Se o valor nunca vai ter vírgula, provavelmente é inteiro.`,
        examples: [
          {
            label: "Operações com inteiro",
            code: `inteiro vidas <- 3
inteiro pontos <- 150
inteiro nivel <- -2  // pode ser negativo

// Operações
escreva(pontos + 50)      // 200
escreva(vidas * 2)        // 6
escreva(pontos div 7)     // 21 (divisão inteira)
escreva(pontos mod 7)     // 3  (resto)`
          },
          {
            label: "Divisão: / vs div",
            code: `inteiro a <- 10
inteiro b <- 3

escreva(a / b)    // 3.333... (real!)
escreva(a div b)  // 3 (inteiro)
escreva(a mod b)  // 1 (resto da divisão)`
          }
        ],
        errors: [
          {
            label: "❌ Confundir / e div",
            code: `// Se você quer um inteiro como resultado:
escreva(10 / 2)    // 5.0 (pode virar real!)
escreva(10 div 2)  // 5   (inteiro — correto)`
          }
        ],
        related: ["real", "caractere", "logico", "variavel"]
      },
      {
        term: "real",
        definition: `real é o tipo de dado para números com parte decimal. Em Portugol, o separador decimal é o PONTO, não a vírgula.

Use "real" para medidas, médias, porcentagens e qualquer valor que possa ter casas decimais.

Operações com real funcionam da mesma forma que com inteiro, mas os resultados preservam as casas decimais.`,
        tip: `Use real para notas de escola (7.5), distâncias (3.14 km), velocidades (60.5 km/h). Se o valor pode ter vírgula, provavelmente é real. Se tiver dúvida entre inteiro e real, pergunte-se: "Este valor pode ser 7.5?" Se sim, use real.`,
        examples: [
          {
            label: "Criando e operando",
            code: `real nota <- 8.5
real pi <- 3.14159
real temperatura <- -2.7

escreva(nota + 1.5)    // 10.0
escreva(pi * 2.0)      // 6.28318
escreva(temperatura)   // -2.7`
          },
          {
            label: "Calculando média",
            code: `inteiro n1 <- 7
inteiro n2 <- 8
inteiro n3 <- 9

real media <- (n1 + n2 + n3) / 3.0
escreva("Média: " + media)  // 8.0`
          }
        ],
        errors: [
          {
            label: "❌ Usar vírgula no lugar de ponto",
            code: `// ERRADO — vírgula não é aceita
real nota <- 8,5  // erro de sintaxe!

// CORRETO — use ponto decimal
real nota <- 8.5`
          }
        ],
        related: ["inteiro", "caractere", "logico", "variavel"]
      },
      {
        term: "caractere",
        definition: `caractere é o tipo de dado para texto. Uma variável do tipo caractere armazena uma sequência de letras, números, símbolos e espaços, delimitada por aspas duplas ("").

Operações com caractere:
- + (concatenação — junta dois textos)
- comprimento() (tamanho — número de caracteres)
- maiusculo() / minusculo() (conversão de caixa)
- subcadeia() (extrai parte do texto)`,
        tip: `Tudo entre aspas duplas é texto, mesmo que pareça número. "42" é um caractere, não um número — você não pode somar "42" com 8 diretamente. Para exibir variáveis junto com texto, use o operador "+" para concatenar.`,
        examples: [
          {
            label: "Criando e operando",
            code: `caractere nome <- "Bug Hunter"
caractere titulo <- "Operador"

// Concatenação
escreva(nome + " // " + titulo)

// Tamanho
escreva(comprimento(nome))  // 10`
          },
          {
            label: "Combinando com outras variáveis",
            code: `caractere nomeJogador <- "Igor"
inteiro nivel <- 7
real energia <- 85.5

escreva("Jogador: " + nomeJogador)
escreva("Nível: " + nivel)
escreva("Energia: " + energia + "%")`
          }
        ],
        errors: [
          {
            label: "❌ Usar aspas simples",
            code: `// ERRADO — Portugol usa aspas duplas
caractere nome <- 'Igor'  // pode causar erro

// CORRETO
caractere nome <- "Igor"`
          }
        ],
        related: ["inteiro", "real", "escreva", "variavel"]
      },
      {
        term: "logico",
        definition: `logico é o tipo de dado para valores verdadeiro ou falso. Uma variável do tipo logico só pode assumir dois valores: verdadeiro ou falso.

O nome vem da lógica booleana, criada pelo matemático George Boole.

Em Portugol, verdadeiro e falso são escritos em minúsculo.

Qualquer comparação que você faz (>, <, =, <>) retorna um valor logico.`,
        tip: `Variáveis logicas são como interruptores: ligado (verdadeiro) ou desligado (falso). Use-as como "bandeiras" para controlar o estado do programa: jogoAtivo <- verdadeiro, missaoConcluida <- falso.`,
        examples: [
          {
            label: "Valores lógicos",
            code: `logico ativo <- verdadeiro
logico morto <- falso

escreva(ativo)       // verdadeiro
escreva(5 > 3)       // verdadeiro
escreva(5 = 3)       // falso
escreva(10 <> 10)    // falso`
          },
          {
            label: "Usando como flag",
            code: `logico jogoAtivo <- verdadeiro
logico bossDerrotado <- falso

enquanto jogoAtivo faca
    escreva("Jogando...")

    se bossDerrotado entao
        escreva("Você venceu!")
        jogoAtivo <- falso
    fimse
fimenquanto`
          }
        ],
        errors: [
          {
            label: "❌ Maiúsculas importam",
            code: `// ERRADO — Portugol não reconhece
logico ativo <- Verdadeiro   // erro!
logico ativo <- FALSO        // erro!

// CORRETO
logico ativo <- verdadeiro
logico ativo <- falso`
          }
        ],
        related: ["se", "e", "ou", "nao", "variavel"]
      },
      {
        term: "vetor",
        definition: `Um vetor é uma coleção de variáveis do mesmo tipo, armazenadas em sequência na memória. Em Portugol, vetores são declarados com o tipo, nome e tamanho entre colchetes.

Características importantes:
- Todos os elementos devem ser do mesmo tipo
- Em Portugol, os índices geralmente começam em 1
- O tamanho deve ser definido na declaração
- Acesse os elementos com o nome e o índice entre colchetes

Sintaxe: tipo nome[tamanho]`,
        tip: `Um vetor é como uma estante com prateleiras numeradas. Cada prateleira guarda um item do mesmo tipo. A prateleira 1 é a primeira, a prateleira 2 é a segunda, e assim por diante. Você acessa uma prateleira específica pelo número dela.`,
        examples: [
          {
            label: "Criando e acessando",
            code: `caractere setores[4] <- {"Alpha", "Beta", "Gamma", "Delta"}

escreva(setores[1])  // Alpha (primeiro)
escreva(setores[3])  // Gamma (terceiro)
escreva(setores[4])  // Delta (último)`
          },
          {
            label: "Percorrendo com para",
            code: `inteiro notas[5] <- {85, 92, 78, 96, 88}
inteiro total <- 0

para i de 1 ate 5 faca
    total <- total + notas[i]
fimpara

real media <- total / 5.0
escreva("Média: " + media)`
          },
          {
            label: "Modificando elementos",
            code: `inteiro valores[3]
valores[1] <- 10
valores[2] <- 20
valores[3] <- 30

valores[1] <- 99  // modifica o primeiro
escreva(valores[1])  // 99`
          }
        ],
        errors: [
          {
            label: "❌ Índice fora do intervalo",
            code: `inteiro lista[3] <- {10, 20, 30}
// índices válidos: 1, 2, 3

// ERRADO
escreva(lista[4])  // erro! índice inválido
escreva(lista[0])  // erro! índice inválido

// CORRETO
escreva(lista[3])  // 30 (último válido)`
          }
        ],
        related: ["para", "inteiro", "caractere", "variavel"]
      }
    ]
  },
  {
    category: "Operadores",
    terms: [
      {
        term: "e",
        definition: `"e" é um operador lógico que retorna verdadeiro SOMENTE SE ambas as condições forem verdadeiras. Se qualquer uma for falsa, o resultado é falso.

Tabela verdade do E:
- verdadeiro e verdadeiro → verdadeiro
- verdadeiro e falso      → falso
- falso e verdadeiro      → falso
- falso e falso           → falso`,
        tip: `O "e" é exigente: TODOS precisam ser verdadeiros. É como precisar de duas chaves para abrir um cofre — ter apenas uma não adianta. Se uma condição falhar, não importa o resultado das outras.`,
        examples: [
          {
            label: "Uso básico",
            code: `inteiro energia <- 80
caractere status <- "ativo"
inteiro nivel <- 5

se energia > 50 e status = "ativo" entao
    escreva("Sistema operacional")
fimse

se energia > 50 e status = "ativo" e nivel >= 3 entao
    escreva("Pode acessar área restrita")
fimse`
          },
          {
            label: "Tabela verdade",
            code: `escreva(verdadeiro e verdadeiro)  // verdadeiro
escreva(verdadeiro e falso)      // falso
escreva(falso e verdadeiro)      // falso
escreva(falso e falso)           // falso

inteiro x <- 10
escreva(x > 5 e x < 20)  // verdadeiro
escreva(x > 5 e x < 8)   // falso`
          }
        ],
        errors: [
          {
            label: "❌ Confundir e com ou",
            code: `inteiro x <- 15

// Queremos verificar se x está FORA do intervalo [5,10]
// ERRADO — impossível ser os dois ao mesmo tempo!
se x < 5 e x > 10 entao
    escreva("Fora do intervalo")
fimse

// CORRETO — use ou para "fora do intervalo"
se x < 5 ou x > 10 entao
    escreva("Fora do intervalo")
fimse`
          }
        ],
        related: ["ou", "nao", "se", "logico"]
      },
      {
        term: "ou",
        definition: `"ou" é um operador lógico que retorna verdadeiro se PELO MENOS UMA das condições for verdadeira. Só retorna falso quando TODAS as condições são falsas.

Tabela verdade do OU:
- verdadeiro ou verdadeiro → verdadeiro
- verdadeiro ou falso      → verdadeiro
- falso ou verdadeiro      → verdadeiro
- falso ou falso           → falso`,
        tip: `O "ou" é generoso: QUALQUER UM pode ser verdadeiro para passar. É como uma catraca que aceita cartão OU dinheiro OU QR code — basta ter uma das formas de pagamento. Só bloqueia quem não tem nenhuma.`,
        examples: [
          {
            label: "Uso básico",
            code: `inteiro energia <- 8
inteiro temperatura <- 90

se energia < 10 ou temperatura > 80 entao
    escreva("ALERTA CRÍTICO!")
    escreva("Verificar sistema imediatamente")
fimse`
          },
          {
            label: "Verificando múltiplas opções",
            code: `caractere dia <- "sabado"

se dia = "sabado" ou dia = "domingo" entao
    escreva("Final de semana! Sem aula.")
senao
    escreva("Dia de semana. Hora de estudar!")
fimse`
          }
        ],
        errors: [
          {
            label: "❌ Confundir ou com e",
            code: `inteiro x <- 15

// ERRADO — nunca True para nenhum x!
se x < 5 e x > 10 entao  // impossível!
    escreva("Fora do intervalo")
fimse

// CORRETO
se x < 5 ou x > 10 entao
    escreva("Fora do intervalo")
fimse`
          }
        ],
        related: ["e", "nao", "se", "logico"]
      },
      {
        term: "nao",
        definition: `"nao" é um operador lógico unário que inverte o valor lógico. verdadeiro vira falso e falso vira verdadeiro. É o operador de negação lógica.

Tabela verdade do NAO:
- nao verdadeiro → falso
- nao falso      → verdadeiro`,
        tip: `O "nao" é o "ao contrário de". "nao verdadeiro" é "ao contrário de verdadeiro" = falso. Use-o para tornar condições mais legíveis: "se nao conectado entao" é mais natural que "se conectado = falso entao".`,
        examples: [
          {
            label: "Uso básico",
            code: `logico conectado <- falso
logico pausado <- verdadeiro

se nao conectado entao
    escreva("Sem conexão! Verificando rede...")
fimse

se nao pausado entao
    escreva("Jogo em andamento")
senao
    escreva("Jogo pausado")
fimse`
          },
          {
            label: "Equivalências",
            code: `inteiro x <- 10

// Estas expressões são equivalentes:
escreva(nao (x > 5))  // falso
escreva(x <= 5)        // falso

escreva(nao (x = 10))  // falso
escreva(x <> 10)       // falso`
          }
        ],
        errors: [
          {
            label: "❌ Dupla negação confusa",
            code: `logico ativo <- verdadeiro

// Confuso — dupla negação
se nao (nao ativo) entao
    escreva("ativo é verdadeiro")
fimse

// Simplificado — muito mais claro
se ativo entao
    escreva("ativo é verdadeiro")
fimse`
          }
        ],
        related: ["e", "ou", "logico", "se"]
      },
      {
        term: "=",
        definition: `Em Portugol, o sinal "=" é usado para COMPARAÇÃO — para verificar se dois valores são iguais. Ele retorna verdadeiro se os valores forem iguais, e falso caso contrário.

ATENÇÃO: não confunda "=" com "<-":
- <- é o operador de ATRIBUIÇÃO (guarda um valor em uma variável)
- = é o operador de COMPARAÇÃO (verifica se dois valores são iguais)

Esta é uma das diferenças mais importantes do Portugol em relação a outras linguagens como Python, onde "==" é usado para comparar.`,
        tip: `Lembre assim: a setinha "<-" recebe um valor (atribuição). O sinal "=" pergunta se dois valores são iguais (comparação). Toda vez que você estiver DENTRO de um "se" verificando algo, use "=".`,
        examples: [
          {
            label: "Atribuição vs Comparação",
            code: `// <- (atribuição) — guarda valor
inteiro x <- 10
caractere nome <- "Igor"
logico ativo <- verdadeiro

// = (comparação) — faz uma pergunta
se x = 10 entao
    escreva("x é dez")    // verdadeiro
fimse

se nome = "Igor" entao
    escreva("Olá Igor!")  // verdadeiro
fimse`
          },
          {
            label: "Em condicionais",
            code: `caractere dificuldade <- "medio"

se dificuldade = "facil" entao
    inteiro vidas <- 3
senaose dificuldade = "medio" entao
    inteiro vidas <- 2
senaose dificuldade = "dificil" entao
    inteiro vidas <- 1
fimse`
          }
        ],
        errors: [
          {
            label: "❌ Usar <- no lugar de = para comparar",
            code: `inteiro x <- 5

// ERRADO — <- é atribuição, não comparação!
se x <- 10 entao
    escreva("igual")
fimse

// CORRETO
se x = 10 entao
    escreva("igual")
fimse`
          }
        ],
        related: ["<>", "se", "logico", "variavel"]
      },
      {
        term: "<>",
        definition: `"<>" é o operador de diferença (diferente de). Compara dois valores e retorna verdadeiro se forem DIFERENTES, falso se forem iguais. É o oposto exato do "=".

O símbolo "<>" é lido como "diferente de" ou "não igual". Em outras linguagens como Python, o equivalente é "!=".

É matematicamente equivalente a usar "nao" com "=": (a <> b) é o mesmo que (nao (a = b)).`,
        tip: `Use "<>" quando quiser verificar que algo é diferente do esperado. É muito útil para criar condições de saída: "enquanto status <> 'concluido' faca" ou "se resposta <> 'sair' entao".`,
        examples: [
          {
            label: "Uso básico",
            code: `caractere status <- "ativo"

se status <> "pausado" entao
    escreva("Sistema em execução")
fimse

// Equivalente com nao
se nao (status = "pausado") entao
    escreva("Sistema em execução")
fimse`
          },
          {
            label: "Em loops",
            code: `caractere resposta <- ""

enquanto resposta <> "sair" faca
    leia(resposta)

    se resposta <> "sair" entao
        escreva("Executando: " + resposta)
    fimse
fimenquanto

escreva("Sistema encerrado.")`
          }
        ],
        errors: [
          {
            label: "❌ Usar != em vez de <>",
            code: `// ERRADO — != não é Portugol
se x != 5 entao  // erro de sintaxe!
    escreva("diferente")
fimse

// CORRETO — use <> em Portugol
se x <> 5 entao
    escreva("diferente")
fimse`
          }
        ],
        related: ["=", "se", "logico", "nao"]
      },
      {
        term: "<-",
        definition: `"<-" é o operador de atribuição do Portugol. Ele guarda um valor em uma variável. Lê-se como "recebe".

Formas de atribuição acumulada:
Em Portugol não existe "+=" como em Python, então você deve escrever a forma completa:
- x <- x + 1   (incrementar)
- x <- x - 1   (decrementar)
- x <- x * 2   (multiplicar)

O valor do lado direito é calculado primeiro, depois guardado na variável do lado esquerdo.`,
        tip: `O "<-" é como uma caixa recebendo um novo conteúdo. "x <- 10" se lê "x recebe 10". Sempre que você quiser guardar algo em uma variável, use "<-". Nunca use "<-" dentro de um "se" para comparar — isso é erro!`,
        examples: [
          {
            label: "Atribuições básicas",
            code: `inteiro pontos <- 0
pontos <- pontos + 100
pontos <- pontos + 50
escreva(pontos)  // 150`
          },
          {
            label: "Acumulando em loop",
            code: `inteiro total <- 0

para i de 1 ate 5 faca
    total <- total + i
fimpara

escreva("Soma: " + total)  // 15`
          },
          {
            label: "Formas de incremento",
            code: `inteiro x <- 10

x <- x + 5    // x agora é 15
escreva(x)

x <- x - 3    // x agora é 12
escreva(x)

x <- x * 2    // x agora é 24
escreva(x)

x <- x div 5  // x agora é 4
escreva(x)`
          }
        ],
        errors: [
          {
            label: "❌ Usar antes de declarar",
            code: `// ERRADO — variável não foi declarada
pontos <- 100  // erro!

// CORRETO — declare o tipo primeiro
inteiro pontos <- 100  // correto!`
          }
        ],
        related: ["variavel", "enquanto", "para", "inteiro"]
      }
    ]
  }
];

let glossaryOpen = false;

function openGlossary() {
  if (!mission.difficulty) return;
  glossaryOpen = true;
  mission.missionActive = true;
  buildGlossarySidebar();
  document.getElementById("glossaryScreen").style.display = "flex";
}

function closeGlossary() {
  glossaryOpen = false;
  mission.missionActive = false;
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

document.addEventListener("keydown", e => {
  if (e.key === "Escape" && glossaryOpen) closeGlossary();
});