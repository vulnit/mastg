"use strict";

const assert = require("node:assert/strict");
const test = require("node:test");
const rules = require("./mas-markdown");

const invalidMarkdown = `---
title: Invalid fixture
related: [@MASTG-TEST-0001]
---

## Body

MASTG-TEST-0002

---

![Diagram](diagram.png)

<img width="80%" src="diagram.png" />

\`\`\`shell
$ echo invalid
\`\`\`

## References

- [Example](https://example.com)
`;

const validMarkdown = `---
title: Valid fixture
related: [MASTG-TEST-0001]
---

## Body

@MASTG-TEST-0002

<img src="diagram.png" width="80%" />

## References

- Example - <https://example.com>
`;

test("MASTG Markdown rules reject invalid structure", async () => {
  const { lint } = await import("markdownlint/promise");
  const { default: markdownIt } = await import("markdown-it");
  const lintText = (content) =>
    lint({
      strings: { "Document/0xfixture.md": content },
      config: { default: false, "MAS-LINT-009": true, "MAS-LINT-010": true, "MAS-LINT-011": true, "MAS-LINT-012": true, "MAS-LINT-013": true },
      customRules: rules,
      markdownItFactory: () => markdownIt({ html: true }),
    });

  const invalid = await lintText(invalidMarkdown);
  assert.deepEqual(
    new Set(invalid["Document/0xfixture.md"].map((error) => error.ruleNames[0])),
    new Set(["MAS-LINT-009", "MAS-LINT-010", "MAS-LINT-011", "MAS-LINT-012", "MAS-LINT-013"]),
  );

  const valid = await lintText(validMarkdown);
  assert.equal(valid["Document/0xfixture.md"].length, 0);
});
