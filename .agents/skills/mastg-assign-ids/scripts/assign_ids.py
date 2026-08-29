#!/usr/bin/env python3
"""Assign real IDs to changed MASTG components."""

from __future__ import annotations

import argparse
import os
from pathlib import Path
import re
import subprocess
import sys


BASE = "origin/master"
TYPES = ("APP", "BEST", "DEMO", "KNOW", "TECH", "TEST", "TOOL")
PREFIXES = tuple(f"MASTG-{component_type}" for component_type in TYPES)
EXCLUDED = (".github/", ".agents/")
TYPE_PATTERN = "|".join(TYPES)
FAKE_BODY = (
    rf"MASTG-({TYPE_PATTERN})-"
    rf"(?:0x[0-9A-Za-z]+(?:-[0-9]+)?|[0-9A-Fa-f]*[A-Fa-f][0-9A-Fa-f]*)"
)
FAKE_RE = re.compile(rf"(?<![0-9A-Za-z]){FAKE_BODY}(?=$|[^0-9A-Za-z])")
FAKE_BYTES_RE = re.compile(FAKE_RE.pattern.encode("ascii"))
FAKE_FULL_RE = re.compile(rf"{FAKE_BODY}$")
REAL_FULL_RE = re.compile(rf"MASTG-({TYPE_PATTERN})-[0-9]{{4}}$")
KNOWN_ID_RE = re.compile(
    rf"(?<![0-9A-Za-z])MASTG-(?:{TYPE_PATTERN})-"
    rf"(?:[0-9]{{4}}|0x[0-9A-Za-z]+(?:-[0-9]+)?|"
    rf"[0-9A-Fa-f]*[A-Fa-f][0-9A-Fa-f]*)(?=$|[^0-9A-Za-z])"
)


class UserError(Exception):
    """An error that the operator can correct."""


def git(*args: str) -> bytes:
    result = subprocess.run(
        ["git", *args], capture_output=True, check=False
    )
    if result.returncode:
        message = result.stderr.decode("utf-8", errors="replace").strip()
        raise UserError(message or f"git {' '.join(args)} failed")
    return result.stdout


def git_paths(*args: str) -> list[str]:
    return [os.fsdecode(path) for path in git(*args).split(b"\0") if path]


def is_excluded(path: str) -> bool:
    return path.startswith(EXCLUDED)


def tracked_paths() -> set[str]:
    return set(git_paths("ls-files", "-z"))


def changed_paths() -> tuple[list[str], set[str]]:
    tracked = tracked_paths()
    committed = set(
        git_paths(
            "diff", "--name-only", "--diff-filter=ACMR", "-z",
            f"{BASE}...HEAD", "--",
        )
    )
    staged = set(
        git_paths(
            "diff", "--cached", "--name-only", "--diff-filter=ACMR",
            "-z", "--",
        )
    )
    staged &= tracked
    changed = sorted(
        path for path in (committed | staged) & tracked if not is_excluded(path)
    )
    return changed, staged


def index_content(path: str) -> bytes | None:
    result = subprocess.run(
        ["git", "show", f":{path}"], capture_output=True, check=False
    )
    return result.stdout if result.returncode == 0 else None


def worktree_content(path: str) -> bytes | None:
    try:
        return Path(path).read_bytes()
    except (OSError, ValueError):
        return None


def is_text(data: bytes) -> bool:
    try:
        data.decode("utf-8")
    except UnicodeDecodeError:
        return False
    return True


def contains_fake(data: bytes | None) -> bool:
    return bool(data is not None and is_text(data) and FAKE_BYTES_RE.search(data))


def relevant_path(path: str, *, untracked: bool) -> bool:
    if is_excluded(path) or not path:
        return False
    if KNOWN_ID_RE.search(path):
        return True
    if contains_fake(worktree_content(path)):
        return True
    return not untracked and contains_fake(index_content(path))


