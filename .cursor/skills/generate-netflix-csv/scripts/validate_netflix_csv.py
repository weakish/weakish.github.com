#!/usr/bin/env python3
"""Validate movies/netflix.csv against NetflixViewingHistory.csv and schema rules."""

from __future__ import annotations

import argparse
import csv
import re
import sys
from pathlib import Path

from collapse_history import collapse

COLUMNS = ["id", "title", "year", "date", "wikidata", "url"]
ID_RE = re.compile(r"^(tt\d+|m\d+|\d+)$")
URL_RE = re.compile(r"^https://www\.netflix\.com/title/\d+$")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
YEAR_RE = re.compile(r"^\d{4}$")
QID_RE = re.compile(r"^Q\d+$")


def load_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def validate(
    netflix_rows: list[dict[str, str]],
    history_rows: list[dict[str, str]],
) -> list[str]:
    errors: list[str] = []
    if not netflix_rows:
        return ["netflix.csv is empty"]

    fields = list(netflix_rows[0].keys())
    if fields != COLUMNS:
        errors.append(f"columns want {COLUMNS}, got {fields}")

    works = collapse(history_rows)
    want = {w["title"]: w["date"] for w in works}
    got_titles = [r["title"] for r in netflix_rows]
    got = {r["title"]: r for r in netflix_rows}

    if len(got_titles) != len(set(got_titles)):
        errors.append("duplicate titles in netflix.csv")

    missing = sorted(set(want) - set(got))
    extra = sorted(set(got) - set(want))
    if missing:
        errors.append(f"missing titles ({len(missing)}): {missing[:5]}")
    if extra:
        errors.append(f"extra titles ({len(extra)}): {extra[:5]}")

    dates = [r.get("date", "") for r in netflix_rows]
    if dates != sorted(dates, reverse=True):
        errors.append("rows not sorted by date descending")

    for i, r in enumerate(netflix_rows, start=2):
        title = r.get("title", "")
        id_ = r.get("id", "")
        year = r.get("year", "")
        date = r.get("date", "")
        wd = r.get("wikidata", "")
        url = r.get("url", "")

        if not ID_RE.match(id_):
            errors.append(f"L{i} {title!r}: bad id {id_!r}")
        if year and not YEAR_RE.match(year):
            errors.append(f"L{i} {title!r}: bad year {year!r}")
        if not year:
            errors.append(f"L{i} {title!r}: blank year")
        if not DATE_RE.match(date):
            errors.append(f"L{i} {title!r}: bad date {date!r}")
        if title in want and date != want[title]:
            errors.append(
                f"L{i} {title!r}: date {date} != history latest {want[title]}"
            )
        if wd and not QID_RE.match(wd):
            errors.append(f"L{i} {title!r}: bad wikidata {wd!r}")
        if not URL_RE.match(url):
            errors.append(f"L{i} {title!r}: bad/missing url {url!r}")

    return errors


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--netflix",
        type=Path,
        default=Path("movies/netflix.csv"),
    )
    ap.add_argument(
        "--history",
        type=Path,
        default=Path("movies/NetflixViewingHistory.csv"),
    )
    args = ap.parse_args()

    netflix_rows = load_csv(args.netflix)
    with args.history.open(newline="", encoding="utf-8") as f:
        history_rows = list(csv.DictReader(f))

    errors = validate(netflix_rows, history_rows)
    if errors:
        print(f"FAIL ({len(errors)} issues)", file=sys.stderr)
        for e in errors:
            print(e, file=sys.stderr)
        return 1

    blank_wd = sum(1 for r in netflix_rows if not r.get("wikidata"))
    print(
        f"OK {len(netflix_rows)} rows"
        + (f" ({blank_wd} blank wikidata)" if blank_wd else "")
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
