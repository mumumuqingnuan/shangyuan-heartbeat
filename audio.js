/**
 * Lantern Chase V3 — original comic arcade score, composed for this game.
 * No samples, remote assets, copyrighted melody, or third-party dependencies.
 * Call unlock() from a pointer/click gesture and setEnabled(true) to opt in.
 */
const PENTATONIC = [0, 2, 4, 7, 9];
const ROOTS = [62, 65, 64];
const TEMPOS = [176, 178, 176];
export const ENDING_BPM = 133;
// New, compact two-bar call-and-response motifs. -1 means a rest.
const MELODY = [
  [2, -1, 2, 3, 4, -1, 3, -1, 2, -1, 0, 1, 2, -1, 1, -1],
  [0, -1, 2, 3, 2, -1, 1, -1, 0, 1, 2, -1, 0, -1, -1, 3],
];
const ANSWER = [
  [4, -1, 3, -1, 2, 3, 4, -1, 5, -1, 4, 3, 2, -1, 3, -1],
  [2, -1, 1, 0, 1, -1, 2, -1, 3, -1, 1, -1, 0, -1, -1, -1],
];
const clamp = (value, low, high) => Math.min(high, Math.max(low, value));
const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12);
const degree = (root, value) => root + PENTATONIC[((value % 5) + 5) % 5] + 12 * Math.floor(value / 5);

export class AudioDirector {
  constructor() {
    this.enabled = false;
    this.unlocked = false;
    this.playing = false;
    this.paused = false;
    this.stage = 0;
    this.intensity = 0;
    this.ending = 'parade';
    this.mode = 'game';
    this.context = null;
    this._timer = null;
    this._step = 0;
    this._transportStep = 0;
    this._pausedBeat = 0;
    this._endingSeekSeconds = null;
    this._next = 0;
    this._suppressUntil = 0;
    this._voices = new Set();
    this._lastCues = new Map();
    this._disposed = false;
  }

  async unlock() {
    if (this._disposed) return false;
    try {
      if (!this.context) {
        const Context = globalThis.AudioContext || globalThis.webkitAudioContext;
        if (!Context) return false;
        this.context = new Context({ latencyHint: 'interactive' });
        this._buildGraph();
      }
      await this.context.resume();
      this.unlocked = this.context.state === 'running';
      if (this.unlocked) {
        this._setVolume(this.enabled ? 0.34 : 0);
        this._beginScheduler();
      }
      return this.unlocked;
    } catch {
      // Sound is optional. The game remains playable when browser audio fails.
      this.unlocked = false;
      return false;
    }
  }

  setEnabled(value) {
    this.enabled = Boolean(value);
    if (!this.context || this._disposed) return;
    this._setVolume(this.enabled ? 0.34 : 0);
    if (this.enabled) this._beginScheduler();
    else {
      this._haltScheduler();
      this._stopVoices();
    }
  }

  start() {
    if (this._disposed) return;
    this._haltScheduler();
    this._stopVoices();
    this.playing = true;
    this.paused = false;
    this.mode = 'game';
    this.intensity = 0;
    this._step = 0;
    this._transportStep = 0;
    this._pausedBeat = 0;
    this._endingSeekSeconds = null;
    this._suppressUntil = 0;
    this._lastCues.clear();
    this._beginScheduler();
  }

  setStage(index) {
    this.stage = clamp(Math.trunc(Number(index) || 0), 0, 2);
  }

  setIntensity(value) {
    this.intensity = clamp(Math.trunc(Number(value) || 0), 0, 2);
  }

  setEnding(type) {
    const id = String(type || 'parade').toLowerCase();
    this.ending = /ghost|two.?worlds|幽|灵/.test(id) ? 'ghost'
      : /visitor|波斯|异域/.test(id) ? 'visitor'
      : /alone|solo|cat|quiet|carefree|single|独|自在/.test(id) ? 'alone'
      : /prince|princess|heir|empress|consort|royal|王|宫/.test(id) ? 'royal'
      : /festival|grand|twelve|all|eight|八|十二/.test(id) ? 'grand'
      : /merchant|oilseller|商|富/.test(id) ? 'merchant' : 'parade';
  }

  startEnding(type = this.ending, elapsedSeconds = 0) {
    if (this._disposed) return;
    this.setEnding(type);
    this._haltScheduler();
    this._stopVoices();
    this.mode = 'ending';
    this.playing = true;
    this.paused = false;
    this._step = 0;
    this._transportStep = 0;
    this._pausedBeat = 0;
    const elapsed = Number(elapsedSeconds);
    this._endingSeekSeconds = Number.isFinite(elapsed) ? Math.max(0, elapsed) : 0;
    this._suppressUntil = 0;
    this._lastCues.clear();
    this._beginScheduler();
  }

