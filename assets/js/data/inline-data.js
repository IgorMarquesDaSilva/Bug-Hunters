/* ============================================================
   assets/js/data/inline-data.js
   Dados inline de fallback — usados quando o fetch() falha
   (ex: abrir o HTML direto sem servidor local).
   O conteúdo é idêntico aos arquivos JSON externos.
   ============================================================ */

const ROOMS_INLINE = {
  "sala1": {
    "backgroundImage": "assets/img/map_sala1.png",
    "playerStart": { "x": 80, "y": 80 },
    "portalPosition": { "x": 480, "y": 260 },
    "collisionZones": [
      { "id": "wall_top",    "x": 0,   "y": 0,   "w": 1000, "h": 28  },
      { "id": "wall_bottom", "x": 0,   "y": 572, "w": 1000, "h": 28  },
      { "id": "wall_left",   "x": 0,   "y": 0,   "w": 28,   "h": 600 },
      { "id": "wall_right",  "x": 972, "y": 0,   "w": 28,   "h": 600 },
      { "id": "desk_top",    "x": 60,  "y": 40,  "w": 300,  "h": 90  },
      { "id": "gauge",       "x": 415, "y": 28,  "w": 100,  "h": 75  },
      { "id": "generator",   "x": 445, "y": 235, "w": 115,  "h": 130 },
      { "id": "boxes",       "x": 60,  "y": 458, "w": 160,  "h": 60  },
      { "id": "terminals",   "x": 855, "y": 145, "w": 110,  "h": 360 }
    ],
    "bugPositions": [
      { "x": 180, "y": 160 },
      { "x": 390, "y": 150 },
      { "x": 700, "y": 80  },
      { "x": 300, "y": 380 },
      { "x": 650, "y": 430 }
    ]
  },
  "sala2": {
    "backgroundImage": "assets/img/map_sala2.png",
    "playerStart": { "x": 80, "y": 300 },
    "portalPosition": { "x": 460, "y": 500 },
    "collisionZones": [
      { "id": "wall_top",    "x": 0,   "y": 0,   "w": 1000, "h": 28  },
      { "id": "wall_bottom", "x": 0,   "y": 572, "w": 1000, "h": 28  },
      { "id": "wall_left",   "x": 0,   "y": 0,   "w": 28,   "h": 600 },
      { "id": "wall_right",  "x": 972, "y": 0,   "w": 28,   "h": 600 },
      { "id": "desks_top",   "x": 80,  "y": 35,  "w": 380,  "h": 120 },
      { "id": "server",      "x": 820, "y": 35,  "w": 80,   "h": 130 },
      { "id": "pcs_left",    "x": 28,  "y": 140, "w": 110,  "h": 300 },
      { "id": "pcs_right",   "x": 862, "y": 140, "w": 110,  "h": 300 },
      { "id": "boxes_btm",   "x": 50,  "y": 460, "w": 120,  "h": 60  }
    ],
    "bugPositions": [
      { "x": 300, "y": 100 },
      { "x": 600, "y": 80  },
      { "x": 200, "y": 330 },
      { "x": 740, "y": 320 },
      { "x": 480, "y": 430 }
    ]
  }
};

