/* ============================================================
   assets/js/systems/player.js
   Player com colisão por hitbox nos pés.
   Corrigido para não nascer preso em objetos do mapa HTML/CSS.
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
  
    const state = {
      x: 500,
      y: 420,
  
      drawW: DRAW_W,
      drawH: DRAW_H,
  
      hitboxW: 30,
      hitboxH: 22,
      hitboxOffsetX: 21,
      hitboxOffsetY: 92,
  
      speed: CONFIG.player.speed,
      facing: "down",
      frame: 0,
      walkTimer: 0,
      isMoving: false
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
  
    function update() {
      if (GameState.isPaused) return;
  
      const prevX = state.x;
      const prevY = state.y;
  
      let nx = state.x;
      let ny = state.y;
      let moving = false;
  
      if (keys["w"] || keys["arrowup"]) {
        ny -= state.speed;
        state.facing = "up";
        moving = true;
      } else if (keys["s"] || keys["arrowdown"]) {
        ny += state.speed;
        state.facing = "down";
        moving = true;
      }
  
      if (keys["a"] || keys["arrowleft"]) {
        nx -= state.speed;
        state.facing = "left";
        moving = true;
      } else if (keys["d"] || keys["arrowright"]) {
        nx += state.speed;
        state.facing = "right";
        moving = true;
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
  
      state.isMoving = moving;
  
      state.walkTimer++;
  
      if (state.walkTimer >= ANIM_SPEED) {
        state.walkTimer = 0;
        state.frame = (state.frame + 1) % COL_COUNT;
      }
    }
  
    function resetToRoomStart() {
      const safeStarts = {
        sala1: { x: 500, y: 420 },
        sala2: { x: 500, y: 420 }
      };
  
      const start = safeStarts[GameState.currentRoom] || { x: 500, y: 420 };
  
      state.x = start.x;
      state.y = start.y;
      state.facing = "down";
      state.frame = 0;
      state.walkTimer = 0;
      state.isMoving = false;
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