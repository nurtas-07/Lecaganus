import { Film, Link2, Plus, UploadCloud } from "lucide-react";
import React from "react";
import { LiquidGlass } from "./LiquidGlass.jsx";

export default function MentorCoursePanel({ setCourses }) {
  const [draft, setDraft] = React.useState({
    title: "Project Portfolio Lab",
    direction: "Портфолио",
    level: "Начальный",
    description: "Курс от ментора: как собрать сильный проект для заявки.",
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    videoName: "",
  });

  const addCourse = () => {
    setCourses((items) => [
      {
        id: `mentor-${Date.now()}`,
        ...draft,
        progress: 0,
        materials: ["Project brief", "Portfolio checklist", "Pitch template"],
        tags: [draft.direction, "Поступление"],
        lessons: [
          { id: `mentor-l1-${Date.now()}`, title: "Выбор идеи", minutes: 18, task: "Опиши проблему, аудиторию и результат." },
          { id: `mentor-l2-${Date.now()}`, title: "План проекта", minutes: 24, task: "Собери roadmap на 2 недели." },
          { id: `mentor-l3-${Date.now()}`, title: "Финальная упаковка", minutes: 30, task: "Запиши короткий pitch." },
        ],
      },
      ...items,
    ]);
  };

  const pickLocalVideo = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setDraft((current) => ({ ...current, videoUrl: objectUrl, videoName: file.name }));
  };

  return (
    <LiquidGlass className="mentor-panel">
      <div>
        <span className="eyebrow">Панель ментора</span>
        <h2>Добавить курс для учеников</h2>
        <p>Прикрепи ссылку YouTube, TikTok, Vimeo, Instagram или загрузи видеофайл с компьютера.</p>
      </div>
      <div className="mentor-form">
        <label>
          Название курса
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} />
        </label>
        <label>
          Направление
          <input value={draft.direction} onChange={(event) => setDraft({ ...draft, direction: event.target.value })} />
        </label>
        <label>
          Уровень
          <input value={draft.level} onChange={(event) => setDraft({ ...draft, level: event.target.value })} />
        </label>
        <label>
          Описание
          <textarea value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} />
        </label>
        <label>
          <span className="field-with-icon"><Link2 size={15} />Ссылка на видео</span>
          <input value={draft.videoUrl} onChange={(event) => setDraft({ ...draft, videoUrl: event.target.value, videoName: "" })} placeholder="https://youtube.com/watch?v=..." />
        </label>
        <label className="file-drop">
          <span className="field-with-icon"><UploadCloud size={15} />Локальный видеофайл</span>
          <input type="file" accept="video/*" onChange={pickLocalVideo} />
          <strong>{draft.videoName || "Выбрать файл"}</strong>
        </label>
      </div>
      <button className="primary" onClick={addCourse}><Plus size={17} />Добавить курс</button>
    </LiquidGlass>
  );
}
