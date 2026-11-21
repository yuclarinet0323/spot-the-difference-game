// Scene catalogue for Twin Views. Each scene is one round: a hand-drawn picture
// (painted twice by scene-paint.js, once per panel) plus the list of differences
// between the left and right versions. Difference coordinates live in panel
// space (600x520, the size of one picture) and `radius` is the forgiving click
// target around the changed detail. `label` is the cheerful line announced when
// the player finds that difference.

export const SCENES = [
  {
    id: 'seaside-cafe',
    title: 'Round 1 - Sunny Seaside Cafe',
    subtitle: 'A sleepy cafe where the sea meets the sand. Seven things changed.',
    timeLimitSeconds: 100,
    differences: [
      { id: 'sun-glasses', x: 498, y: 66, radius: 34, label: 'The sun put on sunglasses!' },
      { id: 'missing-cloud', x: 118, y: 58, radius: 38, label: 'A whole cloud drifted away!' },
      { id: 'sail-colour', x: 96, y: 282, radius: 30, label: 'The sailboat repainted its sail!' },
      { id: 'umbrella-colour', x: 485, y: 356, radius: 38, label: 'The beach umbrella changed colour!' },
      { id: 'scoop-flavour', x: 296, y: 348, radius: 24, label: 'The top scoop changed flavour!' },
      { id: 'cat-cap', x: 428, y: 424, radius: 26, label: 'The cafe cat lost its cap!' },
      { id: 'starfish-gone', x: 176, y: 462, radius: 22, label: 'The starfish crawled back to sea!' },
    ],
  },
  {
    id: 'forest-cabin',
    title: 'Round 2 - Forest Cabin Library',
    subtitle: 'A tiny library cabin deep in the autumn woods. Seven things changed.',
    timeLimitSeconds: 85,
    differences: [
      { id: 'moon-phase', x: 516, y: 58, radius: 28, label: 'The moon filled out to full!' },
      { id: 'smoke-hearts', x: 428, y: 84, radius: 32, label: 'The chimney smoke turned to hearts!' },
      { id: 'owl-eyes', x: 92, y: 108, radius: 27, label: 'The owl fell asleep!' },
      { id: 'curtain-colour', x: 230, y: 278, radius: 30, label: 'The cabin curtains were swapped!' },
      { id: 'lantern-lit', x: 372, y: 302, radius: 21, label: 'The porch lantern went out!' },
      { id: 'pumpkin-count', x: 306, y: 444, radius: 25, label: 'One pumpkin rolled away!' },
      { id: 'mushroom-spots', x: 92, y: 458, radius: 25, label: 'The mushroom lost its spots!' },
    ],
  },
  {
    id: 'lantern-festival',
    title: 'Round 3 - Night Lantern Festival',
    subtitle: 'The busiest night of the year. Eight smaller changes hide in the crowd.',
    timeLimitSeconds: 75,
    differences: [
      { id: 'firework-colour', x: 108, y: 78, radius: 30, label: 'The big firework burst in new colours!' },
      { id: 'lantern-pattern', x: 300, y: 128, radius: 21, label: 'One lantern traded dots for stripes!' },
      { id: 'star-gone', x: 522, y: 178, radius: 17, label: 'A bright star winked out!' },
      { id: 'banner-emblem', x: 325, y: 304, radius: 24, label: 'The stall banner changed its emblem!' },
      { id: 'mask-wink', x: 472, y: 328, radius: 23, label: 'The fox mask is winking!' },
      { id: 'goldfish-count', x: 182, y: 396, radius: 22, label: 'One goldfish jumped the tank!' },
      { id: 'candy-colour', x: 432, y: 428, radius: 24, label: 'The cotton candy changed flavour!' },
      { id: 'drum-stripe', x: 540, y: 458, radius: 21, label: 'The festival drum lost its stripe!' },
    ],
  },
];

export function getScene(roundIndex) {
  return SCENES[Math.max(0, Math.min(SCENES.length - 1, roundIndex))];
}

export function totalDifferences() {
  return SCENES.reduce((sum, scene) => sum + scene.differences.length, 0);
}
