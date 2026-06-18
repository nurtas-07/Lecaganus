import CourseCard from "./CourseCard.jsx";
import MentorCoursePanel from "./MentorCoursePanel.jsx";

export default function Courses({ courses, setCourses, enrolled, setEnrolled, query, authUser }) {
  const filtered = courses.filter((course) => `${course.title} ${course.description} ${course.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));

  const completeLesson = (courseId) => {
    setCourses((items) => items.map((course) => {
      if (course.id !== courseId) return course;
      const step = Math.ceil(100 / Math.max(course.lessons.length, 1));
      const progress = Math.min(100, course.progress + step);
      return { ...course, progress, completedAt: progress >= 100 ? course.completedAt || new Date().toISOString() : course.completedAt };
    }));
    setEnrolled((items) => (items.includes(courseId) ? items : [...items, courseId]));
  };

  const toggleEnroll = (courseId) => {
    setEnrolled((items) => (items.includes(courseId) ? items.filter((id) => id !== courseId) : [...items, courseId]));
  };

  return (
    <section className="screen">
      <div className="section-title">
        <div>
          <span className="eyebrow">Курсы Mentoria</span>
          <h2>Асинхронные уроки, материалы, мини-задания и прогресс</h2>
        </div>
      </div>
      {authUser?.role === "Mentor" && <MentorCoursePanel setCourses={setCourses} />}
      <div className="course-grid">
        {filtered.map((course) => (
          <CourseCard course={course} onProgress={completeLesson} onEnroll={toggleEnroll} enrolled={enrolled.includes(course.id)} key={course.id} />
        ))}
      </div>
    </section>
  );
}
