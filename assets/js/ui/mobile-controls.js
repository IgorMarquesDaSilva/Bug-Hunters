/* ============================================================
   Controle direcional por toque para telas compactas.
============================================================ */

window.MobileControls = (() => {
  let initialized = false;
  const activePointers = new Map();

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
    activePointers.forEach(button => setPressed(button, false));
    activePointers.clear();

    document.querySelectorAll(".mobile-dpad-btn.is-pressed").forEach(button => {
      setPressed(button, false);
    });

    window.Player?.clearDirectionInput?.();
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

    document.querySelectorAll(".mobile-dpad-btn[data-direction]")
      .forEach(bindButton);

    window.addEventListener("blur", releaseAll);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) releaseAll();
    });
  }

  return {
    init,
    releaseAll
  };
})();
