// Utility functions for Impossible Button
export function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export function randomBetween(a, b) {
  return Math.random() * (b - a) + a;
}
