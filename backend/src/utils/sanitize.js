export function sanitizeText(value) {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .trim();
}

export function sanitizeEmail(value) {
  return sanitizeText(value).toLowerCase();
}
