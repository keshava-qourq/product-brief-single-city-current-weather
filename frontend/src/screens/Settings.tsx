import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

const { Button, Card, CardHeader, CardContent, CardFooter, Input, Label, Table, THead, TBody, TR, TH, TD, Separator } = UI;
const { Check, ChevronRight, Settings, FileText, Trash, AlertCircle, CheckCircle } = Icons;

const STORAGE_KEY_NAME = "owm_api_key";
const UNIT_KEY_NAME = "owm_unit_preference";

const INITIAL_KEY = "8f3c1d9b47a25e60c1af7d3b95e0248c";
const INITIAL_SAVED_AT = "16 Sep 2026, 21:04";

const USAGE_LOG = [
  {
    id: "u1",
    when: "Today, 09:42",
    city: "London",
    status: "200 OK",
    kind: "ok",
    detail: "Resolved to London, GB — 214 ms",
  },
  {
    id: "u2",
    when: "Today, 09:15",
    city: "Reykjavik",
    status: "200 OK",
    kind: "ok",
    detail: "Resolved to Reykjavík, IS — 331 ms",
  },
  {
    id: "u3",
    when: "Today, 08:58",
    city: "Tokoy",
    status: "404 Not found",
    kind: "error",
    detail: "city not found",
  },
  {
    id: "u4",
    when: "Yesterday, 22:07",
    city: "Dubai",
    status: "200 OK",
    kind: "ok",
    detail: "Resolved to Dubai, AE — 189 ms",
  },
  {
    id: "u5",
    when: "Yesterday, 18:31",
    city: "Tokyo",
    status: "429 Too many requests",
    kind: "error",
    detail: "Free tier limit — 60 calls/minute",
  },
  {
    id: "u6",
    when: "Yesterday, 18:30",
    city: "Tokyo",
    status: "200 OK",
    kind: "ok",
    detail: "Resolved to Tokyo, JP — 402 ms",
  },
  {
    id: "u7",
    when: "15 Sep, 07:12",
    city: "Porto",
    status: "503 Service unavailable",
    kind: "error",
    detail: "Upstream error — retried and succeeded",
  },
  {
    id: "u8",
    when: "14 Sep, 20:46",
    city: "Reykjavik",
    status: "401 Unauthorized",
    kind: "error",
    detail: "Previous key — replaced on 16 Sep",
  },
];

const FILTERS = [
  { value: "all", label: "All requests" },
  { value: "ok", label: "Successful only" },
  { value: "error", label: "Errors only" },
];

function maskKey(value) {
  if (!value) return "—";
  const v = value.trim();
  if (v.length <= 8) return "•".repeat(v.length);
  return v.slice(0, 4) + "•".repeat(Math.min(16, v.length - 8)) + v.slice(-4);
}

