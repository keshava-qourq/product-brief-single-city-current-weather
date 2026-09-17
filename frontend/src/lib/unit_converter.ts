/**
 * unit_converter -- pure helpers for converting a metric weather reading
 * (always what the API returns, since units=metric is fixed) into whichever
 * unit system the user has chosen for display. No side effects, no state.
 */
import type { UnitSystem } from "@/lib/types";

const METERS_PER_SECOND_TO_MPH = 2.23694;

function celsiusToFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32;
}

/** Temperature (or feels-like) in the requested system, rounded to a whole number. */
export function convertTemperature(celsius: number, system: UnitSystem): number {
  const value = system === "imperial" ? celsiusToFahrenheit(celsius) : celsius;
  return Math.round(value);
}

/** Wind speed in the requested system, rounded to one decimal place. */
export function convertWindSpeed(metersPerSecond: number, system: UnitSystem): number {
  const value = system === "imperial" ? metersPerSecond * METERS_PER_SECOND_TO_MPH : metersPerSecond;
  return Math.round(value * 10) / 10;
}

/** The degree symbol for the given system: °C or °F. */
export function temperatureUnit(system: UnitSystem): string {
  return system === "imperial" ? "°F" : "°C";
}

/** The wind speed unit label for the given system: m/s or mph. */
export function windSpeedUnit(system: UnitSystem): string {
  return system === "imperial" ? "mph" : "m/s";
}

/** The spelled-out temperature unit name, for aria labels: Celsius or Fahrenheit. */
export function temperatureUnitWord(system: UnitSystem): string {
  return system === "imperial" ? "Fahrenheit" : "Celsius";
}