  getBeat() {
    // Null means the scene should use its own elapsed-time clock (sound off).
    if (!this.context || !this.enabled || !this.unlocked || !this.playing || this.context.state !== 'running') return null;
    const bpm = this.mode === 'ending' ? ENDING_BPM : this.intensity === 2 ? 188 : TEMPOS[this.stage] + (this.intensity === 1 ? 6 : 0);
    const beat = this.paused ? this._pausedBeat : Math.max(0, this._transportStep / 4 + (this.context.currentTime - this._next) * bpm / 60);
    return { bpm, beat, phase: beat % 1, beatInBar: Math.floor(beat) % 4, bar: Math.floor(beat / 4), mode: this.mode, paused: this.paused };
  }

  cue(kind) {
    if (kind === 'stage') kind = 'gate';
    if (kind === 'cutscene') { this.startEnding(); return; }
    if (!this._canSound() || this.paused) return;
    const time = this.context.currentTime + 0.012;
    const cooldown = { zap: 0.065, tick: 0.12, win: 0.6, lose: 0.6, gate: 0.3, egg: 5, beauty: 0.7, punch: 0.2, scoreboard: 0.8 }[kind];
    if (cooldown === undefined) return;
    if (time - (this._lastCues.get(kind) ?? -Infinity) < cooldown) return;
    this._lastCues.set(kind, time);
    const root = ROOTS[this.stage];
    const fx = this._effects;
    if (kind === 'zap') {
      this._sweep(time, 980, 440, 0.052, 0.105, fx, 'triangle');
      this._pluck(root + 19, time + 0.022, 0.09, 0.105, fx, 0.1);
    } else if (kind === 'tick') {
      this._wood(time, 0.12, fx, this.intensity === 2 ? 1450 : 1050);
    } else if (kind === 'gate') {
      [0, 2, 3, 5].forEach((n, i) => this._flute(degree(root, n), time + i * 0.055, 0.14, 0.2, fx, (i - 1.5) * 0.15));
      this._wood(time + 0.21, 0.12, fx, 1050);
    } else if (kind === 'win') {
      // A short toy-trumpet wink over the running song; no multi-second gap.
      [0, 2, 3, 5].forEach((n, i) => this._brass(degree(root, n), time + [0, 0.105, 0.21, 0.39][i], i === 3 ? 0.36 : 0.105, 0.22, fx));
      this._snare(time + 0.29, 0.14, fx);
      this._gong(time + 0.39, hz(root), 0.09, fx);
    } else if (kind === 'lose') {
      this._brass(root + 7, time, 0.14, 0.2, fx);
      this._brass(root + 5, time + 0.16, 0.14, 0.2, fx);
      this._sweep(time + 0.34, hz(root + 3), hz(root - 4), 0.29, 0.2, fx, 'triangle');
      this._wood(time + 0.58, 0.13, fx, 500);
    } else if (kind === 'beauty') {
      [0, 1, 2, 3, 4, 5].forEach((n, i) => this._bell(degree(root + 12, n), time + i * 0.047, 0.48, 0.14, fx, (i - 2) * 0.08));
      this._gong(time + 0.3, hz(root - 12), 0.12, fx);
    } else if (kind === 'punch') {
      this._snare(time, 0.2, fx);
      this._wood(time + 0.09, 0.16, fx, 620);
      this._gong(time + 0.21, hz(root), 0.12, fx);
    } else if (kind === 'scoreboard') {
      [0, 3, 5].forEach((n, i) => this._brass(degree(62, n), time + [0, 0.12, 0.27][i], i === 2 ? 0.47 : 0.105, 0.25, fx));
      [0.055, 0.17, 0.24].forEach((offset) => this._snare(time + offset, 0.11, fx));
      this._gong(time + 0.28, hz(50), 0.13, fx);
    } else if (kind === 'egg') {
      // Five-second comic interlude, with a complete new 10-note melody.
      this._breakMusic(time, 5);
      const notes = [0, 2, 0, 3, 2, 4, 3, 1, 2, 0];
      notes.forEach((n, i) => {
        const at = time + i * 0.44;
        this._brass(degree(root, n), at, i === 9 ? 0.55 : 0.14, 0.22, fx);
        if (i % 2 === 0) this._pluck(root - 12, at, 0.28, 0.12, fx, -0.2);
        this._wood(at + 0.22, 0.13, fx, i % 2 ? 1100 : 800);
        if (i % 2) this._snare(at + 0.22, 0.1, fx);
      });
      this._gong(time + 4.05, hz(root - 12), 0.09, fx);
    }
  }

