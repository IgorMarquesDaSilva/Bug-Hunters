const player = {
    x: 50,
    y: 50,
    size: 25,
    speed: 4
  };
  
  function drawPlayer(ctx) {
    ctx.fillStyle = "cyan";
    ctx.fillRect(player.x, player.y, player.size, player.size);
  }