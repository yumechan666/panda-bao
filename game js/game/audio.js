export async function createGameAudio(sdk) {
  let managed = null;
  let unlocked = false;

  try {
    managed = await sdk.audio.getContext();
  } catch {
    return { unlock() {}, play() {}, destroy() {} };
  }

  function tone(frequency, duration, type = "sine", volume = 0.08, endFrequency = frequency) {
    const context = managed.context;
    if (!unlocked || context.state !== "running") return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, endFrequency), context.currentTime + duration);
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + duration);
  }

  function noise(duration, volume, cutoff = 900) {
    const context = managed.context;
    if (!unlocked || context.state !== "running") return;
    const length = Math.ceil(context.sampleRate * duration);
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) channel[index] = Math.random() * 2 - 1;
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    gain.gain.setValueAtTime(volume, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + duration);
    source.connect(filter).connect(gain).connect(context.destination);
    source.start();
  }

  return {
    unlock() {
      void managed.unlock().then(() => { unlocked = true; }).catch(() => {});
    },
    play(name) {
      if (name === "jump") tone(240, 0.1, "triangle", 0.05, 420);
      if (name === "staff") { noise(0.07, 0.08, 1400); tone(170, 0.08, "square", 0.025, 95); }
      if (name === "slam") { noise(0.18, 0.14, 500); tone(90, 0.22, "sine", 0.12, 45); }
      if (name === "pickup") { tone(520, 0.12, "sine", 0.07, 940); setTimeout(() => tone(780, 0.12, "sine", 0.05, 1170), 55); }
      if (name === "hurt") { noise(0.09, 0.1, 800); tone(150, 0.14, "sawtooth", 0.045, 70); }
      if (name === "swing") tone(180, 0.18, "triangle", 0.05, 620);
      if (name === "nap") tone(260, 0.45, "sine", 0.035, 190);
      if (name === "gate") { noise(0.35, 0.08, 330); tone(75, 0.4, "sine", 0.07, 48); }
    },
    destroy() {
      void managed.dispose().catch(() => {});
    },
  };
}
