import { assertEquals } from "https://deno.land/std@0.201.0/assert/mod.ts";
import {
  collapse,
  type HistoryRow,
  parseDate,
  watchBounds,
} from "./collapse_history.ts";

Deno.test("parseDate converts Netflix export format", () => {
  assertEquals(parseDate("4/6/23"), "2023-04-06");
  assertEquals(parseDate("11/2/24"), "2024-11-02");
});

Deno.test("collapse uses the only watch date for a single row", () => {
  const rows: HistoryRow[] = [{ Title: "Foo", Date: "4/6/23" }];
  assertEquals(collapse(rows), [{ title: "Foo", date: "2023-04-06" }]);
});

Deno.test("collapse uses oldest date across collapsed episodes", () => {
  const rows: HistoryRow[] = [
    { Title: "Show: Season 1: Pilot", Date: "11/2/24" },
    { Title: "Show: Season 1: Finale", Date: "4/6/23" },
  ];
  assertEquals(collapse(rows), [{ title: "Show", date: "2023-04-06" }]);
});

Deno.test("watchBounds records min and max watch dates", () => {
  const rows: HistoryRow[] = [
    { Title: "Show: Season 1: Pilot", Date: "11/2/24" },
    { Title: "Show: Season 1: Finale", Date: "4/6/23" },
  ];
  assertEquals(watchBounds(rows).get("Show"), {
    min: "2023-04-06",
    max: "2024-11-02",
  });
});
