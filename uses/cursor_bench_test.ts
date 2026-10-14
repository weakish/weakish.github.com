import {
  CURSOR_BENCH_CSV_PATH,
  CURSOR_BENCH_SVG_PATH,
  cursorBenchColorsForFamilies,
  cursorBenchCostToX,
  cursorBenchScoreToY,
  inlineCursorBenchChartInPages,
  isCursorBenchPage,
  isCursorBenchPageSrc,
  isCursorBenchPageUrl,
  loadCursorBenchRows,
  parseCursorBenchCsv,
  prepareCursorBenchSvgForHtml,
  renderCursorBenchSvg,
  replaceCursorBenchEmbedInHtml,
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
  const minimal = splitCursorBenchModelName("Muse Spark 1.3 Minimal");
  if (minimal.family !== "Muse Spark 1.3" || minimal.effort !== "Minimal") {
    throw new Error(`unexpected Minimal split: ${JSON.stringify(minimal)}`);
  }
});

Deno.test("cost axis puts higher cost further left", () => {
  if (!(cursorBenchCostToX(18) < cursorBenchCostToX(0))) {
    throw new Error("expected $18 left of $0");
  }
});

Deno.test("score axis puts higher score further up", () => {
  if (!(cursorBenchScoreToY(60) < cursorBenchScoreToY(15))) {
    throw new Error("expected 60% above 15% (smaller y)");
  }
});

function* svgFocusVisiblePointRules(svg: string): Generator<string> {
  for (
    const match of svg.matchAll(
      /\.cursor-bench-point:focus-visible[^{]*\{[^}]*\}/g,
    )
  ) {
    yield match[0];
  }
}

function svgFocusRuleThickensDotAndCloudRing(svg: string): boolean {
  for (const rule of svgFocusVisiblePointRules(svg)) {
    if (
      rule.includes("cursor-bench-dot") &&
      rule.includes("cursor-bench-cloud-ring") &&
      /stroke-width:\s*2\.5/.test(rule)
    ) {
      return true;
    }
  }
  return false;
}

function svgFocusRingUsesWhiteThenDarkContrast(svg: string): boolean {
  if (
    !svg.includes("stroke: #fff") ||
    !svg.includes("drop-shadow(0 0 1px #fff)") ||
    !svg.includes("drop-shadow(0 0 2px #333)")
  ) {
    return false;
  }
  for (const rule of svgFocusVisiblePointRules(svg)) {
    if (rule.includes("cursor-bench-dot") && /stroke:\s*#333/.test(rule)) {
      return false;
    }
  }
  return true;
}

function assertPlotPointsSkipPageTabOrder(svg: string, pointCount: number) {
  if (svg.includes('tabindex="0"')) {
    throw new Error("plot points should not be in sequential tab order");
  }
  const tabNegative = svg.match(/tabindex="-1"/g) ?? [];
  if (tabNegative.length !== pointCount) {
    throw new Error(
      `expected tabindex=-1 on every plot point, got ${tabNegative.length}`,
    );
  }
}

function assertFocusVisibleRingContract(svg: string) {
  if (!svg.includes(":focus-visible .cursor-bench-dot")) {
    throw new Error("focus should ring the dot via :focus-visible");
  }
  if (!svg.includes(":focus-visible .cursor-bench-cloud-ring")) {
    throw new Error("focus should also ring Cursor Cloud markers");
  }
  if (!svgFocusRingUsesWhiteThenDarkContrast(svg)) {
    throw new Error(
      "focus ring should use a white stroke plus a white-then-dark drop-shadow for contrast on light and dark dots",
    );
  }
  if (!svgFocusRuleThickensDotAndCloudRing(svg)) {
    throw new Error(
      "focus stroke-width should thicken both the dot and the Cursor Cloud ring in one rule",
    );
  }
}

