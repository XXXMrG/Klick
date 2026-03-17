import { SoundType } from '@/types/metronome';

export function playSound(
  audioCtx: AudioContext,
  time: number,
  sound: SoundType,
  isAccent: boolean,
  volume: number
): void {
  switch (sound) {
    case 'tok':       playTok(audioCtx, time, isAccent, volume); break;
    case 'beep':      playBeep(audioCtx, time, isAccent, volume); break;
    case 'hihat':     playHihat(audioCtx, time, isAccent, volume); break;
    case 'kick':      playKick(audioCtx, time, isAccent, volume); break;
    case 'rim':       playRim(audioCtx, time, isAccent, volume); break;
    case 'woodblock': playWoodblock(audioCtx, time, isAccent, volume); break;
    case 'clap':      playClap(audioCtx, time, isAccent, volume); break;
    case 'cowbell':   playCowbell(audioCtx, time, isAccent, volume); break;
  }
}

// ─── 1. Tok — 木质 tok，温暖干净，类 Korg / Dr Beat 机械摆音色 ───────────────
// 原理：低频正弦（基音）+ 两个泛音正弦叠加，快速指数衰减，无噪声成分
function playTok(audioCtx: AudioContext, time: number, isAccent: boolean, volume: number) {
  const baseFreq = isAccent ? 920 : 680;
  const decay    = isAccent ? 0.045 : 0.035;
  const gain     = isAccent ? 1.4 : 1.0;

  // 三层正弦叠加：基音 + 二泛音（轻）+ 三泛音（很轻）
  [[1, 1.0], [2.1, 0.25], [3.4, 0.08]].forEach(([mult, amp]) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = baseFreq * mult;

    const env = audioCtx.createGain();
    env.gain.setValueAtTime(amp * gain * volume, time);
    env.gain.exponentialRampToValueAtTime(0.0001, time + decay);

    osc.connect(env).connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + decay + 0.005);
  });
}

// ─── 2. Beep — 干净电子哔声 ──────────────────────────────────────────────────
function playBeep(audioCtx: AudioContext, time: number, isAccent: boolean, volume: number) {
  const freq  = isAccent ? 1320 : 880;
  const decay = 0.06;

  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;

  const env = audioCtx.createGain();
  env.gain.setValueAtTime((isAccent ? 0.9 : 0.65) * volume, time);
  env.gain.exponentialRampToValueAtTime(0.0001, time + decay);

  osc.connect(env).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + decay + 0.005);
}

// ─── 3. Hi-Hat — 踩镲，高频噪声 ─────────────────────────────────────────────
function playHihat(audioCtx: AudioContext, time: number, isAccent: boolean, volume: number) {
  const decay = isAccent ? 0.10 : 0.055;
  const sr    = audioCtx.sampleRate;
  const size  = Math.floor(sr * decay * 1.5);

  const buffer = audioCtx.createBuffer(1, size, sr);
  const data   = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) {
    data[i] = (Math.random() * 2 - 1);
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  // 两级高通：去掉低频让声音更"刺"
  const hp1 = audioCtx.createBiquadFilter();
  hp1.type = 'highpass';
  hp1.frequency.value = 7500;

  const hp2 = audioCtx.createBiquadFilter();
  hp2.type = 'highpass';
  hp2.frequency.value = 4000;
  hp2.Q.value = 0.8;

  const env = audioCtx.createGain();
  env.gain.setValueAtTime((isAccent ? 0.9 : 0.6) * volume, time);
  env.gain.exponentialRampToValueAtTime(0.0001, time + decay);

  source.connect(hp1).connect(hp2).connect(env).connect(audioCtx.destination);
  source.start(time);
  source.stop(time + decay + 0.01);
}

// ─── 4. Kick — 底鼓，正弦扫频 ────────────────────────────────────────────────
function playKick(audioCtx: AudioContext, time: number, isAccent: boolean, volume: number) {
  const startFreq = isAccent ? 180 : 150;
  const decay     = isAccent ? 0.18 : 0.13;

  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(startFreq, time);
  osc.frequency.exponentialRampToValueAtTime(38, time + decay * 0.8);

  const env = audioCtx.createGain();
  env.gain.setValueAtTime((isAccent ? 2.2 : 1.6) * volume, time);
  env.gain.exponentialRampToValueAtTime(0.0001, time + decay);

  // 轻微噪声层：给 kick 一点"punch"的质感
  const nSize  = Math.floor(audioCtx.sampleRate * 0.015);
  const nBuf   = audioCtx.createBuffer(1, nSize, audioCtx.sampleRate);
  const nData  = nBuf.getChannelData(0);
  for (let i = 0; i < nSize; i++) {
    nData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nSize, 8);
  }
  const noise  = audioCtx.createBufferSource();
  noise.buffer = nBuf;
  const nGain  = audioCtx.createGain();
  nGain.gain.value = 0.3 * volume;

  osc.connect(env).connect(audioCtx.destination);
  noise.connect(nGain).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + decay + 0.01);
  noise.start(time);
  noise.stop(time + 0.015);
}

