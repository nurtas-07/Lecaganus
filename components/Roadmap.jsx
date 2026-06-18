import { Flag, GraduationCap, Milestone, Rocket } from "lucide-react";
import { LiquidGlass } from "./LiquidGlass.jsx";

const steps = [
  { grade: "8 класс", icon: Milestone, title: "Найти интересы", text: "Попробовать STEM, английский, проекты и первые олимпиады." },
  { grade: "9 класс", icon: Rocket, title: "Собрать портфолио", text: "Выбрать 2 направления, вести activity tracker, пройти 2 курса." },
  { grade: "10 класс", icon: Flag, title: "Выйти на уровень", text: "Хакатоны, исследования, летние школы, IELTS/SAT план." },
  { grade: "11 класс", icon: GraduationCap, title: "Подать сильную заявку", text: "Эссе, рекомендации, дедлайны, финальные курсы и scholarship shortlist." },
];

export default function Roadmap() {
  return (
    <section className="screen">
      <div className="section-title">
        <div>
          <span className="eyebrow">Бонусная функция</span>
          <h2>Индивидуальный roadmap для 8-11 классов</h2>
        </div>
      </div>
      <div className="roadmap">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <LiquidGlass className="roadmap-step" key={step.grade}>
              <div className="roadmap-head">
                <Icon size={21} />
                <span>{step.grade}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </LiquidGlass>
          );
        })}
      </div>
    </section>
  );
}