export default function Screen() {
  const navigate = useNavigate();
  const [storedKey, setStoredKey] = React.useState(INITIAL_KEY);
  const [draft, setDraft] = React.useState(INITIAL_KEY);
  const [savedAt, setSavedAt] = React.useState(INITIAL_SAVED_AT);
  const [showKey, setShowKey] = React.useState(false);
  const [justSaved, setJustSaved] = React.useState(false);
  const [justRemoved, setJustRemoved] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("all");

  const removeButtonRef = React.useRef(null);
  const cancelButtonRef = React.useRef(null);

  React.useEffect(() => {
    if (confirmOpen && cancelButtonRef.current) cancelButtonRef.current.focus();
  }, [confirmOpen]);

  const trimmed = draft.trim();
  const hasApiKey = storedKey.trim().length > 0;
  const looksUnusual = trimmed.length > 0 && !/^[a-f0-9]{32}$/i.test(trimmed);

  const visibleLog = USAGE_LOG.filter((row) =>
    filter === "all" ? true : row.kind === filter
  );

  const okCount = USAGE_LOG.filter((r) => r.kind === "ok").length;
  const errorCount = USAGE_LOG.length - okCount;

  function handleSave(event) {
    event.preventDefault();
    if (!trimmed) return;
    setStoredKey(trimmed);
    setDraft(trimmed);
    setSavedAt("Today, 14:26");
    setJustSaved(true);
    setJustRemoved(false);
  }

  function handleRemove() {
    setStoredKey("");
    setDraft("");
    setSavedAt(null);
    setShowKey(false);
    setJustSaved(false);
    setJustRemoved(true);
    setConfirmOpen(false);
    if (removeButtonRef.current) removeButtonRef.current.focus();
  }

  function closeDialog() {
    setConfirmOpen(false);
    if (removeButtonRef.current) removeButtonRef.current.focus();
  }

  const focusRing =
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#38A3C9] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F1417]";

  const panelStyle = {
    backgroundColor: "#151B20",
    borderColor: "rgba(255,255,255,0.09)",
    borderWidth: "1px",
    borderStyle: "solid",
    borderRadius: brand.radius,
  };

  const ghostButton =
    "bg-transparent border border-white/15 text-slate-200 hover:border-white/35 hover:bg-white/5 " +
    focusRing;

  return (
    <div
      className="min-h-full"
      style={{
        backgroundColor: brand.backgroundColor,
        fontFamily: brand.fontBody,
        color: "#E6EDF2",
      }}
    >
      <div className="mx-auto w-full max-w-2xl px-4 py-7 space-y-5">
        {/* Heading */}
        <header className="space-y-1.5">
          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ fontFamily: brand.fontHeading, color: "#F3F7FA" }}
          >
            Settings
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: brand.neutralColor }}>
            Your OpenWeatherMap key is stored only in this browser. It is never sent
            anywhere except to api.openweathermap.org.
          </p>
        </header>

        {/* Key status readout */}
        <div
          className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3"
          style={panelStyle}
        >
          <div className="flex items-center gap-2">
            {hasApiKey ? (
              <Icons.CheckCircle
                className="h-4 w-4 shrink-0"
                style={{ color: brand.primaryColor }}
                aria-hidden="true"
              />
            ) : (
              <Icons.AlertCircle
                className="h-4 w-4 shrink-0"
                style={{ color: brand.accentColor }}
                aria-hidden="true"
              />
            )}
            <span className="text-sm font-medium">
              {hasApiKey ? "Key saved" : "No key saved"}
            </span>
          </div>
          <p className="text-xs tabular-nums" style={{ color: brand.neutralColor }}>
            <span className="uppercase tracking-wider">Last saved</span>{" "}
            <span style={{ color: "#C9D5DC" }}>{savedAt || "Never"}</span>
          </p>
          <p className="text-xs tabular-nums" style={{ color: brand.neutralColor }}>
            <span className="uppercase tracking-wider">Requests logged</span>{" "}
            <span style={{ color: "#C9D5DC" }}>
              {okCount} ok / {errorCount} failed
            </span>
          </p>
        </div>

        {!hasApiKey && (
          <div
            className="flex items-start gap-3 px-4 py-3"
            style={{
              backgroundColor: "rgba(242,178,60,0.10)",
              border: "1px solid rgba(242,178,60,0.38)",
              borderRadius: brand.radius,
            }}
          >
            <Icons.AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: brand.accentColor }}
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed" style={{ color: "#F6DCA9" }}>
              Searches on the Weather screen will fail until a key is saved here. A free
              key from openweathermap.org takes about a minute to create.
            </p>
          </div>
        )}

        {/* API key form */}
        <Card style={panelStyle} className="overflow-hidden">
          <CardHeader className="px-4 pt-4 pb-2">
            <h2
              className="text-base font-semibold"
              style={{ fontFamily: brand.fontHeading, color: "#F3F7FA" }}
            >
              OpenWeatherMap API key
            </h2>
            <p className="mt-1 text-sm" style={{ color: brand.neutralColor }}>
              Paste the key from your OpenWeatherMap account and save it.
            </p>
          </CardHeader>

          <CardContent className="px-4 pb-4 pt-2">
            <form onSubmit={handleSave} noValidate>
              <Label htmlFor="api-key-input" className="text-sm font-medium text-slate-200">
                API key
              </Label>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Input
                  id="api-key-input"
                  name="value"
                  type={showKey ? "text" : "password"}
                  autoComplete="off"
                  spellCheck="false"
                  value={draft}
                  placeholder="e.g. 8f3c1d9b47a25e60c1af7d3b95e0248c"
                  aria-describedby="api-key-hint"
                  onChange={(e) => {
                    setDraft(e.target.value);
                    setJustSaved(false);
                    setJustRemoved(false);
                  }}
                  className={
                    "min-w-[14rem] flex-1 bg-[#0F1417] border border-white/15 text-slate-100 placeholder:text-slate-500 tracking-wider " +
                    focusRing
                  }
                  style={{ borderRadius: brand.radius }}
                />
                <Button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  aria-pressed={showKey}
                  className={ghostButton}
                  style={{ borderRadius: brand.radius }}
                >
                  {showKey ? "Hide" : "Show"}
                </Button>
                <Button
                  type="submit"
                  disabled={trimmed.length === 0}
                  className={
                    "font-semibold disabled:opacity-40 disabled:cursor-not-allowed " +
                    focusRing
                  }
                  style={{
                    backgroundColor: brand.primaryColor,
                    color: "#062029",
                    borderRadius: brand.radius,
                  }}
                >
                  Save
                </Button>
              </div>

              <p
                id="api-key-hint"
                className="mt-2 text-xs leading-relaxed"
                style={{ color: brand.neutralColor }}
              >
                A free key comes from openweathermap.org (Account → My API keys). New keys
                can take a few minutes to activate. The key is stored in this browser under{" "}
                <code className="text-[11px]" style={{ color: "#C9D5DC" }}>
                  {STORAGE_KEY_NAME}
                </code>{" "}
                and is sent only to OpenWeatherMap.
              </p>

              {looksUnusual && (
                <p
                  className="mt-2 flex items-start gap-2 text-xs leading-relaxed"
                  style={{ color: "#F6DCA9" }}
                >
                  <Icons.AlertCircle
                    className="mt-px h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    Most keys are 32 hexadecimal characters. You can still save this one.
                  </span>
                </p>
              )}

              <div role="status" aria-live="polite" className="min-h-[1.5rem]">
                {justSaved && (
                  <p
                    className="mt-3 flex items-center gap-2 text-sm font-medium"
                    style={{ color: brand.primaryColor }}
                  >
                    <Icons.Check className="h-4 w-4" aria-hidden="true" />
                    Saved — your key is stored in this browser.
                  </p>
                )}
                {justRemoved && (
                  <p
                    className="mt-3 flex items-center gap-2 text-sm font-medium"
                    style={{ color: brand.accentColor }}
                  >
                    <Icons.Trash className="h-4 w-4" aria-hidden="true" />
                    Key removed from this browser.
                  </p>
                )}
              </div>
            </form>
          </CardContent>

          <CardFooter className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
            <p className="text-xs" style={{ color: brand.neutralColor }}>
              Ready to look something up?
            </p>
            <Button
              type="button"
              onClick={() => navigate("weather")}
              className={ghostButton + " inline-flex items-center gap-1.5"}
              style={{ borderRadius: brand.radius }}
            >
              Go to Weather
              <Icons.ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </CardFooter>
        </Card>

        {/* Stored in this browser */}
        <Card style={panelStyle}>
          <CardHeader className="px-4 pt-4 pb-2">
            <h2
              className="text-base font-semibold"
              style={{ fontFamily: brand.fontHeading, color: "#F3F7FA" }}
            >
              Stored in this browser
            </h2>
            <p className="mt-1 text-sm" style={{ color: brand.neutralColor }}>
              These are the only two values this app persists. Both are read and written
              inside try/catch, so private browsing cannot break the app.
            </p>
          </CardHeader>
          <CardContent className="px-4 pb-4 pt-2">
            <Table className="w-full text-sm">
              <THead>
                <TR className="border-b border-white/10">
                  <TH className="py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: brand.neutralColor }}>
                    Key name
                  </TH>
                  <TH className="py-2 text-left text-xs font-medium uppercase tracking-wider" style={{ color: brand.neutralColor }}>
                    Value
                  </TH>
                </TR>
              </THead>
              <TBody>
                <TR className="border-b border-white/5">
                  <TD className="py-2.5 pr-4 font-mono text-xs" style={{ color: "#C9D5DC" }}>
                    {STORAGE_KEY_NAME}
                  </TD>
                  <TD className="py-2.5 font-mono text-xs tracking-wider text-slate-100">
                    {hasApiKey ? maskKey(storedKey) : (
                      <span style={{ color: brand.neutralColor }}>not set</span>
                    )}
                  </TD>
                </TR>
                <TR>
                  <TD className="py-2.5 pr-4 font-mono text-xs" style={{ color: "#C9D5DC" }}>
                    {UNIT_KEY_NAME}
                  </TD>
                  <TD className="py-2.5 font-mono text-xs text-slate-100">
                    metric (°C, m/s)
                  </TD>
                </TR>
              </TBody>
            </Table>

            <Separator className="my-4 bg-white/10" />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs leading-relaxed" style={{ color: brand.neutralColor }}>
                Change units with the °C / °F toggle on the Weather screen — it converts
                what is already on screen and never re-fetches.
              </p>
              <Button
                type="button"
                ref={removeButtonRef}
                disabled={!hasApiKey}
                onClick={() => setConfirmOpen(true)}
                className={
                  "inline-flex items-center gap-1.5 bg-transparent border border-white/15 text-slate-200 hover:border-white/35 hover:bg-white/5 disabled:opacity-40 disabled:cursor-not-allowed " +
                  focusRing
                }
                style={{ borderRadius: brand.radius }}
              >
                <Icons.Trash className="h-4 w-4" aria-hidden="true" />
                Remove key
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent key usage */}
        <Card style={panelStyle}>
          <CardHeader className="px-4 pt-4 pb-2">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2
                  className="text-base font-semibold"
                  style={{ fontFamily: brand.fontHeading, color: "#F3F7FA" }}
                >
                  Recent key usage
                </h2>
                <p className="mt-1 text-sm" style={{ color: brand.neutralColor }}>
                  Lookups made from this browser with the saved key.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="usage-filter"
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: brand.neutralColor }}
                >
                  Show
                </Label>
                <select
                  id="usage-filter"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className={
                    "bg-[#0F1417] border border-white/15 px-2.5 py-1.5 text-sm text-slate-100 " +
                    focusRing
                  }
                  style={{ borderRadius: brand.radius }}
                >
                  {FILTERS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-4 pb-4 pt-2">
            {visibleLog.length === 0 ? (
              <p
                className="px-2 py-8 text-center text-sm"
                style={{ color: brand.neutralColor }}
              >
                No requests match this filter.
              </p>
            ) : (
              <Table className="w-full text-sm">
                <THead>
                  <TR className="border-b border-white/10">
                    <TH
                      className="py-2 pr-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: brand.neutralColor }}
                    >
                      When
                    </TH>
                    <TH
                      className="py-2 pr-4 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: brand.neutralColor }}
                    >
                      Query (q)
                    </TH>
                    <TH
                      className="py-2 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: brand.neutralColor }}
                    >
                      Result
                    </TH>
                  </TR>
                </THead>
                <TBody>
                  {visibleLog.map((row) => (
                    <TR key={row.id} className="border-b border-white/5 align-top">
                      <TD
                        className="whitespace-nowrap py-2.5 pr-4 text-xs tabular-nums"
                        style={{ color: brand.neutralColor }}
                      >
                        {row.when}
                      </TD>
                      <TD className="py-2.5 pr-4 text-sm text-slate-100">{row.city}</TD>
                      <TD className="py-2.5">
                        <span
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium"
                          style={{
                            borderRadius: brand.radius,
                            backgroundColor:
                              row.kind === "ok"
                                ? "rgba(56,163,201,0.14)"
                                : "rgba(242,178,60,0.12)",
                            color: row.kind === "ok" ? "#8FD4EC" : "#F6DCA9",
                            border:
                              row.kind === "ok"
                                ? "1px solid rgba(56,163,201,0.35)"
                                : "1px solid rgba(242,178,60,0.35)",
                          }}
                        >
                          {row.kind === "ok" ? (
                            <Icons.Check className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : (
                            <Icons.AlertCircle className="h-3.5 w-3.5" aria-hidden="true" />
                          )}
                          {row.status}
                        </span>
                        <span
                          className="mt-1 block text-xs"
                          style={{ color: brand.neutralColor }}
                        >
                          {row.detail}
                        </span>
                      </TD>
                    </TR>
                  ))}
                </TBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <footer className="flex flex-wrap items-center justify-between gap-3 pb-2">
          <p className="text-xs" style={{ color: brand.neutralColor }}>
            Weather data from OpenWeatherMap. This app is free — no account, no billing.
          </p>
          <Button
            type="button"
            onClick={() => navigate("help")}
            className={ghostButton + " inline-flex items-center gap-1.5 text-xs"}
            style={{ borderRadius: brand.radius }}
          >
            <Icons.FileText className="h-3.5 w-3.5" aria-hidden="true" />
            Read the Help guide
          </Button>
        </footer>
      </div>

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              closeDialog();
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="remove-key-title"
            aria-describedby="remove-key-desc"
            className="w-full max-w-sm p-5"
            style={{
              backgroundColor: "#151B20",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: brand.radius,
            }}
          >
            <h2
              id="remove-key-title"
              className="text-base font-semibold"
              style={{ fontFamily: brand.fontHeading, color: "#F3F7FA" }}
            >
              Remove saved key?
            </h2>
            <p
              id="remove-key-desc"
              className="mt-2 text-sm leading-relaxed"
              style={{ color: brand.neutralColor }}
            >
              The key will be deleted from this browser and searches will fail until you
              save another one. Your OpenWeatherMap account is not affected.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <Button
                type="button"
                ref={cancelButtonRef}
                onClick={closeDialog}
                className={ghostButton}
                style={{ borderRadius: brand.radius }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleRemove}
                className={"font-semibold " + focusRing}
                style={{
                  backgroundColor: brand.accentColor,
                  color: "#2A1D05",
                  borderRadius: brand.radius,
                }}
              >
                Remove key
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
