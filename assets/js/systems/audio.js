/* ============================================================
   assets/js/systems/audio.js
   Sistema de áudio procedural — Bug Hunters

   Não depende de arquivos .mp3/.wav. O som é gerado pelo próprio
   navegador com Web Audio API, então funciona direto no projeto.
============================================================ */

window.GameAudio = (() => {
  const STORAGE = {
    master: "bugHunters.audio.master",
    background: "bugHunters.audio.background",
    buttons: "bugHunters.audio.buttons",
    backgroundEnabled: "bugHunters.audio.backgroundEnabled",
    buttonsEnabled: "bugHunters.audio.buttonsEnabled"
  };

  const DEFAULTS = {
    master: 0.8,
    background: 0.45,
    buttons: 0.7,
    backgroundEnabled: true,
    buttonsEnabled: true
  };

  const state = {
    ctx: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    currentTrack: null,
    currentName: "none",
    unlocked: false,
    master: readNumber(STORAGE.master, DEFAULTS.master),
    background: readNumber(STORAGE.background, DEFAULTS.background),
    buttons: readNumber(STORAGE.buttons, DEFAULTS.buttons),
    backgroundEnabled: readBoolean(STORAGE.backgroundEnabled, DEFAULTS.backgroundEnabled),
    buttonsEnabled: readBoolean(STORAGE.buttonsEnabled, DEFAULTS.buttonsEnabled)
  };

  const TRACKS = {
    menu:  { base: 96,  chord: [1, 1.5, 2.01], filter: 850,  noise: 0.020, pulse: 0.070 },
    sala1: { base: 82,  chord: [1, 1.25, 1.5],  filter: 650,  noise: 0.026, pulse: 0.060 },
    sala2: { base: 110, chord: [1, 1.33, 1.66], filter: 980,  noise: 0.024, pulse: 0.085 },
    sala3: { base: 64,  chord: [1, 1.41, 1.89], filter: 520,  noise: 0.034, pulse: 0.052 },
    sala4: { base: 132, chord: [1, 1.5, 1.875],filter: 1150, noise: 0.022, pulse: 0.095 },
    victory: { base: 164, chord: [1, 1.25, 1.5, 2], filter: 1300, noise: 0.016, pulse: 0.10 },
    gameover:{ base: 55,  chord: [1, 1.18, 1.41], filter: 430,  noise: 0.030, pulse: 0.045 }
  };

  function readNumber(key, fallback) {
    const value = Number(localStorage.getItem(key));
    return Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : fallback;
  }

  function readBoolean(key, fallback) {
    const value = localStorage.getItem(key);
    if (value === null) return fallback;
    return value === "true";
  }

  function ensureContext() {
    if (state.ctx) return state.ctx;

    const AudioContext = window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      console.warn("[GameAudio] Web Audio API não disponível neste navegador.");
      return null;
    }

    const ctx = new AudioContext();

    state.ctx = ctx;
    state.masterGain = ctx.createGain();
    state.musicGain = ctx.createGain();
    state.sfxGain = ctx.createGain();

    state.musicGain.connect(state.masterGain);
    state.sfxGain.connect(state.masterGain);
    state.masterGain.connect(ctx.destination);

    applyVolumes();
    return ctx;
  }

  async function unlock() {
    const ctx = ensureContext();
    if (!ctx) return;

    if (ctx.state === "suspended") {
      try { await ctx.resume(); } catch (_) {}
    }

    state.unlocked = true;
    applyVolumes();

    if (state.currentName !== "none" && !state.currentTrack && state.backgroundEnabled) {
      startTrack(state.currentName);
    }
  }

  function applyVolumes() {
    if (!state.ctx) return;

    state.masterGain.gain.setTargetAtTime(state.master, state.ctx.currentTime, 0.03);
    state.musicGain.gain.setTargetAtTime(
      state.backgroundEnabled ? state.background : 0,
      state.ctx.currentTime,
      0.08
    );
    state.sfxGain.gain.setTargetAtTime(
      state.buttonsEnabled ? state.buttons : 0,
      state.ctx.currentTime,
      0.02
    );
  }

  function createNoiseBuffer(ctx) {
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.16;
    }

    return buffer;
  }

  function stopTrack(fade = 0.18) {
    if (!state.currentTrack || !state.ctx) {
      state.currentTrack = null;
      return;
    }

    const now = state.ctx.currentTime;
    const track = state.currentTrack;

    try {
      track.gain.gain.cancelScheduledValues(now);
      track.gain.gain.setValueAtTime(track.gain.gain.value, now);
      track.gain.gain.linearRampToValueAtTime(0.0001, now + fade);
    } catch (_) {}

    window.setTimeout(() => {
      [...track.sources].forEach(source => {
        try { source.stop(); } catch (_) {}
        try { source.disconnect(); } catch (_) {}
      });
      try { track.gain.disconnect(); } catch (_) {}
    }, Math.ceil((fade + 0.05) * 1000));

    state.currentTrack = null;
  }

  function startTrack(name) {
    state.currentName = name;

    const data = TRACKS[name] || TRACKS.menu;
    const ctx = ensureContext();

    if (!ctx || !state.backgroundEnabled) {
      stopTrack();
      return;
    }

    stopTrack(0.12);

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    trackGain.gain.linearRampToValueAtTime(0.72, ctx.currentTime + 0.45);
    trackGain.connect(state.musicGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(data.filter, ctx.currentTime);
    filter.Q.setValueAtTime(0.8, ctx.currentTime);
    filter.connect(trackGain);

    const sources = [];

    data.chord.forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = index === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(data.base * ratio, ctx.currentTime);
      osc.detune.setValueAtTime((index - 1) * 3, ctx.currentTime);

      gain.gain.setValueAtTime(0.024 / (index + 1), ctx.currentTime);
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(data.pulse + index * 0.013, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.010, ctx.currentTime);

      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(filter);

      osc.start();
      lfo.start();
      sources.push(osc, lfo);
    });

    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noise.buffer = createNoiseBuffer(ctx);
    noise.loop = true;
    noiseGain.gain.setValueAtTime(data.noise, ctx.currentTime);
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(data.filter * 0.65, ctx.currentTime);
    noiseFilter.Q.setValueAtTime(0.9, ctx.currentTime);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(trackGain);
    noise.start();
    sources.push(noise);

    state.currentTrack = { gain: trackGain, sources };
    applyVolumes();
  }

  function playMenuAmbient() {
    unlock();
    startTrack("menu");
  }

  function playRoom(roomName) {
    unlock();
    startTrack(roomName || "sala1");
  }

  function playVictory() {
    unlock();
    startTrack("victory");
    playConfirm();
  }

  function playGameOver() {
    unlock();
    startTrack("gameover");
    playError();
  }

  function playTone({ frequency = 440, duration = 0.08, type = "square", volume = 0.18, endFrequency = null } = {}) {
    const ctx = ensureContext();
    if (!ctx || !state.buttonsEnabled) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    if (endFrequency) {
      osc.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(state.sfxGain);

    osc.start(now);
    osc.stop(now + duration + 0.025);
  }

  function playClick() {
    unlock();
    playTone({ frequency: 520, endFrequency: 920, duration: 0.055, type: "square", volume: 0.10 });
  }

  function playConfirm() {
    unlock();
    playTone({ frequency: 660, endFrequency: 990, duration: 0.12, type: "triangle", volume: 0.14 });
    setTimeout(() => playTone({ frequency: 990, duration: 0.10, type: "triangle", volume: 0.10 }), 90);
  }

  function playError() {
    unlock();
    playTone({ frequency: 180, endFrequency: 90, duration: 0.18, type: "sawtooth", volume: 0.13 });
  }

  function setMaster(value) {
    state.master = Math.min(1, Math.max(0, Number(value)));
    localStorage.setItem(STORAGE.master, String(state.master));
    applyVolumes();
    syncControls();
  }

  function setBackgroundVolume(value) {
    state.background = Math.min(1, Math.max(0, Number(value)));
    localStorage.setItem(STORAGE.background, String(state.background));
    applyVolumes();
    syncControls();
  }

  function setButtonVolume(value) {
    state.buttons = Math.min(1, Math.max(0, Number(value)));
    localStorage.setItem(STORAGE.buttons, String(state.buttons));
    applyVolumes();
    syncControls();
  }

  function setBackgroundEnabled(enabled) {
    state.backgroundEnabled = Boolean(enabled);
    localStorage.setItem(STORAGE.backgroundEnabled, String(state.backgroundEnabled));

    if (state.backgroundEnabled) {
      startTrack(state.currentName === "none" ? "menu" : state.currentName);
    } else {
      stopTrack(0.1);
    }

    applyVolumes();
    syncControls();
  }

  function setButtonsEnabled(enabled) {
    state.buttonsEnabled = Boolean(enabled);
    localStorage.setItem(STORAGE.buttonsEnabled, String(state.buttonsEnabled));
    applyVolumes();
    syncControls();
  }

  function toggleBackground() {
    setBackgroundEnabled(!state.backgroundEnabled);
  }

  function toggleButtons() {
    const next = !state.buttonsEnabled;
    setButtonsEnabled(next);
    if (next) playConfirm();
  }

  function pct(value) {
    return `${Math.round(value * 100)}%`;
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function setPressed(id, pressed) {
    const el = document.getElementById(id);
    if (el) el.setAttribute("aria-pressed", String(Boolean(pressed)));
  }

  function syncControls() {
    const master = document.getElementById("master-volume-control");
    const background = document.getElementById("background-volume-control");
    const buttons = document.getElementById("button-volume-control");

    if (master) master.value = Math.round(state.master * 100);
    if (background) background.value = Math.round(state.background * 100);
    if (buttons) buttons.value = Math.round(state.buttons * 100);

    setText("master-volume-value", pct(state.master));
    setText("background-volume-value", pct(state.background));
    setText("button-volume-value", pct(state.buttons));

    setText("toggle-background-sound", state.backgroundEnabled ? "REMOVER SOM DE FUNDO" : "ATIVAR SOM DE FUNDO");
    setText("toggle-button-sound", state.buttonsEnabled ? "REMOVER SOM DOS BOTÕES" : "ATIVAR SOM DOS BOTÕES");

    setPressed("toggle-background-sound", state.backgroundEnabled);
    setPressed("toggle-button-sound", state.buttonsEnabled);
  }

  function setupControls() {
    syncControls();

    const master = document.getElementById("master-volume-control");
    const background = document.getElementById("background-volume-control");
    const buttons = document.getElementById("button-volume-control");
    const toggleBg = document.getElementById("toggle-background-sound");
    const toggleBtn = document.getElementById("toggle-button-sound");

    if (master) {
      master.addEventListener("input", event => setMaster(Number(event.target.value) / 100));
    }

    if (background) {
      background.addEventListener("input", event => setBackgroundVolume(Number(event.target.value) / 100));
    }

    if (buttons) {
      buttons.addEventListener("input", event => setButtonVolume(Number(event.target.value) / 100));
    }

    if (toggleBg) {
      toggleBg.addEventListener("click", () => {
        toggleBackground();
        if (state.backgroundEnabled) playConfirm();
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener("click", toggleButtons);
    }
  }

  document.addEventListener("click", event => {
    const button = event.target.closest("button, .cyber-btn, input[type='range']");
    if (!button) return;

    if (button.matches("input[type='range']")) return;

    playClick();
  }, true);

  document.addEventListener("pointerdown", unlock, { once: true });
  document.addEventListener("keydown", unlock, { once: true });
  document.addEventListener("DOMContentLoaded", setupControls);

  return {
    unlock,
    playMenuAmbient,
    playRoom,
    playVictory,
    playGameOver,
    playClick,
    playConfirm,
    playError,
    setMaster,
    setBackgroundVolume,
    setButtonVolume,
    setBackgroundEnabled,
    setButtonsEnabled,
    toggleBackground,
    toggleButtons,
    syncControls,
    getState: () => ({ ...state })
  };
})();
