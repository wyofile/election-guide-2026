#!/usr/bin/env python3
"""
Rename files from "Last_First" to "last-first".

For each file it lowercases the name and replaces underscores with hyphens,
leaving the extension intact:
    Smith_John.webp   ->  smith-john.webp
    OBrien_Mary.webp  ->  obrien-mary.webp

Preview first (no changes are made):
    python rename_last_first.py DIR
Then apply:
    python rename_last_first.py DIR --apply
Options:
    --recursive   also rename files inside subfolders
"""

import argparse
import sys
from pathlib import Path


def new_name(path):
    # Lowercase the stem and swap underscores -> hyphens; keep extension.
    stem = path.stem.lower().replace("_", "-")
    return stem + path.suffix.lower()


def main():
    p = argparse.ArgumentParser(description='Rename "Last_First" files to "last-first".')
    p.add_argument("directory", help="Folder containing the files")
    p.add_argument("--apply", action="store_true",
                   help="Actually rename (without this it's a dry run)")
    p.add_argument("--recursive", action="store_true", help="Recurse into subfolders")
    args = p.parse_args()

    d = Path(args.directory)
    if not d.is_dir():
        sys.exit(f"Directory not found: {d}")

    it = d.rglob("*") if args.recursive else d.iterdir()
    files = sorted(f for f in it if f.is_file())

    planned = {}      # new path -> old path, used to catch collisions
    changes = 0
    for f in files:
        target = f.with_name(new_name(f))
        if target == f:
            continue  # already in the right form

        if target.exists() or target in planned:
            print(f"  ! Skipped {f.name}: '{target.name}' already exists")
            continue

        planned[target] = f
        changes += 1
        print(f"{f.name}  ->  {target.name}")
        if args.apply:
            f.rename(target)

    if changes == 0:
        print("Nothing to rename.")
    elif args.apply:
        print(f"Done. Renamed {changes} file(s).")
    else:
        print(f"\nDry run: {changes} file(s) would be renamed. Re-run with --apply to do it.")


if __name__ == "__main__":
    main()