/* ============================================================
   Controle direcional por toque para telas compactas.
============================================================ */

window.MobileControls = (() => {
  let initialized = false;
  const activePointers = new Map();
  let scrollGesture = null;
  let suppressedClick = null;

  function setPressed(button, isPressed) {
    const direction = button?.dataset.direction;
    if (!direction) return;

    button.classList.toggle("is-pressed", isPressed);
    button.setAttribute("aria-pressed", String(isPressed));
    window.Player?.setDirectionInput?.(direction, isPressed);
  }

  function releasePointer(pointerId) {
    const button = activePointers.get(pointerId);
    if (!button) return;

    activePointers.delete(pointerId);

    const stillPressed = Array.from(activePointers.values())
      .some(activeButton => activeButton === button);

    if (!stillPressed) setPressed(button, false);
  }

  function releaseAll() {
    scrollGesture = null;
    activePointers.forEach(button => setPressed(button, false));
    activePointers.clear();

    document.querySelectorAll(".mobile-dpad-btn.is-pressed").forEach(button => {
      setPressed(button, false);
    });

    window.Player?.clearDirectionInput?.();
  }

  function bindRotatedScrolling() {
    // Em paisagem manual, o eixo vertical do conteúdo aparece na horizontal
    // da tela física. O gesto também pode começar sobre uma carta ou botão.
    document.addEventListener("pointerdown", event => {
      if (!document.body.classList.contains("mobile-force-landscape") ||
          !["touch", "pen"].includes(event.pointerType) || !event.isPrimary ||
          event.target.closest("input, textarea, select, [contenteditable='true']")) return;
      const overlay = event.target.closest(".overlay");
      if (!overlay) return;
      const containers = [];
      for (let node = event.target; node && overlay.contains(node); node = node.parentElement) {
        if (node.scrollHeight > node.clientHeight + 1 && /auto|scroll/.test(getComputedStyle(node).overflowY)) {
          containers.push(node);
        }
      }
      if (containers.length) scrollGesture = {
        id: event.pointerId, startX: event.clientX, lastX: event.clientX,
        overlay, containers, dragging: false
      };
    });

    document.addEventListener("pointermove", event => {
      const gesture = scrollGesture;
      if (!gesture || event.pointerId !== gesture.id) return;
      if (!gesture.dragging && Math.abs(event.clientX - gesture.startX) < 8) return;
      if (!gesture.dragging) {
        gesture.dragging = true;
        gesture.overlay.setPointerCapture?.(event.pointerId);
      }
      let delta = event.clientX - gesture.lastX;
      gesture.lastX = event.clientX;
      for (const node of gesture.containers) {
        const previous = node.scrollTop;
        node.scrollTop += delta;
        delta -= node.scrollTop - previous;
        if (Math.abs(delta) < 1) break;
      }
      event.preventDefault();
    }, { passive: false });

    for (const eventName of ["pointerup", "pointercancel"]) {
      document.addEventListener(eventName, event => {
        if (event.pointerId !== scrollGesture?.id) return;
        if (scrollGesture.dragging) suppressedClick = {
          id: event.pointerId, overlay: scrollGesture.overlay, until: performance.now() + 400
        };
        scrollGesture = null;
      });
    }

    document.addEventListener("click", event => {
      if (suppressedClick && performance.now() < suppressedClick.until &&
          suppressedClick.overlay.contains(event.target) && event.detail !== 0 &&
          event.pointerId === suppressedClick.id) {
        event.preventDefault();
        event.stopImmediatePropagation();
      }
      suppressedClick = null;
    }, true);
  }

  function bindButton(button) {
    button.setAttribute("aria-pressed", "false");

    button.addEventListener("pointerdown", event => {
      event.preventDefault();
      activePointers.set(event.pointerId, button);
      button.setPointerCapture?.(event.pointerId);
      setPressed(button, true);
    });

    ["pointerup", "pointercancel", "lostpointercapture"].forEach(eventName => {
      button.addEventListener(eventName, event => {
        event.preventDefault();
        releasePointer(event.pointerId);
      });
    });

    button.addEventListener("contextmenu", event => {
      event.preventDefault();
    });
  }

  function init() {
    if (initialized) return;
    initialized = true;
    bindRotatedScrolling();

    document.querySelectorAll(".mobile-dpad-btn[data-direction]")
      .forEach(bindButton);

    // Garante a liberação mesmo quando uma rotação do Android move o
    // botão para fora da área original durante um toque.
    ["pointerup", "pointercancel"].forEach(eventName => {
      document.addEventListener(eventName, event => {
        releasePointer(event.pointerId);
      });
    });

    window.addEventListener("blur", releaseAll);
    window.addEventListener("orientationchange", releaseAll, { passive: true });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) releaseAll();
    });
  }

  return {
    init,
    releaseAll
  };
})();
