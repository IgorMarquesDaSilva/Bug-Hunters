/* ============================================================
   assets/js/systems/bugs.js
   Sistema de missões fixas por sala.
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

    const missionSelector =
      GameState.currentRoom === "sala1"
        ? "#room-map .sala1-mission"
        : "#room-map .sala2-mission";

    const points = Array.from(
      document.querySelectorAll(missionSelector)
    );

    points.forEach(point => {
      point.classList.remove(
        "mission-available",
        "mission-solved"
      );
    });

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

        const mission =
          GameState.currentMissions()[bug.missionIdx];

        const title =
          mission.title.split("—")[1]?.trim()
          ?? mission.title;

        document.getElementById(
          "popup-bug-desc"
        ).textContent =
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

    const door =
      document.querySelector("#room-map .door");

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

    const door =
      document.querySelector("#room-map .door");

    const canvas =
      document.getElementById("gameCanvas");

    const roomMap =
      document.getElementById("room-map");

    if (!door || !canvas || !roomMap) return;

    const mapRect = roomMap.getBoundingClientRect();
    const doorRect = door.getBoundingClientRect();

    const scaleX = canvas.width / mapRect.width;
    const scaleY = canvas.height / mapRect.height;

    const doorBox = {
      x: Math.round((doorRect.left - mapRect.left) * scaleX) - 35,
      y: Math.round((doorRect.top - mapRect.top) * scaleY) - 35,
      w: Math.round(doorRect.width * scaleX) + 70,
      h: Math.round(doorRect.height * scaleY) + 70
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