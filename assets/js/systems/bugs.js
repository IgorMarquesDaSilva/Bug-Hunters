/* ============================================================
   assets/js/systems/bugs.js
   Missões fixas em objetos HTML/CSS.

   Todo objeto do mapa com a classe .mission-point vira um ponto
   fixo de missão. Quando a missão está disponível, o CSS aplica
   a aura vermelha piscando.
   ============================================================ */

   const BugSystem = (() => {

    function spawnBugs() {
      const missions = GameState.currentMissions();
  
      if (!missions.length) {
        GameState.bugs = [];
        return;
      }
  
      const roomMap = document.getElementById("room-map");
      const canvas = document.getElementById("gameCanvas");
  
      if (!roomMap || !canvas) {
        GameState.bugs = [];
        return;
      }
  
      roomMap.classList.remove("sala1", "sala2");
      roomMap.classList.add(GameState.currentRoom);
  
      const points = Array.from(
        document.querySelectorAll("#room-map .mission-point")
      );
  
      points.forEach(point => {
        point.classList.remove("mission-available", "mission-solved");
      });
  
      const mapRect = roomMap.getBoundingClientRect();
      const scaleX = canvas.width / mapRect.width;
      const scaleY = canvas.height / mapRect.height;
  
      GameState.bugs = missions.map((mission, i) => {
        const el = points[i];
  
        if (!el) {
          return {
            x: 80 + i * 120,
            y: 200,
            w: 40,
            h: 40,
            solved: false,
            missionIdx: i,
            el: null
          };
        }
  
        el.classList.add("mission-available");
  
        const rect = el.getBoundingClientRect();
  
        return {
          x: Math.round((rect.left - mapRect.left) * scaleX),
          y: Math.round((rect.top - mapRect.top) * scaleY),
          w: Math.round(rect.width * scaleX),
          h: Math.round(rect.height * scaleY),
          solved: false,
          missionIdx: i,
          el
        };
      });
    }
  
    function refreshMissionPositions() {
      const roomMap = document.getElementById("room-map");
      const canvas = document.getElementById("gameCanvas");
  
      if (!roomMap || !canvas || !GameState.bugs.length) return;
  
      const mapRect = roomMap.getBoundingClientRect();
      const scaleX = canvas.width / mapRect.width;
      const scaleY = canvas.height / mapRect.height;
  
      GameState.bugs.forEach(bug => {
        if (!bug.el) return;
  
        const rect = bug.el.getBoundingClientRect();
  
        bug.x = Math.round((rect.left - mapRect.left) * scaleX);
        bug.y = Math.round((rect.top - mapRect.top) * scaleY);
        bug.w = Math.round(rect.width * scaleX);
        bug.h = Math.round(rect.height * scaleY);
      });
    }
  
    function getPlayerBox(extra = 10) {
      const p = Player.state;
  
      return {
        x: p.x + p.hitboxOffsetX - extra,
        y: p.y + p.hitboxOffsetY - extra,
        w: p.hitboxW + extra * 2,
        h: p.hitboxH + extra * 2
      };
    }
  
    function rectsOverlap(a, b) {
      return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
      );
    }
  
    function checkProximity() {
      if (GameState.isPaused) return;
      if (GameState.activeIdx !== -1) return;
  
      if (GameState.popupCooldown > 0) {
        GameState.popupCooldown--;
        return;
      }
  
      refreshMissionPositions();
  
      const playerBox = getPlayerBox(12);
  
      for (let i = 0; i < GameState.bugs.length; i++) {
        const bug = GameState.bugs[i];
  
        if (bug.solved) continue;
  
        const objectBox = {
          x: bug.x,
          y: bug.y,
          w: bug.w,
          h: bug.h
        };
  
        if (rectsOverlap(playerBox, objectBox)) {
          GameState.activeIdx = i;
  
          const mission = GameState.currentMissions()[bug.missionIdx];
          const title = mission.title.split("—")[1]?.trim() ?? mission.title;
  
          document.getElementById("popup-bug-desc").textContent =
            "BUG DETECTADO: " + title;
  
          UI.showScreen("screen-bug-popup");
          break;
        }
      }
    }
  
    function markSolved(index) {
      const bug = GameState.bugs[index];
  
      if (!bug) return;
  
      bug.solved = true;
  
      if (bug.el) {
        bug.el.classList.remove("mission-available");
        bug.el.classList.add("mission-solved");
      }
    }
  
    function drawPortal(ctx) {
      if (!GameState.portal.visible) return;
  
      const rd = GameState.currentRoomData();
      if (!rd) return;
  
      const { x: px, y: py } = rd.portalPosition;
      const pw = CONFIG.portal.width;
      const ph = CONFIG.portal.height;
  
      GameState.portal.pulse += 0.05;
      const t = GameState.portal.pulse;
  
      ctx.save();
  
      ctx.shadowColor = "#cc44ff";
      ctx.shadowBlur = 16 + Math.sin(t) * 8;
  
      ctx.fillStyle = `rgba(80,0,180,${0.5 + Math.sin(t) * 0.2})`;
      ctx.fillRect(px, py, pw, ph);
  
      ctx.fillStyle = `rgba(200,100,255,${0.8 + Math.sin(t) * 0.2})`;
      ctx.fillRect(px, py, pw, 3);
      ctx.fillRect(px, py + ph - 3, pw, 3);
      ctx.fillRect(px, py, 3, ph);
      ctx.fillRect(px + pw - 3, py, 3, ph);
  
      ctx.shadowBlur = 0;
  
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 7px 'Press Start 2P', monospace";
      ctx.textAlign = "center";
      ctx.fillText("PORTAL", px + pw / 2, py + ph / 2 - 4);
      ctx.fillText(">>>", px + pw / 2, py + ph / 2 + 8);
  
      ctx.fillStyle = "#cc88ff";
      ctx.font = "6px 'Press Start 2P', monospace";
      ctx.fillText("PROXIMO SETOR", px + pw / 2, py - 8);
  
      ctx.restore();
    }
  
    function checkPortal() {
      if (!GameState.portal.visible || GameState.portal.triggered || GameState.isPaused) {
        return;
      }
  
      const rd = GameState.currentRoomData();
      if (!rd) return;
  
      const { x: px, y: py } = rd.portalPosition;
      const p = Player.state;
  
      const playerCenterX = p.x + p.drawW / 2;
      const playerCenterY = p.y + p.drawH / 2;
  
      const dist = Math.hypot(
        playerCenterX - (px + CONFIG.portal.width / 2),
        playerCenterY - (py + CONFIG.portal.height / 2)
      );
  
      if (dist < CONFIG.portal.triggerDist) {
        GameState.portal.triggered = true;
        UI.showScreen("screen-next-level");
      }
    }
  
    function draw(ctx) {
      drawPortal(ctx);
      checkPortal();
    }
  
    return {
      spawnBugs,
      draw,
      checkProximity,
      markSolved
    };
  
  })();