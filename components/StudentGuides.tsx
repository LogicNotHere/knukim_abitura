"use client";

import Link from "next/link";
import { useState } from "react";
import data from "../data/student-guides.json";
import { cx, crumb, sectionHead } from "./Common";
import { MapGraphic } from "./Cards";
import styles from "./StudentGuides.module.css";

export const STUDENT_GUIDES = data;

function ResourceLinks({ ids }: { ids: string[] }) {
  return <div className={styles.links}>{ids.map((id) => {
    const resource = data.resources.find((item) => item.id === id)!;
    const external = resource.href.startsWith("http");
    const content = <><strong>{resource.label} {external ? "↗" : "→"}</strong><span>{resource.note}</span></>;
    return external ? <a key={id} href={resource.href} target="_blank" rel="noopener noreferrer">{content}</a> : <Link href={resource.href} key={id}>{content}</Link>;
  })}</div>;
}

export function StudentCards() {
  return <section id="home-students" className={cx("ku-section")}><div className={cx("ku-container")}>
    {sectionHead("Студентам", "Більше, ніж навчання.")}
    <div className={styles.homeCards}>{data.homeCards.map((card) => <Link href={card.href} key={card.id}><span>{card.tag}</span><h3>{card.title}</h3><p>{card.action} <span aria-hidden="true">→</span></p></Link>)}</div>
  </div></section>;
}

export function StudentGuidePage({ id }: { id: "career" | "rights" | "life" }) {
  const guide = data.guides.find((item) => item.id === id)!;
  return <div className={cx("ku-container")}>
    {crumb([[guide.title]])}
    <section className={cx("ku-page-hero")}><div className={cx("ku-eyebrow")}>Студентам · {guide.tag}</div><h1 className={cx("ku-page-title")}>{guide.title}</h1><p className={cx("ku-page-intro")}>{guide.intro}</p>{guide.notice && <p className={styles.disclaimer}>{guide.notice}</p>}</section>
    <div className={styles.guide}>
      {guide.sections.map((section) => <section className={styles.section} key={section.id}><div className={styles.sectionTitle}><span>СТУДЕНТАМ</span><h2>{section.title}</h2></div><div className={styles.sectionBody}>{section.texts.map((text) => <p key={text}>{text}</p>)}<ResourceLinks ids={section.linkIds} />{id === "life" && section.id === "campus" && <MapGraphic />}</div></section>)}
      {guide.steps.length > 0 && <section className={styles.stepsSection}><h2>Що робити, якщо є проблема</h2><ol className={styles.steps}>{guide.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol></section>}
      {guide.cases.length > 0 && <section className={styles.casesSection}><div className={cx("ku-eyebrow")}>Демонстраційні дані</div><h2>{id === "career" ? "Кейси випускників" : "Студентське життя та дозвілля"}</h2><div className={styles.cases}>{guide.cases.map((item) => <article key={item.id}><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>}
    </div>
  </div>;
}

export function Opportunities() {
  const [category, setCategory] = useState("");
  const opportunity = data.opportunities;
  const cards = opportunity.cards.filter((card) => !category || card.category === category);
  return <div className={cx("ku-container")}>
    {crumb([["Гранти, стипендії та обміни"]])}<section className={cx("ku-page-hero")}><div className={cx("ku-eyebrow")}>Студентам · Можливості</div><h1 className={cx("ku-page-title")}>{opportunity.title}</h1><p className={cx("ku-page-intro")}>{opportunity.intro}</p></section>
    <div className={styles.guide}>
      <div className={styles.filters} aria-label="Категорія можливостей"><button type="button" aria-pressed={!category} onClick={() => setCategory("")}>Усі можливості</button>{opportunity.categories.map((item) => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label}</button>)}</div>
      <p className={styles.count} role="status">Можливостей: {cards.length}</p>
      <div className={styles.opportunities}>{cards.map((card) => <article key={card.id}><span>{opportunity.categories.find((item) => item.id === card.category)!.label}</span><h2>{card.title}</h2><p>{card.text}</p><span className={styles.demo}>{card.label}</span><ResourceLinks ids={[card.resourceId]} /></article>)}</div>
      <section className={styles.stepsSection}><h2>Як подати заявку</h2><ol className={styles.steps}>{opportunity.steps.map((step, index) => <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><p>{step}</p></li>)}</ol></section>
      <section className={styles.sourceSection}><h2>Офіційні джерела</h2><ResourceLinks ids={opportunity.resourceIds} /></section>
    </div>
  </div>;
}
