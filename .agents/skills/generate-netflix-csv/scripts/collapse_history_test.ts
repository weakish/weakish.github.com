import { assertEquals, assertThrows } from "@std/assert";
import {
  collapse,
  collapseSharedPrefixes,
  type HistoryRow,
  historyRowsFromCsv,
  parseDate,
  watchBounds,
} from "./collapse_history.ts";

Deno.test("parseDate converts Netflix export format", () => {
  assertEquals(parseDate("4/6/23"), "2023-04-06");
  assertEquals(parseDate("11/2/24"), "2024-11-02");
  // Streaming export only (2007+): always 20YY — no 69 cutoff to 19xx.
  assertEquals(parseDate("1/1/69"), "2069-01-01");
});

Deno.test("parseDate rejects invalid calendar dates", () => {
  const err = assertThrows(
    () => parseDate("2/30/23"),
    Error,
    'history date is not a valid calendar day, got "2/30/23"',
  );
  assertEquals(err.cause instanceof RangeError, true);
});

Deno.test("parseDate rejects non-M/D/YY shapes", () => {
  const msg = (d: string) =>
    `history date must be M/D/YY, got ${JSON.stringify(d)}`;
  assertThrows(() => parseDate(""), Error, msg(""));
  assertThrows(() => parseDate("4/6"), Error, msg("4/6"));
  assertThrows(() => parseDate("4/6/23/0"), Error, msg("4/6/23/0"));
  assertThrows(() => parseDate("4/6/2023"), Error, msg("4/6/2023"));
  assertThrows(() => parseDate("a/6/23"), Error, msg("a/6/23"));
});

Deno.test("collapseSharedPrefixes merges titles with a shared prefix", () => {
  assertEquals(
    collapseSharedPrefixes(["Foo: Bar", "Foo: Baz", "Solo"]),
    new Map([
      ["Foo: Bar", "Foo"],
      ["Foo: Baz", "Foo"],
    ]),
  );
});

Deno.test("collapseSharedPrefixes leaves a lone colon title unchanged", () => {
  assertEquals(collapseSharedPrefixes(["Foo: Bar"]), new Map());
});

Deno.test("collapseSharedPrefixes skips KEEP_FULL titles", () => {
  assertEquals(
    collapseSharedPrefixes([
      "John Wick: Chapter 2",
      "John Wick: Chapter 3 - Parabellum",
    ]),
    new Map(),
  );
});

Deno.test("collapse uses the only watch date for a single row", () => {
  const rows: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  assertEquals(collapse(rows), [{ title: "Foo", date: "2023-04-06" }]);
});

Deno.test("collapse uses oldest date across collapsed episodes", () => {
  const rows: HistoryRow[] = [
    { title: "Show: Season 1: Pilot", mdyDate: "11/2/24" },
    { title: "Show: Season 1: Finale", mdyDate: "4/6/23" },
  ];
  assertEquals(collapse(rows), [{ title: "Show", date: "2023-04-06" }]);
});

Deno.test("watchBounds records min and max watch dates", () => {
  const rows: HistoryRow[] = [
    { title: "Show: Season 1: Pilot", mdyDate: "11/2/24" },
    { title: "Show: Season 1: Finale", mdyDate: "4/6/23" },
  ];
  assertEquals(watchBounds(rows).get("Show"), {
    min: "2023-04-06",
    max: "2024-11-02",
  });
});

Deno.test("historyRowsFromCsv maps Title/Date and trims", () => {
  const csv = "Title,Date\n  Foo  ,  4/6/23  \n";
  assertEquals(historyRowsFromCsv(csv), [{ title: "Foo", mdyDate: "4/6/23" }]);
});

Deno.test("historyRowsFromCsv trims header names", () => {
  const csv = " Title , Date \nFoo,4/6/23\n";
  assertEquals(historyRowsFromCsv(csv), [{ title: "Foo", mdyDate: "4/6/23" }]);
});

Deno.test("historyRowsFromCsv throws when Title or Date columns are missing", () => {
  const msg = "history CSV requires Title and Date columns";
  assertThrows(() => historyRowsFromCsv("Date\n4/6/23\n"), Error, msg);
  assertThrows(() => historyRowsFromCsv("Title\nFoo\n"), Error, msg);
  assertThrows(() => historyRowsFromCsv("Date\n"), Error, msg);
  assertThrows(() => historyRowsFromCsv(""), Error, msg);
});

Deno.test("historyRowsFromCsv throws when a row cell count mismatches the header", () => {
  const msg = "history CSV row cell count does not match header";
  assertThrows(() => historyRowsFromCsv("Title,Date\nFoo\n"), Error, msg);
  assertThrows(
    () => historyRowsFromCsv("Title,Date\nFoo,4/6/23,extra\n"),
    Error,
    msg,
  );
});

Deno.test("historyRowsFromCsv throws when Title or Date is blank", () => {
  const msg = "history CSV row has blank Title or Date";
  assertThrows(() => historyRowsFromCsv("Title,Date\n,4/6/23\n"), Error, msg);
  assertThrows(() => historyRowsFromCsv("Title,Date\nFoo,\n"), Error, msg);
  assertThrows(() => historyRowsFromCsv("Title,Date\n  ,  \n"), Error, msg);
});
