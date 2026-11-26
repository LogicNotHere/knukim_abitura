"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { NewsItem, NewsResult } from "../lib/news";
import { NEWS_SOURCES } from "../lib/socials";
import type { NewsSource } from "../lib/socials";
import { cx, crumb, sectionHead } from "./Common";
import styles from "./News.module.css";

const date = (value: string) => new Intl.DateTimeFormat("uk-UA", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Kyiv" }).format(new Date(value));

function NewsImage({ item }: { item: NewsItem }) {
  const [failed, setFailed] = useState(false);
  const source = NEWS_SOURCES.find((entry) => entry.key === item.sourceId)!;
  return <div className={styles.picture} style={{ "--news-source": source.color } as CSSProperties}>{item.image && !failed ? <img src={item.image} alt="" loading="lazy" onError={() => setFailed(true)} /> : <div className={styles.placeholder}><span>КНУКіМ</span><strong>{source.shortLabel}</strong><span>НОВИНИ ↗</span></div>}</div>;
}

export function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  const source = NEWS_SOURCES.find((entry) => entry.key === item.sourceId)!;
  return <article className={`${styles.card} ${featured ? styles.featured : ""}`}>
    <NewsImage item={item} />
    <div className={styles.cardBody}>
      <div className={styles.meta}><span>{source.shortLabel}</span><time dateTime={item.publishedAt}>{date(item.publishedAt)}</time></div>
      {item.demo && <span className={styles.demoTag}>Демонстраційні дані</span>}
      <h3>{item.title}</h3><p>{item.excerpt}</p>
      <a href={item.url} target="_blank" rel="noopener noreferrer">{item.demo ? "Сайт джерела" : "Читати на сайті"} ↗</a>
    </div>
  </article>;
}

function SourceChips({ source, onChange }: { source: string; onChange: (source: string) => void }) {
  return <div className={styles.chips} aria-label="Джерело новин"><button type="button" aria-pressed={!source} onClick={() => onChange("")}>Усі джерела</button>{NEWS_SOURCES.map((entry) => <button type="button" key={entry.key} title={entry.name} aria-pressed={source === entry.key} onClick={() => onChange(entry.key)}>{entry.shortLabel}</button>)}</div>;
}

function FallbackNote({ news }: { news: NewsResult }) {
  return news.demo ? <p className={styles.fallback} role="status">Демонстраційні дані. Зараз немає доступних новин із джерел. Показуємо локальні приклади; посилання ведуть на сайти джерел.</p> : null;
}

export function NewsPreview({ news }: { news: NewsResult }) {
  const [source, setSource] = useState("");
  const [active, setActive] = useState(0);
  const [manualPause, setManualPause] = useState(false);
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [reduced, setReduced] = useState(true);
  const filtered = useMemo(() => news.items.filter((item) => !source || item.sourceId === source), [news, source]);
  const paused = manualPause || hover || focus;
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches); update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || reduced || filtered.length < 2) return;
    const timer = window.setInterval(() => setActive((value) => (value + 1) % filtered.length), 6000);
    return () => window.clearInterval(timer);
  }, [paused, reduced, filtered.length, source]);
  const featured = filtered[active % (filtered.length || 1)];
  function selectSource(value: string) { setSource(value); setActive(0); }
  return <section id="home-news" className={cx("ku-section")}><div className={cx("ku-container")}>
    {sectionHead("З університету та факультетів", "Новини КНУКіМ", <Link href="/news" className={cx("ku-text-link")}>Усі новини →</Link>)}
    <SourceChips source={source} onChange={selectSource} /><FallbackNote news={news} />
    {featured ? <>
      <div className={styles.previewGrid}>
        <div className={styles.feature} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onFocusCapture={() => setFocus(true)} onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocus(false); }}>
          <NewsCard key={featured.id} item={featured} featured />
          <div className={styles.featureControls}><span aria-live="off">{active % filtered.length + 1} / {filtered.length}</span><button type="button" aria-label="Попередня новина" onClick={() => setActive((value) => (value - 1 + filtered.length) % filtered.length)}>←</button><button type="button" aria-pressed={manualPause} onClick={() => setManualPause((value) => !value)}>{manualPause ? "Продовжити" : "Пауза"}</button><button type="button" aria-label="Наступна новина" onClick={() => setActive((value) => (value + 1) % filtered.length)}>→</button></div>
          {!reduced && filtered.length > 1 && <div className={styles.progress} key={`${source}-${active}`}><span style={{ animationPlayState: paused ? "paused" : "running" }} /></div>}
        </div>
        <div className={styles.sideCards}>{filtered.filter((item) => item.id !== featured.id).slice(0, 4).map((item) => <NewsCard item={item} key={item.id} />)}</div>
      </div>
      <div className={styles.ticker} aria-label="Заголовки новин"><div><span>{filtered.slice(0, 8).map((item) => item.title).join("　✳　")}　✳　</span><span aria-hidden="true">{filtered.slice(0, 8).map((item) => item.title).join("　✳　")}　✳　</span></div></div>
    </> : <div className={styles.empty}><h3>У цього джерела поки немає новин</h3><p>Інші джерела залишаються доступними.</p><button type="button" onClick={() => selectSource("")}>Показати всі джерела</button></div>}
  </div></section>;
}

