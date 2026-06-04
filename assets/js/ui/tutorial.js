/* ============================================================
   assets/js/ui/tutorial.js
   Tutorial do Bug Hunters — texto melhorado + imagens.
============================================================ */

const TutorialSystem = (() => {
  const IMAGE_PATHS = {
    frente: "assets/img/tutorial/player-frente.png",
    direita: "assets/img/tutorial/player-lado-direito.png",
    esquerda: "assets/img/tutorial/player-lado-esquerdo.png"
  };

  const SLIDES = [
    {
      title: "BEM-VINDO, OPERADOR!",
      image: "frente",
      alt: "Personagem Bug Hunter visto de frente, usando roupa tecnológica escura e visor azul.",
      caption: "Este é o operador Bug Hunter.",
      text: "Você entrou no sistema Bug Hunters. Sua missão é explorar os setores, encontrar bugs e corrigir falhas resolvendo desafios de programação.",
      extra: [
        { type: "tip", text: "O jogo é dividido em fases. Em cada uma delas, você aprende um conceito novo enquanto restaura o sistema." }
      ]
    },
    {
      title: "MOVIMENTAÇÃO",
      image: "grid",
      alt: "Três imagens do personagem Bug Hunter, mostrando a visão pela esquerda, de frente e pela direita.",
      caption: "Use as direções do personagem para se orientar no mapa.",
      text: "Use as teclas WASD ou as setas do teclado para andar pela sala. Aproxime-se dos objetos do cenário para encontrar possíveis bugs.",
      extra: [
        { type: "phase", text: "W ou seta para cima: subir. S ou seta para baixo: descer. A ou seta esquerda: ir para a esquerda. D ou seta direita: ir para a direita." }
      ]
    },
    {
      title: "ENCONTRE OS BUGS",
      image: "direita",
      alt: "Personagem Bug Hunter visto de lado, andando em direção a um terminal.",
      caption: "Alguns objetos escondem falhas do sistema.",
      text: "Os bugs aparecem em pontos importantes do cenário, como computadores, servidores, terminais e máquinas. Quando você chegar perto, o jogo mostra um alerta.",
      extra: [
        { type: "warning", text: "Quando aparecer o alerta de bug detectado, escolha Corrigir Bug para abrir a missão." }
      ]
    },
    {
      title: "CORRIJA O BUG",
      image: "esquerda",
      alt: "Personagem Bug Hunter visto de lado, próximo a um computador do jogo.",
      caption: "Cada bug abre um desafio.",
      text: "Na missão, leia o enunciado, observe o código e escolha a alternativa correta. Ao acertar, o bug é eliminado e sua pontuação aumenta.",
      extra: [
        { type: "tip", text: "Leia o feedback depois da resposta: ele ajuda a entender por que uma alternativa está certa ou errada." }
      ]
    },
    {
      title: "AS 4 FASES",
      image: "frente",
      alt: "Personagem Bug Hunter visto de frente, representando a progressão do jogo.",
      caption: "O jogo possui 4 setores principais.",
      text: "Bug Hunters possui 4 fases. Cada fase tem 5 bugs. Para passar de fase, corrija todos os bugs do setor e libere a porta de saída.",
      extra: [
        { type: "phase", text: "Fase 1: Tipos de dados. Fase 2: Operadores. Fase 3: Condições. Fase 4: Funções e variáveis." }
      ]
    },
    {
      title: "FASE 1 — TIPOS DE DADOS",
      image: "frente",
      alt: "Personagem Bug Hunter visto de frente.",
      caption: "Primeiro setor: identificação de dados.",
      text: "Na primeira fase, você precisa reconhecer tipos de informação usados na programação, como números, textos e valores verdadeiro ou falso.",
      extra: [
        { type: "phase", text: "Exemplos: 50 é número, 'energia' é texto, verdadeiro ou falso são valores booleanos." }
      ]
    },
    {
      title: "FASE 2 — OPERADORES",
      image: "direita",
      alt: "Personagem Bug Hunter visto de lado direito.",
      caption: "Segundo setor: cálculos e comparações.",
      text: "Na segunda fase, você trabalha com operadores matemáticos e comparações. Os desafios envolvem sinais como +, -, *, /, maior, menor e igual.",
      extra: [
        { type: "phase", text: "O objetivo é entender como o sistema calcula valores e compara informações." }
      ]
    },
    {
      title: "FASE 3 — CONDIÇÕES",
      image: "esquerda",
      alt: "Personagem Bug Hunter visto de lado esquerdo.",
      caption: "Terceiro setor: decisões do sistema.",
      text: "Na terceira fase, o sistema precisa tomar decisões. Você verá estruturas condicionais, como se, senão, e combinações com e/ou.",
      extra: [
        { type: "phase", text: "Exemplo: se a energia for menor que 5, recarregar; senão, continuar operação." }
      ]
    },
    {
      title: "FASE 4 — FUNÇÕES E VARIÁVEIS",
      image: "grid",
      alt: "Três imagens do personagem Bug Hunter, representando domínio completo do sistema.",
      caption: "Último setor: organização do código.",
      text: "Na quarta fase, você organiza comandos usando variáveis e funções. Os desafios misturam conteúdos das fases anteriores em problemas mais completos.",
      extra: [
        { type: "phase", text: "Aqui aparecem dados, operadores, condições, variáveis e chamadas de função." }
      ]
    },
    {
      title: "VIDAS, PONTOS E PORTA",
      image: "frente",
      alt: "Personagem Bug Hunter visto de frente, pronto para continuar.",
      caption: "Corrija todos os bugs para avançar.",
      text: "Você ganha pontos ao acertar e pode perder vidas ao errar, dependendo da dificuldade escolhida. Quando todos os bugs da fase forem corrigidos, a porta será liberada.",
      extra: [
        { type: "warning", text: "Se as vidas acabarem, será game over. Por isso, leia com calma antes de responder." }
      ]
    },
    {
      title: "PRONTO PARA A MISSÃO!",
      image: "frente",
      alt: "Personagem Bug Hunter visto de frente, pronto para começar o jogo.",
      caption: "Boa sorte, operador.",
      text: "Agora você já sabe como jogar. Explore a sala, encontre os cinco bugs do setor e avance até restaurar todo o sistema.",
      extra: [
        { type: "tip", text: "Clique em Iniciar Missão para fechar o tutorial e começar a caçada aos bugs." }
      ]
    }
  ];

  let currentSlide = 0;
  let isOpen = false;

  function getById(id) {
    return document.getElementById(id);
  }

  function escapeHtml(text) {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");
  }

  function open(fromMenu = false) {
    if (!fromMenu && localStorage.getItem("bh_tutorial_done") === "1") return;

    currentSlide = 0;
    isOpen = true;

    if (window.GameState) GameState.isPaused = true;

    const overlay = getById("screen-tutorial");
    if (overlay) overlay.style.display = "flex";

    render();
  }

  function close() {
    isOpen = false;
    localStorage.setItem("bh_tutorial_done", "1");

    const overlay = getById("screen-tutorial");
    if (overlay) overlay.style.display = "none";

    if (window.GameState) GameState.isPaused = false;
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

  function renderImage(slide) {
    const media = getById("tut-media");
    if (!media) return;

    if (slide.image === "grid") {
      media.innerHTML = `
        <div class="tutorial-image-grid" role="img" aria-label="${escapeHtml(slide.alt)}">
          <div class="tutorial-image-card">
            <img src="${IMAGE_PATHS.esquerda}" alt="Personagem visto pelo lado esquerdo.">
          </div>
          <div class="tutorial-image-card">
            <img src="${IMAGE_PATHS.frente}" alt="Personagem visto de frente.">
          </div>
          <div class="tutorial-image-card">
            <img src="${IMAGE_PATHS.direita}" alt="Personagem visto pelo lado direito.">
          </div>
        </div>
        <figcaption id="tut-image-caption" class="tutorial-image-caption">
          ${escapeHtml(slide.caption)}
        </figcaption>
      `;
      return;
    }

    const src = IMAGE_PATHS[slide.image] || IMAGE_PATHS.frente;

    media.innerHTML = `
      <img
        id="tut-image"
        src="${src}"
        alt="${escapeHtml(slide.alt)}"
        class="tutorial-image">

      <figcaption id="tut-image-caption" class="tutorial-image-caption">
        ${escapeHtml(slide.caption)}
      </figcaption>
    `;
  }

  function renderExtra(slide) {
    const extra = getById("tut-extra-text");
    if (!extra) return;

    extra.innerHTML = (slide.extra || []).map(item => {
      const className = {
        tip: "tutorial-tip",
        phase: "tutorial-phase",
        warning: "tutorial-warning"
      }[item.type] || "tutorial-tip";

      return `<div class="${className}">${escapeHtml(item.text)}</div>`;
    }).join("");
  }

  function renderDots() {
    const dots = getById("tut-dots");
    if (!dots) return;

    dots.innerHTML = SLIDES.map((_, index) => `
      <span
        class="tut-dot ${index === currentSlide ? "active" : ""}"
        aria-label="Etapa ${index + 1} de ${SLIDES.length}">
      </span>
    `).join("");
  }

  function render() {
    const slide = SLIDES[currentSlide];
    const isLast = currentSlide === SLIDES.length - 1;

    const title = getById("tut-title");
    const text = getById("tut-text");
    const counter = getById("tut-step-counter");
    const btnPrev = getById("tut-btn-prev");
    const btnNext = getById("tut-btn-next");
    const live = getById("tutorial-live-region");

    if (title) title.textContent = slide.title;
    if (text) text.textContent = slide.text;
    if (counter) {
      counter.textContent = `${String(currentSlide + 1).padStart(2, "0")}/${String(SLIDES.length).padStart(2, "0")}`;
    }

    if (btnPrev) btnPrev.style.visibility = currentSlide === 0 ? "hidden" : "visible";

    if (btnNext) {
      btnNext.textContent = isLast ? "▶ INICIAR MISSÃO" : "PRÓXIMO ▶";
      btnNext.setAttribute(
        "aria-label",
        isLast ? "Fechar tutorial e iniciar missão" : "Avançar para a próxima etapa do tutorial"
      );
    }

    renderImage(slide);
    renderExtra(slide);
    renderDots();

    if (live) {
      const extraText = (slide.extra || []).map(item => item.text).join(" ");
      live.textContent = `${slide.title}. ${slide.text} ${extraText}`;
    }
  }

  document.addEventListener("keydown", event => {
    if (!isOpen) return;

    if (event.key === "ArrowRight" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      next();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
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
    isActive: () => isOpen,
    next,
    prev
  };
})();
