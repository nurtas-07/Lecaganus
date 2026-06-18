import { Bell, Languages, LogIn, Moon, Palette, Search, Sun, UserRound } from "lucide-react";
import { t } from "../i18n.js";

const backgrounds = ["aurora", "mesh", "sunrise", "midnight"];

export default function Topbar({
  query,
  setQuery,
  theme,
  setTheme,
  language,
  setLanguage,
  background,
  setBackground,
  authUser,
  onAuthClick,
}) {
  const cycleBackground = () => {
    const index = backgrounds.indexOf(background);
    setBackground(backgrounds[(index + 1) % backgrounds.length]);
  };

  return (
    <header className="topbar">
      <div>
        <h1>{t(language, "topbar.title")}</h1>
        <p>{t(language, "topbar.subtitle")}</p>
      </div>
      <label className="search">
        <Search size={19} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t(language, "topbar.search")} />
      </label>
      <button className="icon-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={t(language, "topbar.theme")}>
        {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </button>
      <button className="icon-button bg-picker" onClick={cycleBackground} aria-label="Сменить фон">
        <Palette size={20} />
      </button>
      <button className="icon-button" onClick={() => setLanguage(language === "RU" ? "EN" : language === "EN" ? "KZ" : "RU")} aria-label={t(language, "topbar.language")}>
        <Languages size={20} />
        <span>{language}</span>
      </button>
      <button className="icon-button notification" aria-label={t(language, "topbar.notifications")}>
        <Bell size={20} />
        <i>3</i>
      </button>
      <button className={authUser ? "auth-button signed" : "auth-button"} onClick={onAuthClick}>
        {authUser ? <UserRound size={18} /> : <LogIn size={18} />}
        <span>{authUser ? authUser.name : "Войти"}</span>
      </button>
    </header>
  );
}
