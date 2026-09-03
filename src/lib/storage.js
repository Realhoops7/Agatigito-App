// The app was originally built as a Claude.ai artifact, which provides a
// built-in `window.storage` key-value API. That API doesn't exist outside
// claude.ai, so this shim re-implements the same shape (get/set/delete/list,
// each returning { key, value } or null) backed by the browser's real
// localStorage. Every call in App.jsx that does `window.storage.get(...)`
// etc. keeps working unmodified once this file is imported in main.jsx.
//
// PRODUCTION NOTE: localStorage is per-device. For a real multi-device
// account system, swap this shim for calls to your backend API (e.g.
// fetch("/api/profile")) instead — the shape below is intentionally the
// same as a typical REST key-value endpoint, so that swap is mechanical.

const PREFIX = "agatigito:";

function safeParse(raw) {
  try {
    return raw;
  } catch {
    return null;
  }
}

export const storage = {
  async get(key) {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw === null) {
      // Mirrors the real window.storage API: a missing key throws rather
      // than resolving to null, so callers already wrap this in try/catch.
      throw new Error(`No value stored for key "${key}"`);
    }
    return { key, value: safeParse(raw) };
  },

  async set(key, value) {
    window.localStorage.setItem(PREFIX + key, value);
    return { key, value };
  },

  async delete(key) {
    const existed = window.localStorage.getItem(PREFIX + key) !== null;
    window.localStorage.removeItem(PREFIX + key);
    return { key, deleted: existed };
  },

  async list(prefix = "") {
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const fullKey = window.localStorage.key(i);
      if (fullKey && fullKey.startsWith(PREFIX + prefix)) {
        keys.push(fullKey.slice(PREFIX.length));
      }
    }
    return { keys, prefix };
  },
};
