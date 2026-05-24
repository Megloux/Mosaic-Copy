/**
 * Format seconds into a timer display string.
 * 65 → "1:05"
 * 5  → "0:05"
 * 0  → "0:00"
 */
export function formatTimer(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Format seconds into a human-readable label.
 * 90 → "1 min 30 sec"
 * 60 → "1 min"
 * 30 → "30 sec"
 */
export function formatDurationLabel(seconds: number): string {
  const clamped = Math.max(0, Math.floor(seconds));
  const m = Math.floor(clamped / 60);
  const s = clamped % 60;
  if (m === 0) return `${s} sec`;
  if (s === 0) return `${m} min`;
  return `${m} min ${s} sec`;
}
