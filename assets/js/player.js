const player = {
  x: 50,
  y: 50,
  size: 32,
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

  // Animação suave de caminhada (seno)
  const walkAngle = isMoving ? Math.sin(walkCycle * 0.2) : 0;
  const armSwing = walkAngle * 12;
  const legSwing = walkAngle * 8;

  // ========== CORPO ==========
  // Jaqueta
  ctx.fillStyle = "#1a2a3a";
  ctx.fillRect(-12, -8, 24, 32);
  
  // Detalhes da jaqueta
  ctx.fillStyle = "#2a4a6a";
  ctx.fillRect(-4, -6, 8, 10);
  ctx.fillStyle = "#ffaa44";
  ctx.fillRect(-1, -4, 2, 14);
  
  // Cinto
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(-12, 14, 24, 4);
  ctx.fillStyle = "#c97e2a";
  ctx.fillRect(-6, 14, 12, 4);

  // ========== CABEÇA ==========
  // Rosto
  ctx.fillStyle = "#f5d0a9";
  ctx.fillRect(-10, -18, 20, 22);
  
  // Cabelo
  ctx.fillStyle = "#2c1a0a";
  ctx.fillRect(-12, -22, 24, 12);
  ctx.fillRect(-14, -20, 4, 8);
  ctx.fillRect(10, -20, 4, 8);
  
  // Olhos
  ctx.fillStyle = "#1a2a3a";
  ctx.fillRect(-7, -10, 5, 4);
  ctx.fillRect(2, -10, 5, 4);
  
  // Brilho nos olhos
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(-5, -11, 2, 2);
  ctx.fillRect(4, -11, 2, 2);
  
  // Sobrancelhas
  ctx.fillStyle = "#2c1a0a";
  ctx.fillRect(-8, -14, 6, 2);
  ctx.fillRect(2, -14, 6, 2);
  
  // Sorriso
  ctx.beginPath();
  ctx.strokeStyle = "#8b5a3a";
  ctx.lineWidth = 1.5;
  ctx.arc(0, -4, 5, 0.1, Math.PI - 0.1);
  ctx.stroke();
  
  // Fone de ouvido
  ctx.fillStyle = "#2a2a2a";
  ctx.fillRect(-14, -12, 4, 12);
  ctx.fillRect(10, -12, 4, 12);
  ctx.fillStyle = "#4a4a4a";
  ctx.beginPath();
  ctx.arc(-12, -10, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(12, -10, 5, 0, Math.PI * 2);
  ctx.fill();

  // ========== BRAÇOS (com animação natural) ==========
  ctx.fillStyle = "#1a2a3a";
  
  // Braço esquerdo (balança para frente e para trás)
  ctx.save();
  ctx.translate(-14, 2);
  ctx.rotate(armSwing * 0.03);
  ctx.fillRect(-4, -2, 8, 20);
  // Mão esquerda (acompanha o braço)
  ctx.fillStyle = "#f5d0a9";
  ctx.fillRect(-2, 14, 6, 6);
  ctx.fillStyle = "#1a2a3a";
  ctx.restore();
  
  // Braço direito (balança em direção oposta)
  ctx.save();
  ctx.translate(14, 2);
  ctx.rotate(-armSwing * 0.03);
  ctx.fillRect(-4, -2, 8, 20);
  // Mão direita
  ctx.fillStyle = "#f5d0a9";
  ctx.fillRect(-2, 14, 6, 6);
  ctx.fillStyle = "#1a2a3a";
  ctx.restore();

  // ========== PERNAS (com animação natural) ==========
  ctx.fillStyle = "#2a3a4a";
  
  // Perna esquerda
  ctx.save();
  ctx.translate(-6, 20);
  ctx.rotate(legSwing * 0.03);
  ctx.fillRect(-4, 0, 8, 18);
  // Pé esquerdo
  ctx.fillStyle = "#3a2a1a";
  ctx.fillRect(-4, 16, 8, 5);
  ctx.fillStyle = "#2a3a4a";
  ctx.restore();
  
  // Perna direita
  ctx.save();
  ctx.translate(6, 20);
  ctx.rotate(-legSwing * 0.03);
  ctx.fillRect(-4, 0, 8, 18);
  // Pé direito
  ctx.fillStyle = "#3a2a1a";
  ctx.fillRect(-4, 16, 8, 5);
  ctx.fillStyle = "#2a3a4a";
  ctx.restore();
  
  // ========== ACESSÓRIOS ==========
  // Mochila
  ctx.fillStyle = "#2a4a5a";
  ctx.fillRect(-8, 4, 16, 20);
  ctx.fillStyle = "#ffaa44";
  ctx.fillRect(-2, 12, 4, 8);
  
  // Pulseira tecnológica
  ctx.fillStyle = "#0ff";
  ctx.fillRect(-16, 18, 6, 3);
  ctx.fillRect(10, 18, 6, 3);
  
  // Brilho sutil nos olhos
  ctx.shadowBlur = 3;
  ctx.shadowColor = "#0ff";
  ctx.fillStyle = "#88ffff";
  ctx.fillRect(-6, -11, 3, 2);
  ctx.fillRect(3, -11, 3, 2);
  ctx.shadowBlur = 0;
  
  ctx.restore();
}