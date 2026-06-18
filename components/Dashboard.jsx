import { Award, CalendarClock, CheckCircle2, Sparkles } from "lucide-react";
import { daysLeft, formatDeadline, recommend } from "../utils/recommendations.js";
import { LiquidGlass } from "./LiquidGlass.jsx";

export default function Dashboard({ opportunities, courses, saved, enrolled, profile, setActive }) {
  const savedItems = opportunities.filter((item) => saved.includes(item.id));
  const enrolledCourses = courses.filter((course) => enrolled.includes(course.id));
  const recommended = recommend(opportunities, profile, 3);
  const nextDeadlines = [...opportunities].sort((a, b) => daysLeft(a.deadline) - daysLeft(b.deadline)).slice(0, 4);
  const certificates = courses.filter((course) => course.progress >= 100).length;

  return (
    <section className="screen">
      <div className="kpi-row">
        <LiquidGlass className="kpi"><Sparkles /><span>Fit score</span><strong>92%</strong></LiquidGlass>
        <LiquidGlass className="kpi"><CheckCircle2 /><span>Прогресс</span><strong>{Math.round(courses.reduce((s, c) => s + c.progress, 0) / courses.length)}%</strong></LiquidGlass>
        <LiquidGlass className="kpi"><CalendarClock /><span>Дедлайны</span><strong>{nextDeadlines.length}</strong></LiquidGlass>
        <LiquidGlass className="kpi"><Award fill={certificates ? "currentColor" : "none"} /><span>Сертификаты</span><strong>{certificates}</strong></LiquidGlass>
      </div>
      <div className="dashboard-grid">
        <LiquidGlass className="wide-panel">
          <div className="section-title compact">
            <h2>Сохранённые возможности</h2>
            <button className="text-button" onClick={() => setActive("opportunities")}>Открыть каталог</button>
          </div>
          {savedItems.length ? savedItems.map((item) => (
            <article className="list-item" key={item.id}>
              <span className="tag">{item.category}</span>
              <strong>{item.title}</strong>
              <small>{formatDeadline(item.deadline)} · {item.direction}</small>
            </article>
          )) : <p>Сохрани хакатон или летнюю школу, чтобы увидеть их здесь.</p>}
        </LiquidGlass>
        <LiquidGlass className="wide-panel">
          <div className="section-title compact">
            <h2>Мои курсы</h2>
            <button className="text-button" onClick={() => setActive("courses")}>Учиться</button>
          </div>
          {enrolledCourses.map((course) => (
            <article className="course-mini" key={course.id}>
              <strong>{course.title}</strong>
              <div className="progress"><span style={{ width: `${course.progress}%` }} /></div>
              <small>{course.progress}% · следующий урок доступен</small>
            </article>
          ))}
        </LiquidGlass>
        <LiquidGlass className="wide-panel">
          <div className="section-title compact">
            <h2>Рекомендовано профилем</h2>
            <button className="text-button" onClick={() => setActive("home")}>Настроить</button>
          </div>
          {recommended.map((item) => (
            <article className="list-item" key={item.id}>
              <span className="fit">{item.fit} match</span>
              <strong>{item.title}</strong>
              <small>{item.tags.join(", ")}</small>
            </article>
          ))}
        </LiquidGlass>
      </div>
    </section>
  );
}
