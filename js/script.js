import { escapeButton } from './escapeButton.js';
import { clamp, randomBetween } from './utils.js';
import { launchConfetti } from './confetti.js';
import { state } from './gameState.js';

// DOM assignments
state.impossibleBtn = document.getElementById('impossibleBtn');
state.mainScreen = document.getElementById('mainScreen');
state.victoryScreen = document.getElementById('victoryScreen');
state.surrenderScreen = document.getElementById('surrenderScreen');
state.giveUpBtn = document.getElementById('giveUpBtn');
state.retryBtn = document.getElementById('retryBtn');
state.victoryRestartBtn = document.getElementById('victoryRestartBtn');
state.victoryAttempts = document.getElementById('victoryAttempts');
state.tauntText = document.getElementById('tauntText');
state.confetti = document.getElementById('confetti');
if (!state.impossibleBtn || !state.mainScreen || !state.victoryScreen || !state.surrenderScreen || !state.giveUpBtn || !state.retryBtn || !state.victoryRestartBtn || !state.victoryAttempts || !state.tauntText || !state.confetti) {
  console.error('One or more DOM elements are missing. Please check your HTML structure.');
}

const TAUNTS = [
  "Go on, try it...",
  "Too slow!",
  "Did you blink?",
  "Maybe next time.",
  "Getting warmer... not!",
  "You call that an attempt?",
  "My grandma's faster.",
  "Try using both hands!",
  "Is your mouse broken?",
  "This is getting embarrassing.",
  "You sure you want to keep going?",
  "The button is disappointed in you.",
  "You missed by a mile!",
  "Are you even trying?",
  "You can't win.",
  "Rage mode unlocked!",
  "Now I'm angry.",
  "You made it personal.",
  "Give up yet?",
  "This is your life now."
];
const RAGE_TAUNTS = [
  "You mad, bro?",
  "Red means stop!",
  "You're only making it worse.",
  "The button is laughing at you.",
  "You can't catch me!"
];
let lastTauntIndex = -1;
let lastRageTauntIndex = -1;
const KONAMI = [38,38,40,40,37,39,37,39,66,65];
let konamiIndex = 0;

