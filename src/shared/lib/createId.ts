let fallbackCounter = 0;

/**
 * Unique id for points and toasts.
 * `crypto.randomUUID` exists only in a secure context (https or localhost), while a tablet demo
 * is often opened as http://192.168.x.x — then fall back to time + counter + random suffix.
 */
export function createId(): string {
  if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  fallbackCounter += 1;
  const random = Math.random().toString(36).slice(2, 10);

  return `${Date.now().toString(36)}-${fallbackCounter.toString(36)}-${random}`;
}
