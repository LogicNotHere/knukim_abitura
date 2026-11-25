"use client";
import type { Faculty, Course, Teacher, Program, DemoEvent } from "../lib/data";

import Link from "next/link";
import { Fragment } from "react";
import {
  DATA,
  find,
  money,
  levelLabel,
  formatLabel,
  courseFormat,
  eventCategories,
} from "../lib/data";
import { useDemo } from "./DemoProvider";
import { cx, routeHref, esc, image, button } from "./Common";
export function FacultyCard({
  faculty,
  index,
}: {
  faculty: Faculty;
  index: number;
}) {
  const programs = DATA.programs.filter(
    (program) => program.faculty === faculty.id,
  );
  const departments = DATA.departments.filter(
    (department) => department.faculty === faculty.id,
  );
  return (
    <>
      <article className={cx("ku-faculty-card")}>
        <Link
          href={routeHref(`/faculty/${faculty.id}`)}
          aria-label={`Факультет ${esc(faculty.name)}`}
        >
          <div className={cx("ku-faculty-image")}>
            {image(
              faculty.image,
              `Ілюстрація напряму: ${faculty.name}`,
              'loading="lazy"',
            )}
            <span className={cx("ku-faculty-number")}>0{index + 1}</span>
            <span className={cx("ku-chip")}>{esc(faculty.tags[0])}</span>
          </div>
          <div className={cx("ku-faculty-info")}>
            <h3>{esc(faculty.name)}</h3>
            <p>{esc(faculty.description)}</p>
            <div className={cx("ku-faculty-meta")}>
              <span>
                {departments.length}{" "}
                {departments.length === 1 ? "кафедра" : "кафедри"}
              </span>
              <span>
                {programs.length}{" "}
                {programs.length === 1 ? "програма" : "програми"}
              </span>
            </div>
            <div className={cx("ku-chips")}>
              {faculty.tags.slice(1).map((tag, itemIndex) => (
                <Fragment key={itemIndex}>
                  <span className={cx("ku-chip")}>{esc(tag)}</span>
                </Fragment>
              ))}
            </div>
            <span className={cx("ku-text-link")}>Дізнатися більше</span>
          </div>
        </Link>
      </article>
    </>
  );
}
export function CourseCard({ course }: { course: Course }) {
  return (
    <>
      <article className={cx("ku-course-card")}>
        <Link
          className={cx("ku-course-img")}
          href={routeHref(`/course/${course.id}`)}
          aria-label={`Курс ${esc(course.name)}`}
        >
          {image(
            course.image,
            `Творча практика: ${course.name}`,
            'loading="lazy"',
          )}
          <span className={cx("ku-chip")}>{courseFormat(course.format)}</span>
        </Link>
        <div className={cx("ku-course-body")}>
          <span className={cx("ku-mini-label")}>
            {find("faculties", course.faculty).name}
          </span>
          <h3>
            <Link href={routeHref(`/course/${course.id}`)}>
              {esc(course.name)}
            </Link>
          </h3>
          <div className={cx("ku-course-meta")}>
            <span>{course.duration}</span>
            <span>
              {"Старт: "}
              {course.start}
            </span>
          </div>
          <div className={cx("ku-course-price")}>
            <strong>
              {money(course.price)}
              {" ₴"}
            </strong>
            <span>за весь курс</span>
          </div>
          <span className={cx("ku-demo-label")}>Демонстраційні дані</span>
          <div className={cx("ku-actions")}>
            {button("Детальніше", `course/${course.id}`, "ku-outline")}
            {button(
              "Зареєструватися",
              `course/${course.id}/register`,
              "ku-lime",
            )}
          </div>
        </div>
      </article>
    </>
  );
}
export function TeacherCard({ teacher }: { teacher: Teacher }) {
  return (
    <>
      <article className={cx("ku-teacher")}>
        <div className={cx(`ku-avatar ku-${teacher.color}`)} aria-hidden="true">
          {teacher.initials}
        </div>
        <div>
          <span className={cx("ku-mini-label")}>Вигаданий викладач</span>
          <h3>{teacher.name}</h3>
          <b className={cx("ku-mini-label")}>{teacher.role}</b>
          <p>{teacher.description}</p>
        </div>
      </article>
    </>
  );
}
export function Teachers({ ids }: { ids: string[] }) {
  return (
    <>
      <div className={cx("ku-teachers")}>
        {ids.map((id, itemIndex) => (
          <TeacherCard teacher={find("teachers", id)} key={itemIndex} />
        ))}
      </div>
      <span className={cx("ku-demo-label")}>
        Демонстраційні дані. Імена та біографії вигадані.
      </span>
    </>
  );
}
export function ProjectCards({ facultyId }: { facultyId: string }) {
  const { onAction } = useDemo();
  let projects = DATA.studentProjects.filter(
    (project) => project.faculty === facultyId,
  );
  if (!projects.length) projects = DATA.studentProjects.slice(2);
  return (
    <>
      <div className={cx("ku-projects")}>
        {projects.map((project, itemIndex) => (
          <Fragment key={itemIndex}>
            <button
              className={cx("ku-project")}
              type="button"
              data-action="project"
              data-id={project.id}
              onClick={onAction}
            >
              {image(project.image, project.type, 'loading="lazy"')}
              <div>
                <p>{project.type}</p>
                <h3>{project.name}</h3>
                <p>Демонстраційна робота · відкрити опис</p>
              </div>
            </button>
          </Fragment>
        ))}
      </div>
    </>
  );
}
export function ProgramLinks({ programs }: { programs: Program[] }) {
  return (
    <>
      <div className={cx("ku-link-list")}>
        {programs.map((program, itemIndex) => (
          <Fragment key={itemIndex}>
            <Link
              className={cx("ku-link-row")}
              href={routeHref(`/program/${program.id}`)}
            >
              <div>
                <h3>{program.name}</h3>
                <div className={cx("ku-chips")}>
                  <span className={cx("ku-chip")}>
                    {levelLabel(program.level)}
                  </span>
                  <span className={cx("ku-chip")}>
                    {program.formats.map(formatLabel).join(" / ")}
                  </span>
                  <span className={cx("ku-chip")}>
                    {program.creative
                      ? "Творчий конкурс"
                      : "Без творчого конкурсу"}
                  </span>
                </div>
                <p
                  style={{
                    marginTop: "10px",
                  }}
                >
                  {money(program.price)}
                  {" ₴ / рік · демонстраційна ціна"}
                </p>
              </div>
              <span className={cx("ku-link-mark")} aria-hidden="true">
                +
              </span>
            </Link>
          </Fragment>
        ))}
      </div>
    </>
  );
}
export function MapGraphic() {
  return (
    <>
      <div
        className={cx("ku-map")}
        role="img"
        aria-label="Умовна схема розташування демо-кампусу. Це не навігаційна карта."
      >
        <svg
          viewBox="0 0 600 430"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <rect width="600" height="430" fill="#ebece4"></rect>
          <g fill="#d8dfce">
            <rect x="20" y="20" width="145" height="70" rx="12"></rect>
            <rect x="217" y="20" width="115" height="85" rx="12"></rect>
            <rect x="380" y="5" width="196" height="90" rx="12"></rect>
            <rect x="34" y="165" width="120" height="114" rx="12"></rect>
            <rect x="403" y="161" width="180" height="100" rx="12"></rect>
            <rect x="227" y="300" width="120" height="100" rx="12"></rect>
            <rect x="400" y="311" width="160" height="100" rx="12"></rect>
          </g>
          <g stroke="#fff" strokeWidth="26" fill="none">
            <path d="M-20 125H620"></path>
            <path d="M-20 298H620"></path>
            <path d="M185 -10V450"></path>
            <path d="M370 -10V450"></path>
          </g>
          <g stroke="#bdc4b4" strokeWidth="1" fill="none">
            <path d="M-20 125H620"></path>
            <path d="M-20 298H620"></path>
            <path d="M185 -10V450"></path>
            <path d="M370 -10V450"></path>
          </g>
          <rect
            x="225"
            y="166"
            width="105"
            height="90"
            rx="10"
            fill="#7144ed"
          ></rect>
          <path
            d="M278 130c-18 0-32 14-32 32 0 24 32 52 32 52s32-28 32-52c0-18-14-32-32-32"
            fill="#151515"
          ></path>
          <circle cx="278" cy="162" r="10" fill="#d4ff5a"></circle>
          <text x="420" y="136" fontFamily="Arial" fontSize="10" fill="#757b6b">
            вул. Творча (умовна)
          </text>
        </svg>
        <span className={cx("ku-map-tag")}>ІЛЮСТРАТИВНА СХЕМА</span>
        <div className={cx("ku-map-label")}>
          <strong>Твоя точка старту</strong>Умовна адреса: Київ, вул. Творча, 1
          <br />
          Демонстраційні дані
        </div>
      </div>
    </>
  );
}
export function FinalCTA() {
  return (
    <>
      <section className={cx("ku-section")}>
        <div className={cx("ku-container")}>
          <div className={cx("ku-final")}>
            <h2>
              Зроби перший крок
              <br />
              до своєї професії.
            </h2>
            <p>
              Не обов’язково знати всі відповіді. Почни з того, що тебе надихає.
            </p>
            <div className={cx("ku-actions")}>
              {button("Підібрати програму", "matcher", "ku-lime")}
              {button("Переглянути факультети", "faculties", "ku-white")}
              {button("Поставити запитання", "contacts", "ku-outline")}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
export function FaqItems({ type }: { type: string }) {
  const items =
    type === "courses"
      ? [
          [
            "Чи допоможе курс підготуватися до конкурсу?",
            "У демо курси показують формат практики та підготовки. Участь у курсі не гарантує вступ.",
          ],
          [
            "Чи можна навчатися онлайн?",
            "Відфільтруй курси за форматом. На сторінці кожного курсу є розклад і формат занять.",
          ],
          [
            "Це справжня реєстрація?",
            "Ні. Форма перевіряє поля локально. Вона не надсилає дані й не бронює місце.",
          ],
        ]
      : [
          [
            "Коли з’являться остаточні правила вступу 2027?",
            "Дата наразі невідома. Цей демонстраційний сайт не публікує офіційних правил. Перевіряй підтверджені умови на офіційних ресурсах.",
          ],
          [
            "Як зрозуміти, чи потрібен творчий конкурс?",
            "Відкрий програму та перевір блок умов. У демо кожна програма має явну позначку конкурсу. Реальні умови потрібно буде підтвердити.",
          ],
          [
            "Чи є бюджетні місця?",
            "Кількість та розподіл місць 2027 року невідомі. Усі ціни на цій сторінці — демонстраційні приклади контракту.",
          ],
          [
            "Я ще не знаю, яку програму обрати. Що робити?",
            "Почни з підбору програми за інтересами. Порівняй навчальні плани та спробуй підготовчий курс.",
          ],
        ];
  return items.map(([question, answer], itemIndex) => (
    <Fragment key={itemIndex}>
      <details>
        <summary>{question}</summary>
        <p>{answer}</p>
      </details>
    </Fragment>
  ));
}
export function EventRow({ event }: { event: DemoEvent }) {
  const { onAction } = useDemo();
  return (
    <>
      <article className={cx("ku-event-row")}>
        <div className={cx("ku-event-date")}>
          <strong>{event.date}</strong>
          <span>{event.month}</span>
        </div>
        <div>
          <h3>{event.title}</h3>
          <p>{event.location}</p>
        </div>
        <span className={cx("ku-chip")}>{eventCategories[event.category]}</span>
        <button
          type="button"
          data-action="event"
          data-id={event.id}
          onClick={onAction}
        >
          Детальніше
        </button>
      </article>
    </>
  );
}
