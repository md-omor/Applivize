/**
 * Normalizes a score to ensure it fits within valid bounds [0, max].
 * - Rounds to nearest integer
 * - Clamps negative values to 0
 * - Clamps values exceeding max to max
 */
export function normalizeScore(score: number, max: number = 100): number {
  const rounded = Math.round(score);
  return Math.min(Math.max(rounded, 0), max);
}
