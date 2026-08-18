import { assertEquals, assertThrows } from "@std/assert";
import { type HistoryRow, historyRowsFromCsv } from "./collapse_history.ts";
import {
  type NetflixCsvData,
  netflixCsvFromText,
  validate,
} from "./validate_netflix_csv.ts";

const COLUMNS = ["id", "title", "year", "date", "wikidata", "netflix"];

function table(records: Record<string, string>[]): NetflixCsvData {
  return { headers: [...COLUMNS], records };
}

function row(
  title: string,
  date: string,
  netflix = "12345",
): Record<string, string> {
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
    { title: "Show: Season 1: Finale", mdyDate: "11/2/24" },
  ];
  const netflix = table([row("Show", "2023-04-06")]);
  assertEquals(validate(netflix, history), []);
});

Deno.test("validate rejects date after last history watch", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const netflix = table([row("Foo", "2025-01-01")]);
  const errors = validate(netflix, history);
  assertEquals(errors.length, 1);
  assertEquals(errors[0]?.includes("after last history watch"), true);
});

Deno.test("validate does not treat blank netflix ids as duplicates", () => {
  const history: HistoryRow[] = [
    { title: "Foo", mdyDate: "4/6/23" },
    { title: "Bar", mdyDate: "5/6/23" },
  ];
  const netflix = table([
    row("Foo", "2023-04-06", ""),
    row("Bar", "2023-05-06", ""),
  ]);
  const errors = validate(netflix, history);
  assertEquals(
    errors.some((e) => e.includes("duplicate Netflix title ids")),
    false,
  );
  assertEquals(
    errors.filter((e) => e.includes("blank Netflix title id")).length,
    2,
  );
});

Deno.test("validate rejects duplicate netflix title ids", () => {
  const history: HistoryRow[] = [
    { title: "Foo", mdyDate: "4/6/23" },
    { title: "Bar", mdyDate: "5/6/23" },
  ];
  const netflix = table([
    row("Foo", "2023-04-06", "99999"),
    row("Bar", "2023-05-06", "99999"),
  ]);
  const errors = validate(netflix, history);
  assertEquals(
    errors.includes("duplicate Netflix title ids in netflix.csv"),
    true,
  );
});

Deno.test("validate rejects blank title", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const netflix = table([row("", "2023-04-06")]);
  const errors = validate(netflix, history);
  assertEquals(errors.some((e) => e.includes("blank title")), true);
});

Deno.test("validate treats whitespace-only title as blank", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const netflix = table([row("  ", "2023-04-06")]);
  const errors = validate(netflix, history);
  assertEquals(errors.some((e) => e.includes("blank title")), true);
});

Deno.test("validate does not treat whitespace-only titles as duplicates", () => {
  const history: HistoryRow[] = [
    { title: "Foo", mdyDate: "4/6/23" },
    { title: "Bar", mdyDate: "5/6/23" },
  ];
  const netflix = table([
    row("  ", "2023-04-06"),
    row("\t", "2023-05-06"),
  ]);
  const errors = validate(netflix, history);
  assertEquals(errors.some((e) => e.includes("duplicate titles")), false);
  assertEquals(errors.filter((e) => e.includes("blank title")).length, 2);
});

Deno.test("validate matches coverage after trimming titles", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const netflix = table([row("  Foo  ", "2023-04-06")]);
  assertEquals(validate(netflix, history), []);
});

Deno.test("validate matches coverage when history CSV title has whitespace", () => {
  const history = historyRowsFromCsv("Title,Date\n  Foo  ,4/6/23\n");
  const netflix = table([row("Foo", "2023-04-06")]);
  assertEquals(validate(netflix, history), []);
});

Deno.test("validate applies history watch bounds on trimmed title from CSV", () => {
  const history = historyRowsFromCsv("Title,Date\n  Foo  ,4/6/23\n");
  const netflix = table([row("Foo", "2025-01-01")]);
  const errors = validate(netflix, history);
  assertEquals(
    errors.some((e) => e.includes("after last history watch")),
    true,
  );
});

Deno.test("validate applies history watch bounds on trimmed date from CSV", () => {
  const history = historyRowsFromCsv("Title,Date\nFoo,  4/6/23  \n");
  const netflix = table([row("Foo", "2025-01-01")]);
  const errors = validate(netflix, history);
  assertEquals(
    errors.some((e) => e.includes("after last history watch")),
    true,
  );
});

