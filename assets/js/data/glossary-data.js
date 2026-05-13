const GLOSSARY_DATA = {
  fase1: {
    title: "Fase 1 — Tipos de Dados e Variáveis",
    intro: "Nesta fase você aprende como um programa guarda informações. Em Portugol, cada informação precisa ter um tipo correto.",
    categories: [
      {
        title: "1. Variáveis",
        description: "Variáveis são espaços na memória usados para guardar valores durante a execução do programa.",
        topics: [
          {
            title: "O que é uma variável?",
            text: "Uma variável funciona como uma caixa com nome. Dentro dela você guarda um valor para usar depois.",
            code: `inteiro energia <- 100
caractere nome <- "Bug Hunter"
logico sistemaAtivo <- verdadeiro`,
            output: `energia guarda 100
nome guarda "Bug Hunter"
sistemaAtivo guarda verdadeiro`,
            wrong: `Criar uma variável sem tipo.

Errado:
energia <- 100

Certo:
inteiro energia <- 100`,
            tip: "Sempre pense: qual tipo de informação eu quero guardar?",
            missions: "Missões 01, 03 e 10"
          },
          {
            title: "Atribuição com <-",
            text: "O operador <- significa recebe. Ele guarda um valor dentro de uma variável.",
            code: `inteiro pontos <- 0
pontos <- pontos + 5`,
            output: `pontos começa com 0
depois passa a valer 5`,
            wrong: `Confundir atribuição com comparação.

Errado em uma condição:
se pontos <- 5 entao

Certo:
se pontos = 5 entao`,
            tip: "Use <- para guardar valor. Use = para comparar.",
            missions: "Missões 03, 07 e 12"
          }
        ]
      },
      {
        title: "2. Tipos de Dados",
        description: "Tipos de dados indicam que tipo de valor uma variável pode guardar.",
        topics: [
          {
            title: "Inteiro",
            text: "O tipo inteiro guarda números sem casas decimais. É usado para vidas, pontos, níveis, contadores e quantidades.",
            code: `inteiro vidas <- 3
inteiro bugs <- 0
inteiro nivel <- 2`,
            output: `3
0
2`,
            wrong: `Colocar número entre aspas.

Errado:
inteiro vidas <- "3"

Certo:
inteiro vidas <- 3`,
            tip: "Se o valor serve para contar ou calcular, provavelmente é inteiro.",
            missions: "Missões 03, 06, 07 e 10"
          },
          {
            title: "Real",
            text: "O tipo real guarda números com casas decimais.",
            code: `real temperatura <- 36.5
real velocidade <- 2.75`,
            output: `36.5
2.75`,
            wrong: `Usar inteiro quando precisa de decimal.

Errado:
inteiro temperatura <- 36.5

Certo:
real temperatura <- 36.5`,
            tip: "Use real quando o número pode ter vírgula ou ponto decimal.",
            missions: "Aparece em desafios de energia, temperatura e cálculo."
          },
          {
            title: "Caractere",
            text: "O tipo caractere representa textos, palavras, nomes e mensagens. Normalmente o texto fica entre aspas.",
            code: `caractere nome <- "Igor"
caractere setor <- "Laboratorio"
caractere mensagem <- "Sistema online"`,
            output: `Igor
Laboratorio
Sistema online`,
            wrong: `Esquecer as aspas.

Errado:
caractere nome <- Igor

Certo:
caractere nome <- "Igor"`,
            tip: "Se for palavra, frase ou mensagem, use aspas.",
            missions: "Missões 09 e 10"
          },
          {
            title: "Lógico",
            text: "O tipo lógico guarda apenas dois valores: verdadeiro ou falso. Ele é usado em decisões.",
            code: `logico ativo <- verdadeiro
logico bugEncontrado <- falso`,
            output: `ativo está verdadeiro
bugEncontrado está falso`,
            wrong: `Colocar verdadeiro ou falso entre aspas.

Errado:
logico ativo <- "verdadeiro"

Certo:
logico ativo <- verdadeiro`,
            tip: "Use lógico quando a resposta for sim/não, ligado/desligado ou verdadeiro/falso.",
            missions: "Missões 04, 10, 12, 13 e 15"
          }
        ]
      },
      {
        title: "3. Leitura e Escrita",
        description: "Programas também podem mostrar informações na tela ou receber dados do usuário.",
        topics: [
          {
            title: "Comando escreva",
            text: "O comando escreva mostra uma mensagem ou valor na tela.",
            code: `escreva("Sistema online")
escreva(energia)`,
            output: `Sistema online
100`,
            wrong: `Tentar mostrar texto sem aspas.

Errado:
escreva(Sistema online)

Certo:
escreva("Sistema online")`,
            tip: "Texto direto precisa de aspas. Variável não precisa.",
            missions: "Missões 06 e 10"
          }
        ]
      }
    ]
  },

  fase2: {
    title: "Fase 2 — Operadores",
    intro: "Nesta fase você aprende a calcular, comparar valores e montar expressões em Portugol.",
    categories: [
      {
        title: "1. Operadores Aritméticos",
        description: "Operadores aritméticos são usados para fazer contas.",
        topics: [
          {
            title: "Soma, subtração, multiplicação e divisão",
            text: "Esses operadores funcionam como na matemática.",
            code: `inteiro soma <- 8 + 2
inteiro subtracao <- 10 - 3
inteiro multiplicacao <- 4 * 2
inteiro divisao <- 8 / 2`,
            output: `soma = 10
subtracao = 7
multiplicacao = 8
divisao = 4`,
            wrong: `Confundir símbolo de multiplicação.

Errado:
resultado <- 4 x 2

Certo:
resultado <- 4 * 2`,
            tip: "Em programação, multiplicação usa * e divisão usa /.",
            missions: "Missões 03, 05 e 10"
          },
          {
            title: "Prioridade das operações",
            text: "Multiplicação e divisão acontecem antes de soma e subtração.",
            code: `inteiro resultado <- 10 + 3 * 2`,
            output: `resultado = 16`,
            wrong: `Achar que o código será lido apenas da esquerda para direita.

10 + 3 * 2 não é 26.
Primeiro faz 3 * 2, depois soma 10.`,
            tip: "Use parênteses quando quiser deixar a ordem mais clara.",
            missions: "Missão 03"
          },
          {
            title: "Resto da divisão",
            text: "O operador % retorna o resto de uma divisão. Ele é muito usado para verificar números pares e ímpares.",
            code: `se numero % 2 = 0 entao
    escreva("Par")
senao
    escreva("Impar")
fimse`,
            output: `Se numero for 4: Par
Se numero for 5: Impar`,
            wrong: `Confundir divisão com resto.

8 / 2 resulta 4.
8 % 2 resulta 0.`,
            tip: "Se o resto da divisão por 2 for 0, o número é par.",
            missions: "Missões 06 e 05 do modo difícil"
          }
        ]
      },
      {
        title: "2. Operadores Relacionais",
        description: "São usados para comparar valores. O resultado sempre será verdadeiro ou falso.",
        topics: [
          {
            title: "Igualdade",
            text: "Em Portugol, o sinal = pode ser usado para comparar valores dentro de condições.",
            code: `se nivel = 3 entao
    subirNivel()
fimse`,
            output: `Se nivel for 3, subirNivel() executa.`,
            wrong: `Confundir comparação com atribuição.

Atribuição:
nivel <- 3

Comparação:
nivel = 3`,
            tip: "Dentro de uma condição, = testa se os valores são iguais.",
            missions: "Missões 07 e 12"
          },
          {
            title: "Maior e menor",
            text: "Use > para maior que, < para menor que, >= para maior ou igual, <= para menor ou igual.",
            code: `se energia < 20 entao
    retornarBase()
fimse

se temperatura > 90 entao
    emitirAlerta()
fimse`,
            output: `As ações executam apenas se as condições forem verdadeiras.`,
            wrong: `Inverter o sinal.

energia < 20 significa energia menor que 20.
energia > 20 significa energia maior que 20.`,
            tip: "A abertura do sinal sempre fica para o maior valor.",
            missions: "Missões 01, 04, 11 e 14"
          },
          {
            title: "Diferente",
            text: "O operador <> significa diferente.",
            code: `se senha <> "admin" entao
    bloquear()
fimse`,
            output: `Se senha for diferente de "admin", bloqueia.`,
            wrong: `Usar != em vez de <> quando o padrão esperado da aula é Portugol.`,
            tip: "Em Portugol, use <> para diferente.",
            missions: "Missões de comparação e validação."
          }
        ]
      },
      {
        title: "3. Operadores Lógicos",
        description: "Operadores lógicos combinam condições.",
        topics: [
          {
            title: "Operador e",
            text: "O operador e exige que todas as condições sejam verdadeiras.",
            code: `se energia > 10 e sistemaAtivo = verdadeiro entao
    continuar()
fimse`,
            output: `Só continua se energia > 10 e sistemaAtivo for verdadeiro.`,
            wrong: `Usar e quando apenas uma condição já deveria bastar.`,
            tip: "Use e quando tudo precisa acontecer ao mesmo tempo.",
            missions: "Missões 04, 12 e 13"
          },
          {
            title: "Operador ou",
            text: "O operador ou executa se pelo menos uma condição for verdadeira.",
            code: `se temperatura > 90 ou falha = verdadeiro entao
    alerta()
fimse`,
            output: `Se qualquer uma das condições for verdadeira, alerta() executa.`,
            wrong: `Achar que ou exige as duas condições. Quem exige as duas é o e.`,
            tip: "Use ou quando existem caminhos alternativos.",
            missions: "Missões 04, 13 e 14"
          }
        ]
      }
    ]
  },

  fase3: {
    title: "Fase 3 — Condições e Decisões",
    intro: "Nesta fase você aprende como o programa toma decisões usando se, senao e condições compostas.",
    categories: [
      {
        title: "1. Estrutura Se",
        description: "A estrutura se executa um bloco de comandos apenas quando uma condição é verdadeira.",
        topics: [
          {
            title: "Como funciona o se",
            text: "O se é usado quando o programa precisa decidir se uma ação deve acontecer.",
            code: `se risco > 50 entao
    ativarQuarentena()
fimse`,
            output: `Se risco for maior que 50, a quarentena será ativada.`,
            wrong: `Criar um se sem condição.

Errado:
se entao
    ativar()
fimse

Certo:
se risco > 50 entao
    ativar()
fimse`,
            tip: "Leia como: se isso for verdade, faça aquilo.",
            missions: "Missões 11 e 15"
          },
          {
            title: "Condição verdadeira ou falsa",
            text: "Toda condição precisa gerar um resultado lógico: verdadeiro ou falso.",
            code: `inteiro energia <- 3

se energia < 5 entao
    escreva("Recarregar")
fimse`,
            output: `Recarregar`,
            wrong: `Usar um valor solto como condição sem comparação.`,
            tip: "Pergunte: essa frase pode ser respondida com verdadeiro ou falso?",
            missions: "Missões 11, 12 e 14"
          }
        ]
      },
      {
        title: "2. Estrutura Senao",
        description: "O senao cria um caminho alternativo quando a condição do se é falsa.",
        topics: [
          {
            title: "Quando usar senao",
            text: "Use senao quando existir uma ação alternativa.",
            code: `se energia < 5 entao
    recarregar()
senao
    continuar()
fimse`,
            output: `Se energia < 5: recarregar()
Caso contrário: continuar()`,
            wrong: `Colocar condição no senao.

Errado:
senao energia >= 5

Certo:
senao`,
            tip: "O senao significa caso contrário.",
            missions: "Missões 12, 14 e 15"
          },
          {
            title: "Fluxo de decisão",
            text: "Em um se/senao, apenas um dos blocos será executado.",
            code: `se acesso = falso entao
    bloquear()
senao
    liberar()
fimse`,
            output: `Se acesso for falso: bloquear.
Se não for falso: liberar.`,
            wrong: `Achar que os dois blocos podem executar ao mesmo tempo.`,
            tip: "O programa escolhe um caminho.",
            missions: "Missões 12 e 15"
          }
        ]
      },
      {
        title: "3. Condições Compostas",
        description: "Condições compostas unem duas ou mais verificações.",
        topics: [
          {
            title: "Usando e",
            text: "Use e quando todas as condições precisam ser verdadeiras.",
            code: `se cartaoValido = verdadeiro e senhaCorreta = verdadeiro entao
    liberarPorta()
fimse`,
            output: `Só libera se cartão e senha estiverem corretos.`,
            wrong: `Se uma condição for falsa, tudo será falso.`,
            tip: "e é mais restritivo.",
            missions: "Missões 13 e 14"
          },
          {
            title: "Usando ou",
            text: "Use ou quando qualquer uma das condições pode liberar a ação.",
            code: `se admin = verdadeiro ou autorizado = verdadeiro entao
    liberarAcesso()
fimse`,
            output: `Libera se admin for verdadeiro ou autorizado for verdadeiro.`,
            wrong: `Usar e quando o objetivo era aceitar uma das opções.`,
            tip: "ou é mais flexível.",
            missions: "Missões 13 e 14"
          },
          {
            title: "Condição aninhada",
            text: "Uma condição aninhada é um se dentro de outro se.",
            code: `se energia > 10 entao
    se sistemaAtivo = verdadeiro entao
        iniciar()
    fimse
fimse`,
            output: `Só inicia se as duas verificações passarem.`,
            wrong: `Esquecer o fimse de cada bloco.`,
            tip: "Cada se precisa ter seu próprio fimse.",
            missions: "Missões avançadas de lógica."
          }
        ]
      }
    ]
  },

  fase4: {
    title: "Fase 4 — Funções, Procedimentos e Organização",
    intro: "Nesta fase você aprende a organizar comandos em blocos reutilizáveis.",
    categories: [
      {
        title: "1. Procedimentos",
        description: "Procedimentos executam comandos, mas não devolvem um valor.",
        topics: [
          {
            title: "Criando procedimento",
            text: "Use procedimento quando quiser agrupar comandos que executam uma ação.",
            code: `procedimento verificarErro()
    escreva("Verificando erro")
fimprocedimento`,
            output: `Verificando erro`,
            wrong: `Criar procedimento e achar que ele executa sozinho.`,
            tip: "Depois de criar, você precisa chamar o procedimento.",
            missions: "Missão 05"
          },
          {
            title: "Chamando procedimento",
            text: "Chamar um procedimento significa mandar ele executar.",
            code: `verificarErro()`,
            output: `Executa os comandos dentro do procedimento.`,
            wrong: `Esquecer os parênteses na chamada.`,
            tip: "Nome seguido de () geralmente indica chamada.",
            missions: "Missões de funções e organização."
          }
        ]
      },
      {
        title: "2. Funções",
        description: "Funções executam comandos e podem devolver um valor com retorne.",
        topics: [
          {
            title: "Criando função com retorno",
            text: "Use função quando precisar calcular ou devolver um resultado.",
            code: `funcao inteiro dobrar(inteiro n)
    retorne n * 2
fimfuncao`,
            output: `dobrar(4) retorna 8`,
            wrong: `Criar função sem retorne quando ela deveria devolver valor.`,
            tip: "Se a função tem tipo, normalmente precisa retornar algo.",
            missions: "Missões 05, 09 e 10"
          },
          {
            title: "Parâmetros",
            text: "Parâmetros são valores enviados para uma função ou procedimento.",
            code: `funcao inteiro somar(inteiro a, inteiro b)
    retorne a + b
fimfuncao

resultado <- somar(3, 5)`,
            output: `resultado = 8`,
            wrong: `Chamar a função com quantidade errada de valores.`,
            tip: "Parâmetro é o dado que entra na função.",
            missions: "Missões sobre função e cálculo."
          },
          {
            title: "Retorno",
            text: "O comando retorne envia um valor de volta para quem chamou a função.",
            code: `funcao caractere verificar(inteiro n)
    se n > 10 entao
        retorne "alto"
    fimse

    retorne "baixo"
fimfuncao`,
            output: `verificar(5) retorna "baixo"`,
            wrong: `Escrever Retorne com letra maiúscula se o ambiente exigir minúsculo.`,
            tip: "retorne finaliza a função e devolve um valor.",
            missions: "Missões 01 e 09 do modo difícil"
          }
        ]
      },
      {
        title: "3. Escopo e Reutilização",
        description: "Escopo define onde uma variável existe. Reutilização evita repetir código.",
        topics: [
          {
            title: "Variável local",
            text: "Uma variável criada dentro de uma função ou procedimento só existe ali dentro.",
            code: `inteiro x <- 10

procedimento alterar()
    inteiro x <- 99
fimprocedimento

alterar()
escreva(x)`,
            output: `10`,
            wrong: `Achar que o x local altera o x de fora.`,
            tip: "Variável dentro de procedimento é local.",
            missions: "Missão 04 do modo difícil"
          },
          {
            title: "Reutilização de código",
            text: "Se um conjunto de comandos aparece várias vezes, ele pode virar função ou procedimento.",
            code: `procedimento corrigirBug()
    desligarErro()
    atualizarSistema()
    registrarLog()
fimprocedimento`,
            output: `O mesmo bloco pode ser usado em várias partes do programa.`,
            wrong: `Copiar e colar o mesmo código várias vezes.`,
            tip: "Código repetido é sinal de que pode virar procedimento.",
            missions: "Missões finais e desafios avançados."
          }
        ]
      },
      {
        title: "4. Vetores e Registros",
        description: "Estruturas que permitem guardar vários dados ou dados organizados.",
        topics: [
          {
            title: "Vetor",
            text: "Vetor guarda vários valores do mesmo tipo em uma única estrutura.",
            code: `inteiro numeros[3] <- {10, 20, 30}
escreva(numeros[2])`,
            output: `20`,
            wrong: `Acessar uma posição que não existe.

numeros[4] não existe em um vetor de 3 posições.`,
            tip: "Sempre confira o tamanho do vetor.",
            missions: "Missões 03, 08 e 10 do modo médio/difícil"
          },
          {
            title: "Registro",
            text: "Registro agrupa vários campos relacionados em uma mesma estrutura.",
            code: `tipo Jogador
    caractere nome
    inteiro nivel
fimtipo

Jogador jogador
jogador.nome <- "Igor"
jogador.nivel <- 3`,
            output: `jogador.nome = "Igor"
jogador.nivel = 3`,
            wrong: `Tentar acessar campo como vetor.

Errado:
jogador["nome"]

Certo:
jogador.nome`,
            tip: "Use ponto para acessar campos de registro.",
            missions: "Missão 08 do modo difícil"
          }
        ]
      }
    ]
  }
};