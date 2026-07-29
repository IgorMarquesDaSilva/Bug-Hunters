# Bug Hunters

Jogo educativo em HTML, CSS e JavaScript para alunos do 7º ao 9º ano do
Ensino Fundamental. O jogador explora quatro setores de um sistema digital,
localiza bugs e resolve desafios de lógica de programação escritos em
Portugol.

## Objetivo pedagógico

O jogo trabalha habilidades de pensamento computacional e lógica de
programação relacionadas à BNCC de Computação, com foco em:

- tipos de dados e variáveis;
- operadores;
- estruturas condicionais;
- funções e procedimentos;
- leitura, análise e correção de algoritmos.

## Mecânica principal

Cada partida possui quatro salas com cinco missões cada. Ao aproximar o
personagem de um objeto destacado, o jogador abre uma questão de múltipla
escolha, recebe feedback imediato e consulta uma explicação da resposta.

Todas as missões da sala precisam ser respondidas. Quando a pontuação mínima
é atingida, a porta do próximo setor é liberada. Caso contrário, a sala pode
ser reiniciada com valor reduzido por questão.

O tutorial e o glossário podem ser abertos durante a partida. O personagem é
controlado por `WASD` ou pelas setas direcionais.

## Salas

1. **Laboratório de Inicialização:** tipos de dados e variáveis.
2. **Núcleo de Energia:** operadores e manipulação de valores.
3. **Laboratório de Segurança:** condições e tomada de decisão.
4. **Central de Controle:** funções, procedimentos e integração dos conceitos.

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
