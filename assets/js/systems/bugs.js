/* ============================================================
   assets/js/systems/bugs.js
   Bugs no mapa, portal, detecção de proximidade e render.
   FIX: checkProximity respeita popupCooldown e activeIdx
        Portal desenha com fonte pixel-art correta
        Bug sprite pixel art (computador com vírus)
   ============================================================ */

const BugSystem = (() => {

  function spawnBugs() {
    const roomData = GameState.currentRoomData();
    const missions = GameState.currentMissions();
    if (!roomData || !missions.length) return;

    const positions = roomData.bugPositions;
    GameState.bugs = missions.map((m, i) => ({
      x:          positions[i]?.x ?? 80 + i * 170,
      y:          positions[i]?.y ?? 200,
      w:          32, h: 32,
      solved:     false,
      pulse:      Math.random() * Math.PI * 2,
      missionIdx: i
    }));
  }

  // ── Portal ────────────────────────────────────────────────
  function drawPortal(ctx) {
    if (!GameState.portal.visible) return;
    const rd = GameState.currentRoomData();
    if (!rd) return;

    const { x: px, y: py } = rd.portalPosition;
    const pw = CONFIG.portal.width, ph = CONFIG.portal.height;

    GameState.portal.pulse += 0.05;
    const t = GameState.portal.pulse;

    // Moldura pixel pulsante
    ctx.save();
    ctx.shadowColor = "#cc44ff";
    ctx.shadowBlur  = 16 + Math.sin(t) * 8;

    // Corpo do portal
    ctx.fillStyle = `rgba(80,0,180,${0.5 + Math.sin(t)*0.2})`;
    ctx.fillRect(px, py, pw, ph);

    // Borda pixel (4 lados com espessura 3px)
    ctx.fillStyle = `rgba(200,100,255,${0.8 + Math.sin(t)*0.2})`;
    ctx.fillRect(px,        py,        pw, 3);   // top
    ctx.fillRect(px,        py+ph-3,   pw, 3);   // bottom
    ctx.fillRect(px,        py,        3, ph);   // left
    ctx.fillRect(px+pw-3,   py,        3, ph);   // right

    ctx.shadowBlur = 0;

    // Texto pixel art
    ctx.fillStyle  = "#ffffff";
    ctx.font       = "bold 7px 'Press Start 2P', monospace";
    ctx.textAlign  = "center";
    ctx.fillText("PORTAL", px + pw/2, py + ph/2 - 4);
    ctx.fillText(">>>",    px + pw/2, py + ph/2 + 8);

    ctx.fillStyle = "#cc88ff";
    ctx.font      = "6px 'Press Start 2P', monospace";
    ctx.fillText("PROXIMO SETOR", px + pw/2, py - 8);

    ctx.restore();
  }

  function checkPortal() {
    if (!GameState.portal.visible || GameState.portal.triggered || GameState.isPaused) return;
    const rd = GameState.currentRoomData();
    if (!rd) return;

    const { x: px, y: py } = rd.portalPosition;
    const ps = Player.state;
    const dist = Math.hypot(
      (ps.x + ps.size/2) - (px + CONFIG.portal.width/2),
      (ps.y + ps.size/2) - (py + CONFIG.portal.height/2)
    );
    if (dist < CONFIG.portal.triggerDist) {
      GameState.portal.triggered = true;
      UI.showScreen("screen-next-level");
    }
  }

  // ── Proximidade de bug ─────────────────────────────────────
  function checkProximity() {
    // FIX: respeita cooldown e garante que activeIdx=-1 antes de reabrir
    if (GameState.isPaused) return;
    if (GameState.activeIdx !== -1) return;
    if (GameState.popupCooldown > 0) {
      GameState.popupCooldown--;
      return;
    }

    const ps = Player.state;
    for (let i = 0; i < GameState.bugs.length; i++) {
      const bug = GameState.bugs[i];
      if (bug.solved) continue;

      const dist = Math.hypot(
        (ps.x + ps.size/2) - (bug.x + bug.w/2),
        (ps.y + ps.size/2) - (bug.y + bug.h/2)
      );

      if (dist < CONFIG.player.bugProximity) {
        GameState.activeIdx = i;
        const mission = GameState.currentMissions()[bug.missionIdx];
        const title   = mission.title.split("—")[1]?.trim() ?? mission.title;
        document.getElementById("popup-bug-desc").textContent = "BUG DETECTADO: " + title;
        UI.showScreen("screen-bug-popup");
        break; // só abre um por vez
      }
    }
  }

  // ── Render ────────────────────────────────────────────────
  function draw(ctx) {
    drawPortal(ctx);
    checkPortal();

    const ps = Player.state;

    GameState.bugs.forEach(bug => {
      if (bug.solved) {
        _drawBugSolved(ctx, bug);
        return;
      }
      _drawBugActive(ctx, bug, ps);
    });
  }

  // Bug resolvido — monitor verde com checkmark
  function _drawBugSolved(ctx, bug) {
    const { x, y, w, h } = bug;
    ctx.save();
    // Monitor
    ctx.fillStyle = "#1a3d1a";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#00ff88";
    ctx.fillRect(x+2, y+2, w-4, h-8);
    // Check
    ctx.fillStyle = "#001a00";
    ctx.font      = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText("✓", x+w/2, y+h/2+3);
    // Base do monitor
    ctx.fillStyle = "#2d6e1f";
    ctx.fillRect(x+10, y+h-4, w-20, 4);
    ctx.fillRect(x+w/2-6, y+h, 12, 4);
    ctx.restore();
  }

  // Bug ativo — monitor vermelho pulsante com caveirinha pixel
  function _drawBugActive(ctx, bug, ps) {
    const { x, y, w, h } = bug;
    bug.pulse += 0.06;
    const t     = bug.pulse;
    const blink = Math.sin(t) > 0;

    ctx.save();

    // Glow vermelho
    ctx.shadowColor = "#ff2200";
    ctx.shadowBlur  = 10 + Math.sin(t)*6;

    // Monitor externo
    ctx.fillStyle = "#2a0000";
    ctx.fillRect(x, y, w, h);

    // Tela do monitor (pisca entre vermelho e escuro)
    ctx.fillStyle = blink ? "#cc0000" : "#550000";
    ctx.fillRect(x+2, y+2, w-4, h-8);

    ctx.shadowBlur = 0;

    // Caveirinha pixel (5x5 pixels de 2px cada)
    if (blink) {
      ctx.fillStyle = "#ffdddd";
      const px2 = 2; // tamanho de cada "pixel" do sprite
      const ox  = x + w/2 - 5;
      const oy  = y + 4;
      // olhos
      ctx.fillRect(ox+px2,    oy+px2,   px2, px2);
      ctx.fillRect(ox+px2*3,  oy+px2,   px2, px2);
      // boca
      ctx.fillRect(ox,        oy+px2*3, px2, px2);
      ctx.fillRect(ox+px2*2,  oy+px2*3, px2, px2);
      ctx.fillRect(ox+px2*4,  oy+px2*3, px2, px2);
    }

    // Base
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#550000";
    ctx.fillRect(x+8, y+h-4, w-16, 4);
    ctx.fillRect(x+w/2-5, y+h, 10, 4);

    // Label "BUG"
    ctx.fillStyle = "rgba(255,100,100,0.9)";
    ctx.font      = "bold 6px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText("BUG", x+w/2, y-4);

    ctx.restore();

    // Linha tracejada de conexão ao player
    const dist = Math.hypot(
      (ps.x+ps.size/2)-(bug.x+bug.w/2),
      (ps.y+ps.size/2)-(bug.y+bug.h/2)
    );
    if (dist < CONFIG.player.lineDrawDist) {
      const alpha = (1 - dist/CONFIG.player.lineDrawDist) * 0.5;
      ctx.strokeStyle = `rgba(255,60,60,${alpha})`;
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 6]);
      ctx.beginPath();
      ctx.moveTo(ps.x+ps.size/2, ps.y+ps.size/2);
      ctx.lineTo(bug.x+bug.w/2,  bug.y+bug.h/2);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Indicador de proximidade (anel que aparece bem perto)
    if (dist < CONFIG.player.bugProximity * 1.5) {
      ctx.strokeStyle = `rgba(255,200,0,${0.6 + Math.sin(t)*0.3})`;
      ctx.lineWidth   = 2;
      ctx.setLineDash([3,3]);
      ctx.beginPath();
      ctx.arc(bug.x+bug.w/2, bug.y+bug.h/2, CONFIG.player.bugProximity*0.9, 0, Math.PI*2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Texto "PRESSIONE ESPAÇO" piscando
      if (blink) {
        ctx.fillStyle = "rgba(255,220,0,0.9)";
        ctx.font      = "5px 'Press Start 2P', monospace";
        ctx.textAlign = "center";
        ctx.fillText("APROXIME-SE!", bug.x+bug.w/2, bug.y+bug.h+18);
      }
    }
  }

  return { spawnBugs, draw, checkProximity };
})();
