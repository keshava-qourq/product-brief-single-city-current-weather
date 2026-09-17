/**
 * key_store -- setApiKey/getApiKey/hasApiKey backed by localStorage under a
 * fixed key name (localstorage_api_key), with an in-memory cache so a
 * blocked or throwing localStorage (private browsing, disabled storage)
 * only costs one failed read instead of crashing every call this session.
 *
 * Empty strings and the placeholder shown in the Settings field hint are
 * both treated as "no key saved" -- a key that is only whitespace, or the
 * example text a user might paste by mistake, should behave exactly like no
 * key at all.
 */

const STORAGE_KEY = "owm_api_key";

const PLACEHOLDER_VALUES = new Set(["your_api_key_here", "your-api-key-here"]);

// `undefined` means "not loaded from storage yet"; `null` means "loaded, and
// there is no usable key". Using the same sentinel for both would make the
// first real read indistinguishable from an already-checked empty value.
let memoryCache: string | null | undefined;

function isUsableKey(value: string | null | undefined): value is string {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed.length === 0) return false;
  return !PLACEHOLDER_VALUES.has(trimmed.toLowerCase());
}

function readFromStorage(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeToStorage(value: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage unavailable (e.g. private browsing) -- the in-memory cache
    // still lets this session behave correctly.
  }
}

function removeFromStorage(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to do if storage cannot be touched.
  }
}

/** Save (or, given an empty/placeholder value, clear) the API key. */
export function setApiKey(value: string): void {
  const trimmed = value.trim();
  if (!isUsableKey(trimmed)) {
    removeFromStorage();
    memoryCache = null;
    return;
  }
  writeToStorage(trimmed);
  memoryCache = trimmed;
}

/** The saved API key, or null if none is saved (or storage is unavailable). */
export function getApiKey(): string | null {
  if (memoryCache !== undefined) return memoryCache;
  const stored = readFromStorage();
  memoryCache = isUsableKey(stored) ? stored.trim() : null;
  return memoryCache;
}

/** Whether a usable API key is currently saved. */
export function hasApiKey(): boolean {
  return getApiKey() !== null;
}

/** Remove any saved API key. */
export function clearApiKey(): void {
  removeFromStorage();
  memoryCache = null;
}
