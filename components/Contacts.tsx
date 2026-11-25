"use client";

import { Fragment } from "react";
import { DATA, find } from "../lib/data";
import { useDemo } from "./DemoProvider";
import { cx, crumb, LocalForm } from "./Common";
import { MapGraphic } from "./Cards";
export function ContactCard() {
  const { state } = useDemo();
  const contact = find("contacts", state.contactCategory);
  return (
    <>
      <div className={cx("ku-contact-card")}>
        <div className={cx("ku-eyebrow")}>Демонстраційний контакт</div>
        <h2
          style={{
            marginTop: "18px",
          }}
        >
          {contact.label}
        </h2>
        <p>{contact.description}</p>
        <dl>
          <dt>Телефон</dt>
          <dd>{contact.phone}</dd>
          <dt>Email</dt>
          <dd>{contact.email}</dd>
          <dt>Години</dt>
          <dd>{contact.hours}</dd>
          <dt>Адреса</dt>
          <dd>
            Київ, вул. Творча, 1<br />
            <span
              style={{
                fontWeight: "400",
                color: "var(--ku-gray)",
              }}
            >
              Умовна адреса
            </span>
          </dd>
        </dl>
        <span className={cx("ku-demo-label")}>
          Тестові номер та пошта не працюють.
        </span>
      </div>
    </>
  );
}
export function Contacts() {
  const { state, onAction, onTopicChange } = useDemo();
  return (
    <>
      <div className={cx("ku-container")}>
        {crumb([["Контакти"]])}
        <section className={cx("ku-page-hero")}>
          <div className={cx("ku-eyebrow")}>Почни з розмови</div>
          <h1 className={cx("ku-page-title")}>
            Твоє запитання —<br />
            хороший початок.
          </h1>
          <p className={cx("ku-page-intro")}>
            Обери тему. Знайди потрібний контакт. Спробуй локальну форму
            запитання.
          </p>
          <span className={cx("ku-demo-label")}>
            Демонстраційні контакти та адреса. Справжнього надсилання немає.
          </span>
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "0",
          }}
        >
          <div
            className={cx("ku-contact-categories")}
            aria-label="Категорія контактів"
          >
            {DATA.contacts.map((contact, itemIndex) => (
              <Fragment key={itemIndex}>
                <button
                  className={cx("ku-filter-chip")}
                  type="button"
                  data-action="contact-category"
                  data-value={contact.id}
                  aria-pressed={state.contactCategory === contact.id}
                  onClick={onAction}
                >
                  {contact.label}
                </button>
              </Fragment>
            ))}
          </div>
          <div className={cx("ku-contact-layout")}>
            <div>
              <div id="contact-content">{<ContactCard />}</div>
              {<MapGraphic />}
            </div>
            <section className={cx("ku-form-panel")}>
              <h2>Поставити запитання</h2>
              <p>
                Потренуймося. Форма перевірить поля й покаже успішний стан. Вона
                не надсилає дані.
              </p>
              <LocalForm autoComplete="off" kind="question">
                <div className={cx("ku-form-grid")}>
                  <label className={cx("ku-field")}>
                    <span>Ім’я *</span>
                    <input
                      name="name"
                      type="text"
                      required
                      minLength={2}
                      maxLength={100}
                      placeholder="Як до тебе звертатися?"
                    />
                  </label>
                  <label className={cx("ku-field")}>
                    <span>Email *</span>
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={120}
                      placeholder="name@example.com"
                    />
                  </label>
                </div>
                <label className={cx("ku-field")}>
                  <span>Тема *</span>
                  <select
                    name="topic"
                    required
                    value={state.contactCategory}
                    onChange={onTopicChange}
                  >
                    {DATA.contacts.map((contact, itemIndex) => (
                      <Fragment key={itemIndex}>
                        <option value={contact.id}>{contact.label}</option>
                      </Fragment>
                    ))}
                  </select>
                </label>
                <label className={cx("ku-field")}>
                  <span>Твоє запитання *</span>
                  <textarea
                    name="question"
                    required
                    minLength={10}
                    maxLength={2000}
                    placeholder="Наприклад: як підготувати творчу роботу для напряму кіно?"
                  ></textarea>
                </label>
                <label className={cx("ku-consent")}>
                  <input type="checkbox" name="consent" required />
                  <span>
                    Погоджуюся з демонстраційною обробкою даних у цій формі.
                    Дані нікуди не надсилаються. *
                  </span>
                </label>
                <button className={cx("ku-button ku-lime")} type="submit">
                  Надіслати демо-запитання
                </button>
                <p>
                  Введені значення зникнуть після успішної перевірки або виходу
                  зі сторінки.
                </p>
              </LocalForm>
            </section>
          </div>
        </section>
      </div>
    </>
  );
}
