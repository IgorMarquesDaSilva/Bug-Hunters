/* ============================================================
   assets/js/systems/collision.js
   Colisão usando objetos HTML/CSS do mapa.
   Todo elemento com .collision vira uma barreira.
   ============================================================ */

   const CollisionSystem = (() => {

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
          x: Math.round((rect.left - mapRect.left) * scaleX),
          y: Math.round((rect.top - mapRect.top) * scaleY),
          w: Math.round(rect.width * scaleX),
          h: Math.round(rect.height * scaleY)
        };
      });
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
  
    function hasCollision(box) {
      return GameState.collisionZones.some(zone => rectsOverlap(box, zone));
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
  
      const boxX = getPlayerBox(
        desiredX,
        prevY,
        hitboxW,
        hitboxH,
        offsetX,
        offsetY
      );
  
      if (hasCollision(boxX)) {
        finalX = prevX;
      }
  
      const boxY = getPlayerBox(
        finalX,
        desiredY,
        hitboxW,
        hitboxH,
        offsetX,
        offsetY
      );
  
      if (hasCollision(boxY)) {
        finalY = prevY;
      }
  
      return {
        x: finalX,
        y: finalY
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