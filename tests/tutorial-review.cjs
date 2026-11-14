const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

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
  async function key(key) {
    const codes = { Tab: 9, Enter: 13, Escape: 27, ArrowDown: 40, ArrowLeft: 37, End: 35 };
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, windowsVirtualKeyCode: codes[key], text: key === 'Enter' ? '\r' : undefined });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, windowsVirtualKeyCode: codes[key] });
  }
  async function tabTo(selector) {
    for (let i = 0; i < 50; i++) {
      if (await evaluate(`document.activeElement.matches(${JSON.stringify(selector)})`)) return;
      await key('Tab');
    }
    assert.fail(`Controle alcançável por Tab: ${selector}`);
  }
  async function goTo(slide) {
    await evaluate(`(() => {
      let current = Number(document.getElementById('tut-step-counter').textContent.split('/')[0]);
      while (current < ${slide}) { TutorialSystem.next(); current++; }
      while (current > ${slide}) { TutorialSystem.prev(); current--; }
    })()`);
  }
  async function tooltipVisible() {
    return evaluate("!!document.querySelector('#tutorial-term-tooltip:not([hidden])')");
  }
  async function screenshot(name) {
    if (!process.env.BH_TUTORIAL_OUTPUT) return;
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(process.env.BH_TUTORIAL_OUTPUT, name + '.png'), Buffer.from(shot.data, 'base64'));
  }
  try {
    await evaluate('localStorage.clear()');
    await send('Page.reload', { ignoreCache: true });
    await wait(200);
    let ready = false;
    for (let i = 0; i < 300; i++) {
      if (await evaluate("typeof TutorialSystem !== 'undefined' && !!GameState.missionsData && document.activeElement.id === 'btn-main-play'")) { ready = true; break; }
      await wait(50);
    }
    assert.ok(ready, 'Jogo iniciado');
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    await evaluate('GameAudio.setMaster(0); TutorialSystem.open(true)');
    const titles = [];
    const imageUrls = new Map();
    for (let slide = 1; slide <= 11; slide++) {
      titles.push(await evaluate("(() => {const title=document.getElementById('tut-title').cloneNode(true);title.querySelectorAll('button').forEach(button=>button.remove());return title.textContent.trim()})()"));
      for (const url of await evaluate("[...document.querySelectorAll('#tut-media img')].map(img=>img.src)")) {
        imageUrls.set(path.basename(new URL(url).pathname), url);
      }
      if (slide < 11) await key('Enter');
    }
    assert.equal(titles[3], 'PROGRESSÃO DO JOGO');
    assert.equal(titles[4], 'RECURSOS DE APOIO');
    assert.equal(titles[5], 'FASE 1 — LABORATÓRIO DE INICIALIZAÇÃO');
    assert.equal(titles[10], 'PRONTO(A) PARA CAÇAR BUGS!');
    assert.equal(titles.some(title => /PRONTA PARA/.test(title)), false);
    assert.equal(imageUrls.size, 3);
    for (const [filename, url] of imageUrls) {
      assert.ok(new URL(url).searchParams.has('v'), 'Imagens têm versão por abertura');
      const browserHash = await evaluate(`(async () => {
        const response = await fetch(${JSON.stringify(url)});
        if (!response.ok) throw Error('Imagem não encontrada');
        const hash = await crypto.subtle.digest('SHA-256', await response.arrayBuffer());
        return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2,'0')).join('');
      })()`);
      const fileHash = crypto.createHash('sha256').update(fs.readFileSync(path.join('assets/img/tutorial', filename))).digest('hex');
      assert.equal(browserHash, fileHash, `Navegador usa o arquivo atual: ${filename}`);
    }
    const firstVersion = new URL(imageUrls.values().next().value).searchParams.get('v');
    await key('Enter');
    assert.equal(await evaluate('UI.getActiveScreen()'), 'screen-main-menu', 'Enter conclui o tutorial');
    await evaluate('TutorialSystem.open(true)');
    assert.notEqual(await evaluate("new URL(document.querySelector('#tut-media img').src).searchParams.get('v')"), firstVersion, 'Reabrir solicita as imagens atualizadas sem limpar o cache');
    console.log('OK: ordem dos 11 slides, linguagem e imagens idênticas aos arquivos do projeto com cache ativo');

    await goTo(5);
    await tabTo('[data-tutorial-term="hud"]');
    assert.equal(await tooltipVisible(), true, 'Foco por Tab abre a explicação');
    assert.match(await evaluate("document.getElementById('tutorial-term-tooltip').textContent"), /painel do jogo.*pontos.*tempo/);
    assert.equal(await evaluate("document.activeElement.getAttribute('aria-describedby')"), 'tutorial-term-tooltip');
    await key('Escape');
    assert.equal(await tooltipVisible(), false);
    assert.equal(await evaluate('TutorialSystem.isActive()'), true, 'Esc fecha a explicação primeiro');
    await key('Enter');
    assert.equal(await tooltipVisible(), true, 'Enter abre a explicação');
    await key('Escape');
    await evaluate("document.getElementById('tut-btn-next').focus(); document.querySelector('[data-tutorial-term=\"hud\"]').scrollIntoView({block:'center'})");
    const bulb = await evaluate("(() => {const r=document.querySelector('[data-tutorial-term=\"hud\"]').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...bulb });
    await wait(200);
    assert.equal(await tooltipVisible(), true, 'Mouse abre a explicação');
    const tooltip = await evaluate("(() => {const r=document.getElementById('tutorial-term-tooltip').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()");
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', ...tooltip });
    await wait(250);
    assert.equal(await tooltipVisible(), true, 'Caixa permanece aberta ao mover o mouse até ela');
    await screenshot('tutorial-hud-desktop');
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 2, y: 2 });
    await wait(250);
    assert.equal(await tooltipVisible(), false, 'Caixa fecha ao sair do termo e da explicação');
    console.log('OK: lâmpadas por mouse, Tab e Enter, explicação acessível e Esc sem fechar o tutorial');

    await goTo(10);
    const scrollable = await evaluate("(() => {const el=document.querySelector('.tut-text-wrap');return getComputedStyle(el).overflowY==='auto' && el.scrollHeight>el.clientHeight})()");
    assert.equal(scrollable, true, 'Pontuação tem rolagem própria');
    await tabTo('.tut-text-wrap');
    await evaluate("document.querySelector('.tut-text-wrap').scrollTop=0");
    await key('ArrowDown');
    await wait(300);
    assert.ok(await evaluate("document.querySelector('.tut-text-wrap').scrollTop") > 0, 'Teclado rola o texto');
    await key('End');
    await wait(300);
    assert.equal(await evaluate("(() => {const el=document.querySelector('.tut-text-wrap');return Math.abs(el.scrollHeight-el.clientHeight-el.scrollTop)<2})()"), true, 'Última linha alcançável pelo teclado');
    await screenshot('tutorial-pontuacao-rolagem');
    await key('Enter');
    await goTo(9);
    assert.equal(await evaluate("document.querySelector('.tut-text-wrap').scrollTop"), 0, 'Trocar slide reinicia a rolagem');
    assert.equal(await evaluate("document.querySelector('.tutorial-body').scrollTop"), 0, 'Trocar slide reinicia a área de imagens e texto');

    for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 844, height: 390 }, { width: 320, height: 568 }]) {
      await send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor: 1, mobile: false });
      for (const font of ['default', 'arial']) {
        for (const size of ['normal', 'giant']) {
          await evaluate(`AccessibilitySystem.setFontFamily('${font}',false);AccessibilitySystem.setFontSize('${size}',false)`);
          for (const slide of [5, 9, 10]) {
            await goTo(slide);
            const layout = await evaluate(`(() => {
              const wrap=document.querySelector('.tut-text-wrap'), panel=document.querySelector('.tutorial-panel');
              const rect=wrap.getBoundingClientRect();
              wrap.scrollTop=wrap.scrollHeight;
              const last=wrap.lastElementChild.getBoundingClientRect();
              return {overflow:wrap.scrollWidth>wrap.clientWidth+2, bottom:last.bottom<=rect.bottom+1,
                panelOverflow:panel.scrollWidth>panel.clientWidth+2, scroll:getComputedStyle(wrap).overflowY};
            })()`);
            assert.equal(layout.overflow, false, `${viewport.width}px ${font} ${size} slide ${slide}: texto sem vazamento horizontal`);
            assert.equal(layout.panelOverflow, false, 'Painel dentro dos limites');
            assert.equal(layout.bottom, true, 'Final do texto pode ser visto pela rolagem');
            assert.equal(layout.scroll, 'auto');
          }
          await goTo(5);
          await evaluate("document.querySelector('[data-tutorial-term=\"hud\"]').focus()");
          const bounds = await evaluate("(() => {const r=document.getElementById('tutorial-term-tooltip').getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom,w:innerWidth,h:innerHeight}})()");
          assert.ok(bounds.left>=0 && bounds.right<=bounds.w+1 && bounds.top>=0 && bounds.bottom<=bounds.h+1, JSON.stringify(bounds));
          await key('Escape');
        }
      }
    }
    await evaluate("AccessibilitySystem.setFontFamily('default',false);AccessibilitySystem.setFontSize('normal',false)");
    await goTo(9);
    await screenshot('tutorial-fase4-mobile');
    console.log('OK: rolagem e explicações em desktop/celular, padrão/Arial, normal/gigante');

    await evaluate('TutorialSystem.close();openSettingsMenu()');
    await tabTo('#effects-volume-control');
    assert.equal(await evaluate("document.querySelector('[data-effects-step],.audio-volume-stepper,.audio-step-btn')"), null, 'Botões de volume extras removidos');
    const volume = await evaluate('Number(document.activeElement.value)');
    await key('ArrowLeft');
    assert.equal(await evaluate('Number(document.activeElement.value)'), volume-1);
    await key('Tab');
    assert.equal(await evaluate('document.activeElement.id'), 'toggle-effects-sound');
    await key('Enter');
    assert.equal(await evaluate('GameAudio.getState().effectsEnabled'), false);
    await key('Enter');
    await key('Tab');
    assert.equal(await evaluate('document.activeElement.id'), 'test-effects-sound');
    console.log('OK: volume mantém barra, ligar/desligar, teste e navegação por teclado');

    await evaluate("localStorage.clear();selectDifficulty('facil');GameAudio.setMaster(0)");
    assert.equal(await evaluate('UI.getActiveScreen()'), 'screen-tutorial', 'Primeira entrada abre o tutorial');
    for (let i = 0; i < 11; i++) await key('Enter');
    assert.equal(await evaluate('UI.getActiveScreen()'), 'screen-intro', 'Encerrar tutorial mantém a apresentação inicial');
    assert.equal(await evaluate('document.activeElement.id'), 'intro-message');
    await key('Tab');
    assert.equal(await evaluate('document.activeElement.id'), 'btn-intro-start');
    await key('Enter');
    assert.equal(await evaluate('UI.getActiveScreen()'), null, 'Começar pelo teclado retoma o jogo');
    assert.equal(await evaluate('document.activeElement.id'), 'game-movement-input');
    console.log('OK: primeira entrada, apresentação e retorno ao jogo com Tab e Enter');
  } finally {
    await send('Emulation.clearDeviceMetricsOverride');
    socket.close();
  }
})().catch(error => { console.error(error); process.exitCode=1; });
