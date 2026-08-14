import {
  CURSOR_BENCH_CSV_PATH,
  cursorBenchColorsForFamilies,
  cursorBenchCostToX,
  cursorBenchScoreToY,
  parseCursorBenchCsv,
  renderCursorBenchSvg,
  splitCursorBenchModelName,
} from "./cursor_bench.ts";

Deno.test("splitCursorBenchModelName prefers Extra High over High", () => {
  const extra = splitCursorBenchModelName("Family Extra High");
  if (extra.family !== "Family" || extra.effort !== "Extra High") {
    throw new Error(`unexpected Extra High split: ${JSON.stringify(extra)}`);
  }
  const high = splitCursorBenchModelName("Family High");
  if (high.family !== "Family" || high.effort !== "High") {
    throw new Error(`unexpected High split: ${JSON.stringify(high)}`);
  }
  const solo = splitCursorBenchModelName("Solo Model");
  if (solo.family !== "Solo Model" || solo.effort !== "") {
    throw new Error(`unexpected solo split: ${JSON.stringify(solo)}`);
  }
});

Deno.test("cost axis puts higher cost further left", () => {
  if (!(cursorBenchCostToX(18) < cursorBenchCostToX(0))) {
    throw new Error("expected $18 left of $0");
  }
});

Deno.test("score axis puts higher score further up", () => {
  if (!(cursorBenchScoreToY(75) < cursorBenchScoreToY(35))) {
    throw new Error("expected 75% above 35% (smaller y)");
  }
});

function plotFillColorForModel(svg: string, model: string): string {
  const escaped = model.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = svg.match(
    new RegExp(`fill="(#[0-9a-f]+)"[^>]*><title>${escaped}:`),
  );
  if (!match) {
    throw new Error(`missing plot point for ${model}`);
  }
  return match[1].toLowerCase();
}

Deno.test("family colors ignore CSV row order", () => {
  const csv = `model,score_pct,cost,tokens,steps,cursor_cloud
Zeta High,60.0,1.00,80,8,-
Alpha Extra High,70.5,2.50,100,10,-
Alpha High,60.0,1.00,80,8,-
`;
  const rows = parseCursorBenchCsv(csv);
  const svgForward = renderCursorBenchSvg(rows);
  const svgReversed = renderCursorBenchSvg([...rows].reverse());
  const color = cursorBenchColorsForFamilies(["Alpha", "Zeta"]).get("Alpha");
  for (const svg of [svgForward, svgReversed]) {
    for (const model of ["Alpha Extra High", "Alpha High"]) {
      const fill = plotFillColorForModel(svg, model);
      if (fill !== color) {
        throw new Error(
          `expected ${model} fill ${color} in stable order, got ${fill}`,
        );
      }
    }
  }
});

Deno.test("family sorts use UTF-16 order not locale collation", () => {
  const probeOrder = [...cursorBenchColorsForFamilies(["a", "B"]).keys()];
  if (probeOrder.join(",") !== "B,a") {
    throw new Error(`expected UTF-16 order B,a; got ${probeOrder.join(",")}`);
  }
  const csv = `model,score_pct,cost,tokens,steps,cursor_cloud
a High,50.0,1.00,10,5,-
B High,50.0,2.00,10,5,-
`;
  const svg = renderCursorBenchSvg(parseCursorBenchCsv(csv));
  const legendA = svg.indexOf(">a</text>");
  const legendB = svg.indexOf(">B</text>");
  if (legendB < 0 || legendA < 0 || !(legendB < legendA)) {
    throw new Error("expected equal-score legend in UTF-16 order B then a");
  }
});

Deno.test("linear probe assigns distinct colors when hashes collide", () => {
  const colors = cursorBenchColorsForFamilies(["Y", "A"]);
  const colorA = colors.get("A");
  const colorY = colors.get("Y");
  if (!colorA || !colorY) {
    throw new Error("missing probed colors");
  }
  if (colorA === colorY) {
    throw new Error(`expected distinct colors for A and Y, both ${colorA}`);
  }
  if (colorA !== "#999999" || colorY !== "#4477aa") {
    throw new Error(
      `expected A=#999999 (preferred) and Y=#4477aa (next slot), got A=${colorA} Y=${colorY}`,
    );
  }
});

Deno.test("linear probe uses each palette color at most once", () => {
  const families = Array.from({ length: 24 }, (_, i) => `Family ${i}`);
  const colors = [...cursorBenchColorsForFamilies(families).values()];
  if (new Set(colors).size !== 24) {
    throw new Error(
      `expected 24 distinct colors, got ${new Set(colors).size}`,
    );
  }
});

Deno.test("linear probe throws when the palette is exhausted", () => {
  const families = Array.from({ length: 25 }, (_, i) => `Family ${i}`);
  try {
    cursorBenchColorsForFamilies(families);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("palette exhausted")
    ) {
      return;
    }
    throw error;
  }
  throw new Error("expected palette exhaustion");
});

Deno.test("family polyline connects Low then Medium then High", () => {
  const csv = `model,score_pct,cost,tokens,steps,cursor_cloud
Family High,70.0,1.50,80,8,-
Family Low,50.0,1.00,80,8,-
Family Medium,60.0,3.00,80,8,-
`;
  const svg = renderCursorBenchSvg(parseCursorBenchCsv(csv));
  const match = svg.match(/<polyline [^>]*points="([^"]+)"/);
  if (!match) {
    throw new Error("missing family polyline");
  }
  const expected = [
    `${cursorBenchCostToX(1).toFixed(1)},${cursorBenchScoreToY(50).toFixed(1)}`,
    `${cursorBenchCostToX(3).toFixed(1)},${cursorBenchScoreToY(60).toFixed(1)}`,
    `${cursorBenchCostToX(1.5).toFixed(1)},${
      cursorBenchScoreToY(70).toFixed(1)
    }`,
  ].join(" ");
  if (match[1] !== expected) {
    throw new Error(
      `expected effort-order points ${expected}, got ${match[1]}`,
    );
  }
});

