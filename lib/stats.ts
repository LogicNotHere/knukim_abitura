import statistics from "../data/stats.json";
import { DATA } from "./data";

export const STATS = statistics;
export type StatsMetric = "applications" | "ratio" | "passingScore";
export type StatsRow = {
  id: string;
  name: string;
  facultyId: string;
  faculty: string;
  applications: number;
  competitionOffers: number;
  licensedPlaces: number;
  budgetPlaces: number;
  passingScore: number;
  ratio: number | null;
};
export type StatsColumn = "name" | "faculty" | "applications" | "budgetPlaces" | "ratio" | "passingScore";

export function getStats(year = 2026): StatsRow[] {
  const record = statistics.years.find((entry) => entry.year === year)!;
  return record.rows.map((row) => {
    const program = DATA.programs.find((entry) => entry.id === row.programId)!;
    const faculty = DATA.faculties.find((entry) => entry.id === program.faculty)!;
    return { ...row, id: row.programId, name: program.name, facultyId: faculty.id, faculty: faculty.name, ratio: row.budgetPlaces === 0 ? null : row.applications / row.budgetPlaces };
  });
}

export function getStatsTotals(rows: readonly StatsRow[]) {
  return rows.reduce((sum, row) => ({
    applications: sum.applications + row.applications,
    competitionOffers: sum.competitionOffers + row.competitionOffers,
    licensedPlaces: sum.licensedPlaces + row.licensedPlaces,
    budgetPlaces: sum.budgetPlaces + row.budgetPlaces,
  }), { applications: 0, competitionOffers: 0, licensedPlaces: 0, budgetPlaces: 0 });
}

export function sortStats(rows: readonly StatsRow[], column: StatsColumn, direction: "asc" | "desc") {
  return [...rows].sort((a, b) => {
    const left = a[column]; const right = b[column];
    if (left === null) return right === null ? a.id.localeCompare(b.id) : 1;
    if (right === null) return -1;
    const order = typeof left === "string" && typeof right === "string" ? left.localeCompare(right, "uk-UA") : Number(left) - Number(right);
    return order * (direction === "asc" ? 1 : -1) || a.id.localeCompare(b.id);
  });
}

export const rankStats = (rows: readonly StatsRow[], metric: StatsMetric, limit = 5) => sortStats(rows, metric, "desc").slice(0, limit);
export function filterStats(rows: readonly StatsRow[], query: string, facultyId: string) {
  const search = query.trim().toLocaleLowerCase("uk-UA");
  return rows.filter((row) => (!facultyId || row.facultyId === facultyId) && row.name.toLocaleLowerCase("uk-UA").includes(search));
}
export const getProgramStats = (id: string) => getStats(2026).find((row) => row.id === id);
export const statsNumber = (value: number | null, decimals = 0) => value === null ? "—" : new Intl.NumberFormat("uk-UA", { maximumFractionDigits: decimals }).format(value);
