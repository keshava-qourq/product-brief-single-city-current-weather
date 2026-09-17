import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Search, Check, ChevronRight, Settings, Clock, AlertCircle, CheckCircle } = Icons;

const FOCUS =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38A3C9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1417]";

const API_KEY_TAIL = "4f2a";

const QUICK_CITIES = ["London", "Tokyo", "Dubai", "Reykjavik"];

// weather_data_inmemory — metric values exactly as the API returns them (units=metric)
const CITIES = [
  {
    name: "London",
    aliases: ["london,uk", "london, uk"],
    temp_c: 14.2,
    feels_like_c: 13.1,
    humidity: 82,
    wind_speed_ms: 5.1,
    condition_main: "Rain",
    condition_description: "light rain",
  },
  {
    name: "Tokyo",
    aliases: ["tokyo,jp"],
    temp_c: 26.8,
    feels_like_c: 29.4,
    humidity: 74,
    wind_speed_ms: 3.6,
    condition_main: "Clouds",
    condition_description: "broken clouds",
  },
  {
    name: "Dubai",
    aliases: ["dubai,ae"],
    temp_c: 38.1,
    feels_like_c: 43.7,
    humidity: 47,
    wind_speed_ms: 4.2,
    condition_main: "Clear",
    condition_description: "clear sky",
  },
  {
    name: "Reykjavik",
    aliases: ["reykjavík", "reykjavik,is"],
    temp_c: 6.4,
    feels_like_c: 2.1,
    humidity: 88,
    wind_speed_ms: 9.8,
    condition_main: "Drizzle",
    condition_description: "light intensity drizzle",
  },
  {
    name: "Paris",
    aliases: ["paris,fr"],
    temp_c: 17.9,
    feels_like_c: 17.4,
    humidity: 66,
    wind_speed_ms: 3.1,
    condition_main: "Clouds",
    condition_description: "scattered clouds",
  },
  {
    name: "New York",
    aliases: ["new york city", "nyc", "new york,us"],
    temp_c: 21.3,
    feels_like_c: 21.8,
    humidity: 61,
    wind_speed_ms: 4.6,
    condition_main: "Thunderstorm",
    condition_description: "thunderstorm with light rain",
  },
  {
    name: "Oslo",
    aliases: ["oslo,no"],
    temp_c: -2.6,
    feels_like_c: -7.9,
    humidity: 91,
    wind_speed_ms: 6.2,
    condition_main: "Snow",
    condition_description: "light snow",
  },
  {
    name: "San Francisco",
    aliases: ["sf", "san francisco,us"],
    temp_c: 13.7,
    feels_like_c: 13.0,
    humidity: 86,
    wind_speed_ms: 7.3,
    condition_main: "Mist",
    condition_description: "mist",
  },
  {
    name: "Singapore",
    aliases: ["singapore,sg"],
    temp_c: 29.5,
    feels_like_c: 35.2,
    humidity: 84,
    wind_speed_ms: 2.1,
    condition_main: "Rain",
    condition_description: "moderate rain",
  },
  {
    name: "Cairo",
    aliases: ["cairo,eg"],
    temp_c: 33.4,
    feels_like_c: 32.6,
    humidity: 28,
    wind_speed_ms: 5.7,
    condition_main: "Haze",
    condition_description: "haze",
  },
  {
    name: "Sydney",
    aliases: ["sydney,au"],
    temp_c: 19.6,
    feels_like_c: 19.1,
    humidity: 58,
    wind_speed_ms: 8.2,
    condition_main: "Clear",
    condition_description: "clear sky",
  },
  {
    name: "Berlin",
    aliases: ["berlin,de"],
    temp_c: 15.1,
    feels_like_c: 14.2,
    humidity: 71,
    wind_speed_ms: 4.9,
    condition_main: "Clouds",
    condition_description: "overcast clouds",
  },
  {
    name: "Mumbai",
    aliases: ["bombay", "mumbai,in"],
    temp_c: 28.2,
    feels_like_c: 33.9,
    humidity: 89,
    wind_speed_ms: 6.7,
    condition_main: "Rain",
    condition_description: "heavy intensity rain",
  },
  {
    name: "Toronto",
    aliases: ["toronto,ca"],
    temp_c: 11.8,
    feels_like_c: 10.3,
    humidity: 64,
    wind_speed_ms: 5.4,
    condition_main: "Clouds",
    condition_description: "few clouds",
  },
  {
    name: "Cape Town",
    aliases: ["capetown", "cape town,za"],
    temp_c: 16.4,
    feels_like_c: 16.0,
    humidity: 72,
    wind_speed_ms: 10.6,
    condition_main: "Clear",
    condition_description: "clear sky",
  },
];

