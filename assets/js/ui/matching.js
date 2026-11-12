/* Associação por botões: funciona com mouse, toque ou somente Tab e Enter. */
const MatchingChallenge = (() => {
  let observer = null;

  function clear() {
    observer?.disconnect();
    observer = null;
    document.getElementById('matching-container')?.replaceChildren();
  }

  function render(container, mission, onAnswer) {
    clear();
    const answers = new Map();
    const sources = new Map();
    const targets = new Map();
    let selected = null;
    let submitted = false;

    const instructions = document.createElement('p');
    instructions.id = 'matching-instructions';
    instructions.className = 'matching-instructions';
    instructions.textContent = 'Use Tab para navegar e Enter para ligar um item à sua resposta. Repita e confirme. Para trocar uma ligação, selecione o item de novo.';

    const board = document.createElement('div');
    board.className = 'matching-board';
    const lines = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    lines.classList.add('matching-lines');
    lines.setAttribute('aria-hidden', 'true');
    const sourceList = document.createElement('div');
    sourceList.className = 'matching-column matching-sources';
    sourceList.setAttribute('role', 'group');
    sourceList.setAttribute('aria-label', 'Itens para ligar');
    const targetList = document.createElement('div');
    targetList.className = 'matching-column matching-targets';
    targetList.setAttribute('role', 'group');
    targetList.setAttribute('aria-label', 'Respostas disponíveis; podem ser reutilizadas');

    const status = document.createElement('p');
    status.id = 'matching-status';
    status.className = 'matching-status';
    status.setAttribute('role', 'status');
    const confirm = document.createElement('button');
    confirm.id = 'btn-confirm-matching';
    confirm.type = 'button';
    confirm.className = 'cyber-btn matching-confirm';
    confirm.textContent = '✓ CONFIRMAR LIGAÇÕES';
    confirm.disabled = true;
    confirm.setAttribute('aria-describedby', 'matching-status');

    function updateStatus(message = '') {
      status.textContent = `${answers.size} de ${mission.pairs.length} itens ligados. ${message}`.trim();
      confirm.disabled = submitted || answers.size !== mission.pairs.length;
    }

    function drawLines() {
      const rect = board.getBoundingClientRect();
      lines.setAttribute('viewBox', `0 0 ${rect.width || 1} ${rect.height || 1}`);
      lines.replaceChildren();
      answers.forEach((answer, id) => {
        const source = sources.get(id).getBoundingClientRect();
        const target = targets.get(answer).getBoundingClientRect();
        const line = document.createElementNS(lines.namespaceURI, 'line');
        line.setAttribute('x1', source.right - rect.left);
        line.setAttribute('y1', source.top + source.height / 2 - rect.top);
        line.setAttribute('x2', target.left - rect.left);
        line.setAttribute('y2', target.top + target.height / 2 - rect.top);
        const pair = mission.pairs.find(pair => pair.id === id);
        if (submitted) line.classList.add(answer === pair.right ? 'correct' : 'wrong');
        lines.appendChild(line);
      });
    }

    mission.pairs.forEach(pair => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'matching-item matching-source';
      button.dataset.pairId = pair.id;
      button.textContent = pair.left;
      button.setAttribute('aria-pressed', 'false');
      button.setAttribute('aria-describedby', 'matching-instructions');
      button.onclick = () => {
        if (submitted) return;
        selected = pair.id;
        sources.forEach((source, id) => source.setAttribute('aria-pressed', String(id === selected)));
        updateStatus(`Selecione a resposta para ${pair.left}.`);
        // O foco entra nas respostas sem exigir teclas simultâneas.
        targets.values().next().value?.focus();
        window.AccessibilitySystem?.speak?.(`Item ${pair.left} selecionado. Use Tab e Enter para escolher a resposta.`);
      };
      sources.set(pair.id, button);
      sourceList.appendChild(button);
    });

    mission.targets.forEach(target => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'matching-item matching-target';
      button.dataset.target = target;
      button.textContent = target;
      button.setAttribute('aria-label', `Ligar o item selecionado a ${target}`);
      button.onclick = () => {
        if (submitted) return;
        if (selected === null) {
          updateStatus('Escolha primeiro um item na coluna ITENS.');
          sources.values().next().value?.focus();
          return;
        }
        const pair = mission.pairs.find(pair => pair.id === selected);
        answers.set(selected, target);
        const source = sources.get(selected);
        source.textContent = `${pair.left} → ${target}`;
        source.setAttribute('aria-label', `${pair.left}, ligado a ${target}. Enter para trocar a ligação.`);
        source.classList.add('linked');
        source.setAttribute('aria-pressed', 'false');
        selected = null;
        updateStatus(answers.size === mission.pairs.length ? 'Confira as ligações e confirme.' : 'Escolha o próximo item.');
        drawLines();
        const next = mission.pairs.find(pair => !answers.has(pair.id));
        (next ? sources.get(next.id) : confirm).focus();
        window.AccessibilitySystem?.speak?.(`${pair.left} ligado a ${target}. ${status.textContent}`);
      };
      targets.set(target, button);
      targetList.appendChild(button);
    });

    confirm.onclick = () => {
      if (submitted || answers.size !== mission.pairs.length) return;
      submitted = true;
      mission.pairs.forEach(pair => {
        const source = sources.get(pair.id);
        const correct = answers.get(pair.id) === pair.right;
        source.classList.add(correct ? 'correct' : 'wrong');
        source.textContent = `${correct ? '✓' : '✗'} ${pair.left} → ${answers.get(pair.id)}`;
        source.disabled = true;
      });
      targets.forEach(button => { button.disabled = true; });
      updateStatus('Ligações conferidas.');
      drawLines();
      onAnswer(mission.pairs.every(pair => answers.get(pair.id) === pair.right));
    };

    const itemHeading = document.createElement('div');
    itemHeading.className = 'matching-column-title';
    itemHeading.textContent = 'ITENS';
    const targetHeading = itemHeading.cloneNode();
    targetHeading.textContent = 'RESPOSTAS';
    sourceList.prepend(itemHeading);
    targetList.prepend(targetHeading);
    board.append(lines, sourceList, targetList);
    container.append(instructions, board, status, confirm);
    updateStatus('Escolha um item para começar.');
    observer = new ResizeObserver(drawLines);
    observer.observe(board);
  }

  return { render, clear };
})();
