export function daysLeft(deadline) {
  const now = new Date();
  const target = new Date(`${deadline}T23:59:00+05:00`);
  return Math.ceil((target - now) / 86400000);
}

export function scoreByProfile(item, profile) {
  const haystack = new Set([...(item.tags || []), item.direction, item.category]);
  const interestScore = profile.interests.filter((tag) => haystack.has(tag)).length * 3;
  const subjectScore = profile.subjects.filter((tag) => haystack.has(tag)).length * 2;
  const gradeScore = item.grades?.includes(profile.grade) ? 2 : 0;
  return interestScore + subjectScore + gradeScore;
}

export function recommend(items, profile, limit = 4) {
  return [...items]
    .map((item) => ({ ...item, fit: scoreByProfile(item, profile) }))
    .sort((a, b) => b.fit - a.fit || daysLeft(a.deadline || "2026-12-31") - daysLeft(b.deadline || "2026-12-31"))
    .slice(0, limit);
}

export function formatDeadline(deadline) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" }).format(new Date(deadline));
}
