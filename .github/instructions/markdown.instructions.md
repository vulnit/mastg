---
name: 'Style and Formatting for MASTG Markdown Files'
applyTo: '**/*.md'
---

Use the following guidance for decisions that require editorial or technical context.

## Formatting and Structure

- **Headings**: Recommend restructuring when content includes H4 headings, and make a stronger recommendation for H5 headings.
- **Links**: Use descriptive link text.

## Images

- Store images in the appropriate directory, such as `Document/Images/Chapters` for MASTG chapters.
- Provide descriptive context for images in the surrounding text when it improves accessibility.

## External References

### Web Links

Use Markdown inline link format:

- `[TEXT](URL "TITLE")`, or
- `[TEXT](URL)`.

If you use the optional title form, escape special characters inside the title, especially apostrophes and backticks, to avoid broken rendering.

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

Use MkDocs admonition comments to annotate special content:

```markdown
!!! note "Note Title"
    Note body text.
```

or

```markdown
??? info "Info Title"
    Info body text.
```

See [MkDocs admonitions documentation](https://squidfunk.github.io/mkdocs-material/reference/admonitions/) for details.

## Code and Shell Commands

When a command includes parameters the reader must change, surround them with angle brackets:

```shell
adb pull <remote_file> <target_destination>
```

## In-Text Keywords

When not in a code block:

- Use backticks for code identifiers, such as function names, class names, command names, and file paths.
- Use straight double quotes for human-readable names, such as section titles, chapter titles, and menu items.
- Don't add parentheses or other punctuation inside backticks. For example, write `main`, not `main()`.

If a noun in backticks is plural, place the "s" outside the backticks. For example, write `RuntimeException`s.

## Navigation

When referring to a UI element by name, put its name in boldface, using `**<name>**`, for example, **Home** -> **Menu**.
