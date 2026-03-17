const player = {
  x: 50,
  y: 50,
  size: 24,
  speed: 4,
  dir: 1,
  tick: 0
};

function drawPlayer(ctx) {
  const { x, y, size } = player;
  const t = player.tick;

  ctx.save();
  ctx.translate(x + size / 2, y + size / 2);
  if (player.dir === -1) ctx.scale(-1, 1);

  // corpo
  ctx.fillStyle = "#004466";
  ctx.fillRect(-size / 2, -size / 2, size, size);
  ctx.strokeStyle = "#00d4ff";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-size / 2, -size / 2, size, size);

  // olhos
  ctx.fillStyle = "#00d4ff";
  ctx.fillRect(-8, -8, 6, 6);
  ctx.fillRect(2, -8, 6, 6);

  // corpo meio
  ctx.fillRect(-8, 0, 16, 5);

  // pernas animadas
  const legOff = Math.sin(t * 0.2) * 3;
  ctx.fillRect(-9, 9, 5, 5 + legOff);
  ctx.fillRect(4, 9, 5, 5 - legOff);

  ctx.restore();
}