  pause() {
    if (this._disposed) return;
    this._pausedBeat = this.getBeat()?.beat || 0;
    this.paused = true;
    this._haltScheduler();
    this._stopVoices();
    this._suppressUntil = 0;
  }

  resume() {
    if (this._disposed) return;
    if (this.paused && this.mode === 'ending' && this.playing) this._endingSeekSeconds = this._pausedBeat * 60 / ENDING_BPM;
    this.paused = false;
    if (this.playing) this._beginScheduler();
  }

  stop() {
    this.playing = false;
    this.paused = false;
    this._haltScheduler();
    this._stopVoices();
    this._step = 0;
    this._endingSeekSeconds = null;
    this._suppressUntil = 0;
  }

  dispose() {
    this.stop();
    this._disposed = true;
    this.enabled = false;
    this.unlocked = false;
    for (const voice of this._voices) {
      for (const node of [voice.source, voice.output, ...voice.extras]) {
        try { node.disconnect(); } catch { /* Already disconnected. */ }
      }
    }
    this._voices.clear();
    if (this.context && this.context.state !== 'closed') this.context.close().catch(() => {});
    this.context = null;
  }

  _buildGraph() {
    const c = this.context;
    this._master = c.createGain();
    this._master.gain.value = 0;
    this._music = c.createGain();
    this._music.gain.value = 0.8;
    this._effects = c.createGain();
    this._effects.gain.value = 0.85;
    const softener = c.createBiquadFilter();
    softener.type = 'lowpass';
    softener.frequency.value = 6500;
    softener.Q.value = 0.5;
    const compressor = c.createDynamicsCompressor();
    compressor.threshold.value = -14;
    compressor.knee.value = 12;
    compressor.ratio.value = 8;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.13;
    this._music.connect(this._master);
    this._effects.connect(this._master);
    this._master.connect(softener);
    softener.connect(compressor);
    compressor.connect(c.destination);
    // One deterministic, softly filtered noise buffer, reused for percussion.
    this._noise = c.createBuffer(1, Math.ceil(c.sampleRate * 0.24), c.sampleRate);
    const data = this._noise.getChannelData(0);
    let seed = 937;
    for (let i = 0; i < data.length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
      data[i] = ((seed >>> 0) / 2147483648 - 1) * 0.65;
    }
  }

  _setVolume(value) {
    const now = this.context.currentTime;
    this._master.gain.cancelScheduledValues(now);
    this._master.gain.setTargetAtTime(value, now, 0.035);
  }

  _canSound() {
    return this.enabled && this.unlocked && this.context?.state === 'running' && !this._disposed;
  }

  _beginScheduler() {
    if (!this._canSound() || !this.playing || this.paused || this._timer !== null) return;
    const now = this.context.currentTime;
    if (this.mode === 'ending' && this._endingSeekSeconds !== null) {
      const elapsed = this._endingSeekSeconds;
      const unit = 60 / ENDING_BPM / 4;
      // Resume on the next sixteenth at its original phase, not at phrase zero.
      let absoluteStep = Math.ceil(elapsed / unit - 1e-9);
      let firstTime = now + absoluteStep * unit - elapsed;
      if (elapsed === 0) firstTime = now + 0.06;
      else if (firstTime < now + 0.012) { absoluteStep += 1; firstTime += unit; }
      this._transportStep = absoluteStep;
      this._step = ((absoluteStep % 64) + 64) % 64;
      this._next = firstTime;
      this._endingSeekSeconds = null;
    } else this._next = now + 0.06;
    this._schedule();
    this._timer = globalThis.setInterval(() => this._schedule(), 25);
  }

  _haltScheduler() {
    if (this._timer !== null) globalThis.clearInterval(this._timer);
    this._timer = null;
  }

