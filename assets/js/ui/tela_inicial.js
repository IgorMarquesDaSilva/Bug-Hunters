/* ============================================================
   assets/js/ui/tela_inicial.js
   Tela inicial — atalhos de teclado e configurações
============================================================ */

(() => {
  const STORAGE_KEYS = {
    musicVolume: "bugHunters.audio.master",
    fontSize: "bugHunters.fontSize"
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
    showScreen("screen-settings");
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

  function setupSettingsControls() {
    const savedVolume = String(Math.round((Number(localStorage.getItem(STORAGE_KEYS.musicVolume)) || 0.8) * 100));
    const savedFontSize = localStorage.getItem(STORAGE_KEYS.fontSize) ?? "normal";

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

    applyMusicVolume(savedVolume);
    applyFontSize(savedFontSize);
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
})();
