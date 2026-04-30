/* ============================================================
   assets/js/systems/player.js
   ============================================================ */

const Player = (() => {

  const sprite   = new Image();
  sprite.src     = "assets/img/player_clean5.png";
  sprite.onerror = () => console.error("[Player] player_clean5.png não encontrado!");

  const FRAME_W   = 193;
  const FRAME_H   = 316;
  const COL_COUNT = 4;

  const ROW = {
    up:    0,
    down:  1,
    left:  2,
    right: 3
  };

  const DRAW_W = 72;
  const DRAW_H = 120;
  const ANIM_SPEED = 10;

  const state = {
    x:         80,
    y:         80,
    size:      60,
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
    // Previne scroll com setas e espaço
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

    // Sem else if — permite movimento diagonal
    // Prioridade de direção: vertical tem prioridade sobre horizontal
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

    const srcX = frame         * FRAME_W;
    const srcY = ROW[facing]   * FRAME_H;

    ctx.drawImage(
      sprite,
      srcX, srcY,
      FRAME_W, FRAME_H,
      Math.floor(x), Math.floor(y),
      DRAW_W, DRAW_H
    );
  }

  return { state, update, draw, resetToRoomStart };

})();