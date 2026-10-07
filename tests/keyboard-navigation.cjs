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
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
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
  try {
    await evaluate("localStorage.clear(); location.reload()");
    await wait(700);
    assert.equal(await focus(), 'btn-main-play');
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
      // Posições são fixtures: respostas e progressão são acionadas por teclas reais.
      for (let room = 0; room < 4; room++) {
        await evaluate("UI.showScreen(null); document.getElementById('gameCanvas').focus()");
        for (let mission = 0; mission < 5; mission++) {
          await evaluate(`GameState.activeIdx = ${mission}; Player.state.x = GameState.bugs[${mission}].x - Player.state.hitboxOffsetX; Player.state.y = GameState.bugs[${mission}].y - Player.state.hitboxOffsetY; UI.showScreen('screen-bug-popup')`);
          await key('Enter');
          assert.ok((await focus()).includes('choice-btn'));
          const correct = await evaluate(`GameState.currentMissions()[${mission}].correct`);
          for (let i = 0; i < correct; i++) await key('ArrowDown');
          await key('Enter');
          assert.equal(await focus(), 'btn-next');
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
        if (room < 3) await wait(2200);
      }
      assert.equal(await evaluate("document.getElementById('screen-win').style.display"), 'flex');
      assert.equal(await evaluate('GameState.score'), 100);
      await key('Enter');
      assert.equal(await focus(), 'btn-main-play');
      console.log(`OK: dificuldade ${difficulty + 1}, quatro fases e 20 missões por teclado`);
    }
    // Fluxo de falha: errar, reiniciar a fase e voltar do Game Over.
    await key('Enter');
    await key('Enter');
    for (let attempt = 0; attempt < 4; attempt++) {
      for (let mission = 0; mission < 5; mission++) {
        await evaluate(`GameState.activeIdx = ${mission}; Player.state.x = GameState.bugs[${mission}].x - Player.state.hitboxOffsetX; Player.state.y = GameState.bugs[${mission}].y - Player.state.hitboxOffsetY; UI.showScreen('screen-bug-popup')`);
        await key('Enter');
        const correct = await evaluate(`GameState.currentMissions()[${mission}].correct`);
        if (correct === 0) await key('ArrowDown');
        await key('Enter');
        await key('Enter');
        await wait(140);
      }
      assert.equal(await evaluate("Array.from(document.querySelectorAll('.overlay')).find(e => e.style.display !== 'none').id"),
        attempt < 3 ? 'screen-room-retry' : 'screen-gameover');
      await key('Enter');
    }
    assert.equal(await focus(), 'btn-main-play');
    console.log('OK: respostas erradas, três reinícios e retorno do Game Over');
    console.log('OK: foco, Tab reverso, Espaço, Escape, volume, tutorial, glossário e movimento');
  } finally {
    socket.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
