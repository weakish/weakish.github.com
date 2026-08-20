import { parse } from "@std/csv";

export interface CursorBenchRow {
  model: string;
  family: string;
  effort: string;
  scorePct: number;
  cost: number;
  tokens: number;
  steps: number;
  cursorCloud: boolean;
}

const EFFORTS = ["Extra High", "Medium", "High", "Low", "Max"] as const;

const EFFORT_LINE_ORDER: Record<string, number> = {
  Low: 0,
  Medium: 1,
  High: 2,
  "Extra High": 3,
  Max: 4,
};

export const CURSOR_BENCH_CSV_PATH = new URL(
  "./cursor-bench.csv",
  import.meta.url,
).pathname;

export const CURSOR_BENCH_SVG_PATH = new URL(
  "./cursor-bench.svg",
  import.meta.url,
).pathname;

export function splitCursorBenchModelName(
  model: string,
): { family: string; effort: string } {
  for (const effort of EFFORTS) {
    const suffix = ` ${effort}`;
    if (model.endsWith(suffix)) {
      return { family: model.slice(0, -suffix.length), effort };
    }
  }
  return { family: model, effort: "" };
}

function requiredCsvField(
  record: Record<string, string>,
  field: string,
): string {
  const value = record[field];
  if (value === undefined || value === "") {
    throw new Error(`CursorBench CSV row missing ${field}`);
  }
  return value;
}

function requiredCsvNumber(
  record: Record<string, string>,
  field: string,
): number {
  const value = Number(requiredCsvField(record, field));
  if (!Number.isFinite(value)) {
    throw new Error(`CursorBench CSV row has non-numeric ${field}`);
  }
  return value;
}

function requiredCsvCursorCloud(record: Record<string, string>): boolean {
  const value = requiredCsvField(record, "cursor_cloud");
  if (value === "yes") return true;
  if (value === "-") return false;
  throw new Error(`CursorBench CSV row has invalid cursor_cloud: ${value}`);
}

export function parseCursorBenchCsv(csv: string): CursorBenchRow[] {
  const records = parse(csv, { skipFirstRow: true, strip: true });
  return records.map((record) => {
    const model = requiredCsvField(record, "model");
    const { family, effort } = splitCursorBenchModelName(model);
    return {
      model,
      family,
      effort,
      scorePct: requiredCsvNumber(record, "score_pct"),
      cost: requiredCsvNumber(record, "cost"),
      tokens: requiredCsvNumber(record, "tokens"),
      steps: requiredCsvNumber(record, "steps"),
      cursorCloud: requiredCsvCursorCloud(record),
    };
  });
}

export function loadCursorBenchRows(
  path = CURSOR_BENCH_CSV_PATH,
): CursorBenchRow[] {
  return parseCursorBenchCsv(Deno.readTextFileSync(path));
}

const WIDTH = 960;
const HEIGHT = 540;
const MARGIN = { top: 28, right: 196, bottom: 48, left: 52 };
const PLOT_LEFT = MARGIN.left;
const PLOT_RIGHT = WIDTH - MARGIN.right;
const PLOT_TOP = MARGIN.top;
const PLOT_BOTTOM = HEIGHT - MARGIN.bottom;
const COST_MIN = 0;
const COST_MAX = 18;
const SCORE_MIN = 35;
const SCORE_MAX = 75;

// Okabe-Ito / Tol muted base, plus Tol bright/vibrant extensions (color-blind safe).
const FAMILY_PALETTE = [
  "#0072b2",
  "#d55e00",
  "#e69f00",
  "#009e73",
  "#56b4e9",
  "#cc79a7",
  "#882255",
  "#44aa99",
  "#332288",
  "#117733",
  "#aa4499",
  "#999933",
  "#000000",
  "#ddcc77",
  "#661100",
  "#88ccee",
  "#cc6677",
  "#999999",
  "#4477aa",
  "#ee6677",
  "#ccbb44",
  "#ee7733",
  "#cc3311",
  "#aa3377",
] as const;

