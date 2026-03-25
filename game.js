const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const keys = {};

document.addEventListener("keydown", (e) => { keys[e.key] = true; });
document.addEventListener("keyup", (e) => { keys[e.key] = false; });

function update() {
  if (mission.missionActive) return;

  if (keys["w"] || keys["ArrowUp"])    player.y -= player.speed;
  if (keys["s"] || keys["ArrowDown"])  player.y += player.speed;
  if (keys["a"] || keys["ArrowLeft"])  { player.x -= player.speed; player.dir = -1; }
  if (keys["d"] || keys["ArrowRight"]) { player.x += player.speed; player.dir = 1; }

  player.tick++;

  if (player.x < 0) player.x = 0;
  if (player.y < 0) player.y = 0;
  if (player.x > canvas.width - player.size)  player.x = canvas.width - player.size;
  if (player.y > canvas.height - player.size) player.y = canvas.height - player.size;

  checkDistance(player.x, player.y, player.size);
}

function drawBackground() {
  // cor da grade muda por sala
  const gridColor = mission.sala === 1
    ? "rgba(0,40,80,0.4)"
    : "rgba(40,0,80,0.4)";

  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.5;
  for (let x = 0; x < canvas.width; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }

  const nodes = mission.sala === 1
    ? [{x:150,y:80},{x:400,y:60},{x:650,y:100},{x:800,y:280},{x:500,y:380},{x:250,y:400},{x:60,y:300}]
    : [{x:100,y:100},{x:350,y:50},{x:600,y:120},{x:820,y:300},{x:480,y:400},{x:200,y:420},{x:50,y:250}];

  const nodeColor  = mission.sala === 1 ? "rgba(0,80,140,0.25)"  : "rgba(80,0,140,0.25)";
  const nodeFill   = mission.sala === 1 ? "rgba(0,100,180,0.2)"  : "rgba(80,0,180,0.2)";
  const nodeStroke = mission.sala === 1 ? "rgba(0,150,255,0.3)"  : "rgba(150,0,255,0.3)";

  nodes.forEach((n, i) => {
    if (i < nodes.length - 1) {
      ctx.strokeStyle = nodeColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(n.x, n.y);
      ctx.lineTo(nodes[i+1].x, nodes[i+1].y);
      ctx.stroke();
    }
    ctx.fillStyle   = nodeFill;
    ctx.strokeStyle = nodeStroke;
    ctx.lineWidth   = 1;
    ctx.beginPath();
    ctx.arc(n.x, n.y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  });

  // label sala no canto
  ctx.fillStyle = mission.sala === 1 ? "rgba(0,150,255,0.2)" : "rgba(150,0,255,0.2)";
  ctx.font      = "bold 48px monospace";
  ctx.textAlign = "left";
  ctx.fillText("SALA " + mission.sala, 16, canvas.height - 16);
}

function draw() {
  ctx.fillStyle = "#1a2233";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawMission(ctx, player.x, player.y, player.size);
  drawPlayer(ctx);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

initBugs();
updateHUD();
gameLoop();