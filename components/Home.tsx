"use client";

import Link from "next/link";
import { Fragment } from "react";
import { DATA } from "../lib/data";
import { useDemo } from "./DemoProvider";
import {
  cx,
  routeHref,
  image,
  button,
  demo,
  sectionHead,
  PathDiagram,
} from "./Common";
import {
  FacultyCard,
  CourseCard,
  MapGraphic,
  FinalCTA,
  EventRow,
} from "./Cards";
export function Home() {
  const { onInterest } = useDemo();
  return (
    <>
      <section className={cx("ku-hero")}>
        <div className={cx("ku-container ku-hero-grid")}>
          <div className={cx("ku-hero-copy")}>
            <div className={cx("ku-eyebrow")}>Твій вступ. Твої можливості.</div>
            <h1>
              <span>{"Твій "}</span>
              <em>{"творчий "}</em>
              <span>старт.</span>
            </h1>
            <p>
              Тут ідеї отримують форму.
              <br />
              Знайди напрям, у якому ти — це ти.
            </p>
            <div className={cx("ku-actions")}>
              {button("Підібрати програму", "matcher", "ku-lime")}
              {button("Факультети та програми", "faculties", "ku-outline")}
            </div>
            <div className={cx("ku-hero-note")}>
              <span>01</span>Від першої цікавості — до улюбленої справи.
            </div>
          </div>
          <div className={cx("ku-hero-visual")}>
            <svg
              className={cx("ku-hero-star")}
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <path
                fill="currentColor"
                d="m50 0 9 30 26-18-11 31 26 7-29 12 15 26-29-12-10 24-10-29-28 14 14-28L0 48l30-9-16-27 29 15z"
              ></path>
            </svg>
            <div className={cx("ku-hero-photo")}>
              {image(
                "photographer",
                "Фотограф експериментує з камерою на природі",
                'fetchpriority="high"',
              )}
            </div>
            <div className={cx("ku-hero-stamp")}>
              ВСТУП<strong>2027</strong>ПОЧНИ З СЕБЕ
            </div>
            <div className={cx("ku-hero-caption")}>
              створюй
              <br />
              <span>своє.</span>
            </div>
            <div className={cx("ku-hero-small")}>
              {image("stage", "Творча репетиція на сцені")}
            </div>
          </div>
        </div>
      </section>
      <div className={cx("ku-ticker")} aria-hidden="true">
        <span>КІНО</span>
        <i>✳</i>
        <span>МУЗИКА</span>
        <i>✳</i>
        <span>ДИЗАЙН</span>
        <i>✳</i>
        <span>МЕДІА</span>
        <i>✳</i>
        <span>СЦЕНА</span>
        <i>✳</i>
        <span>ТВІЙ ВИБІР</span>
      </div>
      <div className={cx("ku-container")}>
        <div className={cx("ku-quick")}>
          <Link href={routeHref("/admissions")}>
            <span>01 / ПО КРОКАХ</span>
            <strong>Вступ 2027</strong>
            <small>Умови, документи, відповіді</small>
          </Link>
          <Link href={routeHref("/faculties")}>
            <span>02 / ЗНАЙТИ СВОЄ</span>
            <strong>
              Факультети
              <br />
              та програми
            </strong>
            <small>Творчі напрями для тебе</small>
          </Link>
          <Link href={routeHref("/courses")}>
            <span>03 / ПІДГОТУВАТИСЯ</span>
            <strong>
              Підготовчі
              <br />
              курси
            </strong>
            <small>Спробуй до вступу</small>
          </Link>
          <Link href={routeHref("/contacts")}>
            <span>04 / ЗАПИТАТИ</span>
            <strong>
              Приймальна
              <br />
              комісія
            </strong>
            <small>Допоможемо розібратися</small>
          </Link>
        </div>
      </div>
      <section className={cx("ku-section")}>
        <div className={cx("ku-container")}>
          <div className={cx("ku-interest-box")}>
            <div>
              <div className={cx("ku-eyebrow")}>Почни з цікавості</div>
              <h2>
                Не знаєш,
                <br />
                що обрати?
              </h2>
              <p>
                Сцена, камера чи власний бренд? Вибери те, що відгукується. Ми
                покажемо програми за твоїми відповідями.
              </p>
              {button("Підібрати програму", "matcher")}
            </div>
            <div className={cx("ku-interest-pills")}>
              {DATA.interests.map((interest, itemIndex) => (
                <Fragment key={itemIndex}>
                  <Link
                    href={routeHref("/matcher")}
                    data-match-interest={interest.id}
                    onClick={onInterest}
                  >
                    {interest.label}
                  </Link>
                </Fragment>
              ))}
            </div>
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
          {sectionHead(
            "Знайди свій простір",
            <>
              Тут починається
              <br />
              твоя історія.
            </>,
            <>
              <Link
                href={routeHref("/faculties")}
                className={cx("ku-text-link")}
              >
                Усі факультети
              </Link>
            </>,
          )}
          <div className={cx("ku-faculty-grid")}>
            {DATA.faculties.slice(0, 6).map((faculty, index) => (
              <FacultyCard faculty={faculty} index={index} key={index} />
            ))}
          </div>
          {demo()}
        </div>
      </section>
      <section
        className={cx("ku-section")}
        style={{
          paddingTop: "0",
        }}
      >
        <div className={cx("ku-container")}>
          <div className={cx("ku-feature")}>
            <div className={cx("ku-feature-photo")}>
              {image(
                "creative",
                "Молоді люди разом працюють над творчою ідеєю",
                'loading="lazy"',
              )}
              <span>МЕНШЕ СПОСТЕРІГАТИ. БІЛЬШЕ СТВОРЮВАТИ.</span>
            </div>
            <div className={cx("ku-feature-copy")}>
              <div className={cx("ku-eyebrow")}>Яким може бути навчання</div>
              <h2>
                Від «а що, як…»
                <br />
                до «це зробив я».
              </h2>
              <div className={cx("ku-feature-reasons")}>
                {[
                  ["01", "Практика з першого кроку", "Вчитися, пробуючи."],
                  ["02", "Творча майстерня", "Працювати з наставником."],
                  ["03", "Власні проєкти", "Зібрати перші роботи."],
                  ["04", "Простір для ідей", "Камера, сцена, студія."],
                  ["05", "Ширший погляд", "Досліджувати культуру світу."],
                  ["06", "Твоя спільнота", "Знайти творчу команду."],
                ].map(([n, t, d], itemIndex) => (
                  <Fragment key={itemIndex}>
                    <div>
                      <i>{n}</i>
                      <strong>{t}</strong>
                      <span>{d}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <span
                className={cx("ku-demo-label")}
                style={{
                  color: "#a8a8a0",
                  marginTop: "25px",
                }}
              >
                Концепція навчального досвіду для обговорення.
              </span>
            </div>
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
          {sectionHead(
            "Спробуй майбутню професію",
            <>
              Прокачай свій
              <br />
              творчий старт.
            </>,
            <>
              <Link href={routeHref("/courses")} className={cx("ku-text-link")}>
                Усі підготовчі курси
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
      <section className={cx("ku-section ku-admission-band")}>
        <div className={cx("ku-container")}>
          {sectionHead(
            "Без зайвої складності",
            <>
              Вступ —<br />
              це послідовність.
            </>,
            button("Усе про вступ", "admissions"),
          )}
          {<PathDiagram />}
          <p
            style={{
              fontSize: "12px",
              marginTop: "20px",
            }}
          >
            Частина дат вступної кампанії 2027 ще очікує офіційного
            підтвердження.
          </p>
        </div>
      </section>
      <section className={cx("ku-section")}>
        <div className={cx("ku-container")}>
          {sectionHead(
            "Побачимося?",
            <>
              Знайомство
              <br />
              до першого вересня.
            </>,
            <>
              <Link className={cx("ku-text-link")} href={routeHref("/events")}>
                Усі події
              </Link>
            </>,
          )}
          <div className={cx("ku-events-list")}>
            {DATA.events.slice(0, 3).map((event, itemIndex) => (
              <EventRow event={event} key={itemIndex} />
            ))}
          </div>
          <span className={cx("ku-demo-label")}>
            Демонстраційні дати та події
          </span>
        </div>
      </section>
      <section
        className={cx("ku-section")}
        style={{
          paddingTop: "0",
        }}
      >
        <div className={cx("ku-container ku-contact-strip")}>
          <div className={cx("ku-contact-copy")}>
            <div className={cx("ku-eyebrow")}>Поговорімо про твої плани</div>
            <h2>
              Маєш запитання?
              <br />
              Ти за адресою.
            </h2>
            <p>Від вибору напряму до документів. Почни з одного запитання.</p>
            <div className={cx("ku-contact-details")}>
              {DATA.contacts[0].phone}
              <br />
              {DATA.contacts[0].email}
              <br />
              {DATA.contacts[0].hours}
            </div>
            <div className={cx("ku-actions")}>
              {button("Поставити запитання", "contacts")}
              {button("Усі контакти", "contacts", "ku-outline")}
            </div>
            <span className={cx("ku-demo-label")}>
              Демонстраційні контакти. Номер і пошта не працюють.
            </span>
          </div>
          {<MapGraphic />}
        </div>
      </section>
      {<FinalCTA />}
    </>
  );
}
