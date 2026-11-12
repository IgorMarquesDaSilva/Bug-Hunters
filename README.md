# Bug Hunters

Jogo educativo em HTML, CSS e JavaScript para alunos do 7º ao 9º ano do
Ensino Fundamental. O jogador explora quatro setores de um sistema digital,
localiza bugs e resolve desafios de lógica com blocos simplificados,
adequados a quem está começando a programar.

## Objetivo pedagógico

O jogo trabalha habilidades de pensamento computacional e lógica de
programação relacionadas à BNCC de Computação, com foco em:

- tipos de dados e variáveis;
- operadores;
- estruturas condicionais;
- criação, chamada e reutilização de funções;
- leitura, análise e correção de algoritmos.

## Mecânica principal

Cada partida possui quatro salas com cinco missões cada. Ao aproximar o
personagem de um objeto destacado, o jogador abre uma questão de múltipla
escolha, uma atividade de ligar pares ou um jogo da memória. Cada resposta recebe feedback e
uma explicação do conceito.

O banco contém 120 atividades adaptadas do documento `Bug_Hunters_Questoes.docx`:
dez por fase e dificuldade. As três primeiras fases têm quatro questões e
um desafio de associação. A última tem três questões, uma associação e um
jogo da memória, mantendo cinco missões e até 25 pontos por fase. O nível
Intermediário do documento corresponde ao Médio do jogo.

Perguntas, alternativas, colunas da associação e objetos com bugs são
sorteados. Cada fase tem mais de cinco objetos candidatos, mas somente os
cinco selecionados ficam destacados. As variantes de cada objetivo rodam
antes de se repetir; ao reiniciar uma fase, uma nova seleção é preparada.
A rotação continua entre partidas enquanto a página permanece aberta.

Todas as missões da sala precisam ser respondidas. Quando a pontuação mínima
é atingida, a porta do próximo setor é liberada. Caso contrário, a sala pode
ser reiniciada com valor reduzido por questão.

O tutorial, o glossário e a lista de atalhos podem ser abertos pela barra
lateral durante toda a partida, inclusive nas perguntas. Fechar um apoio
retoma a mesma atividade, com alternativas, ligações e cartas preservadas.
O personagem é controlado por `WASD` ou pelas
setas direcionais.

## Navegação somente pelo teclado

Todas as telas podem ser operadas sem mouse:

| Contexto | Teclas | Ação |
| --- | --- | --- |
| Menus e janelas | Tab / Shift+Tab | Próximo / anterior controle; durante a partida, inclui a barra de apoios |
| Botão focado | Enter / Espaço | Acionar o botão |
| Associação | Tab e Enter | Escolher um item, ligar à resposta e confirmar; selecionar o item novamente permite trocar sua ligação |
| Memória | Tab e Enter | Virar duas cartas e formar pares; quando não combinam, acionar Virar as cartas para tentar novamente |
| Menu inicial | A / W / D | Jogar / configurações / acessibilidade |
| Dificuldade e alternativas | Setas / Home / End | Percorrer opções / primeira / última opção |
| Mapa focado | WASD / setas | Mover o personagem |
| Mapa com bug detectado | Enter | Abrir missão |
| Mapa focado | R | Ouvir novamente a distância e a direção do bug mais próximo |
| Mapa | Tab | Acessar os botões de apoio; Shift+Tab retorna pelo mesmo percurso |
| Tutorial | Direita / esquerda / R | Próxima etapa / anterior / narrar etapa |
| Configurações | Setas no controle de volume | Ajustar volume |
| Dificuldade, configurações, acessibilidade, tutorial, glossário, atalhos e aviso de bug | Escape | Voltar / fechar |
| Acessibilidade | L / C / + / - | Narração / contraste / aumentar ou diminuir fonte |

