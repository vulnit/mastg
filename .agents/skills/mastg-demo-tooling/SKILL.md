---
name: mastg-demo-tooling
description: Create, update, or review MASTG demo analysis artifacts that use Frida, Frooky, mitmproxy, or radare2. Use for JavaScript hooks, Frooky hook JSON, mitmproxy addons, r2 command files, and their run.sh integration. Do not use for MASTG tool catalog pages or general installation documentation.
---

# MASTG Demo Tooling

Before you make changes, inspect the demo Markdown file, its `run.sh`, the target artifact, and similar working demos.

Read the general demo instructions in `.github/instructions/mastg-demo.instructions.md`. Then read only the references for the tools that the task uses:

- Frida JavaScript: [references/frida.md](references/frida.md)
- Frooky hook configuration: [references/frooky.md](references/frooky.md)
- mitmproxy addon: [references/mitmproxy.md](references/mitmproxy.md)
- radare2 command file: [references/radare2.md](references/radare2.md)

If a demo uses more than one of these tools, read each applicable reference.
