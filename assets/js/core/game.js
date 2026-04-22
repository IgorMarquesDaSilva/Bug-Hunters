/* ============================================================
   assets/js/core/game.js  —  Game loop e ponto de entrada
   FIX: fetch com fallback inline se servidor não disponível
        Controles mobile adicionados
        draw() não executa durante isPaused para performance
   ============================================================ */

const canvas = document.getElementById("gameCanvas");
const ctx    = canvas.getContext("2d");

// ── Carrega JSON externos ────────────────────────────────────
async function loadGameData() {
  try {
    const [mr, rr] = await Promise.all([
      fetch("assets/js/data/missions.json"),
      fetch("assets/js/data/rooms.json")
    ]);
    GameState.missionsData = await mr.json();
    GameState.roomsData    = await rr.json();
    console.log("[Game] Dados carregados via fetch.");
  } catch (err) {
    console.warn("[Game] fetch falhou — usando dados inline:", err.message);
    // Dados inline de fallback (mesmo conteúdo dos JSONs)
    GameState.missionsData = MISSIONS_INLINE;
    GameState.roomsData    = ROOMS_INLINE;
  }

  HUD.update();

  const platformDiff = getPlatformDifficulty();
  if (platformDiff) selectDifficulty(platformDiff);
  else              UI.showScreen("screen-difficulty");
}

// ── Seleção de dificuldade ────────────────────────────────────
function selectDifficulty(diff) {
  if (!CONFIG.difficulties[diff]) return;
  GameState.resetFull();
  GameState.difficulty  = diff;
  GameState.lives       = CONFIG.difficulties[diff].lives;
  GameState.currentRoom = "sala1";

  CollisionSystem.loadZones();
  Renderer.loadRoomBackground();
  BugSystem.spawnBugs();
  Player.resetToRoomStart();
  HUD.update();
  UI.showScreen(null);
}

function backToMenu() {
  GameState.resetFull();
  HUD.update();
  UI.showScreen("screen-difficulty");
}

function restartGame() {
  const prev = GameState.difficulty;
  if (prev) selectDifficulty(prev);
  else      backToMenu();
}

// ── Update ────────────────────────────────────────────────────
function update() {
  if (GameState.isGameOver) return;
  Player.update();
  if (!GameState.isPaused) BugSystem.checkProximity();
}

// ── Draw ──────────────────────────────────────────────────────
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  Renderer.drawBackground(ctx, canvas);
  BugSystem.draw(ctx);
  CollisionSystem.drawDebug(ctx);
  Player.draw(ctx);
}

// ── Game loop ─────────────────────────────────────────────────
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// ── Controles mobile (D-pad virtual) ─────────────────────────
function setupMobileControls() {
  const map = {
    "btn-up":    ["ArrowUp",    "w"],
    "btn-down":  ["ArrowDown",  "s"],
    "btn-left":  ["ArrowLeft",  "a"],
    "btn-right": ["ArrowRight", "d"]
  };

  Object.entries(map).forEach(([id, keys]) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    const press   = () => keys.forEach(k => { const e = new KeyboardEvent("keydown",{key:k,bubbles:true}); document.dispatchEvent(e); });
    const release = () => keys.forEach(k => { const e = new KeyboardEvent("keyup",  {key:k,bubbles:true}); document.dispatchEvent(e); });
    btn.addEventListener("touchstart", e => { e.preventDefault(); press();   }, { passive: false });
    btn.addEventListener("touchend",   e => { e.preventDefault(); release(); }, { passive: false });
    btn.addEventListener("mousedown",  press);
    btn.addEventListener("mouseup",    release);
    btn.addEventListener("mouseleave", release);
  });
}

// ── Init ──────────────────────────────────────────────────────
loadGameData().then(() => {
  setupMobileControls();
  gameLoop();
});
