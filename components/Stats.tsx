"use client";

import Link from "next/link";
import { useState } from "react";
import { DATA } from "../lib/data";
import { STATS, filterStats, getProgramStats, getStats, getStatsTotals, rankStats, sortStats, statsNumber } from "../lib/stats";
import type { StatsColumn, StatsMetric, StatsRow } from "../lib/stats";
import { cx, crumb, sectionHead } from "./Common";
import styles from "./Stats.module.css";

const metrics: [StatsMetric, string][] = [["applications", "за заявами"], ["ratio", "за конкурсом на місце"], ["passingScore", "за прохідним балом"]];
const columns: [StatsColumn, string][] = [["name", "Програма"], ["faculty", "Факультет"], ["applications", "Заяви"], ["budgetPlaces", "Бюджетні місця"], ["ratio", "Конкурс на місце"], ["passingScore", "Прохідний бал"]];

function Totals({ rows }: { rows: StatsRow[] }) {
  const totals = getStatsTotals(rows);
  return <div className={styles.totals}>{([
    [totals.applications, "заяв за кампанію"], [totals.competitionOffers, "конкурсних пропозицій"], [totals.licensedPlaces, "ліцензованих місць"], [totals.budgetPlaces, "бюджетних місць"],
  ] as [number, string][]).map(([value, label]) => <div key={label}><span>КНУКіМ · ДЕМО</span><strong>{statsNumber(value)}</strong><p>{label}</p></div>)}</div>;
}

function Ranking({ rows, metric }: { rows: StatsRow[]; metric: StatsMetric }) {
  const ranked = rankStats(rows, metric);
  const maximum = Math.max(...ranked.map((row) => row[metric] ?? 0), 1);
  return <div className={styles.ranking}>{ranked.map((row, index) => <Link href={`/program/${row.id}`} key={row.id} className={styles.rankRow}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{row.name}</strong><div className={styles.track}><span style={{ width: `${(row[metric] ?? 0) / maximum * 100}%` }} /></div></div><b>{statsNumber(row[metric], metric === "applications" ? 0 : 1)}</b></Link>)}</div>;
}

function SourceNote({ year }: { year: number }) {
  const snapshot = STATS.years.find((entry) => entry.year === year)!;
  return <p className={styles.note}>{STATS.note} <time dateTime={snapshot.snapshotDate}>{snapshot.snapshotDate}</time>.</p>;
}

export function StatsPreview() {
  const rows = getStats();
  return <section id="home-stats" className={cx("ku-section")}><div className={cx("ku-container")}>
    {sectionHead("Дані вступу", "Вступ у цифрах", <Link href="/stats" className={cx("ku-text-link")}>Всі дані →</Link>)}
    <Totals rows={rows} /><Ranking rows={rows} metric="applications" /><SourceNote year={2026} />
  </div></section>;
}

export function StatsPage() {
  const [year, setYear] = useState(2026);
  const [metric, setMetric] = useState<StatsMetric>("applications");
  const [query, setQuery] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [sort, setSort] = useState<{ column: StatsColumn; direction: "asc" | "desc" }>({ column: "applications", direction: "desc" });
  const rows = getStats(year);
  const visible = sortStats(filterStats(rows, query, facultyId), sort.column, sort.direction);
  function selectColumn(column: StatsColumn) {
    setSort((current) => ({ column, direction: current.column === column && current.direction === "desc" ? "asc" : "desc" }));
  }
  return <div className={cx("ku-container")}>
    {crumb([["Вступ у цифрах"]])}
    <section className={cx("ku-page-hero")}><div className={cx("ku-eyebrow")}>Дані вступу</div><h1 className={cx("ku-page-title")}>Вступ у цифрах</h1><p className={cx("ku-page-intro")}>Порівняй програми за заявами, бюджетними місцями та балами. Усі цифри — демонстраційні.</p></section>
    <section className={styles.content}>
      <div className={styles.switches} aria-label="Рік вступної кампанії">{[2025, 2026].map((value) => <button type="button" key={value} aria-pressed={year === value} onClick={() => setYear(value)}>{value}</button>)}</div>
      <Totals rows={rows} />
      <h2 className={styles.subheading}>Топ програм</h2>
      <div className={styles.switches} aria-label="Показник рейтингу">{metrics.map(([value, label]) => <button type="button" key={value} aria-pressed={metric === value} onClick={() => setMetric(value)}>{label}</button>)}</div>
      <Ranking rows={rows} metric={metric} />
      <h2 className={styles.subheading}>Усі програми</h2>
      <div className={styles.filters}><label>Пошук програми<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Назва програми" /></label><label>Факультет<select value={facultyId} onChange={(event) => setFacultyId(event.target.value)}><option value="">Усі факультети</option>{DATA.faculties.map((faculty) => <option value={faculty.id} key={faculty.id}>{faculty.name}</option>)}</select></label></div>
      <p className={styles.note}>Конкурс на місце = заяви / бюджетні місця. «—» означає відсутність бюджетних місць у демо.</p>
      <p className={styles.count} role="status">Програм: {visible.length}</p>
      <div className={styles.mobileSort}><label>Сортувати за<select value={sort.column} onChange={(event) => setSort({ column: event.target.value as StatsColumn, direction: sort.direction })}>{columns.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label><button type="button" onClick={() => setSort({ ...sort, direction: sort.direction === "asc" ? "desc" : "asc" })}>{sort.direction === "asc" ? "За зростанням ↑" : "За спаданням ↓"}</button></div>
      {visible.length ? <table className={styles.table}><caption>Демонстраційна статистика вступу за {year} рік</caption><thead><tr>{columns.map(([value, label]) => <th scope="col" key={value} aria-sort={sort.column === value ? sort.direction === "asc" ? "ascending" : "descending" : "none"}><button type="button" onClick={() => selectColumn(value)}>{label} {sort.column === value ? sort.direction === "asc" ? "↑" : "↓" : "↕"}</button></th>)}</tr></thead><tbody>{visible.map((row) => <tr key={row.id}>{columns.map(([value, label]) => <td key={value} data-label={label}>{value === "name" ? <Link href={`/program/${row.id}`}>{row.name} ↗</Link> : typeof row[value] === "string" ? row[value] : statsNumber(row[value] as number | null, value === "ratio" || value === "passingScore" ? 1 : 0)}</td>)}</tr>)}</tbody></table> : <div className={styles.empty}><h3>Програм за цими умовами немає</h3><button type="button" onClick={() => { setQuery(""); setFacultyId(""); }}>Скинути фільтри</button></div>}
      <div className={styles.source}><h2>Звідки дані</h2><p>{STATS.sourceText}</p><SourceNote year={year} /></div>
    </section>
  </div>;
}

export function ProgramStats({ programId }: { programId: string }) {
  const row = getProgramStats(programId)!;
  return <section className={styles.program}><div><span className={cx("ku-eyebrow")}>Демонстраційні дані · 2026</span><h2>Минулого року</h2></div><dl>{([["Заяв", row.applications], ["Бюджетних місць", row.budgetPlaces], ["Конкурс на місце", row.ratio], ["Прохідний бал", row.passingScore]] as [string, number | null][]).map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{statsNumber(value, 1)}</dd></div>)}</dl><p className={styles.note}>Конкурс = заяви / бюджетні місця. Це приклад минулої кампанії, а не прогноз вступу.</p><Link href="/stats" className={cx("ku-text-link")}>Усі дані вступу →</Link></section>;
}
