/* ============================================================
   assets/js/systems/bugs.js
   Distribuição de missões sorteadas entre os objetos de cada sala.
============================================================ */

const BugSystem = (() => {
  let lastGuidanceTime = 0;
  let lastGuidanceX = NaN;
  let lastGuidanceY = NaN;

  function nearestBug() {
    const player = Player.state;
    const x = player.x + player.hitboxOffsetX + player.hitboxW / 2;
    const y = player.y + player.hitboxOffsetY + player.hitboxH / 2;

    return GameState.bugs.reduce((nearest, bug) => {
      if (!bug || bug.solved) return nearest;
      const nearestX = Math.max(bug.x, Math.min(x, bug.x + bug.w));
      const nearestY = Math.max(bug.y, Math.min(y, bug.y + bug.h));
      const distance = Math.round(Math.hypot(nearestX - x, nearestY - y));
      return !nearest || distance < nearest.distance ? { bug, distance, x, y } : nearest;
    }, null);
  }

  function announceNearestBug(force = false) {
    if (GameState.isPaused || document.activeElement?.id !== "game-movement-input") return;

    const player = Player.state;
    const now = Date.now();
    if (!force && (player.blocked || !player.isMoving || now - lastGuidanceTime < 2500 ||
      Math.hypot(player.x - lastGuidanceX, player.y - lastGuidanceY) < 24)) return;

    refreshMissionPositions();
    let nearest = nearestBug();
    let exit = false;
    if (!nearest && GameState.portal.visible) {
      const door = GameState.collisionZones.find(zone => /\bdoor\b/.test(zone.id));
      if (door) {
        const x = player.x + player.hitboxOffsetX + player.hitboxW / 2;
        const y = player.y + player.hitboxOffsetY + player.hitboxH / 2;
        const distance = Math.round(Math.hypot(Math.max(door.x, Math.min(x, door.x + door.w)) - x,
          Math.max(door.y, Math.min(y, door.y + door.h)) - y));
        nearest = { bug: door, distance, x, y };
        exit = true;
      }
    }
    if (!nearest) {
      if (force) window.AccessibilitySystem?.announce?.('Todos os desafios foram respondidos. Libere a porta na tela Setor limpo para continuar.');
      return;
    }

    const { bug, distance, x, y } = nearest;
    const dx = bug.x + bug.w / 2 - x;
    const dy = bug.y + bug.h / 2 - y;
    const directions = [];
    if (Math.abs(dy) > 15) directions.push(dy < 0 ? "acima" : "abaixo");
    if (Math.abs(dx) > 15) directions.push(dx < 0 ? "à esquerda" : "à direita");
    const direction = directions.length ? directions.join(" e ") : "bem perto";
    const mission = GameState.currentMissions()[bug.missionIdx];
    const title = exit ? 'Porta de saída liberada' : mission?.title?.split("—").slice(1).join("—").trim() || mission?.title || "Bug mais próximo";

    lastGuidanceTime = now;
    lastGuidanceX = player.x;
    lastGuidanceY = player.y;
    window.AccessibilitySystem?.announce?.(
      `${force ? `Setor ${GameState.currentRoom.replace('sala', '')}. ${GameState.solvedCount} de ${GameState.currentMissions().length} desafios respondidos. ` : ''}${title}: ${distance} pixels em linha reta, ${direction}.${force ? ' Use WASD ou as setas para andar. R repete a orientação.' : ''}`,
      { key: 'guidance', cooldown: force ? 0 : 2500 }
    );
  }

  document.addEventListener("focusin", event => {
    if (event.target.id === "game-movement-input") announceNearestBug(true);
  });

  document.addEventListener("keydown", event => {
    if (event.target.id !== "game-movement-input" || event.key.toLowerCase() !== "r" ||
      event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
    event.preventDefault();
    announceNearestBug(true);
  });

  function spawnBugs() {
    lastGuidanceTime = 0;
    lastGuidanceX = NaN;
    lastGuidanceY = NaN;
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

    roomMap.classList.remove("sala1", "sala2", "sala3", "sala4");
    roomMap.classList.add(GameState.currentRoom);

    document.querySelectorAll("#room-map .mission-point").forEach(point => {
      point.classList.remove("mission-available", "mission-solved");
    });
    const reactorOverlay = document.getElementById("sala2-reactor-overlay");
    reactorOverlay?.classList.remove("mission-available", "mission-solved");

    const missionSelectorMap = {
      sala1: "#room-map .sala1-mission",
      sala2: "#room-map .sala2-mission",
      sala3: "#room-map .sala3-mission",
      sala4: "#room-map .sala4-mission"
    };

    const missionSelector =
      missionSelectorMap[GameState.currentRoom] || "#room-map .sala1-mission";

    const points = QuestionBank.shuffle(
      Array.from(document.querySelectorAll(missionSelector))
    );

    const mapRect = roomMap.getBoundingClientRect();
    const scaleX = canvas.width / mapRect.width;
    const scaleY = canvas.height / mapRect.height;

    GameState.bugs = missions.map((mission, i) => {
      const el = points[i];

      if (!el) {
        return {
          x: 100 + i * 80,
          y: 200,
          w: 40,
          h: 40,
          solved: false,
          missionIdx: i,
          el: null
        };
      }

      el.classList.add("mission-available");
      if (GameState.currentRoom === "sala2" && el.classList.contains("reactor")) {
        reactorOverlay?.classList.add("mission-available");
      }

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

  function getBugBox(bug) {
    return {
      x: bug.x,
      y: bug.y,
      w: bug.w,
      h: bug.h
    };
  }

  function closePromptOutsideMissionRange() {
    const prompt = document.getElementById("screen-bug-popup");

    if (prompt?.style.display === "none") return false;

    refreshMissionPositions();

    const bug = GameState.bugs[GameState.activeIdx];

    if (!bug || !rectsOverlap(getPlayerBox(34), getBugBox(bug))) {
      UI.closePopup();
      
      // Para o áudio quando sai do alcance do bug
      if (window.GameAudio && typeof window.GameAudio.stopBugAlert === "function") {
        window.GameAudio.stopBugAlert();
      }
    }

    return true;
  }

  function checkProximity() {
    if (GameState.isPaused) return;

    // Se já existe um bug ativo aberto
    if (GameState.activeIdx !== -1) {
      const promptIsOpen = closePromptOutsideMissionRange();

      if (!promptIsOpen) {
        GameState.activeIdx = -1;
        GameState.popupCooldown = 0;
        
        if (window.GameAudio && typeof window.GameAudio.stopBugAlert === "function") {
          window.GameAudio.stopBugAlert();
        }
      }

      return;
    }

    if (GameState.popupCooldown > 0) {
      GameState.popupCooldown--;
      return;
    }

    refreshMissionPositions();

    const playerBox = getPlayerBox();

    for (let i = 0; i < GameState.bugs.length; i++) {
      const bug = GameState.bugs[i];

      if (!bug || bug.solved) continue;

      if (rectsOverlap(playerBox, getBugBox(bug))) {
        GameState.activeIdx = i;

        const missions = GameState.currentMissions();
        const mission = missions[bug.missionIdx] || missions[i];

        if (mission) {
          const title = mission.title?.split("—")[1]?.trim() ?? mission.title ?? "";
          const descEl = document.getElementById("popup-bug-desc");
          if (descEl) {
            descEl.textContent = "BUG DETECTADO: " + title;
          }
        }

        try {
          if (window.GameAudio && typeof window.GameAudio.playBugAlert === "function") {
            window.GameAudio.playBugAlert();
          }
        } catch (e) {
          console.warn("[BugSystem] Erro ao tocar som de alerta:", e);
        }

        UI.showScreen("screen-bug-popup");
        window.AccessibilitySystem?.announce?.(
          `${document.getElementById("popup-bug-desc")?.textContent || "Bug detectado."} Pressione Enter para abrir a missão.`,
          { priority: 'assertive' }
        );
        break;
      }
    }

    if (GameState.activeIdx === -1) announceNearestBug();
  }

  function markSolved(index) {
    const bug = GameState.bugs[index];

    if (!bug) return;

    bug.solved = true;

    // Para o som imediatamente ao resolver a task
    if (window.GameAudio && typeof window.GameAudio.stopBugAlert === "function") {
      window.GameAudio.stopBugAlert();
    }

    if (bug.el) {
      bug.el.classList.remove("mission-available");
      bug.el.classList.add("mission-solved");

      if (bug.el.classList.contains("reactor")) {
        const overlay = document.getElementById("sala2-reactor-overlay");
        if (overlay) {
          overlay.classList.remove("mission-available");
          overlay.classList.add("mission-solved");
        }
      }
    }
  }

  

  function drawPortal(ctx) {
    const door = document.querySelector("#room-map .door");

    if (!door) return;

    if (GameState.portal.visible) {
      door.classList.add("portal-door-active");
    } else {
      door.classList.remove("portal-door-active");
    }
  }

  function checkPortal() {
    if (
      !GameState.portal.visible ||
      GameState.portal.triggered ||
      GameState.isPaused
    ) {
      return;
    }

    const door = document.querySelector("#room-map .door");
    const canvas = document.getElementById("gameCanvas");
    const roomMap = document.getElementById("room-map");

    if (!door || !canvas || !roomMap) return;

    const mapRect = roomMap.getBoundingClientRect();
    const doorRect = door.getBoundingClientRect();

    const scaleX = canvas.width / mapRect.width;
    const scaleY = canvas.height / mapRect.height;

    const doorBox = {
      x: Math.round((doorRect.left - mapRect.left) * scaleX) - 45,
      y: Math.round((doorRect.top - mapRect.top) * scaleY) - 45,
      w: Math.round(doorRect.width * scaleX) + 90,
      h: Math.round(doorRect.height * scaleY) + 90
    };

    const p = Player.state;

    const playerBox = {
      x: p.x + p.hitboxOffsetX,
      y: p.y + p.hitboxOffsetY,
      w: p.hitboxW,
      h: p.hitboxH
    };

    if (rectsOverlap(playerBox, doorBox)) {
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


