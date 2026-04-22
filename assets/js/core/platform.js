/* ============================================================
   assets/js/core/platform.js
   Comunicação com a plataforma C4A (Manual §8).

   NÃO edite esta lógica — é um contrato fixo com a plataforma.
   ============================================================ */

let scoreSent = false;

/**
 * Envia a pontuação final para a plataforma (enviado apenas 1 vez).
 * Escala obrigatória: 0 a 100.
 * @param {number} score   - valor entre 0 e 100
 * @param {string} difficulty - dificuldade selecionada pelo jogador
 */
function sendFinalScore({ score, difficulty } = {}) {
  if (scoreSent) return;

  // Garante que o score está na escala 0-100 sem frações
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  try {
    window.parent.postMessage(
      {
        type: "C4A_GAME_SCORE",
        payload: { score: safeScore, difficulty }
      },
      "*"
    );
    scoreSent = true;
    console.log(`[C4A] Score enviado: ${safeScore} | Dificuldade: ${difficulty}`);
  } catch (error) {
    console.log("⚠️ Falha ao enviar score:", error?.message || error);
  }
}

/**
 * Lê a dificuldade vinda da plataforma via query param.
 * Fallback para "medio" se não vier nada.
 */
function getPlatformDifficulty() {
  try {
    const params = new URLSearchParams(window.location.search);
    const d = params.get("difficulty");
    if (d && CONFIG.difficulties[d]) return d;
  } catch (_) {}
  return null; // null = jogador escolhe na tela inicial
}

/** Reseta o controle de envio para uma nova partida */
function resetScoreSent() {
  scoreSent = false;
}
