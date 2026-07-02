const TOKEN_KEY = 'taskforge_token';
const USER_KEY = 'taskforge_user';
const LEGACY_TOKEN_KEY = 'glacier_task_engine_token';
const LEGACY_USER_KEY = 'glacier_task_engine_user';

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(LEGACY_TOKEN_KEY);
}

export function setStoredToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(LEGACY_TOKEN_KEY);
}

export function getStoredUser<T>() {
  const raw = localStorage.getItem(USER_KEY) ?? localStorage.getItem(LEGACY_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(LEGACY_USER_KEY);
    return null;
  }
}

export function setStoredUser(user: unknown) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.removeItem(LEGACY_USER_KEY);
}

export function clearStoredUser() {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(LEGACY_USER_KEY);
}
