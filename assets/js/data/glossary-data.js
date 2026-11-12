const GLOSSARY_DATA = {
  fase1: {
    title: "Fase 1 — Tipos de dados e variáveis",
    intro: "Um jogo guarda números, palavras e estados. Os exemplos usam os blocos simples do jogo: = guarda um valor, aspas marcam texto e true/false representam verdadeiro/falso.",
    categories: [
      {
        title: "1. Número, texto e booleano",
        description: "Observe o valor e veja se ele tem aspas.",
        topics: [
          {
            title: "Número",
            text: "É um valor usado para contar ou calcular, como vidas e pontos. Pode ter uma parte decimal, como 30.5.",
            code: 'vidas = 3\npontos = 25',
            output: 'vidas guarda o número 3. pontos guarda o número 25.',
            wrong: '"3" tem aspas: é texto. Para contar vidas, use 3 sem aspas.',
            tip: "0 também é um número."
          },
          {
            title: "Texto",
            text: "É uma palavra, nome ou mensagem escrita entre aspas. Até um número vira texto quando fica entre aspas.",
            code: 'nome = "Lia"\naviso = "energia baixa"\ncodigo = "10"',
            output: 'Os três valores são textos.',
            wrong: 'nome = Lia não representa o texto "Lia". Use aspas para guardar a palavra.',
            tip: '10 é número. "10" é texto.'
          },
          {
            title: "Booleano: true e false",
            text: "Guarda um de dois estados: true significa verdadeiro e false significa falso. Serve para indicar se o som está ligado ou se o jogador está ativo.",
            code: 'somLigado = true\nativo = false',
            output: 'O som está ligado e o jogador está inativo.',
            wrong: '"true" e "false", com aspas, são textos. Booleanos ficam sem aspas.',
            tip: "0 e 1 são números. Neste jogo, os booleanos são true e false."
          }
        ]
      },
      {
        title: "2. Variáveis e correções",
        description: "Uma variável funciona como uma caixa com nome para guardar um valor.",
        topics: [
          {
            title: "Dar um nome e guardar um valor",
            text: "O nome fica antes do sinal = e o valor fica depois. Escolha um nome que ajude a entender o que será guardado.",
            code: 'idade = 12\nnome = "Ana"\njogadorAtivo = true',
            tip: "Idade guarda um número, nome guarda texto e jogadorAtivo guarda um estado."
          },
          {
            title: "Conferir o tipo antes de corrigir",
            text: "Pense no uso da informação. Quantas vidas? Qual nome? O jogador está ativo? Depois confira as aspas e o valor.",
            code: 'vidas = 2\nnome = "Bug"\nativo = false',
            wrong: 'vidas = "2" guarda texto. Para usar a quantidade na contagem, corrija para vidas = 2.',
            tip: "Nos desafios de ligar, uma resposta pode servir para mais de um item. Dois textos podem ser ligados à mesma caixa TEXTO."
          }
        ]
      }
    ]
  },
  fase2: {
    title: "Fase 2 — Operadores",
    intro: "Operadores são sinais que permitem calcular e comparar. Leia o sinal com atenção: trocar + por * muda o resultado.",
    categories: [
      {
        title: "1. Fazer contas",
        description: "Use os números e o sinal para descobrir o resultado.",
        topics: [
          {
            title: "Somar e subtrair",
            text: "O sinal + soma: junta quantidades. O sinal - subtrai: retira uma quantidade de outra.",
            code: '5 + 3 → 8\n10 - 4 → 6',
            wrong: '6 * 3 dá 18. Para chegar a 9 usando 6 e 3, use 6 + 3.',
            tip: "Faça uma conta por vez."
          },
          {
            title: "Multiplicar e dividir",
            text: "O sinal * multiplica. O sinal / divide. Para encontrar a metade de um número, divida por 2.",
            code: '3 * 4 → 12\n20 / 2 → 10\n10 / 5 → 2',
            tip: "8 + 4 dá 12; 8 * 4 dá 32; 8 / 4 dá 2. Os mesmos números podem produzir resultados diferentes."
          },
          {
            title: "Atualizar a pontuação",
            text: "O resultado de uma conta pode ser guardado em uma variável.",
            code: 'pontos = 10 + 5',
            output: 'pontos passa a guardar 15.',
            tip: "Se a pontuação aumenta de 10 para 15, foram somados 5 pontos."
          }
        ]
      },
      {
        title: "2. Comparar valores",
        description: "Uma comparação responde verdadeiro ou falso.",
        topics: [
          {
            title: "Maior, menor e igual",
            text: "Use > para maior que, < para menor que e == para igual a. O sinal >= significa maior ou igual; <= significa menor ou igual.",
            code: 'vidas > 2\nenergia < 5\npontos == 10\nenergia >= 10',
            output: 'Se energia for 10, energia >= 10 é true e energia > 10 é false.',
            tip: "Em >=, o valor do limite também é aceito."
          },
          {
            title: "Guardar é diferente de comparar",
            text: "Nos blocos deste jogo, = guarda um valor. Para perguntar se dois valores são iguais, use ==.",
            code: 'energia = 8\nenergia == 10 → false\nenergia < 10 → true',
            wrong: "energia = 10 muda o valor guardado; energia == 10 verifica se o valor já é 10.",
            tip: "Leia pontos > 20 ou pontos == 20 como: pontos é maior que 20 ou é exatamente 20."
          }
        ]
      }
    ]
  },
  fase3: {
    title: "Fase 3 — Condições e decisões",
    intro: "Uma condição ajuda o jogo a escolher uma ação. A seta → mostra o que fazer quando a condição for verdadeira.",
    categories: [
      {
        title: "1. Se e senão",
        description: "Leia a condição e só depois escolha a ação.",
        topics: [
          {
            title: "Se: testar antes de agir",
            text: "O bloco se verifica uma condição. A ação indicada acontece quando ela é verdadeira.",
            code: 'se energia < 5 → recarregar\nse vidas == 0 → game over',
            output: 'Com energia = 3, a primeira decisão manda recarregar.',
            tip: "Uma condição pode comparar números ou verificar um booleano."
          },
          {
            title: "Senão: o outro caminho",
            text: "O bloco senão indica o que fazer quando a condição do se for falsa.",
            code: 'se ativo == true → continuar\nsenão → parar',
            output: 'Com ativo = false, o programa escolhe parar.',
            wrong: "Trocar as ações faz o sistema agir no momento errado. Energia baixa pede recarga."
          },
          {
            title: "Senão se: mais possibilidades",
            text: "Os testes são lidos de cima para baixo. Quando um caminho é escolhido, os próximos caminhos dessa decisão são ignorados.",
            code: 'se vidas == 0 → game over\nsenão se vidas < 3 → cuidado\nsenão → continuar',
            output: '0 vidas: game over. 2 vidas: cuidado. 3 vidas: continuar.',
            tip: "Teste vidas == 0 antes de vidas < 3 para que zero siga para game over."
          }
        ]
      },
      {
        title: "2. Juntar condições",
        description: "As palavras e e ou mudam o que é necessário para agir.",
        topics: [
          {
            title: "E: as duas precisam valer",
            text: "Com e, todas as condições ligadas precisam ser verdadeiras.",
            code: 'se chave == true e vidas > 0 → abrir porta',
            output: 'É preciso ter a chave e também ter vidas.',
            wrong: "Com energia = 12 e ativo = false, energia > 10 e ativo == true é false. Só a primeira parte é verdadeira.",
            tip: "Energia suficiente e jogador ativo: confira as duas partes."
          },
          {
            title: "Ou: pelo menos uma precisa valer",
            text: "Com ou, basta uma das condições ser verdadeira. Se as duas forem verdadeiras, a regra também é atendida.",
            code: 'se energia > 10 ou emergencia == true → ativar',
            output: 'O sistema pode ativar com energia alta ou com o modo emergência ligado.',
            tip: "Para resolver uma associação, leia a regra apresentada e avalie os valores de cada situação."
          }
        ]
      }
    ]
  },
  fase4: {
    title: "Fase 4 — Funções e organização",
    intro: "Uma variável guarda um dado. Uma função reúne ações com um nome para usá-las quando for preciso. Aqui usamos blocos simplificados, sem exigir a escrita de uma linguagem de programação.",
    categories: [
      {
        title: "1. Criar e chamar funções",
        description: "Criar prepara uma ação; chamar faz essa ação acontecer.",
        topics: [
          {
            title: "Criar uma função",
            text: "O bloco função dá um nome a uma ação ou conjunto de ações. Nos desafios, função abrirPorta representa a criação dessa ação.",
            code: 'função abrirPorta',
            tip: "Use um nome que mostre a ação, como abrirPorta, verificarEnergia ou mostrarMensagem."
          },
          {
            title: "Chamar uma função",
            text: "O bloco chamar executa uma função que já foi criada. Criar uma função, por si só, não significa executar a ação.",
            code: 'função verificarEnergia\nchamar verificarEnergia',
            output: 'Primeiro a ação é criada. Depois é executada.',
            wrong: "Se a função já existe e a pergunta pede para usá-la, escolha chamar, em vez de criar outra vez."
          },
          {
            title: "Reutilizar ações",
            text: "Uma função pode ser chamada em vários momentos. Isso ajuda a organizar o programa e evita montar a mesma ação toda vez.",
            code: 'função mostrarMensagem\nchamar mostrarMensagem\nchamar mostrarMensagem',
            output: 'A função foi criada uma vez e chamada duas vezes.',
            tip: "Funções são úteis quando uma mesma ação precisa acontecer novamente."
          }
        ]
      },
      {
        title: "2. Dados, ações e sequência",
        description: "Combine o que aprendeu nas fases anteriores.",
        topics: [
          {
            title: "Separar dado e ação",
            text: "Variáveis guardam números, textos e booleanos. Funções organizam ações; a chamada executa essas ações.",
            code: 'pontos = 20\nfunção abrirPorta\nchamar abrirPorta',
            output: 'pontos = 20: guardar dado. função abrirPorta: criar ação. chamar abrirPorta: executar ação.',
            tip: "Pergunte o que o bloco faz: guarda, cria ou executa?"
          },
          {
            title: "Organizar os blocos",
            text: "Siga a ordem pedida no enunciado. Nos desafios, crie a função antes de chamá-la e guarde cada dado com seu tipo correto.",
            code: 'função verificarEnergia\npontos = 30\nchamar verificarEnergia',
            wrong: 'pontos = "30" guarda texto. Para pontuação, use pontos = 30.',
            tip: "Confira uma linha por vez: o nome, o tipo do valor e o momento da chamada."
          }
        ]
      }
    ]
  }
};
