/* ============================================================
   assets/js/systems/player.js
   Personagem pixel art top-down — estilo RPG 16-bit.
   Visual: técnico/hacker com capuz, combinando com os mapas.
   ============================================================ */

const Player = (() => {

  const state = {
    x:         80,
    y:         80,
    size:      32,
    speed:     CONFIG.player.speed,
    dir:       1,       // 1=direita, -1=esquerda
    facing:    "down",  // "up"|"down"|"left"|"right"
    walkCycle: 0,
    isMoving:  false,
    frame:     0,       // 0 ou 1 (2 frames de animação)
    frameTimer:0
  };

  const keys = {};
  document.addEventListener("keydown", e => {
    keys[e.key] = true;
    // Previne scroll da página com setas
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) {
      e.preventDefault();
    }
  });
  document.addEventListener("keyup", e => { keys[e.key] = false; });

  function update() {
    if (GameState.isPaused) return;

    const prevX = state.x, prevY = state.y;
    let nx = state.x, ny = state.y;
    let moving = false;

    if (keys["w"] || keys["ArrowUp"])    { ny -= state.speed; state.facing = "up";    moving = true; }
    if (keys["s"] || keys["ArrowDown"])  { ny += state.speed; state.facing = "down";  moving = true; }
    if (keys["a"] || keys["ArrowLeft"])  { nx -= state.speed; state.facing = "left";  state.dir = -1; moving = true; }
    if (keys["d"] || keys["ArrowRight"]) { nx += state.speed; state.facing = "right"; state.dir =  1; moving = true; }

    // Colisão AABB
    const resolved = CollisionSystem.resolve(nx, ny, prevX, prevY, state.size);
    state.x = Math.max(0, Math.min(CONFIG.canvas.width  - state.size, resolved.x));
    state.y = Math.max(0, Math.min(CONFIG.canvas.height - state.size, resolved.y));

    // Animação de andar (troca frame a cada 8 ticks)
    state.isMoving = moving;
    if (moving) {
      state.walkCycle++;
      if (state.walkCycle % 10 === 0) state.frame = state.frame === 0 ? 1 : 0;
    } else {
      state.frame = 0;
      state.walkCycle = 0;
    }
  }

  function resetToRoomStart() {
    const start = GameState.currentRoomData()?.playerStart ?? { x: 80, y: 80 };
    state.x = start.x; state.y = start.y;
    state.dir = 1; state.facing = "down";
    state.walkCycle = 0; state.isMoving = false; state.frame = 0;
  }

  // ── Desenho pixel art top-down ────────────────────────────
  // Paleta do personagem (hacker com capuz verde)
  const C = {
    capuz:      "#1a3a1a",  // capuz verde escuro
    capuzBorda: "#2d6e1f",  // borda do capuz
    skin:       "#f5c18a",  // pele
    roupa:      "#223344",  // body azul escuro
    roupaAcc:   "#334455",  // detalhe da roupa
    calca:      "#1a2a3a",  // calça
    sapato:     "#111111",  // sapato
    tela:       "#00ffaa",  // tela do tablet
    telaBg:     "#003322",  // fundo tablet
    luva:       "#2a4a2a",  // luvas
    cinto:      "#886633",  // cinto
  };

  function draw(ctx) {
    const { x, y, size, dir, facing, frame, isMoving } = state;
    // Centro do sprite
    const cx = x + size / 2;
    const cy = y + size / 2;

    ctx.save();
    ctx.translate(cx, cy);

    // Espelha se indo para esquerda
    if (facing === "left") ctx.scale(-1, 1);
    else if (facing === "right") ctx.scale(1, 1);

    // Animação de pernas (alterna pixels de perna a cada frame)
    const legOff = isMoving ? (frame === 0 ? -2 : 2) : 0;

    // ── SOMBRA ──
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.fillRect(-10, 12, 20, 4);

    // ── SAPATOS ──
    ctx.fillStyle = C.sapato;
    ctx.fillRect(-8, 10 + legOff,     7, 4);   // pé esq
    ctx.fillRect(1,  10 - legOff,     7, 4);   // pé dir

    // ── CALÇA ──
    ctx.fillStyle = C.calca;
    ctx.fillRect(-7, 4 + legOff,      6, 8);   // perna esq
    ctx.fillRect(1,  4 - legOff,      6, 8);   // perna dir

    // ── CINTO ──
    ctx.fillStyle = C.cinto;
    ctx.fillRect(-8, 3, 16, 3);
    ctx.fillStyle = "#aaa";
    ctx.fillRect(-2, 3, 4, 3); // fivela

    // ── CORPO / JAQUETA ──
    ctx.fillStyle = C.roupa;
    ctx.fillRect(-9, -8, 18, 13);
    // Detalhes da jaqueta (linhas pixel)
    ctx.fillStyle = C.roupaAcc;
    ctx.fillRect(-9, -8, 3, 13);  // listra lateral
    ctx.fillRect(6,  -8, 3, 13);

    // Tablet/dispositivo na mão
    ctx.fillStyle = C.telaBg;
    ctx.fillRect(7, -5, 8, 6);
    ctx.fillStyle = C.tela;
    ctx.fillRect(8, -4, 6, 4);
    // Código piscando na tela do tablet
    if (isMoving || frame === 0) {
      ctx.fillStyle = "#003322";
      ctx.fillRect(9, -3, 4, 1);
      ctx.fillRect(9, -1, 2, 1);
    }

    // ── BRAÇOS ──
    ctx.fillStyle = C.luva;
    const armSwing = isMoving ? (frame === 0 ? -3 : 3) : 0;
    ctx.fillRect(-13, -7 + armSwing,  4, 9);  // braço esq
    ctx.fillRect(9,   -7 - armSwing,  4, 9);  // braço dir (segura tablet)

    // ── CABEÇA ──
    ctx.fillStyle = C.skin;
    ctx.fillRect(-7, -18, 14, 12);

    // Olhos (pixel 2x2)
    ctx.fillStyle = "#333";
    ctx.fillRect(-5, -13, 2, 2);
    ctx.fillRect(3,  -13, 2, 2);

    // Boca (sorriso pixel)
    ctx.fillStyle = "#c08060";
    ctx.fillRect(-3, -9, 2, 1);
    ctx.fillRect(1,  -9, 2, 1);

    // ── CAPUZ ──
    ctx.fillStyle = C.capuz;
    ctx.fillRect(-9, -22, 18, 14);  // topo do capuz
    ctx.fillRect(-10,-16, 4, 10);   // lateral esq
    ctx.fillRect(6,  -16, 4, 10);   // lateral dir

    // Borda interna do capuz (emoldura o rosto)
    ctx.fillStyle = C.capuzBorda;
    ctx.fillRect(-7, -20, 14, 3);   // topo
    ctx.fillRect(-9, -18, 3, 12);   // lado esq
    ctx.fillRect(6,  -18, 3, 12);   // lado dir

    // Símbolo no capuz (bug/código)
    ctx.fillStyle = C.tela;
    ctx.font      = "bold 6px monospace";
    ctx.textAlign = "center";
    ctx.fillText("</>", 0, -21);

    // Fone de ouvido (pixel)
    ctx.fillStyle = "#333";
    ctx.fillRect(-11,-14, 3, 6);
    ctx.fillRect(8,  -14, 3, 6);
    ctx.fillStyle = "#00ffaa";
    ctx.fillRect(-10,-12, 2, 2); // luz do fone

    ctx.restore();
  }

  return { state, update, draw, resetToRoomStart };
})();
