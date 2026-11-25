import assert from "node:assert/strict";
import { createRequire } from "node:module";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("local forms disable all native controls before hydration", async () => {
  const require = createRequire(__filename);
  const cssLoader = require.extensions[".css"];
  require.extensions[".css"] = (module) => {
    module.exports = {};
  };
  try {
    const { LocalForm } = await import("../components/Common");
    for (const kind of ["course", "question"] as const) {
      const markup = renderToStaticMarkup(
        createElement(LocalForm, {
          kind,
          children: [
            createElement("input", { key: "name", name: "name", required: true }),
            createElement("select", { key: "topic", name: "topic" }),
            createElement("textarea", { key: "question", name: "question" }),
            createElement("button", { key: "submit", type: "submit" }, "Submit"),
          ],
        }),
      );
      assert.match(
        markup,
        /^<form\b[^>]*><fieldset\b[^>]*\sdisabled=""[^>]*>.*<\/fieldset><\/form>$/,
      );
      assert.doesNotMatch(markup, /<legend\b/);
      assert.equal((markup.match(/<fieldset\b/g) ?? []).length, 1);
      for (const tag of ["input", "select", "textarea", "button"])
        assert.match(markup, new RegExp(`<${tag}\\b`));
    }
  } finally {
    if (cssLoader) require.extensions[".css"] = cssLoader;
    else delete require.extensions[".css"];
  }
});
