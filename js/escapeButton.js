// Handles the button's escape logic
export function escapeButton(e, state) {
  const {
    impossibleBtn, btnPos, btnSize, panicRadius, escapeSpeed, rageMode, easyMode,
    setBtnPosition, updateAttemptCount, showGiveUpPanel, activateRageMode, updateTaunt, clamp, randomBetween
  } = state;
  if (easyMode) return;
  // Always increment attempts and update UI on every interaction
  state.attempts++;
  updateAttemptCount();
  if (state.attempts > 8) showGiveUpPanel();
  if (state.attempts >= 15 && !rageMode) activateRageMode();
  updateTaunt();
  let mx, my;
  if (e.touches) {
    // Touch: teleport
    btnPos.x = randomBetween(40, window.innerWidth-btnSize-40);
    btnPos.y = randomBetween(60, window.innerHeight-btnSize-40);
    setBtnPosition(btnPos.x, btnPos.y);
    return;
  } else {
    mx = e.clientX;
    my = e.clientY;
  }
  const rect = impossibleBtn.getBoundingClientRect();
  const bx = rect.left + rect.width/2;
  const by = rect.top + rect.height/2;
  const dist = Math.hypot(mx-bx, my-by);
  if (dist < panicRadius) {
    // Escape!
    if (state.panicRadius < 260) state.panicRadius += 4;
    if (state.escapeSpeed < 5) state.escapeSpeed += 0.12;
    // Direction away from mouse
    let dx = bx - mx;
    let dy = by - my;
    let mag = Math.hypot(dx, dy) || 1;
    dx /= mag;
    dy /= mag;
    // Add random wobble
    dx += randomBetween(-0.25, 0.25);
    dy += randomBetween(-0.25, 0.25);
    // Edge-aware: bias away from edges
    const margin = 40;
    if (btnPos.x < margin) dx = Math.abs(dx);
    if (btnPos.x > window.innerWidth - btnSize - margin) dx = -Math.abs(dx);
    if (btnPos.y < margin) dy = Math.abs(dy);
    if (btnPos.y > window.innerHeight - btnSize - margin) dy = -Math.abs(dy);
    // Move
    let moveDist = state.panicRadius * state.escapeSpeed * randomBetween(0.85, 1.15);
    btnPos.x += dx * moveDist;
    btnPos.y += dy * moveDist;
    // Clamp to viewport with margin
    btnPos.x = clamp(btnPos.x, margin, window.innerWidth-btnSize-margin);
    btnPos.y = clamp(btnPos.y, margin, window.innerHeight-btnSize-margin);
    // If stuck at edge, forcibly move away
    if (btnPos.x <= margin || btnPos.x >= window.innerWidth-btnSize-margin || btnPos.y <= margin || btnPos.y >= window.innerHeight-btnSize-margin) {
      // Pick a random direction toward center
      const centerX = window.innerWidth/2;
      const centerY = window.innerHeight/2;
      let awayDx = centerX - btnPos.x;
      let awayDy = centerY - btnPos.y;
      let mag = Math.hypot(awayDx, awayDy) || 1;
      awayDx /= mag;
      awayDy /= mag;
      btnPos.x += awayDx * (btnSize + 30);
      btnPos.y += awayDy * (btnSize + 30);
      btnPos.x = clamp(btnPos.x, margin, window.innerWidth-btnSize-margin);
      btnPos.y = clamp(btnPos.y, margin, window.innerHeight-btnSize-margin);
    }
    setBtnPosition(btnPos.x, btnPos.y);
    state.btnEscaped = true;
    // After moving, check if still within panic radius (corner stuck case)
    const newRect = impossibleBtn.getBoundingClientRect();
    const newBx = newRect.left + newRect.width/2;
    const newBy = newRect.top + newRect.height/2;
    const newDist = Math.hypot(mx-newBx, my-newBy);
    if (newDist < panicRadius) {
      // Use same win probability as tryClickButton
      let winChance = state.attempts >= 40 ? 0.02 : 0.008;
      if (Math.random() < winChance && typeof state.showVictory === 'function') {
        state.showVictory();
      }
    }
  }
}
