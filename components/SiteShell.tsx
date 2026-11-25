"use client";
import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DATA, eventCategories, find } from "../lib/data";
import { useDemo } from "./DemoProvider";
import { button, cx, image } from "./Common";
const navigation = [
  ["/", "Головна"],
  ["/admissions", "Вступ 2027"],
  ["/faculties", "Факультети"],
  ["/courses", "Курси"],
  ["/events", "Події"],
  ["/contacts", "Контакти"],
];
function DemoDialog() {
  const { dialog, setDialog } = useDemo();
  const ref = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    setDialog(null);
  }, [pathname, setDialog]);
  useEffect(() => {
    if (dialog && !ref.current?.open) ref.current?.showModal();
    if (!dialog && ref.current?.open) ref.current.close();
  }, [dialog]);
  let content: ReactNode = null;
  if (dialog?.type === "info")
    content = (
      <div className={cx("ku-dialog-content")}>
        <div className={cx("ku-eyebrow")}>Макет майбутнього сервісу</div>
        <h2 id="ku-dialog-title">Тут можна все спробувати.</h2>
        <p>{DATA.meta.description}</p>
        <p>
          Фільтри, підбір і форми працюють у браузері. Форми не надсилають та не
          зберігають особисті дані. Реального вступу, оплати чи бронювання
          немає.
        </p>
        <button
          className={cx("ku-button ku-lime")}
          type="button"
          onClick={() => setDialog(null)}
        >
          Зрозуміло, досліджуймо
        </button>
      </div>
    );
  else if (dialog?.type === "event") {
    const event = find("events", dialog.id);
    content = (
      <>
        <div className={cx("ku-dialog-photo")}>
          {image(event.image, "Ілюстративне фото творчої події")}
        </div>
        <div className={cx("ku-dialog-content")}>
          <span className={cx("ku-eyebrow")}>
            {eventCategories[event.category]}
          </span>
          <h2 id="ku-dialog-title">{event.title}</h2>
          <p>
            <b>{event.fullDate}</b>
            <br />
            {event.location}
          </p>
          <p>{event.description}</p>
          <h3>Що заплановано</h3>
          <ul>
            {event.agenda.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <span className={cx("ku-demo-label")}>
            Демонстраційні дані. Подія вигадана, реєстрація відсутня.
          </span>
          <div className={cx("ku-actions")}>
            {button(
              event.category === "courses"
                ? "Переглянути курси"
                : "Поставити запитання",
              event.category === "courses" ? "courses" : "contacts",
              "ku-lime",
            )}
          </div>
        </div>
      </>
    );
  } else if (dialog?.type === "project") {
    const project = find("studentProjects", dialog.id);
    content = (
      <>
        <div className={cx("ku-dialog-photo")}>
          {image(project.image, project.type)}
        </div>
        <div className={cx("ku-dialog-content")}>
          <span className={cx("ku-eyebrow")}>{project.type}</span>
          <h2 id="ku-dialog-title">{project.name}</h2>
          <p>{project.description}</p>
          <p>
            Зображення ілюстративне. Готовий фільм або відео в цьому демо не
            відтворюється.
          </p>
          {button("Дослідити програми", "faculties", "ku-lime")}
        </div>
      </>
    );
  }
  return (
    <dialog
      ref={ref}
      className={cx("ku-dialog")}
      aria-labelledby="ku-dialog-title"
      onCancel={(event) => {
        event.preventDefault();
        setDialog(null);
      }}
      onClose={() => setDialog(null)}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          setDialog(null);
      }}
    >
      <button
        className={cx("ku-dialog-close")}
        type="button"
        aria-label="Закрити вікно"
        onClick={() => setDialog(null)}
      >
        ×
      </button>
      {content}
    </dialog>
  );
}
export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { onAction } = useDemo();
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);
  useEffect(() => {
    const closeMenu = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeMenu);
    return () => document.removeEventListener("keydown", closeMenu);
  }, []);
  function active(href: string) {
    if (href === "/faculties")
      return ["/faculties", "/faculty/", "/department/", "/program/"].some(
        (prefix) => pathname.startsWith(prefix),
      );
    if (href === "/courses")
      return pathname === "/courses" || pathname.startsWith("/course/");
    return pathname === href;
  }
  return (
    <div className={cx("ku-site")}>
      <a className={cx("ku-skip")} href="#main">
        До вмісту
      </a>
      <div className={cx("ku-demo-bar")}>
        <span>КНУКіМ / АБІТУРІЄНТ</span>
        <button type="button" data-action="demo-info" onClick={onAction}>
          Демонстраційний сайт <span className={cx("ku-dot")} />
        </button>
      </div>
      <header className={cx("ku-header")}>
        <Link className={cx("ku-brand")} href="/" aria-label="КНУКіМ — головна">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <path
              d="M4 4h10v12L25 4h12L21 20l16 16H24L14 25v11H4z"
              fill="currentColor"
            />
          </svg>
          <span>
            КНУКіМ<small>ТВІЙ ТВОРЧИЙ СТАРТ</small>
          </span>
        </Link>
        <nav
          id="main-navigation"
          className={cx(`ku-nav ${menuOpen ? "ku-nav-open" : ""}`)}
          aria-label="Головна навігація"
        >
          {navigation.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link
          className={cx("ku-button ku-button-small ku-lime ku-header-match")}
          href="/matcher"
        >
          Обрати своє
        </Link>
        <button
          className={cx("ku-menu")}
          type="button"
          aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <footer className={cx("ku-footer")}>
        <div className={cx("ku-container ku-footer-top")}>
          <div>
            <Link className={cx("ku-footer-brand")} href="/">
              КНУКіМ<span>Культура. Творчість. Ти.</span>
            </Link>
            <p>Знайди напрям, у якому хочеться зростати.</p>
            <p>
              Демо-контакти: +380 (00) 000-00-01
              <br />
              admissions@example.invalid
              <br />
              Київ, вул. Творча, 1 · умовна адреса
            </p>
          </div>
          <div>
            <b>Твій наступний крок</b>
            <Link href="/">Головна</Link>
            <Link href="/faculties">Переглянути факультети</Link>
            <Link href="/matcher">Підібрати програму</Link>
            <Link href="/admissions">Розібратися зі вступом</Link>
          </div>
          <div>
            <b>Будьмо на зв’язку</b>
            <Link href="/contacts">Приймальна комісія</Link>
            <Link href="/courses">Підготовчі курси</Link>
            <Link href="/events">Події для вступників</Link>
            <Link href="/contacts">Соцмережі: демо-контакти</Link>
          </div>
        </div>
        <div className={cx("ku-container ku-footer-bottom")}>
          <p>
            Демонстраційні дані. Цей сайт не приймає справжні заяви. Фото —
            ілюстративні.
          </p>
          <a
            href="https://knukim.edu.ua/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Офіційний сайт університету
          </a>
        </div>
      </footer>
      <DemoDialog />
    </div>
  );
}