def check_clean_scope() -> None:
    unstaged = git_paths("diff", "--name-only", "-z", "--")
    untracked = git_paths("ls-files", "--others", "--exclude-standard", "-z")
    dirty = sorted(path for path in unstaged if relevant_path(path, untracked=False))
    new = sorted(path for path in untracked if relevant_path(path, untracked=True))
    if not dirty and not new:
        return

    lines = ["Relevant MASTG files must be staged or committed."]
    if dirty:
        lines.append("Unstaged files:")
        lines.extend(f"  {path}" for path in dirty)
    if new:
        lines.append("Untracked files:")
        lines.extend(f"  {path}" for path in new)
    lines.append("Stage these files with git add, or restore them, and run the command again.")
    raise UserError("\n".join(lines))


def fake_ids(data: bytes | None) -> tuple[str, ...]:
    if data is None or not is_text(data):
        return ()
    return tuple(
        sorted({match.group().decode("ascii") for match in FAKE_BYTES_RE.finditer(data)})
    )


def scan_changed() -> tuple[list[tuple[str, tuple[str, ...]]], list[tuple[str, str, tuple[str, ...]]]]:
    changed, staged = changed_paths()
    path_hits = []
    content_hits = []
    for path in changed:
        ids = tuple(sorted({match.group() for match in FAKE_RE.finditer(path)}))
        if ids:
            path_hits.append((path, ids))

        if path in staged:
            ids = fake_ids(index_content(path))
            if ids:
                content_hits.append((path, "index", ids))
        ids = fake_ids(worktree_content(path))
        if ids:
            content_hits.append((path, "working tree", ids))
    return path_hits, content_hits


def print_hits(
    path_hits: list[tuple[str, tuple[str, ...]]],
    content_hits: list[tuple[str, str, tuple[str, ...]]],
) -> None:
    print("Fake IDs in changed paths:")
    if path_hits:
        for path, ids in path_hits:
            print(f"  {path}: {', '.join(ids)}")
    else:
        print("  (none)")

    print("Fake IDs in changed content:")
    if content_hits:
        for path, source, ids in content_hits:
            print(f"  {path} [{source}]: {', '.join(ids)}")
    else:
        print("  (none)")


def parse_mappings(values: list[str]) -> list[tuple[str, str]]:
    mappings = []
    old_ids = set()
    new_ids = set()
    for value in values:
        if "=" not in value:
            raise UserError(f"Expected OLD=NEW, got: {value}")
        old, new = value.split("=", 1)
        old_match = FAKE_FULL_RE.fullmatch(old)
        new_match = REAL_FULL_RE.fullmatch(new)
        if not old_match:
            raise UserError(f"Not a recognized fake MASTG ID: {old}")
        if not new_match:
            raise UserError(f"Not a four-digit real MASTG ID: {new}")
        if old_match.group(1) != new_match.group(1):
            raise UserError(f"Component types do not match: {old}={new}")
        if old in old_ids:
            raise UserError(f"Duplicate fake ID: {old}")
        if new in new_ids:
            raise UserError(f"Duplicate real ID: {new}")
        old_ids.add(old)
        new_ids.add(new)
        mappings.append((old, new))
    return sorted(mappings, key=lambda pair: len(pair[0]), reverse=True)


def command_find_fakes(_args: argparse.Namespace) -> int:
    check_clean_scope()
    print_hits(*scan_changed())
    return 0


def command_next_id(_args: argparse.Namespace) -> int:
    check_clean_scope()
    paths = tracked_paths()
    for prefix in PREFIXES:
        pattern = re.compile(rf"(?<![0-9A-Za-z]){re.escape(prefix)}-([0-9]{{4}})(?![0-9])")
        numbers = [
            int(match.group(1))
            for path in paths
            for match in pattern.finditer(path)
        ]
        print(f"{prefix}-{max(numbers, default=0) + 1:04d}")
    return 0


def mapping_pattern(value: str) -> re.Pattern[str]:
    return re.compile(rf"(?<![0-9A-Za-z]){re.escape(value)}(?![0-9A-Za-z-])")


def replace(value: str, mappings: list[tuple[str, str]]) -> str:
    for old, new in mappings:
        value = mapping_pattern(old).sub(new, value)
    return value