// ─── 5. Rim — 军鼓边击（rimshot），清脆 crack ────────────────────────────────
// 原理：中高频噪声 + 300Hz 正弦短脉冲混合，模拟鼓边敲击
function playRim(audioCtx: AudioContext, time: number, isAccent: boolean, volume: number) {
  const decay = isAccent ? 0.06 : 0.04;

  // 噪声层
  const nSize = Math.floor(audioCtx.sampleRate * decay * 1.2);
  const nBuf  = audioCtx.createBuffer(1, nSize, audioCtx.sampleRate);
  const nData = nBuf.getChannelData(0);
  for (let i = 0; i < nSize; i++) {
    nData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nSize, 5);
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = nBuf;

  const bp = audioCtx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = isAccent ? 2800 : 2200;
  bp.Q.value = 1.2;

  const nEnv = audioCtx.createGain();
  nEnv.gain.setValueAtTime((isAccent ? 1.2 : 0.85) * volume, time);
  nEnv.gain.exponentialRampToValueAtTime(0.0001, time + decay);

  noise.connect(bp).connect(nEnv).connect(audioCtx.destination);
  noise.start(time);
  noise.stop(time + decay + 0.005);

  // 正弦体鸣
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = isAccent ? 380 : 310;

  const oEnv = audioCtx.createGain();
  oEnv.gain.setValueAtTime(0.4 * volume, time);
  oEnv.gain.exponentialRampToValueAtTime(0.0001, time + decay * 0.6);

  osc.connect(oEnv).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + decay);
}

// ─── 6. Woodblock — 木鱼/木块，双泛音共鸣感 ─────────────────────────────────
// 类似真实木鱼：基音 + 明显的高次泛音，有硬木质感
function playWoodblock(audioCtx: AudioContext, time: number, isAccent: boolean, volume: number) {
  const baseFreq = isAccent ? 1100 : 820;
  const decay    = 0.06;

  // 基音
  const osc1 = audioCtx.createOscillator();
  osc1.type = 'sine';
  osc1.frequency.value = baseFreq;

  const env1 = audioCtx.createGain();
  env1.gain.setValueAtTime((isAccent ? 1.2 : 0.9) * volume, time);
  env1.gain.exponentialRampToValueAtTime(0.0001, time + decay);

  // 第二泛音（比基音高一个小三度，给木质共鸣感）
  const osc2 = audioCtx.createOscillator();
  osc2.type = 'sine';
  osc2.frequency.value = baseFreq * 1.45;

  const env2 = audioCtx.createGain();
  env2.gain.setValueAtTime(0.45 * (isAccent ? 1.2 : 0.9) * volume, time);
  env2.gain.exponentialRampToValueAtTime(0.0001, time + decay * 0.7);

  // 轻微噪声冲击（onset 质感）
  const nSize = Math.floor(audioCtx.sampleRate * 0.008);
  const nBuf  = audioCtx.createBuffer(1, nSize, audioCtx.sampleRate);
  const nData = nBuf.getChannelData(0);
  for (let i = 0; i < nSize; i++) {
    nData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nSize, 12);
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = nBuf;
  const nEnv  = audioCtx.createGain();
  nEnv.gain.value = 0.2 * volume;

  osc1.connect(env1).connect(audioCtx.destination);
  osc2.connect(env2).connect(audioCtx.destination);
  noise.connect(nEnv).connect(audioCtx.destination);

  osc1.start(time); osc1.stop(time + decay + 0.01);
  osc2.start(time); osc2.stop(time + decay + 0.01);
  noise.start(time); noise.stop(time + 0.01);
}

// ─── 7. Clap — 拍手，多层噪声自然感 ──────────────────────────────────────────
// 三层错位噪声叠加模拟真实拍手的"扑"感
function playClap(audioCtx: AudioContext, time: number, isAccent: boolean, volume: number) {
  const layers = isAccent ? 3 : 2;
  const vol    = (isAccent ? 1.1 : 0.8) * volume;

  for (let l = 0; l < layers; l++) {
    const offset = l * 0.008; // 每层错开 8ms
    const decay  = 0.08 + l * 0.02;

    const nSize = Math.floor(audioCtx.sampleRate * decay);
    const nBuf  = audioCtx.createBuffer(1, nSize, audioCtx.sampleRate);
    const nData = nBuf.getChannelData(0);
    for (let i = 0; i < nSize; i++) {
      nData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / nSize, 3 + l);
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = nBuf;

    const hp = audioCtx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 900 - l * 100;

    const bp = audioCtx.createBiquadFilter();
    bp.type = 'peaking';
    bp.frequency.value = 1200;
    bp.gain.value = 6;

    const env = audioCtx.createGain();
    env.gain.setValueAtTime(vol / layers, time + offset);
    env.gain.exponentialRampToValueAtTime(0.0001, time + offset + decay);

    noise.connect(hp).connect(bp).connect(env).connect(audioCtx.destination);
    noise.start(time + offset);
    noise.stop(time + offset + decay + 0.01);
  }
}

// ─── 8. Cowbell — 牛铃，经典 808 风格 ───────────────────────────────────────
// 两个失调方波 + bandpass，模拟金属共鸣
function playCowbell(audioCtx: AudioContext, time: number, isAccent: boolean, volume: number) {
  const decay = isAccent ? 0.5 : 0.28;

  [[562, 1.0], [845, 0.6]].forEach(([freq, amp]) => {
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = freq as number;

    const bp = audioCtx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 900;
    bp.Q.value = 2.5;

    const env = audioCtx.createGain();
    env.gain.setValueAtTime((amp as number) * (isAccent ? 0.9 : 0.65) * volume, time);
    env.gain.exponentialRampToValueAtTime(0.0001, time + decay);

    osc.connect(bp).connect(env).connect(audioCtx.destination);
    osc.start(time);
    osc.stop(time + decay + 0.01);
  });
}
