---
name: technical-writing
description: Write or rewrite clear technical text. Use by default for technical explanations to users, GitHub issues, pull request descriptions, documentation, release notes, tool descriptions, error messages, prompts, agent instructions, and reports.
---

## Rules

1. State the main point first.
2. Use active voice when the actor is known.
3. Address the reader directly in the second person ("you").
4. Give one instruction per sentence.
5. Use one term for each concept. Repeat that term when it helps connect sentences.
6. State actors, conditions, and results explicitly.
7. Use verbs instead of noun forms of actions.
8. Use short sentences.
9. Use one topic per paragraph.
10. Use a list for three or more related items or steps.
11. Remove words that do not change the meaning.
12. Keep technical terms that improve precision.
13. Define an uncommon technical term when the reader needs the definition.
14. Do not use semicolons.
15. For English instructions, use no more than 20 words per sentence when possible.
16. For English descriptions, use no more than 25 words per sentence when possible.
17. Keep a longer sentence when a shorter sentence would remove necessary precision.
18. Write for an international audience with a basic technical background. Avoid hard-to-translate slang.
19. Use transition words only when they clarify cause, contrast, sequence, or result.
20. Use parallel grammatical structures for related steps, alternatives, and comparisons.
21. Replace ambiguous pronouns and back-references with a specific noun.
22. Use gender-neutral language. Prefer role nouns, plural nouns, or "they" when a person's gender is unknown or irrelevant.
23. Use American spelling and terminology.
24. Use Chicago-style title capitalization. Capitalize the first and last words, nouns, pronouns, verbs, adjectives, adverbs, and subordinating conjunctions. Lowercase articles, prepositions, and coordinating conjunctions elsewhere.
25. Spell out zero through ten. Use numerals for numbers greater than ten.
26. Write Android versions as "Android X (API level YY)". Do not use codenames.
27. Prefer common contractions when they improve readability.
28. Spell out a term before its abbreviation on first use in body text. If it first appears in a heading, define it in the following text. Do not abbreviate a term used only once.
29. Write format names such as APK, IPA, or ZIP without a leading dot unless referring to the file extension.
30. Use descriptive headings that state the section's subject.
31. Keep each page focused. Move extensive supporting details to a linked page.
32. Keep lists to nine items and no more than two nesting levels when practical. Punctuate and capitalize list items consistently.
33. Use the serial comma.
34. Use commas or parentheses instead of em dashes or en dashes.
35. Spell branded and platform-specific terms as their official sources spell them.

## Project Terminology

| Noun Form | Adjectival Form |
| --- | --- |
| App Store | NA |
| backend | backend |
| Base64 | Base64- |
| black box | _same_ |
| Bundle ID | NA |
| bytecode | NA |
| client side | client-side |
| codebase | _same_ |
| code signing | _same_ |
| command line | _same_ |
| disassembler | NA |
| end users | NA |
| file name | _same_ |
| macOS | NA |
| OS X | NA |
| pentest | _same_ |
| PhoneGap | NA |
| Python | NA |
| repackage | NA |
| runtime | _same_ |
| server side | server-side |
| snapshot length | NA |
| use case | _same_ |
| Wi-Fi | _same_ |
| white box | _same_ |

## Preserve uncertainty

Do not change uncertain information into a fact. Keep words such as `may`, `might`, `can`, `could`, `likely`, and `sometimes` ONLY when they carry necessary meaning. Do not add certainty that the available evidence does not support.

## Remove AI writing patterns

Remove:

- introductions that only announce the answer;
- conclusions that repeat the answer;
- unnecessary headings;
- repeated points;
- rhetorical questions;
- fake quotations;
- filler transitions;
- marketing adjectives;
- vague quality claims;
- synonym rotation;
- hedge stacking;
- nominalized actions;
- long parenthetical comments;
- phrases such as `it is important to note`;
- phrases such as `it is worth mentioning`;
- phrases such as `in order to`;
- phrases such as `due to the fact that`.

Keep a heading when it helps the reader navigate a long document.

## Timeliness

When you include statistical data:

- Use current information.
- Cite the source.
- Include the date the data was consulted.

## New technical text

1. Identify the required purpose and audience.
2. Use only facts from the available context.
3. Mark missing or uncertain information clearly.
4. Organize the text around the reader's required action or decision.
5. Remove content that does not help that action or decision.

Do not invent details to make the text appear complete.

## Rewrite existing text

1. Preserve every fact and condition.
2. Preserve the level of certainty.
3. Preserve safety and scope limits.
4. Remove ambiguity and repetition.
5. Do not add advice unless the user requests advice.

If the source is ambiguous, keep the ambiguity or ask for clarification. Do not select an interpretation without evidence.

## Output

Return the requested text directly. Do not add a preamble, mode announcement, change summary, rule list, or offer for more detail. If the user requests an explanation or comparison, show the relevant changes and reasons.

## References

Read `examples/before-after.md` only when an example is necessary.
