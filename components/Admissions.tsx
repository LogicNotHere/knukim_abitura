"use client";

import Link from "next/link";
import { Fragment } from "react";
import { DATA } from "../lib/data";
import { useDemo } from "./DemoProvider";
import {
  cx,
  routeHref,
  button,
  crumb,
  sectionHead,
  PathDiagram,
} from "./Common";
import { CourseCard, FinalCTA, FaqItems } from "./Cards";
export function Admissions() {
  const { state, onAction } = useDemo();
  const master = state.admissionLevel === "master";
  const dates = master
    ? [
        ["12 ТРАВНЯ", "Приклад початку реєстрації на ЄВІ / ЄФВВ"],
        ["21 ЧЕРВНЯ", "Приклад початку вступних випробувань"],
        ["01 СЕРПНЯ", "Приклад початку подання заяв"],
      ]
    : [
        ["06 БЕРЕЗНЯ", "Приклад старту підготовчих курсів"],
        ["01 ЛИПНЯ", "Приклад відкриття електронних кабінетів"],
        ["19 ЛИПНЯ", "Приклад початку подання заяв"],
      ];
  return (
    <>
      <div className={cx("ku-container")}>
        {crumb([["Вступ 2027"]])}
        <section className={cx("ku-page-hero")}>
          <div className={cx("ku-eyebrow")}>План для твого старту</div>
          <h1 className={cx("ku-page-title")}>
            Вступ 2027.
            <br />
            Крок за кроком.
          </h1>
          <p className={cx("ku-page-intro")}>
            Усе важливе в одному місці: обрати програму, підготуватися та
            зрозуміти наступний крок.
          </p>
          <Link href="/stats" className={cx("ku-text-link")}>Вступ у цифрах: дані минулих кампаній →</Link>
          <div className={cx("ku-note")}>
            <span className={cx("ku-note-icon")}>i</span>
            <p>
              <b>Це демонстраційна вступна кампанія.</b>
              {
                " Частина дат вступної кампанії 2027 ще очікує офіційного підтвердження. Правила, дати та ціни нижче — приклади."
              }
            </p>
          </div>
          <div
            className={cx("ku-tabs")}
            role="tablist"
            aria-label="Рівень освіти"
          >
            <button
              role="tab"
              type="button"
              aria-selected={!master}
              data-action="admission-level"
              data-value="bachelor"
              onClick={onAction}
            >
              Бакалаврат
            </button>
            <button
              role="tab"
              type="button"
              aria-selected={master}
              data-action="admission-level"
              data-value="master"
              onClick={onAction}
            >
              Магістратура
            </button>
          </div>
        </section>
      </div>
      <section className={cx("ku-section ku-admission-band")}>
        <div className={cx("ku-container")}>
          <h2>Твій шлях до вступу</h2>
          {<PathDiagram context="admissions" />}
        </div>
      </section>
      <section className={cx("ku-section")}>
        <div className={cx("ku-container ku-two-col")}>
          <div>
            <div className={cx("ku-eyebrow")}>Орієнтири, не дедлайни</div>
            <h2
              style={{
                marginTop: "16px",
              }}
            >
              Важливі дати
            </h2>
            <ul className={cx("ku-flat-list")}>
              {dates.map(([date, text], itemIndex) => (
                <Fragment key={itemIndex}>
                  <li>
                    <span
                      style={{
                        minWidth: "85px",
                      }}
                    >
                      {date}
                    </span>
                    <div>
                      <strong>{text}</strong>
                      <p>2027 рік · демонстраційна дата</p>
                    </div>
                  </li>
                </Fragment>
              ))}
            </ul>
          </div>
          <div>
            <div className={cx("ku-eyebrow")}>Що підготувати</div>
            <h2
              style={{
                marginTop: "16px",
              }}
            >
              Твої документи
            </h2>
            <ul className={cx("ku-flat-list")}>
              {[
                "Документ, що посвідчує особу",
                "Документ про попередню освіту",
                "Реєстраційний номер платника податків",
                master
                  ? "Результати ЄВІ / ЄФВВ або іншого випробування"
                  : "Результати НМТ або іншого випробування",
                "Мотиваційний лист і творча робота, якщо потрібні",
              ].map((text, i) => (
                <Fragment key={i}>
                  <li>
                    <span>0{i + 1}</span>
                    <strong>{text}</strong>
                  </li>
                </Fragment>
              ))}
            </ul>
            <p
              style={{
                fontSize: "12px",
              }}
            >
              Перелік демонстраційний. Остаточний склад документів визначать
              офіційні правила прийому.
            </p>
          </div>
        </div>
      </section>
      <section
        className={cx("ku-section")}
        style={{
          paddingTop: "0",
        }}
      >
        <div className={cx("ku-container ku-two-col")}>
          <div>
            <h2>
              {master
                ? "Випробування для магістратури"
                : "НМТ та вступні випробування"}
            </h2>
            <p>
              {master
                ? "У прикладі передбачено ЄВІ та ЄФВВ або фахове випробування. Потрібний набір залежить від програми."
                : "У прикладі вступ спирається на результати НМТ. Для творчих напрямів може знадобитися окреме випробування."}
            </p>
            <p>
              Офіційний перелік предметів, коефіцієнти та умови 2027 року тут не
              наведено.
            </p>
            {button(
              "Обрати програму",
              "faculties",
              "ku-outline",
              'style="margin-top:24px"',
            )}
          </div>
          <div>
            <h2>Творчий конкурс</h2>
            <p>
              Портфоліо, виступ чи творче завдання — залежно від обраного
              напряму. На сторінці програми позначено, чи передбачено конкурс у
              демо.
            </p>
            <p>
              Підготовчий курс допоможе спробувати формат. Він не гарантує
              вступ.
            </p>
            {button(
              "Знайти підготовчий курс",
              "courses",
              "ku-purple",
              'style="margin-top:24px"',
            )}
          </div>
        </div>
      </section>
      <section
        className={cx("ku-section")}
        style={{
          background: "var(--ku-soft)",
        }}
      >
        <div className={cx("ku-container")}>
          {sectionHead(
            "Плануй заздалегідь",
            <>
              Вартість і форми
              <br />
              фінансування.
            </>,
            <>
              <p>
                Наведені суми ілюструють подання ціни. Вони не є офіційними
                тарифами університету.
              </p>
            </>,
          )}
          <div className={cx("ku-two-col")}>
            <div
              className={cx("ku-price-row")}
              style={{
                background: "var(--ku-paper)",
              }}
            >
              <div>
                <b>{master ? "Магістратура" : "Бакалаврат"}</b>
                <p>2027/2028 · денна форма</p>
                <span className={cx("ku-demo-label")}>
                  Демонстраційні дані · за навчальний рік
                </span>
              </div>
              <strong>
                {master ? "42 000" : "35 000"}
                {" ₴ "}
                <small
                  style={{
                    fontSize: "14px",
                    fontWeight: "400",
                  }}
                >
                  від
                </small>
              </strong>
            </div>
            <div>
              <h3
                style={{
                  fontSize: "23px",
                  letterSpacing: "-.7px",
                }}
              >
                Бюджет чи контракт?
              </h3>
              <p>
                У демо показано контрактні ціни. Кількість бюджетних місць
                невідома. Фактичні умови фінансування потрібно буде перевірити
                за офіційними правилами.
              </p>
              {button(
                "Порівняти програми",
                "faculties",
                "ku-outline",
                'style="margin-top:20px"',
              )}
            </div>
          </div>
        </div>
      </section>
      <section className={cx("ku-section")}>
        <div className={cx("ku-container")}>
          {sectionHead(
            "Підготуй свій наступний крок",
            <>
              Творчість любить
              <br />
              практику.
            </>,
            <>
              <Link className={cx("ku-text-link")} href={routeHref("/courses")}>
                Усі курси
              </Link>
            </>,
          )}
          <div className={cx("ku-courses-grid")}>
            {DATA.courses.slice(0, 3).map((course, itemIndex) => (
              <CourseCard course={course} key={itemIndex} />
            ))}
          </div>
        </div>
      </section>
      <section
        className={cx("ku-section")}
        style={{
          paddingTop: "0",
        }}
      >
        <div className={cx("ku-container")}>
          {sectionHead("Короткі відповіді", "Те, про що питають.")}
          <div className={cx("ku-faq")}>{<FaqItems type="admissions" />}</div>
        </div>
      </section>
      {<FinalCTA />}
    </>
  );
}
