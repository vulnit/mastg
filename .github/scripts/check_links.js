"use strict";

const { execFileSync } = require("node:child_process");
const { readdirSync, readFileSync } = require("node:fs");
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const { parseArgs, promisify } = require("node:util");
const checkMarkdown = promisify(require("markdown-link-check"));

function git(...args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

function markdownFiles(directory = ".") {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    // Match the existing action's full scan, not Markdownlint's narrower ignores.
    if (file === "node_modules") continue;
    if (entry.isDirectory()) files.push(...markdownFiles(file));
    else if (entry.isFile() && file.endsWith(".md")) files.push(file);
  }
  return files.sort();
}

function changedMarkdown(base, allFiles) {
  // Validate the base explicitly: a missing ref must not become a passing empty scan.
  const ref = git("rev-parse", "--verify", "--end-of-options", `${base}^{commit}`).trim();
  const changed = git("diff", "--name-only", "--diff-filter=AM", "-z", ref, "--", "*.md");
  // Include new local drafts before git add; CI normally has no untracked Markdown.
  const untracked = git("ls-files", "--others", "--exclude-standard", "-z", "--", "*.md");
  const selected = new Set((changed + untracked).split("\0"));
  return allFiles.filter((file) => selected.has(file));
}

async function checkFiles(files, configName, label) {
  const configPath = path.join(__dirname, "../workflows/config", configName);
  const config = JSON.parse(readFileSync(configPath, "utf8"));
  const projectBaseUrl = pathToFileURL(process.cwd()).href;
  let failures = 0;
  console.log(`${label}: checking ${files.length} Markdown files`);
  for (const file of files) {
    try {
      const results = await checkMarkdown(readFileSync(file, "utf8"), {
        ...structuredClone(config),
        baseUrl: pathToFileURL(path.dirname(path.resolve(file)) + path.sep).href,
        projectBaseUrl,
      });
      for (const result of results) {
        if (result.status === "alive" || result.status === "ignored") continue;
        failures++;
        console.error(`${file}: ${result.status}: ${result.link} (status ${result.statusCode})`);
        if (result.err) console.error(result.err.message);
      }
    } catch (error) {
      failures++;
      console.error(`${file}: ${error.message}`);
    }
  }
  console.log(`${label}: ${failures} failures`);
  return failures;
}

async function main() {
  const { values } = parseArgs({
    options: { all: { type: "boolean" }, base: { type: "string" } },
  });
  if (values.all && values.base !== undefined) {
    throw new Error("Use either --all or --base <ref>, not both.");
  }
  process.chdir(git("rev-parse", "--show-toplevel").trim());
  const allFiles = markdownFiles();
  const base = values.base ?? "origin/master";
  const generalFiles = values.all ? allFiles : changedMarkdown(base, allFiles);
  console.log(values.all ? "Link check: full" : `Link check: partial, compared with ${base}`);

  // Keep both existing configurations unchanged, including their overlapping coverage.
  // Scan all internal links even in partial mode to detect references to deleted files.
  let failures = await checkFiles(allFiles, "internal-links-config.json", "Internal links");
  failures += await checkFiles(generalFiles, "url-checker-config.json", "General links");
  process.exitCode = failures ? 1 : 0;
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