  _schedule() {
    if (!this._canSound() || !this.playing || this.paused) return;
    const now = this.context.currentTime;
    // Do not play a burst of missed notes after a sleeping/background tab.
    if (this._next < now - 0.05) this._next = now + 0.04;
    let safety = 0;
    while (this._next < now + 0.13 && safety++ < 12) {
      const bpm = this.mode === 'ending' ? ENDING_BPM : this.intensity === 2 ? 188 : TEMPOS[this.stage] + (this.intensity === 1 ? 6 : 0);
      const sixteenth = 60 / bpm / 4;
      if (this._next >= this._suppressUntil) {
        if (this.mode === 'ending') this._scheduleEndingStep(this._step, this._next, sixteenth);
        else this._scheduleStep(this._step, this._next, sixteenth);
      }
      this._next += sixteenth;
      this._step = (this._step + 1) % 64;
      this._transportStep += 1;
    }
  }

  _scheduleStep(step, at, unit) {
    const bar = Math.floor(step / 16);
    const pos = step % 16;
    const root = ROOTS[this.stage];
    const bus = this._music;
    const phrase = bar < 2 ? MELODY : ANSWER;
    const note = phrase[bar % 2][pos];
    const swungAt = at + (pos % 2 ? unit * 0.12 : 0);
    if (note >= 0) {
      const pitch = degree(root, note);
      const length = unit * (pos % 4 === 0 ? 1.9 : 1.35);
      if (this.stage === 2) {
        this._bell(pitch + 12, swungAt, length * 2.4, 0.14, bus, -0.18);
        this._flute(pitch, swungAt, length, 0.11, bus, 0.1);
      } else {
        this._flute(pitch + 12, swungAt, length, 0.17, bus, -0.1);
        this._pluck(pitch, swungAt, length, 0.13, bus, 0.22);
      }
    }
    // Cartoon oom-pah bass; a short offbeat chord keeps the bounce audible.
    if (pos % 4 === 0) {
      const bass = root - 24 + (pos === 4 || pos === 12 ? 7 : 0);
      this._sweep(at, hz(bass) * 1.05, hz(bass), unit * 2.2, 0.27, bus, 'triangle');
    }
    if (pos % 4 === 2) {
      [0, 7].forEach((n) => this._pluck(root - 12 + n, at, unit * 1.4, 0.1, bus, 0.15));
    }
    if (pos === 0 || pos === 8 || (this.intensity > 0 && pos === 10)) this._kick(at, 0.3, bus);
    if (pos === 4 || pos === 12) this._snare(at, 0.21, bus);
    if (pos % 2 === 0) this._wood(at, pos % 4 === 0 ? 0.13 : 0.09, bus, pos % 4 === 0 ? 810 : 1140);
    if (pos % 2 === 1) this._hat(at, 0.038, bus);
    if (bar % 2 === 1 && pos === 15) this._snare(at, 0.11, bus);
    // Duel counter-riff: dry low-register notes, stronger snare, no long pads.
    if (this.intensity >= 1 && pos % 2 === 0) {
      const response = [0, 0, 3, 2, 0, 1, 2, 3][pos / 2];
      this._pluck(degree(root - 12, response), at, unit * 1.2, 0.13, bus, -0.25);
      if (pos === 6 || pos === 14) this._snare(at, 0.085, bus);
    }
    if (this.intensity === 2) {
      if (pos % 2 === 1) this._wood(at, 0.07, bus, 1380);
      if (pos === 3 || pos === 7 || pos === 11 || pos === 15) this._flute(degree(root + 12, pos === 15 ? 5 : 4), at, unit * 0.8, 0.085, bus, 0.25);
    }
    // Airy ghost timbre keeps the identical fast pulse.
    if (this.stage === 2 && pos === 0) this._bell(root + 7, at, unit * 6, 0.075, bus, 0.3);
  }

