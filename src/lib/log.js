import { STORAGE_LOG_KEY } from "../config.js";

export function logEvent(obj) {
  try {
    const raw = localStorage.getItem(STORAGE_LOG_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push(obj);
    if (list.length > 500) {
      list.splice(0, list.length - 500);
    }
    localStorage.setItem(STORAGE_LOG_KEY, JSON.stringify(list));
  } catch (e) {
    // localStorage might be full or disabled in private browsing
  }
}
