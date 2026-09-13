"use strict";

const assert = require("node:assert/strict");
const { execFile, execFileSync } = require("node:child_process");
const { once } = require("node:events");
const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = require("node:fs");
const { createServer } = require("node:http");
const { tmpdir } = require("node:os");
const path = require("node:path");
const { promisify } = require("node:util");
const test = require("node:test");
const execute = promisify(execFile);

// Exercise the local/CI entry point, not a mock of the checker or its file selection.
test("partial and full checks preserve link scope and fail on broken links", async (t) => {
  const cwd = mkdtempSync(path.join(tmpdir(), "mastg-links-"));
  t.after(() => rmSync(cwd, { recursive: true, force: true }));
  const requests = [];
  const server = createServer((request, response) => {
    requests.push(request.url);
    response.writeHead(request.url === "/old" ? 404 : 200);
    response.end();
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  // 127.1 resolves to loopback but is not excluded by the existing 127.0.0.1 pattern.
  const url = `http://127.1:${server.address().port}`;
  const env = { ...process.env };
  // Neither caller Git state nor proxy settings should affect this isolated fixture.
  for (const key of Object.keys(env)) {
    if (key.startsWith("GIT_") || /proxy/i.test(key)) delete env[key];
  }
  const git = (...args) => execFileSync("git", args, { cwd, env, stdio: "pipe" });
  const write = (file, content) => writeFileSync(path.join(cwd, file), content);
  const run = (...args) => execute(process.execPath, [path.join(__dirname, "check_links.js"), ...args], { cwd, env });

  git("init");
  git("config", "user.name", "Link Check Test");
  git("config", "user.email", "link-check@example.invalid");
  git("config", "commit.gpgsign", "false");
  write("old.md", `[Old external link](${url}/old)\n[Local target](target.md)\n<img src="Images/fixture.png" />\n`);
  write("target.md", "Target\n");
  write("changed file.md", "Original\n");
  write("deleted.md", `[Deleted](${url}/deleted)\n`);
  mkdirSync(path.join(cwd, "Document/Images"), { recursive: true });
  write("Document/Images/fixture.png", "fixture");
  git("add", ".");
  git("commit", "-m", "Base fixture");
  git("update-ref", "refs/remotes/origin/master", "HEAD");

  write("changed file.md", `[Changed](${url}/changed)\n[Ignored](https://developer.android.com/nonexistent-fixture)\n`);
  write("untracked.md", `[Untracked](${url}/untracked)\n`);
  rmSync(path.join(cwd, "deleted.md"));
  mkdirSync(path.join(cwd, "node_modules"));
  write("node_modules/ignored.md", "[Missing](missing.md)\n");

  await run();
  assert.deepEqual(new Set(requests), new Set(["/changed", "/untracked"]));

  requests.length = 0;
  await assert.rejects(run("--all"), (error) => {
    assert.equal(error.code, 1);
    assert.ok(error.stderr.includes(`${url}/old`));
    return true;
  });
  assert.deepEqual(new Set(requests), new Set(["/old", "/changed", "/untracked"]));

  // A deletion must fail even when its incoming link is in an unchanged document.
  rmSync(path.join(cwd, "target.md"));
  requests.length = 0;
  await assert.rejects(run("--base", "HEAD"), (error) => {
    assert.equal(error.code, 1);
    assert.ok(error.stderr.includes("old.md"));
    assert.ok(error.stderr.includes("target.md"));
    return true;
  });
  assert.deepEqual(new Set(requests), new Set(["/changed", "/untracked"]));

  requests.length = 0;
  await assert.rejects(run("--base", "missing-ref"));
  await assert.rejects(run("--all", "--base", "HEAD"));
  assert.deepEqual(requests, []);
});
