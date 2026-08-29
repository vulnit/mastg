# Repository Instructions

## Scope

This repository contains the OWASP Mobile Application Security Testing Guide (MASTG). Keep changes focused on mobile application security testing and the requested content.

## Content Boundaries

- Knowledge pages describe platform features and APIs without test criteria or remediation.
- Tests describe a security issue, the test steps, the expected observation, and the failure criteria.
- Best practices describe prevention and remediation.
- Techniques describe reusable testing procedures.
- Tool pages provide concise tool references. Put multi-step procedures in techniques and runnable examples in demos.
- Demos provide reproducible evidence for a test and include all demo-specific inputs and expected outputs.
- App pages describe reference applications.
- Rules contain reusable static analysis detections.

## Working Agreements

- Before you edit MASTG content, read the applicable file in `.github/instructions/` while those files remain in the repository.
- Treat the repository content and automation as authoritative when an instruction conflicts with the current implementation. Report the conflict before you expand the task.
- Add new tests under `tests-beta/`. Do not use legacy files under `tests/` as structural templates.
- Use `MASTG-<TYPE>-0xNN` placeholder IDs for new components. Start each component type at `0x01` within a pull request. Do not assign a four-digit decimal ID unless the operator explicitly requests it.
- In Markdown body text, prefix MASTG and MASWE references with `@`. In YAML front matter, use bare IDs without `@`.
- Do not edit `apps/index.md` or `tools/index.md`.
- Do not create related pages only because a link target is absent. Report the missing content unless the task requires the new page.
- Prefer official platform, vendor, and standards sources for technical claims. Verify current APIs and version-dependent behavior.
- For MASTG prose, use American English, active voice, short sentences, and direct instructions.
- Preserve unrelated user changes and keep each change within the requested scope.
