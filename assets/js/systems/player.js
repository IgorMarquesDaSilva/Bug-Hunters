/* ============================================================
   assets/js/systems/player.js
   Player com colisão por hitbox nos pés.
   Passos sincronizados com os frames da caminhada.
   Quando o jogador para, o sprite fica parado no frame idle.
============================================================ */

const Player = (() => {
  const sprite = new Image();
  sprite.src = "assets/img/player3.png";
  sprite.onerror = () => console.error("[Player] player3.png não encontrado!");

  const FRAME_W = 200;
  const FRAME_H = 332;
  const COL_COUNT = 4;

  const ROW = {
    up: 0,
    down: 1,
    left: 2,
    right: 3,
    idle: 4
  };

  const DRAW_W = 72;
  const DRAW_H = 120;
  const ANIM_SPEED = 10;

  // Frames em que o pé “encosta” no chão.
  // Como a imagem tem 4 colunas, usamos dois contatos por ciclo:
  // frame 1 = um pé, frame 3 = outro pé.
  const STEP_FRAMES = new Set([1, 3]);

  const state = {
    x: 500,
    y: 420,

    drawW: DRAW_W,
    drawH: DRAW_H,

    hitboxW: 24,
    hitboxH: 13,
    hitboxOffsetX: 30,
    hitboxOffsetY: 90,
    

    speed: CONFIG.player.speed,
    facing: "down",
    frame: 0,
    walkTimer: 0,
    isMoving: false,
    lastStepFrame: -1
  };

  const keys = {};

  document.addEventListener("keydown", e => {
    keys[e.key.toLowerCase()] = true;

    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
      e.preventDefault();
    }
  });

  document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
  });

  function getCurrentRoomName() {
    return window.GameState?.currentRoom || "sala1";
  }

  function stopWalkingAnimation() {
    state.isMoving = false;
    state.walkTimer = 0;
    state.frame = 0;
    state.lastStepFrame = -1;

    if (window.GameAudio?.updateFootsteps) {
      GameAudio.updateFootsteps(false);
    }
  }

  function playStepIfNeeded(previousFrame) {
    if (!STEP_FRAMES.has(state.frame)) return;
    if (state.frame === previousFrame) return;
    if (state.lastStepFrame === state.frame) return;

    state.lastStepFrame = state.frame;

    if (window.GameAudio?.ensureGameAmbient) {
      GameAudio.ensureGameAmbient();
    }

    if (window.GameAudio?.playFootstep) {
      GameAudio.playFootstep(getCurrentRoomName());
    }
  }

  function updateWalkingAnimation() {
    const previousFrame = state.frame;

    state.walkTimer++;

    if (state.walkTimer >= ANIM_SPEED) {
      state.walkTimer = 0;
      state.frame = (state.frame + 1) % COL_COUNT;
      playStepIfNeeded(previousFrame);
    }
  }

  function update() {
    if (GameState.isPaused) {
      stopWalkingAnimation();
      return;
    }

    const prevX = state.x;
    const prevY = state.y;

    let nx = state.x;
    let ny = state.y;
    let wantsToMove = false;

    if (keys["w"] || keys["arrowup"]) {
      ny -= state.speed;
      state.facing = "up";
      wantsToMove = true;
    } else if (keys["s"] || keys["arrowdown"]) {
      ny += state.speed;
      state.facing = "down";
      wantsToMove = true;
    }

    if (keys["a"] || keys["arrowleft"]) {
      nx -= state.speed;
      state.facing = "left";
      wantsToMove = true;
    } else if (keys["d"] || keys["arrowright"]) {
      nx += state.speed;
      state.facing = "right";
      wantsToMove = true;
    }

    const resolved = CollisionSystem.resolve(
      nx,
      ny,
      prevX,
      prevY,
      state.hitboxW,
      state.hitboxH,
      state.hitboxOffsetX,
      state.hitboxOffsetY
    );

    state.x = Math.max(0, Math.min(CONFIG.canvas.width - DRAW_W, resolved.x));
    state.y = Math.max(0, Math.min(CONFIG.canvas.height - DRAW_H, resolved.y));

    const actuallyMoved = wantsToMove && (state.x !== prevX || state.y !== prevY);
    state.isMoving = actuallyMoved;

    if (actuallyMoved) {
      updateWalkingAnimation();
    } else {
      stopWalkingAnimation();
    }
  }

  function resetToRoomStart() {
    const roomStart = GameState.currentRoomData()?.playerStart;

    const safeStarts = {
      sala1: { x: 500, y: 420 },
      sala2: { x: 500, y: 420 },
      sala3: { x: 305, y: 430 },
      sala4: { x: 480, y: 430 }
    };

    const start = roomStart || safeStarts[GameState.currentRoom] || { x: 500, y: 420 };

    state.x = start.x;
    state.y = start.y;
    state.facing = "down";
    state.frame = 0;
    state.walkTimer = 0;
    state.isMoving = false;
    state.lastStepFrame = -1;
  }

  function draw(ctx) {
    if (!sprite.complete || sprite.naturalWidth === 0) return;

    const srcX = state.frame * FRAME_W;
    const currentRow = state.isMoving ? ROW[state.facing] : ROW.idle;
    const srcY = currentRow * FRAME_H;

    ctx.drawImage(
      sprite,
      srcX,
      srcY,
      FRAME_W,
      FRAME_H,
      Math.floor(state.x),
      Math.floor(state.y),
      DRAW_W,
      DRAW_H
    );
  }

  return {
    state,
    update,
    draw,
    resetToRoomStart
  };
})();
