import assert from "node:assert/strict";
import test from "node:test";
import { DATA } from "../lib/data";
import type { DemoEvent } from "../lib/data";
import { addDays, filterEvents, getCalendarDays, getDemoEvents, getHomeEvents, getToday } from "../lib/events";

const event = (id: string, date: string, time = "12:00", group = "applicants", category = "open"): DemoEvent => ({ ...DATA.events[0], id, date, time, group, category });

test("Kyiv day changes at local midnight across winter, summer and year boundaries", () => {
  assert.equal(getToday(new Date("2026-11-26T21:59:59Z")), "2026-11-26");
  assert.equal(getToday(new Date("2026-11-26T22:00:00Z")), "2026-11-27");
  assert.equal(getToday(new Date("2026-07-01T21:00:00Z")), "2026-07-02");
  assert.equal(getToday(new Date("2026-12-31T22:00:00Z")), "2027-01-01");
  assert.equal(getToday(new Date("2026-03-29T01:30:00Z")), "2026-03-29");
});

test("relative event dates keep calendar-day offsets through DST and year-end", () => {
  const seeds = [event("later", "2026-11-29"), event("today", "2026-11-26")];
  assert.deepEqual(getDemoEvents("2026-03-28", seeds).map((item) => [item.id, item.date]), [["today", "2026-03-28"], ["later", "2026-03-31"]]);
  assert.deepEqual(getDemoEvents("2026-12-30", seeds).map((item) => item.date), ["2026-12-30", "2027-01-02"]);
  assert.equal(addDays("2028-02-28", 1), "2028-02-29");
});

test("home highlights differ and do not invent a today's event", () => {
  const records = [event("b", "2026-11-26", "14:00"), event("a", "2026-11-26"), event("c", "2026-11-27")];
  const result = getHomeEvents(records, "2026-11-26");
  assert.equal(result.current?.id, "a"); assert.equal(result.next?.id, "b");
  const future = getHomeEvents(records.slice(2), "2026-11-26");
  assert.equal(future.current, undefined); assert.equal(future.next?.id, "c");
});

test("month cells start Monday and retain one leap day", () => {
  const november = getCalendarDays("2026-11-01");
  assert.equal(november[0], "2026-10-26"); assert.equal(november[6], "2026-11-01");
  const leap = getCalendarDays("2028-02-01");
  assert.equal(leap.filter((day) => day === "2028-02-29").length, 1);
  assert.equal(leap.length % 7, 0);
});

test("calendar filters intersect group and type", () => {
  const records = [event("a", "2026-11-26"), event("b", "2026-11-26", "12:00", "university"), event("c", "2026-11-26", "12:00", "applicants", "creative")];
  assert.deepEqual(filterEvents(records, "applicants", "open").map((item) => item.id), ["a"]);
  assert.deepEqual(filterEvents(records, "university", "creative"), []);
  assert.deepEqual(filterEvents(records, "ukraine"), []);
});

test("upcoming rows exclude past dates, order by time then ID and stop at five", () => {
  const records = [event("past", "2026-11-25"), event("z", "2026-11-26", "14:00"), event("b", "2026-11-26"), event("a", "2026-11-26"), ...[1, 2, 3, 4].map((day) => event(`future-${day}`, `2026-12-0${day}`))];
  assert.deepEqual(getHomeEvents(records, "2026-11-26").upcoming.map((item) => item.id), ["a", "b", "z", "future-1", "future-2"]);
});
