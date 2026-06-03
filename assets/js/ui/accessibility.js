/* ============================================================
   assets/js/ui/accessibility.js
   Recursos de acessibilidade — leitor do jogo, alto contraste,
   fonte ampliada, atalhos e feedback por aria-live.
============================================================ */

(() => {
  const STORAGE_KEYS = {
    screenReader: "bugHunters.accessibility.screenReader",
    highContrast: "bugHunters.accessibility.highContrast",
    fontSize: "bugHunters.fontSize"
  };

  const FONT_ORDER = ["small", "normal", "large"];
  const FONT_LABEL = {
    small: "PEQUENA",
    normal: "NORMAL",
    large: "GRANDE"
  };

  const state = {
    screenReader: false,
    highContrast: false,
    fontSize: "normal"
  };

  const speechControl = {
    token: 0,
    lastText: "",
    lastTime: 0
  };

  function canUseBrowserVoice() {
    return (
      "speechSynthesis" in window &&
      "SpeechSynthesisUtterance" in window
    );
  }

  function stopBrowserVoice() {
    speechControl.token++;

    if (!canUseBrowserVoice()) return;

    window.speechSynthesis.cancel();

    // Alguns navegadores mantêm a fila por alguns milissegundos.
    // Esses cancelamentos extras garantem que a voz pare mesmo se houver fala pendente.
    window.setTimeout(() => window.speechSynthesis.cancel(), 30);
    window.setTimeout(() => window.speechSynthesis.cancel(), 120);
    window.setTimeout(() => window.speechSynthesis.cancel(), 300);
  }

  function getById(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const element = getById(id);

    if (element) {
      element.textContent = value;
    }
  }

  function isTypingTarget(target) {
    if (!target) return false;

    const tag = target.tagName?.toLowerCase();

    return (
      tag === "input" ||
      tag === "textarea" ||
      tag === "select" ||
      target.isContentEditable
    );
  }

  function isVisible(element) {
    return element && element.style.display !== "none";
  }

  function isAccessibilityVisible() {
    return isVisible(getById("screen-accessibility"));
  }

  function updateLiveRegion(message) {
    const liveRegion = getById("accessibility-live-region");

    if (liveRegion) {
      liveRegion.textContent = "";

      window.setTimeout(() => {
        liveRegion.textContent = message;
      }, 20);
    }

    setText("accessibility-status", message);
  }

  function getBestPortugueseVoice() {
    if (!canUseBrowserVoice()) return null;

    const voices = window.speechSynthesis.getVoices();

    return (
      voices.find(voice => voice.lang?.toLowerCase() === "pt-br") ||
      voices.find(voice => voice.lang?.toLowerCase().startsWith("pt")) ||
      voices[0] ||
      null
    );
  }

  function speak(message, force = false) {
    const cleanMessage = String(message || "").replace(/\s+/g, " ").trim();

    if (!cleanMessage) return;

    updateLiveRegion(cleanMessage);

    // Se o leitor estiver desligado, nenhuma voz deve continuar ou iniciar.
    if (!state.screenReader && !force) {
      stopBrowserVoice();
      return;
    }

    if (!canUseBrowserVoice()) {
      updateLiveRegion("Seu navegador não liberou a narração automática. O aviso foi enviado como texto acessível na tela.");
      return;
    }

    const now = Date.now();

    // Evita repetir a mesma fala muitas vezes quando o foco fica oscilando.
    if (speechControl.lastText === cleanMessage && now - speechControl.lastTime < 450) {
      return;
    }

    speechControl.lastText = cleanMessage;
    speechControl.lastTime = now;

    stopBrowserVoice();

    const currentToken = speechControl.token;

    window.setTimeout(() => {
      if (currentToken !== speechControl.token) return;
      if (!state.screenReader && !force) return;

      const utterance = new SpeechSynthesisUtterance(cleanMessage);
      const voice = getBestPortugueseVoice();

      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang || "pt-BR";
      } else {
        utterance.lang = "pt-BR";
      }

      utterance.rate = 0.92;
      utterance.pitch = 1;
      utterance.volume = 1;

      utterance.onend = () => {
        if (currentToken === speechControl.token) {
          window.speechSynthesis.cancel();
        }
      };

      window.speechSynthesis.speak(utterance);
    }, 40);
  }

  function getCurrentInstruction() {
    const activeScreen = Array.from(document.querySelectorAll(".overlay"))
      .find(screen => screen.style.display !== "none");

    if (!activeScreen || activeScreen.id === "screen-main-menu") {
      return "Você está no menu inicial. Pressione A para jogar, W para configurações ou D para abrir acessibilidade.";
    }

    const instructions = {
      "screen-accessibility": "Você está na tela de acessibilidade. Pressione L para ligar ou desligar o leitor de tela, C para alto contraste, mais ou menos para mudar o tamanho da fonte e Escape para voltar.",
      "screen-settings": "Você está nas configurações. Use Tab para navegar. Ajuste o volume e escolha o tamanho da fonte. Pressione Escape para voltar ao menu.",
      "screen-difficulty": "Escolha a dificuldade do jogo. Use Tab para navegar pelas opções e Enter para selecionar.",
      "screen-bug-popup": "Bug detectado. Pressione Enter no botão corrigir bug para iniciar a missão, ou escolha ignorar para voltar ao mapa.",
      "screen-mission": "Missão aberta. Leia o enunciado, o código e selecione uma alternativa. Use Tab para navegar e Enter para responder.",
      "screen-tutorial": "Tutorial aberto. Pressione seta para a direita, Enter ou Espaço para avançar. Pressione Escape para fechar.",
      "screen-glossary": "Glossário aberto. Use Tab para navegar entre os temas e o botão voltar ao jogo para fechar."
    };

    return instructions[activeScreen.id] || "Use Tab para navegar, Enter para selecionar e Escape para voltar quando disponível.";
  }

  function updateScreenReaderButton() {
    const button = getById("btn-screen-reader");
    const buttonText = button?.querySelector(".access-btn-text");

    document.body.classList.toggle("access-screen-reader-on", state.screenReader);

    setText("screen-reader-value", state.screenReader ? "LIGADO" : "DESLIGADO");

    if (button) {
      button.setAttribute("aria-pressed", String(state.screenReader));
      button.setAttribute(
        "aria-label",
        state.screenReader
          ? "Desativar leitor de tela do jogo, atalho tecla L"
          : "Ativar leitor de tela do jogo, atalho tecla L"
      );
    }

    if (buttonText) {
      buttonText.textContent = state.screenReader ? "DESATIVAR LEITOR" : "ATIVAR LEITOR";
    }
  }

  function setScreenReader(enabled, shouldSpeak = true) {
    const willEnable = Boolean(enabled);

    state.screenReader = willEnable;
    localStorage.setItem(STORAGE_KEYS.screenReader, state.screenReader ? "1" : "0");
    updateScreenReaderButton();

    if (!willEnable) {
      stopBrowserVoice();
      updateLiveRegion("Leitor de tela do jogo desativado.");
      return;
    }

    const message = "Leitor de tela do jogo ativado. " + getCurrentInstruction();

    if (shouldSpeak) {
      speak(message, true);
    } else {
      updateLiveRegion(message);
    }
  }

  function toggleScreenReader() {
    setScreenReader(!state.screenReader, true);
  }

  function updateContrastButton() {
    const button = getById("btn-high-contrast");
    const buttonText = button?.querySelector(".access-btn-text");

    document.body.classList.toggle("high-contrast-on", state.highContrast);

    setText("contrast-value", state.highContrast ? "LIGADO" : "DESLIGADO");

    if (button) {
      button.setAttribute("aria-pressed", String(state.highContrast));
      button.setAttribute(
        "aria-label",
        state.highContrast
          ? "Desativar cores com alto contraste, atalho tecla C"
          : "Ativar cores com alto contraste, atalho tecla C"
      );
    }

    if (buttonText) {
      buttonText.textContent = state.highContrast ? "DESATIVAR CONTRASTE" : "ATIVAR CONTRASTE";
    }
  }

  function setHighContrast(enabled, shouldSpeak = true) {
    state.highContrast = Boolean(enabled);
    localStorage.setItem(STORAGE_KEYS.highContrast, state.highContrast ? "1" : "0");
    updateContrastButton();

    const message = state.highContrast
      ? "Alto contraste ativado. Os textos, botões e foco agora estão mais destacados."
      : "Alto contraste desativado.";

    if (shouldSpeak) speak(message);
    else updateLiveRegion(message);
  }

  function toggleHighContrast() {
    setHighContrast(!state.highContrast, true);
  }

  function syncFontLabels(size) {
    const selected = FONT_ORDER.includes(size) ? size : "normal";

    setText("font-size-access-value", FONT_LABEL[selected]);
    setText("font-size-value", FONT_LABEL[selected]);

    document.querySelectorAll(".font-option-btn").forEach(button => {
      button.classList.toggle("active", button.dataset.fontSize === selected);
      button.setAttribute("aria-pressed", String(button.dataset.fontSize === selected));
    });
  }

  function setFontSize(size, shouldSpeak = true) {
    const selected = FONT_ORDER.includes(size) ? size : "normal";
    state.fontSize = selected;

    if (typeof window.setGameFontSize === "function") {
      window.setGameFontSize(selected);
    } else {
      document.body.classList.remove("font-size-small", "font-size-normal", "font-size-large");
      document.body.classList.add(`font-size-${selected}`);
      localStorage.setItem(STORAGE_KEYS.fontSize, selected);
    }

    syncFontLabels(selected);

    const message = `Tamanho da fonte alterado para ${FONT_LABEL[selected].toLowerCase()}.`;

    if (shouldSpeak) speak(message);
    else updateLiveRegion(message);
  }

  function changeFontByStep(step) {
    const currentIndex = FONT_ORDER.indexOf(state.fontSize);
    const safeIndex = currentIndex === -1 ? 1 : currentIndex;
    const nextIndex = Math.min(FONT_ORDER.length - 1, Math.max(0, safeIndex + step));

    setFontSize(FONT_ORDER[nextIndex], true);
  }

  function readCurrentInstructions() {
    speak(getCurrentInstruction(), true);
  }

  function describeFocusedElement(event) {
    if (!state.screenReader) return;

    const target = event.target;

    if (!target || !isAccessibilityVisible() && !target.closest?.(".overlay")) return;

    const label =
      target.getAttribute?.("aria-label") ||
      target.innerText ||
      target.textContent ||
      target.title ||
      "Elemento focado";

    const cleanLabel = label.replace(/\s+/g, " ").trim();

    if (cleanLabel) {
      speak(cleanLabel);
    }
  }

  function setupButtons() {
    getById("btn-screen-reader")?.addEventListener("click", toggleScreenReader);
    getById("btn-high-contrast")?.addEventListener("click", toggleHighContrast);
    getById("btn-read-current")?.addEventListener("click", readCurrentInstructions);

    document.querySelectorAll(".font-option-btn[data-font-size]").forEach(button => {
      button.addEventListener("click", () => {
        setFontSize(button.dataset.fontSize, true);
      });
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener("keydown", event => {
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();

      if (key === "l") {
        event.preventDefault();
        toggleScreenReader();
        return;
      }

      if (key === "c") {
        event.preventDefault();
        toggleHighContrast();
        return;
      }

      if (event.key === "+" || event.key === "=" || event.code === "NumpadAdd") {
        event.preventDefault();
        changeFontByStep(1);
        return;
      }

      if (event.key === "-" || event.code === "NumpadSubtract") {
        event.preventDefault();
        changeFontByStep(-1);
        return;
      }

      if (event.key === "Escape" && isAccessibilityVisible()) {
        event.preventDefault();
        if (typeof window.backToMainMenu === "function") {
          window.backToMainMenu();
          speak("Voltando ao menu inicial. Pressione A para jogar, W para configurações ou D para acessibilidade.");
        }
      }
    });
  }

  function patchAccessibilityOpen() {
    const originalOpen = window.openAccessibilityMenu;

    window.openAccessibilityMenu = function openAccessibilityMenuPatched() {
      if (typeof originalOpen === "function") {
        originalOpen();
      } else if (window.UI?.showScreen) {
        window.UI.showScreen("screen-accessibility");
      } else {
        const screen = getById("screen-accessibility");
        if (screen) screen.style.display = "flex";
      }

      window.setTimeout(() => {
        getById("btn-screen-reader")?.focus();
        speak(getCurrentInstruction());
      }, 80);
    };
  }

  function patchBackToMenu() {
    const originalBack = window.backToMainMenu;

    window.backToMainMenu = function backToMainMenuPatched() {
      if (typeof originalBack === "function") {
        originalBack();
      } else if (window.UI?.showScreen) {
        window.UI.showScreen("screen-main-menu");
      }

      speak("Menu inicial aberto. Pressione A para jogar, W para configurações ou D para acessibilidade.");
    };
  }

  function loadSavedSettings() {
    state.screenReader = localStorage.getItem(STORAGE_KEYS.screenReader) === "1";
    state.highContrast = localStorage.getItem(STORAGE_KEYS.highContrast) === "1";
    state.fontSize = localStorage.getItem(STORAGE_KEYS.fontSize) || "normal";

    updateScreenReaderButton();
    updateContrastButton();
    setHighContrast(state.highContrast, false);
    setFontSize(state.fontSize, false);

    if (state.screenReader) {
      updateLiveRegion("Leitor de tela do jogo carregado. Pressione D para abrir acessibilidade ou A para jogar.");
    }
  }

  function init() {
    setupButtons();
    setupKeyboardShortcuts();
    patchAccessibilityOpen();
    patchBackToMenu();
    loadSavedSettings();

    if (canUseBrowserVoice()) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }

    document.addEventListener("focusin", describeFocusedElement);
  }

  document.addEventListener("DOMContentLoaded", init);

  window.AccessibilitySystem = {
    speak,
    stopBrowserVoice,
    toggleScreenReader,
    toggleHighContrast,
    setScreenReader,
    setFontSize,
    readCurrentInstructions
  };
})();