def check_collisions(
    mappings: list[tuple[str, str]], changed: list[str], *, allow_changed: bool
) -> None:
    tracked = tracked_paths()
    changed_set = set(changed)
    for _old, new in mappings:
        pattern = re.compile(rf"(?<![0-9A-Za-z]){re.escape(new)}(?![0-9])")
        users = sorted(path for path in tracked if pattern.search(path))
        anchors = set()
        for path in users:
            parts = path.split("/")
            index = next(index for index, part in enumerate(parts) if pattern.search(part))
            anchors.add("/".join(parts[: index + 1]))
        conflicts = users if not allow_changed else [path for path in users if path not in changed_set]
        if conflicts or len(anchors) > 1:
            raise UserError(
                f"Real ID {new} already belongs to another component:\n"
                + "\n".join(f"  {path}" for path in users)
            )


def command_rename(args: argparse.Namespace) -> int:
    mappings = parse_mappings(args.mapping)
    check_clean_scope()
    changed, _staged = changed_paths()
    tracked = tracked_paths()
    check_collisions(mappings, changed, allow_changed=False)

    moves = []
    used = set()
    for source in changed:
        target = replace(source, mappings)
        if target == source:
            continue
        used.update(old for old, _new in mappings if mapping_pattern(old).search(source))
        moves.append((source, target))

    missing = [old for old, _new in mappings if old not in used]
    if missing:
        raise UserError("No changed path uses: " + ", ".join(missing))
    if len({target for _source, target in moves}) != len(moves):
        raise UserError("Two source paths would have the same target path.")

    sources = {source for source, _target in moves}
    for source, target in moves:
        if not Path(source).exists() and not Path(source).is_symlink():
            raise UserError(f"Source path does not exist: {source}")
        if target in tracked and target not in sources:
            raise UserError(f"Target path is already tracked: {target}")
        if (Path(target).exists() or Path(target).is_symlink()) and target not in sources:
            raise UserError(f"Target path already exists: {target}")

    for source, target in moves:
        Path(target).parent.mkdir(parents=True, exist_ok=True)
        git("mv", "--", source, target)
        print(f"Renamed: {source} -> {target}")
    return 0


def command_fix_ids(args: argparse.Namespace) -> int:
    mappings = parse_mappings(args.mapping)
    check_clean_scope()
    changed, staged = changed_paths()
    check_collisions(mappings, changed, allow_changed=True)
    updated = []
    restage = []
    byte_mappings = [
        (
            re.compile(
                rb"(?<![0-9A-Za-z])"
                + re.escape(old.encode("ascii"))
                + rb"(?![0-9A-Za-z-])"
            ),
            new.encode("ascii"),
        )
        for old, new in mappings
    ]

    for path in changed:
        data = worktree_content(path)
        if data is None or not is_text(data):
            continue
        replacement = data
        for old, new in byte_mappings:
            replacement = old.sub(new, replacement)
        if replacement == data:
            continue
        Path(path).write_bytes(replacement)
        updated.append(path)
        if path in staged:
            restage.append(path)

    if restage:
        git("add", "--", *restage)
    if updated:
        for path in updated:
            print(f"Updated: {path}")
    else:
        print("No content replacements were needed.")
    return 0


def command_verify(_args: argparse.Namespace) -> int:
    check_clean_scope()
    path_hits, content_hits = scan_changed()
    if path_hits or content_hits:
        print("FAIL: fake IDs remain.")
        print_hits(path_hits, content_hits)
        return 1
    print("OK: no fake IDs remain in changed paths or content.")
    return 0


def parser() -> argparse.ArgumentParser:
    result = argparse.ArgumentParser(description=__doc__)
    commands = result.add_subparsers(dest="command", required=True)
    commands.add_parser("find-fakes", help="List fake IDs in changed files.").set_defaults(
        run=command_find_fakes
    )
    commands.add_parser("next-id", help="Print the next ID for each component type.").set_defaults(
        run=command_next_id
    )
    rename = commands.add_parser("rename", help="Rename changed files with git mv.")
    rename.add_argument("mapping", nargs="+", metavar="OLD=NEW")
    rename.set_defaults(run=command_rename)
    fix = commands.add_parser("fix-ids", help="Replace fake IDs in changed file content.")
    fix.add_argument("mapping", nargs="+", metavar="OLD=NEW")
    fix.set_defaults(run=command_fix_ids)
    commands.add_parser("verify", help="Fail if fake IDs remain.").set_defaults(
        run=command_verify
    )
    return result


def main() -> int:
    args = parser().parse_args()
    try:
        return args.run(args)
    except UserError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
