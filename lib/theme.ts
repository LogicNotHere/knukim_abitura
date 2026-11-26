export type ThemeId = "a" | "b" | "c";
export const themeStorageKey = "knukim-theme";

function canonicalTheme(value: unknown): ThemeId | undefined {
  if (value === "campus") return "b";
  return value === "a" || value === "b" || value === "c" ? value : undefined;
}

export function resolveTheme(urlValue: unknown, storedValue: unknown): ThemeId {
  return canonicalTheme(urlValue) ?? canonicalTheme(storedValue) ?? "a";
}

export function themeHref(href: string, theme: ThemeId): string {
  const url = new URL(href, "https://demo.invalid");
  url.searchParams.set("theme", theme);
  return `${url.pathname}?${url.searchParams.toString()}${url.hash}`;
}