const CONDITION_STYLES = [
  {
    match: ["thunder"],
    group: "thunderstorm",
    emoji: "⛈️",
    gradient: "linear-gradient(140deg, #241D33 0%, #151A26 58%, #10151B 100%)",
  },
  {
    match: ["drizzle"],
    group: "rain",
    emoji: "🌦️",
    gradient: "linear-gradient(140deg, #16283154 0%, #142530 58%, #101820 100%)",
  },
  {
    match: ["rain"],
    group: "rain",
    emoji: "🌧️",
    gradient: "linear-gradient(140deg, #15262F 0%, #12202A 58%, #0F171D 100%)",
  },
  {
    match: ["snow"],
    group: "snow",
    emoji: "❄️",
    gradient: "linear-gradient(140deg, #1D2A33 0%, #15222B 58%, #101820 100%)",
  },
  {
    match: ["clear", "sunny"],
    group: "clear",
    emoji: "☀️",
    gradient: "linear-gradient(140deg, #2A2417 0%, #19201F 58%, #101820 100%)",
  },
  {
    match: ["cloud", "overcast"],
    group: "cloudy",
    emoji: "☁️",
    gradient: "linear-gradient(140deg, #1B242A 0%, #151D23 58%, #101619 100%)",
  },
  {
    match: ["fog", "haze", "mist"],
    group: "fog",
    emoji: "🌫️",
    gradient: "linear-gradient(140deg, #1E2427 0%, #171D21 58%, #101619 100%)",
  },
];

const FALLBACK_STYLE = {
  group: "unknown",
  emoji: "🌡️",
  gradient: "linear-gradient(140deg, #1A2126 0%, #151B20 58%, #101619 100%)",
};

function conditionStyleFor(description, main) {
  const text = `${description || ""} ${main || ""}`.toLowerCase();
  for (const entry of CONDITION_STYLES) {
    if (entry.match.some((word) => text.includes(word))) return entry;
  }
  return FALLBACK_STYLE;
}

function convertTemperature(celsius, system) {
  return system === "imperial" ? celsius * (9 / 5) + 32 : celsius;
}

function convertWindSpeed(ms, system) {
  return system === "imperial" ? ms * 2.23694 : ms;
}

function temperatureUnit(system) {
  return system === "imperial" ? "°F" : "°C";
}

function temperatureUnitWord(system) {
  return system === "imperial" ? "Fahrenheit" : "Celsius";
}

function windSpeedUnit(system) {
  return system === "imperial" ? "mph" : "m/s";
}

