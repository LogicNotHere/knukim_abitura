"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { eventCategories } from "../lib/data";
import type { DemoEvent } from "../lib/data";
import { addDays, dateLabel, eventDateLabel, eventGroups, filterEvents, getCalendarDays, getHomeEvents, monthOffset, weekStart } from "../lib/events";
import type { EventGroup } from "../lib/events";
import { useDemo } from "./DemoProvider";
import { cx, image, crumb } from "./Common";
import { FinalCTA } from "./Cards";
import styles from "./Events.module.css";

function EventButton({ event, compact = false }: { event: DemoEvent; compact?: boolean }) {
  const { onAction } = useDemo();
  return (
    <button type="button" data-action="event" data-id={event.id} onClick={onAction} className={compact ? styles.row : styles.highlight}>
      <time dateTime={event.date}>{dateLabel(event.date, { day: "2-digit", month: "short" })} · {event.time}</time>
      <strong>{event.title}</strong><span>{event.location}</span><small>{eventCategories[event.category]}</small>
    </button>
  );
}

export function HomeCalendar() {
  const { today, events } = useDemo();
  if (!today) return <section className={cx("ku-section")} aria-busy="true"><div className={cx("ku-container")}><p>Завантажуємо календар…</p></div></section>;
  const { current, next, upcoming } = getHomeEvents(events, today);
  return (
    <section id="home-calendar" className={cx("ku-section")}><div className={cx("ku-container")}><div className={styles.home}>
      <div className={styles.homeTop}>
        <div className={styles.today}><span>Сьогодні</span><strong>{Number(today.slice(8))}</strong><span>{dateLabel(today, { month: "long", weekday: "long" })}</span></div>
        <div><h2 className={styles.caption}>Сьогодні в календарі</h2>{current ? <EventButton event={current} /> : <p className={styles.noEvent}>Сьогодні подій немає</p>}</div>
        <div><h2 className={styles.caption}>Далі</h2>{next ? <EventButton event={next} /> : <p>Нові події з’являться згодом.</p>}</div>
        <Link href="/events" className={styles.allLink}>Весь календар →</Link>
      </div>
      <div className={styles.rows}>{upcoming.map((event) => <EventButton key={event.id} event={event} compact />)}</div>
      <p className={styles.demo}>Демонстраційні дані · Дати подій зміщуються відносно сьогодні.</p>
    </div></div></section>
  );
}

export function EventCards({ events: supplied }: { events?: DemoEvent[] }) {
  const { events: allEvents, onAction } = useDemo();
  return <div className={styles.posters}>{(supplied ?? allEvents).map((event) => (
    <article key={event.id} className={styles.poster}>
      <div className={styles.posterImage}>{image(event.image, "Ілюстрація творчої зустрічі", 'loading="lazy"')}<span>{dateLabel(event.date)}</span></div>
      <div className={styles.posterBody}><span className={cx("ku-chip")}>{eventCategories[event.category]}</span><h3>{event.title}</h3><time dateTime={event.date}>{eventDateLabel(event)}</time><p>{event.location}</p><p>{event.description}</p>
        <button className={cx("ku-button ku-outline ku-button-small")} type="button" data-action="event" data-id={event.id} onClick={onAction}>Детальніше</button>
      </div>
    </article>
  ))}</div>;
}

