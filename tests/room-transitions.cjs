// Requer o jogo em 127.0.0.1:8000 e Chrome de testes na porta 9222.
// Captura pixels reais para detectar telas/reatores que escapem da transição.
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
    if (!message.id) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    message.error ? request.reject(message.error) : request.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  async function capture() {
    const rect = await evaluate("(() => { const r = document.getElementById('room-map').getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height,scale:1}; })()");
    return (await send('Page.captureScreenshot', { format: 'png', clip: rect, captureBeyondViewport: true })).data;
  }
  async function pixels(first, second = first, transmission = 1) {
    return evaluate(`(async () => {
      const load = base64 => new Promise(resolve => {
        const img = new Image(); img.onload = () => resolve(img); img.src = 'data:image/png;base64,' + base64;
      });
      const images = await Promise.all([load(${JSON.stringify(first)}), load(${JSON.stringify(second)})]);
      const bitmaps = images.map(img => {
        const surface = document.createElement('canvas'); surface.width = img.width; surface.height = img.height;
        const context = surface.getContext('2d'); context.drawImage(img, 0, 0);
        return context.getImageData(0, 0, surface.width, surface.height);
      });
      const [a,b] = bitmaps;
      let maximum = 0, error = 0, count = 0;
      for (let y=4; y<a.height-4; y++) for (let x=4; x<a.width-4; x++) {
        const offset = (y*a.width+x)*4;
        for (let channel=0; channel<3; channel++) {
          maximum = Math.max(maximum, a.data[offset+channel]);
          error += Math.abs(a.data[offset+channel] - b.data[offset+channel]*${transmission}); count++;
        }
      }
      return {maximum, meanError: error/count};
    })()`);
  }

  try {
    for (const viewport of [{width:1440,height:900}, {width:390,height:844}]) {
      await send('Emulation.setDeviceMetricsOverride', {...viewport, deviceScaleFactor:1, mobile:false});
      await evaluate("localStorage.setItem('bh_tutorial_done','1'); location.reload()");
      await new Promise(resolve => setTimeout(resolve, 800));
      // O teste controla os frames sem depender da velocidade do computador.
      await evaluate('window.requestAnimationFrame = () => 0');
      await new Promise(resolve => setTimeout(resolve, 80));
      await evaluate("selectDifficulty('facil'); GameState.currentRoom='sala1'; Renderer.loadRoomBackground(); BugSystem.spawnBugs(); GameState.score=100");
      assert.deepEqual(await evaluate("(() => { const map=document.getElementById('room-map').getBoundingClientRect(); const overlay=transitionCanvas.getBoundingClientRect(); return [Math.abs(map.x-overlay.x)<1,Math.abs(map.y-overlay.y)<1,Math.abs(map.width-overlay.width)<1,Math.abs(map.height-overlay.height)<1]; })()"), [true,true,true,true], 'Transição acompanha a escala e a posição do mapa');
      assert.equal(await evaluate('transitionCanvas.tabIndex'), -1, 'Camada visual não interfere na navegação por Tab');
      assert.equal(await evaluate("transitionCanvas.getAttribute('aria-hidden')"), 'true');
      assert.equal(await evaluate("getComputedStyle(transitionCanvas).pointerEvents"), 'none');

      for (const room of ['sala2','sala3','sala4']) {
        await evaluate(`MissionSystem.goToNextRoom(); for(let frame=0;frame<40 && GameState.currentRoom!=='${room}';frame++) TransitionSystem.update(); document.getAnimations().forEach(animation=>animation.pause()); draw()`);
        assert.equal(await evaluate('GameState.currentRoom'), room);
        assert.equal(await evaluate('TransitionSystem.isActive()'), true);
        const covered = await pixels(await capture());
        assert.ok(covered.maximum <= 2, `${room}: todos os elementos ficam escuros na troca (${covered.maximum})`);
        assert.equal(await evaluate('ctx.getImageData(5,5,1,1).data[3]'), 0, 'Canvas do personagem não recebe a transição');

        await evaluate('for(let frame=0;frame<70;frame++) TransitionSystem.update(); draw()');
        const transmission = await evaluate('1 - transitionCtx.getImageData(5,5,1,1).data[3]/255');
        assert.ok(transmission > 0 && transmission < 1, 'Clareamento está em andamento');
        const dimmed = await capture();
        await evaluate('for(let frame=0;frame<50;frame++) TransitionSystem.update(); draw()');
        assert.equal(await evaluate('TransitionSystem.isActive()'), false);
        assert.equal(await evaluate('transitionCtx.getImageData(5,5,1,1).data[3]'), 0, 'Camada fica transparente ao terminar');
        const restored = await capture();
        const comparison = await pixels(dimmed, restored, transmission);
        assert.ok(comparison.meanError < 2, `${room}: reator, telas e cenário clareiam juntos (${comparison.meanError})`);
        assert.ok((await pixels(restored)).maximum > 80, 'Cores normais reaparecem após a transição');
        console.log(`OK: ${room}, escurecimento completo e clareamento uniforme em ${viewport.width}px`);
      }
    }

    await evaluate("GameState.currentRoom='sala2'; Renderer.loadRoomBackground(); BugSystem.spawnBugs(); GameState.portal.visible=false; draw()");
    const outlinePixels = "[...document.querySelectorAll('#room-map .mission-available')].filter(point=>getComputedStyle(point).outlineStyle!=='none').map(point => { point.getAnimations().forEach(animation=>{animation.pause();animation.currentTime=600;}); const sample=document.createElement('canvas'); sample.width=sample.height=1; const paint=sample.getContext('2d'); paint.fillStyle=getComputedStyle(point).outlineColor; paint.fillRect(0,0,1,1); return [...paint.getImageData(0,0,1,1).data].slice(0,3); })";
    const colors = await evaluate(outlinePixels);
    assert.ok(colors.length>0);
    for (const [red,green,blue] of colors) assert.ok(red>green && red>blue && red>150, 'Sala 2 usa contornos vermelhos intensos');
    assert.equal(await evaluate("getComputedStyle(document.querySelector('#room-map .door')).boxShadow"), 'none');
    await evaluate('GameState.portal.visible=true; draw()');
    for (const time of [0,375,700]) {
      await evaluate(`document.querySelector('#room-map .door').getAnimations().forEach(animation=>{animation.pause();animation.currentTime=${time};})`);
      assert.equal(await evaluate("getComputedStyle(document.querySelector('#room-map .door')).boxShadow"), 'none', 'Porta liberada também permanece sem sombra');
    }
    console.log('OK: destaques vermelhos e porta sem sombra, fechada e liberada');
    await evaluate("GameState.currentRoom='sala3';Renderer.loadRoomBackground();BugSystem.spawnBugs();draw()");
    const military = await evaluate(outlinePixels);
    assert.ok(military.length>0);
    for (const [red,green,blue] of military) assert.ok(green>red&&green>blue&&green<150,'Sala 3 usa verde militar');
    console.log('OK: destaques verde militar na sala 3');
  } finally {
    await evaluate('location.reload()').catch(() => {});
    socket.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
