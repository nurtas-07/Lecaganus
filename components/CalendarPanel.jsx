import { ChevronLeft, ChevronRight } from "lucide-react";
import { daysLeft } from "../utils/recommendations.js";
import { LiquidGlass } from "./LiquidGlass.jsx";

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function sameDate(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export default function CalendarPanel({ opportunities }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstDay.getDay() + 6) % 7;
  const cells = [
    ...Array.from({ length: leadingBlanks }, (_, index) => ({ type: "blank", key: `blank-${index}` })),
    ...Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(year, month, index + 1);
      return { type: "day", key: date.toISOString(), date };
    }),
  ];

  const deadlineDays = new Map(
    opportunities.map((item) => {
      const date = new Date(`${item.deadline}T12:00:00`);
      return [`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`, item];
    })
  );

  const monthTitle = new Intl.DateTimeFormat("ru-RU", { month: "long", year: "numeric" }).format(today);

  return (
    <section className="screen split-screen">
      <LiquidGlass className="calendar-card" intense>
        <div className="calendar-head">
          <h2>{monthTitle[0].toUpperCase() + monthTitle.slice(1)}</h2>
          <div><ChevronLeft /><ChevronRight /></div>
        </div>
        <div className="weekdays">{weekdays.map((day) => <span key={day}>{day}</span>)}</div>
        <div className="month-grid">
          {cells.map((cell) => {
            if (cell.type === "blank") return <span className="calendar-empty" key={cell.key} />;
            const item = deadlineDays.get(`${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`);
            return (
              <button className={sameDate(cell.date, today) ? "today" : item ? "has-event" : ""} key={cell.key}>
                {cell.date.getDate()}
                {item && <i />}
              </button>
            );
          })}
        </div>
      </LiquidGlass>
      <div className="deadline-list">
        <h2>Ближайшие дедлайны</h2>
        {opportunities.slice(0, 6).map((item) => (
          <LiquidGlass className="deadline-item" key={item.id}>
            <span className="color-line" />
            <strong>{item.title}</strong>
            <small>{item.category}</small>
            <b>{daysLeft(item.deadline)} дня</b>
          </LiquidGlass>
        ))}
      </div>
    </section>
  );
}