Ao responder uma missão, o foco passa ao botão Continuar. Ao fechar um
apoio durante uma pergunta, o foco volta à atividade. No mapa, ele retorna
ao botão que abriu o apoio; pressionar WASD ou uma seta já foca o mapa e
move o personagem, sem exigir clique. Durante as perguntas, Tab percorre
também os apoios da barra lateral. O conteúdo do glossário e o código recebem foco com Tab
para permitir a leitura e a rolagem pelo teclado. O aviso de bug preserva
a movimentação e não retira o foco do mapa.

As atividades de associação permitem reutilizar uma resposta, por exemplo
ligando dois valores à categoria TEXTO. Todas as ligações precisam ser
feitas antes da confirmação. A atividade completa vale os mesmos pontos
de uma pergunta; somente a confirmação avalia os pares e encerra o desafio.

A memória revisa dados, funções e reutilização com três, quatro ou cinco
pares, conforme a dificuldade. As cartas são embaralhadas a cada tentativa
da fase. Não há limite de tempo. A missão é considerada errada no quarto
erro no Fácil, no segundo no Médio e no primeiro no Difícil. Antes desse
limite, cartas que não combinam ficam abertas até o jogador escolher
continuar, permitindo a leitura com leitor de tela. Encontrar todos os
pares vale uma única resposta correta; atingir o limite encerra a missão
sem pontos.

O cronômetro da partida aparece no HUD, incluindo durante perguntas e
consultas. Ele mede o tempo desde a escolha da dificuldade até o
encerramento, inclui o reinício de fase e só zera ao iniciar outra partida
ou voltar ao menu. Não existe penalidade nem limite de tempo.

Ao terminar, uma transição de TV antiga abre o resumo com som de vitória
(ou de fim de partida). Os acertos por fase, o tempo e o reinício aparecem
um por vez; a pontuação total vem por último e libera os botões. As fases
reiniciadas mostram os acertos da última tentativa e os pontos descartados
da anterior. Enter no título revela tudo sem esperar. Tab permite consultar
cada resultado e alcançar os botões. Menu e Jogar novamente usam o mesmo
efeito de TV antiga, com proteção contra acionamentos repetidos.

## Salas

1. **Laboratório de Inicialização:** tipos de dados e variáveis.
2. **Núcleo de Energia:** operadores e manipulação de valores.
3. **Laboratório de Segurança:** condições e tomada de decisão.
4. **Central de Controle:** criar, chamar e reutilizar funções, com variáveis.

As três dificuldades mantêm o tema de cada sala. O glossário usa a mesma
notação das perguntas: `=` guarda, `==` compara igualdade, `true`/`false`
são booleanos, `se`/`senão` escolhem caminhos, e `função`/`chamar`
representam criação e execução de ações. São blocos pedagógicos, sem exigir
a sintaxe completa de uma linguagem. Inconsistências do banco original
foram corrigidas, incluindo a regra de energia `>= 10 e ativo == true`.

## Dificuldades

O jogo implementa os três níveis definidos pelo manual da plataforma:

- Fácil
- Médio
- Difícil

Quando a plataforma informa `?difficulty=facil`, `?difficulty=medio` ou
`?difficulty=dificil`, esse valor tem prioridade. Fora da plataforma, o
jogador escolhe a dificuldade na tela inicial.

## Pontuação

- Cada resposta correta vale inicialmente 5 pontos.
- Cada sala oferece no máximo 25 pontos.
- A pontuação final permanece entre 0 e 100, sem valores negativos ou
  fracionados.
- As Salas 1 e 2 exigem dois acertos mínimos.
- As Salas 3 e 4 exigem três acertos mínimos.
- Há um único reinício de fase por partida, utilizável em qualquer sala.
- Os pontos da tentativa perdida são removidos; na fase reiniciada,
  cada acerto passa de 5 para 4 pontos.
- A pontuação mínima da sala nunca fica abaixo de 6 pontos.
- Se a pontuação mínima não for atingida após usar esse reinício, a
  partida termina, inclusive quando a nova falha ocorre em outra sala.

Pontos excedentes das salas anteriores podem compensar erros nas salas
seguintes, conforme a proposta do jogo.

