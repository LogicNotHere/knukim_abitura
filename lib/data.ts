import data from "../data/demo-data.json";

export const DATA = data;
export type Faculty = (typeof DATA.faculties)[number];
export type Department = (typeof DATA.departments)[number];
export type Program = (typeof DATA.programs)[number];
export type Course = (typeof DATA.courses)[number];
export type Teacher = (typeof DATA.teachers)[number];
export type DemoEvent = (typeof DATA.events)[number];

type Collection = Exclude<keyof typeof DATA, "meta">;

export function find<K extends Collection>(
  collection: K,
  id: string,
): (typeof DATA)[K][number] {
  const item = DATA[collection].find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown demo ${collection}: ${id}`);
  return item as (typeof DATA)[K][number];
}

export const money = (value: number) =>
  new Intl.NumberFormat("uk-UA").format(value);
export const levelLabel = (value: string) =>
  value === "master" ? "Магістратура" : "Бакалаврат";
export const formatLabel = (value: string) =>
  value === "part" ? "Заочна" : "Денна";
export const courseFormat = (value: string) =>
  value === "online" ? "Онлайн" : "Офлайн";

export const eventCategories: Record<string, string> = {
  all: "Усі події",
  open: "Дні відкритих дверей",
  consult: "Консультації",
  courses: "Підготовчі курси",
  creative: "Творчі конкурси",
};
