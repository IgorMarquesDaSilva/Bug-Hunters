const GLOSSARY_DATA = {
    fase1: {
      title: "Fase 1 — Tipos de Dados",
      intro: "Programas trabalham com informações. Cada informação tem um tipo: número, texto ou lógico.",
      topics: [
        {
          title: "Número",
          text: "Número é usado para contas, pontuação, energia, vidas e quantidades.",
          code: `energia <- 10
  vidas <- 3
  pontos <- 0`,
          warning: `Não coloque aspas em números.
  
  Errado:
  energia <- "10"
  
  Certo:
  energia <- 10`,
          tip: "Se você precisa fazer conta com o valor, ele deve ser número."
        },
        {
          title: "Texto",
          text: "Texto representa palavras, frases e mensagens. Em Portugol, normalmente aparece entre aspas.",
          code: `nome <- "Bug Hunter"
  mensagem <- "Sistema restaurado"`,
          warning: `Esquecer as aspas transforma o texto em erro.`,
          tip: "Se for palavra ou frase, use aspas."
        },
        {
          title: "Lógico",
          text: "O tipo lógico representa verdadeiro ou falso.",
          code: `ativo <- verdadeiro
  bugCorrigido <- falso`,
          warning: `verdadeiro e falso não são textos. Não use aspas.`,
          tip: "Use lógico quando a resposta for sim/não."
        },
        {
          title: "Atribuição",
          text: "Atribuir é guardar um valor dentro de uma variável.",
          code: `energia <- 50
  nome <- "Núcleo"
  ativo <- verdadeiro`,
          warning: `Não confunda guardar valor com comparar valores.`,
          tip: "Em Portugol, pense no símbolo <- como 'recebe'."
        }
      ]
    },
  
    fase2: {
      title: "Fase 2 — Operadores",
      intro: "Operadores servem para calcular, comparar e testar valores.",
      topics: [
        {
          title: "Operadores Matemáticos",
          text: "São usados para fazer contas.",
          code: `soma <- 8 + 2
  subtracao <- 10 - 3
  multiplicacao <- 4 * 2
  divisao <- 8 / 2`,
          warning: `A ordem das operações importa. Multiplicação e divisão vêm antes de soma e subtração.`,
          tip: "Use parênteses quando quiser controlar a ordem."
        },
        {
          title: "Comparação",
          text: "Comparações verificam se uma condição é verdadeira ou falsa.",
          code: `energia == 10
  vidas > 0
  temperatura < 100`,
          warning: `= ou <- guarda valor. == compara valor.`,
          tip: "Se a pergunta for 'é igual?', use ==."
        },
        {
          title: "Maior e Menor",
          text: "Use > para maior e < para menor.",
          code: `energia > 10
  temperatura < 80`,
          warning: `Não inverta o sinal. energia > 10 significa energia maior que 10.`,
          tip: "A boca do sinal aponta para o maior valor."
        }
      ]
    },
  
    fase3: {
      title: "Fase 3 — Condições",
      intro: "Condições fazem o programa tomar decisões.",
      topics: [
        {
          title: "Se",
          text: "O bloco se executa uma ação apenas quando a condição é verdadeira.",
          code: `se energia > 10 entao
    ativarSistema()
  fimse`,
          warning: `A condição precisa resultar em verdadeiro ou falso.`,
          tip: "Leia como: se isso for verdade, faça aquilo."
        },
        {
          title: "Senão",
          text: "O senão executa uma alternativa quando a condição do se é falsa.",
          code: `se energia < 5 entao
    recarregar()
  senao
    continuar()
  fimse`,
          warning: `O senão não precisa de nova condição.`,
          tip: "Use senão para o caminho alternativo."
        },
        {
          title: "E",
          text: "O operador e exige que as duas condições sejam verdadeiras.",
          code: `se energia > 10 e ativo == verdadeiro entao
    ativarSistema()
  fimse`,
          warning: `Se uma das partes for falsa, tudo fica falso.`,
          tip: "Use e quando duas coisas precisam acontecer ao mesmo tempo."
        },
        {
          title: "Ou",
          text: "O operador ou aceita que apenas uma das condições seja verdadeira.",
          code: `se senhaCorreta == verdadeiro ou acessoAdmin == verdadeiro entao
    liberarAcesso()
  fimse`,
          warning: `Com ou, basta uma condição ser verdadeira.`,
          tip: "Use ou quando existe mais de uma forma de liberar a ação."
        }
      ]
    },
  
    fase4: {
      title: "Fase 4 — Funções e Variáveis",
      intro: "Funções ajudam a organizar e reutilizar comandos.",
      topics: [
        {
          title: "Função",
          text: "Função é um bloco de comandos que recebe um nome e pode ser usado várias vezes.",
          code: `funcao verificarEnergia()
    escreva("Verificando energia")
  fimfuncao`,
          warning: `Criar uma função não significa executá-la automaticamente.`,
          tip: "Função é como uma ferramenta guardada para usar depois."
        },
        {
          title: "Chamar Função",
          text: "Chamar uma função é mandar ela executar.",
          code: `verificarEnergia()`,
          warning: `Se você só cria a função e não chama, nada acontece.`,
          tip: "Procure comandos como chamar, executar ou o nome da função com ()."
        },
        {
          title: "Parâmetro",
          text: "Parâmetro é uma informação enviada para a função usar.",
          code: `funcao somarEnergia(valor)
    energia <- energia + valor
  fimfuncao
  
  somarEnergia(10)`,
          warning: `O valor enviado precisa fazer sentido para a função.`,
          tip: "Parâmetro é o dado que a função recebe."
        },
        {
          title: "Reutilização",
          text: "Funções evitam repetir o mesmo código em vários lugares.",
          code: `funcao corrigirBug()
    desligarErro()
    atualizarSistema()
  fimfuncao`,
          warning: `Código repetido demais fica difícil de corrigir.`,
          tip: "Se uma sequência aparece várias vezes, ela provavelmente pode virar função."
        }
      ]
    }
  };