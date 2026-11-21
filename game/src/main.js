// Twin Views entry point: owns the canvas, the game clock and the wiring
// between the game state, the renderer, the input handlers and the sounds.
// With a ?shot= query it stages a fixed screenshot scene instead of live
// play (see shots.js); otherwise it starts on the title screen and runs.

import { VIEW_HEIGHT, VIEW_WIDTH } from './config.js';
import { GameState } from './game-state.js';
import { SoundEffects } from './audio.js';
import { drawGame } from './render.js';
import { attachInput, createCursor } from './input.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');

canvas.width = VIEW_WIDTH;
canvas.height = VIEW_HEIGHT;

const state = new GameState();
const cursor = createCursor();
const sounds = new SoundEffects();

const params = new URLSearchParams(window.location.search);
const shotName = params.get('shot');
const seed = Number(params.get('seed') || '1') || 1;
const isShotMode = shotName !== null;
if (isShotMode) stageShot(shotName, state, seed);
else state.seed = seed;

function announce() {
  if (status) status.textContent = state.message;
}

const actions = {
  unlockAudio() {
    if (!isShotMode) sounds.unlock();
  },
  clickPanel(panelX, panelY, panelSide) {
    const result = state.clickPanel(panelX, panelY, panelSide);
    if (result === 'found') {
      sounds.playFind();
      if (state.screen !== 'play') sounds.playClear();
    } else if (result === 'wrong') {
      sounds.playWrong();
    }
    announce();
  },
  useHint() {
    if (state.useHint()) sounds.playHint();
    announce();
  },
  startGame() {
    sounds.playClick();
    state.startGame(seed);
    announce();
  },
  advance() {
    sounds.playClick();
    state.advanceFromClear();
    announce();
  },
};

attachInput(canvas, state, cursor, actions);
announce();

let lastTimestamp = performance.now();
function frame(timestamp) {
  const deltaSeconds = Math.min(0.1, (timestamp - lastTimestamp) / 1000);
  lastTimestamp = timestamp;
  if (!isShotMode) {
    const event = state.update(deltaSeconds);
    if (event === 'time-up') {
      sounds.playWrong();
      announce();
    }
  }
  drawGame(ctx, state, cursor, timestamp / 1000);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
