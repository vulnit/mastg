# Repository Instructions

This is the official OWASP Mobile Application Security Testing Guide (MASTG) repository.

## Before You Start

Before contributing or reviewing content:

- **Read the relevant guidelines** for the type of content
- **Review existing examples** linked in each guideline document
- **Understand the structure** and required metadata for the content type
- **Test your content** (especially for demos and scripts) to ensure it works correctly
- If a pull request includes a demo validated on an emulator or simulator, state this explicitly in the pull request description.
- Use MASTG only to identify topics and candidate references. Don't treat MASTG content as evidence or stop the research there.
- Verify each technical claim against a current primary source, such as official platform, vendor, or standards documentation.
- If MASTG conflicts with or appears older than a primary source, warn the user and explain the discrepancy.
- Propose opening an issue. Don't update affected content or create the issue unless the user explicitly requests it.
- Treat repository schemas, tests, build scripts, and CI checks as authoritative for contribution requirements. If contributor guidance conflicts with them, follow the enforced behavior and prompt the user to report the discrepancy in an issue. Don't expand the task to resolve the conflict without explicit approval.

## Markdown

- Before editing Markdown, read `.markdownlint.jsonc` and `.markdownlint-cli2.jsonc` to understand the repository's enforced Markdown writing and formatting rules
- Read `.github/instructions/markdown.instructions.md` for contextual Markdown writing rules that can't be enforced automatically
- Use `npm ci` to install the pinned lint dependencies
- Run `npm run lint:markdown` to run the lint checks before creating a pull request or merging changes.

## Available Guidelines

The following writing guidelines are available:

### Core Content Types

- **[Tests](.github/instructions/mastg-test.instructions.md)** - Guidelines for writing security tests that validate MASWE weaknesses
- **[Demos](.github/instructions/mastg-demo.instructions.md)** - Guidelines for creating demonstrative examples with working code samples
- **[Knowledge](.github/instructions/mastg-knowledge.instructions.md)** - Guidelines for writing knowledge articles about mobile security concepts
- **[Techniques](.github/instructions/mastg-techniques.instructions.md)** - Guidelines for documenting security testing techniques
- **[Tools](.github/instructions/mastg-tools.instructions.md)** - Guidelines for documenting security testing tools
- **[Apps](.github/instructions/mastg-apps.instructions.md)** - Guidelines for documenting test applications
- **[Best Practices](.github/instructions/mastg-best-practice.instructions.md)** - Guidelines for writing security best practices and mitigations
- **[Rules](.github/instructions/mastg-rules.instructions.md)** - Guidelines for writing static analysis rules

### Scripts and Automation

- **[Frida Scripts](.agents/skills/mastg-demo-tooling/references/frida.md)** - Guidelines for writing Frida instrumentation scripts
- **[Frooky Hooks](.agents/skills/mastg-demo-tooling/references/frooky.md)** - Guidelines for writing Frooky hooks
- **[MITMProxy Scripts](.agents/skills/mastg-demo-tooling/references/mitmproxy.md)** - Guidelines for writing MITMProxy scripts for network analysis
- **[Radare2 Scripts](.agents/skills/mastg-demo-tooling/references/radare2.md)** - Guidelines for writing Radare2 scripts for reverse engineering

### General Guidelines

- **[Markdown](.github/instructions/markdown.instructions.md)** - General markdown formatting guidelines for MASTG content
- **[Porting MASTG v1 Tests to v2](.github/instructions/porting-mastg-v1-tests-to-v2.instructions.md)** - Guidelines for migrating MASTG V1 tests to the MASTG V2 format

## Content Quality Standards

You MUST ensure that the content follows the MASTG quality standards:

- **Accuracy**: Content must be technically correct and thoroughly tested
- **Completeness**: All required sections and metadata must be included
- **Clarity**: Writing should be clear, concise, and easy to understand
- **Reproducibility**: Examples, demos, and scripts must be reproducible
- **Relevance**: Content must be relevant to mobile application security testing
- **Maintenance**: Content should be maintainable and up-to-date with current mobile platforms

## Keep Links Updated

 ALWAYS look up official documentation for the topic to ensure it's updated. DO NOT make claims from trained documentation.

- Official Android documentation:
    - <https://developer.android.com>
    - <https://source.android.com/docs>
- Official iOS documentation:
    - <https://developer.apple.com/documentation>
    - <https://www.swift.org/documentation>

## Agent Skills

- Repository skills are stored under `.agents/skills/`
- Before you start a task, inspect the `name` and `description` fields in `.agents/skills/*/SKILL.md`
- If a skill matches the task, read its complete `SKILL.md` before you act and follow its instructions
- Treat `.agents/skills/` as the canonical skill location. Don't copy or install skills into harness-specific directories