function compareUtf16(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

function hashFamilyName(family: string): number {
  let hash = 0;
  for (let i = 0; i < family.length; i++) {
    hash = Math.imul(31, hash) + family.charCodeAt(i);
    hash >>>= 0;
  }
  return hash;
}

export function cursorBenchColorsForFamilies(
  families: string[],
): Map<string, string> {
  const unique = [...new Set(families)].sort(compareUtf16);
  const used = new Set<number>();
  const colors = new Map<string, string>();
  const paletteSize = FAMILY_PALETTE.length;
  for (const family of unique) {
    let index = hashFamilyName(family) % paletteSize;
    const start = index;
    while (used.has(index)) {
      index = (index + 1) % paletteSize;
      if (index === start) {
        throw new Error(
          `CursorBench palette exhausted (${paletteSize} colors)`,
        );
      }
    }
    used.add(index);
    colors.set(family, FAMILY_PALETTE[index]);
  }
  return colors;
}

function colorForFamily(
  familyColors: Map<string, string>,
  family: string,
): string {
  const color = familyColors.get(family);
  if (!color) {
    throw new Error(`missing CursorBench color for family: ${family}`);
  }
  return color;
}

export function cursorBenchCostToX(cost: number): number {
  const t = (cost - COST_MIN) / (COST_MAX - COST_MIN);
  return PLOT_RIGHT - t * (PLOT_RIGHT - PLOT_LEFT);
}

export function cursorBenchScoreToY(scorePct: number): number {
  const t = (scorePct - SCORE_MIN) / (SCORE_MAX - SCORE_MIN);
  return PLOT_BOTTOM - t * (PLOT_BOTTOM - PLOT_TOP);
}

function escapeXml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cursorBenchPointGroupMarkup(options: {
  pointId: string;
  cx: string;
  cy: string;
  color: string;
  escapedTooltip: string;
  cloudRing: string;
}): string {
  const { pointId, cx, cy, color, escapedTooltip, cloudRing } = options;
  return [
    `<g class="cursor-bench-point" id="${pointId}" role="img" tabindex="-1" aria-label="${escapedTooltip}">`,
    `<circle class="cursor-bench-dot" cx="${cx}" cy="${cy}" r="3.5" fill="${color}" stroke="#fff" stroke-width="0.8"/>`,
    cloudRing,
    `<circle class="cursor-bench-hit" cx="${cx}" cy="${cy}" r="12" fill="none" pointer-events="all"/>`,
    `</g>`,
  ].join("");
}

function uniqueFamiliesInScoreOrder(rows: CursorBenchRow[]): string[] {
  const best = new Map<string, number>();
  for (const row of rows) {
    const previous = best.get(row.family) ?? -Infinity;
    if (row.scorePct > previous) best.set(row.family, row.scorePct);
  }
  return [...best.entries()]
    .sort((a, b) => b[1] - a[1] || compareUtf16(a[0], b[0]))
    .map(([family]) => family);
}

function compareFamilyRowsByEffort(
  a: CursorBenchRow,
  b: CursorBenchRow,
): number {
  const orderA = EFFORT_LINE_ORDER[a.effort] ?? Number.POSITIVE_INFINITY;
  const orderB = EFFORT_LINE_ORDER[b.effort] ?? Number.POSITIVE_INFINITY;
  return orderA - orderB || compareUtf16(a.model, b.model);
}

function polylineForFamily(rows: CursorBenchRow[]): string {
  const sorted = [...rows].sort(compareFamilyRowsByEffort);
  return sorted
    .map((row) =>
      `${cursorBenchCostToX(row.cost).toFixed(1)},${
        cursorBenchScoreToY(row.scorePct).toFixed(1)
      }`
    )
    .join(" ");
}

function groupCursorBenchRowsByFamily(
  rows: CursorBenchRow[],
): Map<string, CursorBenchRow[]> {
  const byFamily = new Map<string, CursorBenchRow[]>();
  for (const row of rows) {
    const familyRows = byFamily.get(row.family);
    if (familyRows) familyRows.push(row);
    else byFamily.set(row.family, [row]);
  }
  return byFamily;
}

function rowsForFamily(
  rowsByFamily: Map<string, CursorBenchRow[]>,
  family: string,
): CursorBenchRow[] {
  const familyRows = rowsByFamily.get(family);
  if (!familyRows) {
    throw new Error(`missing CursorBench rows for family: ${family}`);
  }
  return familyRows;
}

export function renderCursorBenchSvg(rows: CursorBenchRow[]): string {
  const families = uniqueFamiliesInScoreOrder(rows);
  const familyColors = cursorBenchColorsForFamilies(families);
  const yTicks = [75, 70, 65, 60, 55, 50, 45, 40, 35];
  const xTicks = [18, 15, 12, 9, 6, 3, 0];

  const grid = [
    ...yTicks.map((score) => {
      const y = cursorBenchScoreToY(score);
      return `<line x1="${PLOT_LEFT}" y1="${
        y.toFixed(1)
      }" x2="${PLOT_RIGHT}" y2="${y.toFixed(1)}" stroke="#eee"/>`;
    }),
    ...xTicks.map((cost) => {
      const x = cursorBenchCostToX(cost);
      return `<line x1="${x.toFixed(1)}" y1="${PLOT_TOP}" x2="${
        x.toFixed(1)
      }" y2="${PLOT_BOTTOM}" stroke="#eee"/>`;
    }),
  ].join("");

  const yLabels = yTicks.map((score) => {
    const y = cursorBenchScoreToY(score);
    return `<text x="${PLOT_LEFT - 8}" y="${
      (y + 4).toFixed(1)
    }" text-anchor="end">${score}%</text>`;
  }).join("");

  const xLabels = xTicks.map((cost) => {
    const x = cursorBenchCostToX(cost);
    return `<text x="${x.toFixed(1)}" y="${
      PLOT_BOTTOM + 20
    }" text-anchor="middle">$${cost}</text>`;
  }).join("");

  const rowsByFamily = groupCursorBenchRowsByFamily(rows);
  const polylines = families.map((family) => {
    const color = colorForFamily(familyColors, family);
    const familyRows = rowsForFamily(rowsByFamily, family);
    if (familyRows.length < 2) return "";
    return `<polyline fill="none" stroke="${color}" stroke-width="1.5" points="${
      polylineForFamily(familyRows)
    }"/>`;
  }).join("");

  // Dots first, then tips, so labels paint above every family. CSS :has()
  // ties hover/active/focus on a dot to its tip (tips are not descendants).
  // tabindex=-1 is not in page Tab order; tap/click can still focus so the
  // tip stays after release.
  const pointGroupsByFamily: string[][] = [];
  const tipLabels: string[] = [];
  const tipRules: string[] = [];
  let pointIndex = 0;
  for (const family of families) {
    const color = colorForFamily(familyColors, family);
    const familyRows = [...rowsForFamily(rowsByFamily, family)]
      .sort(compareFamilyRowsByEffort);
    const familyGroups: string[] = [];
    for (const row of familyRows) {
      const pointId = `cursor-bench-p${pointIndex}`;
      const tipId = `cursor-bench-t${pointIndex}`;
      pointIndex += 1;
      const cxNum = cursorBenchCostToX(row.cost);
      const cyNum = cursorBenchScoreToY(row.scorePct);
      const cx = cxNum.toFixed(1);
      const cy = cyNum.toFixed(1);
      const tooltip = row.cursorCloud
        ? `${row.model}: ${row.scorePct}% · $${
          row.cost.toFixed(2)
        }/task · Cursor Cloud`
        : `${row.model}: ${row.scorePct}% · $${row.cost.toFixed(2)}/task`;
      const escapedTooltip = escapeXml(tooltip);
      // Prefer tips toward the plot center so they stay clear of axes/legend.
      const tipOnLeft = cxNum > (PLOT_LEFT + PLOT_RIGHT) / 2;
      const cloudRing = row.cursorCloud
        ? `<circle class="cursor-bench-cloud-ring" cx="${cx}" cy="${cy}" r="6.5" fill="none" stroke="${color}" stroke-width="1.2"/>`
        : "";
      familyGroups.push(
        cursorBenchPointGroupMarkup({
          pointId,
          cx,
          cy,
          color,
          escapedTooltip,
          cloudRing,
        }),
      );
      tipLabels.push(
        `<text class="cursor-bench-tip" id="${tipId}" aria-hidden="true" x="${
          (tipOnLeft ? cxNum - 8 : cxNum + 8).toFixed(1)
        }" y="${(cyNum - 10).toFixed(1)}" text-anchor="${
          tipOnLeft ? "end" : "start"
        }" paint-order="stroke" stroke="#fff" stroke-width="4">${escapedTooltip}</text>`,
      );
      tipRules.push(
        `.cursor-bench-chart:has(#${pointId}:is(:hover,:active,:focus-within)) #${tipId} { opacity: 1; }`,
      );
    }
    pointGroupsByFamily.push(familyGroups);
  }
  // SVG z-index is ignored in Firefox/Safari, so paint later = win hits.
  // Reverse score order: higher-score families last. Low→Max within a
  // family still paints later efforts on top.
  const points = `<g class="cursor-bench-points">${
    pointGroupsByFamily.toReversed().map((groups) => groups.join("")).join("")
  }</g>`;
  const tips = tipLabels.join("");
  const tipCss = tipRules.join("\n    ");

  const legendEntries = families.map((family, index) => {
    const color = colorForFamily(familyColors, family);
    const y = PLOT_TOP + 12 + index * 18;
    return `<circle cx="${
      PLOT_RIGHT + 14
    }" cy="${y}" r="4" fill="${color}"/><text x="${PLOT_RIGHT + 24}" y="${
      y + 4
    }">${escapeXml(family)}</text>`;
  }).join("");

  const hasCursorCloud = rows.some((row) => row.cursorCloud);
  const cloudLegendY = PLOT_TOP + 12 + families.length * 18 + 8;
  const cloudLegend = hasCursorCloud
    ? `<circle cx="${
      PLOT_RIGHT + 14
    }" cy="${cloudLegendY}" r="3.5" fill="#555" stroke="#fff" stroke-width="0.8"/><circle cx="${
      PLOT_RIGHT + 14
    }" cy="${cloudLegendY}" r="6.5" fill="none" stroke="#555" stroke-width="1.2"/><text x="${
      PLOT_RIGHT + 24
    }" y="${cloudLegendY + 4}">Cursor Cloud</text>`
    : "";

  const legend = `${legendEntries}${cloudLegend}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg class="cursor-bench-chart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" fill="#333" role="group" aria-labelledby="cursor-bench-title" aria-describedby="cursor-bench-desc">
  <title id="cursor-bench-title">CursorBench 3.2 score versus average cost per task</title>
  <desc id="cursor-bench-desc">Scatter plot of CursorBench 3.2 correctness against average USD cost per task. Cost decreases toward the right so the upper-right is higher score at lower cost. Points from the same model family are connected Low, Medium, High, Extra High, then Max. An outer ring marks the Cloud Agent picker default effort preset for that family, not every configurable option in the picker. Hover or tap a point for the model name and effort.</desc>
  <style><![CDATA[
    .cursor-bench-chart .cursor-bench-point { cursor: pointer; }
    .cursor-bench-chart .cursor-bench-point:focus { outline: none; }
    .cursor-bench-chart .cursor-bench-point:focus-visible .cursor-bench-dot,
    .cursor-bench-chart .cursor-bench-point:focus-visible .cursor-bench-cloud-ring {
      stroke: #fff;
      stroke-width: 2.5;
      filter: drop-shadow(0 0 1px #fff) drop-shadow(0 0 2px #333);
    }
    .cursor-bench-chart .cursor-bench-tip { opacity: 0; pointer-events: none; }
    ${tipCss}
  ]]></style>
  ${grid}
  <line x1="${PLOT_LEFT}" y1="${PLOT_BOTTOM}" x2="${PLOT_RIGHT}" y2="${PLOT_BOTTOM}" stroke="#333"/>
  <line x1="${PLOT_LEFT}" y1="${PLOT_TOP}" x2="${PLOT_LEFT}" y2="${PLOT_BOTTOM}" stroke="#333"/>
  ${yLabels}
  ${xLabels}
  <text x="${(PLOT_LEFT + PLOT_RIGHT) / 2}" y="${
    HEIGHT - 8
  }" text-anchor="middle">Average cost per task (higher cost on the left)</text>
  <text x="16" y="${
    (PLOT_TOP + PLOT_BOTTOM) / 2
  }" text-anchor="middle" transform="rotate(-90 16 ${
    (PLOT_TOP + PLOT_BOTTOM) / 2
  })">CursorBench 3.2 score</text>
  ${polylines}
  ${legend}
  ${points}
  ${tips}
</svg>
`;
}

export interface CursorBenchHtmlPage {
  text: string;
  data: { url?: unknown; children?: unknown };
  src?: { path?: unknown; ext?: unknown };
}

const CURSOR_BENCH_EMBED_RE =
  /<img\b[^>]*\bsrc=["'][^"']*\/uses\/cursor-bench\.svg["'][^>]*\/?>/i;

export function isCursorBenchPageUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  return url === "/uses/cursor/" || url === "/uses/cursor" ||
    url === "/uses/cursor.html" || url === "/uses/cursor/index.html";
}

