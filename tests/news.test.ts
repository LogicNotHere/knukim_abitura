import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import wordpress from "./fixtures/news-wordpress.json";
import { fetchSource, getNews, mergeNews, normalizeNewsUrl, normalizeRss, normalizeWordPress } from "../lib/news";
import { NEWS_SOURCES, sourceForFaculty, socialsForFaculty } from "../lib/socials";

const university = NEWS_SOURCES[0];
const rss = readFileSync(new URL("./fixtures/news-rss.xml", import.meta.url), "utf8");
const emptyRss = "<rss><channel><title>Empty</title></channel></rss>";

test("WordPress fields become plain text, canonical links and explicit UTC dates", () => {
  const items = normalizeWordPress(wordpress, university);
  assert.equal(items.length, 1);
  assert.deepEqual(items[0], { id: "https://knukim.edu.ua/story/", url: "https://knukim.edu.ua/story/", sourceId: "university", title: "Творча & відкрита A", excerpt: "Перша новина . Друга думка.", publishedAt: "2026-11-26T10:15:00.000Z", image: "https://fkitb.knukim.edu.ua/image.jpg", demo: false });
  const long = normalizeWordPress([{ ...wordpress[0], excerpt: { rendered: "а".repeat(240) }, _embedded: { "wp:featuredmedia": [{ source_url: "data:image/png;base64,evil" }] } }], university)[0];
  assert.equal(long.excerpt, "а".repeat(200)); assert.equal(long.image, undefined);
});

test("RSS supports singleton/array items, CDATA, namespaced thumbnails and absent media", () => {
  const items = normalizeRss(rss, NEWS_SOURCES[2]);
  assert.deepEqual(items.map((item) => [item.title, item.excerpt, item.url, item.publishedAt, item.image]), [["Майстерня & ідеї", "Короткий анонс.", "https://www.design.knukim.edu.ua/workshop/", "2026-11-26T11:00:00.000Z", "https://www.design.knukim.edu.ua/workshop.jpg"]]);
  const extra = rss.replace("</channel>", "<item><title>Друга</title><link>https://knukim.edu.ua/second/</link><pubDate>Wed, 25 Nov 2026 10:00:00 GMT</pubDate></item><item><title>Без дати</title></item></channel>");
  const result = normalizeRss(extra, university);
  assert.equal(result.length, 2); assert.equal(result[1].image, undefined);
});

test("RSS rejects malformed XML, DTD/entity declarations and oversized input", () => {
  assert.throws(() => normalizeRss("<rss><channel></rss>", university), /Invalid news XML/);
  assert.throws(() => normalizeRss('<!DOCTYPE rss [<!ENTITY x "boom">]><rss><channel /></rss>', university), /Unsafe news XML/);
  assert.throws(() => normalizeRss(" ".repeat(2_000_001), university), /Unsafe news XML/);
});

test("merged news keeps the newest canonical article once with stable order", () => {
  const first = normalizeWordPress(wordpress, university)[0];
  const second = normalizeRss(rss, NEWS_SOURCES[2])[0];
  const newer = { ...first, publishedAt: "2026-11-27T10:00:00.000Z" };
  assert.deepEqual(mergeNews([first, second, newer]).map((item) => [item.url, item.publishedAt]), [["https://knukim.edu.ua/story/", "2026-11-27T10:00:00.000Z"], ["https://www.design.knukim.edu.ua/workshop/", "2026-11-26T11:00:00.000Z"]]);
});

