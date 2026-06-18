import { ChevronDown, Layers3, MonitorPlay, School, Search, Tags } from "lucide-react";
import React from "react";
import { tags } from "../data/mockData.js";
import { optionLabel, t, textFor } from "../i18n.js";
import OpportunityCard from "./OpportunityCard.jsx";

function FilterControl({ icon: Icon, label, value, options, onChange, language }) {
  return (
    <label className="filter-control">
      <Icon size={18} />
      <span>{label}</span>
      <strong>{optionLabel(value, language)}</strong>
      <ChevronDown size={18} className="chevron" />
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
        {options.map((item) => (
          <option value={item} key={item}>{optionLabel(item, language)}</option>
        ))}
      </select>
    </label>
  );
}

export default function Opportunities({ opportunities, saved, toggleSaved, query, language }) {
  const [category, setCategory] = React.useState("Все");
  const [grade, setGrade] = React.useState("Все");
  const [format, setFormat] = React.useState("Все");
  const [direction, setDirection] = React.useState("Все");

  const categories = ["Все", ...new Set(opportunities.map((item) => item.category))];
  const formats = ["Все", ...new Set(opportunities.map((item) => item.format))];
  const filtered = opportunities.filter((item) => {
    const text = `${textFor(item, "title", language)} ${textFor(item, "description", language)} ${item.tags.join(" ")}`.toLowerCase();
    return (
      (category === "Все" || item.category === category) &&
      (grade === "Все" || item.grades.includes(grade)) &&
      (format === "Все" || item.format === format) &&
      (direction === "Все" || item.direction === direction) &&
      text.includes(query.toLowerCase())
    );
  });
  const filterSignature = `${category}-${grade}-${format}-${direction}-${query}-${language}`;

  return (
    <section className="screen">
      <div className="section-title">
        <div>
          <span className="eyebrow">{t(language, "opportunities.eyebrow")}</span>
          <h2>{t(language, "opportunities.title")}</h2>
        </div>
        <div className="result-count">
          <Search size={17} />
          {filtered.length} {t(language, "opportunities.found")}
        </div>
      </div>
      <div className="filters">
        <FilterControl icon={Tags} label={t(language, "opportunities.category")} value={category} options={categories} onChange={setCategory} language={language} />
        <FilterControl icon={School} label={t(language, "opportunities.grades")} value={grade} options={["Все", "8", "9", "10", "11"]} onChange={setGrade} language={language} />
        <FilterControl icon={MonitorPlay} label={t(language, "opportunities.format")} value={format} options={formats} onChange={setFormat} language={language} />
        <FilterControl icon={Layers3} label={t(language, "opportunities.direction")} value={direction} options={["Все", ...tags]} onChange={setDirection} language={language} />
      </div>
      <div className="card-grid opportunities-grid" key={filterSignature}>
        {filtered.map((item) => (
          <OpportunityCard item={item} saved={saved.includes(item.id)} onSave={toggleSaved} language={language} key={item.id} />
        ))}
      </div>
    </section>
  );
}
