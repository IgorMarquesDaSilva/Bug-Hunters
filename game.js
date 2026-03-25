const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = {};

document.addEventListener("keydown", (e) => { keys[e.key] = true; });
document.addEventListener("keyup", (e) => { keys[e.key] = false; });

// ==================== Movimentação e Atualização ====================
function update() {
  if (mission.missionActive) return;

  let moving = false;
  if (keys["w"] || keys["ArrowUp"])    { player.y -= player.speed; moving = true; }
  if (keys["s"] || keys["ArrowDown"])  { player.y += player.speed; moving = true; }
  if (keys["a"] || keys["ArrowLeft"])  { player.x -= player.speed; player.dir = -1; moving = true; }
  if (keys["d"] || keys["ArrowRight"]) { player.x += player.speed; player.dir = 1; moving = true; }

  // Animação de caminhada
  if (moving) {
    player.walkCycle++;
  } else {
    player.walkCycle = 0;
  }
  player.isMoving = moving;

  // Limites do canvas
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  checkDistance(player.x, player.y, player.size);
}

// ==================== Desenho do Fundo ====================
function drawBackground() {
  // Gradiente de fundo por sala
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  if (mission.sala === 1) {
    gradient.addColorStop(0, '#0a1f2e');
    gradient.addColorStop(1, '#0b2a3a');
  } else {
    gradient.addColorStop(0, '#1e0a2e');
    gradient.addColorStop(1, '#2a0a3a');
  }
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Grade sutil
  ctx.strokeStyle = `rgba(0,212,255,0.15)`;
  ctx.lineWidth = 0.5;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  // Nós de conexão
  const nodes = mission.sala === 1
    ? [{x:150,y:80},{x:400,y:60},{x:650,y:100},{x:800,y:280},{x:500,y:380},{x:250,y:400},{x:60,y:300}]
    : [{x:100,y:100},{x:350,y:50},{x:600,y:120},{x:820,y:300},{x:480,y:400},{x:200,y:420},{x:50,y:250}];

  nodes.forEach((n, i) => {
    if (i < nodes.length - 1) {
      ctx.strokeStyle = `rgba(0,212,255,0.2)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(n.x, n.y);
      ctx.lineTo(nodes[i+1].x, nodes[i+1].y);
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(0,212,255,0.1)`;
    ctx.strokeStyle = `rgba(0,212,255,0.3)`;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // Número da sala com efeito neon
  ctx.font = "bold 48px 'Inter', monospace";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#00d4ff";
  ctx.fillStyle = `rgba(0,212,255,0.2)`;
  ctx.fillText("SALA " + mission.sala, 20, canvas.height - 30);
  ctx.shadowBlur = 0;
}

// ==================== Desenho Principal ====================
function draw() {
  drawBackground();
  drawMission(ctx, player.x, player.y, player.size);
  drawPlayer(ctx);
}

// ==================== Game Loop ====================
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// ==================== Inicialização ====================
initBugs();
updateHUD();
gameLoop();