export function NewsPage({ news }: { news: NewsResult }) {
  const search = useSearchParams(); const router = useRouter(); const pathname = usePathname();
  const requested = search.get("source");
  const source = NEWS_SOURCES.some((entry) => entry.key === requested) ? requested! : "";
  const [query, setQuery] = useState(""); const [visible, setVisible] = useState(12);
  useEffect(() => { setVisible(12); }, [source, query]);
  const filtered = news.items.filter((item) => (!source || item.sourceId === source) && item.title.toLocaleLowerCase("uk-UA").includes(query.trim().toLocaleLowerCase("uk-UA")));
  function selectSource(value: string) {
    const params = new URLSearchParams(search.toString()); if (value) params.set("source", value); else params.delete("source");
    const suffix = params.toString(); router.push(`${pathname}${suffix ? `?${suffix}` : ""}${window.location.hash}`, { scroll: false }); setVisible(12);
  }
  return <div className={cx("ku-container")}>
    {crumb([["Новини"]])}<section className={cx("ku-page-hero")}><div className={cx("ku-eyebrow")}>Офіційні джерела</div><h1 className={cx("ku-page-title")}>Новини КНУКіМ</h1><p className={cx("ku-page-intro")}>Короткі анонси університету та факультетів. Повні публікації відкриваються на сайтах джерел.</p></section>
    <section className={styles.newsPage}><SourceChips source={source} onChange={selectSource} /><label className={styles.search}>Пошук за заголовком<input type="search" value={query} placeholder="Що цікавить?" onChange={(event) => setQuery(event.target.value)} /></label><FallbackNote news={news} /><p className={styles.count} role="status">Новин: {filtered.length}</p>
      {filtered.length ? <><div className={styles.grid}>{filtered.slice(0, visible).map((item) => <NewsCard item={item} key={item.id} />)}</div>{filtered.length > visible && <button type="button" className={cx("ku-button")} onClick={() => setVisible((count) => count + 12)}>Показати ще</button>}</> : <div className={styles.empty}><h2>Новин за цими умовами немає</h2><p>{source ? "Це джерело може поки не мати публікацій. Обери інше джерело або зміни запит." : "Зміни запит, щоб побачити інші заголовки."}</p><button type="button" onClick={() => { setQuery(""); selectSource(""); }}>Скинути фільтри</button></div>}
    </section>
  </div>;
}

export function FacultyNews({ source, news }: { source?: NewsSource; news?: NewsResult }) {
  return <section className={cx("ku-section")}>
    {sectionHead("З офіційного джерела", "Новини факультету", <Link className={cx("ku-text-link")} href={source ? `/news?source=${source.key}` : "/news"}>Усі новини →</Link>)}
    {!source ? <p className={styles.fallback}>Для цього демо-факультету офіційне джерело не надано. Переглянь загальні новини університету.</p> : <><FallbackNote news={news!} />{news!.items.length ? <div className={styles.grid}>{news!.items.filter((item) => item.sourceId === source.key).slice(0, 3).map((item) => <NewsCard item={item} key={item.id} />)}</div> : <p className={styles.fallback}>Джерело «{source.name}» поки не має доступних публікацій.</p>}</>}
  </section>;
}
