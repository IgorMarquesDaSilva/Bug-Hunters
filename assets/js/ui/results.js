/* Resumo da partida: dados congelados, revelação por etapas e foco por teclado. */
const ResultsScreen = (() => {
  let timer = null;
  let current = null;

  function cancel() {
    clearTimeout(timer);
    timer = null;
    current = null;
    document.body.classList.remove('results-revealing');
  }

  function element(tag, className, text) {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function open(won, reason = '') {
    cancel();
    document.body.classList.add('results-revealing');
    const summary = GameState.getRunSummary();
    const screenId = won ? 'screen-win' : 'screen-gameover';
    const prefix = won ? 'final' : 'gameover';
    const screen = document.getElementById(screenId);
    const panel = element('div', `popup-content results-panel ${won ? 'results-victory' : 'results-defeat'}`);
    const badge = element('p', 'results-badge', won ? '✦ SISTEMA RESTAURADO ✦' : 'CONEXÃO ENCERRADA');
    const title = element('h2', 'results-title', won ? 'MISSÃO CONCLUÍDA!' : 'FIM DE PARTIDA');
    title.id = `${prefix}-title`;
    title.tabIndex = 0;
    const subtitle = element('p', 'results-subtitle', won ? 'Seu percurso como Bug Hunter' : reason);
    subtitle.id = `${prefix}-reason`;
    const difficulty = element('p', 'results-difficulty');
    difficulty.append('Dificuldade: ');
    const diffValue = element('span', '', CONFIG.difficulties[summary.difficulty].label);
    diffValue.id = `${prefix}-diff`;
    difficulty.append(diffValue);
    const hint = element('p', 'results-hint', 'Revelando seu resumo… Enter no título revela tudo.');
    hint.id = `${prefix}-hint`;
    title.setAttribute('aria-describedby', hint.id);
    const list = element('div', 'results-list');
    list.setAttribute('aria-label', 'Estatísticas da partida');
    const announcements = [];
    const rows = [];

    function row(label, value, detail = '', className = '') {
      const node = element('section', `result-row ${className}`);
      node.hidden = true;
      node.tabIndex = 0;
      node.append(element('span', 'result-label', label), element('strong', 'result-value', value));
      if (detail) node.append(element('p', 'result-detail', detail));
      list.append(node);
      rows.push(node);
      announcements.push(`${label}: ${value}. ${detail}`);
      node.setAttribute('role', 'group');
      node.setAttribute('aria-label', announcements[announcements.length - 1]);
      return node;
    }

    for (const room of summary.rooms) {
      const number = room.id.replace('sala', '');
      let detail = `${room.score} pontos nesta fase.`;
      if (room.outcome !== 'cleared') detail += ` ${room.answered} de ${room.total} missões respondidas.`;
      if (room.discarded.length) {
        const previous = room.discarded[0];
        detail += ` Após reinício: 4 pts por acerto. Tentativa descartada: ${previous.correct}/${room.total} acertos, ${previous.score} pts removidos.`;
      }
      row(`FASE ${number}`, `${room.correct} / ${room.total} acertos`, detail);
    }
    const timeRow = row('TEMPO TOTAL', HUD.formatTime(summary.elapsed), 'Inclui perguntas, consultas e reinício de fase.');
    announcements[announcements.length - 1] = `Tempo total: ${HUD.describeTime(summary.elapsed)}. Inclui perguntas, consultas e reinício de fase.`;
    timeRow.setAttribute('aria-label', announcements[announcements.length - 1]);
    const restarted = summary.rooms.filter(room => room.restarts).map(room => `fase ${room.id.replace('sala', '')}`).join(', ');
    row('REINÍCIO DE FASE', summary.restarts ? `${summary.restarts} de 1 utilizado` : 'Nenhum',
      summary.restarts ? `Reinício utilizado na ${restarted}.` : 'Você manteve a primeira tentativa em todas as fases jogadas.');
    const total = row('PONTUAÇÃO TOTAL', '', 'Pontos das tentativas válidas.', 'result-total');
    const value = total.querySelector('.result-value');
    const score = element('span', '', summary.score);
    score.id = `${prefix}-score`;
    value.append(score, element('span', 'result-score-max', ' / 100'));
    announcements[announcements.length - 1] = `Pontuação total: ${summary.score} de 100 pontos.`;
    total.setAttribute('aria-label', announcements[announcements.length - 1]);

    const actions = element('div', 'popup-actions results-actions');
    actions.hidden = true;
    const menu = element('button', 'cyber-btn', '▶ MENU');
    menu.id = `${prefix}-menu`;
    menu.type = 'button';
    menu.onclick = backToMenu;
    const replay = element('button', 'cyber-btn secondary', '↺ JOGAR NOVAMENTE');
    replay.id = `${prefix}-replay`;
    replay.type = 'button';
    replay.onclick = restartGame;
    actions.append(menu, replay);
    const status = element('p', 'sr-only');
    status.setAttribute('role', 'status');
    status.setAttribute('aria-atomic', 'true');
    panel.append(badge, title, subtitle, difficulty, hint, list, actions, status);
    screen.replaceChildren(panel);
    screen.setAttribute('aria-labelledby', title.id);
    current = { screenId, panel, rows, actions, title, hint, status, announcements,
      index: 0, complete: false, follow: true };
    const session = current;
    panel.addEventListener('focusin', event => {
      if (event.target !== title) session.follow = false;
    });
    panel.addEventListener('wheel', () => { session.follow = false; }, { passive: true });
    panel.addEventListener('touchstart', () => { session.follow = false; }, { passive: true });
    title.onkeydown = event => {
      if (!['Enter', ' '].includes(event.key) || event.repeat) return;
      event.preventDefault();
      revealAll();
    };
    TransitionSystem.play(() => {
      UI.showScreen(screenId);
      if (won) window.GameAudio?.playVictory();
      else window.GameAudio?.playGameOver();
    }, { fullscreen: true, label: 'GERANDO RESUMO...', onComplete: () => {
      if (current === session) timer = setTimeout(revealNext, 650);
    } });
  }

  function finish() {
    const session = current;
    if (!session || session.complete) return;
    session.complete = true;
    document.body.classList.remove('results-revealing');
    session.actions.hidden = false;
    session.hint.textContent = 'Resumo completo. Use Tab para consultar os resultados e os botões.';
    session.status.textContent = 'Resumo completo. Menu e Jogar novamente estão disponíveis.';
    if (session.follow) session.actions.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }

  function revealNext() {
    const session = current;
    if (!session || session.complete) return;
    if (UI.getActiveScreen() !== session.screenId || TransitionSystem.isActive()) {
      timer = setTimeout(revealNext, 250);
      return;
    }
    if (session.index >= session.rows.length) { finish(); return; }
    const row = session.rows[session.index++];
    row.hidden = false;
    row.classList.add('result-revealed');
    session.status.textContent = session.announcements[session.index - 1];
    if (session.follow) row.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    window.GameAudio?.playResultReveal(session.index === session.rows.length, session.index - 1);
    timer = setTimeout(revealNext, session.index === session.rows.length ? 950 : 1100);
  }

  function revealAll() {
    if (!current || current.complete) return;
    clearTimeout(timer);
    current.rows.forEach(row => { row.hidden = false; });
    current.index = current.rows.length;
    window.GameAudio?.playResultReveal(true);
    finish();
  }

  return { open, cancel, revealAll };
})();
