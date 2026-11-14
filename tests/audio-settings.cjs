const assert = require('node:assert/strict');
const fs = require('node:fs');

// Requer servidor HTTP na porta 8000 e Chrome com depuração na porta 9222.
(async () => {
  const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
  const page = pages.find(p => p.type === 'page' && p.url.includes('127.0.0.1:8000'));
  assert.ok(page, 'Página do jogo disponível');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let nextId = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(message.error) : resolve(message.result);
  });
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = ++nextId;
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function reload() {
    await send('Page.reload');
    await wait(200);
    for (let i = 0; i < 300; i++) {
      if (await evaluate("!!(window.GameAudio && window.openSettingsMenu && document.getElementById('btn-main-play') === document.activeElement)")) return;
      await wait(50);
    }
    assert.fail('O jogo iniciou após recarregar');
  }
  async function key(key) {
    const codes = { Tab: 9, Enter: 13, Escape: 27, ArrowLeft: 37, End: 35, Home: 36 };
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, windowsVirtualKeyCode: codes[key], text: key === 'Enter' ? '\r' : undefined });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, windowsVirtualKeyCode: codes[key] });
  }
  async function tabTo(selector) {
    for (let i = 0; i < 45; i++) {
      if (await evaluate(`document.activeElement.matches(${JSON.stringify(selector)})`)) return;
      await key('Tab');
    }
    assert.fail(`Controle alcançável por Tab: ${selector}`);
  }
  try {
    await send('Network.enable');
    await send('Network.setCacheDisabled', { cacheDisabled: true });
    await evaluate("localStorage.clear(); localStorage.setItem('bugHunters.audio.buttons', '0.37'); localStorage.setItem('bugHunters.audio.buttonsEnabled', 'false')");
    await reload();
    assert.deepEqual(await evaluate('({volume: GameAudio.getState().effects, enabled: GameAudio.getState().effectsEnabled})'), { volume: 0.37, enabled: false }, 'Preferências antigas preservadas');
    await evaluate('GameAudio.setButtonVolume(0.12); GameAudio.setButtonsEnabled(true)');
    await reload();
    assert.equal(await evaluate('GameAudio.getState().effects'), 0.37, 'Migração ocorre somente uma vez');
    assert.equal(await evaluate('GameAudio.getState().effectsEnabled'), false);
    await evaluate('GameAudio.setMaster(0.8); GameAudio.setEffectsEnabled(true)');
    await tabTo('#btn-main-settings');
    await key('Enter');
    await tabTo('[data-effects-step="-10"]');
    await key('Enter');
    assert.equal(await evaluate('GameAudio.getState().effects'), 0.27);
    await tabTo('[data-effects-step="10"]');
    await key('Enter');
    assert.equal(await evaluate("document.getElementById('effects-volume-value').textContent"), '37%');
    await key('Tab');
    assert.equal(await evaluate('document.activeElement.id'), 'toggle-effects-sound');
    await key('Enter');
    assert.equal(await evaluate("document.activeElement.getAttribute('aria-pressed')"), 'false');
    assert.equal(await evaluate('GameAudio.getState().buttonsEnabled'), true, 'Desligar efeitos preserva cliques');
    await key('Enter');
    await key('Tab');
    assert.equal(await evaluate('document.activeElement.id'), 'test-effects-sound');
    await key('Enter');
    await wait(100);
    assert.equal(await evaluate('!!GameAudio.getState().feedback'), true, 'Botão Testar reproduz um efeito real');
    await tabTo('#effects-volume-control');
    await key('ArrowLeft');
    assert.equal(await evaluate('GameAudio.getState().effects'), 0.36, 'Setas ajustam o volume nativamente');
    await key('Home');
    assert.equal(await evaluate('GameAudio.getState().effects'), 0);
    await reload();
    assert.equal(await evaluate('GameAudio.getState().effects'), 0, 'Volume zero salvo');
    await evaluate('GameAudio.setEffectsVolume(0.48); GameAudio.setEffectsEnabled(false)');
    await reload();
    assert.deepEqual(await evaluate('({volume: GameAudio.getState().effects, enabled: GameAudio.getState().effectsEnabled, buttons: GameAudio.getState().buttons})'), { volume: 0.48, enabled: false, buttons: 0.12 });
    console.log('OK: ajustes independentes, migração, persistência e Tab/Enter/setas');

    const source = fs.readFileSync('assets/js/systems/audio.js', 'utf8');
    const measurements = await evaluate(`(${async function (source) {
      const saved = { ...localStorage };
      const frame = document.createElement('iframe');
      frame.hidden = true;
      document.body.append(frame);
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
      let ctx;
      try {
        frame.contentWindow.eval(source);
        const audio = frame.contentWindow.GameAudio;
        audio.setBackgroundEnabled(false);
        audio.setMaster(1);
        audio.setButtonVolume(0.75);
        audio.setEffectsVolume(0.75);
        audio.setEffectsEnabled(true);
        audio.setButtonsEnabled(true);
        await audio.unlock();
        ctx = audio.getState().ctx;
        const fx = ctx.createAnalyser(), buttons = ctx.createAnalyser();
        fx.fftSize = buttons.fftSize = 2048;
        audio.getState().sfxGain.connect(fx);
        audio.getState().buttonsGain.connect(buttons);
        async function sample(action, duration = 1000) {
          const settled = ctx.currentTime + 0.2;
          while (ctx.currentTime < settled) await sleep(10);
          action();
          let effects = 0, clicks = 0, steadyEffects = 0;
          const data = new Float32Array(2048);
          const start = ctx.currentTime;
          const end = ctx.currentTime + duration / 1000;
          while (ctx.currentTime < end) {
            await sleep(10);
            fx.getFloatTimeDomainData(data);
            const rms = Math.sqrt(data.reduce((sum, v) => sum + v * v, 0) / data.length);
            effects = Math.max(effects, rms);
            if (ctx.currentTime - start > 0.12) steadyEffects = Math.max(steadyEffects, rms);
            buttons.getFloatTimeDomainData(data);
            clicks = Math.max(clicks, Math.sqrt(data.reduce((sum, v) => sum + v * v, 0) / data.length));
          }
          return { effects, clicks, steadyEffects };
        }
        const result = {};
        result.correct = await sample(() => audio.playCorrectAnswer());
        result.click = await sample(() => audio.playConfirm());
        audio.setEffectsVolume(0.25);
        result.quiet = await sample(() => audio.playCorrectAnswer());
        audio.setEffectsVolume(0);
        result.zero = await sample(() => audio.playError());
        audio.setEffectsVolume(0.75);
        audio.setButtonsEnabled(false);
        result.buttonsOff = await sample(() => { audio.playConfirm(); audio.playError(); });
        audio.setButtonsEnabled(true);
        audio.setEffectsEnabled(false);
        result.effectsOff = await sample(() => {
          audio.playError(); audio.playCorrectAnswer(); audio.playFootstep();
          audio.playBugAlert(); audio.playDialogueKey(); audio.playResultReveal();
          audio.playLevelComplete(); audio.playVictory(); audio.playConfirm();
        }, 3000);
        audio.setEffectsEnabled(true);
        audio.playBugAlert();
        const alert = audio.getState().alertAudio;
        if (alert.readyState < 3) await new Promise(resolve => alert.addEventListener('canplay', resolve, { once: true }));
        audio.stopBugAlert();
        result.alert = await sample(() => audio.playBugAlert(), 1500);
        audio.setEffectsEnabled(false);
        result.activeAlertMuted = await sample(() => {});
        audio.stopBugAlert();
        return result;
      } finally {
        if (ctx) await ctx.close();
        frame.remove();
        localStorage.clear();
        Object.entries(saved).forEach(([key, value]) => localStorage.setItem(key, value));
      }
    }.toString()})(${JSON.stringify(source)})`);
    assert.ok(measurements.correct.effects > 0.05 && measurements.correct.clicks === 0, 'Respostas passam pelo controle de efeitos');
    assert.ok(measurements.click.clicks > 0.005 && measurements.click.effects === 0, 'Menus passam pelo controle dos botões');
    assert.ok(Math.abs(measurements.quiet.steadyEffects / measurements.correct.steadyEffects - 1 / 3) < 0.08, `Reduzir volume altera o áudio reproduzido após a suavização: ${JSON.stringify(measurements)}`);
    assert.equal(measurements.zero.effects, 0, 'Volume zero silencia efeitos');
    assert.ok(measurements.buttonsOff.effects > 0.05 && measurements.buttonsOff.clicks === 0, 'Efeitos funcionam com botões silenciados');
    assert.ok(measurements.effectsOff.effects === 0 && measurements.effectsOff.clicks > 0.005, 'Todos os efeitos podem ser desligados preservando cliques');
    assert.ok(measurements.alert.effects > 0.05, 'Alerta usa o controle de efeitos');
    assert.ok(measurements.activeAlertMuted.effects < 0.0001, 'Desligar efeitos silencia alerta que já estava tocando');
    console.log('OK: áudio real de respostas, alerta, passos, vitória e menus com volume e silêncio independentes');

    await evaluate('openSettingsMenu()');
    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 844, height: 390 }, { width: 320, height: 568 }]) {
      await send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1, mobile: false });
      for (const font of ['default', 'arial']) {
        for (const size of ['normal', 'giant']) {
          await evaluate(`AccessibilitySystem.setFontFamily('${font}', false); AccessibilitySystem.setFontSize('${size}', false)`);
          const overflow = await evaluate(`(() => {
            const card = document.getElementById('effects-volume-control').closest('.settings-card');
            const bounds = card.getBoundingClientRect();
            return [...card.querySelectorAll('button, input, label, p, strong')].filter(el => {
              const rect = el.getBoundingClientRect();
              return rect.left < bounds.left || rect.right > bounds.right || el.scrollWidth > el.clientWidth + 2;
            }).map(el => el.id || el.textContent.trim());
          })()`);
          assert.deepEqual(overflow, [], `${viewport.width}px ${font} ${size}: controles dentro do cartão`);
        }
      }
    }
    console.log('OK: layout em desktop/celular, fontes padrão/Arial e tamanhos normal/gigante');
  } finally {
    await send('Emulation.clearDeviceMetricsOverride');
    socket.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
