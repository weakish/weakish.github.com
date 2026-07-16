#!/usr/bin/env python3
"""Collapse NetflixViewingHistory.csv to one work per distinct title + latest watch date."""

from __future__ import annotations

import argparse
import csv
import json
import re
import sys
from collections import defaultdict
from datetime import datetime
from pathlib import Path

# Films / special titles whose colon is part of the work name (do not strip).
KEEP_FULL = {
    "The Hunger Games: Mockingjay - Part 2",
    "The Hunger Games: Mockingjay - Part 1",
    "Jawan: Tamil Extended Cut",
    "A Chinese Odyssey Part Two: Cinderella",
    "John Wick: Chapter 3 - Parabellum",
    "John Wick: Chapter 2",
    "Sex, Love & goop: A show about sex.",
    "BLACKPINK: Light Up the Sky",
    "Anne+: The Film",
    "Gypsy: The Rabbit Hole",
}

# Single watched episode whose Netflix title is not "Show: Season N: …".
EPISODE_TO_SERIES = {
    "Doona!: An Unexpected Twist": "Doona!",
    "Our Planet: One Planet": "Our Planet",
    "The Letter for the King: Storm Clouds Gather": "The Letter for the King",
    "Girl From Nowhere The Reset: Sky": "Girl From Nowhere The Reset",
}

# After pattern collapse, normalize duplicated show prefixes.
RENAME = {
    "The Empress of Ayodhaya: The Empress Of Ayodhaya": "The Empress of Ayodhaya",
}


def parse_date(d: str) -> str:
    return datetime.strptime(d, "%m/%d/%y").date().isoformat()


def strip_episode(t: str) -> str:
    if t in EPISODE_TO_SERIES:
        return EPISODE_TO_SERIES[t]
    if t in KEEP_FULL:
        return t
    for pat in [
        r": Season \d+:.*$",
        r": Limited Series:.*$",
        r": Episode \d+.*$",
    ]:
        nt = re.sub(pat, "", t)
        if nt != t:
            return nt
    return t


def collapse(rows: list[dict[str, str]]) -> list[dict[str, str]]:
    groups: dict[str, list[dict[str, str]]] = defaultdict(list)
    for r in rows:
        groups[strip_episode(r["Title"])].append(r)

    titles = list(groups.keys())
    candidates: dict[str, list[str]] = defaultdict(list)
    for t in titles:
        if t in KEEP_FULL:
            continue
        if ": " in t:
            pref = t.split(": ", 1)[0]
            candidates[pref].append(t)

    collapsed: dict[str, str] = {}
    for pref, ts in candidates.items():
        if len(ts) >= 2:
            for t in ts:
                collapsed[t] = pref

    final: dict[str, list[dict[str, str]]] = defaultdict(list)
    for t, rs in groups.items():
        key = collapsed.get(t, t)
        key = RENAME.get(key, key)
        final[key].extend(rs)

    works: list[dict[str, str]] = []
    for title, rs in final.items():
        dates = sorted(parse_date(r["Date"]) for r in rs)
        works.append({"title": title, "date": dates[-1]})
    works.sort(key=lambda w: w["date"], reverse=True)
    return works


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "history",
        nargs="?",
        default="movies/NetflixViewingHistory.csv",
        type=Path,
        help="Path to Netflix export CSV (Title,Date)",
    )
    ap.add_argument(
        "-o",
        "--output",
        type=Path,
        help="Write JSON works list (default: stdout)",
    )
    ap.add_argument(
        "--titles-only",
        action="store_true",
        help="Print one title per line instead of JSON",
    )
    args = ap.parse_args()

    with args.history.open(newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    works = collapse(rows)

    if args.titles_only:
        text = "\n".join(w["title"] for w in works) + "\n"
    else:
        text = json.dumps(works, ensure_ascii=False, indent=2) + "\n"

    if args.output:
        args.output.write_text(text, encoding="utf-8")
    else:
        sys.stdout.write(text)

    print(f"# {len(works)} works from {len(rows)} history rows", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
