/* ============================================================
   assets/js/ui/tela_inicial.js
   Tela inicial — atalhos de teclado e configurações
=========================================*/

(() => {
  let settingsReturnTarget = "main-menu";

  const STORAGE_KEYS = {
    musicVolume: "bugHunters.audio.master",
    fontSize: "bugHunters.fontSize",
    mobileControlSide: "bugHunters.mobileControlSide"
  };

  const shortcuts = {
    a: {
      buttonId: "btn-main-play",
      action: () => window.startGameFromMenu()
    },
    w: {
      buttonId: "btn-main-settings",
      action: () => window.openSettingsMenu()
    },
    d: {
      buttonId: "btn-main-accessibility",
      action: () => window.openAccessibilityMenu()
    }
  };

  function showScreen(screenId) {
    if (window.UI && typeof window.UI.showScreen === "function") {
      window.UI.showScreen(screenId);
      return;
    }

    document.querySelectorAll(".overlay").forEach(screen => {
      screen.style.display = "none";
    });

    const screen = document.getElementById(screenId);

    if (screen) {
      screen.style.display = "flex";
    }
  }

  window.startGameFromMenu = function startGameFromMenu() {
    showScreen("screen-difficulty");
  };

  window.openSettingsMenu = function openSettingsMenu() {
    settingsReturnTarget = "main-menu";
    showScreen("screen-settings");
  };

  window.openSettingsFromGame = function openSettingsFromGame() {
    settingsReturnTarget = "game";

    // Se as configurações forem abertas enquanto o aviso ou a tela de uma
    // missão estiver ativo, encerra essa interação antes de trocar de overlay.
    // Sem isso, activeIdx permanece preenchido e bloqueia novos popups.
    if (typeof GameState !== "undefined" && GameState.activeIdx !== -1) {
      if (window.UI?.closePopup) {
        window.UI.closePopup();
      } else {
        GameState.activeIdx = -1;
        GameState.popupCooldown = 60;
      }
    }

    showScreen("screen-settings");
  };

  window.closeSettingsMenu = function closeSettingsMenu() {
    if (settingsReturnTarget === "game") {
      showScreen(null);
      return;
    }

    showScreen("screen-main-menu");
  };

  window.openAccessibilityMenu = function openAccessibilityMenu() {
    showScreen("screen-accessibility");
  };

  window.backToMainMenu = function backToMainMenu() {
    showScreen("screen-main-menu");
  };

  function isVisible(element) {
    return element && element.style.display !== "none";
  }

  function isMainMenuVisible() {
    return isVisible(document.getElementById("screen-main-menu"));
  }

  function pulseButton(buttonId) {
    const button = document.getElementById(buttonId);

    if (!button) return;

    button.classList.remove("keyboard-active");
    void button.offsetWidth;
    button.classList.add("keyboard-active");

    window.setTimeout(() => {
      button.classList.remove("keyboard-active");
    }, 220);
  }

  function triggerShortcut(key) {
    const shortcut = shortcuts[key];

    if (!shortcut || !isMainMenuVisible()) return false;

    pulseButton(shortcut.buttonId);
    shortcut.action();
    return true;
  }

  function applyMusicVolume(value) {
    const numericValue = Number(value);
    const safeValue = Number.isFinite(numericValue)
      ? Math.min(100, Math.max(0, numericValue))
      : 80;

    const valueText = document.getElementById("master-volume-value");

    if (valueText) {
      valueText.textContent = `${safeValue}%`;
    }

    if (window.GameAudio && typeof window.GameAudio.setMaster === "function") {
      window.GameAudio.setMaster(safeValue / 100);
    } else {
      localStorage.setItem(STORAGE_KEYS.musicVolume, String(safeValue / 100));
    }
  }

  function applyFontSize(size) {
    const validSizes = ["small", "normal", "large"];
    const selectedSize = validSizes.includes(size) ? size : "normal";

    document.body.classList.remove(
      "font-size-small",
      "font-size-normal",
      "font-size-large"
    );

    document.body.classList.add(`font-size-${selectedSize}`);

    const labelMap = {
      small: "PEQUENA",
      normal: "NORMAL",
      large: "GRANDE"
    };

    const valueText = document.getElementById("font-size-access-value");

    if (valueText) {
      valueText.textContent = labelMap[selectedSize];
    }

    document.querySelectorAll(".font-option-btn").forEach(button => {
      button.classList.toggle(
        "active",
        button.dataset.fontSize === selectedSize
      );
    });

    localStorage.setItem(STORAGE_KEYS.fontSize, selectedSize);
  }

  function applyMobileControlSide(side) {
    const selectedSide = side === "left" ? "left" : "right";

    document.body.classList.toggle(
      "mobile-controls-left",
      selectedSide === "left"
    );
    document.body.classList.toggle(
      "mobile-controls-right",
      selectedSide === "right"
    );

    const valueText = document.getElementById("mobile-control-side-value");
    if (valueText) valueText.textContent = selectedSide === "left" ? "ESQUERDA" : "DIREITA";

    document.querySelectorAll(".mobile-control-side-btn").forEach(button => {
      const isSelected = button.dataset.controlSide === selectedSide;
      button.classList.toggle("active", isSelected);
      button.setAttribute("aria-pressed", String(isSelected));
    });

    localStorage.setItem(STORAGE_KEYS.mobileControlSide, selectedSide);
    window.ResponsiveLayout?.update?.();
  }

  function setupSettingsControls() {
    const savedVolume = String(Math.round((Number(localStorage.getItem(STORAGE_KEYS.musicVolume)) || 0.8) * 100));
    const savedFontSize = localStorage.getItem(STORAGE_KEYS.fontSize) ?? "normal";
    const savedMobileControlSide =
      localStorage.getItem(STORAGE_KEYS.mobileControlSide) ?? "right";

    const volumeControl = document.getElementById("master-volume-control");

    if (volumeControl) {
      volumeControl.value = savedVolume;
      volumeControl.addEventListener("input", event => {
        applyMusicVolume(event.target.value);
      });
    }

    document.querySelectorAll(".font-option-btn").forEach(button => {
      button.addEventListener("click", () => {
        applyFontSize(button.dataset.fontSize);
      });
    });

    document.querySelectorAll(".mobile-control-side-btn").forEach(button => {
      button.addEventListener("click", () => {
        applyMobileControlSide(button.dataset.controlSide);
      });
    });

    applyMusicVolume(savedVolume);
    applyFontSize(savedFontSize);
    applyMobileControlSide(savedMobileControlSide);
  }

  document.addEventListener("keydown", event => {
    const key = event.key.toLowerCase();

    if (triggerShortcut(key)) {
      event.preventDefault();
    }
  });

  document.addEventListener("DOMContentLoaded", setupSettingsControls);

  window.setGameMusicVolume = applyMusicVolume;
  window.setGameFontSize = applyFontSize;
  window.setMobileControlSide = applyMobileControlSide;
})();
