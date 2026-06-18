import { Edit3, Globe2, Link2, Plus, Trash2, UsersRound } from "lucide-react";
import React from "react";
import { optionLabel, t, textFor } from "../i18n.js";
import { LiquidGlass } from "./LiquidGlass.jsx";

const languageNames = {
  RU: "Русский",
  EN: "English",
  KZ: "Қазақша",
};

const emptyLocalized = {
  RU: "",
  EN: "",
  KZ: "",
};

export default function AdminPanel({ opportunities, setOpportunities, courses, setCourses, language }) {
  const [editLanguage, setEditLanguage] = React.useState(language);
  const [draft, setDraft] = React.useState({
    title: {
      RU: "Astana Research Challenge",
      EN: "Astana Research Challenge",
      KZ: "Astana Research Challenge",
    },
    category: {
      RU: "Исследование",
      EN: "Research",
      KZ: "Зерттеу",
    },
    direction: {
      RU: "Наука",
      EN: "Science",
      KZ: "Ғылым",
    },
    format: {
      RU: "Онлайн",
      EN: "Online",
      KZ: "Онлайн",
    },
    deadline: "2026-07-28",
    applicationUrl: "https://mentoria.kz/apply",
    description: {
      RU: "Новая возможность, добавленная через админ-панель без пересборки сайта.",
      EN: "A new opportunity added through the admin panel without rebuilding the site.",
      KZ: "Сайтты қайта құрастырмай админ-панель арқылы қосылған жаңа мүмкіндік.",
    },
    requirements: {
      RU: "Заявка, тема исследования, короткая презентация.",
      EN: "Application, research topic, and a short presentation.",
      KZ: "Өтініш, зерттеу тақырыбы және қысқа презентация.",
    },
  });

  const updateLocalized = (field, value) => {
    setDraft((current) => ({
      ...current,
      [field]: {
        ...(current[field] || emptyLocalized),
        [editLanguage]: value,
      },
    }));
  };

  const addOpportunity = () => {
    setOpportunities((items) => [
      {
        id: `admin-${Date.now()}`,
        title: draft.title,
        category: draft.category.RU || "Исследование",
        direction: draft.direction.RU || "Наука",
        format: draft.format.RU || "Онлайн",
        deadline: draft.deadline,
        applicationUrl: draft.applicationUrl,
        description: draft.description,
        requirements: draft.requirements,
        grades: ["9", "10", "11"],
        tags: [draft.direction.RU || "Наука", "STEM"],
      },
      ...items,
    ]);
  };

  const deleteOpportunity = (id) => setOpportunities((items) => items.filter((item) => item.id !== id));

  const editFirstCourse = () => {
    setCourses((items) => items.map((course, index) => (index === 0 ? { ...course, updatedAt: new Date().toISOString() } : course)));
  };

  return (
    <section className="screen">
      <div className="section-title">
        <div>
          <span className="eyebrow">{t(language, "admin.eyebrow")}</span>
          <h2>{t(language, "admin.title")}</h2>
        </div>
      </div>
      <div className="admin-grid">
        <LiquidGlass className="admin-form">
          <div className="admin-form-head">
            <h3>{t(language, "admin.newOpportunity")}</h3>
            <span><Globe2 size={16} /> {t(language, "admin.languageTabs")}</span>
          </div>
          <div className="language-tabs">
            {["RU", "EN", "KZ"].map((code) => (
              <button className={editLanguage === code ? "active" : ""} onClick={() => setEditLanguage(code)} key={code}>
                {languageNames[code]}
              </button>
            ))}
          </div>
          {["title", "category", "direction", "format", "description", "requirements"].map((field) => (
            <label key={field}>
              {t(language, `admin.fields.${field}`)}
              <input value={draft[field]?.[editLanguage] || ""} onChange={(event) => updateLocalized(field, event.target.value)} />
            </label>
          ))}
          <label>
            {t(language, "admin.fields.deadline")}
            <input value={draft.deadline} onChange={(event) => setDraft({ ...draft, deadline: event.target.value })} />
          </label>
          <label>
            <span className="field-with-icon"><Link2 size={15} />Ссылка для подачи</span>
            <input value={draft.applicationUrl} onChange={(event) => setDraft({ ...draft, applicationUrl: event.target.value })} placeholder="https://..." />
          </label>
          <button className="primary" onClick={addOpportunity}><Plus size={17} />{t(language, "admin.add")}</button>
        </LiquidGlass>
        <LiquidGlass className="admin-list">
          <div className="section-title compact">
            <h3>{t(language, "admin.content")}</h3>
            <button className="secondary" onClick={editFirstCourse}><Edit3 size={16} />{t(language, "admin.editCourse")}</button>
          </div>
          <div className="stats-row">
            <span><UsersRound /> 428 {t(language, "admin.students")}</span>
            <span>{opportunities.length} {t(language, "admin.opportunities")}</span>
            <span>{courses.length} {t(language, "admin.courses")}</span>
          </div>
          {opportunities.slice(0, 8).map((item) => (
            <article className="admin-row" key={item.id}>
              <div>
                <strong>{textFor(item, "title", language)}</strong>
                <small>{optionLabel(item.category, language)} · {item.deadline}</small>
              </div>
              <button className="icon-button danger" onClick={() => deleteOpportunity(item.id)}><Trash2 size={17} /></button>
            </article>
          ))}
        </LiquidGlass>
      </div>
    </section>
  );
}
