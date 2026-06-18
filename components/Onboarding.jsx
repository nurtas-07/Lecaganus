import { tags } from "../data/mockData.js";
import { LiquidGlass } from "./LiquidGlass.jsx";

export default function Onboarding({ profile, setProfile }) {
  const toggle = (tag) => {
    setProfile((current) => ({
      ...current,
      interests: current.interests.includes(tag) ? current.interests.filter((item) => item !== tag) : [...current.interests, tag],
    }));
  };

  return (
    <LiquidGlass className="onboarding-panel" intense>
      <div>
        <span className="eyebrow">Онбординг профиля</span>
        <h2>Рекомендации строятся по классу, целям и интересам</h2>
        <p>Это отвечает главному вопросу брифа: платформа заменяет хаос Telegram персональным маршрутом, который работает асинхронно.</p>
      </div>
      <div className="profile-form">
        <label>
          Класс
          <select value={profile.grade} onChange={(event) => setProfile({ ...profile, grade: event.target.value })}>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
          </select>
        </label>
        <label>
          Страна
          <input value={profile.country} onChange={(event) => setProfile({ ...profile, country: event.target.value })} />
        </label>
      </div>
      <div className="chip-grid">
        {tags.map((tag) => (
          <button className={profile.interests.includes(tag) ? "selected" : ""} key={tag} onClick={() => toggle(tag)}>
            {tag}
          </button>
        ))}
      </div>
    </LiquidGlass>
  );
}