function clockLabel(date) {
  const h = String(date.getHours()).padStart(2, "0");
  const m = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

function findCity(raw) {
  const key = raw.trim().toLowerCase();
  return (
    CITIES.find(
      (c) => c.name.toLowerCase() === key || (c.aliases || []).includes(key)
    ) || null
  );
}

export default function Screen() {
  const navigate = useNavigate();
  const [unitSystem, setUnitSystem] = React.useState("metric");
  const [apiKeySaved, setApiKeySaved] = React.useState(true);
  const [keyJustRemoved, setKeyJustRemoved] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [weather, setWeather] = React.useState(CITIES[0]);
  const [error, setError] = React.useState(null);
  const [updatedAt, setUpdatedAt] = React.useState(() => clockLabel(new Date()));
  const [lastRequest, setLastRequest] = React.useState(
    `GET /data/2.5/weather?q=London&appid=••••${API_KEY_TAIL}&units=metric`
  );
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function runSearch(rawValue) {
    const raw = rawValue;
    const trimmed = raw.trim();
    if (timerRef.current) clearTimeout(timerRef.current);
    setKeyJustRemoved(false);

    if (trimmed.length === 0) {
      // No request is made for an empty query; any showing card is cleared.
      setLoading(false);
      setWeather(null);
      setError({
        kind: "empty",
        title: "Please enter a city",
        message:
          "Type a city name such as London or Tokyo, then press Search. Nothing was sent to OpenWeatherMap.",
        settingsLink: false,
      });
      return;
    }

    setLoading(true);
    setError(null);
    setWeather(null);
    setLastRequest(
      `GET /data/2.5/weather?q=${encodeURIComponent(trimmed)}&appid=${
        apiKeySaved ? "••••" + API_KEY_TAIL : "(missing)"
      }&units=metric`
    );

    timerRef.current = setTimeout(() => {
      setLoading(false);
      if (!apiKeySaved) {
        setError({
          kind: "apiError",
          title: "OpenWeatherMap rejected the request",
          message:
            "The service replied: “Invalid API key.” Your key may be missing, mistyped, or over its free rate limit.",
          settingsLink: true,
        });
        return;
      }
      const found = findCity(trimmed);
      if (!found) {
        setError({
          kind: "notFound",
          title: "City not found",
          message: `OpenWeatherMap has no match for “${trimmed}”. Check the spelling, or try a larger nearby city.`,
          settingsLink: false,
        });
        return;
      }
      setWeather(found);
      setUpdatedAt(clockLabel(new Date()));
    }, 750);
  }

  function handleSubmit(event) {
    event.preventDefault();
    runSearch(query);
  }

  function handleChip(city) {
    setQuery(city);
    runSearch(city);
  }

  function forgetKey() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setApiKeySaved(false);
    setKeyJustRemoved(true);
    setLoading(false);
  }

  function restoreKey() {
    setApiKeySaved(true);
    setKeyJustRemoved(false);
  }

  const style = weather
    ? conditionStyleFor(weather.condition_description, weather.condition_main)
    : FALLBACK_STYLE;

  const temp = weather
    ? Math.round(convertTemperature(weather.temp_c, unitSystem))
    : null;
  const feels = weather
    ? Math.round(convertTemperature(weather.feels_like_c, unitSystem))
    : null;
  const wind = weather
    ? convertWindSpeed(weather.wind_speed_ms, unitSystem).toFixed(1)
    : null;

  const panel = {
    backgroundColor: "#151B1F",
    borderColor: "rgba(255,255,255,0.08)",
  };

  return (
    <div
      className="mx-auto w-full max-w-2xl px-4 py-6"
      style={{ fontFamily: brand.fontBody, color: "#E6EDF1" }}
    >
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight text-white"
            style={{ fontFamily: brand.fontHeading }}
          >
            Weather
          </h1>
          <p className="mt-1 text-sm" style={{ color: brand.neutralColor }}>
            One city at a time — each search replaces the last.
          </p>
        </div>

        <div
          role="group"
          aria-label="Temperature and wind units"
          className="flex items-center gap-1 rounded-lg border p-1"
          style={panel}
        >
          {[
            { id: "metric", label: "°C" },
            { id: "imperial", label: "°F" },
          ].map((opt) => {
            const active = unitSystem === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                aria-pressed={active}
                onClick={() => setUnitSystem(opt.id)}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${FOCUS}`}
                style={
                  active
                    ? { backgroundColor: brand.primaryColor, color: "#08181F" }
                    : { color: brand.neutralColor }
                }
              >
                {opt.label}
                <span className="sr-only">
                  {" "}
                  — show values in{" "}
                  {opt.id === "metric"
                    ? "Celsius and metres per second"
                    : "Fahrenheit and miles per hour"}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {!apiKeySaved && (
        <div
          className="mt-5 flex items-start gap-3 rounded-lg border p-3"
          style={{
            borderColor: "rgba(242,178,60,0.45)",
            backgroundColor: "rgba(242,178,60,0.08)",
          }}
        >
          <Icons.AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
            style={{ color: brand.accentColor }}
          />
          <div className="text-sm">
            <h2
              className="font-medium"
              style={{ color: brand.accentColor, fontFamily: brand.fontHeading }}
            >
              No API key saved
            </h2>
            <p className="mt-0.5" style={{ color: "#C8D2D8" }}>
              Searches will fail until you add your own free OpenWeatherMap key.{" "}
              <button
                type="button"
                onClick={() => navigate("settings")}
                className={`underline underline-offset-2 ${FOCUS} rounded`}
                style={{ color: brand.accentColor }}
              >
                Add a key on Settings
              </button>
              .
            </p>
          </div>
        </div>
      )}

      <section
        aria-labelledby="search-heading"
        className="mt-5 rounded-lg border p-4"
        style={panel}
      >
        <h2 id="search-heading" className="sr-only">
          Search for a city
        </h2>
        <form onSubmit={handleSubmit} noValidate>
          <label
            htmlFor="city-name"
            className="block text-[11px] font-medium uppercase tracking-widest"
            style={{ color: brand.neutralColor }}
          >
            City name
          </label>
          <div className="mt-2 flex flex-wrap gap-2 sm:flex-nowrap">
            <div className="relative min-w-0 flex-1">
              <Icons.Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
                aria-hidden="true"
                style={{ color: brand.neutralColor }}
              />
              <input
                id="city-name"
                name="q"
                type="text"
                autoComplete="off"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. London, Tokyo, Dubai"
                className={`w-full rounded-lg border py-2 pl-9 pr-3 text-sm text-white placeholder:text-[#6D7C85] ${FOCUS}`}
                style={{
                  backgroundColor: "#0B1013",
                  borderColor: "rgba(255,255,255,0.12)",
                }}
              />
            </div>
            <button
              type="submit"
              className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${FOCUS}`}
              style={{ backgroundColor: brand.primaryColor, color: "#06202A" }}
            >
              <Icons.Search className="h-4 w-4" aria-hidden="true" />
              Search
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: brand.neutralColor }}>
            Try:
          </span>
          {QUICK_CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => handleChip(city)}
              aria-label={`Search weather for ${city}`}
              className={`rounded-full border px-3 py-1 text-xs font-medium text-[#C8D2D8] transition-colors hover:border-[#38A3C9] hover:text-white ${FOCUS}`}
              style={{
                borderColor: "rgba(255,255,255,0.14)",
                backgroundColor: "#0B1013",
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </section>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        {apiKeySaved ? (
          <p className="inline-flex items-center gap-1.5" style={{ color: brand.neutralColor }}>
            <Icons.CheckCircle
              className="h-3.5 w-3.5"
              aria-hidden="true"
              style={{ color: brand.primaryColor }}
            />
            API key saved in this browser — ends ····{API_KEY_TAIL}
          </p>
        ) : (
          <p role="status" style={{ color: brand.neutralColor }}>
            {keyJustRemoved
              ? "Key removed from this browser."
              : "No key stored in this browser."}
          </p>
        )}
        <div className="flex items-center gap-3">
          {apiKeySaved ? (
            <button
              type="button"
              onClick={forgetKey}
              className={`rounded underline underline-offset-2 ${FOCUS}`}
              style={{ color: brand.neutralColor }}
            >
              Forget key
            </button>
          ) : (
            <button
              type="button"
              onClick={restoreKey}
              className={`rounded underline underline-offset-2 ${FOCUS}`}
              style={{ color: brand.neutralColor }}
            >
              Undo
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate("settings")}
            className={`inline-flex items-center gap-1 rounded underline underline-offset-2 ${FOCUS}`}
            style={{ color: brand.primaryColor }}
          >
            Manage key
            <Icons.ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <section aria-labelledby="result-heading" className="mt-4">
        <h2 id="result-heading" className="sr-only">
          Result
        </h2>
        <div aria-live="polite" className="min-h-[248px]">
          {loading && (
            <div
              className="flex h-[248px] flex-col items-center justify-center rounded-lg border"
              style={panel}
            >
              <Icons.Clock
                className="h-7 w-7 animate-pulse"
                aria-hidden="true"
                style={{ color: brand.primaryColor }}
              />
              <p className="mt-3 text-sm" style={{ color: "#C8D2D8" }}>
                Fetching weather data...
              </p>
            </div>
          )}

          {!loading && error && (
            <div
              role="alert"
              className="flex items-start gap-3 rounded-lg border p-4"
              style={{
                borderColor: "rgba(242,178,60,0.45)",
                backgroundColor: "rgba(242,178,60,0.07)",
              }}
            >
              <Icons.AlertCircle
                className="mt-0.5 h-5 w-5 shrink-0"
                aria-hidden="true"
                style={{ color: brand.accentColor }}
              />
              <div className="text-sm">
                <h3
                  className="font-semibold"
                  style={{
                    color: brand.accentColor,
                    fontFamily: brand.fontHeading,
                  }}
                >
                  {error.title}
                </h3>
                <p className="mt-1 leading-relaxed" style={{ color: "#C8D2D8" }}>
                  {error.message}
                </p>
                {error.settingsLink && (
                  <button
                    type="button"
                    onClick={() => navigate("settings")}
                    className={`mt-2 inline-flex items-center gap-1 rounded underline underline-offset-2 ${FOCUS}`}
                    style={{ color: brand.accentColor }}
                  >
                    Check your key on Settings
                    <Icons.ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          )}

          {!loading && !error && weather && (
            <article
              className="rounded-lg border p-5"
              style={{
                background: style.gradient,
                borderColor: "rgba(255,255,255,0.09)",
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3
                    className="text-lg font-semibold text-white"
                    style={{ fontFamily: brand.fontHeading }}
                  >
                    {weather.name}
                  </h3>
                  <p
                    className="mt-0.5 text-[11px] uppercase tracking-widest"
                    style={{ color: brand.neutralColor }}
                  >
                    Current conditions
                  </p>
                </div>
                <p
                  className="text-xs tabular-nums"
                  style={{ color: brand.neutralColor }}
                >
                  Updated {updatedAt}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <p
                  className="text-6xl font-semibold leading-none tabular-nums text-white"
                  aria-label={`${temp} degrees ${temperatureUnitWord(unitSystem)}`}
                >
                  <span aria-hidden="true">
                    {temp}
                    <span className="ml-1 align-top text-2xl font-medium">
                      {temperatureUnit(unitSystem)}
                    </span>
                  </span>
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden="true">
                    {style.emoji}
                  </span>
                  <div>
                    <p className="text-sm font-medium capitalize text-white">
                      {weather.condition_description}
                    </p>
                    <p
                      className="mt-0.5 text-[11px] uppercase tracking-widest"
                      style={{ color: brand.neutralColor }}
                    >
                      {weather.condition_main}
                    </p>
                  </div>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  {
                    term: "Feels like",
                    value: `${feels}${temperatureUnit(unitSystem)}`,
                  },
                  { term: "Humidity", value: `${Math.round(weather.humidity)}%` },
                  {
                    term: "Wind",
                    value: `${wind} ${windSpeedUnit(unitSystem)}`,
                  },
                ].map((item) => (
                  <div
                    key={item.term}
                    className="rounded-md border px-3 py-2.5"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      backgroundColor: "rgba(9,13,16,0.55)",
                    }}
                  >
                    <dt
                      className="text-[11px] uppercase tracking-widest"
                      style={{ color: brand.neutralColor }}
                    >
                      {item.term}
                    </dt>
                    <dd className="mt-1 text-lg font-medium tabular-nums text-white">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          )}

          {!loading && !error && !weather && (
            <div
              className="flex h-[248px] flex-col items-center justify-center rounded-lg border border-dashed px-6 text-center"
              style={{ borderColor: "rgba(255,255,255,0.14)" }}
            >
              <Icons.Search
                className="h-6 w-6"
                aria-hidden="true"
                style={{ color: brand.neutralColor }}
              />
              <p className="mt-3 text-sm font-medium text-white">
                No city showing
              </p>
              <p className="mt-1 text-sm" style={{ color: brand.neutralColor }}>
                Search a city above, or pick one of the examples.
              </p>
            </div>
          )}
        </div>
      </section>

      <footer
        className="mt-6 border-t pt-3 text-xs"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p style={{ color: brand.neutralColor }}>
            Data from OpenWeatherMap. Always fetched in metric; units convert in
            the browser.{" "}
            <button
              type="button"
              onClick={() => navigate("help")}
              className={`rounded underline underline-offset-2 ${FOCUS}`}
              style={{ color: brand.primaryColor }}
            >
              Help &amp; documentation
            </button>
          </p>
          <p
            className="font-mono text-[11px] break-all"
            style={{ color: "#6D7C85" }}
          >
            {lastRequest}
          </p>
        </div>
      </footer>
    </div>
  );
}
