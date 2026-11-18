import { STORAGE_STATE_KEY } from "../config.js";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.version === 1) {
      return parsed;
    }
    return null;
  } catch (e) {
    return null;
  }
}

export function saveState(state) {
  try {
    if (!state) {
      localStorage.removeItem(STORAGE_STATE_KEY);
    } else {
      localStorage.setItem(STORAGE_STATE_KEY, JSON.stringify(state));
    }
  } catch (e) {
    // localStorage might be unavailable
  }
}

export function clearState() {
  try {
    localStorage.removeItem(STORAGE_STATE_KEY);
  } catch (e) {
    // ignore
  }
}
