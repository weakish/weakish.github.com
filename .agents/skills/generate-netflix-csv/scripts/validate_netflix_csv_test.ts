import { assertEquals } from "https://deno.land/std@0.201.0/assert/mod.ts";
import type { HistoryRow } from "./collapse_history.ts";
import { validate, type NetflixRow } from "./validate_netflix_csv.ts";

function row(
  title: string,
  date: string,
): NetflixRow {
  return {
    id: "tt1",
    title,
    year: "2020",
    date,
    wikidata: "",
    netflix: "12345",
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
