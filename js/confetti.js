// Confetti logic for Impossible Button
export function launchConfetti(confetti, randomBetween) {
  confetti.innerHTML = '';
  const colors = [
    'var(--accent)', 'var(--text)', 'var(--muted)', 'var(--bg)', 'var(--text)'
  ];
  for (let i=0; i<80; i++) {
    const div = document.createElement('div');
    div.className = 'confetti-piece';
    div.style.background = colors[i%colors.length];
    div.style.left = `${randomBetween(0, window.innerWidth-12)}px`;
    div.style.top = `-${randomBetween(0, 40)}px`;
    div.style.opacity = randomBetween(0.7, 1);
    div.style.transform = `rotate(${randomBetween(0,360)}deg)`;
    div.style.animation = `confetti-fall ${randomBetween(1.8, 3.5)}s cubic-bezier(.6,.3,.4,1) ${randomBetween(0,1.5)}s forwards`;
    confetti.appendChild(div);
  }
}
