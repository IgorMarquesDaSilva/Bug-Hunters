/* ============================================================
   assets/js/core/config.js
   Constantes globais do jogo. Edite aqui para ajustar parâmetros.
   ============================================================ */

const CONFIG = {
  canvas: {
    width:  1000,
    height: 600
  },

  player: {
    size:          32,
    speed:         4,
    bugProximity:  42,   // px para acionar popup de bug
    lineDrawDist:  130   // px para desenhar linha de conexão
  },

  bug: {
    width:  28,
    height: 28
  },

  portal: {
    width:       50,
    height:      50,
    triggerDist: 45
  },

  // Pontuação (escala 0-100 conforme manual §4)
  score: {
    pointsPerHit: {
      facil:   20,  // 5 bugs × 20 = 100
      medio:   20,
      dificil: 20
    },
    penaltyPerWrong: {
      facil:   0,
      medio:   5,
      dificil: 10
    }
  },

  // 3 dificuldades conforme manual §6
  difficulties: {
    facil:   { label: "Fácil",   lives: 3, color: "#00ffcc" },
    medio:   { label: "Médio",   lives: 2, color: "#ffaa44" },
    dificil: { label: "Difícil", lives: 1, color: "#ff44aa" }
  },

  // Pontuação mínima para ativar o portal (% de bugs resolvidos)
  minBugsToPass: 5,   // todos os bugs

  // Debug: mostrar zonas de colisão em tela (true = visível)
  showCollisionDebug: false
};
