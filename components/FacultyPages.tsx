"use client";
import type { Faculty, Department, Program } from "../lib/data";

import Link from "next/link";
import { Fragment } from "react";
import { DATA, find, money, levelLabel, formatLabel } from "../lib/data";
import { filteredFaculties } from "../lib/catalog";
import { useDemo } from "./DemoProvider";
import {
  cx,
  routeHref,
  esc,
  image,
  button,
  demo,
  crumb,
  sectionHead,
  EmptyState,
} from "./Common";
import {
  FacultyCard,
  CourseCard,
  TeacherCard,
  Teachers,
  ProjectCards,
  ProgramLinks,
  FinalCTA,
} from "./Cards";
export function FacultyFilters() {
  const { state, onAction, onFieldChange } = useDemo();
  const filter = state.faculty;
  return (
    <>
      <div className={cx("ku-filter-title")}>
        <b>Фільтри</b>
        <button
          className={cx("ku-plain")}
          type="button"
          data-action="reset-faculties"
          onClick={onAction}
        >
          Скинути все
        </button>
      </div>
      <label className={cx("ku-field")}>
        <span>Твій інтерес</span>
        <select
          data-faculty-filter="interest"
          onChange={onFieldChange}
          value={state.faculty["interest" as keyof typeof state.faculty]}
        >
          <option value="">Усі напрями</option>
          {DATA.interests.map((interest, itemIndex) => (
            <Fragment key={itemIndex}>
              <option value={interest.id}>{interest.label}</option>
            </Fragment>
          ))}
        </select>
      </label>
      <fieldset>
        <legend>Рівень освіти</legend>
        {[
          ["", "Усі рівні"],
          ["bachelor", "Бакалаврат"],
          ["master", "Магістратура"],
        ].map(([value, label], itemIndex) => (
          <Fragment key={itemIndex}>
            <label className={cx("ku-radio")}>
              <input
                type="radio"
                name="faculty-level"
                data-faculty-filter="level"
                value={value}
                checked={filter.level === value}
                onChange={onFieldChange}
              />
              {label}
            </label>
          </Fragment>
        ))}
      </fieldset>
      <label className={cx("ku-field")}>
        <span>Творчий конкурс</span>
        <select
          data-faculty-filter="creative"
          onChange={onFieldChange}
          value={state.faculty["creative" as keyof typeof state.faculty]}
        >
          <option value="">Не має значення</option>
          <option value="yes">З творчим конкурсом</option>
          <option value="no">Без творчого конкурсу</option>
        </select>
      </label>
      <label className={cx("ku-field")}>
        <span>Форма навчання</span>
        <select
          data-faculty-filter="format"
          onChange={onFieldChange}
          value={state.faculty["format" as keyof typeof state.faculty]}
        >
          <option value="">Усі форми</option>
          <option value="day">Денна</option>
          <option value="part">Заочна</option>
        </select>
      </label>
    </>
  );
}
export function FacultyResults() {
  const { state, onAction } = useDemo();
  const faculties = filteredFaculties(state.faculty);
  return (
    <>
      <div className={cx("ku-catalog-top")}>
        <p role="status">
          {"Знайдено факультетів: "}
          <b>{faculties.length}</b>
        </p>
        <button
          type="button"
          className={cx("ku-mobile-filter")}
          aria-expanded={state.facultyFiltersOpen}
          data-action="filters"
          onClick={onAction}
        >
          Фільтри
        </button>
      </div>
      <div className={cx("ku-catalog-grid")}>
        {faculties.length ? (
          faculties.map((faculty, itemIndex) => (
            <FacultyCard
              faculty={faculty}
              index={DATA.faculties.indexOf(faculty)}
              key={itemIndex}
            />
          ))
        ) : (
          <EmptyState
            text="Спробуй інший запит або прибери частину фільтрів. Наприклад, обери «Кіно» без обмеження рівня."
            action="reset-faculties"
          />
        )}
      </div>
    </>
  );
}
export function FacultyCatalog() {
  const { state, onFieldChange } = useDemo();
  return (
    <>
      <div className={cx("ku-container")}>
        {crumb([["Факультети"]])}
        <section className={cx("ku-page-hero")}>
          <div className={cx("ku-eyebrow")}>Різні напрями. Твоя історія.</div>
          <h1 className={cx("ku-page-title")}>
            Знайди простір
            <br />
            для свого таланту.
          </h1>
          <p className={cx("ku-page-intro")}>
            Порівнюй напрями за інтересами та форматом навчання. Знайди
            програму, яку захочеться спробувати.
          </p>
          {demo()}
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "15px",
          }}
        >
          <div className={cx("ku-search")}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <circle cx="10" cy="10" r="6"></circle>
              <path d="m15 15 6 6"></path>
            </svg>
            <input
              id="faculty-search"
              type="search"
              placeholder="Назва факультету, програма або напрям"
              aria-label="Пошук факультетів і програм"
              value={esc(state.faculty.query)}
              onChange={onFieldChange}
            />
          </div>
          <div className={cx("ku-filter-shell")}>
            <aside
              className={cx(
                `ku-filters ${state.facultyFiltersOpen ? "ku-filter-open" : ""}`,
              )}
              id="faculty-filters"
              aria-label="Фільтри факультетів"
            >
              {<FacultyFilters />}
            </aside>
            <div id="faculty-results">{<FacultyResults />}</div>
          </div>
        </section>
      </div>
      {<FinalCTA />}
    </>
  );
}
export function FacultyDetail({ faculty }: { faculty: Faculty }) {
  const programs = DATA.programs.filter(
    (program) => program.faculty === faculty.id,
  );
  const departments = DATA.departments.filter(
    (department) => department.faculty === faculty.id,
  );
  const ids = [...new Set(programs.flatMap((program) => program.teachers))];
  const courses = DATA.courses.filter(
    (course) => course.faculty === faculty.id,
  );
  return (
    <>
      <div className={cx("ku-container")}>
        {crumb([["Факультети", "faculties"], [faculty.name]])}
        <section className={cx("ku-page-hero")}>
          <div className={cx("ku-hero-panel")}>
            <div>
              <div className={cx("ku-eyebrow")}>Тестовий факультет</div>
              <h1 className={cx("ku-detail-title")}>{faculty.name}</h1>
              <p className={cx("ku-page-intro")}>{faculty.tagline}</p>
              <div className={cx("ku-actions")}>
                {button(
                  "Переглянути програми",
                  `faculty/${faculty.id}/programs`,
                  "ku-lime",
                )}
                {button("Поставити запитання", "contacts", "ku-outline")}
              </div>
              {demo()}
            </div>
            <div className={cx("ku-detail-photo")}>
              {image(
                faculty.image,
                `Ілюстративне фото творчого напряму: ${faculty.name}`,
              )}
              <span className={cx("ku-chip")}>Твори те, що має значення</span>
            </div>
          </div>
          <div className={cx("ku-detail-facts")}>
            <div>
              <span>Освітні програми</span>
              <strong>
                {programs.length}{" "}
                {programs.length === 1 ? "програма" : "програми"}
              </strong>
            </div>
            <div>
              <span>Творчі майстерні</span>
              <strong>
                {departments.length}{" "}
                {departments.length === 1 ? "кафедра" : "кафедри"}
              </strong>
            </div>
            <div>
              <span>Рівні освіти</span>
              <strong>
                {[
                  ...new Set(
                    programs.map((program) => levelLabel(program.level)),
                  ),
                ].join(" / ")}
              </strong>
            </div>
            <div>
              <span>Формат</span>
              <strong>
                {[...new Set(programs.flatMap((program) => program.formats))]
                  .map(formatLabel)
                  .join(" / ")}
              </strong>
            </div>
          </div>
        </section>
        <section className={cx("ku-section")}>
          <div className={cx("ku-two-col")}>
            <div>
              <div className={cx("ku-eyebrow")}>Відкрий свій напрям</div>
              <h2
                style={{
                  marginTop: "17px",
                }}
              >
                {faculty.tagline}
              </h2>
              <p>{faculty.description}</p>
              <p>
                У цьому демо навчання показано як поєднання майстерень,
                командних завдань і власного творчого проєкту.
              </p>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "23px",
                  marginBottom: "10px",
                }}
              >
                Ким ти можеш стати
              </h3>
              <ul className={cx("ku-flat-list")}>
                {faculty.careers.map((career, i) => (
                  <Fragment key={i}>
                    <li>
                      <span>0{i + 1}</span>
                      <strong>{career}</strong>
                    </li>
                  </Fragment>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
          id="faculty-programs"
        >
          {sectionHead("Обери свій фокус", "Освітні програми")}
          {<ProgramLinks programs={programs} />}
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          {sectionHead("Знайомство ближче", "Кафедри факультету")}
          <div className={cx("ku-link-list")}>
            {departments.map((department, itemIndex) => (
              <Fragment key={itemIndex}>
                <Link
                  className={cx("ku-link-row")}
                  href={routeHref(`/department/${department.id}`)}
                >
                  <div>
                    <h3>{department.name}</h3>
                    <p>{department.description}</p>
                  </div>
                  <span className={cx("ku-link-mark")} aria-hidden="true">
                    +
                  </span>
                </Link>
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
          {sectionHead("Вчитися в діалозі", "Викладачі й майстри")}
          {<Teachers ids={ids} />}
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          {sectionHead(
            "Задум стає роботою",
            <>
              Спробуй уявити
              <br />
              свій перший проєкт.
            </>,
          )}
          {<ProjectCards facultyId={faculty.id} />}
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          {sectionHead("Місце для практики", "Простори та інструменти")}
          <div className={cx("ku-facility-grid")}>
            {faculty.facilities.map((facility, i) => (
              <Fragment key={i}>
                <div className={cx("ku-facility")}>
                  <span>
                    0{i + 1}
                    {" / ДЕМО-ПРОСТІР"}
                  </span>
                  <h3>{facility}</h3>
                </div>
              </Fragment>
            ))}
          </div>
          <span className={cx("ku-demo-label")}>
            Ілюстративна структура. Наявність цих просторів не підтверджено
            університетом.
          </span>
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          <div className={cx("ku-two-col")}>
            <div>
              <h2>Твій план вступу</h2>
              <p>
                {programs.some((program) => program.creative)
                  ? "У цьому напрямі є програми з творчим конкурсом. Переглянь вимоги конкретної програми та плануй час на підготовку."
                  : "У цьому напрямі демо-програми не мають творчого конкурсу. Перевір перелік документів і випробувань."}
              </p>
              {button(
                "Умови вступу 2027",
                "admissions",
                "ku-outline",
                'style="margin-top:24px"',
              )}
            </div>
            <div className={cx("ku-price-row")}>
              <div>
                <b>Приклад вартості</b>
                <p>2027/2028 · денна форма · за рік</p>
                <span className={cx("ku-demo-label")}>Демонстраційні дані</span>
              </div>
              <strong>
                {money(Math.min(...programs.map((program) => program.price)))}
                {" ₴ "}
                <small
                  style={{
                    fontSize: "13px",
                  }}
                >
                  від
                </small>
              </strong>
            </div>
          </div>
        </section>
        {courses.length ? (
          <>
            <section
              className={cx("ku-section")}
              style={{
                paddingTop: "0",
              }}
            >
              {sectionHead("Почни ще до вступу", "Підготовчі курси")}
              <div className={cx("ku-courses-grid")}>
                {courses.map((course, itemIndex) => (
                  <CourseCard course={course} key={itemIndex} />
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section
              className={cx("ku-section")}
              style={{
                paddingTop: "0",
              }}
            >
              {sectionHead(
                "Знайди свою практику",
                "Підготовка до старту",
                button("Переглянути курси", "courses", "ku-outline"),
              )}
              <p className={cx("ku-muted")}>
                Окремого курсу цього факультету в демо ще немає. Переглянь інші
                творчі майстерні.
              </p>
            </section>
          </>
        )}
        <div className={cx("ku-note")}>
          <span className={cx("ku-note-icon")}>?</span>
          <p>
            <b>Контакт факультету:</b>
            {
              " faculty@example.invalid · +380 (00) 000-00-03. Демонстраційні контакти."
            }
          </p>
          {button("Запитати", "contacts", "ku-button-small")}
        </div>
      </div>
      {<FinalCTA />}
    </>
  );
}
export function DepartmentDetail({ department }: { department: Department }) {
  const faculty = find("faculties", department.faculty);
  const programs = DATA.programs.filter(
    (program) => program.department === department.id,
  );
  const teacherIds = [
    ...new Set([
      department.teacher,
      ...programs.flatMap((program) => program.teachers),
    ]),
  ];
  return (
    <>
      <div className={cx("ku-container")}>
        {crumb([
          ["Факультети", "faculties"],
          [faculty.name, `faculty/${faculty.id}`],
          ["Кафедра"],
        ])}
        <section className={cx("ku-page-hero")}>
          <div className={cx("ku-hero-panel")}>
            <div>
              <div className={cx("ku-eyebrow")}>
                Майстерня всередині факультету
              </div>
              <h1 className={cx("ku-detail-title")}>{department.name}</h1>
              <p className={cx("ku-page-intro")}>{department.description}</p>
              {button(
                "Програми кафедри",
                `department/${department.id}/programs`,
                "ku-lime",
              )}
              {demo()}
            </div>
            <div className={cx("ku-detail-photo")}>
              {image(
                department.id === "directing" ? "camera" : faculty.image,
                "Ілюстративна творча практика в навчальній майстерні",
              )}
            </div>
          </div>
        </section>
        <section className={cx("ku-section")}>
          <div className={cx("ku-two-col")}>
            <div>
              <h2>
                Люди, з якими
                <br />
                зростаєш.
              </h2>
              <p>Керівник / керівниця кафедри — вигаданий приклад.</p>
              <div
                style={{
                  marginTop: "25px",
                }}
              >
                {<TeacherCard teacher={find("teachers", department.teacher)} />}
              </div>
            </div>
            <div>
              <h2>
                Поговорімо
                <br />
                про навчання.
              </h2>
              <p>
                faculty@example.invalid
                <br />
                +380 (00) 000-00-03
                <br />
                Пн–Пт, 10:00–16:00
              </p>
              <span className={cx("ku-demo-label")}>
                Демонстраційні контакти
              </span>
              {button(
                "Поставити запитання",
                "contacts",
                "ku-outline",
                'style="margin-top:24px"',
              )}
            </div>
          </div>
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
          id="department-programs"
        >
          {sectionHead("Від майстерні до професії", "Освітні програми кафедри")}
          {<ProgramLinks programs={programs} />}
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          {sectionHead("Твоя творча команда", "Викладачі та майстри")}
          {<Teachers ids={teacherIds} />}
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          {sectionHead("Твої майбутні інструменти", "Що ти будеш вивчати")}
          <ul className={cx("ku-flat-list")}>
            {department.disciplines.map((discipline, i) => (
              <Fragment key={i}>
                <li>
                  <span>0{i + 1}</span>
                  <strong>{discipline}</strong>
                </li>
              </Fragment>
            ))}
          </ul>
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          {sectionHead("Навчання через дію", "Студентські проєкти")}
          {<ProjectCards facultyId={faculty.id} />}
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          {sectionHead("Простір кафедри", "Де народжуються ідеї")}
          <div className={cx("ku-facility-grid")}>
            {department.facilities.map((facility, i) => (
              <Fragment key={i}>
                <div className={cx("ku-facility")}>
                  <span>
                    0{i + 1}
                    {" / ДЕМО-ПРОСТІР"}
                  </span>
                  <h3>{facility}</h3>
                </div>
              </Fragment>
            ))}
          </div>
          {demo()}
        </section>
        <div className={cx("ku-note")}>
          <span className={cx("ku-note-icon")}>i</span>
          <p>
            Умови вступу залежать від програми. Відкрий програму або загальний
            шлях вступника.
          </p>
          {button("Умови вступу", "admissions", "ku-button-small")}
        </div>
      </div>
      {<FinalCTA />}
    </>
  );
}
export function ProgramDetail({ program }: { program: Program }) {
  const faculty = find("faculties", program.faculty);
  const department = find("departments", program.department);
  const similar = DATA.programs
    .filter(
      (item) => item.id !== program.id && item.faculty === program.faculty,
    )
    .slice(0, 2);
  if (!similar.length)
    similar.push(
      ...DATA.programs
        .filter(
          (item) =>
            item.id !== program.id &&
            item.creative === program.creative &&
            item.level === program.level,
        )
        .slice(0, 2),
    );
  return (
    <>
      <div className={cx("ku-container")}>
        {crumb([
          ["Факультети", "faculties"],
          [faculty.name, `faculty/${faculty.id}`],
          ["Освітня програма"],
        ])}
        <section className={cx("ku-page-hero")}>
          <div className={cx("ku-eyebrow")}>
            {"Освітня програма · "}
            {levelLabel(program.level)}
          </div>
          <h1 className={cx("ku-page-title")}>{program.name}</h1>
          <p className={cx("ku-page-intro")}>{program.intro}</p>
          <div className={cx("ku-actions")}>
            <Link
              className={cx("ku-text-link")}
              href={routeHref(`/faculty/${faculty.id}`)}
            >
              {faculty.name}
            </Link>
            <Link
              className={cx("ku-text-link")}
              href={routeHref(`/department/${department.id}`)}
            >
              {department.name}
            </Link>
          </div>
          <div className={cx("ku-detail-facts")}>
            <div>
              <span>Рівень освіти</span>
              <strong>{levelLabel(program.level)}</strong>
            </div>
            <div>
              <span>Тривалість</span>
              <strong>{program.duration}</strong>
            </div>
            <div>
              <span>Форма навчання</span>
              <strong>{program.formats.map(formatLabel).join(" / ")}</strong>
            </div>
            <div>
              <span>Демо-код спеціальності</span>
              <strong>{program.code}</strong>
            </div>
          </div>
          {demo()}
        </section>
        <section className={cx("ku-section")}>
          <div className={cx("ku-program-intro")}>
            <div>
              <h2>
                Що потрібно
                <br />
                для першого кроку?
              </h2>
              <ul className={cx("ku-flat-list")}>
                <li>
                  <span>01</span>
                  <div>
                    <strong>
                      {program.creative
                        ? "Творчий конкурс передбачено"
                        : "Без творчого конкурсу"}
                    </strong>
                    <p>
                      {program.creative
                        ? "Приклад формату: творче завдання, показ або портфоліо. Остаточний формат невідомий."
                        : "У демонстраційній моделі окремий творчий конкурс не потрібен."}
                    </p>
                  </div>
                </li>
                <li>
                  <span>02</span>
                  <div>
                    <strong>
                      {program.level === "master"
                        ? "ЄВІ / ЄФВВ або фахове випробування"
                        : "НМТ та мотиваційний лист"}
                    </strong>
                    <p>
                      Це приклад умов. Перелік випробувань 2027 року потребує
                      офіційного підтвердження.
                    </p>
                  </div>
                </li>
                <li>
                  <span>03</span>
                  <div>
                    <strong>Контракт / бюджет</strong>
                    <p>
                      Приклад ціни — для контракту. Кількість бюджетних місць
                      невідома.
                    </p>
                  </div>
                </li>
              </ul>
              {button(
                "Переглянути умови вступу",
                "admissions",
                "ku-outline",
                'style="margin-top:25px"',
              )}
            </div>
            <aside className={cx("ku-program-price")}>
              <span className={cx("ku-mini-label")}>
                Твоя інвестиція в навчання
              </span>
              <strong>
                {money(program.price)}
                {" ₴"}
              </strong>
              <p>за навчальний рік</p>
              <p>
                {"2027/2028 · "}
                {program.formats.map(formatLabel).join(" / ")}
                {" форма"}
              </p>
              <span className={cx("ku-demo-label")}>Демонстраційні дані</span>
              {button("Поставити запитання", "contacts")}
            </aside>
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
              <div className={cx("ku-eyebrow")}>
                Знання, які стають практикою
              </div>
              <h2
                style={{
                  marginTop: "16px",
                }}
              >
                Що буде
                <br />у твоєму розкладі
              </h2>
              <p>
                У демо дисципліни зібрано навколо практичного проєкту. Це
                приклад навчального плану, а не офіційна освітня програма.
              </p>
            </div>
            <ul className={cx("ku-flat-list")}>
              {program.curriculum.map((subject, i) => (
                <Fragment key={i}>
                  <li>
                    <span>0{i + 1}</span>
                    <strong>{subject}</strong>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          {sectionHead("Наступна роль — твоя", "Професійні можливості")}
          <div className={cx("ku-facility-grid")}>
            {faculty.careers.slice(0, 3).map((career, i) => (
              <Fragment key={i}>
                <div className={cx("ku-facility")}>
                  <span>
                    0{i + 1}
                    {" / НАПРЯМ РОЗВИТКУ"}
                  </span>
                  <h3>{career}</h3>
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
          {sectionHead("Вчитися поруч", "Викладачі програми")}
          {<Teachers ids={program.teachers} />}
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          {sectionHead("Твоє майбутнє портфоліо", "Творчі роботи")}
          {<ProjectCards facultyId={faculty.id} />}
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          {sectionHead("Порівняй перед вибором", "Схожі програми")}
          {<ProgramLinks programs={similar} />}
        </section>
        <div className={cx("ku-note")}>
          <span className={cx("ku-note-icon")}>?</span>
          <p>
            <b>Є питання про програму?</b>
            <br />
            faculty@example.invalid · демонстраційний контакт
          </p>
          {button("Запитати", "contacts", "ku-button-small")}
        </div>
      </div>
      {<FinalCTA />}
    </>
  );
}
