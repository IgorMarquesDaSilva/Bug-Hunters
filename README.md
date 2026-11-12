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
escolha ou uma atividade de ligar pares. Cada resposta recebe feedback e
uma explicação do conceito.

O banco contém 120 atividades adaptadas do documento `Bug_Hunters_Questoes.docx`:
dez por fase e dificuldade. Cada seleção tem quatro questões e um desafio
de associação, cobrindo cinco objetivos de aprendizagem do setor. O nível
Intermediário do documento corresponde ao Médio do jogo.

Perguntas, alternativas, colunas da associação e objetos com bugs são
sorteados. Cada fase tem mais de cinco objetos candidatos, mas somente os
cinco selecionados ficam destacados. As variantes de cada objetivo rodam
antes de se repetir; ao reiniciar uma fase, uma nova seleção é preparada.
A rotação continua entre partidas enquanto a página permanece aberta.

Todas as missões da sala precisam ser respondidas. Quando a pontuação mínima
é atingida, a porta do próximo setor é liberada. Caso contrário, a sala pode
ser reiniciada com valor reduzido por questão.

O tutorial e o glossário podem ser abertos durante a partida. O personagem é
controlado por `WASD` ou pelas setas direcionais.

## Navegação somente pelo teclado

Todas as telas podem ser operadas sem mouse:

| Contexto | Teclas | Ação |
| --- | --- | --- |
| Menus e janelas | Tab / Shift+Tab | Próximo / anterior controle, mantendo o foco na janela aberta |
| Botão focado | Enter / Espaço | Acionar o botão |
| Associação | Tab e Enter | Escolher um item, ligar à resposta e confirmar; selecionar o item novamente permite trocar sua ligação |
| Menu inicial | A / W / D | Jogar / configurações / acessibilidade |
| Dificuldade e alternativas | Setas / Home / End | Percorrer opções / primeira / última opção |
| Mapa focado | WASD / setas | Mover o personagem |
| Mapa com bug detectado | Enter | Abrir missão |
| Mapa | Tab | Acessar os botões de apoio; Shift+Tab retorna pelo mesmo percurso |
| Tutorial | Direita / esquerda / R | Próxima etapa / anterior / narrar etapa |
| Configurações | Setas no controle de volume | Ajustar volume |
| Dificuldade, configurações, acessibilidade, tutorial, glossário e aviso de bug | Escape | Voltar / fechar |
| Acessibilidade | L / C / + / - | Narração / contraste / aumentar ou diminuir fonte |

Ao responder uma missão, o foco passa ao botão Continuar. Ao fechar uma
janela de apoio, volta ao controle que a abriu, quando disponível, ou ao
mapa. O conteúdo do glossário e o código da missão recebem foco com Tab
para permitir a leitura e a rolagem pelo teclado. O aviso de bug preserva
a movimentação e não retira o foco do mapa.

As atividades de associação permitem reutilizar uma resposta, por exemplo
ligando dois valores à categoria TEXTO. Todas as ligações precisam ser
feitas antes da confirmação. A atividade completa vale os mesmos pontos
de uma pergunta; somente a confirmação avalia os pares e encerra o desafio.

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
- A cada reinício, o valor da pergunta diminui em um ponto.
- A pontuação mínima da sala nunca fica abaixo de 6 pontos.
- O quarto reinício encerra a partida.

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
```

Com o jogo em `http://127.0.0.1:8000` e Chrome de testes com depuração na
porta 9222, os testes abaixo verificam partidas completas nas três
dificuldades, erros, reinícios, associações com Tab/Enter e acessibilidade:

```powershell
node tests/keyboard-navigation.cjs
node tests/matching-challenge.cjs
node tests/font-scaling.cjs
```
