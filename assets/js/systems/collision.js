/* ============================================================
   assets/js/systems/collision.js
   Sistema de colisão por zonas retangulares (AABB).

   ── COMO FUNCIONA ──────────────────────────────────────────
   AABB = Axis-Aligned Bounding Box (caixa alinhada aos eixos).
   Cada obstáculo do mapa é um retângulo definido em rooms.json.
   A cada frame, verificamos se o retângulo do player sobrepõe
   alguma zona. Se sim, empurramos o player de volta.

   ── COMO ADICIONAR ZONAS ──────────────────────────────────
   Edite rooms.json → "collisionZones" da sala desejada:
   { "id": "minha_parede", "x": 100, "y": 200, "w": 80, "h": 40 }

   ── MODO DEBUG ────────────────────────────────────────────
   Defina CONFIG.showCollisionDebug = true em config.js para
   visualizar as zonas em tela (retângulos rosa semitransparentes).
   ============================================================ */

const CollisionSystem = (() => {

  /**
   * Carrega as zonas de colisão da sala atual para o estado global.
   * Chamado sempre que uma sala muda.
   */
  function loadZones() {
    const roomData = GameState.currentRoomData();
    GameState.collisionZones = roomData?.collisionZones ?? [];
  }

  /**
   * Verifica e resolve colisões do player com todas as zonas.
   * Recebe a posição DESEJADA e devolve a posição CORRIGIDA.
   *
   * @param {number} desiredX - posição X pretendida pelo input
   * @param {number} desiredY - posição Y pretendida pelo input
   * @param {number} prevX    - posição X anterior (antes do movimento)
   * @param {number} prevY    - posição Y anterior (antes do movimento)
   * @param {number} size     - tamanho (largura e altura) do player
   * @returns {{ x: number, y: number }}
   */
  function resolve(desiredX, desiredY, prevX, prevY, size) {
    let x = desiredX;
    let y = desiredY;

    for (const zone of GameState.collisionZones) {
      // ── Testa colisão AABB ─────────────────────────────
      // Player:  [x, y, x+size, y+size]
      // Zona:    [zone.x, zone.y, zone.x+zone.w, zone.y+zone.h]
      const colX = x < zone.x + zone.w && x + size > zone.x;
      const colY = y < zone.y + zone.h && y + size > zone.y;

      if (colX && colY) {
        // ── Resolução por eixo separado ────────────────
        // Tentamos mover só em X (mantendo Y anterior):
        const testOnlyX_col =
          desiredX < zone.x + zone.w && desiredX + size > zone.x &&
          prevY    < zone.y + zone.h && prevY    + size > zone.y;

        if (testOnlyX_col) {
          // Colisão vem do movimento em X → trava X
          x = prevX;
        } else {
          // Colisão vem do movimento em Y → trava Y
          y = prevY;
        }
      }
    }

    return { x, y };
  }

  /**
   * Desenha as zonas de colisão para debug (CONFIG.showCollisionDebug).
   * @param {CanvasRenderingContext2D} ctx
   */
  function drawDebug(ctx) {
    if (!CONFIG.showCollisionDebug) return;

    ctx.save();
    ctx.strokeStyle = "rgba(255, 80, 200, 0.8)";
    ctx.fillStyle   = "rgba(255, 80, 200, 0.15)";
    ctx.lineWidth   = 1;

    for (const zone of GameState.collisionZones) {
      ctx.fillRect(zone.x, zone.y, zone.w, zone.h);
      ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);

      // Label do ID
      ctx.fillStyle   = "rgba(255,80,200,0.9)";
      ctx.font        = "9px monospace";
      ctx.textAlign   = "left";
      ctx.fillText(zone.id, zone.x + 3, zone.y + 11);
      ctx.fillStyle   = "rgba(255, 80, 200, 0.15)";
    }
    ctx.restore();
  }

  return { loadZones, resolve, drawDebug };

})();
