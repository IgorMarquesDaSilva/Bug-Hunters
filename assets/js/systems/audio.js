
window.GameAudio = (() => {
  const STORAGE = {
    master: "bugHunters.audio.master",
    background: "bugHunters.audio.background",
    effects: "bugHunters.audio.effects",
    buttons: "bugHunters.audio.buttons",
    backgroundEnabled: "bugHunters.audio.backgroundEnabled",
    effectsEnabled: "bugHunters.audio.effectsEnabled",
    buttonsEnabled: "bugHunters.audio.buttonsEnabled"
  };

  const DEFAULTS = {
    master: 0.85,
    background: 0.65,
    effects: 0.75,
    buttons: 0.75,
    backgroundEnabled: true,
    effectsEnabled: true,
    buttonsEnabled: true
  };
  const MUSIC_LEVEL = 2.8;
  const BUG_ALERT_LEVEL = 0.9;
  const BUG_ALERT_MUSIC_FACTOR = 0.45;
  const volumeTargets = new WeakMap();

  const TRACKS = {
    menu: {
      bpm: 92,
      base: 98,
      filter: 1250,
      noise: 0.035,
      pulse: 0.10,
      melody: [392, 494, 587, 494, 392, 330, 370, 494]
    },

    sala1: {
      bpm: 96,
      base: 82,
      filter: 900,
      noise: 0.038,
      pulse: 0.08,
      melody: [246, 293, 329, 293, 246, 220, 246, 329]
    },

    sala2: {
      bpm: 104,
      base: 110,
      filter: 1150,
      noise: 0.034,
      pulse: 0.12,
      melody: [330, 392, 440, 523, 440, 392, 330, 294]
    },

    sala3: {
      bpm: 90,
      base: 65,
      filter: 760,
      noise: 0.046,
      pulse: 0.06,
      melody: [196, 247, 294, 247, 220, 196, 175, 220]
    },

    sala4: {
      bpm: 108,
      base: 132,
      filter: 1350,
      noise: 0.032,
      pulse: 0.14,
      melody: [392, 523, 659, 784, 659, 523, 494, 587]
    },

    victory: {
      bpm: 116,
      base: 130.8128,
      chord: [1, 2 ** (4 / 12), 2 ** (7 / 12), 2],
      filter: 1450,
      noise: 0.018,
      pulse: 0.12,
      melody: [523, 659, 784, 1046, 784, 659, 523, 659]
    },

    gameover: {
      bpm: 68,
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
    buttonsGain: null,
    outputNode: null,
    celebration: null,
    feedback: null,
    hitBuffer: null,
    currentTrack: null,
    currentName: "menu",
    unlocked: false,
    melodyTimer: null,
    melodyIndex: 0,
    lastStepTime: 0,
    stepSide: 0,

    // Áudio externo do alerta de bug
    alertAudio: null,
    alertAudioSource: null,
    alertGainNode: null,
    alertActive: false,
    alertRequest: 0,

    master: readNumber(STORAGE.master, DEFAULTS.master),
    background: readNumber(STORAGE.background, DEFAULTS.background),
    effects: readNumber(STORAGE.effects, readNumber(STORAGE.buttons, DEFAULTS.effects)),
    buttons: readNumber(STORAGE.buttons, DEFAULTS.buttons),
    effectsEnabled: readBoolean(
      STORAGE.effectsEnabled,
      readBoolean(STORAGE.buttonsEnabled, DEFAULTS.effectsEnabled)
    ),
    backgroundEnabled: readBoolean(
      STORAGE.backgroundEnabled,
      DEFAULTS.backgroundEnabled
    ),
    buttonsEnabled: readBoolean(
      STORAGE.buttonsEnabled,
      DEFAULTS.buttonsEnabled
    )
  };

  // O controle antigo dos botões também afetava os efeitos. Preserva essa
  // preferência uma única vez antes de tornar os dois ajustes independentes.
  for (const key of ['effects', 'effectsEnabled']) {
    if (localStorage.getItem(STORAGE[key]) === null) {
      localStorage.setItem(STORAGE[key], String(state[key]));
    }
  }

  function readNumber(key, fallback) {
    const stored = localStorage.getItem(key);
    if (stored === null) return fallback;
    const value = Number(stored);

    return Number.isFinite(value)
      ? Math.min(1, Math.max(0, value))
      : fallback;
  }

  function readBoolean(key, fallback) {
    const value = localStorage.getItem(key);

    if (value === null) return fallback;

    return value === "true";
  }

  function ensureContext() {
    if (state.ctx) return state.ctx;

    const AudioContext =
      window.AudioContext || window.webkitAudioContext;

    if (!AudioContext) {
      console.warn(
        "[GameAudio] Web Audio API não disponível neste navegador."
      );

      return null;
    }

    const ctx = new AudioContext();

    state.ctx = ctx;

    state.masterGain = ctx.createGain();
    state.musicGain = ctx.createGain();
    state.sfxGain = ctx.createGain();
    state.buttonsGain = ctx.createGain();

    state.musicGain.connect(state.masterGain);
    state.sfxGain.connect(state.masterGain);
    state.buttonsGain.connect(state.masterGain);
    // Mantém espaço para os ataques dos passos e os acordes da fanfarra.
    const output = ctx.createDynamicsCompressor();
    output.threshold.value = -6;
    output.knee.value = 4;
    output.ratio.value = 12;
    output.attack.value = 0.003;
    output.release.value = 0.16;
    state.masterGain.connect(output);
    output.connect(ctx.destination);
    state.outputNode = output;

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
        console.warn(
          "[GameAudio] O navegador ainda bloqueou o áudio:",
          error
        );

        return false;
      }
    }

    state.unlocked = true;

    applyVolumes();

    if (
      state.backgroundEnabled &&
      !state.currentTrack
    ) {
      startTrack(state.currentName || "menu");
    }

    return true;
  }

  function applyVolumes(immediate = false) {
    if (!state.ctx) return;

    const now = state.ctx.currentTime;

    const set = (gain, value, time) => {
      if (!gain) return;
      // Desbloquear o áudio a cada tecla não deve reiniciar a suavização,
      // sobretudo quando um efeito começa depois de um período de silêncio.
      if (!immediate && volumeTargets.get(gain) === value) return;
      volumeTargets.set(gain, value);

      if (immediate) {
        gain.gain.setValueAtTime(value, now);
      } else {
        gain.gain.setTargetAtTime(value, now, time);
      }
    };

    set(state.masterGain, state.master, 0.03);

    set(
      state.musicGain,
      state.backgroundEnabled
        ? state.background * MUSIC_LEVEL *
          (state.alertActive && state.effectsEnabled && state.effects > 0 && state.master > 0 ? BUG_ALERT_MUSIC_FACTOR : 1)
        : 0,
      0.08
    );

    set(
      state.sfxGain,
      state.effectsEnabled
        ? state.effects
        : 0,
      0.02
    );

    set(
      state.buttonsGain,
      state.buttonsEnabled
        ? state.buttons
        : 0,
      0.02
    );
  }

  function createNoiseBuffer(ctx, seconds = 2) {
    const length = Math.max(
      1,
      Math.floor(ctx.sampleRate * seconds)
    );

    const buffer = ctx.createBuffer(
      1,
      length,
      ctx.sampleRate
    );

    const data = buffer.getChannelData(0);

    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.18;
    }

    return buffer;
  }

  function watchSource(source, nodes, group = null) {
    group?.sources.add(source);
    source.onended = () => {
      source.disconnect();
      nodes.forEach(node => node.disconnect());
      if (!group) return;
      group.sources.delete(source);
      if ((group.celebration || group.feedback) && !group.sources.size) {
        group.gain.disconnect();
        if (state.celebration === group) state.celebration = null;
        if (state.feedback === group) state.feedback = null;
      }
    };
  }

  function stopCelebration() {
    const group = state.celebration;
    state.celebration = null;
    fadeOutSoundGroup(group);
  }

  function stopFeedback() {
    const group = state.feedback;
    state.feedback = null;
    fadeOutSoundGroup(group);
  }

  function fadeOutSoundGroup(group) {
    if (!group || !state.ctx) return;
    const now = state.ctx.currentTime;
    group.gain.gain.cancelScheduledValues(now);
    group.gain.gain.setValueAtTime(group.gain.gain.value, now);
    group.gain.gain.linearRampToValueAtTime(0, now + 0.04);
    group.sources.forEach(source => { try { source.stop(now + 0.05); } catch {} });
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

      track.gain.gain.setValueAtTime(
        track.gain.gain.value || 0.0001,
        now
      );

      track.gain.gain.linearRampToValueAtTime(
        0.0001,
        now + fade
      );
    } catch (_) {}

    window.setTimeout(() => {
      [...track.continuousSources, ...track.sources].forEach(source => {
        try {
          source.stop();
        } catch (_) {}

        try {
          source.disconnect();
        } catch (_) {}
      });

      try {
        track.gain.disconnect();
      } catch (_) {}
    }, Math.ceil((fade + 0.08) * 1000));

    state.currentTrack = null;
  }

  function startTrack(name = "menu") {
    stopCelebration();
    stopFeedback();
    state.currentName = name;

    const ctx = ensureContext();
    const data = TRACKS[name] || TRACKS.menu;

    if (!ctx || !state.backgroundEnabled) {
      stopTrack(0.08);
      return;
    }

    stopTrack(0.12);

    const trackGain = ctx.createGain();

    trackGain.gain.setValueAtTime(
      0.0001,
      ctx.currentTime
    );

    trackGain.gain.linearRampToValueAtTime(
      1.0,
      ctx.currentTime + 0.45
    );

    trackGain.connect(state.musicGain);

    const filter = ctx.createBiquadFilter();

    filter.type = "lowpass";

    filter.frequency.setValueAtTime(
      data.filter,
      ctx.currentTime
    );

    filter.Q.setValueAtTime(
      0.9,
      ctx.currentTime
    );

    filter.connect(trackGain);

    const sources = [];
    const chord = data.chord || [1, 1.25, 1.5, 2];

    chord.forEach((ratio, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();

      osc.type =
        index === 0
          ? "triangle"
          : "sine";

      osc.frequency.setValueAtTime(
        data.base * ratio,
        ctx.currentTime
      );

      osc.detune.setValueAtTime(
        (index - 1.5) * 4,
        ctx.currentTime
      );

      gain.gain.setValueAtTime(
        0.065 / (index + 1),
        ctx.currentTime
      );

      lfo.type = "sine";

      lfo.frequency.setValueAtTime(
        data.pulse + index * 0.015,
        ctx.currentTime
      );

      lfoGain.gain.setValueAtTime(
        0.008,
        ctx.currentTime
      );

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

    noiseGain.gain.setValueAtTime(
      data.noise * 0.7,
      ctx.currentTime
    );

    noiseFilter.type = "bandpass";

    noiseFilter.frequency.setValueAtTime(
      data.filter * 0.65,
      ctx.currentTime
    );

    noiseFilter.Q.setValueAtTime(
      0.9,
      ctx.currentTime
    );

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(trackGain);

    noise.start();

    sources.push(noise);

    state.currentTrack = {
      gain: trackGain,
      continuousSources: sources,
      sources: new Set()
    };

    applyVolumes();

    startMelodyLoop(data, state.currentTrack);
  }

  function startMelodyLoop(data, track) {
    clearInterval(state.melodyTimer);
    state.melodyIndex = 0;
    const subdivision = 60 / data.bpm / 2;
    let nextTime = state.ctx.currentTime + 0.12;
    let step = 0;
    // Agenda um pouco à frente no relógio de áudio para manter o pulso estável.
    const schedule = () => {
      if (state.currentTrack !== track || !state.backgroundEnabled) return;
      const now = state.ctx.currentTime;
      if (state.ctx.state !== 'running') { nextTime = now + 0.12; return; }
      if (nextTime < now) nextTime = now + 0.03;
      while (nextTime < now + 0.15) {
        const melodyIndex = Math.floor(step / 2) % data.melody.length;
        const phrase = step % 16;
        if (step % 2 === 0) {
          playMusicNote(data.melody[melodyIndex], subdivision * 1.15,
            phrase === 0 ? 0.074 : 0.062, { when: nextTime, track });
          state.melodyIndex++;
        } else if (phrase % 4 === 3) {
          playMusicNote(data.melody[melodyIndex] / 2, subdivision * 0.55, 0.022,
            { when: nextTime, track, type: 'triangle' });
        }
        if (phrase % 4 === 0) {
          const bass = data.base * (phrase === 8 ? 1.5 : 1);
          playMusicNote(bass, subdivision * 0.9, 0.075,
            { when: nextTime, track, type: 'triangle', cutoff: 700 });
        }
        if (step % 2 === 1) {
          playNoiseBurst({ when: nextTime, duration: 0.045, volume: 0.03,
            cutoff: 3300, filterType: 'highpass', target: track.gain, group: track });
        }
        if (phrase === 4 || phrase === 12) {
          playNoiseBurst({ when: nextTime, duration: 0.085, volume: 0.065,
            cutoff: 1300, target: track.gain, group: track });
        }
        step++;
        nextTime += subdivision;
      }
    };
    schedule();
    state.melodyTimer = window.setInterval(schedule, 50);
  }

  function playMusicNote(
    frequency,
    duration = 0.16,
    volume = 0.062,
    { when, track = state.currentTrack, type = 'square', cutoff = 1450 } = {}
  ) {
    const ctx = state.ctx;

    if (!ctx || !track) return;

    const now = when ?? ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = type;

    osc.frequency.setValueAtTime(
      frequency,
      now
    );

    filter.type = "lowpass";

    filter.frequency.setValueAtTime(
      cutoff,
      now
    );

    gain.gain.setValueAtTime(
      0.0001,
      now
    );

    gain.gain.linearRampToValueAtTime(
      volume,
      now + 0.015
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + duration
    );

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(track.gain);
    watchSource(osc, [filter, gain], track);

    osc.start(now);

    osc.stop(
      now + duration + 0.04
    );
  }

  function getCurrentRoomName() {
    return typeof GameState !== 'undefined' ? GameState.currentRoom : 'sala1';
  }

  function ensureGameAmbient() {
    const room = getCurrentRoomName();

    if (
      !TRACKS[room] ||
      !state.backgroundEnabled
    ) {
      return;
    }

    if (
      state.currentName !== room ||
      !state.currentTrack
    ) {
      startTrack(room);
    }
  }

  function playMenuAmbient() {
    state.currentName = "menu";

    unlock().then(() => {
      if (state.currentName === 'menu') startTrack("menu");
    });
  }

  function playRoom(roomName) {
    const room =
      roomName ||
      getCurrentRoomName();

    state.currentName = room;

    unlock().then(() => {
      if (state.currentName === room) startTrack(room);
    });
  }

  function playVictory() {
    state.currentName = "victory";
    unlock().then(() => {
      if (state.currentName !== 'victory') return;
      startTrack("victory");
      playVictoryFanfare();
    });
  }

  function playVictoryFanfare() {
    if (!state.effectsEnabled || !state.effects || !state.master) return;
    const ctx = ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const group = { gain: ctx.createGain(), sources: new Set(), celebration: true };
    group.gain.connect(state.sfxGain);
    state.celebration = group;
    // A trilha acompanha a entrada da fanfarra e cresce depois do acorde final.
    const music = state.currentTrack?.gain.gain;
    if (music) {
      music.cancelScheduledValues(now);
      music.setValueAtTime(0.0001, now);
      music.linearRampToValueAtTime(0.4, now + 0.1);
      music.setValueAtTime(0.4, now + 2.25);
      music.linearRampToValueAtTime(1, now + 3);
    }
    const melody = [
      [0, 523, 0.13], [0.16, 523, 0.13], [0.32, 659, 0.16],
      [0.52, 784, 0.22], [0.8, 1046, 0.42], [1.28, 784, 0.16],
      [1.48, 880, 0.16], [1.7, 988, 0.16], [1.95, 1046, 0.72]
    ];
    melody.forEach(([offset, frequency, duration]) => {
      playTone({ frequency, duration, volume: 0.24, type: 'triangle', when: now + offset, group });
      playTone({ frequency: frequency / 2, duration, volume: 0.075, type: 'square', when: now + offset, group });
    });
    [523, 659, 784].forEach(frequency => {
      playTone({ frequency, duration: 0.78, volume: 0.12, type: 'triangle', when: now + 1.95, group });
    });
    [0, 0.52, 0.8, 1.95].forEach(offset => {
      playTone({ frequency: 150, endFrequency: 50, duration: 0.18,
        volume: 0.28, type: 'sine', when: now + offset, group });
    });
    playNoiseBurst({ when: now + 0.8, duration: 0.25, volume: 0.23,
      cutoff: 2100, filterType: 'highpass', target: group.gain, group });
    playNoiseBurst({ when: now + 1.95, duration: 0.65, volume: 0.32,
      cutoff: 2300, filterType: 'highpass', target: group.gain, group });
  }

  function playResultReveal(total = false, index = 0) {
    const ctx = ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    if (!total) {
      const note = [784, 880, 988, 1046, 1174, 1318][Math.min(index, 5)];
      playTone({ frequency: note, duration: 0.065, type: 'square', volume: 0.2, when: now });
      playTone({ frequency: note * 1.5, duration: 0.16, type: 'triangle', volume: 0.23, when: now + 0.07 });
      return;
    }
    [784, 988, 1046].forEach((frequency, step) => {
      playTone({ frequency, duration: step === 2 ? 0.44 : 0.1,
        type: 'triangle', volume: 0.28, when: now + step * 0.09 });
    });
    [523, 659, 784].forEach(frequency => {
      playTone({ frequency, duration: 0.42, type: 'triangle', volume: 0.12, when: now + 0.18 });
    });
  }

  function playNoiseBurst({ when, duration, volume, cutoff, filterType = 'bandpass', target, group }) {
    const ctx = ensureContext();
    if (!ctx) return;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    state.hitBuffer ||= createNoiseBuffer(ctx, 0.8);
    source.buffer = state.hitBuffer;
    filter.type = filterType;
    filter.frequency.setValueAtTime(cutoff, when);
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(volume, when + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(target);
    watchSource(source, [filter, gain], group);
    source.start(when);
    source.stop(when + duration + 0.02);
  }

  function playDialogueKey() {
    if (!state.effectsEnabled || !state.master || !state.effects) return;
    const ctx = ensureContext();
    if (!ctx || ctx.state !== 'running') return;
    playTone({ frequency: 760 + Math.random() * 160, endFrequency: 360,
      duration: 0.025, type: 'square', volume: 0.06 });
  }

  function playGameOver() {
    state.currentName = "gameover";

    unlock().then(() => {
      startTrack("gameover");
    });

    playError();
  }

  function playTone({
    frequency = 440,
    duration = 0.08,
    type = "square",
    volume = 0.18,
    endFrequency = null,
    when = null,
    group = null,
    channel = "effects",
    hold = 0
  } = {}) {
    const ctx = ensureContext();

    if (
      !ctx ||
      !(channel === "buttons" ? state.buttonsEnabled : state.effectsEnabled)
    ) {
      return;
    }

    const now = when ?? ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;

    osc.frequency.setValueAtTime(
      frequency,
      now
    );

    if (endFrequency) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(1, endFrequency),
        now + duration
      );
    }

    gain.gain.setValueAtTime(
      0.0001,
      now
    );

    gain.gain.linearRampToValueAtTime(
      volume,
      now + 0.012
    );
    if (hold > 0) {
      gain.gain.setValueAtTime(volume, now + Math.min(duration - 0.001, 0.012 + hold));
    }

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + duration
    );

    osc.connect(gain);
    gain.connect(group?.gain || (channel === "buttons" ? state.buttonsGain : state.sfxGain));
    watchSource(osc, [gain], group);

    osc.start(now);

    osc.stop(
      now + duration + 0.025
    );
  }

  function playClick() {
    unlock();

    playTone({
      channel: "buttons",
      frequency: 520,
      endFrequency: 920,
      duration: 0.055,
      type: "square",
      volume: 0.11
    });
  }

  function playConfirm() {
    unlock();

    playTone({
      channel: "buttons",
      frequency: 660,
      endFrequency: 990,
      duration: 0.12,
      type: "triangle",
      volume: 0.14
    });

    window.setTimeout(() => {
      playTone({
        channel: "buttons",
        frequency: 990,
        duration: 0.10,
        type: "triangle",
        volume: 0.10
      });
    }, 90);
  }

  function makeRoomForFeedback(now, duration) {
    const music = state.currentTrack?.gain.gain;
    if (!music) return;
    const current = music.value;
    music.cancelScheduledValues(now);
    music.setValueAtTime(current, now);
    music.linearRampToValueAtTime(BUG_ALERT_MUSIC_FACTOR, now + 0.025);
    music.setValueAtTime(BUG_ALERT_MUSIC_FACTOR, now + duration);
    music.linearRampToValueAtTime(1, now + duration + 0.28);
  }

  function beginFeedback(now, duration) {
    stopFeedback();
    const group = { gain: state.ctx.createGain(), sources: new Set(), feedback: true };
    group.gain.connect(state.sfxGain);
    state.feedback = group;
    makeRoomForFeedback(now, duration);
    return group;
  }

  // Respostas têm corpo e duração próprios; os pequenos cliques de menu usam playConfirm.
  function playCorrectAnswer() {
    unlock().then(ready => {
      if (!ready || !state.effectsEnabled || !state.effects || !state.master) return;
      const now = state.ctx.currentTime;
      const group = beginFeedback(now, 0.74);
      playTone({ frequency: 660, duration: 0.34, hold: 0.21,
        type: 'triangle', volume: 0.6, when: now, group });
      playTone({ frequency: 330, duration: 0.34, hold: 0.19,
        type: 'sine', volume: 0.16, when: now, group });
      playTone({ frequency: 990, duration: 0.5, hold: 0.32,
        type: 'triangle', volume: 0.6, when: now + 0.24, group });
      playTone({ frequency: 1980, duration: 0.4, hold: 0.22,
        type: 'sine', volume: 0.12, when: now + 0.24, group });
    });
  }

  function playError() {
    unlock().then(ready => {
      if (!ready || !state.effectsEnabled || !state.effects || !state.master) return;
      const now = state.ctx.currentTime;
      const group = beginFeedback(now, 0.75);
      playTone({ frequency: 330, endFrequency: 220, duration: 0.32, hold: 0.2,
        type: 'square', volume: 0.42, when: now, group });
      playTone({ frequency: 165, endFrequency: 110, duration: 0.32, hold: 0.18,
        type: 'triangle', volume: 0.22, when: now, group });
      playTone({ frequency: 247, endFrequency: 147, duration: 0.48, hold: 0.32,
        type: 'square', volume: 0.42, when: now + 0.27, group });
      playTone({ frequency: 123.5, endFrequency: 73.5, duration: 0.48, hold: 0.3,
        type: 'triangle', volume: 0.24, when: now + 0.27, group });
    });
  }

  function playBugAlert() {
    const ctx = ensureContext();

    if (
      !ctx ||
      !state.effectsEnabled || !state.effects || !state.master
    ) {
      return;
    }
    if (state.alertActive && state.alertAudio && !state.alertAudio.paused) return;
    const request = ++state.alertRequest;
    state.alertActive = true;
    applyVolumes();
    const fail = error => {
      if (request !== state.alertRequest) return;
      stopBugAlert();
      console.warn('[GameAudio] Não foi possível reproduzir o alerta:', error);
    };

    const playAudio = () => {
      if (!state.alertActive || request !== state.alertRequest) return;
      // Cria o áudio e o nó de controle de volume na primeira vez
      if (!state.alertAudio) {
        state.alertAudio = new Audio(
          "assets/Audio/Efeito sonoro Atenção.mp3"
        );

        state.alertAudio.preload = "auto";
        state.alertAudio.loop = true;

        try {
          state.alertAudioSource =
            ctx.createMediaElementSource(
              state.alertAudio
            );

          // Cria um nó de ganho específico para ajustar a intensidade deste alerta
          state.alertGainNode = ctx.createGain();

          // Conecta: Áudio -> Ganho do Alerta -> Ganho dos Efeitos (SFX) -> Saída
          state.alertAudioSource.connect(
            state.alertGainNode
          );

          state.alertGainNode.connect(
            state.sfxGain
          );
        } catch (error) {
          fail(error);
          return;
        }
      }

      // Dá presença ao alerta com margem para os picos do arquivo. Os
      // controles de efeitos e volume geral continuam aplicados depois.
      if (state.alertGainNode) {
        state.alertGainNode.gain.setValueAtTime(BUG_ALERT_LEVEL, ctx.currentTime);
      }

      if (!state.alertAudio.paused) return;

      state.alertAudio.currentTime = 0;

      const playPromise =
        state.alertAudio.play();

      if (
        playPromise &&
        typeof playPromise.catch === "function"
      ) {
        playPromise.catch(fail);
      }
    };

    if (ctx.state === "suspended") {
      ctx.resume().then(playAudio).catch(fail);

      return;
    }

    playAudio();
  }

  function stopBugAlert() {
    state.alertActive = false;
    state.alertRequest++;
    if (state.alertAudio) {
      state.alertAudio.pause();
      state.alertAudio.currentTime = 0;
    }
    applyVolumes();
  }

  function playLevelComplete() {
    unlock();

    playTone({
      frequency: 523,
      duration: 0.12,
      type: "square",
      volume: 0.16
    });

    window.setTimeout(() => {
      playTone({
        frequency: 659,
        duration: 0.12,
        type: "square",
        volume: 0.16
      });
    }, 100);

    window.setTimeout(() => {
      playTone({
        frequency: 784,
        duration: 0.18,
        type: "square",
        volume: 0.18
      });
    }, 200);

    window.setTimeout(() => {
      playTone({
        frequency: 1046,
        duration: 0.30,
        type: "triangle",
        volume: 0.20
      });
    }, 300);
  }

  function playFootstep(
    roomName = "sala1"
  ) {
    const ctx = ensureContext();

    if (
      !ctx ||
      !state.effectsEnabled ||
      ctx.state !== "running"
    ) {
      return;
    }

    const now = ctx.currentTime;

    const roomStep = {
      sala1: {
        base: 145,
        noise: 0.055,
        filter: 420
      },

      sala2: {
        base: 175,
        noise: 0.050,
        filter: 520
      },

      sala3: {
        base: 120,
        noise: 0.060,
        filter: 360
      },

      sala4: {
        base: 160,
        noise: 0.052,
        filter: 470
      }
    }[roomName] || {
      base: 145,
      noise: 0.028,
      filter: 420
    };

    const stepGain =
      ctx.createGain();

    const osc =
      ctx.createOscillator();

    const noise =
      ctx.createBufferSource();

    const noiseGain =
      ctx.createGain();

    const noiseFilter =
      ctx.createBiquadFilter();
    const impact = ctx.createOscillator();
    const impactGain = ctx.createGain();

    state.stepSide =
      state.stepSide === 0
        ? 1
        : 0;

    stepGain.gain.setValueAtTime(
      0.0001,
      now
    );

    stepGain.gain.linearRampToValueAtTime(
      0.65,
      now + 0.012
    );

    stepGain.gain.exponentialRampToValueAtTime(0.12, now + 0.07);
    stepGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.15
    );

    osc.type = "triangle";

    osc.frequency.setValueAtTime(
      roomStep.base +
        (state.stepSide ? 16 : -10),
      now
    );

    osc.frequency.exponentialRampToValueAtTime(
      Math.max(
        45,
        roomStep.base * 0.45
      ),
      now + 0.09
    );

    noise.buffer =
      createNoiseBuffer(
        ctx,
        0.15
      );

    noise.loop = false;

    noiseGain.gain.setValueAtTime(
      roomStep.noise * 5,
      now
    );

    noiseGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + 0.09
    );

    noiseFilter.type = "bandpass";

    noiseFilter.frequency.setValueAtTime(
      roomStep.filter * 2.5,
      now
    );

    noiseFilter.Q.setValueAtTime(
      0.6,
      now
    );

    osc.connect(stepGain);
    // Ataque médio dá definição ao contato do pé, inclusive em alto-falantes pequenos.
    impact.type = 'sine';
    impact.frequency.setValueAtTime(roomStep.base * 2.6, now);
    impactGain.gain.setValueAtTime(0.24, now);
    impactGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);
    impact.connect(impactGain);
    impactGain.connect(stepGain);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(stepGain);

    stepGain.connect(
      state.sfxGain
    );

    osc.start(now);
    impact.start(now);
    noise.start(now);

    osc.stop(
      now + 0.16
    );

    noise.stop(
      now + 0.16
    );
    impact.stop(now + 0.06);
    impact.onended = () => { impact.disconnect(); impactGain.disconnect(); };
    noise.onended = () => { noise.disconnect(); noiseFilter.disconnect(); noiseGain.disconnect(); };
    osc.onended = () => { osc.disconnect(); stepGain.disconnect(); };
  }

  function updateFootsteps(isMoving) {
    unlock();

    if (!isMoving) return;

    ensureGameAmbient();

    const nowMs =
      performance.now();

    const interval = 260;

    if (
      nowMs - state.lastStepTime <
      interval
    ) {
      return;
    }

    state.lastStepTime = nowMs;

    playFootstep(
      getCurrentRoomName()
    );
  }

  function setMaster(value) {
    state.master =
      Math.min(
        1,
        Math.max(
          0,
          Number(value)
        )
      );

    localStorage.setItem(
      STORAGE.master,
      String(state.master)
    );

    applyVolumes();
    syncControls();
  }

  function setBackgroundVolume(value) {
    state.background =
      Math.min(
        1,
        Math.max(
          0,
          Number(value)
        )
      );

    localStorage.setItem(
      STORAGE.background,
      String(state.background)
    );

    applyVolumes();
    syncControls();
  }

  function setButtonVolume(value) {
    state.buttons =
      Math.min(
        1,
        Math.max(
          0,
          Number(value)
        )
      );

    localStorage.setItem(
      STORAGE.buttons,
      String(state.buttons)
    );

    applyVolumes();
    syncControls();
  }

  function setEffectsVolume(value) {
    const level = Number(value);
    if (!Number.isFinite(level)) return;
    state.effects = Math.min(1, Math.max(0, level));
    localStorage.setItem(STORAGE.effects, String(state.effects));
    applyVolumes();
    syncControls();
  }

  function setEffectsEnabled(enabled) {
    state.effectsEnabled = Boolean(enabled);
    localStorage.setItem(STORAGE.effectsEnabled, String(state.effectsEnabled));
    applyVolumes();
    syncControls();
  }

  function toggleEffects() {
    setEffectsEnabled(!state.effectsEnabled);
  }

  function setBackgroundEnabled(enabled) {
    state.backgroundEnabled =
      Boolean(enabled);

    localStorage.setItem(
      STORAGE.backgroundEnabled,
      String(
        state.backgroundEnabled
      )
    );

    if (
      state.backgroundEnabled
    ) {
      unlock().then(() => {
        startTrack(
          state.currentName ||
          "menu"
        );
      });
    } else {
      stopTrack(0.1);
    }

    applyVolumes();
    syncControls();
  }

  function setButtonsEnabled(enabled) {
    state.buttonsEnabled =
      Boolean(enabled);

    localStorage.setItem(
      STORAGE.buttonsEnabled,
      String(
        state.buttonsEnabled
      )
    );

    applyVolumes();
    syncControls();
  }

  function toggleBackground() {
    setBackgroundEnabled(
      !state.backgroundEnabled
    );
  }

  function toggleButtons() {
    const next =
      !state.buttonsEnabled;

    setButtonsEnabled(next);

    if (next) {
      playConfirm();
    }
  }

  function pct(value) {
    return `${Math.round(
      value * 100
    )}%`;
  }

  function setText(id, text) {
    const el =
      document.getElementById(id);

    if (el) {
      el.textContent = text;
    }
  }

  function setPressed(
    id,
    pressed
  ) {
    const el =
      document.getElementById(id);

    if (el) {
      el.setAttribute(
        "aria-pressed",
        String(Boolean(pressed))
      );
    }
  }

  function syncControls() {
    const effects = document.getElementById("effects-volume-control");
    if (effects) {
      effects.value = Math.round(state.effects * 100);
      effects.setAttribute("aria-valuetext", pct(state.effects));
    }
    setText("effects-volume-value", pct(state.effects));
    setText("toggle-effects-sound", state.effectsEnabled ? "DESLIGAR EFEITOS" : "ATIVAR EFEITOS");
    setPressed("toggle-effects-sound", state.effectsEnabled);

    const master =
      document.getElementById(
        "master-volume-control"
      );

    const background =
      document.getElementById(
        "background-volume-control"
      );

    const buttons =
      document.getElementById(
        "button-volume-control"
      );

    if (master) {
      master.value =
        Math.round(
          state.master * 100
        );
    }

    if (background) {
      background.value =
        Math.round(
          state.background * 100
        );
    }

    if (buttons) {
      buttons.value =
        Math.round(
          state.buttons * 100
        );
    }

    setText(
      "master-volume-value",
      pct(state.master)
    );

    setText(
      "background-volume-value",
      pct(state.background)
    );

    setText(
      "button-volume-value",
      pct(state.buttons)
    );

    setText(
      "toggle-background-sound",
      state.backgroundEnabled
        ? "REMOVER SOM DE FUNDO"
        : "ATIVAR SOM DE FUNDO"
    );

    setText(
      "toggle-button-sound",
      state.buttonsEnabled
        ? "REMOVER SOM DOS BOTÕES"
        : "ATIVAR SOM DOS BOTÕES"
    );

    setPressed(
      "toggle-background-sound",
      state.backgroundEnabled
    );

    setPressed(
      "toggle-button-sound",
      state.buttonsEnabled
    );
  }

  function setupControls() {
    syncControls();

    document.getElementById("effects-volume-control")?.addEventListener("input", event => {
      setEffectsVolume(Number(event.target.value) / 100);
    });
    document.getElementById("toggle-effects-sound")?.addEventListener("click", toggleEffects);
    document.getElementById("test-effects-sound")?.addEventListener("click", playCorrectAnswer);
    document.querySelectorAll("[data-effects-step]").forEach(button => {
      button.addEventListener("click", () => {
        setEffectsVolume((Math.round(state.effects * 100) + Number(button.dataset.effectsStep)) / 100);
      });
    });

    const master =
      document.getElementById(
        "master-volume-control"
      );

    const background =
      document.getElementById(
        "background-volume-control"
      );

    const buttons =
      document.getElementById(
        "button-volume-control"
      );

    const toggleBg =
      document.getElementById(
        "toggle-background-sound"
      );

    const toggleBtn =
      document.getElementById(
        "toggle-button-sound"
      );

    if (master) {
      master.addEventListener(
        "input",
        event =>
          setMaster(
            Number(
              event.target.value
            ) / 100
          )
      );
    }

    if (background) {
      background.addEventListener(
        "input",
        event =>
          setBackgroundVolume(
            Number(
              event.target.value
            ) / 100
          )
      );
    }

    if (buttons) {
      buttons.addEventListener(
        "input",
        event =>
          setButtonVolume(
            Number(
              event.target.value
            ) / 100
          )
      );
    }

    if (toggleBg) {
      toggleBg.addEventListener(
        "click",
        () => {
          toggleBackground();

          if (
            state.backgroundEnabled
          ) {
            playConfirm();
          }
        }
      );
    }

    if (toggleBtn) {
      toggleBtn.addEventListener(
        "click",
        toggleButtons
      );
    }
  }

  function startAfterGesture() {
    unlock().then(() => {
      if (
        state.backgroundEnabled &&
        !state.currentTrack
      ) {
        startTrack(
          state.currentName ||
          "menu"
        );
      }
    });
  }

  document.addEventListener(
    "click",
    event => {
      startAfterGesture();

      const button =
        event.target.closest(
          "button, .cyber-btn, input[type='range']"
        );

      if (
        !button ||
        button.matches(
          "input[type='range']"
        )
      ) {
        return;
      }

      playClick();
    },
    true
  );

  document.addEventListener(
    "pointerdown",
    startAfterGesture,
    true
  );

  document.addEventListener(
    "keydown",
    startAfterGesture,
    true
  );

  document.addEventListener(
    "DOMContentLoaded",
    () => {
      setupControls();

      state.currentName =
        "menu";

      syncControls();
    }
  );

  return {
    unlock,
    playMenuAmbient,
    playRoom,
    playVictory,
    playResultReveal,
    playDialogueKey,
    playGameOver,
    playClick,
    playConfirm,
    playCorrectAnswer,
    playError,
    playBugAlert,
    stopBugAlert,
    playFootstep,
    playLevelComplete,
    updateFootsteps,
    ensureGameAmbient,
    setMaster,
    setBackgroundVolume,
    setEffectsVolume,
    setButtonVolume,
    setBackgroundEnabled,
    setEffectsEnabled,
    setButtonsEnabled,
    toggleBackground,
    toggleEffects,
    toggleButtons,
    syncControls,

    forceStart: () =>
      startTrack(
        state.currentName ||
        "menu"
      ),

    getState: () => ({
      ...state
    })
  };
})();

