/* ============================================================
   Ajusta o quadro visual à resolução sem alterar a grade lógica
   de 1000 x 600 usada por colisões, missões e entidades.
============================================================ */

window.ResponsiveLayout = (() => {
  const MAP_WIDTH = 1000;
  const MAP_HEIGHT = 600;
  const MAX_SCALE = 1.35;
  const COMPACT_BREAKPOINT = 900;
  const LANDSCAPE_CONTROLS_WIDTH = 132;
  const LANDSCAPE_HUD_HEIGHT = 42;
  const LANDSCAPE_COLUMN_GAP = 28;
  // As molduras pixeladas projetam 6 px para fora de cada painel.
  // A folga de 14 px impede que HUD e mapa se atravessem visualmente.
  const LANDSCAPE_ROW_GAP = 14;

  let scheduledFrame = 0;

  function getViewportSize() {
    const viewport = window.visualViewport;

    const rawWidth = Math.max(320, Math.floor(viewport?.width || document.documentElement.clientWidth));
    const rawHeight = Math.max(240, Math.floor(viewport?.height || document.documentElement.clientHeight));
    if (document.body.classList.contains("mobile-force-landscape")) {
      return { width: Math.max(rawWidth, rawHeight), height: Math.min(rawWidth, rawHeight) };
    }
    return { width: rawWidth, height: rawHeight };
  }

  function getBodyInsets() {
    const bodyStyle = getComputedStyle(document.body);

    return {
      horizontal:
        parseFloat(bodyStyle.paddingLeft) +
        parseFloat(bodyStyle.paddingRight),
      vertical:
        parseFloat(bodyStyle.paddingTop) +
        parseFloat(bodyStyle.paddingBottom)
    };
  }

  function update() {
    scheduledFrame = 0;

    const gameContainer = document.getElementById("game-container");
    const gameWrapper = document.querySelector(".game-wrapper");
    const hud = document.querySelector(".hud-panel");

    if (!gameContainer || !gameWrapper) return;

    const viewport = getViewportSize();
    const bodyInsets = getBodyInsets();
    const touchDevice = window.matchMedia?.("(hover: none) and (pointer: coarse)").matches || navigator.maxTouchPoints > 0;
    const compact = viewport.width <= COMPACT_BREAKPOINT || touchDevice;
    const compactLandscape = compact && (
      viewport.width > viewport.height ||
      document.body.classList.contains("mobile-landscape-layout")
    );
    const wrapperStyle = getComputedStyle(gameWrapper);
    const layoutGap = parseFloat(wrapperStyle.gap) || 16;
    const frameBorder = 6;
    const hudWidth = compact ? 0 : Math.ceil(hud?.getBoundingClientRect().width || 210);
    const reservedLandscapeWidth = compactLandscape
      ? LANDSCAPE_CONTROLS_WIDTH + LANDSCAPE_COLUMN_GAP
      : 0;
    const reservedLandscapeHeight = compactLandscape
      ? LANDSCAPE_HUD_HEIGHT + LANDSCAPE_ROW_GAP
      : 0;
    const availableWidth = Math.max(
      280,
      viewport.width - bodyInsets.horizontal - hudWidth -
        (compact ? reservedLandscapeWidth : layoutGap) - frameBorder
    );

    const widthScale = availableWidth / MAP_WIDTH;
    const heightScale =
      compact && !compactLandscape
        ? MAX_SCALE
        : Math.max(
            0.4,
            (
              viewport.height - bodyInsets.vertical - frameBorder -
              reservedLandscapeHeight
            ) / MAP_HEIGHT
          );

    const scale = Math.max(
      0.28,
      Math.min(MAX_SCALE, widthScale, heightScale)
    );

    const stageWidth = Math.floor(MAP_WIDTH * scale);
    const stageHeight = Math.floor(MAP_HEIGHT * scale);

    document.documentElement.style.setProperty(
      "--game-map-scale",
      scale.toFixed(4)
    );
    document.documentElement.style.setProperty(
      "--game-stage-width",
      `${stageWidth}px`
    );
    document.documentElement.style.setProperty(
      "--game-stage-height",
      `${stageHeight}px`
    );
    document.documentElement.style.setProperty(
      "--game-layout-gap",
      `${layoutGap}px`
    );
  }

  function scheduleUpdate() {
    if (scheduledFrame) cancelAnimationFrame(scheduledFrame);
    scheduledFrame = requestAnimationFrame(update);
  }

  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("orientationchange", scheduleUpdate, { passive: true });
  window.visualViewport?.addEventListener("resize", scheduleUpdate, {
    passive: true
  });

  scheduleUpdate();

  return {
    update: scheduleUpdate
  };
})();
