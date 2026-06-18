import {
  BookOpen,
  Bookmark,
  CalendarDays,
  Gauge,
  Headphones,
  Home,
  LayoutDashboard,
  Settings2,
  Trophy,
  UserRound,
} from "lucide-react";
import { t } from "../i18n.js";
import { LiquidGlass, LogoMark } from "./LiquidGlass.jsx";

const nav = [
  { id: "home", icon: Home },
  { id: "opportunities", icon: Trophy },
  { id: "courses", icon: BookOpen },
  { id: "dashboard", icon: LayoutDashboard },
  { id: "calendar", icon: CalendarDays },
  { id: "roadmap", icon: Gauge },
  { id: "support", icon: Headphones },
  { id: "admin", icon: Settings2 },
];

export default function Sidebar({ active, setActive, savedCount, profile, authUser, onProfileClick, language }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <LogoMark />
        <strong>Mentoria Hub</strong>
      </div>
      <nav className="nav-list">
        {nav.map((item) => {
          const Icon = item.icon;
          return (
            <button className={active === item.id ? "active" : ""} onClick={() => setActive(item.id)} key={item.id}>
              <Icon size={19} />
              <span>{t(language, `nav.${item.id}`)}</span>
            </button>
          );
        })}
      </nav>
      <LiquidGlass className="streak-card">
        <span className="eyebrow">Серия обучения</span>
        <strong>12 дней</strong>
        <div className="sparkline" aria-hidden="true">
          <i style={{ height: "32%" }} />
          <i style={{ height: "45%" }} />
          <i style={{ height: "28%" }} />
          <i style={{ height: "22%" }} />
          <i style={{ height: "55%" }} />
          <i style={{ height: "68%" }} />
          <i style={{ height: "78%" }} />
        </div>
      </LiquidGlass>
      <button className="profile-chip profile-button glass" onClick={onProfileClick}>
        <UserRound size={36} />
        <div>
          <strong>{authUser?.name || "Гость"}</strong>
          <span>{authUser ? `${profile.grade} класс · ${authUser.login || authUser.email}` : "Статистика профиля"}</span>
        </div>
        <Bookmark size={18} fill={savedCount ? "currentColor" : "none"} />
        <b>{savedCount}</b>
      </button>
    </aside>
  );
}
