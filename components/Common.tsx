"use client";
import type { ReactNode, CSSProperties, FormEvent } from "react";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState } from "react";
import styles from "./Site.module.css";
import { useDemo } from "./DemoProvider";
export const cx = (names: string) =>
  names
    .split(/\s+/)
    .filter(Boolean)
    .map((name) => styles[name] ?? name)
    .join(" ");
export function routeHref(route: string) {
  const path = route.startsWith("/") ? route : `/${route}`;
  if (path.endsWith("/register"))
    return `${path.slice(0, -9)}#course-registration`;
  if (path.endsWith("/programs"))
    return `${path.slice(0, -9)}#${path.split("/")[1]}-programs`;
  return path;
}
export const esc = (value: string) => value;
export function image(key: string, alt: string, extra = "") {
  return (
    <img
      src={`/images/${key}.jpg`}
      alt={alt}
      loading={extra.includes("lazy") ? "lazy" : undefined}
      fetchPriority={extra.includes("high") ? "high" : undefined}
    />
  );
}
export function button(
  text: ReactNode,
  route: string,
  className = "",
  extra = "",
) {
  const margin = extra.match(/margin-top:(\d+)px/);
  const style: CSSProperties | undefined = margin
    ? {
        marginTop: Number(margin[1]),
      }
    : undefined;
  return (
    <Link
      className={cx(`ku-button ${className}`)}
      href={routeHref(route)}
      style={style}
    >
      {text}
    </Link>
  );
}
export function demo() {
  return (
    <span className={cx("ku-demo-label")}>
      Демонстраційні дані · 2027/2028 навчальний рік
    </span>
  );
}
export function crumb(items: [string, string?][]) {
  return (
    <nav className={cx("ku-breadcrumb")} aria-label="Шлях сторінки">
      <Link href="/">Головна</Link>
      {items.map(([text, route], index) => (
        <Fragment key={index}>
          <span>/</span>
          {route ? (
            <Link href={routeHref(route)}>{text}</Link>
          ) : (
            <span aria-current="page">{text}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
export function sectionHead(
  eyebrow: string,
  title: ReactNode,
  side: ReactNode = null,
) {
  return (
    <div className={cx("ku-section-head")}>
      <div>
        <div className={cx("ku-eyebrow")}>{eyebrow}</div>
        <h2>{title}</h2>
      </div>
      {side}
    </div>
  );
}
export function EmptyState({ text, action }: { text: string; action: string }) {
  const { onAction } = useDemo();
  return (
    <div className={cx("ku-empty")} role="status">
      <strong>Поки немає збігів</strong>
      <p>{text}</p>
      <button
        className={cx("ku-button")}
        type="button"
        data-action={action}
        onClick={onAction}
      >
        Скинути фільтри
      </button>
    </div>
  );
}
const steps = [
  "Обрати програму",
  "Перевірити умови",
  "Підготувати документи",
  "Пройти творчий конкурс",
  "Подати заяву",
];
const descriptions = [
  "Почни зі своїх інтересів. Порівняй програми або скористайся простим підбором.",
  "Відкрий сторінку програми. Перевір рівень освіти, форму, випробування та приклад вартості.",
  "Склади власний список. Офіційний перелік документів потрібно буде звірити з правилами прийому.",
  "Якщо програма має творчий конкурс, заплануй підготовку виступу, портфоліо або творчого завдання.",
  "Після офіційного старту кампанії подай заяву через визначений правилами сервіс. На цьому демо заяви не приймають.",
];
export function PathDiagram({ context = "home" }: { context?: string }) {
  const [active, setActive] = useState(0);
  return (
    <>
      <div className={cx("ku-path")} aria-label="П’ять кроків вступу">
        {steps.map((name, index) => (
          <div className={cx("ku-path-step")} key={name}>
            <button
              type="button"
              aria-label={`Крок ${index + 1}: ${name}`}
              aria-pressed={index === active}
              onClick={() => setActive(index)}
            >
              {String(index + 1).padStart(2, "0")}
            </button>
            <h3>
              {name}
              {index === 3 && (
                <span className={styles.pathCondition}>якщо він потрібен</span>
              )}
            </h3>
          </div>
        ))}
      </div>
      <svg
        className={cx("ku-path-sketch")}
        viewBox="0 0 1100 13"
        aria-hidden="true"
      >
        <path
          d="M3 6 Q180 0 350 7 T690 6 T1090 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </svg>
      <div
        className={cx("ku-path-description")}
        id={`path-description-${context}`}
        aria-live="polite"
      >
        <strong>КРОК {String(active + 1).padStart(2, "0")} / 05</strong>
        <p>{descriptions[active]}</p>
      </div>
    </>
  );
}
export function LocalForm({
  children,
  kind,
  ...props
}: {
  children: ReactNode;
  kind: "course" | "question";
  autoComplete?: string;
}) {
  const [hydrated, setHydrated] = useState(false);
  const [success, setSuccess] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (success)
      successRef.current?.focus({
        preventScroll: true,
      });
  }, [success]);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    event.currentTarget.reset();
    setSuccess(true);
  }
  if (success)
    return (
      <div
        className={cx("ku-success")}
        role="status"
        tabIndex={-1}
        ref={successRef}
      >
        <div className={cx("ku-success-icon")} aria-hidden="true">
          ✓
        </div>
        <h3>
          {kind === "course"
            ? "Дякуємо! Вашу демонстраційну заявку прийнято."
            : "Дякуємо! Ваше демонстраційне запитання прийнято."}
        </h3>
        <p>
          Це успішна локальна перевірка форми. Дані нікуди не надіслано та не
          збережено.
        </p>
        {button(
          kind === "course"
            ? "Переглянути інші курси"
            : "Повернутися на головну",
          kind === "course" ? "courses" : "",
          "ku-outline",
        )}
      </div>
    );
  return (
    <form {...props} onSubmit={submit}>
      <fieldset className={cx("ku-form-controls")} disabled={!hydrated}>
        {children}
      </fieldset>
    </form>
  );
}
