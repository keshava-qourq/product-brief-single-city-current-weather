/**
 * unit_pref_store -- reads/writes the °C / °F preference
 * (localstorage_unit_preference) under its own storage key, separate from
 * the API key. Defaults to Celsius and never throws: private browsing (or
 * any other storage failure) just means the preference does not persist,
 * not that the app breaks.
 */
import type { UnitSystem } from "@/lib/types";

const STORAGE_KEY = "owm_unit_preference";
const DEFAULT_UNIT_SYSTEM: UnitSystem = "metric";

function isUnitSystem(value: string | null): value is UnitSystem {
  return value === "metric" || value === "imperial";
}

/** The saved unit preference, defaulting to metric (Celsius) if unset or unreadable. */
export function getUnitPreference(): UnitSystem {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isUnitSystem(stored) ? stored : DEFAULT_UNIT_SYSTEM;
  } catch {
    return DEFAULT_UNIT_SYSTEM;
  }
}

/** Save the unit preference. Silently does nothing if storage is unavailable. */
export function setUnitPreference(system: UnitSystem): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, system);
  } catch {
    // Private browsing or storage disabled -- the choice simply will not
    // survive a reload this session, which is preferable to throwing.
  }
}
