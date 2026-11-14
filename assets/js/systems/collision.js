/* ============================================================
   assets/js/systems/collision.js
   Colisão usando objetos HTML/CSS do mapa.
   Todo elemento com .collision vira uma barreira.
   ============================================================ */

   const CollisionSystem = (() => {

    function obstacleLabel(element) {
      const labels = [
        ['.map-wall, .map-top-wall', 'uma parede'],
        ['.door', 'a porta'],
        ['.plant', 'uma planta'],
        ['.printer', 'uma impressora'],
        ['.fire-extinguisher, .control-extinguisher', 'um extintor'],
        ['.safety-shelf, .control-shelf', 'uma estante'],
        ['.console-chair, .side-chair, .q-chair, .side-terminal-chair', 'uma cadeira'],
        ['.reactor, .recovery-reactor', 'o reator'],
        ['.energy-meter', 'o medidor de energia'],
        ['.energy-box, .box', 'uma caixa'],
        ['.quarantine-chamber', 'a câmara de quarentena'],
        ['.server-rack, .data-tower', 'um servidor'],
        ['.bridge-window', 'uma janela'],
        ['.energy-terminal, .recovery-terminal, .navigation-terminal, .side-terminal', 'um terminal'],
        ['.desk, .main-table, .lab-desk, .quarantine-desk, .power-table, .recovery-bench, .side-workstation, .bridge-console', 'uma bancada']
      ];
      return labels.find(([selector]) => element.closest(selector))?.[1] || 'um objeto';
    }

    function loadZones() {
      const canvas = document.getElementById("gameCanvas");
      const roomMap = document.getElementById("room-map");
  
      if (!canvas || !roomMap) {
        GameState.collisionZones = [];
        return;
      }
  
      const mapRect = roomMap.getBoundingClientRect();
  
      const scaleX = canvas.width / mapRect.width;
      const scaleY = canvas.height / mapRect.height;
  
      const elements = document.querySelectorAll("#room-map .collision");
  
      GameState.collisionZones = Array.from(elements).map((el, index) => {
        const rect = el.getBoundingClientRect();
  
        return {
          id: el.className || `collision-${index}`,
          key: `collision-${index}`,
          label: obstacleLabel(el),
          x: Math.round((rect.left - mapRect.left) * scaleX),
          y: Math.round((rect.top - mapRect.top) * scaleY),
          w: Math.round(rect.width * scaleX),
          h: Math.round(rect.height * scaleY)
        };
      }).filter(zone => zone.w > 0 && zone.h > 0);
    }
  
    function rectsOverlap(a, b) {
      return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
      );
    }
  
    function getPlayerBox(x, y, hitboxW, hitboxH, offsetX, offsetY) {
      return {
        x: x + offsetX,
        y: y + offsetY,
        w: hitboxW,
        h: hitboxH
      };
    }
  
    function findCollision(box) {
      return GameState.collisionZones.find(zone => rectsOverlap(box, zone));
    }
  
    function resolve(
      desiredX,
      desiredY,
      prevX,
      prevY,
      hitboxW,
      hitboxH,
      offsetX = 0,
      offsetY = 0
    ) {
      let finalX = desiredX;
      let finalY = desiredY;
      const contacts = [];
  
      const boxX = getPlayerBox(
        desiredX,
        prevY,
        hitboxW,
        hitboxH,
        offsetX,
        offsetY
      );
  
      const collisionX = findCollision(boxX);
      if (collisionX) {
        finalX = prevX;
        if (desiredX !== prevX) contacts.push({ ...collisionX, direction: desiredX < prevX ? 'à esquerda' : 'à direita' });
      }
  
      const boxY = getPlayerBox(
        finalX,
        desiredY,
        hitboxW,
        hitboxH,
        offsetX,
        offsetY
      );
  
      const collisionY = findCollision(boxY);
      if (collisionY) {
        finalY = prevY;
        if (desiredY !== prevY) contacts.push({ ...collisionY, direction: desiredY < prevY ? 'acima' : 'abaixo' });
      }
  
      return {
        x: finalX,
        y: finalY,
        contacts
      };
    }
  
    function drawDebug(ctx) {
      if (!CONFIG.showCollisionDebug) return;
  
      ctx.save();
  
      ctx.strokeStyle = "rgba(255, 80, 200, 0.9)";
      ctx.fillStyle = "rgba(255, 80, 200, 0.18)";
      ctx.lineWidth = 2;
  
      for (const zone of GameState.collisionZones) {
        ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
        ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);
      }
  
      if (typeof Player !== "undefined") {
        const p = Player.state;
  
        ctx.strokeStyle = "rgba(0, 255, 120, 0.95)";
        ctx.fillStyle = "rgba(0, 255, 120, 0.2)";
  
        ctx.fillRect(
          p.x + p.hitboxOffsetX,
          p.y + p.hitboxOffsetY,
          p.hitboxW,
          p.hitboxH
        );
  
        ctx.strokeRect(
          p.x + p.hitboxOffsetX,
          p.y + p.hitboxOffsetY,
          p.hitboxW,
          p.hitboxH
        );
      }
  
      ctx.restore();
    }
  
    return {
      loadZones,
      resolve,
      drawDebug
    };
  
  })();
