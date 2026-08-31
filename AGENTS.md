# Repository Instructions

This is the official OWASP Mobile Application Security Testing Guide (MASTG) repository.

## Before You Start

Before contributing content:

1. **Read the relevant guidelines** for the type of content you're writing
2. **Review existing examples** linked in each guideline document
3. **Understand the structure** and required metadata for your content type
4. **Test your content** (especially for demos and scripts) to ensure it works correctly.
5. **Follow the [Style Guide](https://mas.owasp.org/contributing/5_Style_Guide/)** for general writing and formatting conventions

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

## Contribution rules

- When creating or updating MASTG-DEMO files, you MUST NOT perform a Pull Request if the MASTG-DEMO has not been verified in a real device
- Treat the repository content and automation as authoritative when an instruction conflicts with the current implementation. Report the conflict before you expand the task

## Keep Links Updated

DO NOT make claims from trained documentation. ALWAYS look up official documentation for the topic to ensure it's updated

- Official Android documentation:
    - <https://developer.android.com/>
    - <https://source.android.com/docs>
- Official iOS documentation:
    - <https://developer.apple.com/documentation>
    - <https://www.swift.org/documentation/>

## Agent Skills

- Repository skills are stored under `.agents/skills/`
- Before you start a task, inspect the `name` and `description` fields in `.agents/skills/*/SKILL.md`
- If a skill matches the task, read its complete `SKILL.md` before you act and follow its instructions
- Treat `.agents/skills/` as the canonical skill location. Do not copy or install skills into harness-specific directories
