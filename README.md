# 🐛 Bug Hunters

**Bug Hunters** é um jogo educativo 2D desenvolvido para apoiar o aprendizado de lógica de programação de forma simples, visual e interativa.

O jogador assume o papel de um **Bug Hunter**, explorando setores de um sistema digital corrompido para encontrar e corrigir erros. Cada bug encontrado ativa uma missão com desafios de programação, interpretação de código ou raciocínio lógico.

---

## 🎮 Sobre o Projeto

O objetivo do **Bug Hunters** é transformar conceitos iniciais de programação em uma experiência jogável. Em vez de apresentar apenas teoria, o jogo usa exploração, escolhas e feedback imediato para ajudar o jogador a compreender erros, condições, repetições, variáveis e outros fundamentos.

O projeto foi pensado para ser **simples, funcional e acessível**:

- Não utiliza banco de dados
- Não possui sistema de login
- Não depende de backend
- Funciona como uma aplicação web estática
- Usa arquivos locais para armazenar dados das missões
- Tem foco em aprendizado, funcionamento e experiência do jogador

---

## 🧠 Objetivo Educacional

O jogo trabalha conceitos importantes para estudantes que estão iniciando em programação, como:

- Pensamento lógico
- Interpretação de código
- Identificação e correção de erros
- Variáveis e tipos de dados
- Operadores aritméticos
- Operadores relacionais
- Operadores lógicos
- Estruturas condicionais
- Laços de repetição
- Funções e procedimentos
- Tomada de decisão

> A relação detalhada com habilidades da BNCC/Computação será complementada posteriormente.

---

## 🕹️ Como Jogar

O jogador controla um personagem dentro de salas que representam setores de um sistema digital. Ao se aproximar de um bug, uma missão é ativada.

### Controles

| Ação | Comando |
| --- | --- |
| Mover personagem | `WASD` ou setas do teclado |
| Interagir com bug | Aproximar-se do objeto destacado |
| Resolver missão | Escolher uma alternativa |
| Avançar de sala | Eliminar todos os bugs do setor |

### Fluxo do Jogo

1. Escolha a dificuldade.
2. Explore a sala.
3. Encontre os bugs.
4. Resolva as missões.
5. Receba feedback da resposta.
6. Complete todos os desafios da sala.
7. Avance para o próximo setor.

---

## 🗺️ Estrutura do Jogo

O jogo foi planejado para conter **4 salas**, com progressão gradual de conteúdo e dificuldade.

### 🟢 Sala 1 — Introdução à Lógica

Apresenta conceitos iniciais de programação, como variáveis, tipos de dados, valores lógicos e comandos básicos.

### 🔵 Sala 2 — Operadores e Repetição

Trabalha operadores aritméticos, operadores relacionais, operadores lógicos e estruturas de repetição.

### 🟣 Sala 3 — Condições e Decisões

Explora estruturas condicionais, decisões simples, decisões compostas e análise de fluxo.

### 🔴 Sala 4 — Desafio Final

Prevista como a etapa final do jogo, reunindo os principais conceitos estudados nas salas anteriores em desafios mais completos.

> A quarta sala está prevista para a versão final do projeto.

---

## ⚙️ Dificuldades

O jogo possui três modos de dificuldade:

| Dificuldade | Proposta | Vidas |
| --- | --- | --- |
| Fácil | Conceitos mais diretos e introdutórios | 3 |
| Médio | Interpretação de código e raciocínio lógico | 2 |
| Difícil | Análise de erros e desafios mais complexos | 1 |

---

## 🏆 Sistema de Pontuação

O jogador recebe pontos ao responder corretamente às missões. Dependendo da dificuldade, respostas incorretas podem reduzir a pontuação e remover vidas.

- Acertos aumentam a pontuação
- Erros podem reduzir vidas
- Ao perder todas as vidas, ocorre **Game Over**
- Ao concluir os setores, o jogo exibe a pontuação final

---

## 🚪 Sistema de Progresso

Cada sala possui bugs espalhados pelo mapa. Para avançar, o jogador precisa resolver todos os desafios daquele setor.

Quando todas as missões de uma sala são concluídas:

- O setor é considerado limpo
- A passagem para o próximo setor é liberada
- O jogador pode avançar para a próxima sala

---

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido com tecnologias web simples:

- **HTML5**
- **CSS3**
- **JavaScript**
- **Canvas API**
- **JSON**

---

## 📁 Organização dos Arquivos

```txt
Bug-Hunters/
├── index.html
├── README.md
└── assets/
    ├── css/
    │   └── main.css
    ├── img/
    │   ├── player.png
    │   ├── player1.png
    │   ├── player3.png
    │   ├── map_sala1.png
    │   └── map_sala2.png
    └── js/
        ├── core/
        ├── data/
        ├── systems/
        └── ui/
```

### Principais Pastas

- `assets/css`: estilos visuais do jogo
- `assets/img`: imagens e sprites
- `assets/js/core`: configurações, estado global e inicialização
- `assets/js/data`: dados das missões, salas e glossário
- `assets/js/systems`: sistemas de jogo, como colisão, player e transição
- `assets/js/ui`: telas, HUD, missões, tutorial e glossário

---

## ✨ Recursos do Jogo

- Mapa 2D com estilo pixel art
- Personagem controlável
- Sistema de colisões
- Missões com alternativas
- Feedback explicativo após cada resposta
- Sistema de vidas
- Sistema de pontuação
- Progressão entre salas
- Tela de tutorial
- Glossário educativo
- Tela de vitória
- Tela de Game Over

---

## 🚧 Status do Projeto

**Projeto em desenvolvimento.**

Atualmente, o jogo está sendo estruturado para conter **quatro salas** e um conjunto de missões educativas voltadas para lógica de programação.

### Melhorias Futuras

- Implementar a quarta sala
- Ajustar e finalizar o suporte mobile
- Revisar o sistema de pontuação para todas as salas
- Melhorar sons e efeitos visuais
- Expandir o glossário
- Refinar acessibilidade
- Complementar a relação com a BNCC/Computação

---

## 👥 Autores

- Igor Marques
- Maria Vitória Victor Brito

---

## 📌 Observação

Este projeto tem finalidade educacional e foi desenvolvido como uma experiência simples para apoiar o aprendizado de programação. O foco principal é que o jogo funcione corretamente, seja fácil de testar e ajude o jogador a praticar conceitos fundamentais de lógica.
