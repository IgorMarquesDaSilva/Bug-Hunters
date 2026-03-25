const player = {
  x: 50,
  y: 50,
  size: 28,
  speed: 4,
  dir: 1,
  walkCycle: 0,
  isMoving: false
};

function drawPlayer(ctx) {
  const { x, y, size, dir, walkCycle, isMoving } = player;

  ctx.save();
  ctx.translate(x + size/2, y + size/2);
  if (dir === -1) ctx.scale(-1, 1);

  // Corpo principal (gradiente)
  const grad = ctx.createLinearGradient(-size/2, -size/2, size/2, size/2);
  grad.addColorStop(0, '#2c6e9e');
  grad.addColorStop(1, '#0a3146');
  ctx.fillStyle = grad;
  ctx.fillRect(-size/2, -size/2, size, size);

  // Contorno neon
  ctx.strokeStyle = '#00d4ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(-size/2, -size/2, size, size);

  // Olhos (brilho)
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(-9, -9, 6, 6);
  ctx.fillRect(3, -9, 6, 6);
  ctx.fillStyle = '#00ffff';
  ctx.fillRect(-8, -8, 4, 4);
  ctx.fillRect(4, -8, 4, 4);

  // Capacete
  ctx.fillStyle = '#1e4a6e';
  ctx.fillRect(-size/2, -size/2-2, size, 5);

  // Braços animados
  const armSwing = isMoving ? Math.sin(walkCycle * 0.2) * 6 : 0;
  ctx.fillStyle = '#226688';
  ctx.fillRect(-14, 0, 6, 12 + armSwing);
  ctx.fillRect(8, 0, 6, 12 - armSwing);

  // Pernas animadas
  const legSwing = isMoving ? Math.sin(walkCycle * 0.2) * 5 : 0;
  ctx.fillStyle = '#226688';
  ctx.fillRect(-10, 12, 6, 12 + legSwing);
  ctx.fillRect(4, 12, 6, 12 - legSwing);

  // Cinto/Detalhe
  ctx.fillStyle = '#ffaa33';
  ctx.fillRect(-8, 5, 16, 3);

  ctx.restore();
}