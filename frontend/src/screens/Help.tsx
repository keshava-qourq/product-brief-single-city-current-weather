import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Label, Switch } = UI;
const { Search, Check, X, ChevronRight, ChevronDown, Settings, ArrowLeft, ArrowRight, AlertCircle } = Icons;

const STEPS = [
  {
    title: "Get a free OpenWeatherMap key",
    body: "Create a free account at openweathermap.org and generate an API key from the API keys tab. A brand-new key can take a few minutes to activate before it starts returning results.",
    action: null,
  },
  {
    title: "Paste the key on Settings",
    body: "Open Settings, paste the key into the API key field and press Save. A small “Saved” confirmation appears. The key is stored only in this browser and is sent only to OpenWeatherMap.",
    action: { label: "Open Settings", route: "settings" },
  },
  {
    title: "Search a city",
    body: "On the Weather screen, type a city name into the City name field and press Search — or click one of the quick-search chips: London, Tokyo, Dubai or Reykjavik. The text is sent exactly as typed.",
    action: { label: "Go to Weather", route: "weather" },
  },
  {
    title: "Read the card",
    body: "One card at a time shows the city, the current temperature, the condition, feels like, humidity and wind. Each new search replaces the last — there is no history list to tidy up.",
    action: null,
  },
  {
    title: "Switch °C / °F whenever you like",
    body: "The unit toggle converts the numbers already on screen. Nothing is fetched again, and your choice is remembered in this browser for next time.",
    action: null,
  },
];

const GLOSSARY = [
  {
    id: "g-name",
    field: "City",
    apiField: "name",
    example: "Reykjavík",
    meaning:
      "The place OpenWeatherMap matched to your text. If two cities share a name, the API picks one — add a country code, such as “London, CA”, to steer it.",
  },
  {
    id: "g-temp",
    field: "Temperature",
    apiField: "temp_c",
    example: "9°C",
    meaning:
      "The current air temperature measured in the shade, rounded to a whole number. This is the large figure at the top of the card.",
  },
  {
    id: "g-feels",
    field: "Feels like",
    apiField: "feels_like_c",
    example: "6°C",
    meaning:
      "What the temperature feels like to a person once wind and humidity are taken into account. On a windy day it sits well below the true temperature.",
  },
  {
    id: "g-cond",
    field: "Condition",
    apiField: "condition_main / condition_description",
    example: "Rain · light rain",
    meaning:
      "A short group name plus a longer description. The card picks an emoji from the description — thunder, drizzle, rain, snow, clear, cloud, fog — and falls back to a thermometer for anything else.",
  },
  {
    id: "g-hum",
    field: "Humidity",
    apiField: "humidity",
    example: "82%",
    meaning:
      "Relative humidity as a whole percentage. High humidity makes warm air feel hotter and cold air feel rawer.",
  },
  {
    id: "g-wind",
    field: "Wind",
    apiField: "wind_speed_ms",
    example: "4.1 m/s",
    meaning:
      "Wind speed at ground level, shown to one decimal place. Metres per second in Celsius mode, miles per hour in Fahrenheit mode.",
  },
];

const UNIT_SYSTEMS = {
  metric: {
    id: "metric",
    label: "°C",
    name: "Metric",
    temperature: "9°C",
    feelsLike: "6°C",
    wind: "4.1 m/s",
    note: "Values exactly as returned by the API, which is always called with units=metric.",
    formula: "No conversion applied.",
  },
  imperial: {
    id: "imperial",
    label: "°F",
    name: "Imperial",
    temperature: "48°F",
    feelsLike: "43°F",
    wind: "9.2 mph",
    note: "Converted in your browser from the same metric response. Toggling never triggers a new lookup.",
    formula: "°C × 9/5 + 32  ·  m/s × 2.23694",
  },
};

