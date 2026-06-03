import type { BoardDataType } from "@/store/slices/boardSlice";

const SCAN_LIMIT = 5000;

const getCell = (row: any, columns: string[], index: number): any =>
  Array.isArray(row) ? row[index] : row?.[columns[index]];

const toNumber = (value: any): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export interface ColumnInsight {
  column: string;
  count: number;
  sum: number;
  avg: number;
  min: number;
  max: number;
  stdDev: number;
  /** Indices (within the scanned set) of values beyond mean ± 2σ. */
  anomalies: { value: number; rowIndex: number }[];
}

export interface DatasetInsights {
  totalRows: number;
  scannedRows: number;
  numericColumns: ColumnInsight[];
}

/** Compute descriptive stats and simple (2σ) anomaly flags for numeric columns. */
export const computeInsights = (data: BoardDataType): DatasetInsights => {
  const columns = data.data.columns ?? [];
  const rows = data.data.data ?? [];
  const scannedRows = Math.min(rows.length, SCAN_LIMIT);

  const numericColumns: ColumnInsight[] = [];

  for (let c = 0; c < columns.length; c++) {
    const values: number[] = [];
    const rowIndexes: number[] = [];
    for (let r = 0; r < scannedRows; r++) {
      const n = toNumber(getCell(rows[r], columns, c));
      if (n !== null) {
        values.push(n);
        rowIndexes.push(r);
      }
    }
    // Treat a column as numeric only when at least half the scanned cells parse.
    if (values.length < scannedRows * 0.5 || values.length === 0) continue;

    const count = values.length;
    let sum = 0;
    let min = values[0];
    let max = values[0];
    for (const v of values) {
      sum += v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
    const avg = sum / count;
    let variance = 0;
    for (const v of values) variance += (v - avg) ** 2;
    const stdDev = Math.sqrt(variance / count);

    const anomalies: { value: number; rowIndex: number }[] = [];
    if (stdDev > 0) {
      for (let i = 0; i < values.length; i++) {
        if (Math.abs(values[i] - avg) > 2 * stdDev) {
          anomalies.push({ value: values[i], rowIndex: rowIndexes[i] });
        }
      }
    }

    numericColumns.push({
      column: columns[c],
      count,
      sum,
      avg,
      min,
      max,
      stdDev,
      anomalies: anomalies.slice(0, 10),
    });
  }

  return { totalRows: rows.length, scannedRows, numericColumns };
};

export const formatNumber = (n: number): string => {
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1000) return n.toLocaleString(undefined, { maximumFractionDigits: 1 });
  return n.toLocaleString(undefined, { maximumFractionDigits: 2 });
};
