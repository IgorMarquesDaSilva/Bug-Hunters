// Requer o jogo em 127.0.0.1:8000 e Chrome de testes na porta 9222.
const assert = require('node:assert/strict');

(async () => {
  const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
  const page = pages.find(page => page.type === 'page' && page.url.includes('127.0.0.1:8000'));
  assert.ok(page, 'Página do jogo disponível');
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  const pending = new Map();
  let id = 0;
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    message.error ? reject(message.error) : resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  async function key(key) {
    const code = key === 'Enter' ? 13 : 9;
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, text: key === 'Enter' ? '\r' : undefined, windowsVirtualKeyCode: code });
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, windowsVirtualKeyCode: code });
  }
  async function tabTo(expression) {
    for (let attempt = 0; attempt < 40; attempt++) {
      if (await evaluate(expression)) return;
      await key('Tab');
    }
    assert.fail(`Controle não alcançado pelo Tab: ${expression}`);
  }
  async function link(pair, target) {
    await tabTo(`document.activeElement.dataset.pairId === ${JSON.stringify(pair.id)}`);
    await key('Enter');
    await tabTo(`document.activeElement.matches('.matching-target') && document.activeElement.dataset.target === ${JSON.stringify(target)}`);
    await key('Enter');
  }

  try {
    await evaluate('localStorage.clear(); location.reload()');
    await new Promise(resolve => setTimeout(resolve, 800));
    await evaluate("localStorage.setItem('bh_tutorial_done', '1')");
    await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
    const fixtures = await evaluate("Object.entries(GameState.missionsData).flatMap(([difficulty, rooms]) => Object.entries(rooms).flatMap(([room, missions]) => missions.filter(mission => mission.type === 'matching').map(mission => ({ difficulty, room, mission }))))");
    assert.ok(fixtures.length >= 12);
    for (const [index, fixture] of fixtures.entries()) {
      const { difficulty, room, mission } = fixture;
      await evaluate(`selectDifficulty(${JSON.stringify(difficulty)}); GameState.currentRoom = ${JSON.stringify(room)}; GameState.missionSessions[${JSON.stringify(`${difficulty}:${room}`)}] = [${JSON.stringify(mission)}]; Renderer.loadRoomBackground(); BugSystem.spawnBugs(); GameState.activeIdx = 0; MissionSystem.startMission()`);
      assert.equal(await evaluate('document.activeElement.id'), 'mission-desc');
      if (index === 0) {
        assert.ok(await evaluate("(() => { TransitionSystem.play(() => {}); for(let frame=0; frame<125; frame++) TransitionSystem.update(); return !TransitionSystem.isActive() && GameState.isPaused && GameState.activeIdx === 0; })()"), 'Fim da transição preserva a pausa da atividade aberta');
      }
      assert.equal(await evaluate("document.getElementById('btn-confirm-matching').disabled"), true);
      // Uma resposta acionada antes do item orienta o jogador e não cria ligação.
      await tabTo("document.activeElement.matches('.matching-target')");
      await key('Enter');
      assert.equal(await evaluate("document.querySelectorAll('.matching-source.linked').length"), 0);
      assert.ok(await evaluate("document.activeElement.matches('.matching-source')"));

      const wrong = mission.targets.find(target => target !== mission.pairs[0].right);
      await link(mission.pairs[0], wrong);
      assert.equal(await evaluate('GameState.score'), 0);
      assert.equal(await evaluate('GameState.solvedCount'), 0);
      assert.equal(await evaluate("document.querySelectorAll('.matching-item.wrong').length"), 0, 'Não revela acerto antes da confirmação');
      assert.equal(await evaluate("document.getElementById('btn-confirm-matching').disabled"), true, 'Não permite confirmar uma ligação incompleta');
      // Corrigir o mesmo item deve substituir a ligação existente.
      const answerCorrectly = index % 3 !== 0;
      if (answerCorrectly) await link(mission.pairs[0], mission.pairs[0].right);
      for (const pair of mission.pairs.slice(1)) await link(pair, pair.right);
      assert.equal(await evaluate("document.querySelectorAll('.matching-lines line').length"), mission.pairs.length);
      assert.equal(await evaluate('document.activeElement.id'), 'btn-confirm-matching');
      assert.equal(await evaluate('GameState.score'), 0, 'Somente a confirmação pontua');
      await key('Enter');
      assert.equal(await evaluate('GameState.score'), answerCorrectly ? 5 : 0);
      assert.equal(await evaluate('GameState.solvedCount'), 1);
      assert.equal(await evaluate('document.activeElement.id'), 'btn-next');
      assert.equal(await evaluate("document.querySelectorAll('.matching-item:not(:disabled)').length"), 0);
      for (const pair of mission.pairs) {
        assert.ok(await evaluate(`document.getElementById('explanation-box').textContent.includes(${JSON.stringify(`${pair.left} → ${pair.right}`)})`), 'Feedback apresenta os pares corretos');
      }
      await evaluate("document.getElementById('btn-confirm-matching').click(); MissionSystem.startMission()");
      assert.equal(await evaluate('GameState.solvedCount'), 1, 'Resposta não pode ser enviada duas vezes');
    }
    console.log(`OK: ${fixtures.length} variantes de associação por Tab/Enter, correções, respostas reutilizadas e confirmação única`);

    // Todos os candidatos, inclusive objetos recém-adicionados, precisam ter
    // uma aproximação acessível sem atravessar uma zona de colisão.
    for (const room of ['sala1', 'sala2', 'sala3', 'sala4']) {
      await evaluate(`selectDifficulty('facil'); GameState.currentRoom = '${room}'; Renderer.loadRoomBackground(); BugSystem.spawnBugs(); CollisionSystem.loadZones(); Player.resetToRoomStart(); UI.showScreen(null); GameState.isPaused = true`);
      const result = await evaluate(`(() => {
        const map = document.getElementById('room-map');
        const canvas = document.getElementById('gameCanvas');
        const rect = map.getBoundingClientRect();
        const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
        const candidates = [...map.querySelectorAll('.${room}-mission')].map(el => {
          const r = el.getBoundingClientRect();
          return { name: el.className, x: (r.left-rect.left)*sx, y:(r.top-rect.top)*sy, w:r.width*sx, h:r.height*sy, reached:false };
        });
        const p = Player.state;
        const zones = GameState.collisionZones;
        const overlap = (a,b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;
        const visited = new Set();
        const queue = [[p.x,p.y]];
        const start = [...queue[0]];
        visited.add('0,0');
        for (let index=0; index<queue.length; index++) {
          const [x,y]=queue[index];
          const box={x:x+p.hitboxOffsetX,y:y+p.hitboxOffsetY,w:p.hitboxW,h:p.hitboxH};
          const range={x:box.x-10,y:box.y-10,w:box.w+20,h:box.h+20};
          candidates.forEach(candidate => { if(overlap(range,candidate)) candidate.reached=true; });
          for(const [dx,dy] of [[4,0],[-4,0],[0,4],[0,-4]]) {
            const nx=x+dx,ny=y+dy;
            const key=(nx-start[0])+','+(ny-start[1]);
            if(nx<0 || ny<0 || nx>canvas.width-p.drawW || ny>canvas.height-p.drawH || visited.has(key)) continue;
            visited.add(key);
            const next={...box,x:box.x+dx,y:box.y+dy};
            if(!zones.some(zone=>overlap(next,zone))) queue.push([nx,ny]);
          }
        }
        const layouts = new Set();
        for(let attempt=0;attempt<15;attempt++) {
          BugSystem.spawnBugs();
          const active=[...map.querySelectorAll('.mission-available')];
          if(active.length!==5) throw new Error('Cinco objetos devem estar destacados');
          layouts.add(active.map(el=>[...map.children].indexOf(el)).sort((a,b)=>a-b).join(','));
        }
        return {count:candidates.length,unreachable:candidates.filter(candidate=>!candidate.reached).map(candidate=>candidate.name),layouts:layouts.size};
      })()`);
      assert.ok(result.count > 5);
      assert.deepEqual(result.unreachable, [], `${room}: locais alcançáveis`);
      assert.ok(result.layouts > 1, 'Os locais dos bugs também variam');
      console.log(`OK: ${room}, ${result.count} locais alcançáveis e cinco bugs sorteados`);
    }

    // Verifica legibilidade e foco dos pares em fontes ampliadas e celular.
    for (const viewport of [{width:1440,height:900}, {width:390,height:844}, {width:844,height:390}]) {
      await send('Emulation.setDeviceMetricsOverride', { ...viewport, deviceScaleFactor:1, mobile:false });
      await evaluate("(() => { selectDifficulty('medio'); GameState.currentRoom='sala1'; Renderer.loadRoomBackground(); const fixture = GameState.missionsData.medio.sala1.find(mission => mission.sourceQuestion === 7); GameState.missionSessions['medio:sala1'] = [fixture]; BugSystem.spawnBugs(); GameState.activeIdx=0; MissionSystem.startMission(); })()");
      for (const family of ['default','arial']) {
        await evaluate(`document.querySelector('[data-font-family="${family}"]').click()`);
        for (const size of ['normal','large','giant']) {
          await evaluate(`AccessibilitySystem.setFontSize('${size}', false)`);
          const overflow = await evaluate("[...document.querySelectorAll('#matching-container button')].filter(el => el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1).map(el => el.textContent)");
          assert.deepEqual(overflow, [], `${viewport.width}/${family}/${size}: texto dos pares sem corte`);
        }
      }
      await tabTo("document.activeElement.matches('.matching-source')");
      const outline = await evaluate('getComputedStyle(document.activeElement).outlineWidth');
      assert.ok(parseFloat(outline) >= 2, 'Foco visível nos pares');
    }
    console.log('OK: pares sem corte, com foco visível, em três telas e nos seis tamanhos/fontes');
  } finally {
    socket.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
