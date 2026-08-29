---
name: mastg-assign-ids
description: Assign real sequential MASTG IDs to draft components that use placeholder IDs. Use when finishing a PR, fixing fake IDs, assigning real IDs, or getting the next available IDs. Finds placeholders, renames affected paths with Git, updates references, and verifies the changed-file scope.
---

# MASTG Assign IDs

Use `scripts/assign_ids.py` from the repository root. It requires Python 3.10 or later and the Python standard library.

## Preconditions

- Stage all new files and all relevant changes before you run a command.
- Use the same explicit `OLD=NEW` mappings for `rename` and `fix-ids`.
- Review each next ID before you change files.

The script uses files committed after `origin/master` and files in the Git index. It excludes deleted files, `.github/`, and `.agents/`. It stops if a relevant file is unstaged or untracked.

## Workflow

1. Find fake IDs in changed paths and content:

   ```text
   python3 .agents/skills/mastg-assign-ids/scripts/assign_ids.py find-fakes
   ```

2. Get the next ID for each component type:

   ```text
   python3 .agents/skills/mastg-assign-ids/scripts/assign_ids.py next-id
   ```

   If a PR adds multiple components of one type, assign consecutive IDs from the reported value.

3. Record one mapping for each fake ID:

   ```text
   MASTG-KNOW-0x01=MASTG-KNOW-0142
   MASTG-KNOW-0x02=MASTG-KNOW-0143
   MASTG-BEST-0x01=MASTG-BEST-0075
   ```

4. Rename all affected paths with `git mv`:

   ```text
   python3 .agents/skills/mastg-assign-ids/scripts/assign_ids.py rename MASTG-KNOW-0x01=MASTG-KNOW-0142 MASTG-KNOW-0x02=MASTG-KNOW-0143 MASTG-BEST-0x01=MASTG-BEST-0075
   ```

5. Replace the IDs in changed file content:

   ```text
   python3 .agents/skills/mastg-assign-ids/scripts/assign_ids.py fix-ids MASTG-KNOW-0x01=MASTG-KNOW-0142 MASTG-KNOW-0x02=MASTG-KNOW-0143 MASTG-BEST-0x01=MASTG-BEST-0075
   ```

   The command restages a changed file only when that file was already staged. Review `git status` and stage other corrected files before verification.

6. Verify the result and confirm that the next IDs increased:

   ```text
   python3 .agents/skills/mastg-assign-ids/scripts/assign_ids.py verify
   python3 .agents/skills/mastg-assign-ids/scripts/assign_ids.py next-id
   ```

## ID rules

- Standard fake IDs use `MASTG-TYPE-0xNN`.
- Split draft IDs can use a decimal suffix, such as `MASTG-TEST-0x01-1`.
- Map each split draft ID to a separate real ID.
- Legacy fake IDs can contain hexadecimal letters without `0x`, such as `MASTG-BEST-00ea`.
- Real IDs use four decimal digits, such as `MASTG-KNOW-0142`.
- Each mapping must keep the same component type.
- A real ID must not belong to another component.
- The frontmatter `id` must match the ID in the path.

## Component locations

| Type | Location |
| --- | --- |
| `MASTG-APP` | `apps/<platform>/MASTG-APP-NNNN.md` |
| `MASTG-BEST` | `best-practices/MASTG-BEST-NNNN.md` |
| `MASTG-DEMO` | `demos/<platform>/<MASVS-CAT>/MASTG-DEMO-NNNN/` |
| `MASTG-KNOW` | `knowledge/<platform>/<MASVS-CAT>/MASTG-KNOW-NNNN.md` |
| `MASTG-TECH` | `techniques/<platform>/MASTG-TECH-NNNN.md` |
| `MASTG-TEST` | `tests-beta/<platform>/<MASVS-CAT>/MASTG-TEST-NNNN.md` |
| `MASTG-TOOL` | `tools/<type>/MASTG-TOOL-NNNN.md` |

After verification, give the user a table that lists each fake ID and its real ID.
