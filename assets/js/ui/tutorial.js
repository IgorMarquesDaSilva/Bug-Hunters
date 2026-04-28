/* ============================================================
   assets/js/ui/tutorial.js
   Tutorial interativo passo a passo.
   
   COMO FUNCIONA:
   - São "slides" que aparecem em cima do canvas com setas
   - Cada slide pode ter: texto, destaque de área, animação
   - O player fica pausado durante o tutorial
   - Só aparece na primeira vez (salvo em localStorage)
   - Pode ser reaberto pelo HUD a qualquer momento
   ============================================================ */

   const TutorialSystem = (() => {

    // ── Slides do tutorial ────────────────────────────────────
    // highlight: { x, y, w, h } — desenha moldura piscante no canvas
    // arrow: "left"|"right"|"top"|"bottom" — de onde aponta a seta do balão
    const SLIDES = [
      {
        title:     "BEM-VINDO, OPERADOR!",
        text:      "Você é um Bug Hunter.\nSua missão: encontrar e corrigir todos os bugs\nespalhados pelo sistema antes que ele entre em colapso.",
        highlight: null,
        arrow:     "bottom"
      },
      {
        title:     "MOVIMENTAÇÃO",
        text:      "Use WASD ou as SETAS do teclado\npara mover seu personagem pelo mapa.\n\nNo mobile, use o D-PAD no canto inferior esquerdo.",
        highlight: null,
        arrow:     "bottom",
        showDpad:  true
      },
      {
        title:     "OS BUGS",
        text:      "Monitores vermelhos piscando\nsão os BUGS do sistema.\n\nAproximando-se deles, um alerta será disparado.",
        highlight: null,
        arrow:     "bottom",
        demoType:  "bug"   // desenha um bug demo no canvas
      },
      {
        title:     "CORRIGINDO BUGS",
        text:      "Ao se aproximar de um bug,\nescolha CORRIGIR para iniciar a missão.\n\nResponda corretamente para ganhar pontos\ne eliminar o bug do sistema!",
        highlight: null,
        arrow:     "bottom"
      },
      {
        title:     "VIDAS E PONTUAÇÃO",
        text:      "Cada erro custa uma vida (dependendo\nda dificuldade escolhida).\n\nSem vidas = GAME OVER.\nPontuação máxima = 100 pontos.",
        highlight: null,
        arrow:     "bottom"
      },
      {
        title:     "PORTAL DE SAÍDA",
        text:      "Após resolver TODOS os bugs da sala,\num PORTAL roxo será aberto.\n\nEntre no portal para avançar\npara o próximo setor!",
        highlight: null,
        arrow:     "bottom",
        demoType:  "portal"
      },
      {
        title:     "PRONTO PARA A MISSÃO!",
        text:      "Boa sorte, Operador.\nO sistema depende de você.\n\nPressione INICIAR para começar!",
        highlight: null,
        arrow:     "bottom"
      }
    ];
  
    let currentSlide = 0;
    let isOpen       = false;
    let demoAnim     = 0; // contador de animação para demos no canvas
  
    // ── API pública ───────────────────────────────────────────
  
    function open(fromMenu = false) {
      // Só pula o tutorial se já foi visto E não foi chamado manualmente
      if (!fromMenu && localStorage.getItem("bh_tutorial_done") === "1") return;
      currentSlide     = 0;
      isOpen           = true;
      demoAnim         = 0;
      GameState.isPaused = true;
      _render();
    }
  
    function close() {
      isOpen = false;
      localStorage.setItem("bh_tutorial_done", "1");
      _hide();
      GameState.isPaused = false;
    }
  
    function isActive() { return isOpen; }
  
    // ── Navegação ─────────────────────────────────────────────
  
    function next() {
      if (!isOpen) return;
      if (currentSlide < SLIDES.length - 1) {
        currentSlide++;
        demoAnim = 0;
        _render();
      } else {
        close();
      }
    }
  
    function prev() {
      if (!isOpen || currentSlide === 0) return;
      currentSlide--;
      demoAnim = 0;
      _render();
    }
  
    // ── Render do painel HTML ─────────────────────────────────
  
    function _render() {
      const slide    = SLIDES[currentSlide];
      const total    = SLIDES.length;
      const isLast   = currentSlide === total - 1;
      const overlay  = document.getElementById("screen-tutorial");
      if (!overlay) return;
  
      overlay.style.display = "flex";
  
      // Título
      document.getElementById("tut-title").textContent = slide.title;
  
      // Texto (quebra linhas)
      const textEl = document.getElementById("tut-text");
      textEl.innerHTML = slide.text
        .split("\n")
        .map(line => `<span>${line}</span>`)
        .join("<br>");
  
      // Indicador de progresso (bolinhas)
      const dotsEl = document.getElementById("tut-dots");
      dotsEl.innerHTML = Array.from({ length: total }, (_, i) =>
        `<span class="tut-dot ${i === currentSlide ? "active" : ""}"></span>`
      ).join("");
  
      // Botões
      document.getElementById("tut-btn-prev").style.visibility =
        currentSlide === 0 ? "hidden" : "visible";
      document.getElementById("tut-btn-next").textContent =
        isLast ? "▶ INICIAR MISSÃO" : "PRÓXIMO ▶";
  
      // Demo no canvas (bug ou portal animado)
      if (slide.demoType) _startDemo(slide.demoType);
      else                _stopDemo();
    }
  
    function _hide() {
      const overlay = document.getElementById("screen-tutorial");
      if (overlay) overlay.style.display = "none";
      _stopDemo();
    }
  
    // ── Demo animado no canvas ────────────────────────────────
    // Desenha um exemplo do elemento diretamente no canvas
    // para o jogador ver como ele parece no jogo real
  
    let _demoInterval = null;
  
    function _startDemo(type) {
      _stopDemo();
      const canvas = document.getElementById("gameCanvas");
      const ctx    = canvas.getContext("2d");
  
      _demoInterval = setInterval(() => {
        demoAnim++;
        if (type === "bug")    _drawDemoBug(ctx, demoAnim);
        if (type === "portal") _drawDemoPortal(ctx, demoAnim);
      }, 50);
    }
  
    function _stopDemo() {
      if (_demoInterval) { clearInterval(_demoInterval); _demoInterval = null; }
    }
  
    function _drawDemoBug(ctx, t) {
      const x = 480, y = 240, w = 48, h = 48;
      const blink = Math.sin(t * 0.3) > 0;
  
      ctx.save();
      ctx.shadowColor = "#ff2200";
      ctx.shadowBlur  = 14 + Math.sin(t * 0.3) * 6;
      ctx.fillStyle   = "#2a0000";
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle   = blink ? "#cc0000" : "#550000";
      ctx.fillRect(x+3, y+3, w-6, h-12);
      ctx.shadowBlur  = 0;
  
      if (blink) {
        ctx.fillStyle = "#ffdddd";
        const p = 3, ox = x+w/2-7, oy = y+6;
        ctx.fillRect(ox+p,   oy+p,   p, p);
        ctx.fillRect(ox+p*3, oy+p,   p, p);
        ctx.fillRect(ox,     oy+p*3, p, p);
        ctx.fillRect(ox+p*2, oy+p*3, p, p);
        ctx.fillRect(ox+p*4, oy+p*3, p, p);
      }
      ctx.fillStyle = "#550000";
      ctx.fillRect(x+12, y+h-6, w-24, 6);
      ctx.fillRect(x+w/2-7, y+h, 14, 6);
  
      ctx.fillStyle = "rgba(255,100,100,0.9)";
      ctx.font      = "bold 7px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText("BUG", x+w/2, y-8);
  
      // Anel de proximidade
      ctx.strokeStyle = `rgba(255,220,0,${0.4 + Math.sin(t*0.3)*0.4})`;
      ctx.lineWidth   = 2;
      ctx.setLineDash([3,3]);
      ctx.beginPath();
      ctx.arc(x+w/2, y+h/2, 55, 0, Math.PI*2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    }
  
    function _drawDemoPortal(ctx, t) {
      const x = 460, y = 220, w = 60, h = 60;
      ctx.save();
      ctx.shadowColor = "#cc44ff";
      ctx.shadowBlur  = 16 + Math.sin(t*0.1)*8;
      ctx.fillStyle   = `rgba(80,0,180,${0.5+Math.sin(t*0.1)*0.2})`;
      ctx.fillRect(x, y, w, h);
      ctx.fillStyle   = `rgba(200,100,255,${0.8+Math.sin(t*0.1)*0.2})`;
      ctx.fillRect(x,       y,       w, 3);
      ctx.fillRect(x,       y+h-3,   w, 3);
      ctx.fillRect(x,       y,       3, h);
      ctx.fillRect(x+w-3,   y,       3, h);
      ctx.shadowBlur  = 0;
      ctx.fillStyle   = "#ffffff";
      ctx.font        = "bold 7px 'Press Start 2P', monospace";
      ctx.textAlign   = "center";
      ctx.fillText("PORTAL", x+w/2, y+h/2-2);
      ctx.fillText(">>>",    x+w/2, y+h/2+12);
      ctx.fillStyle   = "#cc88ff";
      ctx.font        = "6px 'Press Start 2P', monospace";
      ctx.fillText("PROXIMO SETOR", x+w/2, y-10);
      ctx.restore();
    }
  
    // ── Teclado ───────────────────────────────────────────────
    document.addEventListener("keydown", e => {
      if (!isOpen) return;
      if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); }
      if (e.key === "ArrowLeft")  { e.preventDefault(); prev(); }
      if (e.key === "Escape")     { e.preventDefault(); close(); }
    });
  
    return { open, close, next, prev, isActive };
  
  })();