"use client";

import { Fragment } from "react";
import { DATA, eventCategories } from "../lib/data";
import { useDemo } from "./DemoProvider";
import { cx, image, crumb } from "./Common";
import { FinalCTA } from "./Cards";
export function EventCards() {
  const { state, onAction } = useDemo();
  const events = DATA.events.filter(
    (event) =>
      state.eventCategory === "all" || event.category === state.eventCategory,
  );
  return (
    <>
      <p
        className={cx("ku-muted")}
        style={{
          fontSize: "13px",
          marginBottom: "20px",
        }}
        role="status"
      >
        {"Подій: "}
        {events.length}
      </p>
      <div className={cx("ku-events-grid")}>
        {events.map((event, itemIndex) => (
          <Fragment key={itemIndex}>
            <article className={cx("ku-event-card")}>
              <div>
                {image(
                  event.image,
                  "Ілюстрація творчої зустрічі",
                  'loading="lazy"',
                )}
                <div className={cx("ku-event-date")}>
                  <strong>{event.date}</strong>
                  <span>{event.month}</span>
                </div>
              </div>
              <div className={cx("ku-event-card-body")}>
                <span className={cx("ku-chip")}>
                  {eventCategories[event.category]}
                </span>
                <h3>{event.title}</h3>
                <p>{event.location}</p>
                <p>{event.description}</p>
                <button
                  className={cx("ku-button ku-outline ku-button-small")}
                  type="button"
                  data-action="event"
                  data-id={event.id}
                  onClick={onAction}
                >
                  Детальніше
                </button>
              </div>
            </article>
          </Fragment>
        ))}
      </div>
    </>
  );
}
export function Events() {
  const { state, onAction } = useDemo();
  return (
    <>
      <div className={cx("ku-container")}>
        {crumb([["Події"]])}
        <section className={cx("ku-page-hero")}>
          <div className={cx("ku-eyebrow")}>Перші знайомства</div>
          <h1 className={cx("ku-page-title")}>
            Відчуй атмосферу.
            <br />
            Знайди своїх.
          </h1>
          <p className={cx("ku-page-intro")}>
            Зустрічі, майстерні й розмови, після яких обирати простіше.
          </p>
          <span className={cx("ku-demo-label")}>
            Демонстраційні події та дати. Реальна реєстрація відсутня.
          </span>
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "5px",
          }}
        >
          <div className={cx("ku-event-filter")} aria-label="Категорія подій">
            {Object.entries(eventCategories).map(
              ([value, label], itemIndex) => (
                <Fragment key={itemIndex}>
                  <button
                    className={cx("ku-filter-chip")}
                    type="button"
                    data-action="event-category"
                    data-value={value}
                    aria-pressed={state.eventCategory === value}
                    onClick={onAction}
                  >
                    {label}
                  </button>
                </Fragment>
              ),
            )}
          </div>
          <div id="event-results">{<EventCards />}</div>
        </section>
      </div>
      {<FinalCTA />}
    </>
  );
}
