const assert = require('node:assert/strict');

// Requer HTTP na porta 8000 e Chrome com depuração na porta 9222.
// Verifica a árvore acessível e o teclado; não simula a voz do Narrador.
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
  async function press(key, duration = 0) {
    const codes = { Tab: 9, Enter: 13, Escape: 27, ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39 };
    const code = codes[key] || key.toUpperCase().charCodeAt(0);
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, windowsVirtualKeyCode: code, text: key === 'Enter' ? '\r' : undefined });
    if (duration) await wait(duration);
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, windowsVirtualKeyCode: code });
  }
  async function tabTo(selector) {
    for (let i = 0; i < 75; i++) {
      if (await evaluate(`document.activeElement.matches(${JSON.stringify(selector)})`)) return;
      await press('Tab');
    }
    assert.fail(`Controle alcançável por Tab: ${selector}`);
  }
  async function checkQuestionFocus() {
    await evaluate("document.getElementById('mission-desc').focus()");
    await evaluate("document.querySelector('.hud-action-settings').focus()");
    assert.equal(await evaluate("!!document.activeElement.closest('#screen-mission')"), true, 'Foco externo volta à pergunta');
    const total = await evaluate("[...document.querySelectorAll('#screen-mission button:not(:disabled),#screen-mission [tabindex=\"0\"]')].filter(el=>el.getClientRects().length).length");
    for (let i = 0; i < total * 2 + 2; i++) {
      await press('Tab');
      assert.equal(await evaluate("!!document.activeElement.closest('#screen-mission')"), true, 'Tab permanece dentro da pergunta');
    }
    await evaluate("document.getElementById('mission-desc').focus()");
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', windowsVirtualKeyCode: 9, modifiers: 8 });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Tab', windowsVirtualKeyCode: 9, modifiers: 8 });
    assert.equal(await evaluate("!!document.activeElement.closest('#screen-mission')"), true, 'Tab reverso também permanece na pergunta');
    const before = await evaluate("JSON.stringify({index:GameState.activeIdx,score:GameState.score,choices:document.getElementById('choices-container').innerHTML,memory:document.getElementById('memory-container').innerHTML,matching:document.getElementById('matching-container').innerHTML})");
    await tabTo('#btn-mission-glossary');
    await press('Enter');
    assert.equal(await evaluate('UI.getActiveScreen()'), 'screen-glossary');
    await tabTo('.glossary-close');
    await press('Enter');
    assert.equal(await evaluate('UI.getActiveScreen()'), 'screen-mission');
    assert.equal(await evaluate('document.activeElement.id'), 'btn-mission-glossary');
    assert.equal(await evaluate("JSON.stringify({index:GameState.activeIdx,score:GameState.score,choices:document.getElementById('choices-container').innerHTML,memory:document.getElementById('memory-container').innerHTML,matching:document.getElementById('matching-container').innerHTML})"), before, 'Glossário interno preserva a atividade');
  }
  async function accessible(selector) {
    const { root } = await send('DOM.getDocument');
    const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector });
    assert.ok(nodeId, selector);
    const { node } = await send('DOM.describeNode', { nodeId });
    const { nodes } = await send('Accessibility.getPartialAXTree', { backendNodeId: node.backendNodeId });
    return nodes.find(item => item.backendDOMNodeId === node.backendNodeId);
  }
  async function ready() {
    for (let i = 0; i < 300; i++) {
      if (await evaluate("typeof GameState !== 'undefined' && !!GameState.missionsData && !!window.AccessibilitySystem && document.activeElement.id === 'btn-main-play'")) return;
      await wait(50);
    }
    assert.fail('Jogo iniciado');
  }
  let injected;
  try {
    await send('Page.enable');
    injected = await send('Page.addScriptToEvaluateOnNewDocument', { source: "window.browserSpeechCalls=0;if(window.speechSynthesis)window.speechSynthesis.speak=()=>browserSpeechCalls++" });
    await evaluate("localStorage.clear();localStorage.setItem('bugHunters.accessibility.screenReader','1')");
    await send('Page.reload', { ignoreCache: true });
    await wait(200);
    await ready();
    await evaluate('GameAudio.setMaster(0)');
    assert.equal((await accessible('#btn-main-play')).name.value, 'Jogar');
    assert.equal(await evaluate("document.querySelector('#btn-screen-reader,#btn-read-current,[aria-keyshortcuts=\"L\"]')"), null);
    assert.equal(await evaluate('typeof AccessibilitySystem.setScreenReader'), 'undefined');
    await tabTo('#btn-main-accessibility');
    await press('Enter');
    assert.equal(await evaluate('document.activeElement.id'), 'btn-high-contrast');
    await press('l');
    await press('Escape');
    await evaluate("selectDifficulty('facil')");
    assert.equal(await evaluate('UI.getActiveScreen()'), 'screen-tutorial');
    for (let i = 0; i < 11; i++) await press('Enter');
    assert.equal(await evaluate('UI.getActiveScreen()'), 'screen-intro');
    const intro = await accessible('#intro-message');
    assert.equal(intro.role.value, 'group');
    assert.match(intro.name.value, /Você agora faz parte dos Bug Hunters/);
    assert.equal(await evaluate("document.getElementById('intro-typed-text').getAttribute('aria-hidden')"), 'true');
    await press('Tab');
    await press('Enter');
    assert.equal(await evaluate('document.activeElement.id'), 'game-movement-input');
    const map = await accessible('#game-movement-input');
    assert.equal(map.role.value, 'textbox');
    assert.ok(map.properties.some(property => property.name === 'multiline' && property.value.value));
    assert.equal((await accessible('#game-movement-region')).role.value, 'application');
    assert.equal((await accessible('#gameCanvas')).ignored, true);
    assert.match(map.description.value, /Caps Lock.*modo de varredura/);
    assert.ok(map.properties.some(property => property.name === 'focused' && property.value.value));
    assert.equal((await accessible('#room-map')).ignored, true, 'Decoração do mapa não polui a leitura');
    assert.equal(await evaluate('browserSpeechCalls'), 0, 'Preferência antiga não ativa voz do navegador');
    console.log('OK: somente leitor nativo, menu, tutorial, apresentação e foco na aplicação de movimento');

    await evaluate("GameState.bugs=[];GameState.activeIdx=-1;GameState.collisionZones=[];Player.state.x=450;Player.state.y=250;AccessibilitySystem.clearAnnouncements()");
    await evaluate('window.actualFootstep=GameAudio.playFootstep;window.stepCalls=0;GameAudio.playFootstep=(...args)=>{stepCalls++;return actualFootstep(...args)}');
    assert.equal(await evaluate(`(() => {
      const input=document.getElementById('game-movement-input'), before=Player.state.x;
      input.dispatchEvent(new KeyboardEvent('keydown',{key:'d',bubbles:true,cancelable:true}));
      input.dispatchEvent(new KeyboardEvent('keyup',{key:'d',bubbles:true}));
      return Player.state.x>before;
    })()`), true, 'Toque completo entre dois quadros também move');
    assert.equal(await evaluate('stepCalls'), 1, 'Toque curto toca um passo imediatamente');
    await evaluate('GameAudio.playFootstep=actualFootstep');
    await send('Input.insertText', { text: 'teste' });
    await press('x');
    assert.equal(await evaluate("document.getElementById('game-movement-input').value"), '', 'Controle não acumula texto ou abre escrita no mapa');
    await press('c');
    assert.equal(await evaluate("document.body.classList.contains('high-contrast-on')"), true, 'Atalhos de acessibilidade continuam disponíveis na entrada de movimento');
    await press('c');
    for (const [key, axis, direction] of [['w','y',-1],['s','y',1],['a','x',-1],['d','x',1],['ArrowUp','y',-1],['ArrowDown','y',1],['ArrowLeft','x',-1],['ArrowRight','x',1]]) {
      const before = await evaluate(`Player.state.${axis}`);
      await press(key, 100);
      const after = await evaluate(`Player.state.${axis}`);
      assert.ok((after-before)*direction > 0, `Movimento real por ${key}: ${before} → ${after}`);
    }
    await press('Tab');
    assert.equal(await evaluate("document.activeElement.matches('.stat')"), true);
    await press('Escape');
    assert.equal(await evaluate('document.activeElement.id'), 'game-movement-input', 'Escape sai da consulta do painel e retoma o mapa');
    for (const [open, screen] of [['openSettingsFromGame()', 'screen-settings'], ['Glossary.open()', 'screen-glossary'], ['ShortcutHelp.open()', 'screen-shortcuts'], ['TutorialSystem.open(true)', 'screen-tutorial']]) {
      await evaluate(open);
      assert.equal(await evaluate('UI.getActiveScreen()'), screen);
      await press('Escape');
      assert.equal(await evaluate('document.activeElement.id'), 'game-movement-input', 'Fechar apoio foca a área que recebe WASD');
      const before = await evaluate('Player.state.x');
      await press('d', 100);
      assert.ok(await evaluate('Player.state.x') > before, 'Movimento retorna sem clique');
    }
    assert.match((await accessible('.stat:has(#hud-score)')).name.value, /Pontuação: \d+ pontos/);
    assert.match((await accessible('.stat:has(#hud-time)')).name.value, /minutos.*segundos/);
    console.log('OK: WASD, quatro setas, retorno dos quatro apoios e estatísticas acessíveis');

    await evaluate(`Player.clearDirectionInput();Player.state.x=250;Player.state.y=210;GameState.collisionZones=[{id:'box',key:'test-box',label:'uma caixa',x:310,y:290,w:50,h:60}];AccessibilitySystem.clearAnnouncements();window.collisionMessages=[];window.collisionObserver=new MutationObserver(()=>{const text=document.getElementById('game-live-region').textContent;if(text.startsWith('Colisão'))collisionMessages.push(text)});collisionObserver.observe(document.getElementById('game-live-region'),{childList:true,subtree:true})`);
    await press('d', 1500);
    assert.ok(await evaluate('Player.state.x') <= 256, 'Personagem não atravessa o obstáculo');
    assert.deepEqual(await evaluate('collisionMessages'), ['Colisão encontrada com uma caixa, à direita. Tente outra direção.'], 'Contato contínuo anuncia uma única vez');
    await press('a', 180);
    await press('d', 400);
    assert.equal(await evaluate('collisionMessages.length'), 2, 'Novo contato pode ser anunciado');
    await evaluate('collisionObserver.disconnect()');
    for (const room of ['sala1','sala2','sala3','sala4']) {
      const result = await evaluate(`(() => {GameState.currentRoom='${room}';Renderer.loadRoomBackground();CollisionSystem.loadZones();const wall=GameState.collisionZones.find(zone=>zone.label==='uma parede');const point=CollisionSystem.resolve(wall.x-10,wall.y,wall.x-25,wall.y,24,13,0,0);return {zones:GameState.collisionZones.length,labeled:GameState.collisionZones.every(zone=>!!zone.label),contact:point.contacts[0]?.label}})()`);
      assert.ok(result.zones > 5 && result.labeled, room);
      assert.equal(result.contact, 'uma parede', `${room}: paredes reais geram contato`);
    }
    console.log('OK: colisão com objeto e direção, sem repetição contínua, e obstáculos das quatro salas');

    await evaluate("selectDifficulty('dificil');GameState.currentRoom='sala4';Renderer.loadRoomBackground();BugSystem.spawnBugs();CollisionSystem.loadZones();Player.resetToRoomStart();UI.showScreen(null);GameState.activeIdx=GameState.bugs.findIndex(bug=>GameState.currentMissions()[bug.missionIdx].type==='choice');MissionSystem.startMission()");
    const question = await accessible('#mission-desc');
    assert.equal(question.role.value, 'group');
    assert.match(question.name.value, /^Pergunta: /);
    assert.equal(await evaluate('document.activeElement.id'), 'mission-desc');
    await checkQuestionFocus();
    await evaluate("document.getElementById('mission-desc').focus()");
    if (await evaluate("!document.getElementById('mission-code').parentElement.hidden")) {
      await press('Tab');
      assert.match((await accessible('#mission-code')).name.value, /Código da missão\. Linha 1:/);
    }
    await tabTo('.choice-btn');
    const option = await accessible('.choice-btn');
    assert.match(option.name.value, /^Opção A/);
    assert.equal(await evaluate("AccessibilitySystem.readableCode('energia <- 10 >= 5; nome <- \"10\"; fim <- false')"), 'energia recebe 10 maior ou igual a 5 ponto e vírgula nome recebe texto entre aspas: 10 ponto e vírgula fim recebe false, falso');
    await evaluate("(()=>{const mission=GameState.currentMissions()[GameState.bugs[GameState.activeIdx].missionIdx];document.querySelectorAll('.choice-btn')[mission.correct].focus()})()");
    await press('Enter');
    const continueButton = await accessible('#btn-next');
    assert.equal(continueButton.name.value, 'Continuar');
    assert.match(continueButton.description.value, /Resposta correta.*pontos/);
    await checkQuestionFocus();
    await evaluate("document.getElementById('btn-next').focus()");
    const beforeConsultation = await evaluate("document.getElementById('explanation-box').textContent");
    await evaluate('openSettingsFromGame()');
    await press('Escape');
    assert.equal(await evaluate('UI.getActiveScreen()'), 'screen-mission');
    assert.equal(await evaluate('document.activeElement.id'), 'btn-next');
    assert.equal(await evaluate("document.getElementById('explanation-box').textContent"), beforeConsultation);
    console.log('OK: pergunta, código, opções e explicação com nomes e descrições acessíveis, preservados nos apoios');

    for (const type of ['matching', 'memory']) {
      await evaluate(`selectDifficulty('facil');GameState.currentRoom='sala4';Renderer.loadRoomBackground();BugSystem.spawnBugs();CollisionSystem.loadZones();Player.resetToRoomStart();UI.showScreen(null);GameState.activeIdx=GameState.bugs.findIndex(bug=>GameState.currentMissions()[bug.missionIdx].type==='${type}');MissionSystem.startMission()`);
      await tabTo(type === 'memory' ? '.memory-card' : '.matching-source');
      const node = await accessible(type === 'memory' ? '.memory-card' : '.matching-source');
      assert.equal(node.role.value, 'button');
      assert.match(node.name.value, type === 'memory' ? /virada para baixo/ : /^Item:/);
      await press('Enter');
      if (type === 'memory') {
        assert.match((await accessible('.memory-card')).name.value, /^Carta 1: /);
        assert.match(await evaluate("document.getElementById('memory-status').textContent"), /Carta 1:/);
      } else {
        assert.match(await evaluate("document.getElementById('matching-status').textContent"), /selecionado/);
      }
      await checkQuestionFocus();
      assert.equal(await evaluate("document.getElementById('game-live-region').textContent"), '', 'Atividade usa seu próprio status, sem anúncio duplicado');
    }
    await evaluate('Player.clearDirectionInput();Player.state.x=100;Player.state.y=100;GameState.activeIdx=-1;UI.showScreen(null);GameState.solvedCount=5;GameState.bugs.forEach(bug=>bug.solved=true);GameState.portal.visible=true');
    await press('r');
    await wait(100);
    assert.match(await evaluate("document.getElementById('game-live-region').textContent"), /Porta de saída liberada/);
    await evaluate("selectDifficulty('facil');GameState.popupCooldown=0;GameState.activeIdx=-1;UI.showScreen(null);(()=>{const bug=GameState.bugs[0];Player.state.x=bug.x+bug.w/2-Player.state.hitboxOffsetX;Player.state.y=bug.y+bug.h/2-Player.state.hitboxOffsetY})();BugSystem.checkProximity()");
    await wait(100);
    assert.equal(await evaluate('UI.getActiveScreen()'), 'screen-bug-popup');
    assert.equal((await accessible('#game-alert-region')).role.value, 'alert');
    assert.match(await evaluate("document.getElementById('game-alert-region').textContent"), /BUG DETECTADO.*Enter/);
    await press('Enter');
    assert.equal(await evaluate('document.activeElement.id'), 'mission-desc');
    await evaluate('ResultsScreen.open(true)');
    let resultsReady = false;
    for (let i = 0; i < 300; i++) {
      if (await evaluate("UI.getActiveScreen()==='screen-win' && !TransitionSystem.isActive()")) { resultsReady=true; break; }
      await wait(50);
    }
    assert.ok(resultsReady, 'Resumo aberto');
    await press('Enter');
    assert.equal((await accessible('.result-row')).role.value, 'group');
    assert.match((await accessible('.result-row')).name.value, /FASE .*acertos/);
    assert.match((await accessible('.result-total')).name.value, /Pontuação total: \d+ de 100 pontos/);
    assert.ok(await evaluate("[...document.querySelectorAll('.result-row')].every(row=>!!row.getAttribute('aria-label'))"));
    assert.equal(await evaluate('browserSpeechCalls'), 0);
    console.log('OK: memória, associação, orientação para a saída, alerta de bug e resumo acessível sem voz própria');

    for (const room of ['sala1','sala2','sala3','sala4']) {
      await evaluate(`selectDifficulty('facil');GameState.currentRoom='${room}';Renderer.loadRoomBackground();BugSystem.spawnBugs();CollisionSystem.loadZones();Player.resetToRoomStart();GameState.solvedCount=5;GameState.bugs.forEach(bug=>bug.solved=true);GameState.score=25;GameState.roomScore=25;(()=>{const door=GameState.collisionZones.find(zone=>/\\bdoor\\b/.test(zone.id));Player.state.x=door.x+door.w/2-Player.state.hitboxOffsetX-Player.state.hitboxW/2;Player.state.y=door.y-Player.state.hitboxOffsetY-Player.state.hitboxH-6})();UI.showScreen('screen-room-clear')`);
      await press('Enter');
      await wait(120);
      assert.equal(await evaluate('GameState.portal.visible'), true);
      assert.equal(await evaluate('UI.getActiveScreen()'), null, 'Porta não pula o aviso enquanto o jogador está parado');
      assert.equal(await evaluate('document.activeElement.id'), 'game-movement-input');
      assert.match(await evaluate("document.getElementById('game-alert-region').textContent"), /A porta foi aberta\. Dirija-se à porta de saída/);
      assert.equal(await evaluate("document.getElementById('game-live-region').textContent"), '', 'Orientação antiga não encobre o aviso de abertura');
      await press('ArrowDown');
      await wait(120);
      assert.equal(await evaluate('UI.getActiveScreen()'), 'screen-next-level', 'Um toque em direção à porta permite avançar');
    }
    console.log('OK: aviso explícito e prioritário da porta nas quatro fases, seguido de avanço por teclado');
  } finally {
    if (injected) await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: injected.identifier });
    socket.close();
  }
})().catch(error => { console.error(error); process.exitCode=1; });
