import { ADMIN_ACCOUNTS } from "./config/admins.js";

export const AUTH_CONFIG = {
  Pupil: {
    login: "pupil",
    email: "pupil@mentoria.kz",
    password: "pupil123",
    name: "Али Кутубаев",
  },
  Mentor: {
    login: "mentor",
    email: "mentor@mentoria.kz",
    password: "mentor123",
    name: "Mentoria Mentor",
  },
  Admin: ADMIN_ACCOUNTS,
};

export function findConfiguredUser(role, identifier, password) {
  const value = identifier.trim().toLowerCase();
  if (role === "Admin") {
    return AUTH_CONFIG.Admin.find((user) => (user.login.toLowerCase() === value || user.email.toLowerCase() === value) && user.password === password);
  }

  const user = AUTH_CONFIG[role];
  if (!user) return null;
  return (user.login.toLowerCase() === value || user.email.toLowerCase() === value) && user.password === password ? user : null;
}
