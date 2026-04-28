/* ============================================================
   assets/js/systems/transition.js
   Animação de transição entre salas — efeito pixel art.

   COMO FUNCIONA:
   - Usa o próprio canvas para sobrepor a animação
   - 3 fases: FADE_OUT → FLASH → FADE_IN
   - Durante a transição o jogo fica pausado
   - Ao fim chama um callback (ex: carregar a sala nova)

   COMO USAR:
   TransitionSystem.play(() => {
     // código executado no meio da transição (tela preta)
     GameState.currentRoom = "sala2";
     // ...
   });
   ============================================================ */

   const TransitionSystem = (() => {

    // ── Estado interno ────────────────────────────────────────
    const state = {
      active:    false,
      phase:     "idle",    // "fade_out" | "flash" | "scanline" | "fade_in" | "idle"
      progress:  0,         // 0.0 → 1.0 dentro da fase atual
      callback:  null,      // função chamada no meio da transição
      scanY:     0,         // posição da linha de scan animada
      glitchOff: [],        // offsets aleatórios para o glitch
    };
  
    // Duração de cada fase em frames (60fps)
    const DURATION = {
      fade_out: 30,
      flash:    12,
      scanline: 40,
      fade_in:  35
    };
  
    // ── API pública ───────────────────────────────────────────
  
    /**
     * Inicia a transição.
     * @param {Function} onMidpoint — chamado quando a tela está preta (troca a sala aqui)
     */
    function play(onMidpoint) {
      if (state.active) return;
      state.active    = true;
      state.phase     = "fade_out";
      state.progress  = 0;
      state.callback  = onMidpoint;
      state.scanY     = 0;
      state.glitchOff = Array.from({ length: 8 }, () => ({
        y:     Math.random() * 600,
        h:     4 + Math.random() * 20,
        dx:    (Math.random() - 0.5) * 30,
        alpha: 0.3 + Math.random() * 0.5
      }));
      GameState.isPaused = true;
    }
  
    function isActive() { return state.active; }
  
    // ── Update — chamado a cada frame ─────────────────────────
    function update() {
      if (!state.active) return;
  
      state.progress += 1 / DURATION[state.phase];
  
      if (state.progress >= 1) {
        state.progress = 0;
        _nextPhase();
      }
    }
  
    function _nextPhase() {
      switch (state.phase) {
        case "fade_out":
          state.phase = "flash";
          // Executa o callback no ponto mais escuro
          if (state.callback) { state.callback(); state.callback = null; }
          break;
        case "flash":
          state.phase = "scanline";
          state.scanY = -20;
          break;
        case "scanline":
          state.phase = "fade_in";
          break;
        case "fade_in":
          state.phase  = "idle";
          state.active = false;
          GameState.isPaused = false;
          break;
      }
    }
  
    // ── Draw — sobrepõe no canvas ─────────────────────────────
    function draw(ctx, canvas) {
      if (!state.active) return;
  
      const W = canvas.width, H = canvas.height;
      const p = state.progress;
  
      switch (state.phase) {
  
        // Tela escurece com glitch de pixels
        case "fade_out": {
          const alpha = _easeIn(p);
  
          // Faixa preta crescente
          ctx.fillStyle = `rgba(0,0,0,${alpha})`;
          ctx.fillRect(0, 0, W, H);
  
          // Glitch: fatias horizontais deslocadas
          if (alpha > 0.3) {
            state.glitchOff.forEach(g => {
              ctx.save();
              ctx.globalAlpha = g.alpha * alpha;
              // Captura a faixa e re-desenha deslocada
              ctx.fillStyle = `rgba(0,229,255,0.15)`;
              ctx.fillRect(0 + g.dx, g.y, W, g.h);
              ctx.restore();
            });
          }
  
          // Linhas horizontais (scan) sumindo
          if (alpha > 0.5) {
            ctx.fillStyle = `rgba(0,229,255,${(alpha-0.5)*0.3})`;
            for (let y = 0; y < H; y += 4) {
              ctx.fillRect(0, y, W, 1);
            }
          }
          break;
        }
  
        // Flash branco/ciano rápido
        case "flash": {
          const flashAlpha = p < 0.5
            ? _easeIn(p * 2)
            : 1 - _easeIn((p - 0.5) * 2);
          ctx.fillStyle = `rgba(0,229,255,${flashAlpha * 0.9})`;
          ctx.fillRect(0, 0, W, H);
          // Mantém preto embaixo do flash
          ctx.fillStyle = `rgba(0,0,0,${1 - flashAlpha * 0.8})`;
          ctx.fillRect(0, 0, W, H);
          break;
        }
  
        // Linha de scan descendo (como TV ligando)
        case "scanline": {
          // Fundo preto total
          ctx.fillStyle = "rgba(0,0,0,0.95)";
          ctx.fillRect(0, 0, W, H);
  
          // Linha brilhante descendo
          state.scanY += H / (DURATION.scanline * 0.8);
          const sy = state.scanY;
  
          // Glow acima da linha
          const grad = ctx.createLinearGradient(0, sy - 40, 0, sy + 4);
          grad.addColorStop(0,   "rgba(0,229,255,0)");
          grad.addColorStop(0.7, "rgba(0,229,255,0.3)");
          grad.addColorStop(1,   "rgba(0,229,255,0.9)");
          ctx.fillStyle = grad;
          ctx.fillRect(0, sy - 40, W, 44);
  
          // Linha principal
          ctx.fillStyle = "#00e5ff";
          ctx.fillRect(0, sy, W, 2);
  
          // Pixels revelados abaixo da linha (aparece o jogo)
          // Mostramos o conteúdo do canvas que foi desenhado antes
          ctx.globalCompositeOperation = "destination-out";
          ctx.fillStyle = "rgba(0,0,0,1)";
          ctx.fillRect(0, sy + 2, W, H - sy - 2);
          ctx.globalCompositeOperation = "source-over";
  
          // Re-escurece a parte que ainda não foi revelada
          ctx.fillStyle = "rgba(0,0,0,0.97)";
          ctx.fillRect(0, sy + 2, W, H - sy - 2);
  
          // Texto de loading
          if (p > 0.3) {
            ctx.fillStyle = `rgba(0,229,255,${Math.min(1, (p-0.3)*3)})`;
            ctx.font      = "bold 8px 'Press Start 2P', monospace";
            ctx.textAlign = "center";
            ctx.fillText("CARREGANDO SETOR " + (GameState.currentRoom === "sala2" ? "2" : "1") + "...",
              W/2, H/2 + 40);
          }
          break;
        }
  
        // Fade-in: jogo aparece gradualmente
        case "fade_in": {
          const alpha = 1 - _easeOut(p);
          ctx.fillStyle = `rgba(0,0,0,${alpha})`;
          ctx.fillRect(0, 0, W, H);
  
          // Scanlines sumindo
          if (alpha > 0.1) {
            ctx.fillStyle = `rgba(0,229,255,${alpha * 0.06})`;
            for (let y = 0; y < H; y += 4) {
              ctx.fillRect(0, y, W, 1);
            }
          }
          break;
        }
      }
    }
  
    // ── Easing ────────────────────────────────────────────────
    function _easeIn(t)  { return t * t; }
    function _easeOut(t) { return 1 - (1-t)*(1-t); }
  
    return { play, update, draw, isActive };
  
  })();