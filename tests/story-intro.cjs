// Servidor 127.0.0.1:8000 e Chrome isolado com depuração na porta 9222.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

(async () => {
  const pages = await (await fetch('http://127.0.0.1:9222/json')).json();
  const page = pages.find(item => item.type === 'page' && item.url.includes('127.0.0.1:8000'));
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
  async function key(key, hold=0) {
    const code={Enter:13,Tab:9,Escape:27,ArrowRight:39}[key] || key.toUpperCase().charCodeAt(0);
    await send('Input.dispatchKeyEvent',{type:'keyDown',key,windowsVirtualKeyCode:code,text:key==='Enter'?'\r':undefined});
    if (hold) await wait(hold);
    await send('Input.dispatchKeyEvent',{type:'keyUp',key,windowsVirtualKeyCode:code});
  }
  async function tabTo(selector) {
    for(let i=0;i<60;i++) {
      if(await evaluate(`document.activeElement.matches(${JSON.stringify(selector)})`)) return;
      await key('Tab');
    }
    assert.fail(`Tab não alcançou ${selector}`);
  }
  async function reload() {
    await send('Page.reload',{ignoreCache:true});
    for(let i=0;i<300;i++) {
      await wait(50);
      try { if(await evaluate("typeof GameState!=='undefined' && !!GameState.missionsData && UI.getActiveScreen()==='screen-main-menu'")) return; } catch {}
    }
    assert.fail('Jogo carregou');
  }
  async function fresh() {
    await evaluate('localStorage.clear()');
    await reload();
    await key('Enter');await key('Enter');
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-tutorial');
  }
  const focus=()=>evaluate('document.activeElement.id');
  try {
    await send('Network.enable');await send('Network.setCacheDisabled',{cacheDisabled:true});
    await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false});
    await fresh();
    await key('Enter');
    const slide=await evaluate("document.getElementById('tut-step-counter').textContent");
    await tabTo('.hud-action-glossary');await key('Enter');await key('Escape');
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-tutorial','Consultar apoio no primeiro tutorial retorna ao tutorial');
    assert.equal(await evaluate("document.getElementById('tut-step-counter').textContent"),slide);
    await tabTo('#tut-btn-next');
    for(let i=0;i<11&&await evaluate("UI.getActiveScreen()==='screen-tutorial'");i++) await key('Enter');
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-intro','História somente após terminar o tutorial');
    assert.equal(await focus(),'intro-message');
    assert.equal(await evaluate('GameState.isPaused'),true);
    assert.equal(await evaluate("localStorage.getItem('bh_story_seen')"),'1');
    assert.equal(await evaluate("document.getElementById('btn-intro-read')"),null,'Opção Ouvir removida');
    const fullText=await evaluate("document.getElementById('intro-message').getAttribute('aria-label')");
    assert.ok(fullText.includes('Central de Controle'),'Leitor de tela recebe toda a fala');
    await evaluate('window.originalIntroKey=GameAudio.playDialogueKey;window.introSounds=0;GameAudio.playDialogueKey=()=>{introSounds++;originalIntroKey()}');
    const x=await evaluate('Player.state.x');await key('d',90);
    assert.equal(await evaluate('Player.state.x'),x,'Mensagem pausa a exploração');
    await wait(250);
    const partial=await evaluate("document.getElementById('intro-typed-text').textContent");
    assert.ok(partial.length>0&&partial.length<fullText.length,`Fala aparece aos poucos: ${partial.length}/${fullText.length} caracteres`);
    assert.ok(await evaluate('introSounds')>0,'Digitação chama o efeito de tecla');
    assert.equal(await evaluate("document.getElementById('intro-message').getAttribute('aria-label')"),fullText,'Nome acessível não muda a cada letra');
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-intro','Leitura sem avanço automático');
    if(process.env.BH_INTRO_SCREENSHOT_DIR){
      const image=await send('Page.captureScreenshot',{format:'png'});
      fs.writeFileSync(path.join(process.env.BH_INTRO_SCREENSHOT_DIR,'story-intro-typing-1440.png'),Buffer.from(image.data,'base64'));
    }
    await tabTo('.hud-action-glossary');await key('Enter');
    const pausedText=await evaluate("document.getElementById('intro-typed-text').textContent");
    const pausedSounds=await evaluate('introSounds');
    await wait(250);
    assert.equal(await evaluate("document.getElementById('intro-typed-text').textContent"),pausedText,'Apoios pausam a digitação');
    assert.equal(await evaluate('introSounds'),pausedSounds,'Apoios pausam o som da digitação');
    await key('Escape');
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-intro');
    assert.equal(await focus(),'btn-intro-start','Apoios retornam ao último controle percorrido na apresentação');
    await wait(180);
    assert.ok((await evaluate("document.getElementById('intro-typed-text').textContent.length"))>pausedText.length,'Fala continua de onde parou');
    await key('Escape');
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-intro','Escape não retoma o jogo');
    await tabTo('#intro-message');await key('Enter');
    assert.equal(await evaluate("document.getElementById('intro-typed-text').textContent"),fullText,'Enter no texto revela a fala inteira');
    assert.equal(await evaluate('GameState.isPaused'),true,'Terminar a fala mantém o jogo pausado');
    await tabTo('#btn-intro-start');await key('Enter');
    assert.equal(await focus(),'gameCanvas');
    assert.equal(await evaluate('GameState.isPaused'),false);
    const finalSounds=await evaluate('introSounds');await wait(180);
    assert.equal(await evaluate('introSounds'),finalSounds,'Som não continua após Vamos nessa');
    await evaluate('GameAudio.playDialogueKey=originalIntroKey');
    await key('a',100);assert.ok(await evaluate('Player.state.x')<x,'Movimento volta sem clique');

    await evaluate("GameAudio.setBackgroundEnabled(false);window.introOscillators=0;window.introAudioContext=GameAudio.getState().ctx;window.originalIntroOscillator=introAudioContext.createOscillator;introAudioContext.createOscillator=function(...args){introOscillators++;return originalIntroOscillator.apply(this,args)};GameAudio.setButtonsEnabled(false);GameAudio.playDialogueKey()");
    assert.equal(await evaluate('introOscillators'),0,'Efeitos desativados não geram tecla');
    await evaluate('GameAudio.setButtonsEnabled(true);GameAudio.setMaster(0);GameAudio.playDialogueKey()');
    assert.equal(await evaluate('introOscillators'),0,'Volume zero é respeitado');
    await evaluate('GameAudio.setMaster(0.8);GameAudio.playDialogueKey()');
    assert.equal(await evaluate('introOscillators'),1,'Efeito de tecla gera o oscilador quando habilitado');
    await evaluate('introAudioContext.createOscillator=originalIntroOscillator;GameAudio.setBackgroundEnabled(true)');
    await evaluate("selectDifficulty('medio')");
    assert.equal(await evaluate('UI.getActiveScreen()'),null,'Outra partida não repete a apresentação');
    await evaluate('TutorialSystem.open(true)');await key('Escape');
    assert.equal(await evaluate('UI.getActiveScreen()'),null,'Tutorial manual não repete a história');
    await reload();await key('Enter');await key('Enter');
    assert.equal(await evaluate('UI.getActiveScreen()'),null,'Preferência persiste ao recarregar');
    console.log('OK: digitação progressiva, som e volumes, leitor de tela, apoios, pausa até Vamos nessa, Tab/Enter e apresentação única');

    await evaluate("localStorage.clear();localStorage.setItem('bh_tutorial_done','1')");
    await reload();await key('Enter');await key('Enter');
    assert.equal(await evaluate('UI.getActiveScreen()'),null,'Visitante antigo não recebe a apresentação nova');
    await evaluate('TutorialSystem.open(true)');await key('Escape');
    assert.equal(await evaluate('UI.getActiveScreen()'),null);
    await fresh();await key('Escape');
    assert.equal(await evaluate('UI.getActiveScreen()'),'screen-intro','Pular tutorial também leva à missão apresentada pelo personagem');
    await key('Escape');assert.equal(await evaluate('UI.getActiveScreen()'),'screen-intro');
    await tabTo('#btn-intro-start');await key('Enter');assert.equal(await focus(),'gameCanvas');
    console.log('OK: visitantes antigos, tutorial pulado e encerramento pelo botão');

    for(const viewport of [{width:1440,height:900},{width:390,height:844},{width:844,height:390},{width:320,height:568}]) {
      await send('Emulation.setDeviceMetricsOverride',{...viewport,deviceScaleFactor:1,mobile:false});
      for(const font of ['default','arial'])for(const size of ['normal','large','giant']) {
        await evaluate(`UI.showScreen(null);localStorage.removeItem('bh_story_seen');AccessibilitySystem.setFontFamily('${font}',false);AccessibilitySystem.setFontSize('${size}',false);StoryIntro.open()`);
        await evaluate('StoryIntro.complete()');
        await wait(100);
        assert.ok(await evaluate("(()=>{const panel=document.querySelector('.intro-panel'),message=document.getElementById('intro-message');return panel.scrollWidth<=panel.clientWidth+1&&message.scrollWidth<=message.clientWidth+1;})()"),`Textos sem corte ${viewport.width}/${font}/${size}`);
        if(viewport.width<=900) assert.ok(await evaluate("document.querySelector('.intro-panel').getBoundingClientRect().top>=document.querySelector('.hud-panel').getBoundingClientRect().bottom-1"),'Diálogo abaixo dos apoios');
        assert.ok(await evaluate("(()=>{const screen=document.getElementById('screen-intro'),panel=document.querySelector('.intro-panel'),bubble=document.querySelector('.intro-dialogue'),message=document.getElementById('intro-message'),shade=getComputedStyle(document.getElementById('game-container'),'::after');return getComputedStyle(screen).backgroundImage==='none'&&getComputedStyle(panel).backgroundColor==='rgba(0, 0, 0, 0)'&&parseFloat(getComputedStyle(panel).borderTopWidth)===0&&message.clientHeight>20&&shade.backgroundColor==='rgba(0, 0, 0, 0.42)'&&Number(shade.zIndex)<Number(getComputedStyle(screen).zIndex)&&getComputedStyle(document.querySelector('.hud-panel')).filter==='brightness(0.58)'&&document.querySelectorAll('.intro-action').length===1&&bubble.contains(document.getElementById('btn-intro-start'));})()"),'Personagem e balão destacados acima do cenário e HUD escurecidos');
        assert.equal(await evaluate("parseFloat(getComputedStyle(document.getElementById('intro-message')).fontSize)"),15*(font==='default'?0.75:1)*({normal:1,large:1.5,giant:2}[size]),'Fonte ligeiramente menor e preferências preservadas');
        const corner=await evaluate(`(()=>{const screen=document.getElementById('screen-intro').getBoundingClientRect();const frame=${viewport.width<=900?'{left:0,bottom:innerHeight}':"document.getElementById('game-container').getBoundingClientRect()"};return {left:screen.left-frame.left,bottom:frame.bottom-screen.bottom};})()`);
        assert.ok(corner.left>=0&&corner.left<=24&&corner.bottom>=0&&corner.bottom<=24,`Diálogo ancorado no canto inferior esquerdo: ${JSON.stringify(corner)}`);
        if(font==='default'&&size==='normal'&&process.env.BH_INTRO_SCREENSHOT_DIR){
          const image=await send('Page.captureScreenshot',{format:'png'});
          fs.writeFileSync(path.join(process.env.BH_INTRO_SCREENSHOT_DIR,`story-intro-${viewport.width}.png`),Buffer.from(image.data,'base64'));
        }
        await tabTo('#btn-intro-start');await key('Enter');assert.equal(await focus(),'gameCanvas');
      }
      console.log(`OK: apresentação em ${viewport.width}x${viewport.height}, duas fontes e três tamanhos`);
    }
    await evaluate("localStorage.removeItem('bh_story_seen');AccessibilitySystem.setHighContrast(true,false);StoryIntro.open()");
    assert.equal(await evaluate("getComputedStyle(document.getElementById('screen-intro')).backgroundColor"),'rgba(0, 0, 0, 0)','Alto contraste preserva a transparência ao redor do personagem');
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.intro-dialogue')).borderTopColor"),'rgb(255, 255, 255)');
    await tabTo('#btn-intro-start');await key('Enter');assert.equal(await focus(),'gameCanvas');
    console.log('OK: balão com alto contraste e cenário visível');

    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
    await evaluate("localStorage.removeItem('bh_story_seen');StoryIntro.open()");
    assert.ok(await evaluate("document.getElementById('intro-typed-text').textContent.length")<fullText.length,'Digitação mantém a fala progressiva mesmo com movimento reduzido');
    assert.equal(await evaluate("getComputedStyle(document.querySelector('.intro-avatar')).animationName"),'none','Movimento reduzido desativa a flutuação do personagem');
    await tabTo('#intro-message');await key('Enter');
    assert.equal(await evaluate("document.getElementById('intro-typed-text').textContent"),fullText,'Enter permite dispensar a espera');
    assert.equal(await evaluate('GameState.isPaused'),true);
    await tabTo('#btn-intro-start');await key('Enter');
    await send('Emulation.setEmulatedMedia',{features:[]});

    await evaluate("localStorage.removeItem('bh_story_seen');StoryIntro.open()");
    const deadline=Date.now()+25000;
    while(Date.now()<deadline&&await evaluate("document.getElementById('intro-message').classList.contains('is-typing')")) await wait(100);
    assert.equal(await evaluate("document.getElementById('intro-typed-text').textContent"),fullText,'Fala termina naturalmente sem cortar o texto');
    assert.equal(await evaluate('GameState.isPaused'),true,'Fim da digitação não libera o personagem');
    await tabTo('#btn-intro-start');await key('Enter');
    await evaluate("localStorage.removeItem('bh_story_seen');StoryIntro.open();UI.showMainMenu()");
    const cancelled=await evaluate("document.getElementById('intro-typed-text').textContent");
    await wait(200);
    assert.equal(await evaluate("document.getElementById('intro-typed-text').textContent"),cancelled,'Trocar de tela cancela a digitação pendente');
    console.log('OK: movimento reduzido, fim natural da fala e limpeza de temporizadores');
  } finally {socket.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
