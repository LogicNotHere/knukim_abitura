"use client";

import { useEffect, useState } from "react";
import { POLL, getResults, getVote, vote } from "../lib/poll";
import type { VoteStorage } from "../lib/poll";
import { cx } from "./Common";
import styles from "./Poll.module.css";

function browserStorage(): VoteStorage | null {
  try { return window.localStorage; } catch { return null; }
}

export function Poll() {
  const [ready, setReady] = useState(false);
  const [choice, setChoice] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [persistent, setPersistent] = useState(true);
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => { const stored = getVote(browserStorage()); setChoice(stored.choice); setPersistent(stored.persistent); setReady(true); }, []);
  function choose(id: string) {
    const result = vote(id, browserStorage()); setChoice(result.choice); setPersistent(result.persistent); setEditing(false);
    const label = POLL.options.find((option) => option.id === id)!.label;
    setAnnouncement(`Твоя відповідь: ${label}. Показуємо демонстраційні результати.`);
  }
  const voted = choice !== null && !editing;
  return <section id="home-poll" className={cx("ku-section")}><div className={cx("ku-container")}><div className={styles.poll}>
    <div className={styles.intro}><span className={cx("ku-eyebrow")}>Опитування</span><h2>{POLL.question}</h2><p>{POLL.description}</p><span className={styles.flower} aria-hidden="true">✳</span></div>
    <div className={styles.answers} aria-busy={!ready}>
      {!ready ? <p className={styles.loading}>Завантажуємо твій вибір…</p> : voted ? <>
        <div className={styles.results}>{getResults(choice).map((option) => <div className={styles.result} key={option.id} data-selected={option.selected}>
          <div><strong>{option.label}</strong><b>{option.percentage}%</b></div>{option.selected && <span className={styles.own}>✓ Твоя відповідь</span>}<div className={styles.track}><span style={{ width: `${option.percentage}%` }} /></div>
        </div>)}</div>
        <button type="button" className={styles.change} onClick={() => setEditing(true)}>Змінити відповідь</button>
      </> : <div className={styles.options}>{POLL.options.map((option, index) => <button type="button" key={option.id} aria-pressed={choice === option.id} onClick={() => choose(option.id)}><span>{String(index + 1).padStart(2, "0")}</span>{option.label}<span aria-hidden="true">↗</span></button>)}</div>}
      <p className={styles.note}>{POLL.note}</p>
      {!persistent && <p className={styles.note} role="status">Браузер не дозволяє зберегти вибір. Відповідь діє, поки ця сторінка відкрита.</p>}
      <p className={styles.srOnly} aria-live="polite" role="status">{announcement}</p>
    </div>
  </div></div></section>;
}
