import assert from "node:assert/strict";
import test from "node:test";
import { resolveTheme, themeHref } from "../lib/theme";

test("valid URL style wins, then valid storage, then official default", () => {
  assert.equal(resolveTheme("a", "c"), "a");
  assert.equal(resolveTheme("c", "b"), "c");
  assert.equal(resolveTheme(null, "b"), "b");
  assert.equal(resolveTheme("invalid", "c"), "c");
  assert.equal(resolveTheme(null, "broken"), "a");
  assert.equal(resolveTheme({}, []), "a");
});

test("campus links resolve to canonical Campus even against stored official style", () => {
  assert.equal(resolveTheme("campus", "a"), "b");
  assert.equal(resolveTheme(undefined, "campus"), "b");
  assert.equal(resolveTheme(undefined, undefined), "a");
});

test("theme links preserve view, source, demo, unrelated values and hash", () => {
  assert.equal(themeHref("/events?v=c&source=fmm&demo=0&keep=hello&theme=a#calendar", "b"), "/events?v=c&source=fmm&demo=0&keep=hello&theme=b#calendar");
  assert.equal(themeHref("https://local.test/news?source=fmm#latest", "c"), "/news?source=fmm&theme=c#latest");
});
