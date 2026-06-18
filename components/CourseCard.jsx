import { Award, CheckCircle2, ExternalLink, FileText, PlayCircle, UserCheck, X } from "lucide-react";
import React from "react";
import { normalizeVideoUrl } from "../utils/video.js";
import { LiquidGlass } from "./LiquidGlass.jsx";

function cleanCourseTitle(title) {
  return title
    .replace(/(\s*[·•]\s*)?(обновлено ментором|updated by mentor)/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function relativeUpdated(updatedAt) {
  if (!updatedAt) return null;
  const minutes = Math.max(1, Math.round((Date.now() - new Date(updatedAt).getTime()) / 60000));
  if (minutes < 60) return `обновлено ${minutes} мин назад`;
  const hours = Math.round(minutes / 60);
  return `обновлено ${hours} ч назад`;
}

function VideoPlayer({ course, title }) {
  const video = normalizeVideoUrl(course.videoUrl);

  if (!video) {
    return (
      <div className="video-placeholder">
        <PlayCircle size={44} />
        <span>Видео будет добавлено ментором</span>
      </div>
    );
  }

  if (video.kind === "embed") {
    return <iframe src={video.src} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />;
  }

  if (video.kind === "file") {
    return <video src={video.src} title={title} controls playsInline />;
  }

  return (
    <a className="video-link" href={video.src} target="_blank" rel="noreferrer">
      <ExternalLink size={28} />
      <span>Открыть видео в источнике</span>
    </a>
  );
}

export default function CourseCard({ course, onProgress, enrolled, onEnroll }) {
  const [activeLesson, setActiveLesson] = React.useState(null);
  const completed = course.progress >= 100;
  const updated = relativeUpdated(course.updatedAt);
  const title = cleanCourseTitle(course.title);

  const completeActiveLesson = () => {
    onProgress(course.id);
    setActiveLesson(null);
  };

  return (
    <>
      <LiquidGlass className="course-card">
        <div className="course-cover">
          <PlayCircle size={42} />
          <span>{course.direction}</span>
        </div>
        <div className="course-body">
          <div className="card-topline">
            <span className="tag">{course.level}</span>
            <span>{course.lessons.length} урока</span>
          </div>
          <h3>{title}</h3>
          {updated && <span className="updated-note">{updated}</span>}
          <p>{course.description}</p>
          <div className="progress">
            <span style={{ width: `${course.progress}%` }} />
          </div>
          <b className="progress-label">{course.progress}% завершено</b>
          <div className="lesson-list">
            {course.lessons.map((lesson, index) => {
              const done = course.progress >= Math.ceil(((index + 1) / course.lessons.length) * 100) || completed;
              return (
                <button className="lesson-button" onClick={() => setActiveLesson(lesson)} key={lesson.id}>
                  <CheckCircle2 size={17} className={done ? "done" : ""} fill={done ? "currentColor" : "none"} />
                  <div>
                    <strong>{lesson.title}</strong>
                    <span>{lesson.minutes} мин · {lesson.task}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="materials">
            {course.materials.map((material) => (
              <span key={material}><FileText size={15} />{material}</span>
            ))}
          </div>
          {completed && (
            <div className="certificate-strip">
              <Award size={18} fill="currentColor" />
              <div>
                <strong>Сертификат готов</strong>
                <span>Mentoria Hub · {title}</span>
              </div>
            </div>
          )}
          <div className="course-actions">
            <button className="primary" onClick={() => setActiveLesson(course.lessons[0])}>{completed ? "Повторить урок" : "Открыть урок"}</button>
            <button className={enrolled ? "secondary state-on" : "secondary"} onClick={() => onEnroll(course.id)}>
              <UserCheck size={17} fill={enrolled ? "currentColor" : "none"} />
              {enrolled ? "В кабинете" : "Записаться"}
            </button>
          </div>
        </div>
      </LiquidGlass>
      {activeLesson && (
        <div className="modal-backdrop">
          <LiquidGlass className="lesson-modal">
            <div className="modal-head">
              <div>
                <span className="eyebrow">{title}</span>
                <h2>{activeLesson.title}</h2>
                <p>{activeLesson.minutes} мин · {activeLesson.task}</p>
              </div>
              <button className="icon-button" onClick={() => setActiveLesson(null)} aria-label="Закрыть"><X size={18} /></button>
            </div>
            <div className="video-frame">
              <VideoPlayer course={course} title={activeLesson.title} />
            </div>
            <div className="lesson-task">
              <strong>Мини-задание</strong>
              <p>{activeLesson.task}</p>
            </div>
            <button className="primary" onClick={completeActiveLesson}>Завершить урок</button>
          </LiquidGlass>
        </div>
      )}
    </>
  );
}
