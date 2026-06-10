/* ============================================================
   assets/js/ui/accessibility.js
   Acessibilidade — leitor de tela do jogo com voz do navegador,
   alto contraste, fonte ampliada, atalhos e aria-live.
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
    fontSize: "normal",
    initialized: false
  };

  const speech = {
    token: 0,
    voices: [],
    lastText: "",
    lastTime: 0
  };

  function getById(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const el = getById(id);
    if (el) el.textContent = value;
  }

  function canSpeak() {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  function refreshVoices() {
    if (!canSpeak()) return;
    speech.voices = window.speechSynthesis.getVoices() || [];
  }

  function bestVoice() {
    refreshVoices();
    return (
      speech.voices.find(v => v.lang && v.lang.toLowerCase() === "pt-br") ||
      speech.voices.find(v => v.lang && v.lang.toLowerCase().startsWith("pt")) ||
      speech.voices[0] ||
      null
    );
  }

  function stopBrowserVoice() {
    speech.token++;

    if (!canSpeak()) return;

    window.speechSynthesis.cancel();
    window.setTimeout(() => window.speechSynthesis.cancel(), 30);
    window.setTimeout(() => window.speechSynthesis.cancel(), 120);
    window.setTimeout(() => window.speechSynthesis.cancel(), 300);
  }

  function updateLiveRegion(message) {
    const clean = String(message || "").replace(/\s+/g, " ").trim();

    ["accessibility-live-region", "tutorial-live-region"].forEach(id => {
      const live = getById(id);
      if (!live) return;
      live.textContent = "";
      window.setTimeout(() => {
        live.textContent = clean;
      }, 20);
    });

    setText("accessibility-status", clean);
  }

  function speak(message, force = false) {
    const clean = String(message || "").replace(/\s+/g, " ").trim();
    if (!clean) return;

    updateLiveRegion(clean);

    if (!force && !state.screenReader) {
      stopBrowserVoice();
      return;
    }

    if (!canSpeak()) {
      updateLiveRegion("Este navegador não liberou a voz automática. O texto foi enviado para a região acessível da tela.");
      return;
    }

    const now = Date.now();
    if (speech.lastText === clean && now - speech.lastTime < 400) return;
    speech.lastText = clean;
    speech.lastTime = now;

    stopBrowserVoice();
    const token = speech.token;

    const utterance = new SpeechSynthesisUtterance(clean);
    const voice = bestVoice();

    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || "pt-BR";
    } else {
      utterance.lang = "pt-BR";
    }

    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.volume = 1;

    window.setTimeout(() => {
      if (token !== speech.token) return;
      if (!force && !state.screenReader) return;
      window.speechSynthesis.speak(utterance);
    }, 30);
  }

  function isTypingTarget(target) {
    const tag = target?.tagName?.toLowerCase();
    return tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable;
  }

  function visibleScreen() {
    return Array.from(document.querySelectorAll(".overlay"))
      .find(screen => screen.style.display !== "none");
  }

  function isVisible(id) {
    const el = getById(id);
    return el && el.style.display !== "none";
  }

  function getCurrentInstruction() {
    const active = visibleScreen();

    if (!active || active.id === "screen-main-menu") {
      return "Você está no menu inicial. Pressione A para jogar, W para configurações ou D para acessibilidade.";
    }

    const instructions = {
      "screen-accessibility": "Você está na tela de acessibilidade. Pressione L para ligar ou desligar o leitor de tela, C para alto contraste, mais ou menos para mudar a fonte e Escape para voltar.",
      "screen-settings": "Você está nas configurações de som. Use Tab para navegar pelos controles de volume e pelos botões que ativam ou removem o som de fundo e os sons dos botões.",
      "screen-difficulty": "Escolha a dificuldade. Use Tab para navegar e Enter para selecionar fácil, médio ou difícil.",
      "screen-tutorial": "Tutorial aberto. Use Próximo para avançar, Anterior para voltar, ou o botão Ler Etapa para ouvir a explicação atual.",
      "screen-bug-popup": "Bug detectado. Escolha Corrigir Bug para iniciar a missão ou Ignorar para voltar ao mapa.",
      "screen-mission": "Missão aberta. Leia o enunciado, o código e selecione uma alternativa. Use Tab para navegar e Enter para responder.",
      "screen-room-clear": "Setor limpo. Libere a porta e vá até ela para avançar.",
      "screen-next-level": "Acesso liberado. Pressione avançar para entrar no próximo setor.",
      "screen-glossary": "Glossário aberto. Use Tab para navegar entre os temas e conteúdos."
    };

    return instructions[active.id] || "Use Tab para navegar, Enter para selecionar e Escape para voltar quando disponível.";
  }

  function updateScreenReaderButton() {
    const button = getById("btn-screen-reader");
    const text = button?.querySelector(".access-btn-text");

    document.body.classList.toggle("access-screen-reader-on", state.screenReader);
    setText("screen-reader-value", state.screenReader ? "LIGADO" : "DESLIGADO");

    if (button) {
      button.setAttribute("aria-pressed", String(state.screenReader));
      button.setAttribute("aria-label", state.screenReader ? "Desativar leitor de tela do jogo" : "Ativar leitor de tela do jogo");
    }

    if (text) text.textContent = state.screenReader ? "DESATIVAR LEITOR" : "ATIVAR LEITOR";
  }

  function setScreenReader(enabled, shouldSpeak = true) {
    state.screenReader = Boolean(enabled);
    localStorage.setItem(STORAGE_KEYS.screenReader, state.screenReader ? "1" : "0");
    updateScreenReaderButton();

    if (!state.screenReader) {
      stopBrowserVoice();
      updateLiveRegion("Leitor de tela do jogo desativado.");
      return;
    }

    const msg = "Leitor de tela do jogo ativado. " + getCurrentInstruction();
    if (shouldSpeak) speak(msg, true);
    else updateLiveRegion(msg);
  }

  function toggleScreenReader() {
    setScreenReader(!state.screenReader, true);
  }

  function updateContrastButton() {
    const button = getById("btn-high-contrast");
    const text = button?.querySelector(".access-btn-text");

    document.body.classList.toggle("high-contrast-on", state.highContrast);
    setText("contrast-value", state.highContrast ? "LIGADO" : "DESLIGADO");

    if (button) {
      button.setAttribute("aria-pressed", String(state.highContrast));
      button.setAttribute("aria-label", state.highContrast ? "Desativar alto contraste" : "Ativar alto contraste");
    }

    if (text) text.textContent = state.highContrast ? "DESATIVAR CONTRASTE" : "ATIVAR CONTRASTE";
  }

  function setHighContrast(enabled, shouldSpeak = true) {
    state.highContrast = Boolean(enabled);
    localStorage.setItem(STORAGE_KEYS.highContrast, state.highContrast ? "1" : "0");
    updateContrastButton();

    const msg = state.highContrast ? "Alto contraste ativado." : "Alto contraste desativado.";
    if (shouldSpeak) speak(msg);
    else updateLiveRegion(msg);
  }

  function toggleHighContrast() {
    setHighContrast(!state.highContrast, true);
  }

  function syncFontLabels(size) {
    const selected = FONT_ORDER.includes(size) ? size : "normal";
    setText("font-size-access-value", FONT_LABEL[selected]);

    document.querySelectorAll(".font-option-btn[data-font-size]").forEach(btn => {
      const active = btn.dataset.fontSize === selected;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });
  }

  function setFontSize(size, shouldSpeak = true) {
    const selected = FONT_ORDER.includes(size) ? size : "normal";
    state.fontSize = selected;

    document.body.classList.remove("font-size-small", "font-size-normal", "font-size-large");
    document.body.classList.add(`font-size-${selected}`);
    localStorage.setItem(STORAGE_KEYS.fontSize, selected);
    syncFontLabels(selected);

    const msg = `Tamanho da fonte alterado para ${FONT_LABEL[selected].toLowerCase()}.`;
    if (shouldSpeak) speak(msg);
    else updateLiveRegion(msg);
  }

  function changeFont(step) {
    const current = FONT_ORDER.indexOf(state.fontSize);
    const index = current === -1 ? 1 : current;
    const next = Math.max(0, Math.min(FONT_ORDER.length - 1, index + step));
    setFontSize(FONT_ORDER[next], true);
  }

  function readCurrentInstructions() {
    speak(getCurrentInstruction(), true);
  }

  function describeFocusedElement(event) {
    if (!state.screenReader) return;

    const target = event.target;
    if (!target) return;

    const insideUsefulArea = target.closest?.(".overlay") || target.closest?.(".hud-panel");
    if (!insideUsefulArea) return;

    const label =
      target.getAttribute?.("aria-label") ||
      target.innerText ||
      target.textContent ||
      target.title ||
      "Elemento focado";

    const clean = String(label).replace(/\s+/g, " ").trim();
    if (clean) speak(clean);
  }

  function setupButtons() {
    getById("btn-screen-reader")?.addEventListener("click", toggleScreenReader);
    getById("btn-high-contrast")?.addEventListener("click", toggleHighContrast);
    getById("btn-read-current")?.addEventListener("click", readCurrentInstructions);

    document.querySelectorAll(".font-option-btn[data-font-size]").forEach(btn => {
      btn.addEventListener("click", () => setFontSize(btn.dataset.fontSize, true));
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
        changeFont(1);
        return;
      }

      if (event.key === "-" || event.code === "NumpadSubtract") {
        event.preventDefault();
        changeFont(-1);
        return;
      }

      if (event.key === "Escape" && isVisible("screen-accessibility")) {
        event.preventDefault();
        window.backToMainMenu?.();
      }
    });
  }

  function patchOpeners() {
    const originalOpen = window.openAccessibilityMenu;
    window.openAccessibilityMenu = function patchedOpenAccessibilityMenu() {
      if (typeof originalOpen === "function") originalOpen();
      else if (window.UI?.showScreen) UI.showScreen("screen-accessibility");
      else if (getById("screen-accessibility")) getById("screen-accessibility").style.display = "flex";

      window.setTimeout(() => {
        getById("btn-screen-reader")?.focus();
        speak(getCurrentInstruction());
      }, 80);
    };

    const originalBack = window.backToMainMenu;
    window.backToMainMenu = function patchedBackToMainMenu() {
      if (typeof originalBack === "function") originalBack();
      else if (window.UI?.showScreen) UI.showScreen("screen-main-menu");

      speak("Menu inicial aberto. Pressione A para jogar, W para configurações ou D para acessibilidade.");
    };
  }

  function loadSavedSettings() {
    state.screenReader = localStorage.getItem(STORAGE_KEYS.screenReader) === "1";
    state.highContrast = localStorage.getItem(STORAGE_KEYS.highContrast) === "1";
    state.fontSize = localStorage.getItem(STORAGE_KEYS.fontSize) || "normal";

    updateScreenReaderButton();
    setHighContrast(state.highContrast, false);
    setFontSize(state.fontSize, false);
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;

    refreshVoices();
    if (canSpeak()) window.speechSynthesis.onvoiceschanged = refreshVoices;

    setupButtons();
    setupKeyboardShortcuts();
    patchOpeners();
    loadSavedSettings();

    document.addEventListener("focusin", describeFocusedElement);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.AccessibilitySystem = {
    speak,
    stopBrowserVoice,
    toggleScreenReader,
    setScreenReader,
    toggleHighContrast,
    setHighContrast,
    setFontSize,
    readCurrentInstructions,
    isScreenReaderEnabled: () => state.screenReader
  };
})();
