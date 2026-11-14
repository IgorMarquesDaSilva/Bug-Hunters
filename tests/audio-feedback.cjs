// Integração de áudio real: servidor :8000 e Chrome de testes em :9222.
// BH_AUDIO_BEFORE aponta opcionalmente para a versão anterior do sintetizador.
// BH_AUDIO_OUTPUT guarda WAVs e métricas para conferir a mixagem.
// BH_AUDIO_FOCUS=error verifica apenas o destaque do erro sobre a música.
// BH_AUDIO_FOCUS=alert verifica o arquivo e o popup real BUG DETECTADO.
// BH_AUDIO_FOCUS=feedback compara erro/acerto ao alerta e responde perguntas reais.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
  const page = pages.find(page => page.type === 'page' && page.url.includes('127.0.0.1:8000'));
  assert.ok(page);
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(resolve => socket.addEventListener('open', resolve, { once: true }));
  let sequence = 0;
  const pending = new Map();
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const task = pending.get(message.id);
    pending.delete(message.id);
    message.error ? task.reject(message.error) : task.resolve(message.result);
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    pending.set(++sequence, { resolve, reject });
    socket.send(JSON.stringify({ id: sequence, method, params }));
  });
  async function evaluate(expression) {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (result.exceptionDetails) throw Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  const source = fs.readFileSync('assets/js/systems/audio.js', 'utf8');
  const versions = process.env.BH_AUDIO_BEFORE
    ? [['before', fs.readFileSync(process.env.BH_AUDIO_BEFORE, 'utf8')], ['after', source]] : [['after', source]];
  const captures = {};
  async function record(version, script, kind, duration) {
    const capture = await evaluate(`(${async function (script, kind, duration) {
      const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
      const frame = document.createElement('iframe');
      frame.hidden = true;
      frame.allow = 'autoplay';
      document.body.append(frame);
      const win = frame.contentWindow;
      win.GameState = { currentRoom: 'sala1' };
      win.eval(script);
      const audio = win.GameAudio;
      const maximum = kind === 'mix' || kind === 'error-max' || kind === 'alert-max' || kind === 'correct-max';
      const errorMix = ['error-mix', 'error-max', 'error-disabled'].includes(kind);
      const correctMix = ['correct-mix', 'correct-max', 'correct-disabled'].includes(kind);
      const alertMix = ['alert-mix', 'alert-max', 'alert-disabled'].includes(kind);
      audio.setMaster(kind === 'muted' ? 0 : maximum ? 1 : 0.8);
      audio.setBackgroundVolume(maximum ? 1 : 0.65);
      audio.setButtonVolume(maximum ? 1 : 0.75);
      audio.setBackgroundEnabled(['music', 'mix', 'muted'].includes(kind) || errorMix || correctMix || alertMix);
      audio.setButtonsEnabled(!['error-disabled', 'correct-disabled', 'alert-disabled'].includes(kind));
      const intervals = [], timeouts = [];
      let ctx;
      try {
        await audio.unlock();
        ctx = audio.getState().ctx;
        if (ctx.state !== 'running') await ctx.resume();
        const stream = ctx.createMediaStreamDestination();
        (audio.getState().outputNode || audio.getState().masterGain).connect(stream);
        const fxMeter = ctx.createAnalyser(), musicMeter = ctx.createAnalyser();
        fxMeter.fftSize = musicMeter.fftSize = 1024;
        const fxSamples = new Float32Array(1024), musicSamples = new Float32Array(1024);
        let fxPower = 0, musicPower = 0, meterFrames = 0, minimumMusicGain = 1;
        let normalMusicGain;
        if (errorMix || alertMix) {
          audio.getState().sfxGain.connect(fxMeter);
          audio.getState().musicGain.connect(musicMeter);
        }
        const recorder = new MediaRecorder(stream.stream, { mimeType: 'audio/webm;codecs=opus' });
        const fxStream = ctx.createMediaStreamDestination();
        audio.getState().sfxGain.connect(fxStream);
        const fxRecorder = new MediaRecorder(fxStream.stream, { mimeType: 'audio/webm;codecs=opus' });
        const fxChunks = [];
        fxRecorder.ondataavailable = event => fxChunks.push(event.data);
        const fxCompleted = new Promise(resolve => { fxRecorder.onstop = resolve; });
        const chunks = [];
        recorder.ondataavailable = event => chunks.push(event.data);
        const completed = new Promise(resolve => { recorder.onstop = resolve; });
        await sleep(180);
        normalMusicGain = audio.getState().background * 2.8;
        fxRecorder.start();
        recorder.start();
        if (kind === 'music') audio.playRoom('sala1');
        if (kind === 'steps' || kind === 'mix') {
          audio.playFootstep('sala1');
          intervals.push(setInterval(() => audio.playFootstep('sala1'), 333));
        }
        if (kind === 'victory' || kind === 'mix' || kind === 'muted') audio.playVictory();
        if (kind === 'confirm') audio.playConfirm();
        if (kind === 'error') audio.playError();
        if (correctMix) {
          audio.playRoom('sala1');
          timeouts.push(setTimeout(() => audio.playCorrectAnswer ? audio.playCorrectAnswer() : audio.playConfirm(), 500));
        }
        if (alertMix) {
          audio.playRoom('sala1');
          timeouts.push(setTimeout(() => audio.playBugAlert(), 500));
          timeouts.push(setTimeout(() => audio.stopBugAlert(), 1900));
        }
        if (errorMix || alertMix) {
          if (errorMix) {
            audio.playRoom('sala1');
            timeouts.push(setTimeout(() => audio.playError(), 500));
          }
          const start = performance.now();
          intervals.push(setInterval(() => {
            const elapsed = performance.now() - start;
            if (elapsed < (alertMix ? 900 : 525) || elapsed > (alertMix ? 1750 : 700)) return;
            fxMeter.getFloatTimeDomainData(fxSamples); musicMeter.getFloatTimeDomainData(musicSamples);
            fxPower += fxSamples.reduce((sum, sample) => sum + sample * sample, 0) / 1024;
            musicPower += musicSamples.reduce((sum, sample) => sum + sample * sample, 0) / 1024;
            meterFrames++;
            const level = alertMix ? audio.getState().musicGain.gain.value / normalMusicGain
              : audio.getState().currentTrack.gain.gain.value;
            minimumMusicGain = Math.min(minimumMusicGain, level);
          }, 10));
        }
        if (kind === 'rows') {
          for (let i = 0; i < 7; i++) timeouts.push(setTimeout(() => audio.playResultReveal(i === 6, i), i * 550));
        }
        if (kind === 'mix') {
          timeouts.push(setTimeout(() => audio.playResultReveal(false, 2), 1100));
          timeouts.push(setTimeout(() => audio.playResultReveal(true, 6), 3000));
        }
        if (kind === 'muted') { audio.playFootstep(); audio.playResultReveal(true); audio.playError(); }
        await sleep(duration);
        intervals.forEach(clearInterval); timeouts.forEach(clearTimeout);
        recorder.stop();
        fxRecorder.stop();
        await Promise.all([completed, fxCompleted]);
        const decoded = await ctx.decodeAudioData(await new Blob(chunks, { type: recorder.mimeType }).arrayBuffer());
        const fxDecoded = await ctx.decodeAudioData(await new Blob(fxChunks, { type: fxRecorder.mimeType }).arrayBuffer());
        const fxData = fxDecoded.getChannelData(0);
        const windowSize = Math.round(fxDecoded.sampleRate * 0.2);
        let rollingPower = 0, highestPower = 0, fxActiveSamples = 0;
        for (let i = 0; i < fxData.length; i++) {
          rollingPower += fxData[i] * fxData[i];
          if (i >= windowSize) rollingPower -= fxData[i - windowSize] * fxData[i - windowSize];
          if (i >= windowSize - 1) highestPower = Math.max(highestPower, rollingPower / windowSize);
          if (Math.abs(fxData[i]) > 0.003) fxActiveSamples++;
        }
        const channel = decoded.getChannelData(0);
        let power = 0, peak = 0, activeSamples = 0;
        const block = Math.round(decoded.sampleRate * 0.025);
        for (let start = 0; start < channel.length; start += block) {
          let blockPower = 0;
          for (let i = start; i < Math.min(start + block, channel.length); i++) {
            const sample = channel[i];
            power += sample * sample; blockPower += sample * sample;
            peak = Math.max(peak, Math.abs(sample));
          }
          if (Math.sqrt(blockPower / block) > 0.003) activeSamples += block;
        }
        const rms = Math.sqrt(power / channel.length);
        const bytes = new Uint8Array(44 + channel.length * 2);
        const wav = new DataView(bytes.buffer);
        const text = (at, value) => [...value].forEach((char, i) => wav.setUint8(at + i, char.charCodeAt(0)));
        text(0, 'RIFF'); wav.setUint32(4, bytes.length - 8, true); text(8, 'WAVE'); text(12, 'fmt ');
        wav.setUint32(16, 16, true); wav.setUint16(20, 1, true); wav.setUint16(22, 1, true);
        wav.setUint32(24, decoded.sampleRate, true); wav.setUint32(28, decoded.sampleRate * 2, true);
        wav.setUint16(32, 2, true); wav.setUint16(34, 16, true); text(36, 'data'); wav.setUint32(40, channel.length * 2, true);
        channel.forEach((sample, i) => wav.setInt16(44 + i * 2, Math.round(Math.max(-1, Math.min(1, sample)) * 32767), true));
        let binary = '';
        for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
        return { rms, db: rms ? 20 * Math.log10(rms) : -120, peak,
          fxWindowDb: highestPower > 0 ? 10 * Math.log10(highestPower) : -120,
          fxActiveSeconds: fxActiveSamples / fxDecoded.sampleRate,
          ...(errorMix || alertMix ? { emphasisDb: fxPower ? 10 * Math.log10(fxPower / musicPower) : -120,
            meterFrames, minimumMusicGain, restoredMusicGain: alertMix
              ? audio.getState().musicGain.gain.value / normalMusicGain : audio.getState().currentTrack.gain.gain.value } : {}),
          ...(alertMix ? { alertLevel: audio.getState().alertGainNode?.gain.value ?? null,
            alertStopped: audio.getState().alertAudio?.paused ?? true } : {}),
          activeSeconds: activeSamples / decoded.sampleRate, wav: btoa(binary) };
      } finally {
        intervals.forEach(clearInterval); timeouts.forEach(clearTimeout);
        audio.setBackgroundEnabled(false);
        audio.stopBugAlert();
        if (ctx) await ctx.close();
        frame.remove();
      }
    }.toString()})(${JSON.stringify(script)},${JSON.stringify(kind)},${duration})`);
    const { wav, ...metrics } = capture;
    captures[`${version}-${kind}`] = metrics;
    if (process.env.BH_AUDIO_OUTPUT) fs.writeFileSync(path.join(process.env.BH_AUDIO_OUTPUT, `${version}-${kind}.wav`), Buffer.from(wav, 'base64'));
    console.log(`${version}/${kind}: ${metrics.db.toFixed(1)} dB RMS, pico ${metrics.peak.toFixed(3)}, duração ativa ${metrics.activeSeconds.toFixed(2)} s`);
    if (kind.startsWith('alert')) console.log(`  alerta: ganho ${metrics.alertLevel}, música ${metrics.minimumMusicGain.toFixed(3)} → ${metrics.restoredMusicGain.toFixed(3)}, destaque ${metrics.emphasisDb.toFixed(1)} dB`);
  }
  try {
    await send('Network.enable'); await send('Network.setCacheDisabled', { cacheDisabled: true });
    await evaluate("GameAudio.setMaster(0);localStorage.setItem('bh_tutorial_done','1')");
    if (process.env.BH_AUDIO_FOCUS === 'alert') {
      for (const [version, script] of versions) await record(version, script, 'alert-mix', 2600);
      await record('after', source, 'alert-max', 2600);
      await record('after', source, 'alert-disabled', 2600);
      for (const kind of ['alert-mix', 'alert-max']) {
        const result = captures[`after-${kind}`];
        assert.ok(Math.abs(result.alertLevel - 0.9) < 0.001, 'Arquivo de atenção tem volume forte com margem para os picos');
        assert.ok(result.emphasisDb > 6, `BUG DETECTADO acima da trilha: ${result.emphasisDb.toFixed(1)} dB`);
        assert.ok(result.peak < 0.99, 'Alerta não satura a saída');
        assert.ok(result.minimumMusicGain < 0.46 && result.minimumMusicGain > 0.44, 'Música abre espaço para o alerta');
        assert.ok(Math.abs(result.restoredMusicGain - 1) < 0.01, 'Fechar o aviso restaura o volume');
        assert.equal(result.alertStopped, true);
        console.log(`OK: ${kind}, alerta ${result.emphasisDb.toFixed(1)} dB acima da música`);
      }
      assert.equal(captures['after-alert-disabled'].emphasisDb, -120, 'Silenciar efeitos mantém o alerta mudo');
      assert.ok(Math.abs(captures['after-alert-disabled'].minimumMusicGain - 1) < 0.01, 'Sem efeitos, música não é reduzida');
      if (captures['before-alert-mix']) assert.ok(captures['after-alert-mix'].emphasisDb - captures['before-alert-mix'].emphasisDb > 25, 'Aviso ficou claramente mais presente que a versão de 4%');
      if (process.env.BH_AUDIO_OUTPUT) fs.writeFileSync(path.join(process.env.BH_AUDIO_OUTPUT, 'alert-metrics.json'), JSON.stringify(captures, null, 2));

      await send('Page.reload', { ignoreCache: true });
      const waitFor = async (expression, label) => {
        const end = Date.now() + 15000;
        while (Date.now() < end) {
          try { if (await evaluate(expression)) return; } catch {}
          await new Promise(resolve => setTimeout(resolve, 80));
        }
        assert.fail(label);
      };
      await waitFor("typeof GameAudio!=='undefined'&&Number.isInteger(GameAudio.getState().alertRequest)&&typeof GameState!=='undefined'&&!!GameState.missionsData",'Versão atual do áudio carregada');
      await evaluate("localStorage.setItem('bh_tutorial_done','1');selectDifficulty('facil');UI.showScreen(null);GameAudio.setMaster(0.8);GameAudio.setBackgroundVolume(0.65);GameAudio.setButtonVolume(0.75);GameAudio.setBackgroundEnabled(true);GameAudio.setButtonsEnabled(true);GameState.activeIdx=-1;GameState.popupCooldown=0;Player.state.x=-1000;Player.state.y=-1000;BugSystem.checkProximity();const target=GameState.bugs[0];window.alertSpot={x:target.x+target.w/2-Player.state.hitboxOffsetX,y:target.y+target.h/2-Player.state.hitboxOffsetY};Player.state.x=alertSpot.x;Player.state.y=alertSpot.y;BugSystem.checkProximity()");
      await waitFor("UI.getActiveScreen()==='screen-bug-popup'&&GameAudio.getState().alertAudio?.currentTime>0.3",'Alerta disparado por aproximação do personagem');
      assert.ok(Math.abs(await evaluate('GameAudio.getState().alertGainNode.gain.value')-0.9)<0.001);
      assert.equal(await evaluate('GameAudio.getState().alertActive'),true);
      assert.ok((await evaluate('decodeURI(GameAudio.getState().alertAudio.src)')).includes('Efeito sonoro Atenção.mp3'));
      await evaluate('Player.state.x=-1000;Player.state.y=-1000;BugSystem.checkProximity()');
      assert.equal(await evaluate('GameAudio.getState().alertAudio.paused'),true,'Afastar-se interrompe o som');
      await evaluate('GameState.activeIdx=-1;GameState.popupCooldown=0;Player.state.x=alertSpot.x;Player.state.y=alertSpot.y;BugSystem.checkProximity()');
      await waitFor('GameAudio.getState().alertAudio.currentTime>0.3','Alerta pode tocar novamente');
      await evaluate("document.getElementById('btn-bug-fix').focus()");
      await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',text:'\r',windowsVirtualKeyCode:13});
      await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',windowsVirtualKeyCode:13});
      assert.equal(await evaluate('UI.getActiveScreen()'),'screen-mission','Enter abre a pergunta real');
      assert.equal(await evaluate('GameAudio.getState().alertAudio.paused'),true,'Entrar na pergunta interrompe o som');
      await evaluate('(async()=>{await GameAudio.getState().ctx.suspend();GameAudio.playBugAlert();GameAudio.stopBugAlert()})()');
      await new Promise(resolve => setTimeout(resolve, 400));
      assert.equal(await evaluate('GameAudio.getState().alertAudio.paused'),true,'Reprodução pendente não reinicia depois de fechar');
      assert.equal(await evaluate('GameAudio.getState().alertActive'),false);
      assert.ok(Math.abs(await evaluate('GameAudio.getState().musicGain.gain.value')-0.65*2.8)<0.02);
      console.log('OK: popup BUG DETECTADO real, arquivo correto, afastamento, Enter e cancelamento do alerta');
      return;
    }
    if (process.env.BH_AUDIO_FOCUS === 'error') {
      for (const [kind, duration] of [['error', 800], ['error-mix', 1800], ['error-max', 1800], ['error-disabled', 1500], ['muted', 700]]) await record('after', source, kind, duration);
      for (const kind of ['error-mix', 'error-max']) {
        const result = captures[`after-${kind}`];
        assert.ok(result.meterFrames > 0);
        assert.ok(result.emphasisDb > 6, `Erro se destaca da música: ${kind}, ${result.emphasisDb.toFixed(1)} dB`);
        assert.ok(result.peak < 0.99, 'Aviso misturado à música não satura');
        assert.equal(result.restoredMusicGain, 1, 'Música volta ao nível normal');
        console.log(`OK: ${kind}, erro ${result.emphasisDb.toFixed(1)} dB acima da música durante o aviso`);
      }
      assert.equal(captures['after-error-disabled'].emphasisDb, -120, 'Efeitos desativados silenciam o erro');
      assert.equal(captures['after-error-disabled'].minimumMusicGain, 1, 'Sem efeitos, a trilha não é reduzida');
      assert.ok(captures['after-muted'].peak < 0.0001, 'Volume zero continua funcionando');
      if (process.env.BH_AUDIO_OUTPUT) fs.writeFileSync(path.join(process.env.BH_AUDIO_OUTPUT, 'error-metrics.json'), JSON.stringify(captures, null, 2));
      console.log('OK: aviso de erro, retorno da trilha e configurações de volume');
      return;
    }
    if (process.env.BH_AUDIO_FOCUS === 'feedback') {
      await record('reference', source, 'alert-mix', 2600);
      for (const [version, script] of versions) {
        await record(version, script, 'error-mix', 2200);
        await record(version, script, 'correct-mix', 2200);
      }
      await record('after', source, 'error-max', 2200);
      await record('after', source, 'correct-max', 2200);
      await record('after', source, 'correct-disabled', 1500);
      await record('after', source, 'muted', 700);
      const reference = captures['reference-alert-mix'].fxWindowDb;
      for (const kind of ['error-mix', 'correct-mix']) {
        const result = captures[`after-${kind}`];
        const difference = result.fxWindowDb - reference;
        assert.ok(Math.abs(difference) <= 3.5, `${kind} comparável ao BUG DETECTADO: diferença ${difference.toFixed(1)} dB`);
        assert.ok(result.fxActiveSeconds > 0.6, `${kind} sustentado, não só um clique`);
        if (captures[`before-${kind}`]) assert.ok(result.fxWindowDb - captures[`before-${kind}`].fxWindowDb > 4, `${kind} mais presente que antes`);
        console.log(`OK: ${kind}, ${difference.toFixed(1)} dB em relação ao alerta e ${result.fxActiveSeconds.toFixed(2)} s de sinal`);
      }
      for (const kind of ['error-max', 'correct-max']) assert.ok(captures[`after-${kind}`].peak < 0.99, 'Respostas com música no máximo não saturam');
      assert.ok(captures['after-correct-disabled'].fxWindowDb < -90, 'Efeitos desativados silenciam o acerto');
      assert.ok(captures['after-muted'].peak < 0.0001, 'Volume zero silencia todos os sinais');
      if (process.env.BH_AUDIO_OUTPUT) fs.writeFileSync(path.join(process.env.BH_AUDIO_OUTPUT, 'feedback-metrics.json'), JSON.stringify(captures, null, 2));
      await send('Page.reload', { ignoreCache: true });
      const end = Date.now() + 15000;
      let loaded = false;
      while (Date.now() < end) {
        try { loaded = await evaluate("typeof GameAudio!=='undefined'&&typeof GameAudio.playCorrectAnswer==='function'&&typeof GameState!=='undefined'&&!!GameState.missionsData"); } catch {}
        if (loaded) break;
        await new Promise(resolve => setTimeout(resolve, 80));
      }
      assert.ok(loaded, 'Versão atual de missão e áudio carregada');
      await evaluate("localStorage.setItem('bh_tutorial_done','1');selectDifficulty('facil');UI.showScreen(null);GameAudio.setMaster(0.8);GameAudio.setBackgroundVolume(0.65);GameAudio.setBackgroundEnabled(true);GameAudio.setButtonVolume(0.75);GameAudio.setButtonsEnabled(true);window.feedbackCalls=[];window.actualCorrectSound=GameAudio.playCorrectAnswer;window.actualErrorSound=GameAudio.playError;GameAudio.playCorrectAnswer=()=>{feedbackCalls.push('correct');actualCorrectSound()};GameAudio.playError=()=>{feedbackCalls.push('error');actualErrorSound()};window.feedbackMissions=GameState.bugs.map((bug,index)=>({bug,index})).filter(({bug})=>GameState.currentMissions()[bug.missionIdx].type==='choice').slice(0,2).map(item=>item.index)");
      const enter = async () => {
        await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',text:'\r',windowsVirtualKeyCode:13});
        await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',windowsVirtualKeyCode:13});
      };
      for (const [position, correct] of [[0,true],[1,false]]) {
        await evaluate(`GameState.activeIdx=feedbackMissions[${position}];MissionSystem.startMission();(()=>{const mission=GameState.currentMissions()[GameState.bugs[GameState.activeIdx].missionIdx];const choice=${correct}?mission.correct:(mission.correct+1)%mission.choices.length;document.querySelectorAll('#choices-container .choice-btn')[choice].focus()})()`);
        await enter();
        assert.equal(await evaluate("document.getElementById('feedback-msg').classList.contains('ok')"),correct);
        assert.equal(await evaluate('document.activeElement.id'),'btn-next');
        if (correct) await enter();
      }
      assert.deepEqual(await evaluate('feedbackCalls'),['correct','error'],'Perguntas reais acionam os novos sinais');
      await evaluate('GameAudio.playMenuAmbient()');
      await new Promise(resolve => setTimeout(resolve, 100));
      assert.equal(await evaluate('GameAudio.getState().feedback'),null,'Trocar de tela musical cancela o sinal pendente');
      console.log('OK: acerto/erro por Enter em perguntas reais, controles de volume e limpeza dos sinais');
      return;
    }
    for (const [version, script] of versions) {
      for (const [kind, duration] of [['music', 4500], ['steps', 2500], ['victory', 3400], ['rows', 4300]]) await record(version, script, kind, duration);
    }
    await record('after', source, 'confirm', 700);
    await record('after', source, 'mix', 4300);
    await record('after', source, 'muted', 700);
    if (captures['before-music']) {
      assert.ok(captures['after-music'].db - captures['before-music'].db > 6, 'Trilha claramente mais audível com os mesmos controles');
      assert.ok(captures['after-steps'].db - captures['before-steps'].db > 6, 'Passos claramente mais audíveis');
      assert.ok(captures['after-rows'].db - captures['before-rows'].db > 6, 'Revelação dos resultados mais audível');
      assert.ok(captures['after-victory'].activeSeconds > captures['before-victory'].activeSeconds * 2, 'Fanfarra maior que a celebração anterior');
    }
    assert.ok(captures['after-victory'].activeSeconds > captures['after-confirm'].activeSeconds * 4, 'Vitória possui uma fanfarra própria, distinta do acerto');
    assert.ok(captures['after-mix'].peak < 0.99, 'Mixagem no máximo mantém espaço sem saturar');
    assert.ok(captures['after-muted'].peak < 0.0001, 'Volume zero continua silenciando tudo');
    if (process.env.BH_AUDIO_OUTPUT) fs.writeFileSync(path.join(process.env.BH_AUDIO_OUTPUT, 'metrics.json'), JSON.stringify(captures, null, 2));

    await evaluate("GameAudio.setMaster(0.8);selectDifficulty('facil');GameState.currentRoom='sala3';Renderer.loadRoomBackground();BugSystem.spawnBugs();CollisionSystem.loadZones();Player.resetToRoomStart();UI.showScreen(null);GameAudio.playRoom('sala3');GameAudio.updateFootsteps(true)");
    await new Promise(resolve => setTimeout(resolve, 200));
    assert.equal(await evaluate('GameAudio.getState().currentName'), 'sala3', 'Andar preserva a música da sala atual');
    await evaluate("GameAudio.playVictory()");
    await new Promise(resolve => setTimeout(resolve, 120));
    assert.ok(await evaluate('GameAudio.getState().celebration.sources.size') > 10);
    await evaluate("GameAudio.playMenuAmbient()");
    await new Promise(resolve => setTimeout(resolve, 160));
    assert.equal(await evaluate('GameAudio.getState().celebration'), null, 'Menu cancela as notas futuras da vitória');
    assert.equal(await evaluate('GameAudio.getState().currentName'), 'menu');
    console.log('OK: mixagem, silêncio, identidade de cada sala e encerramento da fanfarra');
  } finally { socket.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
