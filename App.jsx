import React from "react";
import AdminPanel from "./components/AdminPanel.jsx";
import AuthModal from "./components/AuthModal.jsx";
import AssistantPanel from "./components/AssistantPanel.jsx";
import CalendarPanel from "./components/CalendarPanel.jsx";
import Courses from "./components/Courses.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Hero from "./components/Hero.jsx";
import Onboarding from "./components/Onboarding.jsx";
import Opportunities from "./components/Opportunities.jsx";
import ProfileStatsModal from "./components/ProfileStatsModal.jsx";
import Roadmap from "./components/Roadmap.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SupportPanel from "./components/SupportPanel.jsx";
import Topbar from "./components/Topbar.jsx";
import { coursesSeed, initialProfile, opportunitiesSeed } from "./data/mockData.js";
import { t } from "./i18n.js";
import { supabase } from "./lib/supabase.js";
import { recommend } from "./utils/recommendations.js";

function useLocalState(key, fallback) {
  const [value, setValue] = React.useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  });
  React.useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value]);
  return [value, setValue];
}

function toAppRole(role) {
  if (role === "admin" || role === "Admin") return "Admin";
  if (role === "mentor" || role === "Mentor") return "Mentor";
  return "Pupil";
}

function profileFromRow(row, fallback) {
  if (!row) return fallback;
  return {
    ...fallback,
    name: row.name || fallback.name,
    role: toAppRole(row.role).toLowerCase(),
    grade: row.grade ? String(row.grade) : fallback.grade,
    country: row.country || fallback.country,
    goals: row.goals?.length ? row.goals : fallback.goals,
    interests: row.interests?.length ? row.interests : fallback.interests,
    subjects: row.subjects?.length ? row.subjects : fallback.subjects,
  };
}

function authUserFromSession(session, profileRow) {
  const user = session?.user;
  if (!user) return null;
  const email = user.email || "";
  return {
    id: user.id,
    role: toAppRole(profileRow?.role),
    login: email,
    email,
    name: profileRow?.name || user.user_metadata?.name || email,
  };
}

