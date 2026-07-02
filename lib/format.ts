/** "Jun 28" — card/table date per design (Space Mono). */
export function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '—';
  }
}

/** "Jun 28, 2026, 4:12 PM" — detail views. */
export function formatDateTime(value: string) {
  try {
    return new Date(value).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

/** "2 min ago" — activity feed. */
export function timeAgo(value: string) {
  const then = new Date(value).getTime();
  if (Number.isNaN(then)) return '—';
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(value);
}

export function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join('') || '?';
}

/** Avatar gradient rotation per design (cyan / violet / emerald). */
const AVATAR_GRADIENTS = [
  'linear-gradient(160deg, #7dd3fc, #2f9bd4)',
  'linear-gradient(160deg, #c8a0f0, #9760d6)',
  'linear-gradient(160deg, #4fe0b0, #1f9d78)',
];
const AVATAR_TEXT = ['#05121c', '#1a1030', '#05201a'];

export function avatarStyle(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  const index = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return { background: AVATAR_GRADIENTS[index], color: AVATAR_TEXT[index] };
}
