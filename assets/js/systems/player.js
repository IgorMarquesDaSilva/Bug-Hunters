/* ============================================================
   assets/js/systems/player.js
   VERSÃO FINAL: Suporte a 5 linhas (Idle) | 800x1660px
   ============================================================ */

   const Player = (() => {

    const sprite = new Image();
    // Lembre-se de salvar a imagem final como player_SF.png
    sprite.src = "assets/img/player3.png"; 
    sprite.onerror = () => console.error("[Player] player3.png não encontrado!");
  
    // Proporções baseadas na imagem de 800x1660px
    const FRAME_W = 200;  // 800px / 4 colunas
    const FRAME_H = 332;  // 1660px / 5 linhas
    const COL_COUNT = 4;
  
    // Mapeamento das linhas da Spritesheet
    const ROW = {
      up:    0,
      down:  1,
      left:  2,
      right: 3,
      idle:  4  // Linha da animação parado
    };
  
    // Tamanho de exibição no Canvas
    const DRAW_W = 72;
    const DRAW_H = 120;
    const ANIM_SPEED = 10;
  
    const state = {
      x: 80,
      y: 80,
      size: 60, // Área de colisão
      speed: CONFIG.player.speed,
      facing: "down",
      frame: 0,
      walkTimer: 0,
      isMoving: false
    };
  
    const keys = {};
  
    // Gerenciamento de Inputs
    document.addEventListener("keydown", e => {
      keys[e.key.toLowerCase()] = true;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))
        e.preventDefault();
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
  
      // Lógica de Movimento
      if (keys["w"] || keys["arrowup"])    { ny -= state.speed; state.facing = "up";    moving = true; }
      else if (keys["s"] || keys["arrowdown"]) { ny += state.speed; state.facing = "down";  moving = true; }
      
      if (keys["a"] || keys["arrowleft"])  { nx -= state.speed; state.facing = "left";  moving = true; }
      else if (keys["d"] || keys["arrowright"]){ nx += state.speed; state.facing = "right"; moving = true; }
  
      // Resolução de Colisão
      const resolved = CollisionSystem.resolve(nx, ny, prevX, prevY, state.size);
      
      // Limites do Canvas (evita que o pé suma ou o personagem saia da tela)
      state.x = Math.max(0, Math.min(CONFIG.canvas.width - DRAW_W, resolved.x));
      state.y = Math.max(0, Math.min(CONFIG.canvas.height - DRAW_H, resolved.y));
  
      state.isMoving = moving;
  
      // Atualização do Frame (sempre rodando para o Idle funcionar)
      state.walkTimer++;
      if (state.walkTimer >= ANIM_SPEED) {
        state.walkTimer = 0;
        state.frame = (state.frame + 1) % COL_COUNT;
      }
    }
  
    function resetToRoomStart() {
      const start = GameState.currentRoomData()?.playerStart ?? { x: 80, y: 80 };
      state.x = start.x;
      state.y = start.y;
      state.facing = "down";
      state.frame = 0;
      state.walkTimer = 0;
      state.isMoving = false;
    }
  
    function draw(ctx) {
      if (!sprite.complete || sprite.naturalWidth === 0) return;
  
      const { x, y, facing, frame, isMoving } = state;
  
      const srcX = frame * FRAME_W;
      
      // Escolha da linha: Se estiver andando, usa a direção. Se não, usa a linha 4.
      const currentRow = isMoving ? ROW[facing] : ROW.idle;
      const srcY = currentRow * FRAME_H;
  
      ctx.drawImage(
        sprite,
        srcX, srcY,     // Origem no arquivo
        FRAME_W, FRAME_H, // Tamanho do corte
        Math.floor(x), Math.floor(y), // Destino no Canvas
        DRAW_W, DRAW_H  // Tamanho final desenhado
      );
    }
  
    return { state, update, draw, resetToRoomStart };
  
  })();