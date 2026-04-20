let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  return ctx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.4,
  delay = 0
) {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ac.currentTime + delay);
    gain.gain.setValueAtTime(0, ac.currentTime + delay);
    gain.gain.linearRampToValueAtTime(volume, ac.currentTime + delay + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + duration);
    osc.start(ac.currentTime + delay);
    osc.stop(ac.currentTime + delay + duration);
  } catch {}
}

export function playCorrect() {
  playTone(523, 0.12, "sine", 0.35);
  playTone(659, 0.12, "sine", 0.35, 0.1);
  playTone(784, 0.2, "sine", 0.35, 0.2);
}

export function playWrong() {
  playTone(300, 0.08, "sawtooth", 0.3);
  playTone(220, 0.18, "sawtooth", 0.3, 0.08);
}

export function playCombo() {
  playTone(659, 0.1, "sine", 0.3);
  playTone(784, 0.1, "sine", 0.3, 0.1);
  playTone(1047, 0.15, "sine", 0.35, 0.2);
  playTone(1319, 0.2, "sine", 0.35, 0.35);
}

export function playTimerTick() {
  playTone(880, 0.06, "square", 0.15);
}

export function playWin() {
  const notes = [523, 659, 784, 1047, 1319];
  notes.forEach((freq, i) => {
    playTone(freq, 0.18, "sine", 0.35, i * 0.12);
  });
}

export function playLose() {
  playTone(400, 0.15, "sawtooth", 0.3);
  playTone(320, 0.15, "sawtooth", 0.3, 0.15);
  playTone(240, 0.3, "sawtooth", 0.3, 0.3);
}

export function playClick() {
  playTone(800, 0.05, "sine", 0.2);
}
