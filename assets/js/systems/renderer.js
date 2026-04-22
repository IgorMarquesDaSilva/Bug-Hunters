/* ============================================================
   assets/js/systems/renderer.js
   Renderização do fundo: imagem de mapa OU fallback pixel art.

   ── COM IMAGEM ─────────────────────────────────────────────
   Coloque sua imagem em assets/img/map_sala1.png (1000x600px).
   O sistema carrega automaticamente ao entrar na sala.

   ── FALLBACK ───────────────────────────────────────────────
   Se a imagem não existir, desenha um mapa pixel art gerado
   proceduralmente que combina com o estilo das suas imagens.
   ============================================================ */

const Renderer = (() => {

  function loadRoomBackground() {
    const roomData = GameState.currentRoomData();
    GameState.bgImage = null;
    if (!roomData?.backgroundImage) return;
    const img = new Image();
    img.onload  = () => { GameState.bgImage = img; };
    img.onerror = () => { console.warn(`[Renderer] Imagem não encontrada: ${roomData.backgroundImage}. Usando fallback pixel art.`); };
    img.src = roomData.backgroundImage;
  }

  function drawBackground(ctx, canvas) {
    if (GameState.bgImage) {
      ctx.drawImage(GameState.bgImage, 0, 0, canvas.width, canvas.height);
      // Overlay leve para garantir legibilidade dos elementos do jogo
      ctx.fillStyle = "rgba(0,0,0,0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      drawPixelFallback(ctx, canvas);
    }
    drawSectorLabel(ctx, canvas);
  }

  // ── Fallback: sala pixel art gerada proceduralmente ────────
  function drawPixelFallback(ctx, canvas) {
    const isRoom2 = GameState.currentRoom === "sala2";

    // Paleta por sala (espelhando as imagens reais)
    const palette = isRoom2
      ? { floor: "#b8d4e8", floorDark: "#8ab0cc", wall: "#1a3a5c", wallTop: "#4fc3f7", accent: "#00e5ff", border: "#0d1b2a" }
      : { floor: "#c8843a", floorDark: "#a06428", wall: "#1e4020", wallTop: "#2d6e1f", accent: "#ffb347", border: "#0d1b2a" };

    // ── Paredes e piso ──────────────────────────────────────
    // Borda / parede externa
    ctx.fillStyle = palette.border;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Paredes internas (teal / escuro)
    ctx.fillStyle = palette.wall;
    ctx.fillRect(8, 8, canvas.width - 16, canvas.height - 16);

    // Piso com tiles (8×8px)
    const tileSize = 40;
    for (let x = 30; x < canvas.width - 30; x += tileSize) {
      for (let y = 30; y < canvas.height - 30; y += tileSize) {
        const shade = ((Math.floor(x/tileSize) + Math.floor(y/tileSize)) % 2 === 0)
          ? palette.floor : palette.floorDark;
        ctx.fillStyle = shade;
        ctx.fillRect(x, y, tileSize - 1, tileSize - 1);
      }
    }

    // Borda superior da sala (topo das paredes)
    ctx.fillStyle = palette.wallTop;
    ctx.fillRect(30, 28, canvas.width - 60, 6);
    ctx.fillRect(28, 30, 6, canvas.height - 60);
    ctx.fillRect(canvas.width - 34, 30, 6, canvas.height - 60);

    // ── Decorações por sala ─────────────────────────────────
    if (isRoom2) {
      drawRoom2Decorations(ctx, palette);
    } else {
      drawRoom1Decorations(ctx, palette);
    }
  }

  // Sala 2 — escritório azul (computadores, cadeiras, servidores)
  function drawRoom2Decorations(ctx, p) {
    // Mesas com monitores — parede superior
    const desks = [[120,60],[260,60],[400,60]];
    desks.forEach(([dx,dy]) => {
      // Mesa
      ctx.fillStyle = "#e0e8f0"; ctx.fillRect(dx, dy+24, 100, 50);
      // Monitor
      ctx.fillStyle = "#223344"; ctx.fillRect(dx+10, dy, 80, 50);
      ctx.fillStyle = "#00e5ff"; ctx.fillRect(dx+14, dy+4, 72, 40);
      // Linhas de código no monitor
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      for(let l=0;l<5;l++) ctx.fillRect(dx+18, dy+8+l*7, 30+Math.random()*30, 3);
      // Teclado
      ctx.fillStyle = "#d0d8e0"; ctx.fillRect(dx+10, dy+54, 80, 16);
      // Cadeira
      ctx.fillStyle = "#2244aa"; ctx.fillRect(dx+20, dy+80, 60, 40);
      ctx.fillStyle = "#3366cc"; ctx.fillRect(dx+30, dy+60, 40, 25);
    });

    // Servidor / torre — canto superior direito
    ctx.fillStyle = "#334455"; ctx.fillRect(850, 50, 60, 120);
    ctx.fillStyle = "#445566"; ctx.fillRect(856, 56, 48, 108);
    for(let i=0;i<8;i++){
      ctx.fillStyle = i%3===0?"#00e5ff":"#334455";
      ctx.fillRect(862, 62+i*12, 36, 6);
    }

    // Computadores laterais esquerda
    [[50,150],[50,260],[50,370]].forEach(([lx,ly])=>{
      ctx.fillStyle="#e0e8f0"; ctx.fillRect(lx,ly,80,60);
      ctx.fillStyle="#223344"; ctx.fillRect(lx+4,ly-30,72,36);
      ctx.fillStyle="#00e5ff"; ctx.fillRect(lx+8,ly-26,64,28);
    });

    // Computadores laterais direita
    [[870,150],[870,260],[870,370]].forEach(([rx,ry])=>{
      ctx.fillStyle="#e0e8f0"; ctx.fillRect(rx,ry,80,60);
      ctx.fillStyle="#223344"; ctx.fillRect(rx+4,ry-30,72,36);
      ctx.fillStyle="#4fc3f7"; ctx.fillRect(rx+8,ry-26,64,28);
    });

    // Plantas decorativas (como nas imagens)
    drawPixelPlant(ctx, 60,  80,  "#2d6e1f","#3a8a28");
    drawPixelPlant(ctx, 500, 50,  "#2d6e1f","#3a8a28");
    drawPixelPlant(ctx, 900, 450, "#2d6e1f","#3a8a28");

    // Caixas laranja (canto inferior esquerdo — igual à imagem)
    [[60,480],[120,480]].forEach(([bx,by])=>{
      ctx.fillStyle="#c97e2a"; ctx.fillRect(bx,by,50,40);
      ctx.fillStyle="#ffb347"; ctx.fillRect(bx+4,by+4,42,8);
      ctx.fillStyle="#a06428"; ctx.fillRect(bx,by+30,50,10);
    });

    // Porta (canto superior direito)
    drawPixelDoor(ctx, 800, 30, "#4fc3f7", "#00e5ff");
  }

  // Sala 1 — laboratório laranja/steampunk (gerador, tubulações)
  function drawRoom1Decorations(ctx, p) {
    // Mesas de computadores — parede superior esquerda
    ctx.fillStyle = "#5a2a10"; ctx.fillRect(60, 50, 280, 90);
    [[80,30],[140,30],[200,30],[260,20]].forEach(([mx,my])=>{
      ctx.fillStyle="#442211"; ctx.fillRect(mx,my+50,50,40);
      ctx.fillStyle="#223344"; ctx.fillRect(mx+2,my+20,46,36);
      ctx.fillStyle="#9933ff"; ctx.fillRect(mx+5,my+24,40,28);
      // Dados no monitor
      ctx.fillStyle="rgba(255,100,255,0.6)";
      for(let l=0;l<3;l++) ctx.fillRect(mx+8,my+28+l*8,10+Math.random()*20,3);
    });

    // Medidor de energia — topo centro
    ctx.fillStyle = "#886600"; ctx.fillRect(420, 30, 90, 70);
    ctx.fillStyle = "#553300"; ctx.fillRect(428, 38, 74, 54);
    // Ponteiro do medidor
    ctx.save();
    ctx.translate(465, 72);
    ctx.rotate(-0.5);
    ctx.fillStyle = "#ff4444";
    ctx.fillRect(-2, -28, 4, 28);
    ctx.restore();
    ctx.fillStyle = "#00ff44"; ctx.fillRect(432,58,18,8);
    ctx.fillStyle = "#ffff00"; ctx.fillRect(452,58,18,8);
    ctx.fillStyle = "#ff4444"; ctx.fillRect(472,58,18,8);

    // Gerador central (destaque das imagens!)
    const cx = 500, cy = 300;
    // Base metálica
    ctx.fillStyle = "#886633"; ctx.fillRect(cx-50, cy-60, 100, 120);
    // Cilindro com glowing verde
    ctx.fillStyle = "#224422"; ctx.fillRect(cx-28, cy-50, 56, 100);
    ctx.fillStyle = "#44ff44";
    for(let i=0;i<6;i++){
      const alpha = 0.4 + (i%2)*0.4;
      ctx.fillStyle = `rgba(68,255,68,${alpha})`;
      ctx.fillRect(cx-24+i*3, cy-46, 8, 92);
    }
    // Anel superior e inferior
    ctx.fillStyle = "#aa8833"; ctx.fillRect(cx-36, cy-64, 72, 16);
    ctx.fillStyle = "#aa8833"; ctx.fillRect(cx-36, cy+48, 72, 16);
    // Brilho
    ctx.shadowColor = "#44ff44";
    ctx.shadowBlur  = 20;
    ctx.fillStyle   = "rgba(68,255,100,0.3)";
    ctx.fillRect(cx-24, cy-46, 48, 92);
    ctx.shadowBlur  = 0;

    // Tubulações saindo do gerador
    ctx.strokeStyle = "#aa8833"; ctx.lineWidth = 8;
    ctx.beginPath(); ctx.moveTo(cx-50, cy+20); ctx.lineTo(cx-180, cy+20); ctx.lineTo(cx-180, cy+120); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-50, cy-10); ctx.lineTo(cx-200, cy-10); ctx.lineTo(cx-200, cy+120); ctx.stroke();
    ctx.lineWidth = 1;

    // Caixas de energia (inferior esquerdo — como nas imagens)
    [[80,480],[160,480]].forEach(([bx,by])=>{
      ctx.fillStyle = "#443322"; ctx.fillRect(bx,by,70,44);
      ctx.fillStyle = "#886633"; ctx.fillRect(bx+4,by+4,62,8);
      ctx.fillStyle = "#ffb347"; ctx.font="bold 7px 'Press Start 2P', monospace"; ctx.textAlign="center";
      ctx.fillText("ENERGY", bx+35, by+30);
    });

    // Mini-terminais laterais (bugs ficam aqui — caixas com ?)
    [[870,160],[870,240],[870,320],[870,400],[870,480]].forEach(([tx,ty])=>{
      ctx.fillStyle = "#222233"; ctx.fillRect(tx,ty,80,50);
      ctx.fillStyle = "#334455"; ctx.fillRect(tx+4,ty+4,72,30);
      ctx.fillStyle = "#8ab0c8"; ctx.font="8px 'Press Start 2P',monospace"; ctx.textAlign="center";
      ctx.fillText("?", tx+40, ty+24);
    });

    // Plantas
    drawPixelPlant(ctx, 830, 50, "#2d6e1f","#3a8a28");

    // Porta (canto superior direito)
    drawPixelDoor(ctx, 800, 30, "#c97e2a", "#ffb347");
  }

  // ── Helpers de decoração ───────────────────────────────────
  function drawPixelPlant(ctx, x, y, dark, light) {
    // Vaso
    ctx.fillStyle = "#8b4513"; ctx.fillRect(x, y+24, 28, 20);
    ctx.fillStyle = "#a0522d"; ctx.fillRect(x+2, y+20, 24, 6);
    // Folhas
    ctx.fillStyle = dark;  ctx.fillRect(x+4,  y,    8, 14);
    ctx.fillStyle = light; ctx.fillRect(x+12, y-6,  8, 14);
    ctx.fillStyle = dark;  ctx.fillRect(x,    y+6,  8, 12);
  }

  function drawPixelDoor(ctx, x, y, frame, inner) {
    ctx.fillStyle = frame; ctx.fillRect(x, y, 60, 80);
    ctx.fillStyle = inner; ctx.fillRect(x+6, y+6, 48, 68);
    // Janela
    ctx.fillStyle = "rgba(255,255,200,0.7)"; ctx.fillRect(x+14, y+10, 32, 24);
    // Maçaneta
    ctx.fillStyle = "#888"; ctx.fillRect(x+48, y+42, 6, 6);
  }

  function drawSectorLabel(ctx, canvas) {
    const roomNum = GameState.currentRoom === "sala1" ? 1 : 2;
    ctx.font        = "bold 9px 'Press Start 2P', monospace";
    ctx.fillStyle   = "rgba(255,255,255,0.18)";
    ctx.textAlign   = "left";
    ctx.shadowBlur  = 0;
    ctx.fillText(`SETOR ${roomNum}`, 38, canvas.height - 20);
  }

  return { loadRoomBackground, drawBackground };

})();