Deno.test("validate rejects blank id and date", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const netflix = table([{
    id: "",
    title: "Foo",
    year: "2020",
    date: "",
    wikidata: "",
    netflix: "12345",
  }]);
  const errors = validate(netflix, history);
  assertEquals(errors.some((e) => e.includes("blank id")), true);
  assertEquals(errors.some((e) => e.includes("blank date")), true);
});

Deno.test("validate treats whitespace-only id as blank", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const netflix = table([{
    id: "  ",
    title: "Foo",
    year: "2020",
    date: "2023-04-06",
    wikidata: "",
    netflix: "12345",
  }]);
  const errors = validate(netflix, history);
  assertEquals(errors.some((e) => e.includes('L2 "Foo": blank id')), true);
});

Deno.test("validate does not treat blank titles as duplicates", () => {
  const history: HistoryRow[] = [
    { title: "Foo", mdyDate: "4/6/23" },
    { title: "Bar", mdyDate: "5/6/23" },
  ];
  const netflix = table([
    row("", "2023-04-06"),
    row("", "2023-05-06"),
  ]);
  const errors = validate(netflix, history);
  assertEquals(errors.some((e) => e.includes("duplicate titles")), false);
  assertEquals(errors.filter((e) => e.includes("blank title")).length, 2);
});

Deno.test("validate rejects duplicate titles", () => {
  const history: HistoryRow[] = [
    { title: "Foo", mdyDate: "4/6/23" },
    { title: "Bar", mdyDate: "5/6/23" },
  ];
  const netflix = table([
    row("Same", "2023-04-06"),
    row("Same", "2023-05-06"),
  ]);
  const errors = validate(netflix, history);
  assertEquals(errors.includes("duplicate titles in netflix.csv"), true);
});

Deno.test("validate truncates long missing-title lists with ellipsis", () => {
  const history: HistoryRow[] = [
    { title: "T0", mdyDate: "4/6/23" },
    { title: "T1", mdyDate: "4/6/23" },
    { title: "T2", mdyDate: "4/6/23" },
    { title: "T3", mdyDate: "4/6/23" },
    { title: "T4", mdyDate: "4/6/23" },
    { title: "T5", mdyDate: "4/6/23" },
  ];
  const netflix = table([row("Only", "2023-04-06")]);
  const errors = validate(netflix, history);
  assertEquals(
    errors.includes('missing titles (6): "T0", "T1", "T2", "T3", "T4", ...'),
    true,
  );
});

Deno.test("validate truncates long extra-title lists with ellipsis", () => {
  const history: HistoryRow[] = [{ title: "Only", mdyDate: "4/6/23" }];
  const netflix = table([
    row("Only", "2023-04-06", "100"),
    row("E0", "2023-04-06", "200"),
    row("E1", "2023-04-06", "201"),
    row("E2", "2023-04-06", "202"),
    row("E3", "2023-04-06", "203"),
    row("E4", "2023-04-06", "204"),
    row("E5", "2023-04-06", "205"),
    row("E6", "2023-04-06", "206"),
  ]);
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
  const history: HistoryRow[] = [{ title: "Foo, Bar", mdyDate: "4/6/23" }];
  const netflix = table([row("Other", "2023-04-06")]);
  const errors = validate(netflix, history);
  assertEquals(
    errors.includes('missing titles (1): "Foo, Bar"'),
    true,
  );
});

Deno.test("validate rejects rows not sorted by date descending", () => {
  const history: HistoryRow[] = [
    { title: "Older", mdyDate: "1/1/20" },
    { title: "Newer", mdyDate: "1/1/24" },
  ];
  const netflix = table([
    row("Older", "2020-01-01", "100"),
    row("Newer", "2024-01-01", "200"),
  ]);
  const errors = validate(netflix, history);
  assertEquals(errors.includes("rows not sorted by date descending"), true);
  assertEquals(
    errors.some((e) => e.includes("duplicate Netflix title ids")),
    false,
  );
});

Deno.test("validate double-quotes apostrophe titles in coverage errors", () => {
  const history: HistoryRow[] = [{
    title: "It's a Wonderful Life",
    mdyDate: "4/6/23",
  }];
  const netflix = table([row("Other", "2023-04-06")]);
  const errors = validate(netflix, history);
  assertEquals(
    errors.includes('missing titles (1): "It\'s a Wonderful Life"'),
    true,
  );
});

Deno.test("validate escapes double quotes in coverage error titles", () => {
  const history: HistoryRow[] = [{ title: 'He said "hi"', mdyDate: "4/6/23" }];
  const netflix = table([row("Other", "2023-04-06")]);
  const errors = validate(netflix, history);
  assertEquals(
    errors.includes('missing titles (1): "He said ""hi"""'),
    true,
  );
});