export function Events() {
  const { state, onAction, today, events } = useDemo();
  const search = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const value = search.get("v");
  const variant = value === "b" || value === "c" ? value : "a";
  const [group, setGroup] = useState<EventGroup>("applicants");
  const [month, setMonth] = useState("");
  const [selected, setSelected] = useState("");
  const filtered = filterEvents(events, group, state.eventCategory);
  const currentMonth = month || `${today?.slice(0, 7)}-01`;
  const selectedDay = selected || today;
  const grouped = new Map<string, DemoEvent[]>();
  for (const event of filtered) {
    const key = variant === "c" ? weekStart(event.date) : event.date.slice(0, 7);
    grouped.set(key, [...(grouped.get(key) ?? []), event]);
  }
  function changeVariant(next: string) {
    const params = new URLSearchParams(search.toString()); params.set("v", next);
    router.push(`${pathname}?${params.toString()}${window.location.hash}`, { scroll: false });
  }
  function changeMonth(offset: number) {
    const next = monthOffset(currentMonth, offset); setMonth(next); setSelected(next);
  }
  const selectedEvents = filtered.filter((event) => event.date === selectedDay);
  return <>
    <div className={cx("ku-container")}>
      {crumb([["Події"]])}
      <section className={cx("ku-page-hero")}>
        <div className={cx("ku-eyebrow")}>Перші знайомства</div>
        <h1 className={cx("ku-page-title")}>Відчуй атмосферу.<br />Знайди своїх.</h1>
        <p className={cx("ku-page-intro")}>Зустрічі, майстерні й розмови, після яких обирати простіше.</p>
        <span className={cx("ku-demo-label")}>Демонстраційні дані. Події й дати вигадані. Реальна реєстрація відсутня.</span>
      </section>
      <section className={styles.events}>
        <div className={styles.variants} aria-label="Варіант календаря">{["a", "b", "c"].map((id) => <button type="button" key={id} onClick={() => changeVariant(id)} aria-pressed={variant === id}>Варіант {id.toUpperCase()}</button>)}</div>
        <div className={styles.tabs} aria-label="Група подій">{Object.entries(eventGroups).map(([id, label]) => <button type="button" key={id} aria-pressed={group === id} onClick={() => setGroup(id as EventGroup)}>{label}</button>)}</div>
        <div className={cx("ku-event-filter")} aria-label="Категорія подій">{Object.entries(eventCategories).map(([id, label]) => <button className={cx("ku-filter-chip")} type="button" key={id} data-action="event-category" data-value={id} aria-pressed={state.eventCategory === id} onClick={onAction}>{label}</button>)}</div>
        {!today ? <p aria-busy="true">Завантажуємо календар…</p> : <>
          <p className={styles.count} role="status">Подій: {filtered.length}</p>
          {variant === "a" ? <>
            <div className={styles.nearest}><h2>Найближче</h2>{filtered[0] ? <EventButton event={filtered[0]} /> : <p>У цій категорії подій немає.</p>}</div>
            <div className={styles.calendarLayout}>
              <div className={styles.calendar}>
                <div className={styles.monthHead}><button type="button" aria-label="Попередній місяць" onClick={() => changeMonth(-1)}>←</button><h2>{dateLabel(currentMonth, { month: "long", year: "numeric" })}</h2><button type="button" aria-label="Наступний місяць" onClick={() => changeMonth(1)}>→</button></div>
                <div className={styles.weekdays}>{["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Нд"].map((day) => <span key={day}>{day}</span>)}</div>
                <div className={styles.days}>{getCalendarDays(currentMonth).map((day) => {
                  const count = filtered.filter((event) => event.date === day).length;
                  return <button type="button" key={day} aria-label={`${dateLabel(day, { day: "numeric", month: "long", year: "numeric" })}, подій: ${count}`} aria-pressed={selectedDay === day} aria-current={day === today ? "date" : undefined} data-outside={day.slice(0, 7) !== currentMonth.slice(0, 7)} onClick={() => setSelected(day)}><span>{Number(day.slice(8))}</span>{count > 0 && <small>{count}<span className={styles.dot} /></small>}</button>;
                })}</div>
              </div>
              <div className={styles.dayDetails} aria-live="polite"><h2>{dateLabel(selectedDay!, { day: "numeric", month: "long" })}</h2>{selectedEvents.length ? selectedEvents.map((event) => <EventButton key={event.id} event={event} />) : <p>Цього дня подій немає. Обери іншу дату або категорію.</p>}</div>
            </div>
          </> : grouped.size ? <div className={variant === "b" ? styles.agenda : styles.weeks}>{Array.from(grouped, ([key, records]) => <section key={key}><h2>{variant === "c" ? `${dateLabel(key)} — ${dateLabel(addDays(key, 6))}` : dateLabel(`${key}-01`, { month: "long", year: "numeric" })}</h2>{variant === "c" ? <EventCards events={records} /> : records.map((event) => <EventButton event={event} key={event.id} compact />)}</section>)}</div> : <p className={styles.empty}>У цій категорії подій немає. Обери інший фільтр.</p>}
        </>}
      </section>
    </div>
    <FinalCTA />
  </>;
}
