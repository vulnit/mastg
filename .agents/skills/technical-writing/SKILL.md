---
name: technical-writing
description: Write or rewrite clear technical text. Use by default for technical explanations to users, GitHub issues, pull request descriptions, documentation, release notes, tool descriptions, error messages, prompts, agent instructions, and reports.
---

Apply every section in this skill.

## Fundamental ASD-STE100 Rules

The following rules summarize the fundamental writing rules in ASD-STE100 Simplified Technical English, Issue 9 (January 2025).

1. Use simple, unambiguous words. Use established technical nouns and technical verbs when necessary.
2. Use one term for each concept. Don't change terminology or wording for stylistic variation.
3. Use American English spelling.
4. Keep multi-word nouns to three words or fewer. If an established technical noun is longer, write it in full before introducing a clear shorter form.
5. Use active voice. In descriptive text, use passive voice only when the actor is unknown.
6. Use a verb to describe an action, not a noun or another part of speech.
7. Write short, complete sentences. Don't omit necessary words.
8. Use vertical lists to make complex text easier to understand.
9. Use consistent connecting words only when they clarify how related topics connect.
10. In procedures, use the imperative form and no more than 20 words per sentence. Give one instruction per sentence unless actions occur at the same time.
11. Put a condition before the procedural instruction that depends on it.
12. In descriptive text, give information gradually and use no more than 25 words per sentence. Keep one topic per sentence and paragraph, and no more than six sentences per paragraph.
13. Identify safety instructions with the applicable risk level. Start with a clear command or condition, and explain the possible result.
14. Don't use semicolons. Use hyphens to connect words that function as one unit.
15. Rewrite the sentence when a word-for-word replacement changes or obscures its meaning.
16. Replace ambiguous pronouns and back-references with specific nouns.
17. Use gender-neutral and non-discriminatory language.

## OWASP MAS Style Guide Rules

These rules come from the [OWASP MAS Style Guide](https://mas.owasp.org/contributing/5_Style_Guide/).

1. State the main point first.
2. Address the reader directly in the second person ("you").
3. Remove words that don't change the meaning.
4. Write for an international audience with a basic technical background. Avoid hard-to-translate slang.
5. Use Chicago-style title capitalization. Capitalize the first and last words, nouns, pronouns, verbs, adjectives, adverbs, and subordinating conjunctions. Lowercase articles, prepositions, and coordinating conjunctions elsewhere.
6. Spell out zero through ten. Use numerals for numbers greater than ten.
7. Write Android versions as "Android X (API level YY)". Don't use codenames.
8. Spell out a term before its abbreviation on first use in body text. If it first appears in a heading, define it in the following text. Don't abbreviate a term used only once.
9. Write format names such as APK, IPA, or ZIP without a leading dot unless referring to the file extension.
10. Use descriptive headings that state the section's subject.
11. Keep each page focused. Move extensive supporting details to a linked page.
12. Keep lists to nine items and no more than two nesting levels when practical. Punctuate and capitalize list items consistently.
13. Use the serial comma.
14. Prefer common contractions when they improve readability.
15. Spell branded and platform-specific terms as their official sources spell them.
16. Don't duplicate content from another section of the guide. Link to the existing content instead.
17. Describe commercial tools and services factually. Don't use promotional language.
18. Use a numbered list when item order is essential. Use a bulleted list when item order isn't essential.
19. Don't add end punctuation to list items that aren't complete sentences unless they complete the introductory sentence. Use end punctuation for complete sentences.
20. For digital content, prefer short, cross-linked pages. Keep related content on one page when it is intended for print.
21. Give each page a unique, descriptive title. Add concise introductory context and links to required background information when necessary.
22. After a colon, start with a lowercase letter unless the text starts with a proper noun, a direct question, or two or more complete sentences.
23. For a generic technical term, prefer the spelling in Merriam-Webster's Collegiate Dictionary, 11th edition. If it isn't available there, use the Microsoft Manual of Style, 4th edition, and then FOLDOC.

## Additional MASTG Writing Rules

These project rules supplement the OWASP MAS Style Guide and ASD-STE100 rules.

1. State actors, conditions, and results explicitly.
2. Use a list for three or more related items or steps.
3. Keep technical terms that improve precision.
4. Define an uncommon technical term when the reader needs the definition.
5. Use parallel grammatical structures for related steps, alternatives, and comparisons.
6. Use commas or parentheses instead of em dashes or en dashes.

## Agent Writing Workflow

### Preserve Uncertainty

Don't change uncertain information into a fact. Keep words such as `may`, `might`, `can`, `could`, `likely`, and `sometimes` ONLY when they carry necessary meaning. Don't add certainty that the available evidence doesn't support.

### Remove AI Writing Patterns

Remove:

- introductions that only announce the answer;
- conclusions that repeat the answer;
- unnecessary headings;
- repeated points;
- rhetorical questions;
- fake quotations;
- marketing adjectives;
- vague quality claims;
- hedge stacking;
- long parenthetical comments;
- phrases such as `it is important to note`;
- phrases such as `it is worth mentioning`;
- phrases such as `in order to`;
- phrases such as `due to the fact that`.

### Timeliness

When you include statistical data:

- Use current information.
- Cite the source.
- Include the date the data was consulted.

### New Technical Text

1. Identify the required purpose and audience.
2. Use only facts from the available context.
3. Mark missing or uncertain information clearly.
4. Organize the text around the reader's required action or decision.
5. Remove content that doesn't help that action or decision.

Don't invent details to make the text appear complete.

### Rewrite Existing Text

1. Preserve every fact and condition.
2. Preserve the level of certainty.
3. Preserve safety and scope limits.
4. Remove ambiguity and repetition.
5. Don't add advice unless the user requests advice.

If the source is ambiguous, keep the ambiguity or ask for clarification. Don't select an interpretation without evidence.

### Output

Return the requested text directly. Don't add a preamble, mode announcement, change summary, rule list, or offer for more detail. If the user requests an explanation or comparison, show the relevant changes and reasons.

## References

Read `examples/before-after.md` only when an example is necessary.
