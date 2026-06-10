/* ============================================================
   assets/js/data/inline-data.js
   Dados inline de fallback - usados quando o fetch() falha
   (ex: abrir o HTML direto sem servidor local).
   Este arquivo espelha rooms.json e missions.json.
   ============================================================ */

const ROOMS_INLINE = {
  "sala1": {
    "backgroundImage": "",
    "playerStart": {
      "x": 500,
      "y": 420
    },
    "portalPosition": {
      "x": 760,
      "y": 90
    },
    "collisionZones": [],
    "bugPositions": []
  },
  "sala2": {
    "backgroundImage": "",
    "playerStart": {
      "x": 500,
      "y": 420
    },
    "portalPosition": {
      "x": 760,
      "y": 90
    },
    "collisionZones": [],
    "bugPositions": []
  },
  "sala3": {
    "backgroundImage": "",
    "playerStart": {
      "x": 305,
      "y": 430
    },
    "portalPosition": {
      "x": 760,
      "y": 90
    },
    "collisionZones": [],
    "bugPositions": []
  },
  "sala4": {
    "backgroundImage": "",
    "playerStart": {
      "x": 480,
      "y": 430
    },
    "portalPosition": {
      "x": 500,
      "y": 540
    },
    "collisionZones": [],
    "bugPositions": []
  }
};