function setBtnPosition(x, y) {
  state.impossibleBtn.style.position = 'fixed';
  state.impossibleBtn.style.left = `${x}px`;
  state.impossibleBtn.style.top = `${y}px`;
}
function showScreen(screen) {
  [state.mainScreen, state.victoryScreen, state.surrenderScreen].forEach(s => s.classList.remove('show'));
  screen.classList.add('show');
}
// No-op: give up panel removed
function showGiveUpPanel() {}
function hideGiveUpPanel() {}
function updateTaunt() {
  if (state.rageMode) {
    // Pick a random rage taunt, not repeating the last
    let idx;
    do {
      idx = Math.floor(Math.random() * RAGE_TAUNTS.length);
    } while (idx === lastRageTauntIndex && RAGE_TAUNTS.length > 1);
    lastRageTauntIndex = idx;
    state.tauntText.textContent = RAGE_TAUNTS[idx];
  } else {
    // Pick a random taunt, not repeating the last
    let idx;
    do {
      idx = Math.floor(Math.random() * TAUNTS.length);
    } while (idx === lastTauntIndex && TAUNTS.length > 1);
    lastTauntIndex = idx;
    state.tauntText.textContent = TAUNTS[idx];
  }
}
// No-op: attempts counter removed from UI
function updateAttemptCount() {}
function activateRageMode() {
  if (!state.rageMode) {
    state.rageMode = true;
    state.impossibleBtn.classList.add('rage');
    updateTaunt();
  }
}
function deactivateRageMode() {
  state.rageMode = false;
  state.impossibleBtn.classList.remove('rage');
  updateTaunt();
}
function activateEasyMode() {
  state.easyMode = true;
  state.impossibleBtn.style.transition = 'none';
  state.impossibleBtn.style.pointerEvents = 'auto';
  state.tauntText.textContent = 'Easy mode? Really? Pathetic.';
  state.impossibleBtn.style.opacity = '1';
  state.impossibleBtn.style.filter = 'none';
  state.impossibleBtn.style.transform = 'none';
  state.impossibleBtn.classList.remove('rage');
  setTimeout(() => {
    state.easyMode = false;
    state.impossibleBtn.style.transition = '';
    state.impossibleBtn.style.pointerEvents = '';
    updateTaunt();
    if (state.rageMode) state.impossibleBtn.classList.add('rage');
  }, 5000);
}
function showVictory() {
  showScreen(state.victoryScreen);
  state.victoryAttempts.textContent = state.attempts;
  launchConfetti(state.confetti, randomBetween);
}
function showSurrender() {
  showScreen(state.surrenderScreen);
}
function resetGame() {
  state.attempts = 0;
  state.rageMode = false;
  state.easyMode = false;
  state.panicRadius = 80;
  state.escapeSpeed = 1.5;
  state.btnEscaped = false;
  lastTauntIndex = -1;
  lastRageTauntIndex = -1;
  state.impossibleBtn.classList.remove('rage');
  state.impossibleBtn.style.transition = '';
  state.impossibleBtn.style.pointerEvents = '';
  state.impossibleBtn.style.opacity = '';
  state.impossibleBtn.style.filter = '';
  state.impossibleBtn.style.transform = '';
  state.impossibleBtn.style.left = '';
  state.impossibleBtn.style.top = '';
  setBtnPosition(window.innerWidth/2-state.btnSize/2, window.innerHeight/2-state.btnSize/2);
  updateTaunt();
  showScreen(state.mainScreen);
  state.confetti.innerHTML = '';
}

// Confetti animation (keep in main for now)
const style = document.createElement('style');
style.textContent = `
@keyframes confetti-fall {
  0% { transform: translateY(0) rotate(0deg); }
  100% { transform: translateY(100vh) rotate(360deg); }
}`;
document.head.appendChild(style);

// Button click logic
function tryClickButton(e) {
  if (state.easyMode) {
    showVictory();
    return;
  }
  // 0.8% win chance, 2% after 40 attempts
  let winChance = state.attempts >= 40 ? 0.02 : 0.008;
  if (Math.random() < winChance) {
    showVictory();
  } else {
    escapeButton(e, {
      ...state,
      setBtnPosition,
      updateAttemptCount,
      showGiveUpPanel,
      activateRageMode,
      updateTaunt,
      clamp,
      randomBetween,
      showVictory
    });
  }
}

// Konami code
window.addEventListener('keydown', e => {
  if (e.keyCode === KONAMI[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === KONAMI.length) {
      activateEasyMode();
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

// Event listeners
state.impossibleBtn.addEventListener('mousemove', (e) => escapeButton(e, {
  ...state,
  setBtnPosition,
  updateAttemptCount,
  showGiveUpPanel,
  activateRageMode,
  updateTaunt,
  clamp,
  randomBetween,
  showVictory
}));
state.impossibleBtn.addEventListener('touchstart', (e) => escapeButton(e, {
  ...state,
  setBtnPosition,
  updateAttemptCount,
  showGiveUpPanel,
  activateRageMode,
  updateTaunt,
  clamp,
  randomBetween,
  showVictory
}));
state.impossibleBtn.addEventListener('click', tryClickButton);
state.giveUpBtn.addEventListener('click', () => {
  showScreen(state.surrenderScreen);
});
state.retryBtn.addEventListener('click', resetGame);
if (state.victoryRestartBtn) {
  state.victoryRestartBtn.addEventListener('click', resetGame);
}
window.addEventListener('resize', () => {
  setBtnPosition(window.innerWidth/2-state.btnSize/2, window.innerHeight/2-state.btnSize/2);
});
// Init
resetGame();
