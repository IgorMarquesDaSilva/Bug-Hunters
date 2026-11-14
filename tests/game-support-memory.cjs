// Requer o jogo em 127.0.0.1:8000 e Chrome de testes na porta 9222.
const assert = require('node:assert/strict');

(async () => {
  const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
  const page = pages.find(item => item.type === 'page' && item.url.includes('127.0.0.1:8000'));
  assert.ok(page);
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, {once:true}));
  const pending = new Map();
  let sequence = 0;
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const task = pending.get(message.id);
    pending.delete(message.id);
    message.error ? task.reject(message.error) : task.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve,reject) => {
    pending.set(++sequence,{resolve,reject});
    socket.send(JSON.stringify({id:sequence,method,params}));
  });
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate',{expression,returnByValue:true});
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function key(key, hold = 0) {
    const code = {Tab:9,Enter:13,Escape:27,ArrowUp:38,ArrowDown:40,ArrowLeft:37,ArrowRight:39}[key] || key.toUpperCase().charCodeAt(0);
    await send('Input.dispatchKeyEvent',{type:'keyDown',key,text:key==='Enter'?'\r':undefined,windowsVirtualKeyCode:code});
    if (hold) await wait(hold);
    await send('Input.dispatchKeyEvent',{type:'keyUp',key,windowsVirtualKeyCode:code});
  }
  async function tabTo(expression) {
    for (let step=0;step<70;step++) {
      if (await evaluate(expression)) return;
      await key('Tab');
    }
    assert.fail(`Controle não alcançável: ${expression}`);
  }
  const helpers = [
    ['.hud-action-glossary','screen-glossary','.glossary-close'],
    ['.hud-action-tutorial','screen-tutorial','.tut-skip-btn'],
    ['.hud-action-shortcuts','screen-shortcuts','#btn-shortcuts-close'],
    ['.hud-action-settings','screen-settings','[onclick="closeSettingsMenu()"]']
  ];
  async function openHelper(helper) {
    if (await evaluate("UI.getActiveScreen()==='screen-mission'")) {
      if (helper[1] === 'screen-glossary') {
        await tabTo("document.activeElement.id==='btn-mission-glossary'");
        await key('Enter');
      } else {
        await evaluate(`document.querySelector(${JSON.stringify(helper[0])}).click()`);
      }
      assert.equal(await evaluate('UI.getActiveScreen()'), helper[1]);
      return;
    }
    await tabTo(`document.activeElement.matches(${JSON.stringify(helper[0])})`);
    await key('Enter');
    assert.equal(await evaluate('UI.getActiveScreen()'), helper[1]);
  }
  async function closeHelper(helper) {
    await tabTo(`document.activeElement.matches(${JSON.stringify(helper[2])})`);
    await key('Enter');
  }
  async function missionFixture(type, difficulty = 'facil') {
    const room = type === 'memory' ? 'sala4' : 'sala1';
    await evaluate(`selectDifficulty('${difficulty}'); GameState.currentRoom='${room}'; Renderer.loadRoomBackground(); BugSystem.spawnBugs(); CollisionSystem.loadZones(); Player.resetToRoomStart(); UI.showScreen(null); GameState.activeIdx=GameState.bugs.findIndex(bug=>GameState.currentMissions()[bug.missionIdx].type==='${type}'); MissionSystem.startMission()`);
    return evaluate('GameState.currentMissions()[GameState.bugs[GameState.activeIdx].missionIdx]');
  }
  async function reveal(card) {
    await tabTo(`document.activeElement.dataset.cardId===${JSON.stringify(card.id)}`);
    await key('Enter');
  }
  async function checkHelpersPreserveMission() {
    const before = await evaluate('JSON.stringify({idx:GameState.activeIdx,mission:GameState.currentMissions()[GameState.bugs[GameState.activeIdx].missionIdx],score:GameState.score,solved:GameState.solvedCount})');
    for (const helper of helpers) {
      await openHelper(helper);
      assert.equal(await evaluate('GameState.isPaused'), true);
      await closeHelper(helper);
      assert.equal(await evaluate('UI.getActiveScreen()'), 'screen-mission');
      assert.equal(await evaluate('GameState.isPaused'), true);
      assert.equal(await evaluate('JSON.stringify({idx:GameState.activeIdx,mission:GameState.currentMissions()[GameState.bugs[GameState.activeIdx].missionIdx],score:GameState.score,solved:GameState.solvedCount})'),before,'Apoios preservam a missão, o gabarito e a pontuação');
      assert.ok(await evaluate("document.getElementById('screen-mission').contains(document.activeElement)"),'Foco volta à atividade');
    }
  }

  try {
    await send('Network.enable');
    await send('Network.setCacheDisabled',{cacheDisabled:true});
    await evaluate("localStorage.clear();localStorage.setItem('bh_tutorial_done','1');location.reload()");
    await wait(800);
    assert.equal(await evaluate("document.querySelector('.hud-panel').inert"), true, 'Apoios bloqueados antes de iniciar');

    await missionFixture('choice');
    assert.equal(await evaluate("document.querySelector('.hud-panel').inert"), false);
    assert.equal(await evaluate("document.getElementById('game-movement-region').inert"), true);
    assert.equal(await evaluate("document.getElementById('screen-mission').getAttribute('aria-modal')"),'false','Leitores de tela também alcançam os apoios');
    await checkHelpersPreserveMission();
    const originalIdx = await evaluate('GameState.activeIdx');
    for (const helper of [helpers[1],helpers[0],helpers[3],helpers[2]]) await openHelper(helper);
    await closeHelper(helpers[2]);
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-mission','Trocar de apoio também retorna à pergunta');
    assert.equal(await evaluate('GameState.activeIdx'),originalIdx);
    assert.equal(await evaluate('TutorialSystem.isActive()'),false,'Tutorial oculto não intercepta teclado');
    const x = await evaluate('Player.state.x');
    await key('d',80);
    assert.equal(await evaluate('Player.state.x'),x,'Consultar um apoio não libera movimento enquanto houver pergunta');

    const matching = await missionFixture('matching');
    const pair = matching.pairs[0];
    await tabTo(`document.activeElement.dataset.pairId===${JSON.stringify(pair.id)}`); await key('Enter');
    await tabTo(`document.activeElement.matches('.matching-target')&&document.activeElement.dataset.target===${JSON.stringify(pair.right)}`); await key('Enter');
    await checkHelpersPreserveMission();
    assert.equal(await evaluate("document.querySelectorAll('.matching-source.linked').length"),1,'Ligação permanece após consultar os quatro apoios');

    for (const difficulty of ['facil','medio','dificil']) {
      const memory = await missionFixture('memory',difficulty);
      assert.equal(memory.cards.length,{facil:6,medio:8,dificil:10}[difficulty]);
      assert.ok(await evaluate("[...document.querySelectorAll('.memory-card')].every(button=>button.textContent.startsWith('?'))"),'Cartas começam fechadas');
      const first = memory.cards[0];
      const wrong = memory.cards.find(card=>card.pairId!==first.pairId);
      await reveal(first);
      await checkHelpersPreserveMission();
      assert.equal(await evaluate("document.querySelectorAll('.memory-card.revealed').length"),1,'Carta aberta permanece após os apoios');
      await reveal(wrong);
      if (difficulty === 'dificil') {
        assert.equal(await evaluate('document.activeElement.id'),'btn-next');
        assert.equal(await evaluate('GameState.score'),0,'Primeiro erro encerra a memória difícil');
        await checkHelpersPreserveMission();
        await missionFixture('memory',difficulty);
        const freshMemory = await evaluate('GameState.currentMissions()[GameState.bugs[GameState.activeIdx].missionIdx]');
        for (const pair of freshMemory.pairs) for (const card of freshMemory.cards.filter(card=>card.pairId===pair.id)) await reveal(card);
        assert.equal(await evaluate('GameState.score'),5);
        console.log('OK: memória difícil, primeiro erro e partida perfeita preservam acesso aos apoios');
        continue;
      }
      assert.equal(await evaluate('document.activeElement.id'),'btn-memory-cover');
      await wait(400);
      assert.equal(await evaluate("document.querySelectorAll('.memory-card.revealed').length"),2,'Leitura das cartas não depende de tempo');
      await openHelper(helpers[0]); await closeHelper(helpers[0]);
      assert.equal(await evaluate('document.activeElement.id'),'btn-memory-cover');
      assert.equal(await evaluate('GameState.score'),0,'Erros não pontuam');
      await key('Enter');
      assert.equal(await evaluate("document.querySelectorAll('.memory-card.revealed').length"),0);
      for (const pair of memory.pairs) for (const card of memory.cards.filter(card=>card.pairId===pair.id)) await reveal(card);
      assert.equal(await evaluate('GameState.score'),5);
      assert.equal(await evaluate('GameState.solvedCount'),1);
      assert.equal(await evaluate('document.activeElement.id'),'btn-next');
      await evaluate("document.querySelectorAll('.memory-card').forEach(card=>card.click())");
      assert.equal(await evaluate('GameState.score'),5,'Memória pontua uma única vez');
      await checkHelpersPreserveMission();
      console.log(`OK: memória ${difficulty}, erros, retomada com cartas abertas e pontuação única`);
    }

    await evaluate("selectDifficulty('facil');GameState.currentRoom='sala1';Renderer.loadRoomBackground();BugSystem.spawnBugs();CollisionSystem.loadZones();Player.resetToRoomStart();HUD.update();UI.showScreen(null)");
    const directions = [['w','y',-1],['a','x',-1],['s','y',1],['d','x',1],['ArrowUp','y',-1],['ArrowLeft','x',-1],['ArrowDown','y',1],['ArrowRight','x',1]];
    for (let i=0;i<directions.length;i++) {
      const helper = helpers[i%helpers.length];
      await evaluate('Player.state.x=500;Player.state.y=420;GameState.popupCooldown=9999');
      await openHelper(helper);await closeHelper(helper);
      assert.equal(await evaluate('document.activeElement.id'), 'game-movement-input', 'Retorno ao mapa recebe as teclas de movimento');
      const [direction,axis,sign]=directions[i];
      const before=await evaluate(`Player.state.${axis}`);
      await key(direction,100);
      assert.ok((await evaluate(`Player.state.${axis}`)-before)*sign>0,`${direction} retoma o movimento sem clique`);
      assert.equal(await evaluate('document.activeElement.id'),'game-movement-input');
    }
    console.log('OK: todos os apoios fecham por Tab/Enter e WASD/setas retomam o movimento');

    for (const viewport of [{width:1440,height:900},{width:390,height:844},{width:844,height:390}]) {
      await send('Emulation.setDeviceMetricsOverride',{...viewport,deviceScaleFactor:1,mobile:false});
      await missionFixture('memory'); await wait(100);
      const buttons = await evaluate("[...document.querySelectorAll('.hud-action-btn')].map(button=>{const r=button.getBoundingClientRect();return {visible:r.width>=30&&r.height>=30&&!button.closest('[inert]'),top:document.elementFromPoint(r.x+r.width/2,r.y+r.height/2)?.closest('.hud-action-btn')===button};})");
      assert.ok(buttons.every(button=>button.visible&&button.top),'Barra acessível e sem sobreposição durante a pergunta');
      assert.equal(await evaluate("document.querySelectorAll('.hud-action-btn').length"),4);
      if (viewport.width<=900) for (const helper of helpers) {
        await openHelper(helper); await wait(120);
        assert.ok(await evaluate(`document.querySelector('#${helper[1]} .popup-content').getBoundingClientRect().top >= document.querySelector('.hud-panel').getBoundingClientRect().bottom`),`${helper[1]} fica abaixo da barra de apoios`);
        await closeHelper(helper);
      }
      await evaluate("UI.showScreen(null); GameState.activeIdx=0; Player.state.x=GameState.bugs[0].x-Player.state.hitboxOffsetX; Player.state.y=GameState.bugs[0].y-Player.state.hitboxOffsetY; UI.showScreen('screen-bug-popup')");
      const badge = await evaluate("(() => { const button=document.querySelector('.bug-btn-fix').getBoundingClientRect();const badge=document.querySelector('.bug-toast-actions .menu-key-badge').getBoundingClientRect(); return {separate:badge.bottom<=button.top,width:document.getElementById('screen-bug-popup').getBoundingClientRect().width}; })()");
      assert.ok(badge.separate,'Enter fica acima do botão Corrigir Bug');
      assert.ok(badge.width>=300&&badge.width<=340.5,`Aviso um pouco mais largo e dentro da tela: ${badge.width}`);
    }
    console.log('OK: barra durante perguntas e aviso de bug em computador, retrato e paisagem');
  } finally { socket.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