function isCursorBenchSourcePath(path: string): boolean {
  const normalized = path.replaceAll("\\", "/").replace(/^\.\//, "");
  return normalized === "uses/cursor" ||
    normalized === "uses/cursor.md" ||
    normalized.endsWith("/uses/cursor") ||
    normalized.endsWith("/uses/cursor.md");
}

export function isCursorBenchPageSrc(src: unknown): boolean {
  if (typeof src !== "object" || src === null) return false;
  if (!("path" in src) || typeof src.path !== "string") return false;
  return isCursorBenchSourcePath(src.path);
}

export function isCursorBenchPage(page: CursorBenchHtmlPage): boolean {
  return isCursorBenchPageUrl(page.data.url) || isCursorBenchPageSrc(page.src);
}

export function htmlEmbedsCursorBenchSvg(html: string): boolean {
  return CURSOR_BENCH_EMBED_RE.test(html);
}

export function prepareCursorBenchSvgForHtml(svg: string): string {
  const withoutXml = svg.replace(/^<\?xml[^>]*\?>\s*/, "").trim();
  if (!withoutXml.startsWith("<svg")) {
    throw new Error("CursorBench SVG missing <svg> root");
  }
  return withoutXml.replace(
    /^<svg\b/,
    '<svg style="width:100%;height:auto;max-width:960px"',
  );
}

export function replaceCursorBenchEmbedInHtml(
  html: string,
  inlineSvg: string,
): string {
  if (!htmlEmbedsCursorBenchSvg(html)) {
    throw new Error("HTML does not embed CursorBench SVG");
  }
  if (!inlineSvg.includes('class="cursor-bench-point"')) {
    throw new Error("inline CursorBench SVG missing plot points");
  }
  const next = html.replace(CURSOR_BENCH_EMBED_RE, () => inlineSvg);
  if (next === html || htmlEmbedsCursorBenchSvg(next)) {
    throw new Error("failed to inline CursorBench SVG");
  }
  return next;
}

function cursorBenchPageLabel(page: CursorBenchHtmlPage): string {
  const parts: string[] = [];
  if (typeof page.data.url === "string") {
    parts.push(page.data.url);
  }
  if (
    typeof page.src === "object" && page.src !== null &&
    "path" in page.src && typeof page.src.path === "string"
  ) {
    parts.push(`src:${page.src.path}`);
  }
  return parts.length > 0 ? parts.join(" ") : "unknown page";
}

export function inlineCursorBenchChartInPages(
  pages: Iterable<CursorBenchHtmlPage>,
  svgSource: string,
): void {
  const inlineSvg = prepareCursorBenchSvgForHtml(svgSource);
  let sawCursorPage = false;
  for (const page of pages) {
    if (isCursorBenchPage(page)) {
      sawCursorPage = true;
      page.text = replaceCursorBenchEmbedInHtml(page.text, inlineSvg);
      continue;
    }
    if (htmlEmbedsCursorBenchSvg(page.text)) {
      throw new Error(
        `CursorBench SVG embed on non-Cursor page (${
          cursorBenchPageLabel(page)
        })`,
      );
    }
  }
  if (!sawCursorPage) {
    throw new Error("CursorBench page missing from HTML output");
  }
}

export function writeCursorBenchSvg(
  csvPath = CURSOR_BENCH_CSV_PATH,
  svgPath = CURSOR_BENCH_SVG_PATH,
): void {
  const svg = renderCursorBenchSvg(loadCursorBenchRows(csvPath));
  Deno.writeTextFileSync(svgPath, svg);
}

if (import.meta.main) {
  writeCursorBenchSvg();
}
