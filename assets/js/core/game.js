/* ============================================================
   assets/js/core/game.js  —  Game loop e ponto de entrada
   ============================================================ */

   const canvas = document.getElementById("gameCanvas");
   const ctx    = canvas.getContext("2d");
   
   // ── Carrega dados ─────────────────────────────────────────────
   async function loadGameData() {
     try {
       const [mr, rr] = await Promise.all([
         fetch("assets/js/data/missions.json"),
         fetch("assets/js/data/rooms.json")
       ]);
       GameState.missionsData = await mr.json();
       GameState.roomsData    = await rr.json();
     } catch (err) {
       console.warn("[Game] fetch falhou — usando dados inline.");
       GameState.missionsData = MISSIONS_INLINE;
       GameState.roomsData    = ROOMS_INLINE;
     }
   
     HUD.update();
   
     const platformDiff = getPlatformDifficulty();
     if (platformDiff) selectDifficulty(platformDiff);
     else              UI.showScreen("screen-difficulty");
   }
   
   // ── Dificuldade ───────────────────────────────────────────────
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
   
     // Abre tutorial se for a primeira vez
     TutorialSystem.open();
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
     TransitionSystem.update();           // atualiza animação de transição
     if (!TutorialSystem.isActive()) {    // bloqueia movimento durante tutorial
       Player.update();
     }
     if (!GameState.isPaused) BugSystem.checkProximity();
   }
   
   // ── Draw ──────────────────────────────────────────────────────
   function draw() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     Renderer.drawBackground(ctx, canvas);
     BugSystem.draw(ctx);
     CollisionSystem.drawDebug(ctx);
     Player.draw(ctx);
     TransitionSystem.draw(ctx, canvas);  // sobrepõe a transição por cima de tudo
   }
   
   // ── Game loop ─────────────────────────────────────────────────
   function gameLoop() {
     update();
     draw();
     requestAnimationFrame(gameLoop);
   }
   
   // ── Controles mobile ──────────────────────────────────────────
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
       const press   = () => keys.forEach(k => document.dispatchEvent(new KeyboardEvent("keydown", { key:k, bubbles:true })));
       const release = () => keys.forEach(k => document.dispatchEvent(new KeyboardEvent("keyup",   { key:k, bubbles:true })));
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