/* ============================================================
   assets/js/ui/accessibility.js
   Acessibilidade para leitores nativos, alto contraste, fontes e teclado.
============================================================ */

(() => {
  const STORAGE_KEYS = {
    highContrast: "bugHunters.accessibility.highContrast",
    fontSize: "bugHunters.fontSize",
    fontFamily: "bugHunters.fontFamily"
  };

  const FONT_ORDER = ["normal", "large", "giant"];
  const FONT_LABEL = {
    normal: "NORMAL",
    large: "GRANDE",
    giant: "GIGANTE"
  };

  const state = {
    highContrast: false,
    fontSize: "normal",
    fontFamily: "default",
    initialized: false
  };

  const pending = new Map();
  const lastAnnouncements = new Map();

  function getById(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const el = getById(id);
    if (el) el.textContent = value;
  }

  // Apenas expõe texto ao leitor nativo. O jogo não gera voz própria.
  function announce(message, { priority = "polite", key = "", cooldown = 0 } = {}) {
    const clean = String(message || "").replace(/\s+/g, " ").trim();
    if (!clean) return;
    const now = Date.now();
    if (key && now - (lastAnnouncements.get(key) ?? -Infinity) < cooldown) return;
    if (key) lastAnnouncements.set(key, now);
    const id = priority === "assertive" ? "game-alert-region" : "game-live-region";
    const live = getById(id);
    if (!live) return;
    if (priority === 'assertive') {
      // Um objetivo recém-liberado não deve disputar leitura com a orientação anterior.
      clearTimeout(pending.get('game-live-region'));
      pending.delete('game-live-region');
      const status = getById('game-live-region');
      if (status) status.textContent = '';
    }
    clearTimeout(pending.get(id));
    live.textContent = "";
    pending.set(id, setTimeout(() => {
      live.textContent = clean;
      pending.delete(id);
    }, 40));
  }

  function clearAnnouncements() {
    pending.forEach(clearTimeout);
    pending.clear();
    for (const id of ["game-live-region", "game-alert-region"]) {
      const live = getById(id);
      if (live) live.textContent = "";
    }
  }

  function readableCode(source, numberedLines = false) {
    const symbols = { "<-": "recebe", "===": "estritamente igual a", "!==": "estritamente diferente de", "==": "igual a", "=": "igual a", "!=": "diferente de",
      "&&": "e lógico", "||": "ou lógico", "!": "não", "++": "mais um", "--": "menos um",
      "<>": "diferente de", ">=": "maior ou igual a", "<=": "menor ou igual a",
      ">": "maior que", "<": "menor que", "+": "mais", "-": "menos", "*": "vezes",
      "/": "dividido por", "%": "resto da divisão", "(": "abre parênteses", ")": "fecha parênteses",
      "{": "abre chaves", "}": "fecha chaves", "[": "abre colchetes", "]": "fecha colchetes",
      ":": "dois pontos", ";": "ponto e vírgula" };
    const words = { true: "true, verdadeiro", false: "false, falso", logico: "lógico",
      senao: "senão", funcao: "função", entao: "então", nao: "não" };
    return String(source ?? "").split(/\r?\n/).map((line, index) => {
      const tokens = line.match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/[^\r\n]*|===|!==|<-|==|!=|>=|<=|<>|&&|\|\||\+\+|--|[\p{L}_][\p{L}\p{N}_]*|\d+(?:[.,]\d+)?|[^\s]/gu) || [];
      const text = tokens.map(token => {
        if (token.startsWith('//')) return `comentário: ${token.slice(2)}`;
        if (/^["']/.test(token)) return `texto entre aspas: ${token.slice(1, -1) || "vazio"}`;
        return symbols[token] || words[token.toLowerCase()] || token.replaceAll("_", " sublinhado ");
      }).join(" ");
      return text ? `${numberedLines ? `Linha ${index + 1}: ` : ""}${text}` : "";
    }).filter(Boolean).join(". ");
  }

  function isTypingTarget(target) {
    if (target?.id === 'game-movement-input') return false;
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
      return "Você está no menu inicial. Use Tab para escolher jogar, configurações ou acessibilidade.";
    }

    const instructions = {
      "screen-accessibility": "Você está na tela de acessibilidade. Para usar o Narrador do Windows no mapa, pressione Narrador mais Espaço para sair do modo de varredura. Use Tab para navegar pelas opções e Escape para voltar.",
      "screen-settings": "Você está nas configurações de som. Use Tab para navegar pelos controles de volume e pelos botões que ativam ou removem o som de fundo, os efeitos sonoros e os sons dos botões.",
      "screen-difficulty": "Escolha a dificuldade. Use Tab para navegar e Enter para selecionar fácil, médio ou difícil.",
      "screen-tutorial": "Tutorial aberto. Use Próximo para avançar, Anterior para voltar, ou R para consultar a explicação atual com o leitor nativo.",
      "screen-intro": "A Bug Hunter está apresentando sua missão. O texto aparece aos poucos. Enter no texto revela a mensagem completa. Use Tab para chegar a Vamos nessa e Enter para iniciar a exploração. O jogo permanece pausado até essa escolha.",
      "screen-bug-popup": "Bug detectado. Pressione Enter para iniciar a missão ou afaste-se para continuar no mapa.",
      "screen-mission": "Missão aberta. Escolha uma alternativa, ligue os pares ou encontre os pares no jogo da memória. Tab percorre somente a pergunta e Enter escolhe. O botão Consultar glossário permite revisar um termo e voltar à mesma atividade.",
      "screen-room-clear": "Setor limpo. Libere a porta e vá até ela para avançar.",
      "screen-next-level": "Acesso liberado. Pressione avançar para entrar no próximo setor.",
      "screen-win": "Missão concluída. O resumo revela os acertos por fase, o tempo total, o reinício e, por último, a pontuação total. Enter no título revela tudo. Use Tab para consultar os resultados e os botões Menu e Jogar novamente.",
      "screen-gameover": "Fim de partida. O resumo mostra os acertos, o tempo, o reinício utilizado e a pontuação. Enter no título revela tudo. Use Tab para consultar os resultados e os botões.",
      "screen-glossary": "Glossário aberto. Use Tab para navegar entre os temas e conteúdos.",
      "screen-shortcuts": "Atalhos do jogo. Use as setas para rolar a lista, Tab para chegar ao botão Voltar e Enter ou Escape para fechar."
    };

    return instructions[active.id] || "Use Tab para navegar, Enter para selecionar e Escape para voltar quando disponível.";
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

  function setHighContrast(enabled, shouldAnnounce = true) {
    state.highContrast = Boolean(enabled);
    localStorage.setItem(STORAGE_KEYS.highContrast, state.highContrast ? "1" : "0");
    updateContrastButton();

    const msg = state.highContrast ? "Alto contraste ativado." : "Alto contraste desativado.";
    if (shouldAnnounce) announce(msg);
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

  function updateFontScale() {
    // A fonte pixelada ocupa mais espaço que a Arial no mesmo tamanho.
    // A escala de ampliação permanece proporcional nas duas famílias.
    const scales = { normal: 1, large: 1.5, giant: 2 };
    const familyScale = state.fontFamily === "arial" ? 1 : 0.75;
    document.body.style.setProperty("--game-font-scale", scales[state.fontSize] * familyScale);
    document.body.style.setProperty("--game-code-scale", scales[state.fontSize]);
    window.ResponsiveLayout?.update?.();
  }

  function setFontSize(size, shouldAnnounce = true) {
    const selected = FONT_ORDER.includes(size) ? size : "normal";
    state.fontSize = selected;
    updateFontScale();

    document.body.classList.remove("font-size-small", "font-size-normal", "font-size-large", "font-size-giant");
    document.body.classList.add(`font-size-${selected}`);
    localStorage.setItem(STORAGE_KEYS.fontSize, selected);
    syncFontLabels(selected);

    const msg = `Tamanho da fonte alterado para ${FONT_LABEL[selected].toLowerCase()}.`;
    if (shouldAnnounce) announce(msg);
  }

  function setFontFamily(family, shouldAnnounce = true) {
    const selected = family === "arial" ? "arial" : "default";
    state.fontFamily = selected;
    updateFontScale();
    document.body.classList.toggle("font-family-arial", selected === "arial");
    localStorage.setItem(STORAGE_KEYS.fontFamily, selected);
    setText("font-family-access-value", selected === "arial" ? "ARIAL" : "PADRÃO");
    document.querySelectorAll("[data-font-family]").forEach(button => {
      const active = button.dataset.fontFamily === selected;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    const message = selected === "arial" ? "Fonte Arial ativada." : "Fonte padrão do jogo ativada.";
    if (shouldAnnounce) announce(message);
  }

  function changeFont(step) {
    const current = FONT_ORDER.indexOf(state.fontSize);
    const index = current === -1 ? 0 : current;
    const next = Math.max(0, Math.min(FONT_ORDER.length - 1, index + step));
    setFontSize(FONT_ORDER[next], true);
  }

  function readCurrentInstructions() {
    announce(getCurrentInstruction());
  }

  function setupButtons() {
    document.querySelectorAll("[data-font-family]").forEach(button => {
      button.addEventListener("click", () => setFontFamily(button.dataset.fontFamily));
    });
    getById("btn-high-contrast")?.addEventListener("click", toggleHighContrast);

    document.querySelectorAll(".font-option-btn[data-font-size]").forEach(btn => {
      btn.addEventListener("click", () => setFontSize(btn.dataset.fontSize, true));
    });
  }

  function setupKeyboardShortcuts() {
    document.addEventListener("keydown", event => {
      if (event.defaultPrevented || event.repeat || event.ctrlKey || event.altKey || event.metaKey) return;
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();

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

  function loadSavedSettings() {
    setFontFamily(localStorage.getItem(STORAGE_KEYS.fontFamily), false);
    state.highContrast = localStorage.getItem(STORAGE_KEYS.highContrast) === "1";
    state.fontSize = localStorage.getItem(STORAGE_KEYS.fontSize) || "normal";

    setHighContrast(state.highContrast, false);
    setFontSize(state.fontSize, false);
  }

  function init() {
    if (state.initialized) return;
    state.initialized = true;

    setupButtons();
    setupKeyboardShortcuts();
    loadSavedSettings();
    const instructions = getById('reader-instructions');
    if (instructions) {
      instructions.setAttribute('role', 'group');
      instructions.setAttribute('aria-label', instructions.textContent.replace(/\s+/g, ' ').trim());
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.AccessibilitySystem = {
    announce,
    clearAnnouncements,
    readableCode,
    toggleHighContrast,
    setHighContrast,
    setFontSize,
    setFontFamily,
    readCurrentInstructions
  };
})();
