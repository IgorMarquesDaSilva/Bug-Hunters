// Integração: servidor 127.0.0.1:8000 e Chrome isolado na porta 9222.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
  const page = pages.find(page => page.type === 'page' && page.url.includes('127.0.0.1:8000'));
  assert.ok(page);
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, {once:true}));
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const task = pending.get(message.id);
    pending.delete(message.id);
    message.error ? task.reject(message.error) : task.resolve(message.result);
  });
  const send = (method, params={}) => new Promise((resolve,reject) => {
    pending.set(++sequence,{resolve,reject});
    socket.send(JSON.stringify({id:sequence,method,params}));
  });
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate',{expression,returnByValue:true});
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  const wait = ms => new Promise(resolve=>setTimeout(resolve,ms));
  async function until(expression, message, timeout=15000) {
    const end = Date.now()+timeout;
    while (Date.now()<end) { if(await evaluate(expression)) return; await wait(40); }
    assert.fail(message);
  }
  async function key(key) {
    const code={Enter:13,Tab:9,Escape:27}[key];
    await send('Input.dispatchKeyEvent',{type:'keyDown',key,windowsVirtualKeyCode:code,text:key==='Enter'?'\r':undefined});
    await send('Input.dispatchKeyEvent',{type:'keyUp',key,windowsVirtualKeyCode:code});
  }
  async function tabTo(id) {
    for(let i=0;i<70;i++) { if(await evaluate(`document.activeElement.id===${JSON.stringify(id)}`)) return; await key('Tab'); }
    assert.fail(`Tab não alcançou ${id}`);
  }
  async function fixture(difficulty='facil',room='sala1') {
    await evaluate(`selectDifficulty('${difficulty}');GameState.currentRoom='${room}';Renderer.loadRoomBackground();BugSystem.spawnBugs();CollisionSystem.loadZones();Player.resetToRoomStart();GameState.startRun();HUD.update();UI.showScreen(null);GameState.popupCooldown=999999`);
  }
  async function start(index) {
    await evaluate(`GameState.activeIdx=${index};MissionSystem.startMission()`);
    return evaluate('GameState.currentMissions()[GameState.bugs[GameState.activeIdx].missionIdx]');
  }
  async function flip(card) {
    const id=JSON.stringify(card.id);
    await evaluate(`document.querySelector('[data-card-id='+CSS.escape(${id})+']').focus()`);
    await key('Enter');
  }
  async function wrongPair(mission) {
    const first=mission.cards[0],second=mission.cards.find(card=>card.pairId!==first.pairId);
    await flip(first);await flip(second);
  }
  async function answer(index,correct) {
    const mission=await start(index);
    if(mission.type==='memory') {
      if(correct) for(const pair of mission.pairs) for(const card of mission.cards.filter(card=>card.pairId===pair.id)) await flip(card);
      else for(let error=1;error<=Math.max(1,mission.errorLimit);error++) {
        await wrongPair(mission);
        if(error<Math.max(1,mission.errorLimit)) await key('Enter');
      }
    } else if(mission.type==='matching') {
      await evaluate(`(() => {const mission=GameState.currentMissions()[GameState.bugs[GameState.activeIdx].missionIdx];mission.pairs.forEach((pair,i)=>{document.querySelector('[data-pair-id='+CSS.escape(pair.id)+']').click();const target=${correct}||i>0?pair.right:mission.targets.find(value=>value!==pair.right);[...document.querySelectorAll('.matching-target')].find(button=>button.dataset.target===target).click();});document.getElementById('btn-confirm-matching').click();})()`);
    } else await evaluate(`document.querySelectorAll('#choices-container .choice-btn')[${correct?mission.correct:(mission.correct+1)%mission.choices.length}].click()`);
    assert.equal(await evaluate("document.getElementById('feedback-msg').classList.contains('ok')"),correct);
    await key('Enter');
    await wait(145);
  }
  async function leaveRoom(last=false) {
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-room-clear');
    await key('Enter');
    await evaluate("GameState.portal.triggered=true;UI.showScreen('screen-next-level')");
    await key('Enter');
    assert.equal(await evaluate('TransitionSystem.isActive()'),true);
    if(last) assert.equal(await evaluate("document.querySelector('main.game-container').inert"),true,'Transição final bloqueia acionamentos repetidos');
    await until('!TransitionSystem.isActive()','Transição encerra inclusive após Game Over');
    await evaluate('GameState.popupCooldown=999999');
  }
  try {
    await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
    await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await evaluate("localStorage.clear();localStorage.setItem('bh_tutorial_done','1');location.reload()");
    await wait(120);
    await until("typeof GameAudio!=='undefined'&&typeof GameState!=='undefined'&&!!GameState.missionsData&&UI.getActiveScreen()==='screen-main-menu'",'Dados e áudio carregados antes do teste',15000);
    assert.equal(await evaluate('GameAudio.getState().buttons'),0.75,'Primeiro acesso usa o volume padrão de efeitos');
    assert.equal(await evaluate('GameAudio.getState().background'),0.65,'Primeiro acesso usa o volume padrão de fundo');

    for(const difficulty of ['facil','medio','dificil']) {
      await fixture(difficulty,'sala4');
      const index=await evaluate("GameState.bugs.findIndex(bug=>GameState.currentMissions()[bug.missionIdx].type==='memory')");
      const mission=await start(index);
      const limit={facil:4,medio:2,dificil:1}[difficulty];
      for(let error=1;error<=limit;error++) {
        await wrongPair(mission);
        assert.equal(await evaluate('GameState.solvedCount'),error===limit?1:0,'Missão só termina ao atingir o limite');
        if(error<limit) {
          assert.equal(await evaluate('document.activeElement.id'),'btn-memory-cover');
          await evaluate('Glossary.open()');await key('Escape');
          assert.equal(await evaluate('document.activeElement.id'),'btn-memory-cover');
          await key('Enter');
        }
      }
      assert.equal(await evaluate('document.activeElement.id'),'btn-next');
      assert.equal(await evaluate('GameState.score'),0);
      assert.equal(await evaluate("document.querySelectorAll('.memory-card:not(:disabled)').length"),0);
      await evaluate("document.querySelectorAll('.memory-card').forEach(button=>button.click())");
      assert.equal(await evaluate('GameState.solvedCount'),1,'Limite não registra duas respostas');
      console.log(`OK: memória ${difficulty}, limite ${limit}, erro encerra missão sem pontos`);
    }

    await fixture();
    for(let mission=0;mission<5;mission++) await answer(mission,mission===0);
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-room-retry');
    assert.equal(await evaluate('GameState.score'),5);
    const beforeRestart=await evaluate('GameState.elapsedTime()');
    await key('Enter');
    assert.equal(await evaluate('GameState.score'),0);
    assert.equal(await evaluate('MissionSystem.getPointsPerQuestion()'),4);
    assert.equal(await evaluate('GameState.totalRoomRestarts()'),1);
    assert.ok(await evaluate('GameState.elapsedTime()')>=beforeRestart);
    // Chamadas extras ao botão não consomem reinício nem apagam a tentativa nova.
    await evaluate('MissionSystem.restartCurrentRoom()');
    assert.equal(await evaluate('GameState.run.rooms.sala1.attempts.length'),2);
    const counts=[4,2,3,4];
    for(let room=0;room<4;room++) {
      for(let mission=0;mission<5;mission++) await answer(mission,mission<counts[room]);
      if(room===3) await evaluate("window.resultSoundEvents=[];window.originalResultSound=GameAudio.playResultReveal;GameAudio.playResultReveal=(total,index)=>{resultSoundEvents.push({total,index,visible:document.querySelectorAll('#screen-win .result-row:not([hidden])').length});originalResultSound(total,index)}");
      await leaveRoom(room===3);
    }
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-win');
    assert.equal(await evaluate('GameState.score'),61);
    const frozen=await evaluate('GameState.elapsedTime()');
    const summary=await evaluate('GameState.getRunSummary()');
    assert.deepEqual(summary.rooms.map(room=>room.correct),counts);
    assert.deepEqual(summary.rooms.map(room=>room.score),[16,10,15,20]);
    assert.equal(summary.rooms[0].discarded[0].score,5);
    assert.equal(summary.restarts,1);
    assert.equal(await evaluate("document.querySelector('#screen-win .results-actions').hidden"),true);
    let shown=await evaluate("document.querySelectorAll('#screen-win .result-row:not([hidden])').length");
    assert.equal(shown,0);
    const order=[];
    while(await evaluate("document.querySelector('#screen-win .results-actions').hidden")) {
      const count=await evaluate("document.querySelectorAll('#screen-win .result-row:not([hidden])').length");
      if(count!==shown){assert.equal(count,shown+1,'Resultados aparecem um por vez');shown=count;order.push(await evaluate("[...document.querySelectorAll('#screen-win .result-row:not([hidden]) .result-label')].at(-1).textContent"));}
      await wait(75);
    }
    assert.deepEqual(order,['FASE 1','FASE 2','FASE 3','FASE 4','TEMPO TOTAL','REINÍCIO DE FASE','PONTUAÇÃO TOTAL']);
    assert.deepEqual(await evaluate('resultSoundEvents'),Array.from({length:7},(_,index)=>({total:index===6,index,visible:index+1})),'Cada resultado toca exatamente ao aparecer; o total recebe o som final');
    await evaluate('GameAudio.playResultReveal=originalResultSound');
    assert.equal(await evaluate('GameState.elapsedTime()'),frozen,'Resumo não aumenta o tempo final');
    assert.equal(await evaluate("document.getElementById('final-score').textContent"),'61');
    assert.equal(await evaluate("GameAudio.getState().currentName"),'victory');
    console.log('OK: quatro fases, tentativa descartada, acertos válidos, 61 pontos e revelação sequencial com total ao final');

    if(process.env.BH_RESULTS_SCREENSHOT_DIR) {
      const png=await send('Page.captureScreenshot',{format:'png'});
      fs.writeFileSync(path.join(process.env.BH_RESULTS_SCREENSHOT_DIR,'results-desktop.png'),Buffer.from(png.data,'base64'));
    }
    await tabTo('final-menu');await key('Enter');
    assert.equal(await evaluate('TransitionSystem.isActive()'),true);
    await until('!TransitionSystem.isActive()','Menu após efeito de TV');
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-main-menu');
    assert.equal(await evaluate('GameState.elapsedTime()'),0);
    assert.equal(await evaluate('document.activeElement.id'),'btn-main-play');

    // Usar o reinício em uma fase esgota a permissão também nas fases seguintes.
    await fixture();
    await evaluate("GameState.roomRestarts.sala1=1;GameState.currentRoom='sala2';GameState.prepareRoomMissions();GameState.startRoomAttempt();BugSystem.spawnBugs();CollisionSystem.loadZones()");
    for(let mission=0;mission<5;mission++) await answer(mission,false);
    await until('!TransitionSystem.isActive()','Game Over finaliza transição');
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-gameover');
    const oldStartedAt=await evaluate('GameState.run.startedAt');
    await key('Enter'); // título revela tudo por teclado
    assert.equal(await evaluate("document.querySelector('#screen-gameover .results-actions').hidden"),false);
    await tabTo('gameover-replay');await key('Enter');
    assert.equal(await evaluate('TransitionSystem.isActive()'),true);
    await until('!TransitionSystem.isActive()','Nova partida após efeito de TV');
    assert.equal(await evaluate('GameState.isGameOver'),false);
    assert.equal(await evaluate('GameState.score'),0);
    assert.equal(await evaluate('GameState.totalRoomRestarts()'),0);
    assert.ok(await evaluate('GameState.run.startedAt')>oldStartedAt);
    assert.ok(await evaluate('GameState.elapsedTime()')<4000,'Nova partida conta apenas o tempo desde a nova escolha de dificuldade');
    assert.equal(await evaluate('document.activeElement.id'),'game-movement-input');
    console.log('OK: reinício único global, Game Over com resumo, Menu e Jogar novamente por teclado com efeito de TV e relógio novo');
  } finally {socket.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