  _scheduleEndingStep(step, at, unit) {
    const bar = Math.floor(step / 16), pos = step % 16, bus = this._music;
    const ghost = this.ending === 'ghost', alone = this.ending === 'alone';
    const root = this.ending === 'visitor' ? 65 : ghost ? 64 : this.ending === 'royal' ? 67 : 62;
    const motifs = [
      [0, -1, 0, 2, 3, -1, 2, -1, 0, -1, 2, 3, 4, -1, 3, -1],
      [5, -1, 4, 3, 2, -1, 3, -1, 4, -1, 2, -1, 0, -1, -1, 2],
      [3, -1, 2, 1, 0, -1, 1, 2, 3, -1, 4, -1, 5, -1, 4, -1],
      [3, -1, 2, -1, 1, 2, 3, -1, 2, -1, 1, -1, 0, -1, -1, -1],
    ];
    const note = motifs[bar][pos];
    if (note >= 0) {
      const pitch = degree(root, note);
      if (ghost) this._bell(pitch + 12, at, unit * 3.8, 0.21, bus, 0);
      else this._flute(pitch + 12, at, unit * 1.6, 0.18, bus, -0.15);
      this._pluck(pitch, at, unit * 1.4, alone ? 0.09 : 0.13, bus, 0.15);
    }
    // Every quarter note is an audible hand/foot accent for the ensemble.
    if (pos % 4 === 0) {
      this._pluck(root - 24 + (pos === 4 || pos === 12 ? 7 : 0), at, unit * 2, 0.24, bus, -0.2);
      this._wood(at, 0.17, bus, pos === 0 || pos === 8 ? 760 : 1080);
      this._kick(at, 0.23, bus);
    }
    if (pos === 4 || pos === 12) this._snare(at, 0.19, bus);
    if (pos % 4 === 2) {
      this._hat(at, 0.055, bus);
      [0, 7].forEach(n => this._pluck(root - 12 + n, at, unit, 0.09, bus, 0.2));
    }
    if (bar % 2 === 1 && pos === 15) this._snare(at, 0.13, bus);
    if (bar === 0 && pos === 0) this._gong(at, hz(root), 0.08, bus);
    if (bar === 3 && pos === 12) {
      this._gong(at, hz(root), 0.1, bus);
      if (!ghost && !alone) this._brass(root, at, unit * 2.8, 0.16, bus);
    }
  }

  _breakMusic(at, duration) {
    this._stopVoices(this._music);
    this._suppressUntil = Math.max(this._suppressUntil, at + duration);
  }

  _voice(source, output, bus, at, duration, extras = []) {
    const voice = { source, output, bus, at, extras };
    this._voices.add(voice);
    source.onended = () => {
      this._voices.delete(voice);
      for (const node of [source, output, ...extras]) {
        try { node.disconnect(); } catch { /* Already disconnected. */ }
      }
    };
    source.start(at);
    source.stop(at + duration);
  }

  _stopVoices(bus = null) {
    if (!this.context) return;
    const now = this.context.currentTime;
    for (const voice of [...this._voices]) {
      if (bus && voice.bus !== bus) continue;
      try {
        // A short fade prevents clicks, while cancelling all future starts.
        voice.output.gain.cancelScheduledValues(now);
        voice.output.gain.setTargetAtTime(0, now, 0.008);
        voice.source.stop(now + 0.035);
      } catch { /* Already stopped. */ }
    }
  }