const MISSIONS_INLINE = {
  "facil": {
    "sala1": [
      {
        "title": "MISSÃO 01 — Condição de Energia",
        "desc": "O robô deve retornar à base quando a energia estiver baixa. Qual palavra completa o código?",
        "code": "___ energia < 20 entao\n    retornarBase()",
        "choices": [
          "se",
          "para",
          "enquanto",
          "procedimento"
        ],
        "correct": 0,
        "explanation": "\"se\" verifica uma condição. Se energia < 20 for verdadeiro, a ação é executada."
      },
      {
        "title": "MISSÃO 02 — Loop de Escaneamento",
        "desc": "O sistema precisa repetir o escaneamento 5 vezes. Qual estrutura usar?",
        "code": "___ i de 1 ate 5 faca\n    escanear(i)",
        "choices": [
          "se",
          "para",
          "procedimento",
          "retorne"
        ],
        "correct": 1,
        "explanation": "\"para\" repete um bloco de código várias vezes — ideal para percorrer intervalos numéricos."
      },
      {
        "title": "MISSÃO 03 — Valor Inicial",
        "desc": "O contador de bugs deve começar em zero. Qual opção está correta?",
        "code": "inteiro bugs <- ___\nescreva(bugs)",
        "choices": [
          "\"zero\"",
          "verdadeiro",
          "0",
          "vazio"
        ],
        "correct": 2,
        "explanation": "Para guardar o número zero, usamos 0 sem aspas."
      },
      {
        "title": "MISSÃO 04 — Operador Lógico",
        "desc": "O sistema só age se a energia estiver ok E o status for ativo. Qual operador usar?",
        "code": "se energia > 10 ___ status = \"ativo\" entao\n    continuar()",
        "choices": [
          "ou",
          "nao",
          "e",
          "+"
        ],
        "correct": 2,
        "explanation": "\"e\" exige que ambas as condições sejam verdadeiras."
      },
      {
        "title": "MISSÃO 05 — Definindo Procedimento",
        "desc": "O programador quer criar um procedimento chamado verificarErro. Como começar?",
        "code": "___ verificarErro()\n    retorne verdadeiro",
        "choices": [
          "var",
          "funcao",
          "procedimento",
          "criar"
        ],
        "correct": 2,
        "explanation": "Em Portugol, usamos procedimento para definir um bloco reutilizável sem retorno."
      }
    ],
    "sala2": [
      {
        "title": "MISSÃO 06 — Saída do Programa",
        "desc": "O robô precisa exibir uma mensagem na tela. Qual comando usamos em Portugol?",
        "code": "___ (\"Sistema online!\")",
        "choices": [
          "imprima",
          "escreva",
          "mostre",
          "exiba"
        ],
        "correct": 1,
        "explanation": "\"escreva()\" é o comando do Portugol para exibir informações na tela."
      },
      {
        "title": "MISSÃO 07 — Comparação",
        "desc": "O sistema verifica se dois valores são iguais. Qual operador usar?",
        "code": "se nivel ___ 3 entao\n    subirNivel()",
        "choices": [
          "<-",
          "=>",
          "=",
          "<>"
        ],
        "correct": 2,
        "explanation": "\"=\" compara se dois valores são iguais em Portugol. \"<-\" atribui valor."
      },
      {
        "title": "MISSÃO 08 — Repetição com Condição",
        "desc": "O robô deve continuar patrulhando enquanto não encontrar um bug. Qual estrutura usar?",
        "code": "___ bugEncontrado = falso faca\n    patrulhar()",
        "choices": [
          "se",
          "para",
          "enquanto",
          "procedimento"
        ],
        "correct": 2,
        "explanation": "\"enquanto\" repete um bloco enquanto a condição for verdadeira."
      },
      {
        "title": "MISSÃO 09 — Tipo de Dado",
        "desc": "O nome do jogador é um texto. Qual tipo de dado representa texto em Portugol?",
        "code": "___ nome <- \"Igor\"\nescreva(nome)",
        "choices": [
          "inteiro",
          "real",
          "caractere",
          "logico"
        ],
        "correct": 2,
        "explanation": "\"caractere\" representa texto em Portugol."
      },
      {
        "title": "MISSÃO 10 — Valor Lógico",
        "desc": "O sistema precisa guardar se o jogador está ativo ou não. Qual valor representa verdadeiro?",
        "code": "logico ativo <- ___\nse ativo entao\n    jogar()",
        "choices": [
          "1",
          "sim",
          "verdadeiro",
          "true"
        ],
        "correct": 2,
        "explanation": "\"verdadeiro\" é o valor lógico verdadeiro em Portugol."
      }
    ],
    "sala3": [
      {
        "title": "MISSÃO 11 — Decisão Simples",
        "desc": "O sistema de quarentena só deve ativar se o risco for maior que 50. Qual estrutura completa o código?",
        "code": "___ risco > 50 entao\n    ativarQuarentena()\nfimse",
        "choices": [
          "se",
          "para",
          "enquanto",
          "funcao"
        ],
        "correct": 0,
        "explanation": "Usamos \"se\" quando o programa precisa tomar uma decisão com base em uma condição."
      },
      {
        "title": "MISSÃO 12 — Caminho Alternativo",
        "desc": "Se o acesso for negado, o sistema deve bloquear. Caso contrário, deve liberar. Qual palavra cria o caminho alternativo?",
        "code": "se acesso = falso entao\n    bloquear()\n___\n    liberar()\nfimse",
        "choices": [
          "senao",
          "enquanto",
          "para",
          "retorne"
        ],
        "correct": 0,
        "explanation": "\"senao\" define o que acontece quando a condição do \"se\" é falsa."
      },
      {
        "title": "MISSÃO 13 — Operador E",
        "desc": "A porta só libera se o cartão for válido e a senha estiver correta.",
        "code": "se cartaoValido = verdadeiro ___ senhaCorreta = verdadeiro entao\n    liberarPorta()\nfimse",
        "choices": [
          "ou",
          "e",
          "+",
          "<-"
        ],
        "correct": 1,
        "explanation": "O operador \"e\" exige que as duas condições sejam verdadeiras ao mesmo tempo."
      },
      {
        "title": "MISSÃO 14 — Operador OU",
        "desc": "O reator deve emitir alerta se a temperatura estiver alta ou se houver falha no núcleo.",
        "code": "se temperatura > 90 ___ falhaNucleo = verdadeiro entao\n    emitirAlerta()\nfimse",
        "choices": [
          "e",
          "ou",
          "*",
          "senao"
        ],
        "correct": 1,
        "explanation": "O operador \"ou\" executa a ação se pelo menos uma condição for verdadeira."
      },
      {
        "title": "MISSÃO 15 — Condição Correta",
        "desc": "Complete a condição para recuperar os dados apenas quando o backup estiver disponível.",
        "code": "se backupDisponivel = ___ entao\n    recuperarDados()\nfimse",
        "choices": [
          "\"verdadeiro\"",
          "verdadeiro",
          "10",
          "texto"
        ],
        "correct": 1,
        "explanation": "Em Portugol, verdadeiro é um valor lógico e não deve estar entre aspas."
      }
    ],
    "sala4": [
      {
        "title": "MISSÃO 16 — Criar Função",
        "desc": "A central precisa organizar a checagem de energia em uma função. Qual palavra inicia corretamente esse bloco?",
        "code": "___ verificarEnergia()\n    escreva(\"Energia verificada\")\nfimfuncao",
        "choices": [
          "funcao",
          "variavel",
          "enquanto",
          "senao"
        ],
        "correct": 0,
        "explanation": "Usamos \"funcao\" para criar um bloco reutilizável de comandos."
      },
      {
        "title": "MISSÃO 17 — Chamar Rotina",
        "desc": "A função ja foi criada. Qual comando executa verificarEnergia?",
        "code": "funcao verificarEnergia()\n    escreva(\"OK\")\nfimfuncao\n\n___",
        "choices": [
          "verificarEnergia()",
          "funcao verificarEnergia",
          "variavel verificarEnergia",
          "se verificarEnergia"
        ],
        "correct": 0,
        "explanation": "Para executar uma função, chamamos seu nome seguido de parênteses."
      },
      {
        "title": "MISSÃO 18 — Guardar Resultado",
        "desc": "O sistema precisa guardar a quantidade de falhas encontradas. Qual declaração está correta?",
        "code": "___ falhas <- 0",
        "choices": [
          "inteiro",
          "texto",
          "logico",
          "funcao"
        ],
        "correct": 0,
        "explanation": "Como falhas guarda uma quantidade numérica inteira, o tipo correto é inteiro."
      },
      {
        "title": "MISSÃO 19 — Usar Parâmetro",
        "desc": "A função deve receber o setor que será analisado. Qual chamada envia o valor \"ponte\"?",
        "code": "funcao analisarSetor(caractere setor)\n    escreva(setor)\nfimfuncao\n\n___",
        "choices": [
          "analisarSetor(\"ponte\")",
          "analisarSetor()",
          "funcao analisarSetor(\"ponte\")",
          "setor <- analisarSetor"
        ],
        "correct": 0,
        "explanation": "O valor enviado para uma função fica dentro dos parênteses da chamada."
      },
      {
        "title": "MISSÃO 20 — Função com Decisão",
        "desc": "Complete a decisão para chamar reparo() apenas se houver erro no sistema.",
        "code": "funcao verificarErro(logico erro)\n    se erro = ___ entao\n        reparo()\n    fimse\nfimfuncao",
        "choices": [
          "verdadeiro",
          "\"verdadeiro\"",
          "0",
          "texto"
        ],
        "correct": 0,
        "explanation": "verdadeiro é um valor lógico. Ele não deve ficar entre aspas."
      }
    ]
  },
  "medio": {
    "sala1": [
      {
        "title": "MISSÃO 01 — O que esse código faz?",
        "desc": "Leia o código abaixo. O que será exibido quando energia for 15?",
        "code": "inteiro energia <- 15\nse energia < 20 entao\n    escreva(\"Retornando\")\nsenao\n    escreva(\"Operando\")\nfimse",
        "choices": [
          "Operando",
          "Retornando",
          "Nada",
          "Erro"
        ],
        "correct": 1,
        "explanation": "Como energia 15 é menor que 20, a condição é verdadeira e exibe \"Retornando\"."
      },
      {
        "title": "MISSÃO 02 — Quantas vezes repete?",
        "desc": "Quantas vezes a função escanear() será chamada?",
        "code": "para i de 1 ate 3 faca\n    escanear(i)\n    escreva(i)\nfimpara",
        "choices": [
          "2 vezes",
          "3 vezes",
          "4 vezes",
          "1 vez"
        ],
        "correct": 1,
        "explanation": "\"para i de 1 ate 3\" executa 3 vezes."
      },
      {
        "title": "MISSÃO 03 — Resultado da operação",
        "desc": "Qual será o valor de resultado após executar o código?",
        "code": "inteiro x <- 10\ninteiro y <- 3\ninteiro resultado <- x + y * 2",
        "choices": [
          "26",
          "16",
          "13",
          "23"
        ],
        "correct": 1,
        "explanation": "Multiplicação vem antes da soma. y * 2 = 6, então 10 + 6 = 16."
      },
      {
        "title": "MISSÃO 04 — Condição composta",
        "desc": "Em quais casos o sistema vai executar alerta()?",
        "code": "se energia < 10 ou temperatura > 80 entao\n    alerta()\nfimse",
        "choices": [
          "Só se as duas forem verdadeiras",
          "Se energia < 10 OU temperatura > 80",
          "Nunca executa",
          "Sempre executa"
        ],
        "correct": 1,
        "explanation": "\"ou\" executa se qualquer uma das condições for verdadeira."
      },
      {
        "title": "MISSÃO 05 — Valor de retorno",
        "desc": "O que a função retorna quando chamada com dobrar(4)?",
        "code": "funcao inteiro dobrar(inteiro n)\n    retorne n * 2\nfimfuncao\n\nresultado <- dobrar(4)",
        "choices": [
          "4",
          "2",
          "8",
          "16"
        ],
        "correct": 2,
        "explanation": "A função multiplica n por 2. Com n = 4, retorna 8."
      }
    ],
    "sala2": [
      {
        "title": "MISSÃO 06 — Saída do loop",
        "desc": "Quais números serão impressos por esse código?",
        "code": "para i de 1 ate 4 faca\n    se i % 2 = 0 entao\n        escreva(i)\n    fimse\nfimpara",
        "choices": [
          "1, 3",
          "2, 4",
          "1, 2, 3, 4",
          "0, 2, 4"
        ],
        "correct": 1,
        "explanation": "2 e 4 são os números pares entre 1 e 4."
      },
      {
        "title": "MISSÃO 07 — Enquanto com contador",
        "desc": "Quantas vezes 'tick' será exibido?",
        "code": "inteiro cont <- 0\nenquanto cont < 3 faca\n    escreva(\"tick\")\n    cont <- cont + 1\nfimenquanto",
        "choices": [
          "2 vezes",
          "3 vezes",
          "4 vezes",
          "infinito"
        ],
        "correct": 1,
        "explanation": "cont assume 0, 1 e 2. Portanto, executa 3 vezes."
      },
      {
        "title": "MISSÃO 08 — Vetor e índice",
        "desc": "Qual valor será exibido?",
        "code": "caractere setores[4] <- {\"A\", \"B\", \"C\", \"D\"}\nescreva(setores[3])",
        "choices": [
          "A",
          "B",
          "C",
          "D"
        ],
        "correct": 2,
        "explanation": "Considerando índice inicial em 1, setores[3] é \"C\"."
      },
      {
        "title": "MISSÃO 09 — Função com condição",
        "desc": "O que a função retorna quando chamada com verificar(5)?",
        "code": "funcao caractere verificar(inteiro n)\n    se n > 10 entao\n        retorne \"alto\"\n    fimse\n    retorne \"baixo\"\nfimfuncao",
        "choices": [
          "alto",
          "baixo",
          "verdadeiro",
          "nulo"
        ],
        "correct": 1,
        "explanation": "5 não é maior que 10, então a função retorna \"baixo\"."
      },
      {
        "title": "MISSÃO 10 — Concatenação",
        "desc": "Qual será a saída do código?",
        "code": "caractere nome <- \"Bug\"\ncaractere tipo <- \"Hunter\"\nescreva(nome + \" \" + tipo)",
        "choices": [
          "BugHunter",
          "Bug Hunter",
          "nome tipo",
          "Erro"
        ],
        "correct": 1,
        "explanation": "O operador + junta textos. O resultado é \"Bug Hunter\"."
      }
    ],
    "sala3": [
      {
        "title": "MISSÃO 11 — Análise de Condição",
        "desc": "Com risco igual a 70, o que será executado?",
        "code": "inteiro risco <- 70\nse risco > 50 entao\n    escreva(\"Quarentena ativa\")\nsenao\n    escreva(\"Área segura\")\nfimse",
        "choices": [
          "Área segura",
          "Quarentena ativa",
          "Nada",
          "Erro de sintaxe"
        ],
        "correct": 1,
        "explanation": "Como 70 é maior que 50, a condição é verdadeira."
      },
      {
        "title": "MISSÃO 12 — Condição com E",
        "desc": "Quando o acesso será liberado?",
        "code": "se cartao = verdadeiro e senha = verdadeiro entao\n    liberar()\nfimse",
        "choices": [
          "Quando apenas o cartão for verdadeiro",
          "Quando apenas a senha for verdadeira",
          "Quando cartão e senha forem verdadeiros",
          "Sempre será liberado"
        ],
        "correct": 2,
        "explanation": "Com o operador \"e\", todas as condições precisam ser verdadeiras."
      },
      {
        "title": "MISSÃO 13 — Condição com OU",
        "desc": "Em qual caso o alerta será ativado?",
        "code": "se temperatura > 90 ou falha = verdadeiro entao\n    alerta()\nfimse",
        "choices": [
          "Somente se as duas forem verdadeiras",
          "Se pelo menos uma condição for verdadeira",
          "Nunca será ativado",
          "Apenas se temperatura for menor que 90"
        ],
        "correct": 1,
        "explanation": "Com \"ou\", basta uma das condições ser verdadeira."
      },
      {
        "title": "MISSÃO 14 — Fluxo Se/Senão",
        "desc": "Qual mensagem será exibida se energia for 3?",
        "code": "inteiro energia <- 3\nse energia < 5 entao\n    escreva(\"Recarregar\")\nsenao\n    escreva(\"Continuar\")\nfimse",
        "choices": [
          "Continuar",
          "Recarregar",
          "Ambas",
          "Nenhuma"
        ],
        "correct": 1,
        "explanation": "Como energia é menor que 5, executa o bloco do \"se\"."
      },
      {
        "title": "MISSÃO 15 — Decisão Encadeada",
        "desc": "Qual estrutura permite testar uma condição e depois uma alternativa?",
        "code": "se risco > 80 entao\n    alertaMaximo()\nsenao\n    verificarSistema()\nfimse",
        "choices": [
          "se/senao",
          "para",
          "funcao",
          "escreva"
        ],
        "correct": 0,
        "explanation": "A estrutura se/senao permite criar caminhos diferentes."
      }
    ],
    "sala4": [
      {
        "title": "MISSÃO 16 — Retorno da Função",
        "desc": "O que será exibido ao chamar calcularBonus(10)?",
        "code": "funcao inteiro calcularBonus(inteiro pontos)\n    retorne pontos + 5\nfimfuncao\n\nescreva(calcularBonus(10))",
        "choices": [
          "10",
          "15",
          "5",
          "Erro"
        ],
        "correct": 1,
        "explanation": "A função recebe 10, soma 5 e retorna 15."
      },
      {
        "title": "MISSÃO 17 — Variável Atualizada",
        "desc": "Após executar o código, qual será o valor de energia?",
        "code": "inteiro energia <- 20\nenergia <- energia - 5\nverificarEnergia(energia)",
        "choices": [
          "25",
          "20",
          "15",
          "5"
        ],
        "correct": 2,
        "explanation": "A variável começa em 20 e depois recebe 20 - 5, ficando com 15."
      },
      {
        "title": "MISSÃO 18 — Parâmetro Correto",
        "desc": "Qual assinatura permite receber um número inteiro chamado nivel?",
        "code": "___",
        "choices": [
          "funcao verificarNivel(inteiro nivel)",
          "funcao verificarNivel(caractere nivel)",
          "inteiro verificarNivel()",
          "chamar verificarNivel(nivel)"
        ],
        "correct": 0,
        "explanation": "O parâmetro precisa informar o tipo e o nome: inteiro nivel."
      },
      {
        "title": "MISSÃO 19 — Organizando Ações",
        "desc": "Qual trecho reutiliza corretamente uma função para recuperar dois setores?",
        "code": "funcao recuperar(caractere setor)\n    escreva(setor)\nfimfuncao\n\n___",
        "choices": [
          "recuperar(\"ponte\")\nrecuperar(\"motor\")",
          "funcao recuperar(\"ponte\")",
          "setor recuperar()",
          "recuperar <- \"ponte\""
        ],
        "correct": 0,
        "explanation": "Uma mesma função pode ser chamada várias vezes com valores diferentes."
      },
      {
        "title": "MISSÃO 20 — Integrando Conceitos",
        "desc": "Com energia = 12 e ativo = verdadeiro, o que a função deve retornar?",
        "code": "funcao logico podeAtivar(inteiro energia, logico ativo)\n    se energia > 10 e ativo = verdadeiro entao\n        retorne verdadeiro\n    senao\n        retorne falso\n    fimse\nfimfuncao",
        "choices": [
          "verdadeiro",
          "falso",
          "12",
          "ativo"
        ],
        "correct": 0,
        "explanation": "As duas condições são verdadeiras, então a função retorna verdadeiro."
      }
    ]
  },
  "dificil": {
    "sala1": [
      {
        "title": "MISSÃO 01 — Encontre o Bug",
        "desc": "O código abaixo tem um erro. Qual linha está errada?",
        "code": "funcao inteiro somar(inteiro a, inteiro b)\n    inteiro resultado <- a + b\n    Retorne resultado\nfimfuncao",
        "choices": [
          "funcao inteiro somar(inteiro a, inteiro b)",
          "inteiro resultado <- a + b",
          "\"Retorne\" deveria ser \"retorne\"",
          "Não há erro"
        ],
        "correct": 2,
        "explanation": "\"Retorne\" com R maiúsculo está incorreto. O correto é \"retorne\"."
      },
      {
        "title": "MISSÃO 02 — Loop Infinito",
        "desc": "Por que esse código entra em loop infinito?",
        "code": "inteiro cont <- 0\nenquanto cont < 5 faca\n    escreva(cont)\nfimenquanto",
        "choices": [
          "O intervalo não foi definido",
          "cont nunca é incrementado",
          "enquanto deveria ser para",
          "escreva() causa o loop"
        ],
        "correct": 1,
        "explanation": "cont nunca aumenta, então a condição cont < 5 nunca fica falsa."
      },
      {
        "title": "MISSÃO 03 — Erro de Índice",
        "desc": "O que acontece ao executar esse código?",
        "code": "inteiro lista[3] <- {10, 20, 30}\nescreva(lista[4])",
        "choices": [
          "Exibe 30",
          "Exibe nulo",
          "Gera erro de índice inválido",
          "Exibe 0"
        ],
        "correct": 2,
        "explanation": "O vetor possui apenas 3 posições. Acessar lista[4] gera erro."
      },
      {
        "title": "MISSÃO 04 — Escopo de Variável",
        "desc": "O que será exibido ao executar esse código?",
        "code": "inteiro x <- 10\n\nprocedimento alterar()\n    inteiro x <- 99\nfimprocedimento\n\nalterar()\nescreva(x)",
        "choices": [
          "99",
          "10",
          "nulo",
          "Erro"
        ],
        "correct": 1,
        "explanation": "O x dentro do procedimento é local. O x externo continua valendo 10."
      },
      {
        "title": "MISSÃO 05 — Lógica Invertida",
        "desc": "O código deveria exibir apenas números ímpares. Qual é o problema?",
        "code": "para i de 1 ate 7 faca\n    se i % 2 = 0 entao\n        escreva(i)\n    fimse\nfimpara",
        "choices": [
          "O intervalo está errado",
          "Deveria ser i % 2 <> 0",
          "Deveria ser i % 2 = 1",
          "Não há problema"
        ],
        "correct": 1,
        "explanation": "i % 2 = 0 seleciona pares. Para ímpares, use i % 2 <> 0."
      }
    ],
    "sala2": [
      {
        "title": "MISSÃO 06 — Recursão",
        "desc": "O que a função retorna quando chamada com fatorial(3)?",
        "code": "funcao inteiro fatorial(inteiro n)\n    se n = 0 entao\n        retorne 1\n    fimse\n    retorne n * fatorial(n - 1)\nfimfuncao",
        "choices": [
          "3",
          "6",
          "9",
          "1"
        ],
        "correct": 1,
        "explanation": "fatorial(3) = 3 * 2 * 1 = 6."
      },
      {
        "title": "MISSÃO 07 — Erro de Atribuição",
        "desc": "O código tenta comparar x com 5, mas tem um erro. Qual é?",
        "code": "inteiro x <- 10\nse x <- 5 entao\n    escreva(\"igual\")\nfimse",
        "choices": [
          "escreva está errado",
          "\"<-\" deveria ser \"=\"",
          "x não foi declarado",
          "Não há erro"
        ],
        "correct": 1,
        "explanation": "Dentro do se, use comparação. \"<-\" é atribuição."
      },
      {
        "title": "MISSÃO 08 — Registro",
        "desc": "Como acessar o campo nome em um registro em Portugol?",
        "code": "tipo Jogador\n    caractere nome\n    inteiro nivel\nfimtipo\n\nJogador jogador\njogador.nome <- \"Igor\"\nescreva(___)",
        "choices": [
          "jogador[\"nome\"]",
          "jogador.nome",
          "jogador(nome)",
          "jogador->nome"
        ],
        "correct": 1,
        "explanation": "Campos de registro são acessados com ponto: jogador.nome."
      },
      {
        "title": "MISSÃO 09 — Tratamento de Erro",
        "desc": "Qual é a forma correta de evitar erro ao receber um valor inválido?",
        "code": "funcao inteiro converter(caractere valor)\n    se ___\n        retorne inteiro(valor)\n    senao\n        escreva(\"Valor invalido\")\n        retorne 0\n    fimse\nfimfuncao",
        "choices": [
          "sempre verdadeiro entao",
          "valor <> \"\" e ehNumero(valor) entao",
          "valor = 0 entao",
          "nao verdadeiro entao"
        ],
        "correct": 1,
        "explanation": "Antes de converter, verifique se o valor não está vazio e é numérico."
      },
      {
        "title": "MISSÃO 10 — Vetor Dinâmico",
        "desc": "O que o vetor quadrados vai conter após o código?",
        "code": "inteiro quadrados[3]\npara i de 1 ate 3 faca\n    quadrados[i] <- i * i\nfimpara",
        "choices": [
          "[1, 2, 3]",
          "[1, 4, 9]",
          "[2, 4, 6]",
          "[0, 1, 4]"
        ],
        "correct": 1,
        "explanation": "1² = 1, 2² = 4 e 3² = 9."
      }
    ],
    "sala3": [
      {
        "title": "MISSÃO 11 — Correção de Fluxo",
        "desc": "O sistema só deve ativar a quarentena se risco for alto e o setor estiver contaminado.",
        "code": "se risco > 70 ___ contaminado = verdadeiro entao\n    ativarQuarentena()\nfimse",
        "choices": [
          "ou",
          "e",
          "senao",
          "<-"
        ],
        "correct": 1,
        "explanation": "Como as duas condições são obrigatórias, o operador correto é \"e\"."
      },
      {
        "title": "MISSÃO 12 — Falha na Condição",
        "desc": "Qual é o problema neste código?",
        "code": "se energia <- 10 entao\n    recarregar()\nfimse",
        "choices": [
          "O correto seria usar comparação, não atribuição",
          "O comando recarregar está errado",
          "A variável energia não pode ser número",
          "O fimse deveria vir antes"
        ],
        "correct": 0,
        "explanation": "\"<-\" atribui valor. Para testar uma condição, use comparação."
      },
      {
        "title": "MISSÃO 13 — Condição Composta",
        "desc": "Qual condição libera o acesso se o usuário for admin ou se tiver autorização?",
        "code": "se admin = verdadeiro ___ autorizado = verdadeiro entao\n    liberarAcesso()\nfimse",
        "choices": [
          "e",
          "ou",
          "+",
          "senao"
        ],
        "correct": 1,
        "explanation": "Como existem duas possibilidades de liberação, usamos \"ou\"."
      },
      {
        "title": "MISSÃO 14 — Interpretação de Código",
        "desc": "Com energia = 6 e ativo = falso, o que acontece?",
        "code": "se energia > 5 e ativo = verdadeiro entao\n    iniciar()\nsenao\n    bloquear()\nfimse",
        "choices": [
          "iniciar()",
          "bloquear()",
          "os dois comandos",
          "nenhum comando"
        ],
        "correct": 1,
        "explanation": "Com \"e\", tudo precisa ser verdadeiro. Como ativo é falso, executa o senao."
      },
      {
        "title": "MISSÃO 15 — Condição Encadeada",
        "desc": "Qual trecho representa melhor uma decisão com alternativa?",
        "code": "Se risco alto, isolar. Senão, monitorar.",
        "choices": [
          "se risco > 80 entao\n    isolar()\nsenao\n    monitorar()\nfimse",
          "para risco de 1 ate 80 faca\n    isolar()\nfimpara",
          "funcao risco()\n    monitorar()\nfimfuncao",
          "escreva(risco)"
        ],
        "correct": 0,
        "explanation": "A estrutura se/senao é ideal quando existem dois caminhos possíveis."
      }
    ],
    "sala4": [
      {
        "title": "MISSÃO 16 — Bug na Função",
        "desc": "A função deveria devolver um valor inteiro, mas há um erro. Qual linha precisa ser corrigida?",
        "code": "funcao inteiro totalizar(inteiro a, inteiro b)\n    inteiro total <- a + b\n    escreva(total)\nfimfuncao",
        "choices": [
          "Trocar escreva(total) por retorne total",
          "Remover os parâmetros",
          "Trocar inteiro por caractere",
          "Não há erro"
        ],
        "correct": 0,
        "explanation": "Uma função inteira deve retornar um valor. escreva apenas exibe na tela."
      },
      {
        "title": "MISSÃO 17 — Escopo de Variável",
        "desc": "Qual valor será exibido no final?",
        "code": "inteiro energia <- 50\n\nfuncao inteiro ajustar()\n    inteiro energia <- 10\n    retorne energia\nfimfuncao\n\najustar()\nescreva(energia)",
        "choices": [
          "10",
          "50",
          "60",
          "Erro"
        ],
        "correct": 1,
        "explanation": "A energia criada dentro da função é local. A variável externa continua valendo 50."
      },
      {
        "title": "MISSÃO 18 — Parâmetros Invertidos",
        "desc": "A chamada comparar(3, 8) retorna o quê?",
        "code": "funcao caractere comparar(inteiro minimo, inteiro valor)\n    se valor >= minimo entao\n        retorne \"ok\"\n    senao\n        retorne \"falha\"\n    fimse\nfimfuncao",
        "choices": [
          "ok",
          "falha",
          "3",
          "8"
        ],
        "correct": 0,
        "explanation": "valor recebe 8 e minimo recebe 3. Como 8 >= 3, o retorno é \"ok\"."
      },
      {
        "title": "MISSÃO 19 — Reutilização com Condição",
        "desc": "Qual correção evita repetir o mesmo cálculo em dois lugares?",
        "code": "se setorA > 80 entao\n    alerta(setorA + 10)\nfimse\nse setorB > 80 entao\n    alerta(setorB + 10)\nfimse",
        "choices": [
          "Criar uma função avaliarSetor(valor)",
          "Remover os dois se",
          "Trocar + por -",
          "Usar texto no lugar dos números"
        ],
        "correct": 0,
        "explanation": "Uma função com parâmetro permite reaproveitar a mesma regra para setorA e setorB."
      },
      {
        "title": "MISSÃO 20 — Falha Final da Central",
        "desc": "Qual alternativa corrige a função para retornar verdadeiro somente quando todos os sistemas estiverem prontos?",
        "code": "funcao logico liberarPonte(logico motor, logico energia, logico rota)\n    se motor = verdadeiro ___ energia = verdadeiro ___ rota = verdadeiro entao\n        retorne verdadeiro\n    senao\n        retorne falso\n    fimse\nfimfuncao",
        "choices": [
          "e / e",
          "ou / ou",
          "e / ou",
          "ou / e"
        ],
        "correct": 0,
        "explanation": "Como todos os sistemas precisam estar prontos, as condições devem ser ligadas por \"e\"."
      }
    ]
  }
};
