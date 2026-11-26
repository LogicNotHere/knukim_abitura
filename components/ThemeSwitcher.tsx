"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { resolveTheme, themeHref, themeStorageKey } from "../lib/theme";
import type { ThemeId } from "../lib/theme";
import styles from "./ThemeSwitcher.module.css";

const themes: [ThemeId, string][] = [["a", "Офіційний"], ["b", "Campus"], ["c", "Editorial"]];

export function ThemeSwitcher() {
  const params = useSearchParams(); const pathname = usePathname(); const router = useRouter();
  const [current, setCurrent] = useState<ThemeId>("a");
  const requested = params.get("theme");
  useEffect(() => {
    let stored: string | null = null;
    try { stored = window.localStorage.getItem(themeStorageKey); } catch { /* URL selection works when storage is denied. */ }
    const next = resolveTheme(requested, stored);
    document.documentElement.dataset.theme = next; setCurrent(next);
    try { window.localStorage.setItem(themeStorageKey, next); } catch { /* URL selection works when storage is denied. */ }
  }, [requested, pathname]);
  function select(theme: ThemeId) {
    document.documentElement.dataset.theme = theme; setCurrent(theme);
    try { window.localStorage.setItem(themeStorageKey, theme); } catch { /* URL selection works when storage is denied. */ }
    router.push(themeHref(window.location.href, theme), { scroll: false });
  }
  if (params.get("demo") === "0") return null;
  return <aside className={styles.switcher} aria-label="Стиль сайту"><span>Стиль</span><div>{themes.map(([id, label]) => <button key={id} type="button" aria-pressed={current === id} onClick={() => select(id)}><b>{id.toUpperCase()}</b><span>{label}</span></button>)}</div></aside>;
}
