import { XMLParser, XMLValidator } from "fast-xml-parser";
import { DATA } from "./data";
import { NEWS_SOURCES } from "./socials";
import type { NewsSource } from "./socials";

export type NewsItem = {
  id: string;
  title: string;
  publishedAt: string;
  excerpt: string;
  sourceId: string;
  url: string;
  image?: string;
  demo: boolean;
};
export type SourceStatus = { sourceId: string; status: "ok" | "empty" | "error" };
export type NewsResult = { items: NewsItem[]; statuses: SourceStatus[]; demo: boolean };
type NewsFetch = (url: string, init: RequestInit & { next: { revalidate: number } }) => Promise<Response>;
type LoadOptions = { fetcher?: NewsFetch; timeoutMs?: number };
const maxBytes = 2_000_000;
const record = (value: unknown): Record<string, unknown> => value !== null && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {};
const list = (value: unknown): unknown[] => Array.isArray(value) ? value : value === undefined ? [] : [value];
const text = (value: unknown): string => typeof value === "string" ? value : typeof record(value)["#text"] === "string" ? record(value)["#text"] as string : "";

const entities: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“", hellip: "…", laquo: "«", raquo: "»", bull: "•", copy: "©" };
function plainText(value: unknown): string {
  const decoded = text(value).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name: string) => {
    if (!name.startsWith("#")) return entities[name.toLowerCase()] ?? whole;
    const code = name[1].toLowerCase() === "x" ? Number.parseInt(name.slice(2), 16) : Number(name.slice(1));
    return code > 0 && code <= 0x10ffff && !(code >= 0xd800 && code <= 0xdfff) ? String.fromCodePoint(code) : "";
  });
  return decoded.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, " ").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function normalizeNewsUrl(value: unknown, base?: string): string | undefined {
  if (typeof value !== "string" || !value.trim()) return undefined;
  try {
    const url = new URL(value, base);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || !(url.hostname === "knukim.edu.ua" || url.hostname.endsWith(".knukim.edu.ua"))) return undefined;
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) if (/^utm_/i.test(key) || ["fbclid", "gclid"].includes(key)) url.searchParams.delete(key);
    return url.href;
  } catch { return undefined; }
}

function itemFromFields(source: NewsSource, titleValue: unknown, dateValue: unknown, excerptValue: unknown, urlValue: unknown, imageValue: unknown): NewsItem | undefined {
  const title = plainText(titleValue);
  const url = normalizeNewsUrl(text(urlValue), source.feedUrl);
  const date = Date.parse(text(dateValue));
  if (!title || !url || !Number.isFinite(date)) return undefined;
  return { id: url, title, publishedAt: new Date(date).toISOString(), excerpt: Array.from(plainText(excerptValue)).slice(0, 200).join(""), url, sourceId: source.key, image: normalizeNewsUrl(text(imageValue), source.feedUrl), demo: false };
}

export function normalizeWordPress(payload: unknown, source: NewsSource): NewsItem[] {
  if (!Array.isArray(payload)) throw new Error("Invalid WordPress news response");
  return payload.flatMap((value) => {
    const post = record(value);
    const media = record(list(record(post._embedded)["wp:featuredmedia"])[0]);
    const rawDate = text(post.date_gmt) || text(post.date);
    const date = rawDate && !/(Z|[+-]\d{2}:?\d{2})$/i.test(rawDate) ? `${rawDate}Z` : rawDate;
    const item = itemFromFields(source, record(post.title).rendered, date, record(post.excerpt).rendered, post.link, media.source_url);
    return item ? [item] : [];
  });
}

