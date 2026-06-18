import { Lock, LogIn, ShieldCheck, UserPlus, X } from "lucide-react";
import React from "react";
import { supabase } from "../lib/supabase.js";
import { LiquidGlass } from "./LiquidGlass.jsx";

const roleLabels = {
  Pupil: "Ученик",
  Mentor: "Ментор",
  Admin: "Админ",
};

const roleToDb = {
  Pupil: "student",
  Mentor: "mentor",
  Admin: "admin",
};

function toAppRole(role) {
  if (role === "admin" || role === "Admin") return "Admin";
  if (role === "mentor" || role === "Mentor") return "Mentor";
  return "Pupil";
}

function profileToAuthUser(user, profile) {
  return {
    id: user.id,
    role: toAppRole(profile?.role),
    login: user.email,
    email: user.email,
    name: profile?.name || user.user_metadata?.name || user.email,
  };
}

function profileToLocalState(profile, fallback) {
  if (!profile) return fallback;
  return {
    ...fallback,
    name: profile.name || fallback.name,
    role: toAppRole(profile.role).toLowerCase(),
    grade: profile.grade ? String(profile.grade) : fallback.grade,
    country: profile.country || fallback.country,
    goals: profile.goals?.length ? profile.goals : fallback.goals,
    interests: profile.interests?.length ? profile.interests : fallback.interests,
    subjects: profile.subjects?.length ? profile.subjects : fallback.subjects,
  };
}

export default function AuthModal({ onClose, authUser, setAuthUser, setProfile }) {
  const [mode, setMode] = React.useState("login");
  const [role, setRole] = React.useState("Pupil");
  const [form, setForm] = React.useState({ name: "", identifier: "", password: "" });
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const loadProfile = async (user) => {
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) throw profileError;
    setAuthUser(profileToAuthUser(user, data));
    setProfile((current) => profileToLocalState(data, current));
  };

  const submit = async () => {
    setError("");
    const email = form.identifier.trim();
    if (!email || !form.password) {
      setError("Заполни email и пароль.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        const name = form.name.trim() || email;
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password: form.password,
          options: {
            data: {
              name,
              role: roleToDb[role],
            },
          },
        });

        if (signUpError) throw signUpError;
        if (!data.user) throw new Error("Supabase не вернул пользователя после регистрации.");

        const { error: profileError } = await supabase.from("profiles").upsert({
          id: data.user.id,
          name,
          role: roleToDb[role],
          grade: role === "Pupil" ? 11 : null,
          country: "Kazakhstan",
          goals: [],
          interests: [],
          subjects: [],
        });

        if (profileError) throw profileError;
        if (data.session) {
          await loadProfile(data.user);
          onClose();
          return;
        }

        setError("Проверь email и подтверди регистрацию, потом войди.");
        return;
      }

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: form.password,
      });

      if (signInError) throw signInError;
      if (!data.user) throw new Error("Supabase не вернул пользователя после входа.");
      await loadProfile(data.user);
      onClose();
    } catch (authError) {
      setError(authError.message || "Не получилось войти. Проверь данные.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setAuthUser(null);
    setLoading(false);
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <LiquidGlass className="auth-modal">
        <div className="modal-head">
          <div>
            <span className="eyebrow">{authUser ? "Аккаунт" : "Вход и регистрация"}</span>
            <h2>{authUser ? authUser.name : "Mentoria Hub ID"}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Закрыть"><X size={18} /></button>
        </div>

        {authUser ? (
          <div className="auth-current">
            <ShieldCheck size={22} />
            <div>
              <strong>{authUser.name}</strong>
              <span>{roleLabels[authUser.role]} · {authUser.email || authUser.login}</span>
            </div>
            <button className="secondary" onClick={logout} disabled={loading}>Выйти</button>
          </div>
        ) : (
          <>
            <div className="auth-tabs">
              <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}><LogIn size={16} />Вход</button>
              <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}><UserPlus size={16} />Регистрация</button>
            </div>
            <div className="auth-tabs role-tabs">
              {Object.keys(roleLabels).map((item) => (
                <button className={role === item ? "active" : ""} onClick={() => setRole(item)} key={item}>
                  {roleLabels[item]}
                </button>
              ))}
            </div>
            {mode === "register" && (
              <label>
                Имя
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Али Кутубаев" />
              </label>
            )}
            <label>
              Email
              <input value={form.identifier} onChange={(event) => setForm({ ...form, identifier: event.target.value })} placeholder="login@email.com" />
            </label>
            <label>
              Пароль
              <input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} type="password" placeholder="••••••••" />
            </label>
            {error && <div className="auth-error"><Lock size={16} />{error}</div>}
            <button className="primary" onClick={submit} disabled={loading}>
              {loading ? "Подождите..." : mode === "register" ? "Зарегистрироваться" : "Войти"}
            </button>
          </>
        )}
      </LiquidGlass>
    </div>
  );
}
