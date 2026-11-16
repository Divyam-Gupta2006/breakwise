// Calming Web Audio API chimes for BreakWise
export const playGentleChime = (type = "focus-end") => {
  if (typeof window === "undefined") return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const now = ctx.currentTime;
    const notes = type === "focus-end" ? [440, 554.37, 659.25] : [659.25, 554.37, 440]; // A major chime

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.18);

      gain.gain.setValueAtTime(0, now + idx * 0.18);
      gain.gain.linearRampToValueAtTime(0.15, now + idx * 0.18 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.18 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.18);
      osc.stop(now + idx * 0.18 + 1.3);
    });
  } catch (e) {
    // Graceful fallback if audio context is blocked
    console.warn("Chime playback notice:", e);
  }
};
