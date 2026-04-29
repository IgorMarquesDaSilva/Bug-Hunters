/* ============================================================
   assets/js/systems/player.js

   USA: assets/img/player_final2.png  (384x512px)
   Grade: 4 colunas x 4 linhas | cada frame: 96x128px
   Linha 0=baixo | 1=esquerda | 2=cima | 3=direita
   ============================================================ */

const Player = (() => {

  const sprite   = new Image();
  sprite.src     = "assets/img/player_final2.png";
  sprite.onerror = () => console.error("[Player] player_final2.png não encontrado!");

  const FRAME_W   = 96;
  const FRAME_H   = 128;
  const COL_COUNT = 4;

  const ROW = {
    down:  0,
    left:  1,
    up:    2,
    right: 3
  };

  const DRAW_W = 48;
  const DRAW_H = 64;

  const ANIM_SPEED = 10;

  const state = {
    x:         80,
    y:         80,
    size:      DRAW_W,
    speed:     CONFIG.player.speed,
    facing:    "down",
    frame:     0,
    walkTimer: 0,
    isMoving:  false
  };

  // ── Input ─────────────────────────────────────────────────
  const keys = {};

  document.addEventListener("keydown", e => {
    keys[e.key] = true;
    if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))
      e.preventDefault();
  });

  document.addEventListener("keyup", e => {
    keys[e.key] = false;
  });

  // ── Update ────────────────────────────────────────────────
  function update() {
    if (GameState.isPaused) return;

    const prevX = state.x;
    const prevY = state.y;
    let nx      = state.x;
    let ny      = state.y;
    let moving  = false;

    if (keys["w"] || keys["W"] || keys["ArrowUp"])    { ny -= state.speed; state.facing = "up";    moving = true; }
    if (keys["s"] || keys["S"] || keys["ArrowDown"])  { ny += state.speed; state.facing = "down";  moving = true; }
    if (keys["a"] || keys["A"] || keys["ArrowLeft"])  { nx -= state.speed; state.facing = "left";  moving = true; }
    if (keys["d"] || keys["D"] || keys["ArrowRight"]) { nx += state.speed; state.facing = "right"; moving = true; }

    const resolved = CollisionSystem.resolve(nx, ny, prevX, prevY, state.size);
    state.x = Math.max(0, Math.min(CONFIG.canvas.width  - DRAW_W, resolved.x));
    state.y = Math.max(0, Math.min(CONFIG.canvas.height - DRAW_H, resolved.y));

    state.isMoving = moving;

    if (moving) {
      state.walkTimer++;
      if (state.walkTimer >= ANIM_SPEED) {
        state.walkTimer = 0;
        state.frame     = (state.frame + 1) % COL_COUNT;
      }
    } else {
      state.frame     = 0;
      state.walkTimer = 0;
    }
  }

  // ── Reset ─────────────────────────────────────────────────
  function resetToRoomStart() {
    const start     = GameState.currentRoomData()?.playerStart ?? { x: 80, y: 80 };
    state.x         = start.x;
    state.y         = start.y;
    state.facing    = "down";
    state.frame     = 0;
    state.walkTimer = 0;
    state.isMoving  = false;
  }

  // ── Draw ──────────────────────────────────────────────────
  function draw(ctx) {
    if (!sprite.complete || sprite.naturalWidth === 0) return;

    const { x, y, facing, frame } = state;

    const safeFrame = Math.min(frame, COL_COUNT - 1);

    // +1px de margem para evitar vazamento dos pixels da linha adjacente
    const srcX = safeFrame   * FRAME_W + 1;
    const srcY = ROW[facing] * FRAME_H + 1;

    ctx.drawImage(
      sprite,
      srcX, srcY,             // recorte com margem de 1px
      FRAME_W - 2, FRAME_H - 2, // 2px a menos (1px de cada lado)
      x, y,
      DRAW_W, DRAW_H
    );
  }

  return { state, update, draw, resetToRoomStart };

})();