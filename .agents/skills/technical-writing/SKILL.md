---
name: technical-writing
description: Write or rewrite clear technical text. Use by default for technical explanations to users, GitHub issues, pull request descriptions, documentation, release notes, tool descriptions, error messages, prompts, agent instructions, and reports.
---

## Rules

1. State the main point first.
2. Use active voice when the actor is known.
3. Give one instruction per sentence.
4. Use one term for each concept.
5. State actors, conditions, and results explicitly.
6. Use verbs instead of noun forms of actions.
7. Use short sentences.
8. Use one topic per paragraph.
9. Use a list for three or more related items or steps.
10. Remove words that do not change the meaning.
11. Keep technical terms that improve precision.
12. Define an uncommon technical term when the reader needs the definition.
13. Do not use semicolons.
14. For English instructions, use no more than 20 words per sentence when possible.
15. For English descriptions, use no more than 25 words per sentence when possible.
16. Keep a longer sentence when a shorter sentence would remove necessary precision.

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
