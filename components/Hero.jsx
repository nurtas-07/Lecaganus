import { Code2, FlaskConical, GraduationCap, Landmark, Sigma, Sparkles, Trophy, Zap } from "lucide-react";
import { LiquidGlass, LogoMark } from "./LiquidGlass.jsx";

const orbit = [
  { label: "Математика", icon: Sigma },
  { label: "Программирование", icon: Code2 },
  { label: "Олимпиады", icon: Trophy },
  { label: "AI", icon: Sparkles },
  { label: "Хакатоны", icon: Zap },
  { label: "Наука", icon: FlaskConical },
  { label: "Поступление", icon: GraduationCap },
  { label: "Финансы", icon: Landmark },
];

export default function Hero({ setActive }) {
  return (
    <LiquidGlass className="hero-panel" intense>
      <div className="hero-copy">
        <span className="eyebrow">Working MVP Challenge</span>
        <h2>Mentoria Hub объединяет возможности и асинхронное обучение в одном продукте</h2>
        <p>Ученик получает персональные рекомендации, сохраняет дедлайны, проходит уроки в своём темпе, а Mentoria масштабируется без ручного Telegram-потока.</p>
        <div className="hero-actions">
          <button className="primary" onClick={() => setActive("opportunities")}>Найти возможности</button>
          <button className="secondary" onClick={() => setActive("courses")}>Начать обучение</button>
          <button className="secondary" onClick={() => setActive("dashboard")}>Присоединиться</button>
        </div>
      </div>
      <div className="orbit-map" aria-label="Направления Mentoria Hub">
        <div className="orbit-line one" />
        <div className="orbit-line two" />
        <div className="orbit-center">
          <LogoMark />
        </div>
        {orbit.map((item, index) => {
          const Icon = item.icon;
          return (
            <span className={`orbit-pill p${index + 1}`} key={item.label}>
              <Icon size={17} />
              {item.label}
            </span>
          );
        })}
      </div>
    </LiquidGlass>
  );
}