Deno.test("validate double-quotes apostrophe titles in row field errors", () => {
  const history: HistoryRow[] = [{ title: "It's", mdyDate: "4/6/23" }];
  const netflix = table([{
    id: "bad",
    title: "It's",
    year: "2020",
    date: "2023-04-06",
    wikidata: "",
    netflix: "12345",
  }]);
  const errors = validate(netflix, history);
  assertEquals(
    errors.some((e) => e.includes('L2 "It\'s": invalid id "bad"')),
    true,
  );
});

Deno.test("netflixCsvFromText trims header names", () => {
  const csv =
    " id , title , year , date , wikidata , netflix \ntt1,Foo,2020,2023-04-06,,12345\n";
  assertEquals(netflixCsvFromText(csv), {
    headers: ["id", "title", "year", "date", "wikidata", "netflix"],
    records: [{
      id: "tt1",
      title: "Foo",
      year: "2020",
      date: "2023-04-06",
      wikidata: "",
      netflix: "12345",
    }],
  });
});

const NETFLIX_CSV_HEADER = "id,title,year,date,wikidata,netflix";
const NETFLIX_CSV_FOO = "tt1,Foo,2020,2023-04-06,,12345";

Deno.test("validate rejects unnamed extra netflix.csv columns", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const netflix = netflixCsvFromText(
    `${NETFLIX_CSV_HEADER},\n${NETFLIX_CSV_FOO},\n`,
  );
  assertEquals(validate(netflix, history), [
    "columns want id,title,year,date,wikidata,netflix, got id,title,year,date,wikidata,netflix,",
  ]);
});

Deno.test("validate rejects multiple unnamed netflix.csv columns", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const netflix = netflixCsvFromText(
    `${NETFLIX_CSV_HEADER},,\n${NETFLIX_CSV_FOO},,\n`,
  );
  assertEquals(validate(netflix, history), [
    "columns want id,title,year,date,wikidata,netflix, got id,title,year,date,wikidata,netflix,,",
  ]);
});

Deno.test("netflixCsvFromText throws when a row cell count mismatches the header", () => {
  assertThrows(
    () =>
      netflixCsvFromText(
        `${NETFLIX_CSV_HEADER}\ntt1,Foo,2020,2023-04-06\n`,
      ),
    Error,
    "netflix.csv row cell count does not match header",
  );
});

Deno.test("validate rejects invalid calendar dates in netflix.csv", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const errors = validate(table([row("Foo", "2023-02-30")]), history);
  assertEquals(
    errors.includes('L2 "Foo": date is not a valid calendar day "2023-02-30"'),
    true,
  );
});

Deno.test("validate reports empty when the file has no header", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  assertEquals(validate(netflixCsvFromText(""), history), [
    "netflix.csv is empty",
  ]);
});

Deno.test("validate reports empty when the header matches and there are no rows", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  assertEquals(
    validate(netflixCsvFromText(`${NETFLIX_CSV_HEADER}\n`), history),
    [
      "netflix.csv is empty",
    ],
  );
});

Deno.test("validate rejects extra columns on a header-only file", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  assertEquals(
    validate(netflixCsvFromText(`${NETFLIX_CSV_HEADER},\n`), history),
    [
      "columns want id,title,year,date,wikidata,netflix, got id,title,year,date,wikidata,netflix,",
    ],
  );
});

Deno.test("validate rejects extra netflix.csv columns", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const netflix = netflixCsvFromText(
    `${NETFLIX_CSV_HEADER},extra\n${NETFLIX_CSV_FOO},x\n`,
  );
  assertEquals(validate(netflix, history), [
    "columns want id,title,year,date,wikidata,netflix, got id,title,year,date,wikidata,netflix,extra",
  ]);
});

Deno.test("validate rejects missing netflix.csv columns", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const netflix = netflixCsvFromText(
    "title,year,date,wikidata,netflix\nFoo,2020,2023-04-06,,12345\n",
  );
  assertEquals(validate(netflix, history), [
    "columns want id,title,year,date,wikidata,netflix, got title,year,date,wikidata,netflix",
  ]);
});

Deno.test("validate rejects wrong netflix.csv headers", () => {
  const history: HistoryRow[] = [{ title: "Foo", mdyDate: "4/6/23" }];
  const netflix = netflixCsvFromText(
    "foo,bar,baz,qux,quux,corge\n1,2,3,4,5,6\n",
  );
  assertEquals(validate(netflix, history), [
    "columns want id,title,year,date,wikidata,netflix, got foo,bar,baz,qux,quux,corge",
  ]);
});
