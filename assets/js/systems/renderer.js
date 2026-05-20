/* ============================================================
   assets/js/systems/renderer.js
   Mapa em HTML/CSS.
   O canvas fica transparente e renderiza apenas entidades,
   debug, efeitos e transições.
============================================================ */

const Renderer = (() => {

  function loadRoomBackground() {
    const map = document.getElementById("room-map");

    if (!map) return;

    map.classList.remove("sala1", "sala2", "sala3", "sala4");
    map.classList.add(GameState.currentRoom);
  }

  function drawBackground(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSectorLabel(ctx, canvas);
  }

  function drawSectorLabel(ctx, canvas) {
    const roomNumMap = {
      sala1: 1,
      sala2: 2,
      sala3: 3,
      sala4: 4
    };

    const roomNum = roomNumMap[GameState.currentRoom] || 1;

    ctx.save();

    ctx.font = "bold 9px 'Press Start 2P', monospace";
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "left";
    ctx.fillText(`SETOR ${roomNum}`, 38, canvas.height - 20);

    ctx.restore();
  }

  return {
    loadRoomBackground,
    drawBackground
  };

})();
