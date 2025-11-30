export function randomPause(min = 1, max = 3) {
  return Math.random() * (max - min) + min;
}
