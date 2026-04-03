type AuthInvalidListener = () => void;

const listeners = new Set<AuthInvalidListener>();

export function subscribeAuthInvalid(fn: AuthInvalidListener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function emitAuthInvalid(): void {
  listeners.forEach((fn) => fn());
}
