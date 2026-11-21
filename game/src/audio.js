// Tiny generated sound effects over WebAudio: a two-note chime when a
// difference is found, a low buzz for a miss, and a short arpeggio when a
// round clears. No audio files are loaded; every tone is synthesised, and
// the context is only created after the player's first click or key press,
// as browsers require.

export class SoundEffects {
  constructor() {
    this.context = null;
  }

  unlock() {
    if (this.context) {
      if (this.context.state === 'suspended') this.context.resume();
      return;
    }
    const AudioCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtor) return;
    this.context = new AudioCtor();
  }

  tone(frequency, startOffset, duration, type, volume) {
    if (!this.context) return;
    const start = this.context.currentTime + startOffset;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(this.context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.05);
  }

  playFind() {
    this.tone(880, 0, 0.14, 'sine', 0.16);
    this.tone(1318, 0.09, 0.22, 'sine', 0.16);
  }

  playWrong() {
    this.tone(160, 0, 0.2, 'square', 0.07);
  }

  playHint() {
    this.tone(1568, 0, 0.18, 'triangle', 0.1);
  }

  playClear() {
    this.tone(659, 0, 0.14, 'sine', 0.14);
    this.tone(880, 0.11, 0.14, 'sine', 0.14);
    this.tone(1174, 0.22, 0.26, 'sine', 0.14);
  }

  playClick() {
    this.tone(520, 0, 0.06, 'triangle', 0.08);
  }
}
