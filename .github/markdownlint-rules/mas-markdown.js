"use strict";

const projectIdentifier = /(?<![@\w/.-])(?:MASTG-(?:APP|BEST|DEMO|KNOW|RULE|TECH|TEST|TOOL)-\d{4}|MASWE-\d{4})\b(?![/.-])/g;
const frontMatterIdentifier = /@(?:MASTG-(?:APP|BEST|DEMO|KNOW|RULE|TECH|TEST|TOOL)-\d{4}|MASWE-\d{4})\b/g;

const forEachInlineText = (tokens, callback) => {
  for (const token of tokens) {
    if (token.type !== "inline" || !token.children) continue;

    let lineNumber = token.lineNumber;
    for (const child of token.children) {
      if (child.type === "text") callback(child.content, lineNumber);
      if (child.type === "softbreak" || child.type === "hardbreak") lineNumber++;
    }
  }
};

/** @type {import("markdownlint").Rule[]} */
module.exports = [
  {
    names: ["MAS-LINT-009"],
    description: "Do not use horizontal rules",
    tags: ["mastg", "structure"],
    parser: "markdownit",
    function: (params, onError) => {
      for (const token of params.parsers.markdownit.tokens) {
        if (token.type === "hr") {
          onError({
            lineNumber: token.lineNumber,
            context: token.line,
          });
        }
      }
    },
  },
  {
    names: ["MAS-LINT-010"],
    description: "Use HTML images with src as the first attribute",
    tags: ["mastg", "images"],
    parser: "markdownit",
    function: (params, onError) => {
      if (!params.frontMatterLines.length) return;

      for (const token of params.parsers.markdownit.tokens) {
        if (token.type === "inline" && token.children) {
          for (const child of token.children) {
            if (child.type === "image") {
              onError({
                lineNumber: token.lineNumber,
                detail: "Replace Markdown image syntax with an HTML <img> element.",
                context: token.line,
              });
            }
          }
        }

        if (token.type !== "html_inline" && token.type !== "html_block") continue;
        for (const match of token.content.matchAll(/<img\s+([^>]+)>/gi)) {
          if (!/^src\s*=/i.test(match[1])) {
            onError({
              lineNumber: token.lineNumber,
              detail: "Put src before the other <img> attributes.",
              context: match[0],
            });
          }
        }
      }
    },
  },
  {
    names: ["MAS-LINT-011"],
    description: "Use @ with project identifiers in body text and omit it in front matter",
    tags: ["mastg", "identifiers"],
    parser: "markdownit",
    function: (params, onError) => {
      for (const [index, line] of params.frontMatterLines.entries()) {
        for (const match of line.matchAll(frontMatterIdentifier)) {
          onError({
            lineNumber: 1,
            detail: `Front matter line ${index + 1}: remove @ from project identifiers.`,
            context: match[0],
          });
        }
      }

      forEachInlineText(params.parsers.markdownit.tokens, (text, lineNumber) => {
        for (const match of text.matchAll(projectIdentifier)) {
          onError({
            lineNumber,
            detail: "Add @ before project identifiers in Markdown body text.",
            context: match[0],
          });
        }
      });
    },
  },
  {
    names: ["MAS-LINT-012"],
    description: "Format chapter reference links for printable URLs",
    tags: ["mastg", "references"],
    parser: "none",
    function: (params, onError) => {
      if (!/(?:^|\/)Document\/0x[^/]+\.md$/.test(params.name)) return;

      let inReferences = false;
      for (const [index, line] of params.lines.entries()) {
        if (line === "## References") {
          inReferences = true;
          continue;
        }
        if (inReferences && line.startsWith("## ")) inReferences = false;
        if (
          inReferences &&
          /^- .*https?:\/\//.test(line) &&
          !/^- .+ - <https?:\/\/[^>]+>$/.test(line)
        ) {
          onError({
            lineNumber: index + 1,
            detail: "Use '- Title - <URL>' for links in chapter References sections.",
            context: line,
          });
        }
      }
    },
  },
  {
    names: ["MAS-LINT-013"],
    description: "Omit dollar-sign prompts from shell command blocks",
    tags: ["mastg", "code"],
    parser: "markdownit",
    function: (params, onError) => {
      for (const token of params.parsers.markdownit.tokens) {
        if (token.type !== "fence" || !/^(?:bash|shell|sh|zsh)(?:\s|$)/i.test(token.info)) continue;

        for (const [index, line] of token.content.split("\n").entries()) {
          if (!/^\s*\$\s+/.test(line)) continue;

          const lineNumber = token.lineNumber + index + 1;
          const sourceLine = params.lines[lineNumber - 1];
          const match = /^(\s*)\$\s+/.exec(sourceLine);
          if (!match) continue;
          onError({
            lineNumber,
            context: sourceLine,
            fixInfo: {
              editColumn: match[1].length + 1,
              deleteCount: match[0].length - match[1].length,
            },
          });
        }
      }
    },
  },
];