const MISSIONS_INLINE = {
  "facil": {
    "sala1": [
      { "title": "MISSÃO 01 — Condição de Energia", "desc": "O robô deve retornar à base quando a energia estiver baixa. Qual palavra completa o código?", "code": "___ energia < 20 entao\n    retornarBase()", "choices": ["se","para","enquanto","procedimento"], "correct": 0, "explanation": "\"se\" verifica uma condição. Se energia < 20 for verdadeiro, a ação é executada." },
      { "title": "MISSÃO 02 — Loop de Escaneamento", "desc": "O sistema precisa repetir o escaneamento 5 vezes. Qual estrutura usar?", "code": "___ i de 1 ate 5 faca\n    escanear(i)", "choices": ["se","para","procedimento","retorne"], "correct": 1, "explanation": "\"para\" repete um bloco de código várias vezes — ideal para percorrer intervalos numéricos." },
      { "title": "MISSÃO 03 — Valor Inicial", "desc": "O contador de bugs deve começar em zero. Qual opção está correta?", "code": "inteiro bugs <- ___\nescreva(bugs)", "choices": ["\"zero\"","verdadeiro","0","vazio"], "correct": 2, "explanation": "Para guardar o número zero, usamos 0 (sem aspas). Aspas indicariam texto, não número." },
      { "title": "MISSÃO 04 — Operador Lógico", "desc": "O sistema só age se a energia estiver ok E o status for ativo. Qual operador usar?", "code": "se energia > 10 ___ status = \"ativo\" entao\n    continuar()", "choices": ["ou","nao","e","+"], "correct": 2, "explanation": "\"e\" exige que AMBAS as condições sejam verdadeiras. \"ou\" bastaria apenas uma delas." },
      { "title": "MISSÃO 05 — Definindo Procedimento", "desc": "O programador quer criar um procedimento chamado verificarErro. Como começar?", "code": "___ verificarErro()\n    retorne verdadeiro", "choices": ["var","funcao","procedimento","criar"], "correct": 2, "explanation": "Em Portugol, usamos \"procedimento\" para definir um bloco de código reutilizável sem retorno de valor." }
    ],
    "sala2": [
      { "title": "MISSÃO 06 — Saída do Programa", "desc": "O robô precisa exibir uma mensagem na tela. Qual comando usamos em Portugol?", "code": "___ (\"Sistema online!\")", "choices": ["imprima","escreva","mostre","exiba"], "correct": 1, "explanation": "\"escreva()\" é o comando do Portugol para exibir informações na tela." },
      { "title": "MISSÃO 07 — Comparação", "desc": "O sistema verifica se dois valores são iguais. Qual operador usar?", "code": "se nivel ___ 3 entao\n    subirNivel()", "choices": ["<-","=>","=","<>"], "correct": 2, "explanation": "\"=\" compara se dois valores são iguais em Portugol. \"<-\" é usado para atribuir valor a uma variável." },
      { "title": "MISSÃO 08 — Repetição com Condição", "desc": "O robô deve continuar patrulhando enquanto não encontrar um bug. Qual estrutura usar?", "code": "___ bugEncontrado = falso faca\n    patrulhar()", "choices": ["se","para","enquanto","procedimento"], "correct": 2, "explanation": "\"enquanto\" repete um bloco enquanto a condição for verdadeira." },
      { "title": "MISSÃO 09 — Tipo de Dado", "desc": "O nome do jogador é um texto. Qual tipo de dado representa texto em Portugol?", "code": "___ nome <- \"Igor\"\nescreva(nome)", "choices": ["inteiro","real","caractere","logico"], "correct": 2, "explanation": "\"caractere\" representa texto em Portugol. \"inteiro\" é número inteiro, \"real\" é decimal e \"logico\" é verdadeiro/falso." },
      { "title": "MISSÃO 10 — Valor Lógico", "desc": "O sistema precisa guardar se o jogador está ativo ou não. Qual valor representa 'verdadeiro'?", "code": "logico ativo <- ___\nse ativo entao\n    jogar()", "choices": ["1","sim","verdadeiro","true"], "correct": 2, "explanation": "\"verdadeiro\" é o valor lógico verdadeiro em Portugol. Faz parte do tipo \"logico\" (booleano)." }
    ]
  },
  "medio": {
    "sala1": [
      { "title": "MISSÃO 01 — O que esse código faz?", "desc": "Leia o código abaixo. O que será exibido quando energia for 15?", "code": "inteiro energia <- 15\nse energia < 20 entao\n    escreva(\"Retornando\")\nsenao\n    escreva(\"Operando\")\nfimse", "choices": ["Operando","Retornando","Nada","Erro"], "correct": 1, "explanation": "Como energia (15) é menor que 20, a condição \"se\" é verdadeira e exibe \"Retornando\"." },
      { "title": "MISSÃO 02 — Quantas vezes repete?", "desc": "Quantas vezes a função escanear() será chamada?", "code": "para i de 1 ate 3 faca\n    escanear(i)\n    escreva(i)\nfimpara", "choices": ["2 vezes","3 vezes","4 vezes","1 vez"], "correct": 1, "explanation": "\"para i de 1 ate 3\" gera os valores 1, 2 e 3 — ou seja, 3 iterações no total." },
      { "title": "MISSÃO 03 — Resultado da operação", "desc": "Qual será o valor de resultado após executar o código?", "code": "inteiro x <- 10\ninteiro y <- 3\ninteiro resultado <- x + y * 2", "choices": ["26","16","13","23"], "correct": 1, "explanation": "Em Portugol, multiplicação tem prioridade sobre soma. y * 2 = 6, depois 10 + 6 = 16." },
      { "title": "MISSÃO 04 — Condição composta", "desc": "Em quais casos o sistema vai executar alerta()?", "code": "se energia < 10 ou temperatura > 80 entao\n    alerta()\nfimse", "choices": ["Só se energia < 10 E temperatura > 80","Se energia < 10 OU temperatura > 80","Nunca executa","Sempre executa"], "correct": 1, "explanation": "\"ou\" executa se QUALQUER uma das condições for verdadeira — basta uma delas ser satisfeita." },
      { "title": "MISSÃO 05 — Valor de retorno", "desc": "O que a função retorna quando chamada com dobrar(4)?", "code": "funcao inteiro dobrar(inteiro n)\n    retorne n * 2\nfimfuncao\n\nresultado <- dobrar(4)", "choices": ["4","2","8","16"], "correct": 2, "explanation": "A função multiplica n por 2. Passando 4, o retorno é 4 * 2 = 8." }
    ],
    "sala2": [
      { "title": "MISSÃO 06 — Saída do loop", "desc": "Quais números serão impressos por esse código?", "code": "para i de 1 ate 4 faca\n    se i % 2 = 0 entao\n        escreva(i)\n    fimse\nfimpara", "choices": ["1, 3","2, 4","1, 2, 3, 4","0, 2, 4"], "correct": 1, "explanation": "\"para i de 1 ate 4\" gera 1,2,3,4. O \"%\" é o resto da divisão — só 2 e 4 têm resto 0 ao dividir por 2." },
      { "title": "MISSÃO 07 — Enquanto com contador", "desc": "Quantas vezes 'tick' será exibido?", "code": "inteiro cont <- 0\nenquanto cont < 3 faca\n    escreva(\"tick\")\n    cont <- cont + 1\nfimenquanto", "choices": ["2 vezes","3 vezes","4 vezes","infinito"], "correct": 1, "explanation": "cont começa em 0 e vai até 2 (menor que 3), executando 3 vezes: cont = 0, 1, 2." },
      { "title": "MISSÃO 08 — Vetor e índice", "desc": "Qual valor será exibido?", "code": "caractere setores[4] <- {\"A\",\"B\",\"C\",\"D\"}\nescreva(setores[3])", "choices": ["A","B","C","D"], "correct": 2, "explanation": "Em Portugol, vetores geralmente começam no índice 1. O índice 3 corresponde ao terceiro elemento: \"C\"." },
      { "title": "MISSÃO 09 — Função com condição", "desc": "O que a função retorna quando chamada com verificar(5)?", "code": "funcao caractere verificar(inteiro n)\n    se n > 10 entao\n        retorne \"alto\"\n    fimse\n    retorne \"baixo\"\nfimfuncao", "choices": ["alto","baixo","verdadeiro","nulo"], "correct": 1, "explanation": "5 não é maior que 10, então o \"se\" é falso e a função retorna \"baixo\"." },
      { "title": "MISSÃO 10 — Concatenação", "desc": "Qual será a saída do código?", "code": "caractere nome <- \"Bug\"\ncaractere tipo <- \"Hunter\"\nescreva(nome + \" \" + tipo)", "choices": ["BugHunter","Bug Hunter","nome tipo","Erro"], "correct": 1, "explanation": "O operador \"+\" junta textos. \"Bug\" + \" \" + \"Hunter\" resulta em \"Bug Hunter\"." }
    ]
  },
  "dificil": {
    "sala1": [
      { "title": "MISSÃO 01 — Encontre o Bug", "desc": "O código abaixo tem um erro. Qual linha está errada?", "code": "funcao inteiro somar(inteiro a, inteiro b)\n    inteiro resultado <- a + b\n    Retorne resultado\nfimfuncao", "choices": ["funcao inteiro somar(inteiro a, inteiro b)","inteiro resultado <- a + b","\"Retorne\" deveria ser \"retorne\"","Não há erro"], "correct": 2, "explanation": "Portugol é case-sensitive. \"Retorne\" com R maiúsculo é inválido — o correto é \"retorne\" em minúsculo." },
      { "title": "MISSÃO 02 — Loop Infinito", "desc": "Por que esse código entra em loop infinito?", "code": "inteiro cont <- 0\nenquanto cont < 5 faca\n    escreva(cont)\nfimenquanto", "choices": ["O intervalo não foi definido","cont nunca é incrementado","enquanto deveria ser para","escreva() causa o loop"], "correct": 1, "explanation": "cont sempre vale 0 pois nunca é incrementado. A condição cont < 5 nunca se torna falsa. Falta \"cont <- cont + 1\"." },
      { "title": "MISSÃO 03 — Erro de Índice", "desc": "O que acontece ao executar esse código?", "code": "inteiro lista[3] <- {10, 20, 30}\nescreva(lista[4])", "choices": ["Exibe \"30\"","Exibe \"nulo\"","Gera um erro de índice inválido","Exibe \"0\""], "correct": 2, "explanation": "O vetor tem 3 elementos (índices 1, 2, 3). Acessar o índice 4 gera um erro de índice fora do intervalo." },
      { "title": "MISSÃO 04 — Escopo de Variável", "desc": "O que será exibido ao executar esse código?", "code": "inteiro x <- 10\n\nprocedimento alterar()\n    inteiro x <- 99\nfimprocedimento\n\nalterar()\nescreva(x)", "choices": ["99","10","nulo","Erro"], "correct": 1, "explanation": "O \"inteiro x <- 99\" dentro do procedimento cria uma variável LOCAL. O \"x\" global continua valendo 10." },
      { "title": "MISSÃO 05 — Lógica Invertida", "desc": "O código deveria exibir apenas números ímpares, mas está errado. Qual é o problema?", "code": "para i de 1 ate 7 faca\n    se i % 2 = 0 entao\n        escreva(i)\n    fimse\nfimpara", "choices": ["O intervalo \"de 1 ate 7\" está errado","Deveria ser \"i % 2 <> 0\"","Deveria ser \"i % 2 = 1\"","Não há problema"], "correct": 1, "explanation": "\"i % 2 = 0\" seleciona números PARES. Para ímpares, a condição correta é \"i % 2 <> 0\" (resto diferente de zero)." }
    ],
    "sala2": [
      { "title": "MISSÃO 06 — Recursão", "desc": "O que a função retorna quando chamada com fatorial(3)?", "code": "funcao inteiro fatorial(inteiro n)\n    se n = 0 entao\n        retorne 1\n    fimse\n    retorne n * fatorial(n - 1)\nfimfuncao", "choices": ["3","6","9","1"], "correct": 1, "explanation": "fatorial(3) = 3 * fatorial(2) = 3 * 2 * fatorial(1) = 3 * 2 * 1 = 6." },
      { "title": "MISSÃO 07 — Erro de Atribuição", "desc": "O código tenta comparar x com 5, mas tem um erro. Qual é?", "code": "inteiro x <- 10\nse x <- 5 entao\n    escreva(\"igual\")\nfimse", "choices": ["\"escreva\" está errado","\"<-\" deveria ser \"=\"","\"x\" não foi declarado","Não há erro"], "correct": 1, "explanation": "Dentro do \"se\", \"<-\" é atribuição e causa erro de sintaxe. Para comparar, use \"=\" (sinal de igual simples)." },
      { "title": "MISSÃO 08 — Registro", "desc": "Como acessar o campo 'nome' em um registro em Portugol?", "code": "tipo Jogador\n    caractere nome\n    inteiro nivel\nfimtipo\n\nJogador jogador\njogador.nome <- \"Igor\"\nescreva(___)", "choices": ["jogador[\"nome\"]","jogador.nome","jogador(nome)","jogador->nome"], "correct": 1, "explanation": "Em Portugol, os campos de um registro são acessados com ponto: jogador.nome" },
      { "title": "MISSÃO 09 — Tratamento de Erro", "desc": "Qual é a forma correta de evitar que o programa quebre ao receber um valor inválido?", "code": "funcao inteiro converter(caractere valor)\n    se ___\n        retorne inteiro(valor)\n    senao\n        escreva(\"Valor invalido\")\n        retorne 0\n    fimse\nfimfuncao", "choices": ["sempre verdadeiro entao","valor <> \"\" e ehNumero(valor) entao","valor = 0 entao","nao verdadeiro entao"], "correct": 1, "explanation": "Antes de converter, é necessário verificar se o valor não está vazio e se é um número válido — evitando erros em tempo de execução." },
      { "title": "MISSÃO 10 — Vetor Dinâmico", "desc": "O que o vetor 'quadrados' vai conter após o código?", "code": "inteiro quadrados[3]\npara i de 1 ate 3 faca\n    quadrados[i] <- i * i\nfimpara", "choices": ["[1, 2, 3]","[1, 4, 9]","[2, 4, 6]","[0, 1, 4]"], "correct": 1, "explanation": "Para i de 1 até 3: 1²=1, 2²=4, 3²=9. O vetor ficará com os valores {1, 4, 9}." }
    ]
  }
};