function plotFillColorForModel(svg: string, model: string): string {
  const escaped = model.replaceAll(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const tip = svg.match(
    new RegExp(`id="cursor-bench-t(\\d+)"[^>]*>${escaped}:`),
  );
  if (!tip) {
    throw new Error(`missing tip for ${model}`);
  }
  const match = svg.match(
    new RegExp(
      `id="cursor-bench-p${
        tip[1]
      }"[^>]*>\\s*<circle class="cursor-bench-dot"[^>]*\\bfill="(#[0-9a-f]+)"`,
    ),
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

Deno.test("family polyline connects Minimal then Low then Medium then High", () => {
  const csv = `model,score_pct,cost,tokens,steps,cursor_cloud
Family High,55.0,1.50,80,8,-
Family Low,50.0,1.00,80,8,-
Family Medium,45.0,3.00,80,8,-
Family Minimal,40.0,0.50,80,8,-
`;
  const svg = renderCursorBenchSvg(parseCursorBenchCsv(csv));
  const match = svg.match(/<polyline [^>]*points="([^"]+)"/);
  if (!match) {
    throw new Error("missing family polyline");
  }
  const expected = [
    `${cursorBenchCostToX(0.5).toFixed(1)},${
      cursorBenchScoreToY(40).toFixed(1)
    }`,
    `${cursorBenchCostToX(1).toFixed(1)},${cursorBenchScoreToY(50).toFixed(1)}`,
    `${cursorBenchCostToX(3).toFixed(1)},${cursorBenchScoreToY(45).toFixed(1)}`,
    `${cursorBenchCostToX(1.5).toFixed(1)},${
      cursorBenchScoreToY(55).toFixed(1)
    }`,
  ].join(" ");
  if (match[1] !== expected) {
    throw new Error(
      `expected effort-order points ${expected}, got ${match[1]}`,
    );
  }
});

const CURSOR_BENCH_CSV_ALPHA_AND_NEW_FAMILY =
  `model,score_pct,cost,tokens,steps,cursor_cloud
Alpha Extra High,70.5,2.50,100,10,-
Alpha High,60.0,1.00,80,8,-
Brand-New Bench Family Max,55.0,0.40,50,5,-
`;

Deno.test("plot point paint order prefers higher-score families and later efforts", () => {
  const svg = renderCursorBenchSvg(
    parseCursorBenchCsv(CURSOR_BENCH_CSV_ALPHA_AND_NEW_FAMILY),
  );
  const brand = svg.indexOf('aria-label="Brand-New Bench Family Max:');
  const alphaHigh = svg.indexOf('aria-label="Alpha High:');
  const alphaExtra = svg.indexOf('aria-label="Alpha Extra High:');
  if (brand < 0 || alphaHigh < 0 || alphaExtra < 0) {
    throw new Error("expected Brand-New and Alpha plot points");
  }
  if (!(brand < alphaHigh && alphaHigh < alphaExtra)) {
    throw new Error(
      "expected Brand-New before Alpha, and Alpha High before Extra High, so later DOM wins overlapping hits",
    );
  }
  if (svg.includes("z-index")) {
    throw new Error("SVG z-index is not portable; stack with document order");
  }
});

Deno.test("parseCursorBenchCsv and SVG cover every row without a family color map", () => {
  const rows = parseCursorBenchCsv(CURSOR_BENCH_CSV_ALPHA_AND_NEW_FAMILY);
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
  const plotPoints = svg.match(/class="cursor-bench-point"/g) ?? [];
  if (plotPoints.length !== rows.length) {
    throw new Error(
      `expected ${rows.length} plot points, got ${plotPoints.length}`,
    );
  }
});

Deno.test("rendered CursorBench SVG hover and focus contract", () => {
  const rows = parseCursorBenchCsv(CURSOR_BENCH_CSV_ALPHA_AND_NEW_FAMILY);
  const svg = renderCursorBenchSvg(rows);
  if (!svg.includes('class="cursor-bench-tip"')) {
    throw new Error("SVG missing CSS hover tip labels");
  }
  if (!svg.includes('aria-hidden="true"')) {
    throw new Error("SVG tip labels should be aria-hidden");
  }
  if (!svg.includes(":hover")) {
    throw new Error("SVG missing :hover tip rule");
  }
  if (!svg.includes(":active")) {
    throw new Error("SVG missing :active tip rule for tap");
  }
  if (!svg.includes(":is(:hover,:active,:focus-within)")) {
    throw new Error("SVG tip rule should keep tap focus after release");
  }
  if (!svg.includes(":has(")) {
    throw new Error("SVG missing :has() tip targeting");
  }
  if (svg.includes("<script")) {
    throw new Error(
      "chart must stay CSS-only (site footer: no JS off /search/)",
    );
  }
  if (!svg.includes("cursor: pointer")) {
    throw new Error("plot points should use cursor:pointer for iOS tap focus");
  }
  if (!svg.includes(".cursor-bench-chart .cursor-bench-point")) {
    throw new Error("point CSS should be scoped under .cursor-bench-chart");
  }
  if (!svg.includes(".cursor-bench-chart .cursor-bench-tip")) {
    throw new Error("tip CSS should be scoped under .cursor-bench-chart");
  }
  if (
    !/\.cursor-bench-chart \.cursor-bench-tip \{[^}]*pointer-events:\s*none/
      .test(svg)
  ) {
    throw new Error(
      "tip labels paint above hits and must use pointer-events:none",
    );
  }
  if (!svg.includes('class="cursor-bench-chart"')) {
    throw new Error("chart root should carry cursor-bench-chart class");
  }
  if (svg.includes("cursor: default")) {
    throw new Error("plot points should not use cursor:default");
  }
  const hitTargets = svg.match(
    /class="cursor-bench-hit" cx="[^"]+" cy="[^"]+" r="12" fill="none" pointer-events="all"/g,
  ) ?? [];
  if (hitTargets.length !== rows.length) {
    throw new Error(
      `expected r="12" fill="none" pointer-events="all" on every hit target, got ${hitTargets.length}`,
    );
  }
  assertPlotPointsSkipPageTabOrder(svg, rows.length);
  assertFocusVisibleRingContract(svg);
  const labeledPoints = svg.match(
    /class="cursor-bench-point"[^>]*role="img"[^>]*aria-label="/g,
  ) ?? [];
  if (labeledPoints.length !== rows.length) {
    throw new Error(
      `expected role=img and aria-label on every plot point, got ${labeledPoints.length}`,
    );
  }
  if (svg.includes("aria-selected") || svg.includes('role="listbox"')) {
    throw new Error("plot points should not be a listbox");
  }
  if (svg.includes('role="option"')) {
    throw new Error("plot points should not be listbox options");
  }
  if (!/role="group"[^>]*aria-labelledby="cursor-bench-title"/.test(svg)) {
    throw new Error("chart root should use role=group with the title label");
  }
  if (/class="cursor-bench-point"[^>]*role="group"/.test(svg)) {
    throw new Error("plot points should use role=img, not role=group");
  }
  if (svg.includes("cursor-bench-keys") || svg.includes("Home and End")) {
    throw new Error("key help belongs with the removed listbox");
  }
  const lastPoint = svg.lastIndexOf('class="cursor-bench-point" id="');
  const firstTip = svg.indexOf('class="cursor-bench-tip" id="');
  if (lastPoint < 0 || firstTip < 0 || !(lastPoint < firstTip)) {
    throw new Error("expected all plot points before tip labels");
  }
  if (
    /class="cursor-bench-point"[^>]*>[\s\S]*?<title>/.test(svg)
  ) {
    throw new Error("plot points should not use native title tooltips");
  }
  if (!svg.includes("Hover or tap a point")) {
    throw new Error("SVG desc should mention hover/tap tips");
  }
  if (
    svg.includes("focus a point") || svg.includes("Left and Right") ||
    svg.includes("tab to a point")
  ) {
    throw new Error(
      "chart desc should not mention keyboard listbox or Tab tips",
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

Deno.test("committed CursorBench SVG matches render from CSV", () => {
  const expected = renderCursorBenchSvg(loadCursorBenchRows());
  const actual = Deno.readTextFileSync(CURSOR_BENCH_SVG_PATH);
  if (actual !== expected) {
    throw new Error(
      "uses/cursor-bench.svg is stale; run: deno run -A uses/cursor_bench.ts",
    );
  }
});

Deno.test("committed CursorBench CSV marks Cloud Agent picker families at all efforts", () => {
  const rows = parseCursorBenchCsv(
    Deno.readTextFileSync(CURSOR_BENCH_CSV_PATH),
  );
  const cloudModels = rows.filter((row) => row.cursorCloud).map((row) =>
    row.model
  ).sort();
  const expected = [
    "Fable 5.1 Extra High",
    "Fable 5.1 High",
    "Fable 5.1 Low",
    "Fable 5.1 Max",
    "Fable 5.1 Medium",
    "GPT-5.6 Sol Extra High",
    "GPT-5.6 Sol High",
    "GPT-5.6 Sol Low",
    "GPT-5.6 Sol Max",
    "GPT-5.6 Sol Medium",
    "Gemini 3.8 Flash High",
    "Gemini 3.8 Flash Medium",
    "Grok 4.6 Extra High",
    "Grok 4.6 High",
    "Grok 4.6 Low",
    "Grok 4.6 Medium",
    "Grok 4.7 Extra High",
    "Grok 4.7 High",
    "Grok 4.7 Low",
    "Grok 4.7 Medium",
    "Muse Spark 1.3 Extra High",
    "Muse Spark 1.3 High",
    "Muse Spark 1.3 Low",
    "Muse Spark 1.3 Max",
    "Muse Spark 1.3 Medium",
    "Muse Spark 1.3 Minimal",
    "Opus 5.5 Extra High",
    "Opus 5.5 High",
    "Opus 5.5 Low",
    "Opus 5.5 Max",
    "Opus 5.5 Medium",
    "Sonnet 5.5 Extra High",
    "Sonnet 5.5 High",
    "Sonnet 5.5 Low",
    "Sonnet 5.5 Max",
    "Sonnet 5.5 Medium",
  ];
  if (cloudModels.join("\n") !== expected.join("\n")) {
    throw new Error(
      `unexpected Cursor Cloud rows:\n${cloudModels.join("\n")}`,
    );
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
  if (/class="cursor-bench-cloud-ring"[^>]*pointer-events="none"/.test(svg)) {
    throw new Error("cloud rings should receive hover, not skip it");
  }
  if (!svg.includes('class="cursor-bench-cloud-ring"')) {
    throw new Error("cloud ring should be classed so focus can target it");
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
  if (svg.includes('r="6.5"')) {
    throw new Error("SVG unexpectedly included a cloud ring");
  }
});

Deno.test("plot points skip page Tab order and keep a pointer focus ring", () => {
  const csv = `model,score_pct,cost,tokens,steps,cursor_cloud
Right High,50.0,1.00,10,5,-
Left High,50.0,10.00,10,5,-
`;
  const svg = renderCursorBenchSvg(parseCursorBenchCsv(csv));
  if (svg.includes("aria-selected")) {
    throw new Error("expected no selected state");
  }
  assertPlotPointsSkipPageTabOrder(svg, 2);
  if ((svg.match(/role="img"/g) ?? []).length !== 2) {
    throw new Error("expected role=img on every plot point");
  }
  if ((svg.match(/aria-label="/g) ?? []).length !== 2) {
    throw new Error("expected aria-label on every plot point");
  }
  if (
    svg.includes("--active-stroke") || svg.includes(":focus .cursor-bench-dot")
  ) {
    throw new Error("expected no selected/focus stroke on idle dots");
  }
  assertFocusVisibleRingContract(svg);
});

Deno.test("isCursorBenchPageUrl accepts Lume pretty URLs", () => {
  if (!isCursorBenchPageUrl("/uses/cursor/")) {
    throw new Error("expected /uses/cursor/ to be the Cursor page");
  }
  if (isCursorBenchPageUrl("/uses/")) {
    throw new Error("uses index is not the Cursor page");
  }
});

Deno.test("isCursorBenchPageUrl accepts non-pretty page URLs", () => {
  if (!isCursorBenchPageUrl("/uses/cursor")) {
    throw new Error("expected /uses/cursor to be the Cursor page");
  }
  if (!isCursorBenchPageUrl("/uses/cursor.html")) {
    throw new Error("expected /uses/cursor.html to be the Cursor page");
  }
  if (!isCursorBenchPageUrl("/uses/cursor/index.html")) {
    throw new Error("expected /uses/cursor/index.html to be the Cursor page");
  }
  if (isCursorBenchPageUrl("/uses/android.html")) {
    throw new Error("android html is not the Cursor page");
  }
});

Deno.test("isCursorBenchPageSrc accepts Lume source paths", () => {
  if (!isCursorBenchPageSrc({ path: "/uses/cursor", ext: ".md" })) {
    throw new Error("expected Lume src.path /uses/cursor to match");
  }
  if (!isCursorBenchPageSrc({ path: "/uses/cursor.md" })) {
    throw new Error("expected path with .md suffix to match");
  }
  if (!isCursorBenchPageSrc({ path: "uses/cursor", ext: ".md" })) {
    throw new Error("expected src.path without a leading slash to match");
  }
  if (!isCursorBenchPageSrc({ path: "uses/cursor.md" })) {
    throw new Error("expected uses/cursor.md without a leading slash to match");
  }
  if (!isCursorBenchPageSrc({ path: "uses\\cursor" })) {
    throw new Error("expected backslash src.path to match");
  }
  if (isCursorBenchPageSrc({ path: "/uses/obsidian", ext: ".md" })) {
    throw new Error("obsidian source is not the Cursor page");
  }
});

Deno.test("isCursorBenchPage matches source path when URL is not pretty", () => {
  if (
    !isCursorBenchPage({
      text: "",
      data: { url: "/generated/unknown/" },
      src: { path: "/uses/cursor", ext: ".md" },
    })
  ) {
    throw new Error("expected src.path to identify the Cursor page");
  }
});

Deno.test("prepareCursorBenchSvgForHtml strips xml decl and sets layout style", () => {
  const prepared = prepareCursorBenchSvgForHtml(
    `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg"></svg>\n`,
  );
  if (prepared.includes("<?xml")) {
    throw new Error("expected xml declaration to be stripped");
  }
  if (
    !prepared.startsWith(
      '<svg style="width:100%;height:auto;max-width:960px"',
    )
  ) {
    throw new Error(`unexpected inlined svg start: ${prepared.slice(0, 80)}`);
  }
});

Deno.test("replaceCursorBenchEmbedInHtml keeps dollar amounts in the SVG", () => {
  const html =
    `<p><img src="/uses/cursor-bench.svg" alt="CursorBench 4.0 score versus average cost per task"></p>`;
  const inlineSvg = `<svg class="cursor-bench-point"><text>$18</text></svg>`;
  const next = replaceCursorBenchEmbedInHtml(html, inlineSvg);
  if (!next.includes("$18")) {
    throw new Error("expected $18 from SVG to survive String.replace");
  }
  if (next.includes("cursor-bench.svg")) {
    throw new Error("expected img embed to be replaced");
  }
});

Deno.test("inlineCursorBenchChartInPages throws when a non-Cursor page embeds the chart", () => {
  try {
    inlineCursorBenchChartInPages(
      [
        {
          text: `<p><img src="/uses/cursor-bench.svg" alt="chart"></p>`,
          data: { url: "/uses/cursor/" },
        },
        {
          text: `<p><img src="/uses/cursor-bench.svg" alt="copy"></p>`,
          data: { url: "/uses/" },
        },
      ],
      `<svg class="cursor-bench-point"></svg>`,
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("non-Cursor page (/uses/)")
    ) {
      return;
    }
    throw error;
  }
  throw new Error("expected a stray CursorBench embed to throw");
});

Deno.test("inlineCursorBenchChartInPages throws when the Cursor page is missing", () => {
  try {
    inlineCursorBenchChartInPages(
      [{ text: "<p>no chart</p>", data: { url: "/uses/" } }],
      `<svg class="cursor-bench-point"></svg>`,
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("CursorBench page missing")
    ) {
      return;
    }
    throw error;
  }
  throw new Error("expected missing Cursor page to throw");
});

Deno.test("inlineCursorBenchChartInPages throws when the Cursor page has no embed", () => {
  try {
    inlineCursorBenchChartInPages(
      [{ text: "<p>no chart</p>", data: { url: "/uses/cursor/" } }],
      `<svg class="cursor-bench-point"></svg>`,
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("does not embed")
    ) {
      return;
    }
    throw error;
  }
  throw new Error("expected missing embed to throw");
});

Deno.test("inlineCursorBenchChartInPages accepts Cursor src.path without pretty URL", () => {
  const pages = [{
    text: `<p><img src="/uses/cursor-bench.svg" alt="chart"></p>`,
    data: { url: "/generated/unknown/" },
    src: { path: "/uses/cursor", ext: ".md" },
  }];
  inlineCursorBenchChartInPages(
    pages,
    `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"><g class="cursor-bench-point"></g></svg>`,
  );
  if (!pages[0].text.includes('class="cursor-bench-point"')) {
    throw new Error("expected inlined plot points from src.path match");
  }
});

Deno.test("inlineCursorBenchChartInPages inlines the Cursor page", () => {
  const pages = [{
    text:
      `<p><img src="https://mmap.page/uses/cursor-bench.svg" alt="chart"></p>`,
    data: { url: "/uses/cursor/" },
  }];
  inlineCursorBenchChartInPages(
    pages,
    `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"><g class="cursor-bench-point"></g></svg>`,
  );
  if (!pages[0].text.includes('class="cursor-bench-point"')) {
    throw new Error("expected inlined plot points");
  }
  if (pages[0].text.includes("cursor-bench.svg")) {
    throw new Error("expected embed URL to be gone");
  }
});

Deno.test("inlineCursorBenchChartInPages leaves feed children on the img embed", () => {
  const children =
    `<p><img src="/uses/cursor-bench.svg" alt="CursorBench 4.0 score versus average cost per task"></p>`;
  const pages = [{
    text: `<article>${children}</article>`,
    data: { url: "/uses/cursor/", children },
  }];
  inlineCursorBenchChartInPages(
    pages,
    `<?xml version="1.0"?><svg xmlns="http://www.w3.org/2000/svg"><g class="cursor-bench-point"></g></svg>`,
  );
  if (!pages[0].text.includes('class="cursor-bench-point"')) {
    throw new Error("expected page HTML to inline the chart");
  }
  if (pages[0].data.children !== children) {
    throw new Error("feed children should keep the img embed");
  }
});
