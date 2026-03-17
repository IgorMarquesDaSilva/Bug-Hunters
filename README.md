# Bug Hunters 🐛

Bug Hunters é um jogo educativo 2D desenvolvido para ensinar lógica de programação de forma simples, interativa e acessível. O projeto nasceu da ideia de tornar o aprendizado de programação mais dinâmico e divertido, usando elementos de jogos para engajar alunos que estão dando os primeiros passos na área.

## 🎮 Sobre o Jogo

O jogador controla um robô em um mapa digital com estética cyberpunk e deve explorar o ambiente em busca de bugs — falhas em sistemas representadas por blocos vermelhos piscando no mapa. O cenário é composto por uma grade digital com nós conectados, criando a atmosfera de um sistema computacional infectado por erros.

Ao se aproximar de um bug, uma linha de radar aparece indicando a proximidade. O jogador pode então escolher iniciar a missão de correção. Cada missão apresenta um trecho de código com uma lacuna e quatro alternativas de resposta. Após responder, uma explicação é exibida para reforçar o conceito aprendido, independentemente de a resposta ter sido certa ou errada.

## 🧠 Proposta Educacional

O jogo foi criado para introduzir conceitos básicos de programação para alunos iniciantes, utilizando uma abordagem prática e visual. Durante a experiência, o jogador aprende sobre:

- Estruturas condicionais (`if`)
- Laços de repetição (`for`)
- Variáveis e tipos de dados
- Operadores lógicos (`and`, `or`)
- Definição de funções (`def`)

Cada conceito é apresentado dentro de um contexto que faz sentido para o jogador, facilitando a compreensão e a memorização. O formato de múltipla escolha foi escolhido para reduzir a barreira de entrada, permitindo que alunos sem nenhum conhecimento prévio consigam jogar e aprender desde o primeiro contato.

## 🕹️ Como Jogar

- **Mover:** WASD ou teclas de seta
- **Iniciar missão:** aproxime-se de um bug vermelho no mapa
- **Responder:** escolha uma das quatro alternativas apresentadas
- Após responder, uma explicação é exibida para reforçar o aprendizado
- Bugs resolvidos ficam marcados em verde no mapa

## 📊 Sistema de Pontuação

- Cada missão concluída corretamente vale **100 pontos**
- O jogador possui **3 vidas** — perde uma a cada resposta errada
- A barra de progresso indica quantos bugs já foram resolvidos
- Ao eliminar todos os bugs, a pontuação final é exibida

## 📁 Estrutura do Projeto
```
bug-hunters/
├── index.html   — estrutura da página e overlays do jogo
├── style.css    — estilo visual do jogo
├── player.js    — dados e desenho do personagem
├── mission.js   — missões, lógica dos bugs e popups
└── game.js      — loop principal, movimento e renderização
```

## 👥 Autores

Desenvolvido por:

- **Igor Marques da Silva**
- **Maria Vitória Victor Brito**

## 🚧 Status

Projeto em desenvolvimento.