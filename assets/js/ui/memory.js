/* Memória sem cronômetro: cartas permanecem visíveis até o jogador continuar. */
const MemoryChallenge = (() => {
  function clear() {
    document.getElementById('memory-container')?.replaceChildren();
  }

  function render(container, mission, onAnswer) {
    clear();
    const buttons = new Map();
    const matched = new Set();
    let revealed = [];
    let attempts = 0;
    let finished = false;
    let waiting = false;

    const instructions = document.createElement('p');
    instructions.className = 'memory-instructions';
    instructions.id = 'memory-instructions';
    instructions.textContent = 'Use Tab e Enter para virar duas cartas. Procure um código e seu significado. Se não formarem par, acione Virar as cartas para continuar. As cartas não se escondem sozinhas.';
    const board = document.createElement('div');
    board.className = 'memory-board';
    board.setAttribute('role', 'group');
    board.setAttribute('aria-label', `${mission.cards.length} cartas do jogo da memória`);
    const status = document.createElement('p');
    status.id = 'memory-status';
    status.className = 'memory-status';
    status.setAttribute('role', 'status');
    const next = document.createElement('button');
    next.type = 'button';
    next.id = 'btn-memory-cover';
    next.className = 'cyber-btn';
    next.textContent = '↺ VIRAR AS CARTAS';
    next.hidden = true;
    next.setAttribute('aria-describedby', 'memory-status');

    function announce(message) {
      status.textContent = `${matched.size / 2} de ${mission.pairs.length} pares. ${attempts} tentativas. ${message}`;
      window.AccessibilitySystem?.speak?.(status.textContent);
    }

    function hide(card) {
      const button = buttons.get(card.id);
      const position = mission.cards.findIndex(item => item.id === card.id) + 1;
      button.textContent = `? ${position}`;
      button.setAttribute('aria-label', `Carta ${position}, virada para baixo. Enter para revelar.`);
      button.setAttribute('aria-pressed', 'false');
      button.classList.remove('revealed');
    }

    mission.cards.forEach((card, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'memory-card';
      button.dataset.cardId = card.id;
      button.setAttribute('aria-describedby', 'memory-instructions');
      buttons.set(card.id, button);
      hide(card);
      button.onclick = () => {
        if (finished || waiting || matched.has(card.id) || revealed.some(item => item.id === card.id)) return;
        revealed.push(card);
        button.textContent = card.text;
        button.classList.add('revealed');
        button.setAttribute('aria-pressed', 'true');
        button.setAttribute('aria-label', `Carta ${index + 1}: ${card.text}`);
        if (revealed.length === 1) {
          announce(`Carta ${index + 1}: ${card.text}. Escolha outra carta.`);
          return;
        }

        attempts++;
        const [first, second] = revealed;
        if (first.pairId === second.pairId) {
          for (const item of revealed) {
            matched.add(item.id);
            const found = buttons.get(item.id);
            found.disabled = true;
            found.classList.add('paired');
            found.textContent = `✓ ${item.text}`;
            found.setAttribute('aria-label', `Par encontrado: ${item.text}`);
          }
          revealed = [];
          announce(`Par encontrado: ${first.text} e ${second.text}.`);
          if (matched.size === mission.cards.length) {
            finished = true;
            onAnswer(true);
          } else {
            const remaining = mission.cards.find(item => !matched.has(item.id));
            buttons.get(remaining.id).focus();
          }
        } else {
          waiting = true;
          buttons.forEach(item => { item.disabled = true; });
          next.hidden = false;
          announce(`${first.text} e ${second.text} não formam par. Leia as duas cartas e acione Virar as cartas quando quiser continuar.`);
          next.focus();
        }
      };
      board.appendChild(button);
    });

    next.onclick = () => {
      if (!waiting || finished) return;
      const last = revealed[1];
      revealed.forEach(hide);
      revealed = [];
      waiting = false;
      buttons.forEach((button, id) => { button.disabled = matched.has(id); });
      next.hidden = true;
      announce('Escolha duas cartas novamente.');
      buttons.get(last.id).focus();
    };

    container.append(instructions, board, status, next);
    announce('Escolha uma carta para começar.');
  }

  return { render, clear };
})();