// Complemento do fallback para o mapa HTML/CSS atual.
ROOMS_INLINE.sala1.playerStart = { x: 500, y: 420 };
ROOMS_INLINE.sala2.playerStart = { x: 500, y: 420 };
ROOMS_INLINE.sala3 = {
  backgroundImage: "",
  playerStart: { x: 305, y: 430 },
  portalPosition: { x: 760, y: 90 },
  collisionZones: [],
  bugPositions: []
};

ROOMS_INLINE.sala4 = {
  backgroundImage: "",
  playerStart: { x: 480, y: 430 },
  portalPosition: { x: 500, y: 540 },
  collisionZones: [],
  bugPositions: []
};

MISSIONS_INLINE.facil.sala3 = [
  { title: "MISSÃO 11 — Decisão Simples", desc: "O sistema de quarentena só deve ativar se o risco for maior que 50. Qual estrutura completa o código?", code: "___ risco > 50 entao\n    ativarQuarentena()\nfimse", choices: ["se", "para", "enquanto", "funcao"], correct: 0, explanation: "Usamos \"se\" quando o programa precisa tomar uma decisão com base em uma condição." },
  { title: "MISSÃO 12 — Caminho Alternativo", desc: "Se o acesso for negado, o sistema deve bloquear. Caso contrário, deve liberar. Qual palavra cria o caminho alternativo?", code: "se acesso = falso entao\n    bloquear()\n___\n    liberar()\nfimse", choices: ["senao", "enquanto", "para", "retorne"], correct: 0, explanation: "\"senao\" define o que acontece quando a condição do \"se\" é falsa." },
  { title: "MISSÃO 13 — Operador E", desc: "A porta só libera se o cartão for válido e a senha estiver correta.", code: "se cartaoValido = verdadeiro ___ senhaCorreta = verdadeiro entao\n    liberarPorta()\nfimse", choices: ["ou", "e", "+", "<-"], correct: 1, explanation: "O operador \"e\" exige que as duas condições sejam verdadeiras ao mesmo tempo." },
  { title: "MISSÃO 14 — Operador OU", desc: "O reator deve emitir alerta se a temperatura estiver alta ou se houver falha no núcleo.", code: "se temperatura > 90 ___ falhaNucleo = verdadeiro entao\n    emitirAlerta()\nfimse", choices: ["e", "ou", "*", "senao"], correct: 1, explanation: "O operador \"ou\" executa a ação se pelo menos uma condição for verdadeira." },
  { title: "MISSÃO 15 — Condição Correta", desc: "Complete a condição para recuperar os dados apenas quando o backup estiver disponível.", code: "se backupDisponivel = ___ entao\n    recuperarDados()\nfimse", choices: ["\"verdadeiro\"", "verdadeiro", "10", "texto"], correct: 1, explanation: "Em Portugol, verdadeiro é um valor lógico e não deve estar entre aspas." }
];

