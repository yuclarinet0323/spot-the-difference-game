// A tiny deterministic random generator (mulberry32) so a given seed always
// deals the same decorative details: star positions, leaf drift and confetti.
// Gameplay differences themselves are fixed per scene and never randomised,
// which keeps every round fair and every screenshot reproducible.

export function createSeededRandom(seed) {
  let state = (seed >>> 0) || 1;
  return function nextRandom() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

export function randomRange(nextRandom, low, high) {
  return low + nextRandom() * (high - low);
}

export function pickSeededPoints(seed, count, width, height, margin) {
  const nextRandom = createSeededRandom(seed);
  const points = [];
  for (let index = 0; index < count; index += 1) {
    points.push({
      x: margin + nextRandom() * (width - margin * 2),
      y: margin + nextRandom() * (height - margin * 2),
      size: 0.6 + nextRandom() * 0.9,
      phase: nextRandom() * Math.PI * 2,
    });
  }
  return points;
}
