import { NavLink, Navigate, Route, Routes } from "react-router-dom";

import Weather from "@/screens/Weather";
import Settings from "@/screens/Settings";
import Help from "@/screens/Help";
import { brand } from "@/lib/brand";

/**
 * app_shell -- hosts the centred max-w-2xl layout, the Weather/Settings/Help
 * tab bar, and the router (BrowserRouter itself is mounted in main.tsx).
 * `/weather` is the default screen; any unmatched path, including `/`,
 * redirects back to it.
 */

const TABS: Array<{ to: string; label: string }> = [
  { to: "/weather", label: "Weather" },
  { to: "/settings", label: "Settings" },
  { to: "/help", label: "Help" },
];

function tabClassName({ isActive }: { isActive: boolean }): string {
  return [
    "flex-1 rounded-[var(--brand-radius)] px-3 py-2 text-center text-sm font-medium transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)]",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--brand-background)]",
    isActive
      ? "bg-[var(--brand-primary)] text-[#08181F]"
      : "text-[var(--brand-fg-muted)] hover:bg-[var(--brand-hover)] hover:text-[var(--brand-fg)]",
  ].join(" ");
}

export default function App() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--brand-background)", fontFamily: brand.fontBody }}
    >
      <div className="mx-auto w-full max-w-2xl px-4 pt-4">
        <nav
          aria-label="Primary"
          className="flex gap-1 rounded-[var(--brand-radius)] border p-1"
          style={{ borderColor: "var(--brand-border)", backgroundColor: "var(--brand-surface)" }}
        >
          {TABS.map((tab) => (
            <NavLink key={tab.to} to={tab.to} className={tabClassName}>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <main>
        <Routes>
          <Route path="/weather" element={<Weather />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<Help />} />
          <Route path="*" element={<Navigate to="/weather" replace />} />
        </Routes>
      </main>
    </div>
  );
}
