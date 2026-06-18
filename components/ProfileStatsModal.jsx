import { Award, Bookmark, BookOpen, CheckCircle2, Flame, X } from "lucide-react";
import { LiquidGlass } from "./LiquidGlass.jsx";

export default function ProfileStatsModal({ onClose, authUser, profile, courses, saved, enrolled, tickets }) {
  const completed = courses.filter((course) => course.progress >= 100).length;
  const avgProgress = Math.round(courses.reduce((sum, course) => sum + course.progress, 0) / courses.length);
  const name = authUser?.name || "Гость";

  return (
    <div className="modal-backdrop">
      <LiquidGlass className="profile-stats-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">Профиль</span>
            <h2>{name}</h2>
            <p>{authUser ? "Аккаунт подключён" : "Войдите, чтобы сохранять персональный прогресс между устройствами."}</p>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Закрыть"><X size={18} /></button>
        </div>
        <div className="profile-stats-grid">
          <article><BookOpen /><span>Курсы</span><strong>{enrolled.length}</strong></article>
          <article><CheckCircle2 fill={completed ? "currentColor" : "none"} /><span>Завершено</span><strong>{completed}</strong></article>
          <article><Bookmark fill={saved.length ? "currentColor" : "none"} /><span>Избранное</span><strong>{saved.length}</strong></article>
          <article><Award fill={completed ? "currentColor" : "none"} /><span>Сертификаты</span><strong>{completed}</strong></article>
          <article><Flame /><span>Серия</span><strong>12</strong></article>
          <article><CheckCircle2 /><span>Средний прогресс</span><strong>{avgProgress}%</strong></article>
        </div>
        <div className="profile-summary">
          <span>{profile.grade} класс</span>
          <span>{profile.country}</span>
          <span>{tickets.length} тикета</span>
        </div>
      </LiquidGlass>
    </div>
  );
}
