---
name: 'Style and Formatting for MASTG Markdown Files'
applyTo: '**/*.md'
---

## Formatting and Structure

Follow these guidelines for formatting and structuring your Markdown content:

- **Headings**: Do not use an H1 heading. The page title generates it. Use `##` for H2 and `###` for H3. Ensure that headings are used hierarchically. Recommend restructuring if the content includes H4, and more strongly recommend for H5.
- **Lists**: Use `-` for bullet points and `1.` for numbered lists. Indent nested lists with four spaces to match the linter configuration. Prefer dashes `-` over asterisks `*` for unordered lists.
- **Code Blocks**: Use triple backticks to create fenced code blocks. Specify the language after the opening backticks for syntax highlighting (e.g., kt, java, xml).
- **Links**: Ensure the link text is descriptive and the URL is valid.
- **Tables**: Use `|` to create tables. Ensure that columns are properly aligned and headers are included.
    - Include leading and trailing pipes to conform to the linter setting (MD055: `leading_and_trailing`).
- **Line Length**: There is no enforced hard limit.
- **Whitespace**: Use blank lines to separate sections and improve readability. Avoid excessive whitespace.

### In-project Identifiers

Use special identifiers to reference project components consistently:

- Tests: `@MASTG-TEST-0001`
- Tools: `@MASTG-TOOL-0034`
- Similar patterns may exist for other entities (e.g., best practices, techniques) following `@MASTG-<KIND>-NNNN`.
- Weaknesses: `@MASWE-0023` (this one is an exception to the usual pattern)

Usage rules:

- In body text (Markdown content), include the leading `@` when referencing an item.
- In YAML front matter, omit the `@` and use the bare identifier (e.g., `MASTG-TEST-0001`).

Examples:

```markdown
You can validate this with @MASTG-TEST-0001 and compare results using @MASTG-TOOL-0034.
```

```yaml
weakness: MASWE-0069
best-practices: [MASTG-BEST-0010, MASTG-BEST-0011, MASTG-BEST-0012]
```

### Punctuation and Typographic Conventions

- Avoid horizontal rules (`---`) to separate sections (`---` is still required for YAML front matter delimiters).
- Emphasis/strong style: underscores for emphasis (`_text_`), asterisks for strong (`**text**`).
- Trailing punctuation allowed in headings (MD026) is limited to: `.,;:`

### Lint-Friendly Whitespace and Quotes

The repository linting rules enforce a few extra constraints:

- Do not use curly quotes.
- Do not use no-break spaces.
- Avoid trailing spaces.
- Avoid double spaces in prose.

## Images

For MASTG chapters and related content, always embed pictures using an HTML `<img>` element rather than Markdown image syntax:

- Put `src` as the first attribute.
- Optionally specify a `width` (e.g., `width="80%"`).
- Store images in the appropriate directory (e.g., `Document/Images/Chapters` for MASTG chapters).
- Inline HTML is permitted; the linter rule MD033 is disabled to allow this.

Example:

```markdown
<img src="Images/Chapters/0x05b/r2_pd_10.png" width="80%" />
```

Note: The linter does not require alt text for images (MD045 is disabled); however, including descriptive context in the surrounding text is helpful for accessibility.

## External References

### Web Links

Use Markdown inline link format:

- `[TEXT](URL "TITLE")`, or
- `[TEXT](URL)`.

If you use the optional title form, escape special characters inside the title (especially apostrophes and backticks) to avoid broken rendering.

### References Section Links

When adding links to a **"References"** section at the end of a chapter in `Document/0x*.md`, use the format `- Title - <url>`. This helps LaTeX print URLs correctly in the PDF.

Example:

```markdown
- adb - <https://developer.android.com/studio/command-line/adb>
```

### Books and Papers

For books and papers, cite using the format `[#NAME]`, then add the full reference under a **"References"** section.

Example:

```markdown
An obfuscated encryption algorithm can generate its key (or part of the key)
using data collected from the environment [#riordan].

## References

- [#riordan] - James Riordan, Bruce Schneier. Environmental Key Generation towards Clueless Agents. Mobile Agents and Security, Springer Verlag, 1998
```

## References Within the Guide

Use internal references sparingly.

- When possible, name the chapter or section in prose.
- If you need a deep link, link directly to the target section and use a lowercase, hyphenated anchor.

Example:

```markdown
See the section "[App Bundles](0x05a-Platform-Overview.md#app-bundles)" in the chapter "Platform Overview".
```

## Comments

Use mkdocs admonition comments to annotate special content:

```markdown
!!! note "Note Title"
    Note body text.
```

or

```markdown
??? info "Info Title"
    Info body text.
```

See [mkdocs admonitions documentation](https://squidfunk.github.io/mkdocs-material/reference/admonitions/) for details.

## Code and Shell Commands

- Use fenced code blocks for sample code, shell commands, and paths.
- Specify the language for syntax highlighting when possible.
- For shell commands, do not include prompts (host name, username, etc.).

Example:

````markdown
```shell
echo 'Hello World'
```
````

When a command includes parameters the reader must change, surround them with angle brackets:

```shell
adb pull <remote_file> <target_destination>
```

Do not prepend dollar signs (`$`) or other prompt characters to shell commands.

## In-Text Keywords

When not in a code block:

- Use backticks for code identifiers (for example, function names, class names, command names, file paths).
- Use straight double quotes for human-readable names (for example, section titles, chapter titles, menu items).
- Do not add parentheses or other punctuation inside backticks (for example, write `main`, not `main()`).

If a noun in backticks is plural, place the "s" outside the backticks (for example, `RuntimeException`s).

## Navigation

When referring to any UI element by name, put its name in boldface, using `**<name>**` (e.g., **Home** -> **Menu**).
