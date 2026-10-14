const assert = require('node:assert/strict');

// Requer o jogo em localhost:8000 e Chrome com depuração na porta 9222.
(async () => {
  const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
  const page = pages.find(p => p.type === 'page' && /127.0.0.1:8000/.test(p.url));
  assert.ok(page, 'Página do jogo disponível');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let id = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.id) {
      pending.get(message.id)(message.result);
      pending.delete(message.id);
    }
  });
  function send(method, params) {
    return new Promise(resolve => {
      pending.set(++id, resolve);
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true });
    assert.ok(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  }
  try {
    await evaluate('location.reload()');
    await new Promise(resolve => setTimeout(resolve, 1000));
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
      await send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1, mobile: false });
      await evaluate("localStorage.setItem('bh_tutorial_done', '1'); selectDifficulty('dificil'); AccessibilitySystem.setFontSize('normal', false)");
      const selectors = ['.main-menu-title', '.diff-label', '.stat-value', '.settings-label', '#font-size-access-value', '.glossary-title', '.tutorial-text', '#mission-desc', '#mission-code', '.code-choice-content', '#feedback-msg', '.room-clear-title'];
      await evaluate("Glossary.open(); GameState.activeIdx = 0; MissionSystem.startMission(); MissionSystem.selectAnswer(0, document.querySelector('.choice-btn'))");
      const measure = () => evaluate(`(${JSON.stringify(selectors)}).map(s => { const el = document.querySelector(s); return el ? [s, parseFloat(getComputedStyle(el).fontSize)] : null; }).filter(Boolean)`);
      const normal = await measure();
      assert.ok(normal.length >= 9, 'Cobertura das telas');
      for (const [size, scale] of [['large', 1.5], ['giant', 2]]) {
        await evaluate(`document.querySelector('[data-font-size="${size}"]').click()`);
        const measurements = await measure();
        for (let i = 0; i < normal.length; i++) {
          assert.ok(Math.abs(measurements[i][1] - normal[i][1] * scale) < 0.1, `${viewport.width}px ${size} ${normal[i][0]}: ${measurements[i][1]}`);
        }
        assert.equal(await evaluate("localStorage.getItem('bugHunters.fontSize')"), size);
        assert.equal(await evaluate("document.getElementById('font-size-access-value').textContent"), size === 'giant' ? 'GIGANTE' : 'GRANDE');
      }
      await evaluate("document.dispatchEvent(new KeyboardEvent('keydown', { key: '-', bubbles: true }))");
      assert.equal(await evaluate("localStorage.getItem('bugHunters.fontSize')"), 'large');
      await evaluate("AccessibilitySystem.setFontSize('giant', false); UI.showScreen(null)");
      const hudOverflow = await evaluate(`Array.from(document.querySelectorAll('.hud-action-btn')).filter(el => el.getClientRects().length).map(el => ({ name: el.textContent.trim(), width: el.clientWidth, height: el.clientHeight, sw: el.scrollWidth, sh: el.scrollHeight, overflow: el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1 }))`);
      assert.ok(hudOverflow.every(item => !item.overflow), JSON.stringify(hudOverflow));
      for (const screen of ['screen-main-menu', 'screen-settings', 'screen-accessibility']) {
        await evaluate(`UI.showScreen('${screen}')`);
        const overflow = await evaluate(`Array.from(document.querySelectorAll('#${screen} button')).filter(el => el.getClientRects().length).filter(el => { const content = el.querySelector('.menu-btn-text, .access-btn-text') || el; const range = document.createRange(); range.selectNodeContents(content); const button = el.getBoundingClientRect(); return Array.from(range.getClientRects()).some(rect => rect.width > 0 && (rect.left < button.left - 1 || rect.right > button.right + 1 || rect.top < button.top - 1 || rect.bottom > button.bottom + 1)); }).map(el => el.textContent.trim())`);
        assert.deepEqual(overflow, [], `${screen}: texto fora do botão`);
      }
      console.log(`OK: escala global, botões e atalhos em ${viewport.width}x${viewport.height}`);
    }
    await evaluate("localStorage.setItem('bugHunters.fontSize', 'giant'); location.reload()");
    await new Promise(resolve => setTimeout(resolve, 1000));
    assert.equal(await evaluate("document.body.classList.contains('font-size-giant')"), true);
    await evaluate("AccessibilitySystem.setFontSize('small', false)");
    assert.equal(await evaluate("localStorage.getItem('bugHunters.fontSize')"), 'normal');
    console.log('OK: persistência e migração da opção pequena');
  } finally {
    socket.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
