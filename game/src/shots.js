// Screenshot staging behind ?shot=start|play|festival|end. Each scene puts
// the real GameState into a believable mid-game moment - some differences
// already found and ringed, several still hiding, the timer part-spent and
// the REMAINING counter showing exactly how many are left - so a screenshot
// is a true render of the game, reproducible from its seed alone.

import { SCREEN_PLAY, SCREEN_TITLE, SCREEN_WIN } from './config.js';
import { getScene } from './scenes.js';

function stageFoundDifferences(state, roundIndex, foundCount, timeLeft, score, misses) {
  state.startRound(roundIndex);
  const scene = getScene(roundIndex);
  for (let index = 0; index < foundCount; index += 1) {
    state.foundIds.add(scene.differences[index].id);
  }
  state.totalFound = foundCount;
  state.timeLeft = timeLeft;
  state.score = score;
  state.totalMisses = misses;
  state.roundMisses = misses;
  state.screen = SCREEN_PLAY;
  const lastFound = scene.differences[foundCount - 1];
  state.message = lastFound
    ? `Found it! ${lastFound.label} +100 points`
    : scene.subtitle;
}

export function stageShot(name, state, seed) {
  state.resetGame();
  state.seed = seed || 1;
  if (name === 'play') {
    // The cover moment: Round 2's forest cabin, three differences ringed,
    // four still hiding, clock at 0:47.
    stageFoundDifferences(state, 1, 3, 47.4, 340, 1);
    state.roundResults = [{ sceneTitle: getScene(0).title, misses: 1, timeLeft: 22, bonus: 110 }];
    return;
  }
  if (name === 'festival') {
    // Round 3 late in the hunt: two found, six still hiding, clock low.
    stageFoundDifferences(state, 2, 2, 31.8, 890, 2);
    state.hintsLeft = 2;
    state.roundResults = [
      { sceneTitle: getScene(0).title, misses: 1, timeLeft: 22, bonus: 110 },
      { sceneTitle: getScene(1).title, misses: 2, timeLeft: 14, bonus: 70 },
    ];
    return;
  }
  if (name === 'end') {
    // The victory card after a full clear of all three rounds.
    state.startRound(2);
    const finalScene = getScene(2);
    for (const difference of finalScene.differences) state.foundIds.add(difference.id);
    state.totalFound = 22;
    state.totalMisses = 4;
    state.timeLeft = 9;
    state.score = 2745;
    state.hintsLeft = 1;
    state.roundResults = [
      { sceneTitle: getScene(0).title, misses: 1, timeLeft: 22, bonus: 110 },
      { sceneTitle: getScene(1).title, misses: 2, timeLeft: 14, bonus: 70 },
      { sceneTitle: getScene(2).title, misses: 1, timeLeft: 9, bonus: 45 },
    ];
    state.screen = SCREEN_WIN;
    state.message = 'Every difference found. What sharp eyes!';
    return;
  }
  // 'start' and anything else: the title card over Round 1's pictures.
  state.startRound(0);
  state.screen = SCREEN_TITLE;
  state.message = 'Find every difference between the two pictures!';
}
