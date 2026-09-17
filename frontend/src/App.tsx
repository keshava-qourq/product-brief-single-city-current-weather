import { NavLink, Navigate, Route, Routes } from "react-router-dom";

import Weather from "@/screens/Weather";
import Settings from "@/screens/Settings";
import Help from "@/screens/Help";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block rounded-[var(--brand-radius)] px-3 py-2 text-sm font-medium transition-colors",
    isActive ? "bg-[var(--brand-hover)] text-[var(--brand-fg)]" : "text-[var(--brand-fg-muted)]",
  ].join(" ");

export default function App() {
  return (
    <div className="flex min-h-screen">
      <aside
        className="w-56 shrink-0 border-r p-4"
        style={{
          backgroundColor: "var(--brand-surface)",
          borderColor: "var(--brand-border)",
        }}
      >
        <p
          className="mb-4 px-3 text-sm font-semibold"
          style={{ fontFamily: "var(--brand-font-heading)" }}
        >
          {"Product Brief: Single-City Current Weather"}
        </p>
        <nav className="flex flex-col gap-1">
          <NavLink to="/weather" className={navLinkClass}>
            {"Weather"}
          </NavLink>
          <NavLink to="/settings" className={navLinkClass}>
            {"Settings"}
          </NavLink>
          <NavLink to="/help" className={navLinkClass}>
            {"Help & Documentation"}
          </NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto">
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
