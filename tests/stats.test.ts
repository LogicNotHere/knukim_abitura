import assert from "node:assert/strict";
import test from "node:test";
import { DATA } from "../lib/data";
import { filterStats, getProgramStats, getStats, getStatsTotals, rankStats, sortStats, statsNumber } from "../lib/stats";
import type { StatsRow } from "../lib/stats";

const row = (id: string, applications: number, budgetPlaces: number, passingScore: number, name = id, facultyId = "film"): StatsRow => ({ id, name, facultyId, faculty: facultyId, applications, budgetPlaces, passingScore, ratio: budgetPlaces ? applications / budgetPlaces : null, competitionOffers: 2, licensedPlaces: 50 });
const records = [row("a", 100, 10, 180, "Режисура кіно"), row("b", 90, 3, 160, "Музичне мистецтво", "music"), row("c", 80, 0, 190, "Режисура сцени", "stage")];

test("both years join every current program and totals use the same rows", () => {
  for (const year of [2025, 2026]) {
    const rows = getStats(year);
    assert.deepEqual(rows.map((entry) => entry.id).sort(), DATA.programs.map((program) => program.id).sort());
    assert.equal(new Set(rows.map((entry) => entry.id)).size, DATA.programs.length);
  }
  assert.deepEqual(getStatsTotals(records), { applications: 270, competitionOffers: 6, licensedPlaces: 150, budgetPlaces: 13 });
  assert.deepEqual(getProgramStats("film-directing"), getStats(2026).find((entry) => entry.id === "film-directing"));
});

test("each ranking metric has a different leader and stable ties", () => {
  assert.deepEqual(rankStats(records, "applications").map((entry) => entry.id), ["a", "b", "c"]);
  assert.deepEqual(rankStats(records, "ratio").map((entry) => entry.id), ["b", "a", "c"]);
  assert.deepEqual(rankStats(records, "passingScore").map((entry) => entry.id), ["c", "a", "b"]);
  assert.deepEqual(rankStats([row("z", 10, 1, 160), row("a", 10, 1, 160)], "applications", 1).map((entry) => entry.id), ["a"]);
  assert.equal(rankStats(getStats(), "applications").length, 5);
});

test("search and faculty filters intersect with Ukrainian case and whitespace", () => {
  assert.deepEqual(filterStats(records, "  РЕЖИСУРА  ", "film").map((entry) => entry.id), ["a"]);
  assert.deepEqual(filterStats(records, "режисура", "music"), []);
  assert.deepEqual(filterStats(records, "", "music").map((entry) => entry.id), ["b"]);
});

test("zero-budget ratios remain absent and sort last in both directions", () => {
  assert.equal(statsNumber(records[2].ratio), "—");
  assert.deepEqual(sortStats(records, "ratio", "asc").map((entry) => entry.id), ["a", "b", "c"]);
  assert.deepEqual(sortStats(records, "ratio", "desc").map((entry) => entry.id), ["b", "a", "c"]);
  assert.ok(getStats().filter((entry) => !entry.budgetPlaces).every((entry) => entry.ratio === null));
});
