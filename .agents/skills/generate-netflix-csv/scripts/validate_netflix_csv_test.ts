import { assertEquals } from "https://deno.land/std@0.201.0/assert/mod.ts";
import type { HistoryRow } from "./collapse_history.ts";
import { type NetflixRow, validate } from "./validate_netflix_csv.ts";

function row(
  title: string,
  date: string,
  netflix = "12345",
): NetflixRow {
  return {
    id: "tt1",
    title,
    year: "2020",
    date,
    wikidata: "",
    netflix,
  };
}

Deno.test("validate allows preserved first watch older than export minimum", () => {
  const history: HistoryRow[] = [
    { Title: "Show: Season 1: Finale", Date: "11/2/24" },
  ];
  const netflix = [row("Show", "2023-04-06")];
  assertEquals(validate(netflix, history), []);
});

Deno.test("validate rejects date after last history watch", () => {
  const history: HistoryRow[] = [{ Title: "Foo", Date: "4/6/23" }];
  const netflix = [row("Foo", "2025-01-01")];
  const errors = validate(netflix, history);
  assertEquals(errors.length, 1);
  assertEquals(errors[0]?.includes("after last history watch"), true);
});

Deno.test("validate does not treat blank netflix ids as duplicates", () => {
  const history: HistoryRow[] = [
    { Title: "Foo", Date: "4/6/23" },
    { Title: "Bar", Date: "5/6/23" },
  ];
  const netflix = [
    row("Foo", "2023-04-06", ""),
    row("Bar", "2023-05-06", ""),
  ];
  const errors = validate(netflix, history);
  assertEquals(
    errors.some((e) => e.includes("duplicate Netflix title ids")),
    false,
  );
  assertEquals(
    errors.filter((e) => e.includes("bad/missing Netflix title id")).length,
    2,
  );
});

Deno.test("validate rejects duplicate netflix title ids", () => {
  const history: HistoryRow[] = [
    { Title: "Foo", Date: "4/6/23" },
    { Title: "Bar", Date: "5/6/23" },
  ];
  const netflix = [
    row("Foo", "2023-04-06", "99999"),
    row("Bar", "2023-05-06", "99999"),
  ];
  const errors = validate(netflix, history);
  assertEquals(
    errors.includes("duplicate Netflix title ids in netflix.csv"),
    true,
  );
});

Deno.test("validate rejects blank title", () => {
  const history: HistoryRow[] = [{ Title: "Foo", Date: "4/6/23" }];
  const netflix = [row("", "2023-04-06")];
  const errors = validate(netflix, history);
  assertEquals(errors.some((e) => e.includes("blank title")), true);
});
