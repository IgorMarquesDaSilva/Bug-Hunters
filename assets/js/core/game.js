/* ============================================================
   assets/js/core/game.js  —  Game loop e ponto de entrada
   ============================================================ */

   const canvas = document.getElementById("gameCanvas");
   const ctx    = canvas.getContext("2d");
   const transitionCanvas = document.getElementById("transitionCanvas");
   const transitionCtx = transitionCanvas.getContext("2d");
   
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

     ResultsScreen.cancel();
     GameState.resetFull();
     GameState.difficulty  = selectedDifficulty;
     GameState.currentRoom = "sala1";
     
   
     Renderer.loadRoomBackground();
     BugSystem.spawnBugs();
     CollisionSystem.loadZones();
     Player.resetToRoomStart();
     GameState.startRun();
     HUD.update();
     UI.showScreen(null);
     window.GameAudio?.playRoom(GameState.currentRoom);
     
   
     // Abre tutorial se for a primeira vez
     TutorialSystem.open();
   }
   
   function backToMenu() {
     if (TransitionSystem.isActive()) return;
     ResultsScreen.cancel();
     TransitionSystem.play(() => {
       GameState.resetFull();
       HUD.update();
       UI.showScreen("screen-main-menu");
       window.GameAudio?.playMenuAmbient();
     }, { fullscreen: true, label: 'VOLTANDO AO MENU...' });
   }
   
   function restartGame() {
     if (TransitionSystem.isActive()) return;
     const prev = GameState.difficulty;
     if (!prev) { backToMenu(); return; }
     ResultsScreen.cancel();
     TransitionSystem.play(() => selectDifficulty(prev), {
       fullscreen: true, label: 'INICIANDO NOVA PARTIDA...'
     });
   }
   
   // ── Update ────────────────────────────────────────────────────
   function update() {
     HUD.updateClock();
     TransitionSystem.update();           // atualiza animação de transição
     if (GameState.isGameOver) return;
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
     transitionCtx.clearRect(0, 0, transitionCanvas.width, transitionCanvas.height);
     TransitionSystem.draw(transitionCtx, transitionCanvas);
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