const FAQ = [
  {
    id: "faq-account",
    q: "Do I need an account to use this app?",
    a: "Not with us — there is no sign-up, no profile and no password here. You do need a free OpenWeatherMap account, because the lookup runs against your own key. The app is free and contains no payments, plans or upsells of any kind.",
  },
  {
    id: "faq-location",
    q: "Does the app use my location?",
    a: "No. There is no geolocation and no location permission prompt. The only place the app looks up is the city name you type or the chip you click.",
  },
  {
    id: "faq-units",
    q: "Is my Celsius / Fahrenheit choice remembered?",
    a: "Yes. The unit preference is remembered in this browser, under its own storage key separate from the API key, so it survives a reload and a return visit later. It is not session-only. If storage is blocked — in private browsing, for instance — the app quietly falls back to Celsius for that session instead of failing.",
  },
  {
    id: "faq-notfound",
    q: "The app says the city was not found. What now?",
    a: "The name is sent exactly as typed, with no spell-check or autocomplete. Check the spelling, drop any postcode or district, and try adding a country code — “Springfield, US” rather than “Springfield”. The search form stays usable, so you can try again straight away.",
  },
  {
    id: "faq-key",
    q: "Where does my API key live, and who can see it?",
    a: "It is stored in this browser only and travels nowhere except the appid parameter of requests to api.openweathermap.org. Nothing is sent to any other host — there is no backend, no analytics and no error reporting behind this app.",
  },
  {
    id: "faq-invalid",
    q: "I saved a key but searches keep failing.",
    a: "A freshly created key can take a few minutes to activate. If it keeps failing, the alert will say the key may be invalid or over its free-tier rate limit — open Settings and paste the key again, taking care not to include spaces.",
  },
  {
    id: "faq-scope",
    q: "Can I see a forecast, or keep a list of favourite cities?",
    a: "Not in this version. It deliberately shows current conditions for one city at a time. Forecasts, favourites, search history and offline caching are all out of scope.",
  },
];

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "getting-started", label: "Getting started" },
  { id: "glossary", label: "Field glossary" },
  { id: "units", label: "Units" },
  { id: "source", label: "Data source" },
  { id: "faq", label: "FAQ" },
];

const FOCUS =
  "outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-0";

