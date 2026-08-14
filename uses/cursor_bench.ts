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

  const series = families.map((family) => {
    const color = colorForFamily(familyColors, family);
    const familyRows = rows.filter((row) => row.family === family)
      .sort(compareFamilyRowsByEffort);
    const line = familyRows.length > 1
      ? `<polyline fill="none" stroke="${color}" stroke-width="1.5" points="${
        polylineForFamily(familyRows)
      }"/>`
      : "";
    const dots = familyRows.map((row) => {
      const cx = cursorBenchCostToX(row.cost).toFixed(1);
      const cy = cursorBenchScoreToY(row.scorePct).toFixed(1);
      const tooltip = row.cursorCloud
        ? `${row.model}: ${row.scorePct}% · $${
          row.cost.toFixed(2)
        }/task · Cursor Cloud`
        : `${row.model}: ${row.scorePct}% · $${row.cost.toFixed(2)}/task`;
      const baseDot =
        `<circle cx="${cx}" cy="${cy}" r="3.5" fill="${color}" stroke="#fff" stroke-width="0.8"><title>${
          escapeXml(tooltip)
        }</title></circle>`;
      const cloudRing = row.cursorCloud
        ? `<circle cx="${cx}" cy="${cy}" r="6.5" fill="none" stroke="${color}" stroke-width="1.2" pointer-events="none"/>`
        : "";
      return `${baseDot}${cloudRing}`;
    }).join("");
    return `${line}${dots}`;
  }).join("");

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
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" role="img" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" fill="#333">
  <title>CursorBench 3.2 score versus average cost per task</title>
  <desc>Scatter plot of CursorBench 3.2 correctness against average USD cost per task. Cost decreases toward the right so the upper-right is higher score at lower cost. Points from the same model family are connected Low, Medium, High, Extra High, then Max. An outer ring marks the Cloud Agent picker default effort preset for that family, not every configurable option in the picker. Hover a point for the model name and effort.</desc>
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
  ${series}
  ${legend}
</svg>
`;
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
