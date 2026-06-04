/* ============================================================
   assets/js/systems/audio.js
   Sistema de áudio — Bug Hunters
   Música ambiente + efeitos + passos usando Web Audio API.
   Não precisa de mp3/wav.
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
    master: 0.85,
    background: 0.65,
    buttons: 0.75,
    backgroundEnabled: true,
    buttonsEnabled: true
  };

  const TRACKS = {
    menu: {
      base: 98,
      filter: 1250,
      noise: 0.035,
      pulse: 0.10,
      melody: [392, 494, 587, 494, 392, 330, 370, 494]
    },
    sala1: {
      base: 82,
      filter: 900,
      noise: 0.038,
      pulse: 0.08,
      melody: [246, 293, 329, 293, 246, 220, 246, 329]
    },
    sala2: {
      base: 110,
      filter: 1150,
      noise: 0.034,
      pulse: 0.12,
      melody: [330, 392, 440, 523, 440, 392, 330, 294]
    },
    sala3: {
      base: 65,
      filter: 760,
      noise: 0.046,
      pulse: 0.06,
      melody: [196, 247, 294, 247, 220, 196, 175, 220]
    },
    sala4: {
      base: 132,
      filter: 1350,
      noise: 0.032,
      pulse: 0.14,
      melody: [392, 523, 659, 784, 659, 523, 494, 587]
    },
    victory: {
      base: 164,
      filter: 1450,
      noise: 0.018,
      pulse: 0.12,
      melody: [523, 659, 784, 1046, 784, 659, 523, 659]
    },
    gameover: {
      base: 55,
      filter: 520,
      noise: 0.040,
      pulse: 0.05,
      melody: [196, 175, 147, 123, 110, 98, 82, 73]
    }
  };

  const state = {
    ctx: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,
    currentTrack: null,
    currentName: "menu",
    unlocked: false,
    melodyTimer: null,
    melodyIndex: 0,
    lastStepTime: 0,
    stepSide: 0,
    master: readNumber(STORAGE.master, DEFAULTS.master),
    background: readNumber(STORAGE.background, DEFAULTS.background),
    buttons: readNumber(STORAGE.buttons, DEFAULTS.buttons),
    backgroundEnabled: readBoolean(STORAGE.backgroundEnabled, DEFAULTS.backgroundEnabled),
    buttonsEnabled: readBoolean(STORAGE.buttonsEnabled, DEFAULTS.buttonsEnabled)
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

    applyVolumes(true);
    return ctx;
  }

  async function unlock() {
    const ctx = ensureContext();
    if (!ctx) return false;

    if (ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (error) {
        console.warn("[GameAudio] O navegador ainda bloqueou o áudio:", error);
        return false;
      }
    }

    state.unlocked = true;
    applyVolumes();

    if (state.backgroundEnabled && !state.currentTrack) {
      startTrack(state.currentName || "menu");
    }

    return true;
  }

  function applyVolumes(immediate = false) {
    if (!state.ctx) return;

    const now = state.ctx.currentTime;
    const set = (gain, value, time) => {
      if (!gain) return;
      if (immediate) gain.gain.setValueAtTime(value, now);
      else gain.gain.setTargetAtTime(value, now, time);
    };

    set(state.masterGain, state.master, 0.03);
    set(state.musicGain, state.backgroundEnabled ? state.background : 0, 0.08);
    set(state.sfxGain, state.buttonsEnabled ? state.buttons : 0, 0.02);
  }

  function createNoiseBuffer(ctx, seconds = 2) {
    const length = Math.max(1, Math.floor(ctx.sampleRate * seconds));
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.18;
    }

    return buffer;
  }

  function stopTrack(fade = 0.18) {
    if (state.melodyTimer) {
      clearInterval(state.melodyTimer);
      state.melodyTimer = null;
    }

    if (!state.currentTrack || !state.ctx) {
      state.currentTrack = null;
      return;
    }

    const ctx = state.ctx;
    const now = ctx.currentTime;
    const track = state.currentTrack;

    try {
      track.gain.gain.cancelScheduledValues(now);
      track.gain.gain.setValueAtTime(track.gain.gain.value || 0.0001, now);
      track.gain.gain.linearRampToValueAtTime(0.0001, now + fade);
    } catch (_) {}

    window.setTimeout(() => {
      track.sources.forEach(source => {
        try { source.stop(); } catch (_) {}
        try { source.disconnect(); } catch (_) {}
      });
      try { track.gain.disconnect(); } catch (_) {}
    }, Math.ceil((fade + 0.08) * 1000));

    state.currentTrack = null;
  }

  function startTrack(name = "menu") {
    state.currentName = name;

    const ctx = ensureContext();
    const data = TRACKS[name] || TRACKS.menu;

    if (!ctx || !state.backgroundEnabled) {
      stopTrack(0.08);
      return;
    }

    stopTrack(0.12);

    const trackGain = ctx.createGain();
    trackGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    trackGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 0.45);
    trackGain.connect(state.musicGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(data.filter, ctx.currentTime);
    filter.Q.setValueAtTime(0.9, ctx.currentTime);
    filter.connect(trackGain);

    const sources = [];
    const chord = [1, 1.25, 1.5, 2];

    chord.forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type = index === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(data.base * ratio, ctx.currentTime);
      osc.detune.setValueAtTime((index - 1.5) * 4, ctx.currentTime);

      gain.gain.setValueAtTime(0.050 / (index + 1), ctx.currentTime);
      lfo.type = "sine";
      lfo.frequency.setValueAtTime(data.pulse + index * 0.015, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.012, ctx.currentTime);

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

    noise.buffer = createNoiseBuffer(ctx, 2);
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
    startMelodyLoop(data);
  }

  function startMelodyLoop(data) {
    if (state.melodyTimer) clearInterval(state.melodyTimer);
    state.melodyIndex = 0;

    const playOneNote = () => {
      if (!state.ctx || !state.backgroundEnabled || !state.currentTrack) return;
      if (state.ctx.state !== "running") return;

      const melody = data.melody || TRACKS.menu.melody;
      const frequency = melody[state.melodyIndex % melody.length];
      state.melodyIndex++;

      playMusicNote(frequency, 0.18, 0.035);
    };

    state.melodyTimer = window.setInterval(playOneNote, 620);
    window.setTimeout(playOneNote, 220);
  }

  function playMusicNote(frequency, duration = 0.16, volume = 0.035) {
    const ctx = state.ctx;
    if (!ctx || !state.currentTrack) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "square";
    osc.frequency.setValueAtTime(frequency, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1450, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(state.currentTrack.gain);

    osc.start(now);
    osc.stop(now + duration + 0.04);
  }

  function getCurrentRoomName() {
    return window.GameState?.currentRoom || "sala1";
  }

  function ensureGameAmbient() {
    const room = getCurrentRoomName();
    if (!TRACKS[room] || !state.backgroundEnabled) return;
    if (state.currentName !== room || !state.currentTrack) startTrack(room);
  }

  function playMenuAmbient() {
    state.currentName = "menu";
    unlock().then(() => startTrack("menu"));
  }

  function playRoom(roomName) {
    const room = roomName || getCurrentRoomName();
    state.currentName = room;
    unlock().then(() => startTrack(room));
  }

  function playVictory() {
    state.currentName = "victory";
    unlock().then(() => startTrack("victory"));
    playConfirm();
  }

  function playGameOver() {
    state.currentName = "gameover";
    unlock().then(() => startTrack("gameover"));
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
      osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFrequency), now + duration);
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
    playTone({ frequency: 520, endFrequency: 920, duration: 0.055, type: "square", volume: 0.11 });
  }

  function playConfirm() {
    unlock();
    playTone({ frequency: 660, endFrequency: 990, duration: 0.12, type: "triangle", volume: 0.14 });
    window.setTimeout(() => playTone({ frequency: 990, duration: 0.10, type: "triangle", volume: 0.10 }), 90);
  }

  function playError() {
    unlock();
    playTone({ frequency: 180, endFrequency: 90, duration: 0.18, type: "sawtooth", volume: 0.13 });
  }

  function playFootstep(roomName = "sala1") {
    const ctx = ensureContext();
    if (!ctx || !state.buttonsEnabled || ctx.state !== "running") return;

    const now = ctx.currentTime;
    const roomStep = {
      sala1: { base: 145, noise: 0.030, filter: 420 },
      sala2: { base: 175, noise: 0.025, filter: 520 },
      sala3: { base: 120, noise: 0.035, filter: 360 },
      sala4: { base: 160, noise: 0.026, filter: 470 }
    }[roomName] || { base: 145, noise: 0.028, filter: 420 };

    const stepGain = ctx.createGain();
    const osc = ctx.createOscillator();
    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    state.stepSide = state.stepSide === 0 ? 1 : 0;

    stepGain.gain.setValueAtTime(0.0001, now);
    stepGain.gain.linearRampToValueAtTime(0.085, now + 0.012);
    stepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.115);

    osc.type = "triangle";
    osc.frequency.setValueAtTime(roomStep.base + (state.stepSide ? 16 : -10), now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(45, roomStep.base * 0.45), now + 0.09);

    noise.buffer = createNoiseBuffer(ctx, 0.15);
    noise.loop = false;
    noiseGain.gain.setValueAtTime(roomStep.noise, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

    noiseFilter.type = "lowpass";
    noiseFilter.frequency.setValueAtTime(roomStep.filter, now);
    noiseFilter.Q.setValueAtTime(0.6, now);

    osc.connect(stepGain);
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(stepGain);
    stepGain.connect(state.sfxGain);

    osc.start(now);
    noise.start(now);
    osc.stop(now + 0.12);
    noise.stop(now + 0.12);
  }

  function updateFootsteps(isMoving) {
    unlock();

    if (!isMoving) return;

    ensureGameAmbient();

    const nowMs = performance.now();
    const interval = 260;

    if (nowMs - state.lastStepTime < interval) return;

    state.lastStepTime = nowMs;
    playFootstep(getCurrentRoomName());
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
      unlock().then(() => startTrack(state.currentName || "menu"));
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

  function startAfterGesture() {
    unlock().then(() => {
      if (state.backgroundEnabled && !state.currentTrack) {
        startTrack(state.currentName || "menu");
      }
    });
  }

  document.addEventListener("click", event => {
    startAfterGesture();

    const button = event.target.closest("button, .cyber-btn, input[type='range']");
    if (!button || button.matches("input[type='range']")) return;

    playClick();
  }, true);

  document.addEventListener("pointerdown", startAfterGesture, true);
  document.addEventListener("keydown", startAfterGesture, true);

  document.addEventListener("DOMContentLoaded", () => {
    setupControls();
    state.currentName = "menu";
    syncControls();
  });

  return {
    unlock,
    playMenuAmbient,
    playRoom,
    playVictory,
    playGameOver,
    playClick,
    playConfirm,
    playError,
    playFootstep,
    updateFootsteps,
    ensureGameAmbient,
    setMaster,
    setBackgroundVolume,
    setButtonVolume,
    setBackgroundEnabled,
    setButtonsEnabled,
    toggleBackground,
    toggleButtons,
    syncControls,
    forceStart: () => startTrack(state.currentName || "menu"),
    getState: () => ({ ...state })
  };
})();
