/**
 * Mochi's voice, synthesized with the Web Audio API (no audio files).
 *
 * A meow is a buzzy source (sawtooth plus a sine an octave up) whose pitch rises then falls,
 * shaped by two band-pass "formant" filters that glide from an "ee" mouth to an "ow" mouth.
 * Each bubble text gets its own variant, with a little random pitch so no two sound the same.
 */

type Voice = 'meow' | 'nya' | 'mrrp' | 'purr' | 'loud';

let ctx: AudioContext | null = null;
const STORE_KEY = 'mochi-sound';

/** Browsers only start audio from a user gesture: call this inside the click/keydown handler. */
export function unlockAudio(): void {
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;
    ctx ??= new Ctor();
    if (ctx.state === 'suspended') void ctx.resume();
  } catch {
    ctx = null; // No audio here: Mochi stays silent.
  }
}

export function soundOn(): boolean {
  try {
    return localStorage.getItem(STORE_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function setSoundOn(on: boolean): void {
  try {
    localStorage.setItem(STORE_KEY, on ? 'on' : 'off');
  } catch {
    // Storage unavailable: the choice holds until the page reloads.
  }
}

/** Plays the sound that matches a speech-bubble text such as "meow!" or "purrr…". */
export function playMeow(text: string): void {
  if (!ctx || !soundOn()) return;
  const voice: Voice = text.startsWith('MEOW')
    ? 'loud'
    : text.startsWith('nya')
      ? 'nya'
      : text.startsWith('mrrp')
        ? 'mrrp'
        : text.startsWith('purr')
          ? 'purr'
          : 'meow';
  if (voice === 'purr') purr(ctx);
  else meow(ctx, voice);
}

function meow(ac: AudioContext, voice: Exclude<Voice, 'purr'>): void {
  const t0 = ac.currentTime + 0.01;
  const shape = {
    meow: { base: 620, dur: 0.6, peak: 0.22, rise: 1.25, fall: 0.72, vibrato: 0 },
    loud: { base: 560, dur: 0.85, peak: 0.32, rise: 1.35, fall: 0.62, vibrato: 0 },
    nya: { base: 760, dur: 0.42, peak: 0.2, rise: 1.15, fall: 0.8, vibrato: 9 },
    mrrp: { base: 520, dur: 0.28, peak: 0.18, rise: 1.05, fall: 1.3, vibrato: 0 },
  }[voice];
  const base = shape.base * (0.9 + Math.random() * 0.2);
  const end = t0 + shape.dur;

  // Source: sawtooth for the buzz, a softer sine an octave up for brightness.
  const saw = ac.createOscillator();
  saw.type = 'sawtooth';
  const sine = ac.createOscillator();
  sine.type = 'sine';
  const sineGain = ac.createGain();
  sineGain.gain.value = 0.35;

  // Pitch contour: start a bit low, rise, then fall (mrrp ends going up, like a question).
  for (const [osc, mult] of [
    [saw, 1],
    [sine, 2],
  ] as const) {
    const f = osc.frequency;
    f.setValueAtTime(base * 0.85 * mult, t0);
    f.linearRampToValueAtTime(base * shape.rise * mult, t0 + shape.dur * 0.35);
    f.exponentialRampToValueAtTime(base * shape.fall * mult, end);
  }

  // Vibrato for "nya~".
  if (shape.vibrato) {
    const lfo = ac.createOscillator();
    const depth = ac.createGain();
    lfo.frequency.value = shape.vibrato;
    depth.gain.value = base * 0.04;
    lfo.connect(depth);
    depth.connect(saw.frequency);
    lfo.start(t0);
    lfo.stop(end);
  }

  // Formants: glide from "ee" (F1 low, F2 high) to "ow" (F1 higher, F2 lower).
  const mix = ac.createGain();
  for (const [from, to, q, level] of [
    [500, 950, 6, 1],
    [2300, 1200, 8, 0.7],
  ] as const) {
    const bp = ac.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = q;
    bp.frequency.setValueAtTime(from, t0);
    bp.frequency.linearRampToValueAtTime(to, t0 + shape.dur * 0.7);
    const g = ac.createGain();
    g.gain.value = level;
    saw.connect(bp);
    sine.connect(sineGain);
    sineGain.connect(bp);
    bp.connect(g);
    g.connect(mix);
  }

  // A trill for "mrrp?": flutter the volume quickly.
  const out = ac.createGain();
  if (voice === 'mrrp') {
    const trill = ac.createOscillator();
    const trillDepth = ac.createGain();
    trill.frequency.value = 28;
    trillDepth.gain.value = 0.5;
    trill.connect(trillDepth);
    trillDepth.connect(out.gain);
    trill.start(t0);
    trill.stop(end);
  }

  // Envelope: soft attack, hold, gentle release.
  const env = ac.createGain();
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(shape.peak, t0 + 0.05);
  env.gain.setValueAtTime(shape.peak, end - shape.dur * 0.35);
  env.gain.exponentialRampToValueAtTime(0.0001, end);

  mix.connect(env);
  env.connect(out);
  out.connect(ac.destination);
  saw.start(t0);
  sine.start(t0);
  saw.stop(end + 0.05);
  sine.stop(end + 0.05);
}

function purr(ac: AudioContext): void {
  const t0 = ac.currentTime + 0.01;
  const dur = 1.3;

  // Noise, low-passed into a rumble, pulsed about 25 times a second.
  const buffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  const noise = ac.createBufferSource();
  noise.buffer = buffer;

  const low = ac.createBiquadFilter();
  low.type = 'lowpass';
  low.frequency.value = 320;

  const pulse = ac.createGain();
  pulse.gain.value = 0.5;
  const lfo = ac.createOscillator();
  const lfoDepth = ac.createGain();
  lfo.frequency.value = 24 + Math.random() * 4;
  lfoDepth.gain.value = 0.5;
  lfo.connect(lfoDepth);
  lfoDepth.connect(pulse.gain);

  const env = ac.createGain();
  env.gain.setValueAtTime(0.0001, t0);
  env.gain.exponentialRampToValueAtTime(0.5, t0 + 0.15);
  env.gain.setValueAtTime(0.5, t0 + dur - 0.4);
  env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  noise.connect(low);
  low.connect(pulse);
  pulse.connect(env);
  env.connect(ac.destination);
  noise.start(t0);
  lfo.start(t0);
  noise.stop(t0 + dur);
  lfo.stop(t0 + dur);
}
