/* ============================================================
   assets/js/ui/tutorial.js
   Tutorial completo do Bug Hunters, com slides acessíveis,
   imagens do personagem e integração com leitor de tela.
============================================================ */

const TutorialSystem = (() => {
  const IMAGE_BASE = "assets/img/tutorial/";

  const SLIDES = [
    {
      title: "BEM-VINDA, OPERADORA!",
      image: "player-frente.png",
      imageAlt: "Personagem do jogo visto de frente, usando roupa escura tecnológica com visor azul.",
      caption: "Você controla uma Bug Hunter dentro de um sistema digital.",
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
      text: "Cada fase possui 5 bugs. Ao chegar perto de um ponto de missão, uma janela aparece. Clique em Corrigir Bug para responder ao desafio.",
      extra: [
        { type: "warning", text: "Leia o enunciado com calma: muitas perguntas pedem para completar código, interpretar uma condição ou escolher o bloco correto." }
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
      title: "FASE 1 — LABORATÓRIO DE INICIALIZAÇÃO",
      image: "player-frente.png",
      imageAlt: "Personagem visto de frente no laboratório inicial.",
      caption: "Primeiro setor: tipos de dados.",
      text: "Na primeira fase, você aprende que programas trabalham com diferentes tipos de informação: números, textos e valores lógicos.",
      extra: [
        { type: "phase", text: "Você deve identificar dados como 50, \"energia\", verdadeiro e falso, além de corrigir valores incompatíveis em variáveis." }
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
        { type: "warning", text: "Cada pergunta vale 5 pontos. Se a fase for reiniciada, os pontos daquela fase são removidos e cada pergunta passa a valer menos." }
      ]
    },
    {
      title: "RECURSOS DE APOIO",
      image: "player-frente.png",
      imageAlt: "Personagem visto de frente, representando os recursos de apoio do jogo.",
      caption: "Use os recursos extras sempre que precisar.",
      text: "Você pode abrir o glossário para revisar o conteúdo, usar o tutorial novamente pelo HUD e ativar recursos de acessibilidade no menu inicial.",
      extra: [
        { type: "tip", text: "O leitor de tela do jogo pode narrar as etapas do tutorial. Use o botão Ler Etapa ou ative o leitor na tela de acessibilidade." }
      ]
    },
    {
      title: "PRONTA PARA CAÇAR BUGS!",
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

  function open(fromMenu = false) {
    if (!fromMenu && localStorage.getItem("bh_tutorial_done") === "1") return;

    currentSlide = 0;
    isOpen = true;

    if (window.UI?.showScreen) UI.showScreen("screen-tutorial");
    else if (typeof GameState !== "undefined") GameState.isPaused = true;

    render();
  }

  function close() {
    isOpen = false;
    localStorage.setItem("bh_tutorial_done", "1");

    if (window.UI?.showScreen) UI.showScreen(null);
    else {
      const overlay = document.getElementById("screen-tutorial");
      if (overlay) overlay.style.display = "none";
      if (typeof GameState !== "undefined") GameState.isPaused = false;
    }

    announce("Tutorial fechado. Use WASD ou as setas para mover o personagem pelo mapa.", false);
  }

  function isActive() {
    return isOpen;
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
    announce(slideToSpeech(SLIDES[currentSlide]), true);
  }

  function render() {
    const slide = SLIDES[currentSlide];
    const total = SLIDES.length;
    const isLast = currentSlide === total - 1;
    const overlay = document.getElementById("screen-tutorial");

    if (!overlay) return;

    if (!window.UI?.showScreen) overlay.style.display = "flex";

    setText("tut-title", slide.title);
    setText("tut-step-counter", `${String(currentSlide + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`);

    const textEl = document.getElementById("tut-text");
    if (textEl) textEl.innerHTML = formatText(slide.text);

    renderExtra(slide.extra || []);
    renderMedia(slide);
    renderDots(total);

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

    window.setTimeout(() => {
      const target = document.getElementById("tut-btn-next");
      if (target) target.focus();
    }, 30);

    announce(slideToSpeech(slide), false);
  }

  function renderMedia(slide) {
    const media = document.getElementById("tut-media");
    if (!media) return;

    if (Array.isArray(slide.imageGrid)) {
      media.innerHTML = `
        <div class="tutorial-image-grid" role="img" aria-label="Três posições do personagem: esquerda, frente e direita.">
          ${slide.imageGrid.map(item => `
            <span class="tutorial-image-card">
              <img src="${IMAGE_BASE + escapeAttr(item.src)}" alt="${escapeAttr(item.alt)}">
            </span>
          `).join("")}
        </div>
        <figcaption id="tut-image-caption" class="tutorial-image-caption">${escapeHtml(slide.caption || "")}</figcaption>
      `;
      return;
    }

    media.innerHTML = `
      <img
        id="tut-image"
        src="${IMAGE_BASE + escapeAttr(slide.image || "player-frente.png") }"
        alt="${escapeAttr(slide.imageAlt || slide.caption || "Imagem do tutorial") }"
        class="tutorial-image">
      <figcaption id="tut-image-caption" class="tutorial-image-caption">${escapeHtml(slide.caption || "")}</figcaption>
    `;
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

  function announce(message, forceVoice = false) {
    const clean = String(message || "").replace(/\s+/g, " ").trim();
    const live = document.getElementById("tutorial-live-region");

    if (live) {
      live.textContent = "";
      window.setTimeout(() => {
        live.textContent = clean;
      }, 20);
    }

    if (window.AccessibilitySystem?.speak) {
      AccessibilitySystem.speak(clean, forceVoice);
    }
  }

  function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function formatText(text) {
    return escapeHtml(text).replace(/\n/g, "<br>");
  }

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
    if (!isOpen) return;

    if (["ArrowRight", "Enter", " "].includes(event.key)) {
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