MISSIONS_INLINE.medio.sala3 = [
  { title: "MISSÃO 11 — Análise de Condição", desc: "Com risco igual a 70, o que será executado?", code: "inteiro risco <- 70\nse risco > 50 entao\n    escreva(\"Quarentena ativa\")\nsenao\n    escreva(\"Área segura\")\nfimse", choices: ["Área segura", "Quarentena ativa", "Nada", "Erro de sintaxe"], correct: 1, explanation: "Como 70 é maior que 50, a condição é verdadeira." },
  { title: "MISSÃO 12 — Condição com E", desc: "Quando o acesso será liberado?", code: "se cartao = verdadeiro e senha = verdadeiro entao\n    liberar()\nfimse", choices: ["Quando apenas o cartão for verdadeiro", "Quando apenas a senha for verdadeira", "Quando cartão e senha forem verdadeiros", "Sempre será liberado"], correct: 2, explanation: "Com o operador \"e\", todas as condições precisam ser verdadeiras." },
  { title: "MISSÃO 13 — Condição com OU", desc: "Em qual caso o alerta será ativado?", code: "se temperatura > 90 ou falha = verdadeiro entao\n    alerta()\nfimse", choices: ["Somente se as duas forem verdadeiras", "Se pelo menos uma condição for verdadeira", "Nunca será ativado", "Apenas se temperatura for menor que 90"], correct: 1, explanation: "Com \"ou\", basta uma das condições ser verdadeira." },
  { title: "MISSÃO 14 — Fluxo Se/Senão", desc: "Qual mensagem será exibida se energia for 3?", code: "inteiro energia <- 3\nse energia < 5 entao\n    escreva(\"Recarregar\")\nsenao\n    escreva(\"Continuar\")\nfimse", choices: ["Continuar", "Recarregar", "Ambas", "Nenhuma"], correct: 1, explanation: "Como energia é menor que 5, executa o bloco do \"se\"." },
  { title: "MISSÃO 15 — Decisão Encadeada", desc: "Qual estrutura permite testar uma condição e depois uma alternativa?", code: "se risco > 80 entao\n    alertaMaximo()\nsenao\n    verificarSistema()\nfimse", choices: ["se/senao", "para", "funcao", "escreva"], correct: 0, explanation: "A estrutura se/senao permite criar caminhos diferentes." }
];

