"use client";
import type { Course } from "../lib/data";

import Link from "next/link";
import { Fragment } from "react";
import { DATA, find, money, courseFormat } from "../lib/data";
import { filteredCourses } from "../lib/catalog";
import { useDemo } from "./DemoProvider";
import {
  cx,
  routeHref,
  image,
  button,
  demo,
  crumb,
  sectionHead,
  EmptyState,
  LocalForm,
} from "./Common";
import { CourseCard, TeacherCard, FinalCTA, FaqItems } from "./Cards";
export function CourseResults() {
  const { state } = useDemo();
  const courses = filteredCourses(state.course);
  return (
    <>
      <p
        className={cx("ku-muted")}
        role="status"
        style={{
          fontSize: "13px",
          marginBottom: "22px",
        }}
      >
        {"Знайдено курсів: "}
        <b>{courses.length}</b>
      </p>
      <div className={cx("ku-courses-grid")}>
        {courses.length ? (
          courses.map((course, itemIndex) => (
            <CourseCard course={course} key={itemIndex} />
          ))
        ) : (
          <EmptyState
            text="Для цих параметрів курсів ще немає. Обери інший напрям або формат."
            action="reset-courses"
          />
        )}
      </div>
    </>
  );
}
export function CourseCatalog() {
  const { state, onFieldChange } = useDemo();
  return (
    <>
      <div className={cx("ku-container")}>
        {crumb([["Підготовчі курси"]])}
        <section className={cx("ku-page-hero")}>
          <div className={cx("ku-eyebrow")}>Спробуй до великого старту</div>
          <h1 className={cx("ku-page-title")}>
            Талант любить
            <br />
            практику.
          </h1>
          <p className={cx("ku-page-intro")}>
            Зніми першу сцену, знайди свій голос або збери портфоліо. Обери
            майстерню для власного першого кроку.
          </p>
          {demo()}
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "10px",
          }}
        >
          <div
            className={cx("ku-two-col")}
            style={{
              gap: "20px",
              maxWidth: "750px",
              marginBottom: "25px",
            }}
          >
            <label className={cx("ku-field")}>
              <span>Напрям</span>
              <select
                data-course-filter="interest"
                onChange={onFieldChange}
                value={state.course["interest" as keyof typeof state.course]}
              >
                <option value="">Усі напрями</option>
                {DATA.interests.map((interest, itemIndex) => (
                  <Fragment key={itemIndex}>
                    <option value={interest.id}>{interest.label}</option>
                  </Fragment>
                ))}
              </select>
            </label>
            <label className={cx("ku-field")}>
              <span>Формат</span>
              <select
                data-course-filter="format"
                onChange={onFieldChange}
                value={state.course["format" as keyof typeof state.course]}
              >
                <option value="">Усі формати</option>
                <option value="online">Онлайн</option>
                <option value="offline">Офлайн</option>
              </select>
            </label>
          </div>
          <div id="course-results">{<CourseResults />}</div>
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          {sectionHead(
            "Перевір свій інтерес",
            <>
              Курс — маленька
              <br />
              репетиція майбутнього.
            </>,
          )}
          <div className={cx("ku-facility-grid")}>
            {[
              [
                "01",
                "Спробуй на практиці",
                "Зроби першу роботу й відчуй процес.",
              ],
              [
                "02",
                "Отримай зворотний зв’язок",
                "Розбери завдання з майстром.",
              ],
              [
                "03",
                "Зрозумій свій наступний крок",
                "Вибери, що варто розвивати далі.",
              ],
            ].map(([n, t, d], itemIndex) => (
              <Fragment key={itemIndex}>
                <div className={cx("ku-facility")}>
                  <span>
                    {n}
                    {" / ТВІЙ ДОСВІД"}
                  </span>
                  <h3>{t}</h3>
                  <p
                    className={cx("ku-muted")}
                    style={{
                      fontSize: "13px",
                      marginTop: "12px",
                    }}
                  >
                    {d}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          <div className={cx("ku-two-col")}>
            <div>
              <h2>Як записатися</h2>
              <ul className={cx("ku-flat-list")}>
                {[
                  "Обери майстерню та формат",
                  "Переглянь програму й розклад",
                  "Спробуй демонстраційну реєстрацію",
                ].map((text, i) => (
                  <Fragment key={i}>
                    <li>
                      <span>0{i + 1}</span>
                      <strong>{text}</strong>
                    </li>
                  </Fragment>
                ))}
              </ul>
              <p>Демо-форма не бронює місце й не надсилає дані.</p>
            </div>
            <div>
              <h2>Часті запитання</h2>
              <div className={cx("ku-faq")}>{<FaqItems type="courses" />}</div>
            </div>
          </div>
        </section>
        <div className={cx("ku-note")}>
          <span className={cx("ku-note-icon")}>?</span>
          <p>
            <b>Відділ підготовчих курсів</b>
            <br />
            courses@example.invalid · +380 (00) 000-00-02
            <br />
            Демонстраційні контакти
          </p>
          {button("Поставити запитання", "contacts", "ku-button-small")}
        </div>
      </div>
      {<FinalCTA />}
    </>
  );
}
export function RegistrationForm({ course }: { course: Course }) {
  return (
    <>
      <section className={cx("ku-form-panel")} id="course-registration">
        <h2>Твій перший крок</h2>
        <p>
          Спробуй демо-реєстрацію. Дані залишаться лише у цій відкритій формі.
        </p>
        <LocalForm autoComplete="off" kind="course">
          <div className={cx("ku-form-grid")}>
            <label className={cx("ku-field")}>
              <span>ПІБ *</span>
              <input
                type="text"
                name="fullName"
                required
                minLength={3}
                maxLength={120}
                placeholder="Ім’я та прізвище"
              />
            </label>
            <label className={cx("ku-field")}>
              <span>Телефон *</span>
              <input
                type="tel"
                name="phone"
                required
                pattern="[+]?(?:[0-9] ?){8,14}[0-9]"
                maxLength={20}
                placeholder="+380 00 000 00 00"
                title="Введіть номер із 9–15 цифр. Можна додати + і пробіли."
              />
            </label>
            <label className={cx("ku-field")}>
              <span>Email *</span>
              <input
                type="email"
                name="email"
                required
                maxLength={120}
                placeholder="name@example.com"
              />
            </label>
            <label className={cx("ku-field")}>
              <span>Вік *</span>
              <input
                type="number"
                name="age"
                required
                min="14"
                max="100"
                placeholder="Від 14 років"
              />
            </label>
          </div>
          <label className={cx("ku-field")}>
            <span>Обраний курс *</span>
            <select name="course" required>
              <option value={course.id}>{course.name}</option>
            </select>
          </label>
          <label className={cx("ku-field")}>
            <span>Формат навчання *</span>
            <select name="format" required>
              <option value={course.format}>
                {courseFormat(course.format)}
              </option>
            </select>
          </label>
          <label className={cx("ku-consent")}>
            <input type="checkbox" name="consent" required />
            <span>
              Погоджуюся з демонстраційною обробкою введених даних у цій формі.
              Дані нікуди не надсилаються. *
            </span>
          </label>
          <button className={cx("ku-button ku-lime")} type="submit">
            Надіслати демо-заявку
          </button>
          <p>Це не справжня заявка. Оплата та бронювання відсутні.</p>
        </LocalForm>
      </section>
    </>
  );
}
export function CourseDetail({ course }: { course: Course }) {
  return (
    <>
      <div className={cx("ku-container")}>
        {crumb([["Підготовчі курси", "courses"], [course.name]])}
        <section className={cx("ku-page-hero")}>
          <div className={cx("ku-hero-panel")}>
            <div>
              <div className={cx("ku-eyebrow")}>Твоя підготовча майстерня</div>
              <h1 className={cx("ku-detail-title")}>{course.name}</h1>
              <p className={cx("ku-page-intro")}>{course.audience}</p>
              <div className={cx("ku-chips")}>
                <span className={cx("ku-chip")}>
                  {courseFormat(course.format)}
                </span>
                <span className={cx("ku-chip")}>{course.duration}</span>
                <span className={cx("ku-chip")}>
                  {course.seats}
                  {" демо-місць"}
                </span>
              </div>
              <Link
                className={cx("ku-button ku-lime")}
                href={routeHref(`/course/${course.id}/register`)}
                style={{
                  marginTop: "25px",
                }}
              >
                Зареєструватися на курс
              </Link>
              {demo()}
            </div>
            <div className={cx("ku-detail-photo")}>
              {image(
                course.image,
                `Ілюстративна практика курсу ${course.name}`,
              )}
            </div>
          </div>
          <div className={cx("ku-detail-facts")}>
            <div>
              <span>Старт</span>
              <strong>{course.start}</strong>
            </div>
            <div>
              <span>Розклад</span>
              <strong>{course.schedule}</strong>
            </div>
            <div>
              <span>Вартість за весь курс</span>
              <strong>
                {money(course.price)}
                {" ₴"}
              </strong>
            </div>
            <div>
              <span>Формат та місце</span>
              <strong>
                {course.format === "online"
                  ? "Онлайн · демо-кімната"
                  : "Київ · умовний кампус"}
              </strong>
            </div>
          </div>
          {demo()}
        </section>
        <section className={cx("ku-section ku-course-detail")}>
          <div>
            <h2>
              Від цікавості
              <br />
              до першої роботи.
            </h2>
            <p
              className={cx("ku-muted")}
              style={{
                marginBottom: "22px",
              }}
            >
              Практичний маршрут майстерні. Кожна тема допомагає зробити
              наступний крок.
            </p>
            <ul className={cx("ku-flat-list")}>
              {course.topics.map((topic, i) => (
                <Fragment key={i}>
                  <li>
                    <span>0{i + 1}</span>
                    <strong>{topic}</strong>
                  </li>
                </Fragment>
              ))}
            </ul>
            <h2>Твій наставник</h2>
            {<TeacherCard teacher={find("teachers", course.teacher)} />}
            <span className={cx("ku-demo-label")}>
              Вигаданий викладач. Демонстраційні дані.
            </span>
            <h2
              style={{
                marginTop: "40px",
              }}
            >
              Що підготувати
            </h2>
            <ul className={cx("ku-flat-list")}>
              <li>
                <span>01</span>
                <strong>Документ, що посвідчує особу</strong>
              </li>
              <li>
                <span>02</span>
                <strong>
                  Для неповнолітніх — згода законного представника
                </strong>
              </li>
              <li>
                <span>03</span>
                <strong>Творчі матеріали для знайомства, якщо маєш</strong>
              </li>
            </ul>
            <p
              className={cx("ku-muted")}
              style={{
                fontSize: "13px",
              }}
            >
              Приклад переліку. Ця демо-форма не просить копії документів.
            </p>
            <div
              className={cx("ku-note")}
              style={{
                marginTop: "28px",
              }}
            >
              <p>
                <b>
                  {course.format === "online"
                    ? "Онлайн-зустріч"
                    : "Умовна адреса"}
                </b>
                <br />
                {course.format === "online"
                  ? "Посилання на заняття в демо не створюється."
                  : "Київ, вул. Творча, 1 · демонстраційна адреса"}
                <br />
                <br />
                Відділ курсів: courses@example.invalid
                <br />
                +380 (00) 000-00-02 · тестові контакти
              </p>
            </div>
          </div>
          {<RegistrationForm course={course} />}
        </section>
      </div>
    </>
  );
}
