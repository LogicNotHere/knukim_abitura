"use client";

import { useState } from "react";
import { facultySocialLinks, socialSources, socialsForFaculty, universitySocials } from "../lib/socials";
import type { SocialNetwork } from "../lib/socials";
import { cx, sectionHead } from "./Common";
import styles from "./Socials.module.css";

const descriptions: Record<SocialNetwork, string> = {
  facebook: "Новини, фотоальбоми та події університету й факультетів.",
  instagram: "Кампус, творчі роботи та студентське життя у фото й відео.",
  tiktok: "Короткі відео, репетиції та творчі моменти студентського життя.",
  youtube: "Відео університету, творчі роботи та знайомство з кампусом.",
  linkedin: "Університет і професійна спільнота випускників.",
};

function NetworkIcon({ network }: { network: SocialNetwork }) {
  return <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" aria-hidden="true" fill="currentColor">
    {network === "facebook" && <path d="M14 22v-9h3l.5-4H14V6.5c0-1.2.3-2 2-2h2V1.2c-.5-.1-1.7-.2-3-.2-3 0-5 1.8-5 5v3H7v4h3v9z" />}
    {network === "instagram" && <><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="17.6" cy="6.5" r="1.2" /></>}
    {network === "tiktok" && <path d="M15.5 2h-3.7v13.2a3 3 0 1 1-2.6-3v-3.7a6.8 6.8 0 1 0 6.3 6.7V8.6a9.2 9.2 0 0 0 5.4 1.7V6.6A5.5 5.5 0 0 1 15.5 2z" />}
    {network === "youtube" && <><rect x="1.5" y="4.5" width="21" height="15" rx="4" /><path d="m10 8 6 4-6 4z" fill="var(--ku-dark, #151515)" /></>}
    {network === "linkedin" && <><rect x="3" y="9" width="4" height="12" /><circle cx="5" cy="4.5" r="2.2" /><path d="M10 9h4v1.7c.7-1.2 1.9-2 3.5-2 3.3 0 4.5 2.1 4.5 5.5V21h-4v-6.2c0-1.7-.3-3-1.9-3-1.8 0-2.1 1.5-2.1 3V21h-4z" /></>}
  </svg>;
}

export function SocialPreview() {
  const [selected, setSelected] = useState("university");
  const source = socialSources.find((entry) => entry.key === selected)!;
  return <section id="home-socials" className={cx("ku-section")}><div className={cx("ku-container")}>
    {sectionHead("Медіа", <>Дивись. Знайомся.<br />Долучайся.</>, <p>Офіційні сторінки університету та факультетів: новини, кампус, творчі роботи й студентське життя.</p>)}
    <div className={styles.chips} aria-label="Соцмережі університету та факультетів">{socialSources.map((entry) => <button key={entry.key} type="button" aria-pressed={selected === entry.key} onClick={() => setSelected(entry.key)}>{entry.label}</button>)}</div>
    <div className={styles.cards} key={selected}>{source.links.map((link) => <article className={styles.card} key={link.network}>
      <div className={styles.visual}><NetworkIcon network={link.network} /><span>{link.handle}</span></div>
      <div className={styles.body}><span>{link.label}</span><h3>{link.handle}</h3><p>{descriptions[link.network]}</p><a href={link.href} target="_blank" rel="noopener noreferrer">Відкрити {link.label} ↗</a></div>
    </article>)}</div>
  </div></section>;
}

export function FacultySocials({ facultyId }: { facultyId: string }) {
  const faculty = socialsForFaculty(facultyId);
  if (!faculty) return <p className={styles.missing}>Для цього демо-факультету офіційні соціальні сторінки не надано.</p>;
  return <div className={styles.faculty}><h3>Офіційні сторінки</h3><div><a href={faculty.site} target="_blank" rel="noopener noreferrer">Сайт факультету ↗</a>{facultySocialLinks(facultyId).map((link) => <a key={link.network} href={link.href} target="_blank" rel="noopener noreferrer"><NetworkIcon network={link.network} />{link.label} ↗</a>)}</div></div>;
}

export function UniversitySocials() {
  return <div className={styles.footer}>{universitySocials.map((link) => <a key={link.network} href={link.href} target="_blank" rel="noopener noreferrer"><NetworkIcon network={link.network} />{link.label} ↗</a>)}</div>;
}