MISSIONS_INLINE.dificil.sala3 = [
  { title: "MISSÃO 11 — Correção de Fluxo", desc: "O sistema só deve ativar a quarentena se risco for alto e o setor estiver contaminado.", code: "se risco > 70 ___ contaminado = verdadeiro entao\n    ativarQuarentena()\nfimse", choices: ["ou", "e", "senao", "<-"], correct: 1, explanation: "Como as duas condições são obrigatórias, o operador correto é \"e\"." },
  { title: "MISSÃO 12 — Falha na Condição", desc: "Qual é o problema neste código?", code: "se energia <- 10 entao\n    recarregar()\nfimse", choices: ["O correto seria usar comparação, não atribuição", "O comando recarregar está errado", "A variável energia não pode ser número", "O fimse deveria vir antes"], correct: 0, explanation: "\"<-\" atribui valor. Para testar uma condição, use comparação." },
  { title: "MISSÃO 13 — Condição Composta", desc: "Qual condição libera o acesso se o usuário for admin ou se tiver autorização?", code: "se admin = verdadeiro ___ autorizado = verdadeiro entao\n    liberarAcesso()\nfimse", choices: ["e", "ou", "+", "senao"], correct: 1, explanation: "Como existem duas possibilidades de liberação, usamos \"ou\"." },
  { title: "MISSÃO 14 — Interpretação de Código", desc: "Com energia = 6 e ativo = falso, o que acontece?", code: "se energia > 5 e ativo = verdadeiro entao\n    iniciar()\nsenao\n    bloquear()\nfimse", choices: ["iniciar()", "bloquear()", "os dois comandos", "nenhum comando"], correct: 1, explanation: "Com \"e\", tudo precisa ser verdadeiro. Como ativo é falso, executa o senao." },
  { title: "MISSÃO 15 — Condição Encadeada", desc: "Qual trecho representa melhor uma decisão com alternativa?", code: "Se risco alto, isolar. Senão, monitorar.", choices: ["se risco > 80 entao\n    isolar()\nsenao\n    monitorar()\nfimse", "para risco de 1 ate 80 faca\n    isolar()\nfimpara", "funcao risco()\n    monitorar()\nfimfuncao", "escreva(risco)"], correct: 0, explanation: "A estrutura se/senao é ideal quando existem dois caminhos possíveis." }
];

