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

Deno.test("validate does not treat blank titles as duplicates", () => {
  const history: HistoryRow[] = [
    { Title: "Foo", Date: "4/6/23" },
    { Title: "Bar", Date: "5/6/23" },
  ];
  const netflix = [
    row("", "2023-04-06"),
    row("", "2023-05-06"),
  ];
  const errors = validate(netflix, history);
  assertEquals(errors.some((e) => e.includes("duplicate titles")), false);
  assertEquals(errors.filter((e) => e.includes("blank title")).length, 2);
});

Deno.test("validate rejects duplicate titles", () => {
  const history: HistoryRow[] = [
    { Title: "Foo", Date: "4/6/23" },
    { Title: "Bar", Date: "5/6/23" },
  ];
  const netflix = [
    row("Same", "2023-04-06"),
    row("Same", "2023-05-06"),
  ];
  const errors = validate(netflix, history);
  assertEquals(errors.includes("duplicate titles in netflix.csv"), true);
});

Deno.test("validate truncates long missing-title lists with ellipsis", () => {
  const history: HistoryRow[] = [
    { Title: "T0", Date: "4/6/23" },
    { Title: "T1", Date: "4/6/23" },
    { Title: "T2", Date: "4/6/23" },
    { Title: "T3", Date: "4/6/23" },
    { Title: "T4", Date: "4/6/23" },
    { Title: "T5", Date: "4/6/23" },
  ];
  const netflix = [row("Only", "2023-04-06")];
  const errors = validate(netflix, history);
  assertEquals(
    errors.includes('missing titles (6): "T0", "T1", "T2", "T3", "T4", ...'),
    true,
  );
});

Deno.test("validate truncates long extra-title lists with ellipsis", () => {
  const history: HistoryRow[] = [{ Title: "Only", Date: "4/6/23" }];
  const netflix = [
    row("Only", "2023-04-06", "100"),
    row("E0", "2023-04-06", "200"),
    row("E1", "2023-04-06", "201"),
    row("E2", "2023-04-06", "202"),
    row("E3", "2023-04-06", "203"),
    row("E4", "2023-04-06", "204"),
    row("E5", "2023-04-06", "205"),
    row("E6", "2023-04-06", "206"),
  ];
  const errors = validate(netflix, history);
  assertEquals(
    errors.includes('extra titles (7): "E0", "E1", "E2", "E3", "E4", ...'),
    true,
  );
  assertEquals(
    errors.some((e) => e.includes("duplicate Netflix title ids")),
    false,
  );
});

Deno.test("validate quotes titles with commas in coverage errors", () => {
  const history: HistoryRow[] = [{ Title: "Foo, Bar", Date: "4/6/23" }];
  const netflix = [row("Other", "2023-04-06")];
  const errors = validate(netflix, history);
  assertEquals(
    errors.includes('missing titles (1): "Foo, Bar"'),
    true,
  );
});

Deno.test("validate rejects rows not sorted by date descending", () => {
  const history: HistoryRow[] = [
    { Title: "Older", Date: "1/1/20" },
    { Title: "Newer", Date: "1/1/24" },
  ];
  const netflix = [
    row("Older", "2020-01-01"),
    row("Newer", "2024-01-01"),
  ];
  const errors = validate(netflix, history);
  assertEquals(errors.includes("rows not sorted by date descending"), true);
});

Deno.test("validate double-quotes apostrophe titles in coverage errors", () => {
  const history: HistoryRow[] = [{
    Title: "It's a Wonderful Life",
    Date: "4/6/23",
  }];
  const netflix = [row("Other", "2023-04-06")];
  const errors = validate(netflix, history);
  assertEquals(
    errors.includes('missing titles (1): "It\'s a Wonderful Life"'),
    true,
  );
});

Deno.test("validate escapes double quotes in coverage error titles", () => {
  const history: HistoryRow[] = [{ Title: 'He said "hi"', Date: "4/6/23" }];
  const netflix = [row("Other", "2023-04-06")];
  const errors = validate(netflix, history);
  assertEquals(
    errors.includes('missing titles (1): "He said ""hi"""'),
    true,
  );
});

Deno.test("validate double-quotes apostrophe titles in row field errors", () => {
  const history: HistoryRow[] = [{ Title: "It's", Date: "4/6/23" }];
  const netflix: NetflixRow[] = [{
    id: "bad",
    title: "It's",
    year: "2020",
    date: "2023-04-06",
    wikidata: "",
    netflix: "12345",
  }];
  const errors = validate(netflix, history);
  assertEquals(
    errors.some((e) => e.includes('L2 "It\'s": bad id "bad"')),
    true,
  );
});
