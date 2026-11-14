/* ============================================================
   assets/js/ui/tutorial.js
   Tutorial completo do Bug Hunters, com slides acessíveis,
   imagens do personagem e integração com leitor de tela.
============================================================ */

const TutorialSystem = (() => {
  const IMAGE_BASE = "assets/img/tutorial/";
  const TERM_HELP = {
    HUD: "É o painel do jogo que mostra pontos, tempo, progresso e botões de apoio, como Glossário e Configurações.",
    feedback: "É o retorno que o jogo dá à sua resposta: mostra se você acertou e explica a solução.",
    bug: "É uma falha que faz um programa funcionar de um jeito diferente do esperado.",
    bugs: "São falhas que fazem um programa funcionar de um jeito diferente do esperado.",
    terminais: "São os computadores e painéis da sala. Aproxime o personagem de um terminal destacado para encontrar um desafio.",
    "valores lógicos": "São valores com apenas duas possibilidades: verdadeiro (true) ou falso (false).",
    variáveis: "São espaços com nome que guardam informações, como a quantidade de energia. O valor guardado pode mudar.",
    operadores: "São símbolos ou palavras que fazem cálculos e comparações, como +, −, maior que e igual a.",
    "estruturas de controle": "São instruções que organizam o caminho do programa, como escolher o que fazer quando uma condição é verdadeira ou falsa.",
    "condições encadeadas": "São verificações feitas em sequência: se a primeira não for atendida, o programa verifica a próxima.",
    funções: "São conjuntos de instruções com um nome. Chamar uma função faz o programa executar essas instruções."
  };
  const TERM_PATTERN = new RegExp(`\\b(${Object.keys(TERM_HELP).sort((a, b) => b.length - a.length).join("|")})\\b`, "gi");
  const termDefinitions = new Map(Object.entries(TERM_HELP).map(([term, definition]) => [term.toLowerCase(), definition]));

  const SLIDES = [
    {
      title: "BEM-VINDO(A), OPERADOR(A)!",
      image: "player-frente.png",
      imageAlt: "Personagem do jogo visto de frente, usando roupa escura tecnológica com visor azul.",
      caption: "Você controla um personagem Bug Hunter dentro de um sistema digital.",
      text: "Em Bug Hunters, sua missão é explorar o sistema, encontrar falhas e corrigir bugs usando lógica de programação.",
      extra: [
        { type: "tip", text: "O jogo foi pensado para ensinar programação de forma visual: você observa o problema, interpreta o código e escolhe a solução correta." }
      ]
    },
    {
      title: "MOVIMENTAÇÃO PELO MAPA",
      imageGrid: [
        { src: "player-lado-esquerdo.png", alt: "Personagem virado para a esquerda." },
        { src: "player-frente.png", alt: "Personagem virado para frente." },
        { src: "player-lado-direito.png", alt: "Personagem virado para a direita." }
      ],
      caption: "Use o teclado para explorar cada sala e chegar até os terminais com bug.",
      text: "Use W, A, S e D ou as setas do teclado para andar. No celular, use o controle direcional na tela quando ele aparecer.",
      extra: [
        { type: "phase", text: "Dica: aproxime o personagem dos objetos que estão piscando ou destacados para abrir uma missão." }
      ]
    },
    {
      title: "COMO CORRIGIR UM BUG",
      image: "player-lado-direito.png",
      imageAlt: "Personagem virado para a direita próximo a um terminal do sistema.",
      caption: "Ao encontrar uma falha, escolha corrigir bug para iniciar o desafio.",
      text: "Cada fase possui 5 bugs sorteados de acordo com o tema e a dificuldade. Ao chegar perto de um objeto destacado, pressione Enter no mapa ou acione Corrigir Bug para abrir a atividade.",
      extra: [
        { type: "warning", text: "Uma atividade por fase pede para ligar pares. Use Tab e Enter para escolher um item, escolher a resposta e confirmar as ligações. A mesma resposta pode servir para vários itens." }
      ]
    },
    {
      title: "PROGRESSÃO DO JOGO",
      image: "player-frente.png",
      imageAlt: "Personagem do jogo parado de frente, pronto para avançar.",
      caption: "O sistema é dividido em 4 setores principais.",
      text: "O jogo possui 4 fases. Em cada fase você precisa concluir os 5 desafios do setor para liberar a porta e seguir para a próxima área.",
      extra: [
        { type: "tip", text: "Quando todos os bugs de uma sala forem resolvidos, a tela Setor Limpo aparece. Depois disso, libere a porta e vá até ela para avançar." }
      ]
    },
    {
      title: "RECURSOS DE APOIO",
      image: "player-frente.png",
      imageAlt: "Personagem visto de frente, representando os recursos de apoio do jogo.",
      caption: "Use os recursos extras sempre que precisar.",
      text: "Você pode abrir o glossário pelo HUD para consultar os termos e revisar o conteúdo. Durante uma pergunta, use Consultar glossário dentro da atividade. O painel também permite reabrir este tutorial e consultar os atalhos.",
      extra: [
        { type: "tip", text: "Uma lâmpada ao lado de uma palavra explica seu significado. Passe o mouse ou use Tab e Enter para consultar. O Narrador do Windows lê os textos e controles. Pressione R para repetir a etapa pelo leitor nativo." }
      ]
    },
    {
      title: "FASE 1 — LABORATÓRIO DE INICIALIZAÇÃO",
      image: "player-frente.png",
      imageAlt: "Personagem visto de frente no laboratório inicial.",
      caption: "Primeiro setor: tipos de dados.",
      text: "Na primeira fase, você aprende que programas trabalham com diferentes tipos de informação: números, textos e valores lógicos.",
      extra: [
        { type: "phase", text: "Você deve identificar dados como 50, \"energia\", true (verdadeiro) e false (falso), além de corrigir os valores das variáveis." }
      ]
    },
    {
      title: "FASE 2 — NÚCLEO DE ENERGIA",
      image: "player-lado-direito.png",
      imageAlt: "Personagem de lado em um setor de energia.",
      caption: "Segundo setor: operadores matemáticos e comparações.",
      text: "Na segunda fase, o foco são operadores. Você usa soma, subtração, multiplicação, divisão e comparações como maior, menor e igual.",
      extra: [
        { type: "phase", text: "Aqui o segredo é observar a ordem das operações e entender quando um operador está calculando ou comparando valores." }
      ]
    },
    {
      title: "FASE 3 — LABORATÓRIO DE SEGURANÇA",
      image: "player-lado-esquerdo.png",
      imageAlt: "Personagem de lado em uma área de segurança.",
      caption: "Terceiro setor: estruturas de controle.",
      text: "Na terceira fase, você aprende como o programa toma decisões usando estruturas como se, senão, e, ou e condições encadeadas.",
      extra: [
        { type: "phase", text: "Exemplo de raciocínio: se energia for menor que 5, recarregar; senão, continuar a operação." }
      ]
    },
    {
      title: "FASE 4 — CENTRAL DE CONTROLE",
      image: "player-frente.png",
      imageAlt: "Personagem visto de frente na central de controle.",
      caption: "Quarto setor: funções e variáveis.",
      text: "Na fase final, você organiza o sistema usando funções, chamadas de função, variáveis e os conceitos aprendidos nas fases anteriores.",
      extra: [
        { type: "phase", text: "Você vai criar, chamar e corrigir funções para recuperar o controle do sistema principal." }
      ]
    },
    {
      title: "PONTUAÇÃO E FEEDBACK",
      image: "player-lado-direito.png",
      imageAlt: "Personagem virado para a direita, representando atenção ao desafio.",
      caption: "Cada resposta gera feedback para ajudar no aprendizado.",
      text: "Ao responder corretamente, você ganha pontos. Se errar, o jogo mostra a resposta correta e uma explicação para você aprender com o erro.",
      extra: [
        { type: "warning", text: "Cada pergunta vale 5 pontos. Existe um único reinício de fase em toda a partida: os pontos dessa tentativa são removidos e cada acerto na fase reiniciada vale 4 pontos. O tempo continua contando, sem limite para terminar." }
      ]
    },
    {
      title: "PRONTO(A) PARA CAÇAR BUGS!",
      image: "player-frente.png",
      imageAlt: "Personagem do jogo visto de frente, pronto para iniciar a missão.",
      caption: "Agora você já sabe como jogar.",
      text: "Explore os setores, leia as missões, corrija os bugs e avance até restaurar a Central de Controle do Sistema.",
      extra: [
        { type: "tip", text: "Pressione Iniciar Missão para fechar o tutorial e começar a jogar." }
      ]
    }
  ];

  let currentSlide = 0;
  let isOpen = false;
  let introduceAfterClose = false;
  let imageRevision = 0;
  let termTooltip = null;
  let activeTermButton = null;
  let tooltipPinned = false;
  let hideTooltipTimer = null;

  function open(fromMenu = false) {
    if (window.UI?.getActiveScreen() === "screen-tutorial") return;
    if (!fromMenu && localStorage.getItem("bh_tutorial_done") === "1") return;

    currentSlide = 0;
    // Uma versão por abertura mantém as imagens novas sem exigir limpar o cache.
    imageRevision = Math.max(Date.now(), imageRevision + 1);
    isOpen = true;
    if (!fromMenu) introduceAfterClose = !StoryIntro.hasBeenSeen();

    // O tutorial inicial é a atividade de origem: consultar um apoio volta a ele.
    if (!fromMenu && window.UI?.showScreen) UI.showScreen("screen-tutorial");
    else if (window.UI?.openSupport) UI.openSupport("screen-tutorial");
    else if (typeof GameState !== "undefined") GameState.isPaused = true;

    render();
  }

  function close() {
    if (!isActive()) return;
    hideTermHelp();
    isOpen = false;
    localStorage.setItem("bh_tutorial_done", "1");

    if (window.UI?.closeSupport) UI.closeSupport();
    else {
      const overlay = document.getElementById("screen-tutorial");
      if (overlay) overlay.style.display = "none";
      if (typeof GameState !== "undefined") GameState.isPaused = false;
    }

    const showIntroduction = introduceAfterClose;
    introduceAfterClose = false;
    if (showIntroduction && StoryIntro.open()) return;
  }

  function isActive() {
    return isOpen && (!window.UI || UI.getActiveScreen() === "screen-tutorial");
  }

  function next() {
    if (!isOpen) return;

    if (currentSlide < SLIDES.length - 1) {
      currentSlide++;
      render();
      return;
    }

    close();
  }

  function prev() {
    if (!isOpen || currentSlide === 0) return;
    currentSlide--;
    render();
  }

  function readCurrent() {
    announce(slideToSpeech(SLIDES[currentSlide]));
  }

  function render() {
    hideTermHelp();
    const slide = SLIDES[currentSlide];
    const total = SLIDES.length;
    const isLast = currentSlide === total - 1;
    const overlay = document.getElementById("screen-tutorial");

    if (!overlay) return;

    if (!window.UI?.showScreen) overlay.style.display = "flex";

    const title = document.getElementById("tut-title");
    if (title) title.innerHTML = formatText(slide.title);
    setText("tut-step-counter", `${String(currentSlide + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`);

    const textEl = document.getElementById("tut-text");
    if (textEl) textEl.innerHTML = formatText(slide.text);

    renderExtra(slide.extra || []);
    renderMedia(slide);
    renderDots(total);
    const textArea = document.querySelector("#screen-tutorial .tut-text-wrap");
    if (textArea) {
      textArea.scrollTop = 0;
      textArea.setAttribute("aria-label", `Texto da etapa ${currentSlide + 1}. ${slide.text} ${(slide.extra || []).map(item => item.text).join(' ')}`);
    }
    const body = document.querySelector("#screen-tutorial .tutorial-body");
    if (body) body.scrollTop = 0;

    const prevBtn = document.getElementById("tut-btn-prev");
    if (prevBtn) {
      prevBtn.style.visibility = currentSlide === 0 ? "hidden" : "visible";
      prevBtn.disabled = currentSlide === 0;
    }

    const nextBtn = document.getElementById("tut-btn-next");
    if (nextBtn) {
      nextBtn.textContent = isLast ? "▶ INICIAR MISSÃO" : "PRÓXIMO ▶";
      nextBtn.setAttribute("aria-label", isLast ? "Fechar tutorial e iniciar missão" : "Avançar para a próxima etapa do tutorial");
    }

    document.getElementById("tut-btn-next")?.focus();

    announce(slideToSpeech(slide));
  }

  function renderMedia(slide) {
    const media = document.getElementById("tut-media");
    if (!media) return;

    if (Array.isArray(slide.imageGrid)) {
      media.innerHTML = `
        <div class="tutorial-image-grid" role="img" aria-label="Três posições do personagem: esquerda, frente e direita.">
          ${slide.imageGrid.map(item => `
            <span class="tutorial-image-card">
              <img src="${imageUrl(item.src)}" alt="${escapeAttr(item.alt)}">
            </span>
          `).join("")}
        </div>
        <figcaption id="tut-image-caption" class="tutorial-image-caption">${formatText(slide.caption || "")}</figcaption>
      `;
      return;
    }

    media.innerHTML = `
      <img
        id="tut-image"
        src="${imageUrl(slide.image || "player-frente.png") }"
        alt="${escapeAttr(slide.imageAlt || slide.caption || "Imagem do tutorial") }"
        class="tutorial-image">
      <figcaption id="tut-image-caption" class="tutorial-image-caption">${formatText(slide.caption || "")}</figcaption>
    `;
  }

  function imageUrl(filename) {
    return `${IMAGE_BASE}${escapeAttr(filename)}?v=${imageRevision}`;
  }

  function renderExtra(items) {
    const extra = document.getElementById("tut-extra-text");
    if (!extra) return;

    extra.innerHTML = items.map(item => {
      const cls = item.type === "warning" ? "tutorial-warning" : item.type === "phase" ? "tutorial-phase" : "tutorial-tip";
      return `<div class="${cls}">${formatText(item.text)}</div>`;
    }).join("");
  }

  function renderDots(total) {
    const dots = document.getElementById("tut-dots");
    if (!dots) return;

    dots.innerHTML = Array.from({ length: total }, (_, i) => `
      <span
        class="tut-dot ${i === currentSlide ? "active" : ""}"
        aria-hidden="true">
      </span>
    `).join("");
  }

  function slideToSpeech(slide) {
    const extras = (slide.extra || []).map(item => item.text).join(" ");
    const caption = slide.caption ? `Imagem: ${slide.caption}. ` : "";

    return `${slide.title}. ${caption}${slide.text} ${extras}`
      .replace(/\s+/g, " ")
      .trim();
  }

  function announce(message) {
    const clean = String(message || "").replace(/\s+/g, " ").trim();

    if (window.AccessibilitySystem?.announce) {
      AccessibilitySystem.announce(clean);
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function formatText(text) {
    return String(text).split(TERM_PATTERN).map((part, index) => {
      if (index % 2 === 0) return escapeHtml(part).replace(/\n/g, "<br>");
      return `<span class="tutorial-term">${escapeHtml(part)}<button type="button"
        class="tutorial-term-help" data-tutorial-term="${escapeAttr(part.toLowerCase())}"
        aria-label="O que significa ${escapeAttr(part)}?" aria-expanded="false">
        <span aria-hidden="true">💡</span></button></span>`;
    }).join("");
  }

  function ensureTermTooltip() {
    if (termTooltip) return;
    termTooltip = document.createElement("div");
    termTooltip.id = "tutorial-term-tooltip";
    termTooltip.className = "tutorial-term-tooltip";
    termTooltip.setAttribute("role", "tooltip");
    termTooltip.hidden = true;
    document.body.append(termTooltip);
    termTooltip.addEventListener("pointerenter", () => clearTimeout(hideTooltipTimer));
    termTooltip.addEventListener("pointerleave", scheduleHideTermHelp);
  }

  function positionTermHelp() {
    if (!activeTermButton || !termTooltip || termTooltip.hidden) return;
    const anchor = activeTermButton.getBoundingClientRect();
    const box = termTooltip.getBoundingClientRect();
    const left = Math.max(8, Math.min(anchor.left, window.innerWidth - box.width - 8));
    const below = anchor.bottom + 8;
    const top = below + box.height <= window.innerHeight - 8
      ? below : Math.max(8, anchor.top - box.height - 8);
    termTooltip.style.left = `${left}px`;
    termTooltip.style.top = `${top}px`;
  }

  function showTermHelp(button) {
    if (!isActive()) return;
    clearTimeout(hideTooltipTimer);
    if (activeTermButton !== button) hideTermHelp();
    ensureTermTooltip();
    activeTermButton = button;
    button.setAttribute("aria-describedby", termTooltip.id);
    button.setAttribute("aria-expanded", "true");
    termTooltip.textContent = termDefinitions.get(button.dataset.tutorialTerm);
    termTooltip.hidden = false;
    positionTermHelp();
  }

  function hideTermHelp() {
    clearTimeout(hideTooltipTimer);
    activeTermButton?.setAttribute("aria-expanded", "false");
    activeTermButton?.removeAttribute("aria-describedby");
    activeTermButton = null;
    tooltipPinned = false;
    if (termTooltip) termTooltip.hidden = true;
  }

  function scheduleHideTermHelp() {
    clearTimeout(hideTooltipTimer);
    hideTooltipTimer = setTimeout(() => {
      if (tooltipPinned || activeTermButton === document.activeElement || activeTermButton?.matches(":hover") || termTooltip?.matches(":hover")) return;
      hideTermHelp();
    }, 150);
  }

  document.addEventListener("pointerover", event => {
    const button = event.target.closest(".tutorial-term-help");
    if (button && !button.contains(event.relatedTarget)) showTermHelp(button);
  });
  document.addEventListener("pointerout", event => {
    const button = event.target.closest(".tutorial-term-help");
    if (button && !button.contains(event.relatedTarget)) scheduleHideTermHelp();
  });
  document.addEventListener("focusin", event => {
    const button = event.target.closest(".tutorial-term-help");
    if (button) showTermHelp(button);
    else hideTermHelp();
  });
  document.addEventListener("click", event => {
    const button = event.target.closest(".tutorial-term-help");
    if (button) {
      showTermHelp(button);
      tooltipPinned = true;
      announce(termTooltip.textContent);
    } else if (!termTooltip?.contains(event.target)) hideTermHelp();
  });
  document.addEventListener("scroll", positionTermHelp, true);
  window.addEventListener("resize", positionTermHelp);

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function escapeAttr(text) {
    return escapeHtml(text).replaceAll('"', "&quot;");
  }

  document.addEventListener("keydown", event => {
    if (!isActive() || event.defaultPrevented || event.ctrlKey || event.altKey || event.metaKey) return;

    if (activeTermButton === document.activeElement && ["ArrowUp", "ArrowDown", "PageUp", "PageDown"].includes(event.key) && termTooltip.scrollHeight > termTooltip.clientHeight) {
      event.preventDefault();
      const direction = ["ArrowUp", "PageUp"].includes(event.key) ? -1 : 1;
      termTooltip.scrollTop += direction * (event.key.startsWith("Page") ? termTooltip.clientHeight * 0.8 : 40);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
      return;
    }

    if (event.key.toLowerCase() === "r") {
      event.preventDefault();
      readCurrent();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      if (activeTermButton) {
        hideTermHelp();
        return;
      }
      close();
    }
  });

  return {
    open,
    close,
    next,
    prev,
    readCurrent,
    isActive
  };
})();