MISSIONS_INLINE.facil.sala4 = [
  { title: "MISSÃO 16 — Criar Função", desc: "A central precisa reaproveitar a rotina que verifica a energia da ponte. Qual palavra inicia uma função em Portugol?", code: "___ verificarEnergia()\n    escreva(\"Energia verificada\")\nfimfuncao", choices: ["funcao", "para", "se", "variavel"], correct: 0, explanation: "Usamos \"funcao\" para criar um bloco reutilizável que pode executar comandos e retornar valores." },
  { title: "MISSÃO 17 — Chamar Rotina", desc: "A função já existe. Qual comando chama a verificação no painel principal?", code: "funcao verificarEnergia()\n    escreva(\"ok\")\nfimfuncao\n\n___", choices: ["verificarEnergia()", "funcao verificarEnergia", "chamar verificarEnergia", "retorne verificarEnergia"], correct: 0, explanation: "Para executar uma função, escrevemos o nome dela seguido de parênteses." },
  { title: "MISSÃO 18 — Guardar Resultado", desc: "O sistema precisa guardar o nível de energia como número inteiro.", code: "___ energia <- 80\nescreva(energia)", choices: ["inteiro", "caractere", "logico", "texto"], correct: 0, explanation: "\"inteiro\" guarda números sem casas decimais, como 80." },
  { title: "MISSÃO 19 — Usar Parâmetro", desc: "A função analisarSetor recebe o nome do setor. Qual chamada envia o setor ponte?", code: "funcao analisarSetor(caractere setor)\n    escreva(setor)\nfimfuncao\n\n___", choices: ["analisarSetor(\"ponte\")", "analisarSetor()", "analisarSetor <- ponte", "funcao analisarSetor(\"ponte\")"], correct: 0, explanation: "O valor do parâmetro entra dentro dos parênteses na chamada da função." },
  { title: "MISSÃO 20 — Função com Decisão", desc: "Complete o retorno para liberar a ponte quando todos os sistemas estiverem estáveis.", code: "funcao logico ponteLiberada()\n    retorne ___\nfimfuncao", choices: ["verdadeiro", "\"verdadeiro\"", "inteiro", "funcao"], correct: 0, explanation: "\"verdadeiro\" sem aspas é um valor lógico em Portugol." }
];

