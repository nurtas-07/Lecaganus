import { Bookmark, CalendarClock, ExternalLink } from "lucide-react";
import { optionLabel, t, textFor } from "../i18n.js";
import { daysLeft, formatDeadline } from "../utils/recommendations.js";
import { LiquidGlass } from "./LiquidGlass.jsx";

export default function OpportunityCard({ item, saved, onSave, language }) {
  const days = daysLeft(item.deadline);
  const openApplication = () => {
    window.open(item.applicationUrl || "https://mentoria.kz/apply", "_blank", "noopener,noreferrer");
  };

  return (
    <LiquidGlass className="opportunity-card">
      <div className="card-topline">
        <span className="tag">{optionLabel(item.category, language)}</span>
        <button className={saved ? "save-button saved" : "save-button"} onClick={() => onSave(item.id)} aria-label={t(language, "opportunities.save")}>
          <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <h3>{textFor(item, "title", language)}</h3>
      <p>{textFor(item, "description", language)}</p>
      <div className="meta-grid">
        <span>{optionLabel(item.direction, language)}</span>
        <span>{optionLabel(item.format, language)}</span>
        <span>{item.grades.join("-")} {t(language, "opportunities.gradeWord")}</span>
      </div>
      <div className="requirements">{textFor(item, "requirements", language)}</div>
      <div className="deadline-row">
        <CalendarClock size={17} />
        <strong>{days <= 0 ? t(language, "opportunities.today") : `${days} ${t(language, "opportunities.days")}`}</strong>
        <span>{formatDeadline(item.deadline)}</span>
      </div>
      <button className="apply-button" onClick={openApplication}>
        {t(language, "opportunities.apply")}
        <ExternalLink size={16} />
      </button>
    </LiquidGlass>
  );
}
