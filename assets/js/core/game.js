/* ============================================================
   assets/js/core/game.js  —  Game loop e ponto de entrada
   ============================================================ */

   const canvas = document.getElementById("gameCanvas");
   const ctx    = canvas.getContext("2d");
   
   // ── Carrega dados ─────────────────────────────────────────────
   async function loadGameData() {
     const [mr, rr] = await Promise.all([
       fetch("assets/js/data/missions.json"),
       fetch("assets/js/data/rooms.json")
     ]);

     if (!mr.ok || !rr.ok) {
       throw new Error("Nao foi possivel carregar os arquivos JSON do jogo.");
     }

     GameState.missionsData = await mr.json();
     GameState.roomsData    = await rr.json();
   
     HUD.update();
   
     /*
      * A tela inicial deve aparecer antes da escolha de dificuldade.
      * O mapa já fica renderizado ao fundo, e o menu funciona como
      * uma camada transparente sobre a primeira sala.
      */
     UI.showMainMenu();
   }
   
   // ── Dificuldade ───────────────────────────────────────────────
   function selectDifficulty(diff) {
     const selectedDifficulty = getPlatformDifficulty() || diff;

     if (!CONFIG.difficulties[selectedDifficulty]) return;

     GameState.resetFull();
     GameState.difficulty  = selectedDifficulty;
     GameState.currentRoom = "sala1";
     
   
     Renderer.loadRoomBackground();
     BugSystem.spawnBugs();
     CollisionSystem.loadZones();
     Player.resetToRoomStart();
     HUD.update();
     UI.showScreen(null);
     
   
     // Abre tutorial se for a primeira vez
     TutorialSystem.open();
   }
   
   function backToMenu() {
     GameState.resetFull();
     HUD.update();
     UI.showScreen("screen-main-menu");
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
   
   // ── Init ──────────────────────────────────────────────────────
   loadGameData()
     .then(() => {
       window.MobileControls?.init();
       gameLoop();
     })
     .catch(error => {
       console.error("[Game] Falha ao carregar os dados externos:", error);
     });
