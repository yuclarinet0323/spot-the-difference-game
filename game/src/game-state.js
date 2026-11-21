// The rules of Twin Views, kept apart from drawing and input: rounds, the
// countdown, scoring, miss penalties, hints and the found set. main.js owns
// one GameState, feeds it clicks (in panel space) and clock ticks, and the
// renderer reads it back every frame.

import {
  HINTS_PER_GAME,
  HINT_COST_POINTS,
  HINT_PULSE_SECONDS,
  POINTS_PER_FIND,
  SCREEN_CLEAR,
  SCREEN_OVER,
  SCREEN_PLAY,
  SCREEN_TITLE,
  SCREEN_WIN,
  TIME_BONUS_PER_SECOND,
  WRONG_CLICK_PENALTY_SECONDS,
  WRONG_MARK_SECONDS,
} from './config.js';
import { SCENES, getScene } from './scenes.js';

export class GameState {
  constructor() {
    this.screen = SCREEN_TITLE;
    this.seed = 1;
    this.resetGame();
  }

  resetGame() {
    this.roundIndex = 0;
    this.score = 0;
    this.totalFound = 0;
    this.totalMisses = 0;
    this.hintsLeft = HINTS_PER_GAME;
    this.roundResults = [];
    this.startRound(0);
    this.message = 'Find every difference between the two pictures!';
  }

  startRound(roundIndex) {
    this.roundIndex = roundIndex;
    const scene = getScene(roundIndex);
    this.foundIds = new Set();
    this.timeLeft = scene.timeLimitSeconds;
    this.roundMisses = 0;
    this.wrongMarks = [];
    this.hintId = null;
    this.hintTimer = 0;
    this.lastFoundLabel = '';
    this.elapsedInRound = 0;
  }

  startGame(seed) {
    this.seed = seed || 1;
    this.resetGame();
    this.screen = SCREEN_PLAY;
    this.message = getScene(0).subtitle;
  }

  currentScene() {
    return getScene(this.roundIndex);
  }

  remainingCount() {
    return this.currentScene().differences.length - this.foundIds.size;
  }

  isFound(differenceId) {
    return this.foundIds.has(differenceId);
  }

  // One clock tick. Returns a short event name when something changed screen.
  update(deltaSeconds) {
    for (const mark of this.wrongMarks) mark.age += deltaSeconds;
    this.wrongMarks = this.wrongMarks.filter((mark) => mark.age < WRONG_MARK_SECONDS);
    if (this.hintTimer > 0) {
      this.hintTimer -= deltaSeconds;
      if (this.hintTimer <= 0) this.hintId = null;
    }
    if (this.screen !== SCREEN_PLAY) return null;
    this.elapsedInRound += deltaSeconds;
    this.timeLeft -= deltaSeconds;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.screen = SCREEN_OVER;
      this.message = 'Time up! The last differences slipped away.';
      return 'time-up';
    }
    return null;
  }

  // A click inside a picture, in panel coordinates (0..600, 0..520);
  // `panelSide` is 0 for Picture A and 1 for Picture B, so a wrong mark can
  // be drawn on the panel that was actually clicked.
  // Returns 'found', 'wrong' or null when the click should be ignored.
  clickPanel(panelX, panelY, panelSide = 0) {
    if (this.screen !== SCREEN_PLAY) return null;
    const scene = this.currentScene();
    let nearest = null;
    let nearestDistance = Infinity;
    for (const difference of scene.differences) {
      if (this.foundIds.has(difference.id)) continue;
      const distance = Math.hypot(panelX - difference.x, panelY - difference.y);
      if (distance <= difference.radius && distance < nearestDistance) {
        nearest = difference;
        nearestDistance = distance;
      }
    }
    if (nearest) {
      this.foundIds.add(nearest.id);
      this.totalFound += 1;
      this.score += POINTS_PER_FIND;
      this.lastFoundLabel = nearest.label;
      this.message = `Found it! ${nearest.label} +${POINTS_PER_FIND} points`;
      if (this.remainingCount() === 0) this.finishRound();
      return 'found';
    }
    this.roundMisses += 1;
    this.totalMisses += 1;
    this.timeLeft = Math.max(0, this.timeLeft - WRONG_CLICK_PENALTY_SECONDS);
    this.wrongMarks.push({ x: panelX, y: panelY, panel: panelSide, age: 0 });
    this.message = `Not there - ${WRONG_CLICK_PENALTY_SECONDS} seconds lost. Keep looking!`;
    if (this.timeLeft <= 0) {
      this.screen = SCREEN_OVER;
      this.message = 'Time up! The penalties caught up with you.';
    }
    return 'wrong';
  }

  finishRound() {
    const bonus = Math.ceil(this.timeLeft) * TIME_BONUS_PER_SECOND;
    this.score += bonus;
    this.roundResults.push({
      sceneTitle: this.currentScene().title,
      misses: this.roundMisses,
      timeLeft: Math.ceil(this.timeLeft),
      bonus,
    });
    if (this.roundIndex >= SCENES.length - 1) {
      this.screen = SCREEN_WIN;
      this.message = 'Every difference found. What sharp eyes!';
    } else {
      this.screen = SCREEN_CLEAR;
      this.message = `Round clear! Time bonus +${bonus}. Ready for the next picture?`;
    }
  }

  advanceFromClear() {
    if (this.screen !== SCREEN_CLEAR) return;
    this.startRound(this.roundIndex + 1);
    this.screen = SCREEN_PLAY;
    this.message = this.currentScene().subtitle;
  }

  useHint() {
    if (this.screen !== SCREEN_PLAY) return null;
    if (this.hintsLeft <= 0) {
      this.message = 'No hints left - trust your eyes!';
      return null;
    }
    const next = this.currentScene().differences.find((difference) => !this.foundIds.has(difference.id));
    if (!next) return null;
    this.hintsLeft -= 1;
    this.score = Math.max(0, this.score - HINT_COST_POINTS);
    this.hintId = next.id;
    this.hintTimer = HINT_PULSE_SECONDS;
    this.message = `A hint glimmers somewhere... (-${HINT_COST_POINTS} points)`;
    return next;
  }

  starRating() {
    if (this.totalMisses <= 3 && this.hintsLeft >= 1) return 3;
    if (this.totalMisses <= 8) return 2;
    return 1;
  }
}

export function formatClock(seconds) {
  const whole = Math.max(0, Math.ceil(seconds));
  const minutes = Math.floor(whole / 60);
  const rest = whole % 60;
  return `${minutes}:${String(rest).padStart(2, '0')}`;
}
