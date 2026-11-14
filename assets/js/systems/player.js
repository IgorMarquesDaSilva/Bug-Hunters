/* ============================================================
   assets/js/systems/player.js
   Player com colisão por hitbox nos pés.
   Passos sincronizados com os frames da caminhada.
   Quando o jogador para, o sprite fica parado no frame idle.
============================================================ */

window.Player = (() => {
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
    blocked: false,
    lastMoveIntentAt: -Infinity,
    lastStepFrame: -1
  };

  const keys = {};
  let lastContact = '';
  let lastStepSoundTime = -Infinity;
  const movementInput = document.getElementById('game-movement-input');

  function focusMovement() {
    movementInput?.focus({ preventScroll: true });
  }

  // Um campo editável real faz o Narrador entregar as teclas ao navegador.
  // Ele é um controle do jogo: nenhum caractere deve permanecer digitado.
  movementInput?.addEventListener('beforeinput', event => event.preventDefault());
  movementInput?.addEventListener('input', () => { movementInput.value = ''; });
  movementInput?.addEventListener('paste', event => event.preventDefault());
  movementInput?.addEventListener('drop', event => event.preventDefault());
  document.addEventListener('pointerdown', event => {
    if (!GameState.difficulty || GameState.isPaused || GameState.isGameOver) return;
    if (!event.target.closest?.('#game-container') || event.target.closest('.overlay')) return;
    event.preventDefault();
    focusMovement();
  });
  const directionalInput = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  document.addEventListener("keydown", e => {
    if (GameState.isPaused || e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey) return;
    if (!GameState.difficulty || GameState.isGameOver) return;
    const key = e.key.toLowerCase();
    if (!["w","a","s","d","arrowup","arrowdown","arrowleft","arrowright"].includes(key)) return;
    if (e.target !== movementInput && e.target.closest?.('input, textarea, select, [contenteditable="true"]')) return;
    e.preventDefault();
    // Focar antes de registrar a tecla evita que focusin apague o movimento.
    focusMovement();
    const firstPress = !keys[key];
    keys[key] = true;
    // Toques curtos também andam, mesmo que soltar a tecla ocorra antes do próximo quadro.
    if (firstPress && !e.repeat) update();
  });

  document.addEventListener("keyup", e => {
    keys[e.key.toLowerCase()] = false;
  });
  document.addEventListener("focusin", clearDirectionInput);
  window.addEventListener("blur", clearDirectionInput);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearDirectionInput();
  });

  function getCurrentRoomName() {
    return typeof GameState !== 'undefined' ? GameState.currentRoom : 'sala1';
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

  function playStepIfNeeded(previousFrame, starting = false) {
    if (!starting && (!STEP_FRAMES.has(state.frame) || state.frame === previousFrame || state.lastStepFrame === state.frame)) return;
    const now = performance.now();
    if (now - lastStepSoundTime < 180) return;
    lastStepSoundTime = now;

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
      lastContact = '';
      state.blocked = false;
      stopWalkingAnimation();
      return;
    }

    const prevX = state.x;
    const prevY = state.y;

    let nx = state.x;
    let ny = state.y;
    let wantsToMove = false;

    if (keys["w"] || keys["arrowup"] || directionalInput.up) {
      ny -= state.speed;
      state.facing = "up";
      wantsToMove = true;
    } else if (keys["s"] || keys["arrowdown"] || directionalInput.down) {
      ny += state.speed;
      state.facing = "down";
      wantsToMove = true;
    }

    if (keys["a"] || keys["arrowleft"] || directionalInput.left) {
      nx -= state.speed;
      state.facing = "left";
      wantsToMove = true;
    } else if (keys["d"] || keys["arrowright"] || directionalInput.right) {
      nx += state.speed;
      state.facing = "right";
      wantsToMove = true;
    }

    if (wantsToMove) state.lastMoveIntentAt = performance.now();

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

    const contacts = resolved.contacts || [];
    if (wantsToMove && (state.x !== resolved.x || state.y !== resolved.y)) {
      const direction = nx < prevX ? 'à esquerda' : nx > prevX ? 'à direita' : ny < prevY ? 'acima' : 'abaixo';
      contacts.push({ key: 'map-edge', label: 'o limite da sala', direction });
    }
    state.blocked = contacts.length > 0;
    const contact = contacts[0];
    const contactKey = contact ? `${GameState.currentRoom}:${contact.key || contact.id}:${contact.direction}` : '';
    if (contact && contactKey !== lastContact) {
      window.AccessibilitySystem?.announce?.(
        `Colisão encontrada com ${contact.label || 'um objeto'}, ${contact.direction}. Tente outra direção.`,
        { key: 'collision', cooldown: 900 }
      );
    }
    lastContact = contactKey;

    const wasMoving = state.isMoving;
    const actuallyMoved = wantsToMove && (state.x !== prevX || state.y !== prevY);
    state.isMoving = actuallyMoved;

    if (actuallyMoved) {
      if (!wasMoving) playStepIfNeeded(-1, true);
      updateWalkingAnimation();
    } else {
      stopWalkingAnimation();
    }
  }

  function resetToRoomStart() {
    const roomStart = GameState.currentRoomData()?.playerStart;

    const safeStarts = {
      sala1: { x: 500, y: 420 },
      sala2: { x: 570, y: 490 },
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
    state.blocked = false;
    lastContact = '';
    lastStepSoundTime = -Infinity;
    state.lastMoveIntentAt = -Infinity;
  }

  function setDirectionInput(direction, isPressed) {
    if (!(direction in directionalInput)) return;
    directionalInput[direction] = Boolean(isPressed);
  }

  function clearDirectionInput() {
    Object.keys(keys).forEach(key => { keys[key] = false; });
    Object.keys(directionalInput).forEach(direction => {
      directionalInput[direction] = false;
    });
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
    resetToRoomStart,
    setDirectionInput,
    clearDirectionInput,
    focusMovement
  };
})();
