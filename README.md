# Impossible Button

> The button you *wish* you could click. But you can't. Or can you? (No, you can't.)

## Project Structure

```
Impossible Button/
├── index.html
├── styles/
│   └── style.css
├── js/
│   ├── script.js         # Main orchestrator (ES module)
│   ├── escapeButton.js   # Button escape logic (edge-aware)
│   ├── confetti.js       # Confetti effect
│   ├── utils.js          # Utility functions (clamp, randomBetween)
│   └── gameState.js      # Centralized game state
└── README.md
```

## Features
- **Impossible Button:** It runs, it hides, it mocks you. Good luck.
- **Minimal Terminal Theme:** Ghost White dark palette with a single red accent. Scanlines and animated grid for retro vibes.
- **Modular Codebase:** All logic split into ES modules for maintainability (escape logic, confetti, utils, state).
- **Edge-Aware Escape:** Button never gets stuck in corners—always escapes toward open space.
- **Taunts:** 20+ escalating insults. The button is meaner than your ex.
- **Rage Mode:** After 15 fails, the button goes red and shakes. You made it mad.
- **Give Up Panel:** After 8 attempts, you can surrender. Weak.
- **Victory (Rare):** 0.8% chance to win, 2% after 40 tries. Confetti if you do. (You won't.)
- **Konami Code:** ↑↑↓↓←→←→BA for 5 seconds of "easy mode". Shameful.
- **Mobile Support:** Button teleports instead of running. Still impossible.
- **No Frameworks:** Pure HTML, CSS, JS. No npm, no dependencies, no mercy.


<!-- ## Live Demo -->
<!-- https://your-actual-demo-link.com -->

## How to Run
Just open `index.html` in your browser. That's it. No setup, no dependencies, no excuses.

## Tech Stack
- HTML5
- CSS3 (with Google Fonts)
- JavaScript (Vanilla, ES Modules)

## Final Words
If you actually win, go buy a lottery ticket. Or maybe... just maybe... touch grass?
Oh, and if you find a bug, it’s probably a feature. Enjoy!
