/* ============================================================
   Ajusta o quadro visual à resolução sem alterar a grade lógica
   de 1000 x 600 usada por colisões, missões e entidades.
============================================================ */

window.ResponsiveLayout = (() => {
  const MAP_WIDTH = 1000;
  const MAP_HEIGHT = 600;
  const MAX_SCALE = 1.35;
  const COMPACT_BREAKPOINT = 900;

  let scheduledFrame = 0;

  function getViewportSize() {
    const viewport = window.visualViewport;

    return {
      width: Math.max(
        320,
        Math.floor(viewport?.width || document.documentElement.clientWidth)
      ),
      height: Math.max(
        240,
        Math.floor(viewport?.height || document.documentElement.clientHeight)
      )
    };
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
    const compact = viewport.width <= COMPACT_BREAKPOINT;
    const compactLandscape = compact && viewport.width > viewport.height;
    const wrapperStyle = getComputedStyle(gameWrapper);
    const layoutGap = parseFloat(wrapperStyle.gap) || 16;
    const frameBorder = 6;
    const mobileControlsWidth = compactLandscape ? 170 : 0;

    const hudWidth = compact ? 0 : Math.ceil(hud?.getBoundingClientRect().width || 210);
    const availableWidth = Math.max(
      280,
      viewport.width - bodyInsets.horizontal - hudWidth -
        (compact ? mobileControlsWidth : layoutGap) -
        (compactLandscape ? layoutGap : 0) -
        frameBorder
    );

    const widthScale = availableWidth / MAP_WIDTH;
    const heightScale =
      compact && !compactLandscape
        ? MAX_SCALE
        : Math.max(
            0.4,
            (viewport.height - bodyInsets.vertical - frameBorder) / MAP_HEIGHT
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