## Integração com a plataforma

Ao concluir a partida ou atingir Game Over, o jogo envia uma única mensagem
para a página hospedeira:

```js
window.parent.postMessage({
  type: "C4A_GAME_SCORE",
  payload: {
    score,
    difficulty
  }
}, "*");
```

O envio é controlado por `assets/js/core/platform.js`.

## Dados externos

O conteúdo variável fica separado da interface:

- `assets/js/data/missions.json`: perguntas, alternativas e explicações;
- `assets/js/data/rooms.json`: posição inicial do personagem em cada sala;
- `assets/js/data/glossary-data.js`: conteúdo pedagógico do glossário.
- `assets/js/data/memory-data.js`: pares e dificuldades do jogo da memória.

O sorteio fica em `assets/js/systems/question-bank.js`. Cada questão tem
um identificador, o número da questão de origem e um objetivo. A seleção
é mantida estável durante a tentativa, para que o gabarito não mude ao abrir
ou responder uma missão. O glossário apresenta os conceitos e exemplos,
sem referências a números fixos de missão.

Os arquivos JSON são carregados por `fetch`, portanto o projeto deve ser
executado por HTTP e não pela abertura direta do `index.html`.

## Preferências locais

O jogo não salva pontuação, sala atual nem progresso da partida. O
`localStorage` é utilizado somente para preferências do próprio navegador:

- volume;
- tamanho da fonte;
- alto contraste;
- leitor de tela;
- conclusão do tutorial.

O tamanho Normal usa 12 px nos textos da fonte pixelada e 16 px na Arial,
com subtextos menores em ambas. A fonte pixelada recebe um ajuste de 75%
para compensar seus caracteres mais largos. Grande amplia cada base em
50%, e Gigante em 100%. Os blocos do modo Difícil mantêm uma base de 16 px
na fonte de código. As preferências salvas continuam sendo respeitadas.

Essas preferências não dependem de banco de dados da plataforma.

## Estrutura

```text
Bug-Hunters/
|-- assets/
|   |-- css/
|   |-- img/
|   `-- js/
|       |-- core/
|       |-- data/
|       |-- systems/
|       `-- ui/
|-- index.html
`-- README.md
```

## Implementação técnica

- **HTML5:** estrutura das salas, HUD, menus e janelas de missão.
- **CSS3:** mapas, objetos, animações, responsividade e estados visuais.
- **JavaScript:** estado da partida, colisões, movimento, missões, pontuação,
  acessibilidade e integração com a plataforma.
- **Canvas 2D:** personagem, rótulos, depuração e transições.
- **Web Audio API:** música e efeitos gerados em tempo de execução.
- **Bootstrap Icons 1.11.3:** ícones da interface carregados por CDN.

Não há etapa de compilação nem dependências de pacote.

## Execução local

Na raiz do projeto, inicie um servidor HTTP. Exemplo:

```powershell
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Verificação

Validação do banco, cobertura dos objetivos, rotação e gabaritos:

```powershell
node tests/question-bank.cjs
node tests/run-summary.cjs
```

Com o jogo em `http://127.0.0.1:8000` e Chrome de testes com depuração na
porta 9222, os testes abaixo verificam partidas completas nas três
dificuldades, erros, reinícios, associações com Tab/Enter e acessibilidade:

```powershell
node tests/keyboard-navigation.cjs
node tests/matching-challenge.cjs
node tests/game-support-memory.cjs
node tests/results-memory.cjs
node tests/room-transitions.cjs
node tests/font-scaling.cjs
```

O teste de transições confere por captura de pixels que as salas 2, 3 e 4
clareiam por inteiro, incluindo reator e telas, e que a porta da sala 2
permanece sem sombra nos estados fechado e liberado.

Se a inicialização estiver temporariamente configurada para outra sala,
use `$env:BH_TEST_FROM_FIRST_ROOM='1'` antes do teste de navegação para
percorrer as quatro fases sem alterar a configuração do projeto.
