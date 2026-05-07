const Glossary = (() => {

    let currentKey = "fase1";
  
    function open() {
      GameState.isPaused = true;
  
      const screen = document.getElementById("screen-glossary");
  
      if (!screen) {
        console.error("[Glossary] Tela #screen-glossary não encontrada.");
        return;
      }
  
      const phaseKey = getCurrentPhaseKey();
  
      show(phaseKey);
  
      screen.style.display = "flex";
    }
  
    function close() {
      const screen = document.getElementById("screen-glossary");
  
      if (screen) {
        screen.style.display = "none";
      }
  
      GameState.isPaused = false;
    }
  
    function getCurrentPhaseKey() {
      if (GameState.currentRoom === "sala1") return "fase1";
      if (GameState.currentRoom === "sala2") return "fase2";
  
      return currentKey;
    }
  
    function show(key, clickedButton = null) {
      currentKey = key;
  
      const data = GLOSSARY_DATA[key];
      const content = document.getElementById("glossary-content");
  
      if (!data || !content) return;
  
      document.querySelectorAll(".glossary-tab").forEach(btn => {
        btn.classList.remove("active");
      });
  
      if (clickedButton) {
        clickedButton.classList.add("active");
      } else {
        const buttons = document.querySelectorAll(".glossary-tab");
  
        const indexMap = {
          fase1: 0,
          fase2: 1,
          fase3: 2,
          fase4: 3
        };
  
        const btn = buttons[indexMap[key]];
  
        if (btn) btn.classList.add("active");
      }
  
      content.innerHTML = renderContent(data);
    }
  
    function renderContent(data) {
      const topicsHtml = data.topics.map(topic => {
        return `
          <article class="glossary-topic">
            <h3 class="glossary-subtitle">${topic.title}</h3>
  
            <p class="glossary-text">
              ${topic.text}
            </p>
  
            <pre class="glossary-code">${escapeHtml(topic.code)}</pre>
  
            <div class="glossary-warning">
              <strong>ERRO COMUM:</strong><br>
              ${formatText(topic.warning)}
            </div>
  
            <div class="glossary-tip">
              <strong>DICA RÁPIDA:</strong><br>
              ${topic.tip}
            </div>
          </article>
        `;
      }).join("");
  
      return `
        <h2 class="glossary-title">${data.title}</h2>
  
        <p class="glossary-text">
          ${data.intro}
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