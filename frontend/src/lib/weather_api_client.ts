/**
 * weather_api_client -- builds the one fixed request this app ever makes
 * (GET the OpenWeatherMap current-weather endpoint with q/appid/units=metric),
 * maps a 200 response onto WeatherData, and classifies every failure into
 * the WeatherError variants the UI knows how to render.
 *
 * Per the architecture notes: the key travels only in this request's `appid`
 * parameter, to this host, and to no other -- there is no analytics call and
 * no backend of this app's own to route through.
 */
import { getApiKey } from "@/lib/key_store";
import type { WeatherData, WeatherError } from "@/lib/types";

const ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";

/** Thrown by fetchCurrentWeather; carries the classified WeatherError. */
export class WeatherApiError extends Error {
  readonly weatherError: WeatherError;

  constructor(weatherError: WeatherError) {
    super(weatherError.message);
    this.name = "WeatherApiError";
    this.weatherError = weatherError;
  }
}

interface OwmWeatherResponse {
  name: string;
  main: { temp: number; feels_like: number; humidity: number };
  wind: { speed: number };
  weather: Array<{ main: string; description: string }>;
}

function buildRequestUrl(city: string, apiKey: string): string {
  const params = new URLSearchParams({ q: city, appid: apiKey, units: "metric" });
  return `${ENDPOINT}?${params.toString()}`;
}

function mapResponse(payload: OwmWeatherResponse): WeatherData {
  const condition = payload.weather?.[0];
  return {
    name: payload.name,
    temp_c: payload.main.temp,
    feels_like_c: payload.main.feels_like,
    humidity: payload.main.humidity,
    wind_speed_ms: payload.wind.speed,
    condition_main: condition?.main ?? "",
    condition_description: condition?.description ?? "",
  };
}

/**
 * Look up current conditions for `city`, exactly as typed -- no autocomplete,
 * no country-code disambiguation. Throws WeatherApiError with kind notFound,
 * apiError or network on anything other than a mappable 200.
 */
export async function fetchCurrentWeather(city: string): Promise<WeatherData> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new WeatherApiError({
      kind: "apiError",
      message: "No OpenWeatherMap API key is saved in this browser.",
    });
  }

  let response: Response;
  try {
    response = await fetch(buildRequestUrl(city, apiKey));
  } catch {
    throw new WeatherApiError({
      kind: "network",
      message: "Could not reach OpenWeatherMap. Check your connection and try again.",
    });
  }

  if (response.status === 404) {
    throw new WeatherApiError({
      kind: "notFound",
      message: `OpenWeatherMap has no match for "${city}".`,
    });
  }

  if (response.status === 401 || response.status === 429 || response.status >= 500) {
    throw new WeatherApiError({
      kind: "apiError",
      message:
        "OpenWeatherMap rejected the request. The key may be invalid or over its rate limit.",
    });
  }

  if (!response.ok) {
    throw new WeatherApiError({
      kind: "apiError",
      message: `OpenWeatherMap returned an unexpected error (${response.status}).`,
    });
  }

  let payload: OwmWeatherResponse;
  try {
    payload = (await response.json()) as OwmWeatherResponse;
  } catch {
    throw new WeatherApiError({
      kind: "apiError",
      message: "OpenWeatherMap returned a response that could not be read.",
    });
  }

  return mapResponse(payload);
}