export function normalizeRss(xml: string, source: NewsSource): NewsItem[] {
  if (new TextEncoder().encode(xml).length > maxBytes || /<!\s*(DOCTYPE|ENTITY)\b/i.test(xml)) throw new Error("Unsafe news XML");
  if (XMLValidator.validate(xml) !== true) throw new Error("Invalid news XML");
  const parser = new XMLParser({ processEntities: false, ignoreAttributes: false, attributeNamePrefix: "@_", parseTagValue: false, trimValues: true });
  const payload: unknown = parser.parse(xml);
  const root = record(payload);
  if (!Object.hasOwn(root, "rss")) throw new Error("Invalid RSS news response");
  const channel = record(record(root.rss).channel);
  return list(channel.item).flatMap((value) => {
    const item = record(value);
    const media = record(list(item["media:thumbnail"] ?? item["media:content"])[0]);
    const enclosure = record(item.enclosure);
    const image = media["@_url"] ?? (text(enclosure["@_type"]).startsWith("image/") ? enclosure["@_url"] : undefined);
    const normalized = itemFromFields(source, item.title, item.pubDate ?? item["dc:date"], item.description, item.link, image);
    return normalized ? [normalized] : [];
  });
}

export function mergeNews(items: readonly NewsItem[]): NewsItem[] {
  const sorted = [...items].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt) || a.id.localeCompare(b.id));
  const seen = new Set<string>();
  return sorted.filter((item) => { if (seen.has(item.url)) return false; seen.add(item.url); return true; });
}

async function responseText(response: Response): Promise<string> {
  if (!response.ok) throw new Error(`News HTTP ${response.status}`);
  if (Number(response.headers.get("content-length")) > maxBytes) throw new Error("News response too large");
  const reader = response.body?.getReader();
  if (!reader) return "";
  const decoder = new TextDecoder(); let size = 0; let result = "";
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBytes) { await reader.cancel(); throw new Error("News response too large"); }
      result += decoder.decode(value, { stream: true });
    }
    return result + decoder.decode();
  } finally { reader.releaseLock(); }
}

async function fetchEndpoint(url: string, controller: AbortController, fetcher: NewsFetch): Promise<string> {
  let current = normalizeNewsUrl(url);
  for (let hop = 0; hop <= 3; hop++) {
    if (!current || controller.signal.aborted) throw new Error("News request stopped");
    const response = await fetcher(current, { signal: controller.signal, redirect: "manual", next: { revalidate: 1800 }, headers: { Accept: "application/json, application/rss+xml, application/xml" } });
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (response.body) await response.body.cancel();
      current = location ? normalizeNewsUrl(location, current) : undefined;
    } else return responseText(response);
  }
  throw new Error("Too many news redirects");
}

export async function fetchSource(source: NewsSource, { fetcher = fetch, timeoutMs = 5000 }: LoadOptions = {}): Promise<{ items: NewsItem[]; status: SourceStatus }> {
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => { controller.abort(); reject(new Error("News source timeout")); }, timeoutMs);
  });
  const load = async () => {
    try {
      const payload: unknown = JSON.parse(await fetchEndpoint(source.wordpressUrl, controller, fetcher));
      const items = normalizeWordPress(payload, source);
      if (items.length) return items;
    } catch { if (controller.signal.aborted) throw new Error("News source timeout"); }
    const xml = await fetchEndpoint(source.feedUrl, controller, fetcher);
    return normalizeRss(xml, source);
  };
  try {
    const items = await Promise.race([load(), timeout]);
    return { items, status: { sourceId: source.key, status: items.length ? "ok" : "empty" } };
  } catch {
    return { items: [], status: { sourceId: source.key, status: "error" } };
  } finally { clearTimeout(timer); controller.abort(); }
}

export async function getNews(sourceId?: string, options: LoadOptions = {}): Promise<NewsResult> {
  const sources = sourceId ? NEWS_SOURCES.filter((source) => source.key === sourceId) : NEWS_SOURCES;
  const responses = await Promise.all(sources.map((source) => fetchSource(source, options)));
  const items = mergeNews(responses.flatMap((response) => response.items));
  const statuses = responses.map((response) => response.status);
  if (items.length || (sourceId && statuses[0]?.status === "empty")) return { items, statuses, demo: false };
  const fallback = DATA.demoNews.filter((item) => !sourceId || item.sourceId === sourceId).map((item) => ({
    ...item, url: NEWS_SOURCES.find((source) => source.key === item.sourceId)!.feedUrl.replace(/feed\/$/, ""), image: `/images/${item.image}.jpg`, demo: true,
  }));
  return { items: mergeNews(fallback), statuses, demo: true };
}
