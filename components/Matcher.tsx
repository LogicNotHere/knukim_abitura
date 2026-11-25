"use client";

import { Fragment } from "react";
import { DATA, find, money, levelLabel, formatLabel } from "../lib/data";
import { matchedPrograms } from "../lib/catalog";
import { useDemo } from "./DemoProvider";
import { cx, button, demo, crumb, EmptyState } from "./Common";
export function Matcher() {
  const { state, onAction, onFieldChange } = useDemo();
  const match = state.match;
  let content;
  if (match.step === 1) {
    content = (
      <>
        <h2>Що тебе надихає?</h2>
        <p>
          Обери один або кілька напрямів. Або пропусти крок, щоб дослідити всі
          можливості.
        </p>
        <div className={cx("ku-match-options")}>
          {DATA.interests.map((interest, itemIndex) => (
            <Fragment key={itemIndex}>
              <label className={cx("ku-match-option")}>
                <input
                  type="checkbox"
                  data-match="interests"
                  value={interest.id}
                  checked={match.interests.includes(interest.id)}
                  onChange={onFieldChange}
                />
                {interest.label}
              </label>
            </Fragment>
          ))}
        </div>
      </>
    );
  } else if (match.step === 2) {
    content = (
      <>
        <h2>Що тобі подобається робити?</h2>
        <p>
          Обери заняття, в яких хочеться спробувати себе. Можна обрати кілька
          або пропустити.
        </p>
        <div className={cx("ku-match-options")}>
          {DATA.activities.map((activity, itemIndex) => (
            <Fragment key={itemIndex}>
              <label className={cx("ku-match-option")}>
                <input
                  type="checkbox"
                  data-match="activities"
                  value={activity.id}
                  checked={match.activities.includes(activity.id)}
                  onChange={onFieldChange}
                />
                {activity.label}
              </label>
            </Fragment>
          ))}
        </div>
      </>
    );
  } else {
    content = (
      <>
        <h2>Як тобі зручно навчатися?</h2>
        <p>
          Ці параметри обмежують результати. Покажемо лише програми, що
          відповідають усім умовам.
        </p>
        <div className={cx("ku-form-grid")}>
          <label className={cx("ku-field")}>
            <span>Рівень освіти</span>
            <select
              data-match="level"
              onChange={onFieldChange}
              value={state.match["level" as "level" | "format" | "creative"]}
            >
              <option value="bachelor">Бакалаврат</option>
              <option value="master">Магістратура</option>
            </select>
          </label>
          <label className={cx("ku-field")}>
            <span>Форма навчання</span>
            <select
              data-match="format"
              onChange={onFieldChange}
              value={state.match["format" as "level" | "format" | "creative"]}
            >
              <option value="">Будь-яка</option>
              <option value="day">Денна</option>
              <option value="part">Заочна</option>
            </select>
          </label>
        </div>
        <label className={cx("ku-field")}>
          <span>Готовність до творчого конкурсу</span>
          <select
            data-match="creative"
            onChange={onFieldChange}
            value={state.match["creative" as "level" | "format" | "creative"]}
          >
            <option value="any">Готовий / готова, якщо потрібен</option>
            <option value="no">Лише без творчого конкурсу</option>
          </select>
        </label>
        <label className={cx("ku-field")}>
          <span>
            {"Максимальна ціна за рік: "}
            <output id="match-price">
              {money(match.price)}
              {" ₴"}
            </output>
          </span>
          <input
            className={cx("ku-range")}
            type="range"
            data-match="price"
            min="30000"
            max="60000"
            step="1000"
            value={match.price}
            onChange={onFieldChange}
          />
          <small>2027/2028 · демонстраційні контрактні ціни</small>
        </label>
      </>
    );
  }
  return (
    <>
      <div className={cx("ku-container")}>
        {crumb([["Підбір програми"]])}
        <section className={cx("ku-page-hero")}>
          <div className={cx("ku-match-shell")}>
            <div className={cx("ku-eyebrow")}>Три кроки до свого напряму</div>
            <h1 className={cx("ku-page-title")}>Почнімо з тебе.</h1>
            <p className={cx("ku-page-intro")}>
              Звичайний підбір за твоїми відповідями. Жодної магії — лише
              спільні інтереси й умови навчання.
            </p>
            <div
              className={cx("ku-match-progress")}
              aria-label={`Крок ${match.step} з 3`}
            >
              {["Інтереси", "Заняття", "Умови"].map((label, index) => (
                <Fragment key={index}>
                  <div
                    className={cx(match.step >= index + 1 ? "ku-active" : "")}
                  >
                    <span>{index + 1}</span>
                    <b>{label}</b>
                  </div>
                </Fragment>
              ))}
            </div>
            <div className={cx("ku-match-panel")}>
              {content}
              <div className={cx("ku-match-navigation")}>
                {match.step > 1 ? (
                  <>
                    <button
                      className={cx("ku-button ku-outline")}
                      type="button"
                      data-action="match-back"
                      onClick={onAction}
                    >
                      Назад
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={cx("ku-plain")}
                      type="button"
                      data-action="reset-matcher"
                      onClick={onAction}
                    >
                      Скинути відповіді
                    </button>
                  </>
                )}
                <p>
                  {"Крок "}
                  {match.step}
                  {" із 3"}
                </p>
                <button
                  className={cx("ku-button ku-lime")}
                  type="button"
                  data-action="match-next"
                  onClick={onAction}
                >
                  {match.step === 3 ? "Показати програми" : "Далі"}
                </button>
              </div>
            </div>
            <span className={cx("ku-demo-label")}>
              Відповіді зберігаються лише до перезавантаження сторінки.
            </span>
          </div>
        </section>
      </div>
    </>
  );
}
export function MatchResults() {
  const { state, onAction } = useDemo();
  const match = state.match;
  const results = matchedPrograms(state.match);
  const chips = [
    ...match.interests.map((id) => find("interests", id).label),
    ...match.activities.map((id) => find("activities", id).label),
    levelLabel(match.level),
    match.format ? formatLabel(match.format) : "Будь-яка форма",
    match.creative === "no" ? "Без творчого конкурсу" : "Конкурс можливий",
    `До ${money(match.price)} ₴ / рік`,
  ];
  return (
    <>
      <div className={cx("ku-container")}>
        {crumb([["Підбір програми", "matcher"], ["Результати"]])}
        <section className={cx("ku-page-hero")}>
          <div className={cx("ku-results-top")}>
            <div>
              <div className={cx("ku-eyebrow")}>Твої орієнтири вже поруч</div>
              <h1 className={cx("ku-page-title")}>
                {results.length ? (
                  <>
                    Ось із чого
                    <br />
                    можна почати.
                  </>
                ) : (
                  <>
                    Спробуймо
                    <br />
                    трохи ширше.
                  </>
                )}
              </h1>
              <p className={cx("ku-page-intro")}>
                {results.length
                  ? `Знайдено програм за твоїми умовами: ${results.length}. Це добірка для знайомства, а не гарантія вступу.`
                  : "За обраними умовами програм у демо немає. Зміни інтереси, форму або межу вартості."}
              </p>
            </div>
            <div className={cx("ku-actions")}>
              {button("Змінити відповіді", "matcher", "ku-outline")}
              <button
                className={cx("ku-button ku-lime")}
                type="button"
                data-action="reset-matcher"
                onClick={onAction}
              >
                Почати знову
              </button>
            </div>
          </div>
          <div className={cx("ku-match-summary")}>
            {chips.map((label, itemIndex) => (
              <Fragment key={itemIndex}>
                <span className={cx("ku-chip")}>{label}</span>
              </Fragment>
            ))}
          </div>
          {demo()}
        </section>
        <section
          className={cx("ku-section")}
          style={{
            paddingTop: "5px",
          }}
        >
          <div className={cx("ku-results-grid")}>
            {results.length ? (
              results.map(({ program }, itemIndex) => {
                const interests = match.interests.includes(program.interest)
                  ? [
                      `Твій інтерес: ${find("interests", program.interest).label}.`,
                    ]
                  : [];
                const activities = match.activities
                  .filter((id) => program.activities.includes(id))
                  .map((id) =>
                    find("activities", id).label.toLocaleLowerCase("uk"),
                  );
                return (
                  <Fragment key={itemIndex}>
                    <article className={cx("ku-result")}>
                      <span
                        className={cx("ku-mini-label")}
                        style={{
                          color: "var(--ku-purple)",
                        }}
                      >
                        {find("faculties", program.faculty).name}
                      </span>
                      <h2>{program.name}</h2>
                      <p className={cx("ku-muted")}>
                        {levelLabel(program.level)}
                        {" · "}
                        {program.formats.map(formatLabel).join(" / ")}
                      </p>
                      <div className={cx("ku-chips")}>
                        <span className={cx("ku-chip")}>
                          {program.creative
                            ? "Творчий конкурс"
                            : "Без творчого конкурсу"}
                        </span>
                      </div>
                      <div className={cx("ku-result-reasons")}>
                        <strong>Чому ця програма</strong>
                        {interests.map((reason, itemIndex) => (
                          <Fragment key={itemIndex}>
                            <p>{reason}</p>
                          </Fragment>
                        ))}
                        {activities.length ? (
                          <>
                            <p>
                              {"Спільні заняття: "}
                              {activities.join(", ")}.
                            </p>
                          </>
                        ) : (
                          ""
                        )}
                        <p>
                          {levelLabel(program.level)}
                          {match.format
                            ? `, ${formatLabel(match.format).toLocaleLowerCase("uk")} форма`
                            : ""}
                          . Вартість у межах твого бюджету.
                        </p>
                        {!interests.length && !activities.length ? (
                          <>
                            <p>
                              Ти не обмежив інтереси й заняття. Збіг за умовами
                              навчання.
                            </p>
                          </>
                        ) : (
                          ""
                        )}
                      </div>
                      <div className={cx("ku-result-price")}>
                        {money(program.price)}
                        {" ₴ "}
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: "400",
                          }}
                        >
                          / рік
                        </span>
                      </div>
                      <span
                        className={cx("ku-demo-label")}
                        style={{
                          marginBottom: "22px",
                        }}
                      >
                        Демонстраційна ціна · 2027/2028
                      </span>
                      {button(
                        "Детальніше про програму",
                        `program/${program.id}`,
                        "ku-outline",
                      )}
                    </article>
                  </Fragment>
                );
              })
            ) : (
              <EmptyState
                text="Умови не дають жодного збігу. Скинь відповіді або повернися, щоб змінити бюджет і формат."
                action="reset-matcher"
              />
            )}
          </div>
        </section>
      </div>
    </>
  );
}