export default function App() {
  const [active, setActive] = React.useState("home");
  const [query, setQuery] = React.useState("");
  const [authOpen, setAuthOpen] = React.useState(false);
  const [statsOpen, setStatsOpen] = React.useState(false);
  const [theme, setTheme] = useLocalState("mentoria-theme", "light");
  const [background, setBackground] = useLocalState("mentoria-background", "aurora");
  const [language, setLanguage] = useLocalState("mentoria-language", "RU");
  const [profile, setProfile] = useLocalState("mentoria-profile", initialProfile);
  const [authUser, setAuthUser] = React.useState(null);
  const [opportunities, setOpportunities] = useLocalState("mentoria-opportunities", opportunitiesSeed);
  const [courses, setCourses] = useLocalState("mentoria-courses", coursesSeed);
  const [saved, setSaved] = useLocalState("mentoria-saved", ["ai-hackathon", "startup-school"]);
  const [enrolled, setEnrolled] = useLocalState("mentoria-enrolled", ["academic-english", "sat-math"]);
  const [tickets, setTickets] = useLocalState("mentoria-tickets", [
    {
      id: "MH-1042",
      subject: "Не открывается материал SAT Math",
      type: "course",
      priority: "medium",
      status: "review",
      createdAt: "2026-06-16",
      message: "После завершения первого урока не вижу ссылку на worksheet.",
    },
    {
      id: "MH-1038",
      subject: "Проверить дедлайн AI Hackathon",
      type: "opportunity",
      priority: "low",
      status: "closed",
      createdAt: "2026-06-14",
      message: "Нужно подтвердить дату отправки проекта.",
    },
  ]);

  const toggleSaved = (id) => setSaved((items) => (items.includes(id) ? items.filter((item) => item !== id) : [...items, id]));
  const recommended = recommend(opportunities, profile, 3);

  React.useEffect(() => {
    let mounted = true;

    const loadProfile = async (session) => {
      if (!session?.user) {
        if (mounted) setAuthUser(null);
        return;
      }

      const { data: profileRow } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .maybeSingle();

      if (!mounted) return;
      setAuthUser(authUserFromSession(session, profileRow));
      setProfile((current) => profileFromRow(profileRow, current));
    };

    supabase.auth.getSession().then(({ data }) => loadProfile(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session);
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [setProfile]);

  React.useEffect(() => {
    const animateDoubleClick = (event) => {
      const target = event.target.closest("button");
      if (!target) return;
      target.classList.remove("double-tap");
      window.requestAnimationFrame(() => target.classList.add("double-tap"));
      window.setTimeout(() => target.classList.remove("double-tap"), 520);
    };

    document.addEventListener("dblclick", animateDoubleClick);
    return () => document.removeEventListener("dblclick", animateDoubleClick);
  }, []);

  return (
    <div className={`app ${theme} bg-${background}`}>
      <svg className="glass-filter" aria-hidden="true">
        <filter id="liquidRefraction">
          <feTurbulence type="fractalNoise" baseFrequency="0.015 0.025" numOctaves="2" seed="9" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div className="bg-field" />
      <Sidebar active={active} setActive={setActive} savedCount={saved.length} profile={profile} authUser={authUser} onProfileClick={() => setStatsOpen(true)} language={language} />
      <main className="workspace">
        <Topbar query={query} setQuery={setQuery} theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} background={background} setBackground={setBackground} authUser={authUser} onAuthClick={() => setAuthOpen(true)} />
        {active === "home" && (
          <>
            <Hero setActive={setActive} />
            <Onboarding profile={profile} setProfile={setProfile} />
            <section className="quick-panels">
              <AssistantPanel profile={profile} opportunities={opportunities} />
              <div className="recommend-strip">
                <div className="section-title compact">
                  <h2>Лучшие рекомендации</h2>
                  <button className="text-button" onClick={() => setActive("opportunities")}>{t(language, "nav.opportunities")} • {t(language, "opportunities.all")}</button>
                </div>
                {recommended.map((item) => (
                  <button className="mini-rec glass" onClick={() => setActive("opportunities")} key={item.id}>
                    <strong>{item.title}</strong>
                    <span>{item.fit} match · {item.category}</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}
        {active === "opportunities" && <Opportunities opportunities={opportunities} saved={saved} toggleSaved={toggleSaved} query={query} language={language} />}
        {active === "courses" && <Courses courses={courses} setCourses={setCourses} enrolled={enrolled} setEnrolled={setEnrolled} query={query} authUser={authUser} />}
        {active === "dashboard" && <Dashboard opportunities={opportunities} courses={courses} saved={saved} enrolled={enrolled} profile={profile} setActive={setActive} />}
        {active === "calendar" && <CalendarPanel opportunities={opportunities} />}
        {active === "roadmap" && <Roadmap />}
        {active === "support" && <SupportPanel tickets={tickets} setTickets={setTickets} language={language} />}
        {active === "admin" && (
          authUser?.role === "Admin"
            ? <AdminPanel opportunities={opportunities} setOpportunities={setOpportunities} courses={courses} setCourses={setCourses} language={language} />
            : (
              <section className="screen">
                <div className="locked-panel glass">
                  <span className="eyebrow">Доступ администратора</span>
                  <h2>Войдите через Admin-аккаунт Supabase</h2>
                  <p>Админ-панель открывается, если у профиля в таблице profiles стоит роль admin.</p>
                  <button className="primary" onClick={() => setAuthOpen(true)}>Войти как админ</button>
                </div>
              </section>
            )
        )}
      </main>
      {authOpen && <AuthModal authUser={authUser} setAuthUser={setAuthUser} setProfile={setProfile} onClose={() => setAuthOpen(false)} />}
      {statsOpen && <ProfileStatsModal authUser={authUser} profile={profile} courses={courses} saved={saved} enrolled={enrolled} tickets={tickets} onClose={() => setStatsOpen(false)} />}
    </div>
  );
}
