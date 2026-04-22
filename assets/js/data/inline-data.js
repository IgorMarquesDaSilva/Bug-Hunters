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
