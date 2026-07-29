/* ============================================================
   assets/js/core/config.js
   Constantes globais do jogo. Edite aqui para ajustar parametros.
   ============================================================ */

const CONFIG = {
  canvas: {
    width:  1000,
    height: 600
  },

  player: {
    speed: 4
  },

  // Proposta: 5 pontos por pergunta, maximo de 25 pontos por fase.
  score: {
    basePointsPerQuestion: 5,
    minPointsPerQuestion: 1,
    minimumPhaseFloor: 6,
    gameOverRestartCount: 4,
    minCorrectByRoom: {
      sala1: 2,
      sala2: 2,
      sala3: 3,
      sala4: 3
    }
  },

  // 3 dificuldades conforme manual.
  difficulties: {
    facil:   { label: "Fácil",   color: "#00ffcc" },
    medio:   { label: "Médio",   color: "#ffaa44" },
    dificil: { label: "Difícil", color: "#ff44aa" }
  },

  // Quantidade de desafios por fase.
  minBugsToPass: 5,

  // Debug: mostrar zonas de colisao em tela (true = visivel).
  showCollisionDebug: false
};