Deno.test("parseCursorBenchCsv and SVG cover every row without a family color map", () => {
  const csv = `model,score_pct,cost,tokens,steps,cursor_cloud
Alpha Extra High,70.5,2.50,100,10,-
Alpha High,60.0,1.00,80,8,-
Brand-New Bench Family Max,55.0,0.40,50,5,-
`;
  const rows = parseCursorBenchCsv(csv);
  if (rows.length !== 3) {
    throw new Error(`expected 3 rows, got ${rows.length}`);
  }
  if (rows[2].family !== "Brand-New Bench Family" || rows[2].effort !== "Max") {
    throw new Error(`unexpected new-family split: ${JSON.stringify(rows[2])}`);
  }
  const svg = renderCursorBenchSvg(rows);
  for (const row of rows) {
    const tooltip = `${row.model}: ${row.scorePct}%`;
    if (!svg.includes(tooltip)) {
      throw new Error(`SVG missing tooltip ${tooltip}`);
    }
  }
  const plotCircles = svg.match(/<circle [^>]*><title>/g) ?? [];
  if (plotCircles.length !== rows.length) {
    throw new Error(
      `expected ${rows.length} plot circles, got ${plotCircles.length}`,
    );
  }
});

Deno.test("parseCursorBenchCsv requires cursor_cloud flags from CSV", () => {
  const missing = `model,score_pct,cost,tokens,steps
Fable 5 High,66.5,8.77,1,1
`;
  try {
    parseCursorBenchCsv(missing);
    throw new Error("expected missing cursor_cloud to throw");
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !error.message.includes("missing cursor_cloud")
    ) {
      throw error;
    }
  }
  for (const invalid of ["maybe", "true", "false", "no"]) {
    try {
      parseCursorBenchCsv(`model,score_pct,cost,tokens,steps,cursor_cloud
Fable 5 High,66.5,8.77,1,1,${invalid}
`);
      throw new Error(`expected invalid cursor_cloud ${invalid} to throw`);
    } catch (error) {
      if (
        !(error instanceof Error) ||
        !error.message.includes("invalid cursor_cloud")
      ) {
        throw error;
      }
    }
  }
  const rows = parseCursorBenchCsv(
    `model,score_pct,cost,tokens,steps,cursor_cloud
Fable 5 High,66.5,8.77,1,1,yes
Fable 5 Max,70.5,17.32,1,1,-
`,
  );
  if (!rows[0].cursorCloud || rows[1].cursorCloud) {
    throw new Error("unexpected cursorCloud flags from CSV");
  }
});

Deno.test("committed CursorBench CSV marks twelve Cursor Cloud effort presets", () => {
  const rows = parseCursorBenchCsv(
    Deno.readTextFileSync(CURSOR_BENCH_CSV_PATH),
  );
  const cloudModels = rows.filter((row) => row.cursorCloud).map((row) =>
    row.model
  );
  const expected = [
    "Composer 2.5",
    "Fable 5 Extra High",
    "Fable 5 High",
    "Gemini 3.7 Flash High",
    "GPT-5.6 Luna High",
    "GPT-5.6 Sol Extra High",
    "GPT-5.6 Sol High",
    "Grok 4.5 High",
    "Grok 4.6 High",
    "Opus 5 High",
    "Sonnet 5 Extra High",
    "Sonnet 5 High",
  ];
  if (cloudModels.length !== expected.length) {
    throw new Error(
      `expected ${expected.length} Cursor Cloud rows, got ${cloudModels.length}`,
    );
  }
  for (const model of expected) {
    if (!cloudModels.includes(model)) {
      throw new Error(`expected CSV Cursor Cloud flag for ${model}`);
    }
  }
});

Deno.test("renderCursorBenchSvg marks Cursor Cloud models with outer rings and legend", () => {
  const csv = `model,score_pct,cost,tokens,steps,cursor_cloud
Fable 5 High,66.5,8.77,43747,48,yes
Fable 5 Max,70.5,17.32,103525,72,-
`;
  const rows = parseCursorBenchCsv(csv);
  if (!rows[0].cursorCloud || rows[1].cursorCloud) {
    throw new Error("unexpected cursorCloud row flags");
  }
  const svg = renderCursorBenchSvg(rows);
  if (!svg.includes('pointer-events="none"')) {
    throw new Error("SVG missing cloud ring pointer-events");
  }
  if (!svg.includes("Fable 5 High: 66.5% · $8.77/task · Cursor Cloud")) {
    throw new Error("SVG missing Cursor Cloud tooltip label for cloud model");
  }
  if (svg.includes("Fable 5 Max: 70.5% · $17.32/task · Cursor Cloud")) {
    throw new Error("SVG unexpectedly tagged non-cloud model as Cursor Cloud");
  }
  if (!svg.includes(">Cursor Cloud</text>")) {
    throw new Error("SVG missing Cursor Cloud legend entry");
  }
});

Deno.test("renderCursorBenchSvg omits Cursor Cloud legend when no cloud rows", () => {
  const csv = `model,score_pct,cost,tokens,steps,cursor_cloud
Alpha High,60.0,1.00,80,8,-
`;
  const svg = renderCursorBenchSvg(parseCursorBenchCsv(csv));
  if (svg.includes(">Cursor Cloud</text>")) {
    throw new Error("SVG unexpectedly included Cursor Cloud legend");
  }
  if (svg.includes('pointer-events="none"')) {
    throw new Error("SVG unexpectedly included a cloud ring");
  }
});