  _envelope(at, duration, amplitude, bus, pan = 0, attack = 0.006) {
    const c = this.context;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0, at);
    gain.gain.linearRampToValueAtTime(amplitude, at + attack);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
    let panner = null;
    if (c.createStereoPanner) {
      panner = c.createStereoPanner();
      panner.pan.value = pan;
      gain.connect(panner);
      panner.connect(bus);
    } else gain.connect(bus);
    return { gain, panner };
  }

  _pluck(note, at, duration, amplitude, bus, pan = 0) {
    const c = this.context;
    const frequency = hz(note);
    // Filtered triangle + soft overtone gives a guzheng-like pluck.
    [1, 2].forEach((multiple, i) => {
      const oscillator = c.createOscillator();
      oscillator.type = i ? 'sine' : 'triangle';
      oscillator.frequency.setValueAtTime(frequency * multiple * 1.002, at);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * multiple, at + 0.04);
      const { gain, panner } = this._envelope(at, duration * (i ? 0.6 : 1), amplitude * (i ? 0.15 : 0.85), bus, pan, 0.004);
      oscillator.connect(gain);
      this._voice(oscillator, gain, bus, at, duration + 0.025, panner ? [panner] : []);
    });
  }

  _flute(note, at, duration, amplitude, bus, pan = 0) {
    const c = this.context, frequency = hz(note);
    [1, 2].forEach((multiple, i) => {
      const oscillator = c.createOscillator();
      oscillator.type = i ? 'triangle' : 'sine';
      oscillator.frequency.setValueAtTime(frequency * multiple * 0.985, at);
      oscillator.frequency.exponentialRampToValueAtTime(frequency * multiple, at + Math.min(0.025, duration * 0.2));
      const { gain, panner } = this._envelope(at, duration, amplitude * (i ? 0.13 : 0.87), bus, pan, 0.006);
      // Tongued notes have a small body, followed by a clean, short release.
      const peak = amplitude * (i ? 0.13 : 0.87);
      gain.gain.cancelScheduledValues(at);
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(peak, at + 0.006);
      gain.gain.linearRampToValueAtTime(peak * 0.67, at + duration * 0.68);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + duration);
      oscillator.connect(gain);
      this._voice(oscillator, gain, bus, at, duration + 0.02, panner ? [panner] : []);
    });
    this._filteredNoise(at, Math.min(duration, 0.035), amplitude * 0.07, 2900, 'bandpass', bus);
  }

  _brass(note, at, duration, amplitude, bus) {
    const c = this.context, frequency = hz(note);
    const oscillator = c.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(frequency * 0.94, at);
    oscillator.frequency.exponentialRampToValueAtTime(frequency, at + Math.min(0.035, duration * 0.25));
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 0.7;
    filter.frequency.setValueAtTime(Math.min(4200, frequency * 5), at);
    filter.frequency.exponentialRampToValueAtTime(Math.min(2600, frequency * 2.8), at + duration);
    const { gain, panner } = this._envelope(at, duration, amplitude, bus, 0, 0.01);
    oscillator.connect(filter); filter.connect(gain);
    this._voice(oscillator, gain, bus, at, duration + 0.025, [filter, ...(panner ? [panner] : [])]);
  }

  _bell(note, at, duration, amplitude, bus, pan = 0) {
    [1, 2, 2.76].forEach((multiple, i) => {
      const oscillator = this.context.createOscillator();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(hz(note) * multiple, at);
      const { gain, panner } = this._envelope(at, duration / (1 + i * 0.38), amplitude * [0.76, 0.17, 0.07][i], bus, pan, 0.005);
      oscillator.connect(gain);
      this._voice(oscillator, gain, bus, at, duration + 0.025, panner ? [panner] : []);
    });
  }

  _bow(note, at, duration, amplitude, bus, pan = 0) {
    const c = this.context;
    const oscillator = c.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(hz(note), at);
    const filter = c.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = Math.min(2400, hz(note) * 3.5);
    filter.Q.value = 0.65;
    const { gain, panner } = this._envelope(at, duration, amplitude, bus, pan, 0.04);
    // Handwritten pitch curve: subtle bowed vibrato, no extra free-running LFO.
    const vibrato = new Float32Array(32);
    for (let i = 0; i < vibrato.length; i++) vibrato[i] = 5 * Math.sin((i / 31) * duration * 5 * Math.PI * 2);
    oscillator.detune.setValueCurveAtTime(vibrato, at, duration);
    oscillator.connect(filter);
    filter.connect(gain);
    this._voice(oscillator, gain, bus, at, duration + 0.025, [filter, ...(panner ? [panner] : [])]);
  }

  _sweep(at, from, to, duration, amplitude, bus, type = 'sine') {
    const oscillator = this.context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, at);
    oscillator.frequency.exponentialRampToValueAtTime(to, at + duration * 0.8);
    const { gain, panner } = this._envelope(at, duration, amplitude, bus);
    oscillator.connect(gain);
    this._voice(oscillator, gain, bus, at, duration + 0.02, panner ? [panner] : []);
  }

  _kick(at, amplitude, bus) {
    this._sweep(at, 126, 47, 0.19, amplitude, bus);
  }

  _filteredNoise(at, duration, amplitude, frequency, type, bus) {
    const c = this.context;
    const source = c.createBufferSource();
    source.buffer = this._noise;
    const filter = c.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = frequency;
    filter.Q.value = 0.65;
    const { gain, panner } = this._envelope(at, duration, amplitude, bus, 0, 0.003);
    source.connect(filter);
    filter.connect(gain);
    this._voice(source, gain, bus, at, duration + 0.015, [filter, ...(panner ? [panner] : [])]);
  }

  _snare(at, amplitude, bus) {
    this._filteredNoise(at, 0.1, amplitude, 1900, 'bandpass', bus);
    this._sweep(at, 205, 150, 0.085, amplitude * 0.32, bus, 'triangle');
  }

  _hat(at, amplitude, bus) {
    this._filteredNoise(at, 0.04, amplitude, 4200, 'highpass', bus);
  }

  _wood(at, amplitude, bus, frequency = 940) {
    this._sweep(at, frequency, frequency * 0.82, 0.052, amplitude, bus, 'sine');
  }

  _gong(at, frequency, amplitude, bus) {
    [1, 1.48, 2.01].forEach((multiple, i) => {
      this._sweep(at, frequency * multiple * 1.005, frequency * multiple, 0.9 - i * 0.12, amplitude / (i + 1), bus);
    });
  }
}

export default AudioDirector;
