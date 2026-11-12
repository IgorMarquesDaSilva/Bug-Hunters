// Teste de integração sem dependências. Requer servidor HTTP na porta 8000
// e Chrome headless com --remote-debugging-port=9222.
const assert = require('node:assert/strict');

(async () => {
  const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
  const page = pages.find(page => page.type === 'page' && page.url.includes('127.0.0.1:8000'));
  assert.ok(page, 'Página do jogo disponível');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      message.error ? reject(message.error) : resolve(message.result);
    }
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      pending.set(++id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  async function key(key, shift = false) {
    const codes = { Enter: 13, Tab: 9, Escape: 27, ArrowRight: 39, ArrowLeft: 37, ArrowUp: 38, ArrowDown: 40, Home: 36, End: 35, ' ': 32 };
    const virtualKey = codes[key] || key.toUpperCase().charCodeAt(0);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, text: key === 'Enter' ? '\r' : key === ' ' ? ' ' : undefined, windowsVirtualKeyCode: virtualKey, modifiers: shift ? 8 : 0 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, windowsVirtualKeyCode: virtualKey, modifiers: shift ? 8 : 0 });
  }
  const focus = () => evaluate('document.activeElement.id || document.activeElement.className');
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function firstRoomFixture() {
    if (process.env.BH_TEST_FROM_FIRST_ROOM !== '1') return;
    await evaluate("GameState.currentRoom='sala1'; Renderer.loadRoomBackground(); BugSystem.spawnBugs(); CollisionSystem.loadZones(); Player.resetToRoomStart(); GameState.startRun(); HUD.update()");
  }
  async function tabUntil(expression) {
    for (let i = 0; i < 45; i++) {
      if (await evaluate(expression)) return;
      await key('Tab');
    }
    assert.fail(`Controle não alcançado com Tab: ${expression}`);
  }
  async function answerMission(correctly = true) {
    const mission = await evaluate('GameState.currentMissions()[GameState.bugs[GameState.activeIdx].missionIdx]');
    if (mission.type === 'matching') {
      assert.equal(await evaluate("document.getElementById('btn-confirm-matching').disabled"), true);
      assert.equal(await evaluate("document.getElementById('mission-code').getClientRects().length"), 0);
      for (let index = 0; index < mission.pairs.length; index++) {
        const pair = mission.pairs[index];
        await tabUntil(`document.activeElement.dataset.pairId === ${JSON.stringify(pair.id)}`);
        await key('Enter');
        const target = !correctly && index === 0 ? mission.targets.find(target => target !== pair.right) : pair.right;
        await tabUntil(`document.activeElement.matches('.matching-target') && document.activeElement.dataset.target === ${JSON.stringify(target)}`);
        await key('Enter');
        assert.equal(await evaluate('GameState.bugs[GameState.activeIdx].solved'), false, 'Ligar não responde antes da confirmação');
      }
      assert.equal(await focus(), 'btn-confirm-matching');
      await key('Enter');
    } else if (mission.type === 'memory') {
      for (const pair of mission.pairs) {
        for (const card of mission.cards.filter(card => card.pairId === pair.id)) {
          await tabUntil(`document.activeElement.dataset.cardId === ${JSON.stringify(card.id)}`);
          await key('Enter');
        }
      }
    } else {
      await key('Tab');
      if (mission.code) {
        assert.equal(await focus(), 'mission-code', 'Blocos acessíveis pelo Tab');
        await key('Tab');
      }
      assert.ok((await focus()).includes('choice-btn'));
      const index = correctly ? mission.correct : (mission.correct + 1) % mission.choices.length;
      await tabUntil(`document.activeElement === document.querySelectorAll('#choices-container .choice-btn')[${index}]`);
      await key('Enter');
    }
    assert.equal(await focus(), 'btn-next', 'Resposta passa o foco ao botão Continuar');
    assert.equal(await evaluate("document.getElementById('feedback-msg').classList.contains('ok')"), correctly);
    assert.ok(await evaluate("document.getElementById('explanation-box').textContent.length > 10"));
  }
  try {
    await evaluate("localStorage.clear(); location.reload()");
    await wait(700);
    assert.equal(await evaluate("document.getElementById('gameCanvas').getAttribute('role')"), 'application');
    assert.equal(await evaluate("document.getElementById('game-live-region').getAttribute('aria-live')"), 'polite');
    assert.equal(await focus(), 'btn-main-play');
    assert.equal(await evaluate("document.querySelector('.main-menu-shortcuts')"), null, 'Painel antigo de atalhos removido');
    await key('Tab', true);
    assert.equal(await focus(), 'btn-main-accessibility');
    await key(' ');
    await wait(100);
    assert.equal(await focus(), 'btn-screen-reader');
    await key('Escape');
    await key('w');
    assert.equal(await focus(), 'master-volume-control');
    const volume = await evaluate('Number(document.activeElement.value)');
    await key('ArrowLeft');
    assert.ok(await evaluate('Number(document.activeElement.value)') < volume, 'Setas ajustam o volume');
    await key('Escape');

    for (let difficulty = 0; difficulty < 3; difficulty++) {
      assert.equal(await focus(), 'btn-main-play', 'Retorno ao menu');
      await key('Enter');
      for (let i = 0; i < difficulty; i++) await key('ArrowDown');
      assert.equal(await evaluate("Array.from(document.querySelectorAll('.diff-btn')).indexOf(document.activeElement)"), difficulty);
      await key('Enter');
      await firstRoomFixture();
      assert.equal(await evaluate('GameState.currentRoom'), 'sala1', 'Partida começa na primeira fase');
      if (difficulty === 0) {
        assert.equal(await focus(), 'tut-btn-next');
        await key('Enter');
        await key('Tab', true);
        assert.equal(await focus(), 'tut-btn-prev');
        await key(' ');
        assert.equal(await evaluate("document.getElementById('tut-step-counter').textContent"), '01/11', 'Espaço aciona Anterior');
        await key('Escape');
      }
      assert.equal(await focus(), 'gameCanvas');
      if (difficulty === 0) {
        await key('r');
        await wait(40);
        assert.match(await evaluate("document.getElementById('game-live-region').textContent"), /\d+ pixels em linha reta/, 'Distância do bug anunciada no mapa');
      }
      const x = await evaluate('Player.state.x');
      await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', windowsVirtualKeyCode: 65 });
      await wait(80);
      await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', windowsVirtualKeyCode: 65 });
      assert.ok(await evaluate('Player.state.x') < x, 'Movimento por teclado');
      await key('Tab');
      await key('Tab');
      await key('Enter');
      assert.ok((await focus()).includes('glossary-tab'));
      await key('Tab');
      await key('Enter');
      assert.ok((await focus()).includes('glossary-subtab'), 'Glossário preserva o foco ao reconstruir menu');
      await key('Escape');
      assert.ok((await focus()).includes('hud-action-glossary'), 'Foco retorna ao botão que abriu o glossário');
      await key('Tab');
      assert.equal(await focus(), 'btn-hud-shortcuts');
      await key('Enter');
      assert.equal(await focus(), 'shortcuts-content', 'Lista de atalhos recebe foco para rolagem');
      assert.equal(await evaluate('GameState.isPaused'), true, 'Ajuda pausa a exploração');
      const shortcuts = await evaluate("document.getElementById('shortcuts-content').textContent");
      for (const command of ['Tab', 'Enter', 'Espaço', 'Shift + Tab', 'Home', 'End', 'W A S D', 'Escape', 'Narrador', 'Acessibilidade']) {
        assert.ok(shortcuts.includes(command), `Ajuda inclui ${command}`);
      }
      await key('Tab');
      assert.equal(await focus(), 'btn-shortcuts-close');
      await key('Tab');
      assert.ok((await focus()).includes('hud-action-tutorial'), 'Atalhos mantém a barra lateral acessível');
      for (let button=0; button<4; button++) await key('Tab');
      assert.equal(await focus(), 'shortcuts-content', 'Tab permanece na janela de atalhos');
      await key('Escape');
      assert.equal(await focus(), 'btn-hud-shortcuts', 'Escape devolve foco ao botão Atalhos');
      await key('Enter');
      await key('Tab');
      await key('Enter');
      assert.equal(await focus(), 'btn-hud-shortcuts', 'Atalhos também fecha somente com Tab e Enter');
      // Posições são fixtures: respostas e progressão são acionadas por teclas reais.
      for (let room = 0; room < 4; room++) {
        await evaluate("UI.showScreen(null); document.getElementById('gameCanvas').focus()");
        for (let mission = 0; mission < 5; mission++) {
          await evaluate(`GameState.activeIdx = ${mission}; Player.state.x = GameState.bugs[${mission}].x - Player.state.hitboxOffsetX; Player.state.y = GameState.bugs[${mission}].y - Player.state.hitboxOffsetY; UI.showScreen('screen-bug-popup')`);
          await key('Enter');
          assert.equal(await focus(), 'mission-desc', 'Missão começa no enunciado');
          await answerMission();
          await key('Enter');
          await wait(140);
          if (mission < 4) assert.equal(await focus(), 'gameCanvas', 'Missão devolve foco ao mapa');
        }
        assert.equal(await focus(), 'btn-room-clear-open');
        await evaluate('Player.resetToRoomStart()');
        await key('Enter');
        assert.equal(await evaluate('GameState.portal.visible'), true);
        await evaluate("GameState.portal.triggered = true; UI.showScreen('screen-next-level')");
        await key('Enter');
        {
          for (let frame = 0; frame < 80 && await evaluate('TransitionSystem.isActive()'); frame++) await wait(100);
          assert.equal(await evaluate('TransitionSystem.isActive()'), false, 'Transição concluída antes da próxima fase');
        }
      }
      assert.equal(await evaluate("document.getElementById('screen-win').style.display"), 'flex');
      assert.equal(await evaluate('GameState.score'), 100);
      await key('Enter');
      await tabUntil("document.activeElement.id === 'final-menu'");
      await key('Enter');
      for (let frame = 0; frame < 80 && await evaluate('TransitionSystem.isActive()'); frame++) await wait(100);
      assert.equal(await focus(), 'btn-main-play');
      console.log(`OK: dificuldade ${difficulty + 1}, quatro fases e 20 missões por teclado`);
    }
    // Fluxo de falha: errar, reiniciar a fase e voltar do Game Over.
    await key('Enter');
    await key('Enter');
    await firstRoomFixture();
    for (let attempt = 0; attempt < 2; attempt++) {
      for (let mission = 0; mission < 5; mission++) {
        await evaluate(`GameState.activeIdx = ${mission}; Player.state.x = GameState.bugs[${mission}].x - Player.state.hitboxOffsetX; Player.state.y = GameState.bugs[${mission}].y - Player.state.hitboxOffsetY; UI.showScreen('screen-bug-popup')`);
        await key('Enter');
        await answerMission(false);
        await key('Enter');
        await wait(140);
      }
      for (let frame = 0; frame < 80 && await evaluate('TransitionSystem.isActive()'); frame++) await wait(100);
      assert.equal(await evaluate("Array.from(document.querySelectorAll('.overlay')).find(e => e.style.display !== 'none').id"),
        attempt === 0 ? 'screen-room-retry' : 'screen-gameover');
      await key('Enter');
      if (attempt === 1) {
        await tabUntil("document.activeElement.id === 'gameover-menu'");
        await key('Enter');
        for (let frame = 0; frame < 80 && await evaluate('TransitionSystem.isActive()'); frame++) await wait(100);
      }
    }
    assert.equal(await focus(), 'btn-main-play');
    console.log('OK: respostas erradas, reinício único e retorno do Game Over');
    console.log('OK: foco, Tab reverso, Espaço, Escape, volume, tutorial, glossário e movimento');
  } finally {
    socket.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
