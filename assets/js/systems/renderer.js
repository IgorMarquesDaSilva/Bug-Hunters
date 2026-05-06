/* ============================================================
   assets/js/systems/renderer.js
   Agora o mapa é HTML/CSS.
   O canvas fica transparente e renderiza apenas bugs, player,
   portal, debug e transições.
   ============================================================ */

   const Renderer = (() => {

    function loadRoomBackground() {
      const map = document.getElementById("room-map");
      if (!map) return;
  
      map.classList.remove("sala1", "sala2");
      map.classList.add(GameState.currentRoom);
    }
  
    function drawBackground(ctx, canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawSectorLabel(ctx, canvas);
    }
  
    function drawSectorLabel(ctx, canvas) {
      const roomNum = GameState.currentRoom === "sala1" ? 1 : 2;
  
      ctx.save();
      ctx.font = "bold 9px 'Press Start 2P', monospace";
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.textAlign = "left";
      ctx.fillText(`SETOR ${roomNum}`, 38, canvas.height - 20);
      ctx.restore();
    }
  
    return { loadRoomBackground, drawBackground };
  
  })();