export default function Screen() {
  const navigate = useNavigate();
  const [query, setQuery] = React.useState("");
  const [openIds, setOpenIds] = React.useState(["faq-account"]);
  const [unitSystem, setUnitSystem] = React.useState("metric");

  const q = query.trim().toLowerCase();

  const filteredGlossary = React.useMemo(
    () =>
      !q
        ? GLOSSARY
        : GLOSSARY.filter((row) =>
            (row.field + " " + row.apiField + " " + row.meaning + " " + row.example)
              .toLowerCase()
              .includes(q)
          ),
    [q]
  );

  const filteredFaq = React.useMemo(
    () => (!q ? FAQ : FAQ.filter((item) => (item.q + " " + item.a).toLowerCase().includes(q))),
    [q]
  );

  const matchCount = filteredGlossary.length + filteredFaq.length;
  const noMatches = q.length > 0 && matchCount === 0;

  const allExpanded =
    filteredFaq.length > 0 && filteredFaq.every((item) => openIds.includes(item.id));

  function toggleFaq(id) {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.concat(id)
    );
  }

  function toggleAll() {
    if (allExpanded) {
      setOpenIds((prev) => prev.filter((id) => !filteredFaq.some((f) => f.id === id)));
    } else {
      setOpenIds((prev) =>
        prev.concat(filteredFaq.map((f) => f.id).filter((id) => !prev.includes(id)))
      );
    }
  }

  const neutral = { color: brand.neutralColor };
  const panel =
    "rounded-lg border border-white/10 bg-white/5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset]";
  const unit = UNIT_SYSTEMS[unitSystem];

  return (
    <div
      className="mx-auto w-full max-w-2xl px-4 py-6 text-slate-100"
      style={{ fontFamily: brand.fontBody, backgroundColor: "transparent" }}
    >
      {/* Header */}
      <header className="mb-5">
        <p
          className="mb-1 text-[11px] font-medium uppercase tracking-[0.18em]"
          style={{ color: brand.primaryColor }}
        >
          Night Desk
        </p>
        <h1
          className="text-2xl font-semibold tracking-tight"
          style={{ fontFamily: brand.fontHeading }}
        >
          Help &amp; Documentation
        </h1>
        <p className="mt-2 text-sm leading-relaxed" style={neutral}>
          How to set the app up with your own OpenWeatherMap key, what every number on the
          weather card means, and answers to the questions that come up most. Last updated 12
          September 2026.
        </p>
      </header>

      {/* Search */}
      <div className={`${panel} mb-4 p-3`}>
        <Label htmlFor="help-search" className="mb-1.5 block text-xs font-medium" style={neutral}>
          Search this page
        </Label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
              <Icons.Search className="h-4 w-4" aria-hidden="true" style={neutral} />
            </span>
            <input
              id="help-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. humidity, key, Fahrenheit"
              className={`w-full rounded-lg border border-white/10 bg-black/30 py-2 pl-8 pr-3 text-sm text-slate-100 placeholder:text-slate-500 ${FOCUS}`}
            />
          </div>
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className={`rounded-lg border border-white/10 px-2.5 py-2 text-xs font-medium text-slate-200 hover:bg-white/10 ${FOCUS}`}
            >
              <span className="flex items-center gap-1.5">
                <Icons.X className="h-3.5 w-3.5" aria-hidden="true" />
                Clear
              </span>
            </button>
          ) : null}
        </div>
        <p className="mt-2 text-xs" style={neutral} aria-live="polite">
          {q
            ? `${matchCount} ${matchCount === 1 ? "topic matches" : "topics match"} “${query.trim()}” in the glossary and FAQ.`
            : "Filters the field glossary and the FAQ below."}
        </p>
      </div>

      {/* On this page */}
      <nav aria-label="On this page" className="mb-6">
        <ul className="flex flex-wrap gap-1.5">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className={`inline-block rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200 hover:border-white/25 hover:bg-white/5 ${FOCUS}`}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {noMatches ? (
        <div
          className={`${panel} mb-6 flex items-start gap-3 p-4`}
          style={{ borderColor: "rgba(242,178,60,0.35)" }}
        >
          <Icons.AlertCircle
            className="mt-0.5 h-4 w-4 shrink-0"
            aria-hidden="true"
            style={{ color: brand.accentColor }}
          />
          <div>
            <p className="text-sm font-medium text-slate-100">
              No help topics match “{query.trim()}”
            </p>
            <p className="mt-1 text-sm" style={neutral}>
              Try a shorter word such as “key”, “wind” or “units”. The
              sections above the glossary are always shown.
            </p>
          </div>
        </div>
      ) : null}

      {/* About */}
      <section id="about" className={`${panel} mb-4 p-4`} aria-labelledby="about-h">
        <h2 id="about-h" className="text-base font-semibold" style={{ fontFamily: brand.fontHeading }}>
          What this app is
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={neutral}>
          A single-city current-weather readout. You type a city, it asks OpenWeatherMap for the
          conditions right now and shows one card: temperature, condition, feels like, humidity and
          wind, all visible without scrolling. Everything runs in your browser — there is no
          server, no account and no charge. You bring your own free OpenWeatherMap key; none ships
          with the app.
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {["Free", "No account", "One city at a time", "Your own API key", "English only"].map(
            (tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[11px]"
                style={neutral}
              >
                {tag}
              </li>
            )
          )}
        </ul>
      </section>

      {/* Getting started */}
      <section id="getting-started" className={`${panel} mb-4 p-4`} aria-labelledby="steps-h">
        <h2 id="steps-h" className="text-base font-semibold" style={{ fontFamily: brand.fontHeading }}>
          Getting started
        </h2>
        <p className="mt-1 text-sm" style={neutral}>
          Five steps, once. After that it is just type and search.
        </p>
        <ol className="mt-3 space-y-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold tabular-nums"
                style={{ backgroundColor: brand.primaryColor, color: "#08181F" }}
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-slate-100">
                  <span className="sr-only">{`Step ${i + 1}: `}</span>
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed" style={neutral}>
                  {step.body}
                </p>
                {step.action ? (
                  <button
                    type="button"
                    onClick={() => navigate(step.action.route)}
                    className={`mt-2 inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-medium hover:bg-white/10 ${FOCUS}`}
                    style={{ color: brand.primaryColor }}
                  >
                    {step.action.label}
                    <Icons.ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Glossary */}
      <section id="glossary" className={`${panel} mb-4 p-4`} aria-labelledby="glossary-h">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2
            id="glossary-h"
            className="text-base font-semibold"
            style={{ fontFamily: brand.fontHeading }}
          >
            What each field means
          </h2>
          <p className="text-xs tabular-nums" style={neutral}>
            {filteredGlossary.length} of {GLOSSARY.length} fields
          </p>
        </div>

        {filteredGlossary.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-white/15 p-4 text-sm" style={neutral}>
            No fields match your search.
          </p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <caption className="sr-only">
                Weather card fields, the response value each one comes from, and what it means
              </caption>
              <thead>
                <tr className="border-b border-white/10">
                  <th
                    scope="col"
                    className="py-2 pr-3 text-[11px] font-medium uppercase tracking-wider"
                    style={neutral}
                  >
                    Field
                  </th>
                  <th
                    scope="col"
                    className="py-2 pr-3 text-[11px] font-medium uppercase tracking-wider"
                    style={neutral}
                  >
                    Example
                  </th>
                  <th
                    scope="col"
                    className="py-2 text-[11px] font-medium uppercase tracking-wider"
                    style={neutral}
                  >
                    What it tells you
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredGlossary.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 align-top last:border-0">
                    <th scope="row" className="py-2.5 pr-3 font-medium text-slate-100">
                      {row.field}
                      <span className="mt-0.5 block font-mono text-[11px] font-normal" style={neutral}>
                        {row.apiField}
                      </span>
                    </th>
                    <td
                      className="py-2.5 pr-3 whitespace-nowrap font-medium tabular-nums"
                      style={{ color: brand.accentColor }}
                    >
                      {row.example}
                    </td>
                    <td className="py-2.5 leading-relaxed" style={neutral}>
                      {row.meaning}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Units */}
      <section id="units" className={`${panel} mb-4 p-4`} aria-labelledby="units-h">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="units-h" className="text-base font-semibold" style={{ fontFamily: brand.fontHeading }}>
            The two unit systems
          </h2>
          <div
            className="flex overflow-hidden rounded-lg border border-white/10"
            role="group"
            aria-label="Preview unit system"
          >
            {["metric", "imperial"].map((key) => {
              const active = unitSystem === key;
              return (
                <button
                  key={key}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setUnitSystem(key)}
                  className={`px-3 py-1.5 text-xs font-semibold ${FOCUS} ${
                    active ? "" : "text-slate-300 hover:bg-white/10"
                  }`}
                  style={
                    active
                      ? { backgroundColor: brand.primaryColor, color: "#08181F" }
                      : undefined
                  }
                >
                  {UNIT_SYSTEMS[key].label}
                  <span className="sr-only">
                    {key === "metric" ? " Celsius, metric" : " Fahrenheit, imperial"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-2 text-sm leading-relaxed" style={neutral}>
          The app always asks OpenWeatherMap for metric values and converts on screen, so switching
          units never costs another lookup. Here is the same reading in{" "}
          <span className="font-medium text-slate-100">{unit.name.toLowerCase()}</span>:
        </p>

        <dl className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {[
            { label: "Temperature", value: unit.temperature },
            { label: "Feels like", value: unit.feelsLike },
            { label: "Wind", value: unit.wind },
          ].map((item) => (
            <div key={item.label} className="rounded-lg border border-white/10 bg-black/30 p-3">
              <dt className="text-[11px] uppercase tracking-wider" style={neutral}>
                {item.label}
              </dt>
              <dd className="mt-1 text-xl font-semibold tabular-nums text-slate-100">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>

        <p className="mt-3 text-sm leading-relaxed" style={neutral}>
          {unit.note}{" "}
          <span className="font-mono text-xs text-slate-200">{unit.formula}</span>
        </p>
        <p className="mt-2 text-sm leading-relaxed" style={neutral}>
          Temperature and feels like are rounded to whole numbers, wind to one decimal place and
          humidity to a whole percent. Your choice is kept in this browser for next time.
        </p>
      </section>

      {/* Data source */}
      <section id="source" className={`${panel} mb-4 p-4`} aria-labelledby="source-h">
        <h2 id="source-h" className="text-base font-semibold" style={{ fontFamily: brand.fontHeading }}>
          Where the data comes from
        </h2>
        <p className="mt-2 text-sm leading-relaxed" style={neutral}>
          Every reading is fetched live from the OpenWeatherMap current weather endpoint. Nothing is
          cached, and no other service is contacted.
        </p>
        <p className="mt-3 overflow-x-auto rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-xs text-slate-200">
          GET https://api.openweathermap.org/data/2.5/weather
        </p>
        <dl className="mt-3 space-y-2 text-sm">
          {[
            { term: "q", desc: "The city text exactly as you typed it — no autocomplete, no country picker." },
            { term: "appid", desc: "Your saved API key. Sent to this host and nowhere else." },
            { term: "units", desc: "Always metric. Fahrenheit is calculated in your browser." },
          ].map((p) => (
            <div key={p.term} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="w-20 shrink-0 font-mono text-xs" style={{ color: brand.accentColor }}>
                {p.term}
              </dt>
              <dd style={neutral}>{p.desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* FAQ */}
      <section id="faq" className={`${panel} mb-6 p-4`} aria-labelledby="faq-h">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="faq-h" className="text-base font-semibold" style={{ fontFamily: brand.fontHeading }}>
            Frequently asked questions
          </h2>
          {filteredFaq.length > 0 ? (
            <button
              type="button"
              onClick={toggleAll}
              className={`rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/10 ${FOCUS}`}
            >
              {allExpanded ? "Collapse all" : "Expand all"}
            </button>
          ) : null}
        </div>

        {filteredFaq.length === 0 ? (
          <p className="mt-3 rounded-lg border border-dashed border-white/15 p-4 text-sm" style={neutral}>
            No questions match your search.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-white/10 border-y border-white/10">
            {filteredFaq.map((item) => {
              const open = openIds.includes(item.id);
              return (
                <li key={item.id}>
                  <h3>
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={`${item.id}-panel`}
                      id={`${item.id}-button`}
                      onClick={() => toggleFaq(item.id)}
                      className={`flex w-full items-center justify-between gap-3 py-3 text-left text-sm font-medium text-slate-100 hover:text-white ${FOCUS}`}
                    >
                      <span>{item.q}</span>
                      {open ? (
                        <Icons.ChevronDown
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                          style={{ color: brand.primaryColor }}
                        />
                      ) : (
                        <Icons.ChevronRight
                          className="h-4 w-4 shrink-0"
                          aria-hidden="true"
                          style={neutral}
                        />
                      )}
                    </button>
                  </h3>
                  {open ? (
                    <div
                      id={`${item.id}-panel`}
                      role="region"
                      aria-labelledby={`${item.id}-button`}
                      className="pb-3 pr-6 text-sm leading-relaxed"
                      style={neutral}
                    >
                      {item.a}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Footer actions */}
      <div className={`${panel} flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between`}>
        <p className="text-sm" style={neutral}>
          Set up and ready? Head back and look up a city.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate("settings")}
            className={`inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-sm font-medium text-slate-100 hover:bg-white/10 ${FOCUS}`}
          >
            <Icons.Settings className="h-4 w-4" aria-hidden="true" />
            Settings
          </button>
          <button
            type="button"
            onClick={() => navigate("weather")}
            className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${FOCUS}`}
            style={{ backgroundColor: brand.primaryColor, color: "#08181F" }}
          >
            <Icons.ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to Weather
          </button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs" style={neutral}>
        Weather data from OpenWeatherMap. This app is free and stores only your API key and unit
        preference, in this browser.
      </p>
    </div>
  );
}
