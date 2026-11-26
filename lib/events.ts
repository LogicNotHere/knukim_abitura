import { DATA } from "./data";
import type { DemoEvent } from "./data";

export type EventGroup = "applicants" | "university" | "ukraine";
export const eventGroups: Record<EventGroup, string> = {
  applicants: "Для вступників",
  university: "КНУКіМ",
  ukraine: "Україна",
};

const dayMs = 86_400_000;
const dateAt = (day: string) => new Date(`${day}T12:00:00.000Z`);
export const addDays = (day: string, days: number) =>
  new Date(dateAt(day).getTime() + days * dayMs).toISOString().slice(0, 10);

export function getToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Kyiv", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(now);
  return ["year", "month", "day"].map((type) => parts.find((part) => part.type === type)!.value).join("-");
}

export function getDemoEvents(
  today: string,
  seeds: readonly DemoEvent[] = DATA.events,
  anchor = DATA.meta.eventsAnchorDate,
): DemoEvent[] {
  return seeds.map((event) => ({
    ...event,
    date: addDays(today, Math.round((dateAt(event.date).getTime() - dateAt(anchor).getTime()) / dayMs)),
  })).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time) || a.id.localeCompare(b.id));
}

export function filterEvents(events: readonly DemoEvent[], group: EventGroup, category = "all") {
  return events.filter((event) => event.group === group && (category === "all" || event.category === category));
}

export function getHomeEvents(events: readonly DemoEvent[], today: string) {
  const upcoming = events.filter((event) => event.date >= today).sort((a, b) =>
    a.date.localeCompare(b.date) || a.time.localeCompare(b.time) || a.id.localeCompare(b.id));
  const current = upcoming.find((event) => event.date === today);
  return { current, next: upcoming.find((event) => event.id !== current?.id), upcoming: upcoming.slice(0, 5) };
}

export function getCalendarDays(month: string): string[] {
  const first = `${month.slice(0, 7)}-01`;
  const offset = (dateAt(first).getUTCDay() + 6) % 7;
  const nextMonth = new Date(dateAt(first));
  nextMonth.setUTCMonth(nextMonth.getUTCMonth() + 1);
  const count = Math.round((nextMonth.getTime() - dateAt(first).getTime()) / dayMs);
  const cells = Math.ceil((offset + count) / 7) * 7;
  return Array.from({ length: cells }, (_, index) => addDays(first, index - offset));
}

export function monthOffset(month: string, offset: number): string {
  const date = dateAt(`${month.slice(0, 7)}-01`);
  date.setUTCMonth(date.getUTCMonth() + offset);
  return date.toISOString().slice(0, 10);
}

export function dateLabel(day: string, options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long" }): string {
  return new Intl.DateTimeFormat("uk-UA", { ...options, timeZone: "UTC" }).format(dateAt(day));
}

export const eventDateLabel = (event: DemoEvent) => `${dateLabel(event.date, { day: "numeric", month: "long", year: "numeric" })}, ${event.time}`;
export const weekStart = (day: string) => addDays(day, -((dateAt(day).getUTCDay() + 6) % 7));