MISSIONS_INLINE.medio.sala4 = [
  { title: "MISSÃO 16 — Retorno da Função", desc: "Qual valor fica em bonus depois da chamada?", code: "funcao inteiro calcularBonus(inteiro pontos)\n    retorne pontos + 5\nfimfuncao\n\ninteiro bonus <- calcularBonus(10)", choices: ["5", "10", "15", "50"], correct: 2, explanation: "A função recebe 10 e retorna 10 + 5, portanto bonus recebe 15." },
  { title: "MISSÃO 17 — Variável Atualizada", desc: "Qual valor será exibido ao final?", code: "inteiro energia <- 20\nenergia <- energia - 5\nescreva(energia)", choices: ["5", "15", "20", "25"], correct: 1, explanation: "A variável energia começa em 20 e depois recebe 20 - 5, ficando com 15." },
  { title: "MISSÃO 18 — Parâmetro Correto", desc: "Qual cabeçalho permite receber um número inteiro chamado nivel?", code: "___\n    escreva(nivel)\nfimfuncao", choices: ["funcao verificarNivel(inteiro nivel)", "funcao verificarNivel(caractere nivel)", "inteiro verificarNivel()", "parametro verificarNivel(nivel)"], correct: 0, explanation: "O parâmetro deve aparecer entre parênteses com seu tipo: inteiro nivel." },
  { title: "MISSÃO 19 — Organizando Ações", desc: "A mesma função deve recuperar dois setores. Qual trecho evita repetir a lógica interna?", code: "funcao recuperar(caractere setor)\n    escreva(\"Recuperando \" + setor)\nfimfuncao\n\n___", choices: ["recuperar(\"ponte\")\nrecuperar(\"motor\")", "funcao recuperar duas vezes", "setor <- recuperar", "retorne recuperar"], correct: 0, explanation: "Uma função pode ser chamada várias vezes com parâmetros diferentes." },
  { title: "MISSÃO 20 — Integrando Conceitos", desc: "Com energia 90 e alerta falso, o que a função retorna?", code: "funcao logico podeAtivar(inteiro energia, logico alerta)\n    se energia > 50 e alerta = falso entao\n        retorne verdadeiro\n    fimse\n    retorne falso\nfimfuncao\n\npodeAtivar(90, falso)", choices: ["verdadeiro", "falso", "90", "erro"], correct: 0, explanation: "As duas condições são verdadeiras: energia é maior que 50 e alerta é falso." }
];