test("source failures are isolated and a valid empty source stays empty", async () => {
  const result = await getNews(undefined, { fetcher: async (url) => {
    const host = new URL(url).hostname;
    if (host === "knukim.edu.ua") return Response.json(wordpress);
    if (host === "ftke.knukim.edu.ua") return url.includes("wp-json") ? Response.json([]) : new Response(emptyRss);
    if (host === "design.knukim.edu.ua") return new Response("broken");
    return new Response("Unavailable", { status: 503 });
  } });
  assert.equal(result.demo, false); assert.equal(result.items.length, 1);
  assert.equal(result.statuses.find((entry) => entry.sourceId === "ftke")?.status, "empty");
  assert.equal(result.statuses.find((entry) => entry.sourceId === "design")?.status, "error");
  assert.equal(result.statuses.find((entry) => entry.sourceId === "ikitb")?.status, "error");
  const faculty = await getNews("ftke", { fetcher: async (url) => url.includes("wp-json") ? Response.json([]) : new Response(emptyRss) });
  assert.equal(faculty.demo, false); assert.deepEqual(faculty.items, []);
});

test("quick WordPress failure uses RSS with the same deadline and cache policy", async () => {
  const signals: AbortSignal[] = [];
  const result = await fetchSource(university, { fetcher: async (url, init) => {
    assert.deepEqual(init.next, { revalidate: 1800 }); signals.push(init.signal!);
    return url.includes("wp-json") ? new Response("error", { status: 502 }) : new Response(rss);
  } });
  assert.equal(result.status.status, "ok"); assert.equal(signals.length, 2); assert.equal(signals[0], signals[1]);
});

test("all hanging sources abort and settle with clearly marked local fallback", async () => {
  let aborted = 0;
  const result = await getNews(undefined, { timeoutMs: 20, fetcher: (_url, init) => new Promise((_resolve, reject) => {
    init.signal!.addEventListener("abort", () => { aborted++; reject(new Error("aborted")); }, { once: true });
  }) });
  assert.equal(aborted, 8); assert.equal(result.demo, true); assert.equal(result.items.length, 8);
  assert.ok(result.items.every((item) => item.demo && item.url.endsWith("/") && !item.url.includes("demo-news")));
  assert.ok(result.statuses.every((entry) => entry.status === "error"));
  const faculty = await getNews("ikitb", { fetcher: async () => { throw new Error("offline"); } });
  assert.equal(faculty.items.length, 1); assert.equal(faculty.items[0].sourceId, "ikitb"); assert.equal(faculty.items[0].demo, true);
});

test("URL boundary accepts moved official hosts and rejects credentials and suffix lookalikes", () => {
  for (const host of ["knukim.edu.ua", "fkitb.knukim.edu.ua", "www.design.knukim.edu.ua", "fmiki.knukim.edu.ua"]) assert.equal(normalizeNewsUrl(`https://${host}/story/`), `https://${host}/story/`);
  for (const url of ["https://knukim.edu.ua.evil.test/story", "https://evilknukim.edu.ua/story", "https://user:pass@knukim.edu.ua/story", "javascript:alert(1)", "data:text/html,hi"]) assert.equal(normalizeNewsUrl(url), undefined);
});

test("untrusted redirect is never fetched and redirects stop after three hops", async () => {
  const requested: string[] = [];
  const result = await fetchSource(university, { fetcher: async (url) => { requested.push(url); return new Response(null, { status: 302, headers: { location: "https://outside.example/story" } }); } });
  assert.equal(result.status.status, "error"); assert.equal(requested.length, 2);
  assert.ok(requested.every((url) => new URL(url).hostname === "knukim.edu.ua"));
  let calls = 0;
  await fetchSource(university, { fetcher: async () => { calls++; return new Response(null, { status: 302, headers: { location: "https://knukim.edu.ua/redirect/" } }); } });
  assert.equal(calls, 8);
});

test("faculty mapping uses the supplied source and leaves tourism unmapped", () => {
  for (const [faculty, source] of [["film", "ikitb"], ["design", "design"], ["media", "fzgij"], ["music", "fmm"], ["dance", "dance"], ["management", "fimfshb"], ["stage", "ftke"]]) {
    assert.equal(sourceForFaculty(faculty)?.key, source); assert.equal(socialsForFaculty(faculty)?.key, source);
  }
  assert.equal(sourceForFaculty("tourism"), undefined); assert.equal(socialsForFaculty("tourism"), undefined);
});
