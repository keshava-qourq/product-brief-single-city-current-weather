/**
 * types -- shared type definitions the rest of the frontend imports from.
 *
 * Kept deliberately small and free of behaviour: every other lib module and
 * every screen that needs to talk about a weather reading, a unit system or
 * a failed lookup should import these instead of redeclaring its own shape.
 */

/** The two unit systems the app can display a reading in. */
export type UnitSystem = "metric" | "imperial";

/**
 * weather_data_inmemory -- the current reading for one city, always held in
 * its metric form (the API is always called with units=metric; conversion
 * for display happens in unit_converter).
 */
export interface WeatherData {
  name: string;
  temp_c: number;
  feels_like_c: number;
  humidity: number;
  wind_speed_ms: number;
  condition_main: string;
  condition_description: string;
}

/**
 * The three ways a lookup can fail, per the api_spec:
 * - notFound: OpenWeatherMap returned 404 for this city text.
 * - apiError: the key was rejected/rate-limited (401/429) or the upstream
 *   service failed (5xx), or a saved key is missing.
 * - network: the request itself could not be made (offline, DNS, CORS, ...).
 */
export type WeatherErrorKind = "notFound" | "apiError" | "network";

export interface WeatherError {
  kind: WeatherErrorKind;
  message: string;
}