MISSIONS_INLINE.dificil.sala4 = [
  { title: "MISSÃO 16 — Bug na Função", desc: "A função deveria devolver o total para quem a chamou. Qual linha corrige o erro?", code: "funcao inteiro somar(inteiro a, inteiro b)\n    inteiro total <- a + b\n    escreva(total)\nfimfuncao", choices: ["retorne total", "leia(total)", "total <- escreva", "fimse"], correct: 0, explanation: "Quando uma função tem tipo de retorno, ela deve usar \"retorne\" para devolver o valor." },
  { title: "MISSÃO 17 — Escopo de Variável", desc: "O que será exibido pelo código?", code: "inteiro sinal <- 50\n\nfuncao ajustar()\n    inteiro sinal <- 10\n    retorne sinal\nfimfuncao\n\najustar()\nescreva(sinal)", choices: ["10", "50", "60", "erro"], correct: 1, explanation: "A variável sinal criada dentro da função é local. A variável externa continua valendo 50." },
  { title: "MISSÃO 18 — Parâmetros Invertidos", desc: "A função deve retornar ok quando minimo for menor que maximo. Qual chamada está correta?", code: "funcao caractere comparar(inteiro minimo, inteiro maximo)\n    se minimo < maximo entao\n        retorne \"ok\"\n    fimse\n    retorne \"falha\"\nfimfuncao", choices: ["comparar(3, 8)", "comparar(8, 3)", "comparar(\"3\", \"8\")", "comparar()"], correct: 0, explanation: "A ordem dos parâmetros importa: minimo recebe 3 e maximo recebe 8." },
  { title: "MISSÃO 19 — Reutilização com Condição", desc: "Qual função evita repetir o mesmo teste para vários setores?", code: "se valor > 70 entao\n    escreva(\"critico\")\nsenao\n    escreva(\"estavel\")\nfimse", choices: ["funcao avaliarSetor(inteiro valor)\n    se valor > 70 entao\n        retorne \"critico\"\n    senao\n        retorne \"estavel\"\n    fimse\nfimfuncao", "para valor de 1 ate 70 faca\n    escreva(valor)\nfimpara", "inteiro valor <- 70", "escreva(\"critico\")"], correct: 0, explanation: "A função concentra a decisão e permite reutilizar o mesmo teste para qualquer setor." },
  { title: "MISSÃO 20 — Falha Final da Central", desc: "A ponte só deve ativar se energia, comunicação e navegação estiverem corretas. Qual expressão completa o código?", code: "se energia = verdadeiro ___ comunicacao = verdadeiro ___ navegacao = verdadeiro entao\n    ativarPonte()\nfimse", choices: ["e / e", "ou / ou", "e / ou", "ou / e"], correct: 0, explanation: "Como todas as condições são obrigatórias, usamos \"e\" entre elas." }
];
