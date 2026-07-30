window.Glossary = (() => {
  let currentKey = "fase1";
  let currentCategoryIndex = 0;

  const MENU = [
    { key: "fase1", label: "TIPOS DE DADOS" },
    { key: "fase2", label: "OPERADORES" },
    { key: "fase3", label: "CONDIÇÕES" },
    { key: "fase4", label: "FUNÇÕES" }
  ];

  function open() {
    const screen = document.getElementById("screen-glossary");

    if (!screen) {
      console.error("[Glossary] Tela #screen-glossary não encontrada.");
      return;
    }

    show(getCurrentPhaseKey(), 0);

    if (window.UI?.showScreen) UI.showScreen("screen-glossary");
    else {
      GameState.isPaused = true;
      screen.style.display = "flex";
    }
  }

  function close() {
    if (window.UI?.showScreen) {
      UI.showScreen(null);
      return;
    }

    const screen = document.getElementById("screen-glossary");
    if (screen) screen.style.display = "none";
    GameState.isPaused = false;
  }

  function getCurrentPhaseKey() {
    if (GameState.currentRoom === "sala1") return "fase1";
    if (GameState.currentRoom === "sala2") return "fase2";
    if (GameState.currentRoom === "sala3") return "fase3";
    if (GameState.currentRoom === "sala4") return "fase4";

    return currentKey;
  }

  function show(key, categoryIndex = 0) {
    currentKey = key;
    currentCategoryIndex = categoryIndex;

    const data = GLOSSARY_DATA[currentKey];
    const content = document.getElementById("glossary-content");

    if (!data || !content) return;

    renderSideMenu();
    content.innerHTML = renderContent(data);
  }

  function renderSideMenu() {
    const sidebar = document.querySelector(".glossary-sidebar");
    const data = GLOSSARY_DATA[currentKey];

    if (!sidebar || !data) return;

    const html = MENU.map(item => {
      const isActive = item.key === currentKey;

      const subcategories = isActive
        ? data.categories.map((category, index) => {
            return `
              <button
                class="glossary-subtab ${index === currentCategoryIndex ? "active" : ""}"
                onclick="Glossary.show('${item.key}', ${index})">
                ▸ ${escapeHtml(category.title)}
              </button>
            `;
          }).join("")
        : "";

      return `
        <div class="glossary-menu-group ${isActive ? "active" : ""}">
          <button
            class="glossary-tab ${isActive ? "active" : ""}"
            onclick="Glossary.show('${item.key}', 0)">
            ${item.label}
          </button>

          ${subcategories ? `
            <div class="glossary-submenu">
              ${subcategories}
            </div>
          ` : ""}
        </div>
      `;
    }).join("");

    sidebar.innerHTML = html;
  }

  function renderContent(data) {
    const category = data.categories[currentCategoryIndex] || data.categories[0];

    if (!category) {
      return `
        <h2 class="glossary-title">${escapeHtml(data.title)}</h2>
        <p class="glossary-text">${escapeHtml(data.intro)}</p>
      `;
    }

    const topicsHtml = category.topics.map(topic => {
      return `
        <article class="glossary-topic">
          <h3 class="glossary-subtitle">◆ ${escapeHtml(topic.title)}</h3>

          <p class="glossary-text">
            ${escapeHtml(topic.text)}
          </p>

          ${topic.code ? `
            <p class="glossary-label">EXEMPLO EM PORTUGOL:</p>
            <pre class="glossary-code">${escapeHtml(topic.code)}</pre>
          ` : ""}

          ${topic.output ? `
            <p class="glossary-label">SAÍDA ESPERADA:</p>
            <pre class="glossary-code">${escapeHtml(topic.output)}</pre>
          ` : ""}

          ${topic.wrong ? `
            <div class="glossary-warning">
              <strong>ERRO COMUM:</strong><br>
              ${formatText(topic.wrong)}
            </div>
          ` : ""}

          ${topic.tip ? `
            <div class="glossary-tip">
              <strong>DICA RÁPIDA:</strong><br>
              ${escapeHtml(topic.tip)}
            </div>
          ` : ""}

          ${topic.missions ? `
            <p class="glossary-text">
              <strong>APARECE NAS MISSÕES:</strong> ${escapeHtml(topic.missions)}
            </p>
          ` : ""}
        </article>
      `;
    }).join("");

    return `
      <h2 class="glossary-title">${escapeHtml(data.title)}</h2>

      <p class="glossary-text">
        ${escapeHtml(data.intro)}
      </p>

      <div class="glossary-current-category">
        ${escapeHtml(category.title)}
      </div>

      <p class="glossary-text">
        ${escapeHtml(category.description)}
      </p>

      ${topicsHtml}
    `;
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

  return {
    open,
    close,
    show
  };
})();
