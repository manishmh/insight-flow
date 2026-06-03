import type { BoardDataType } from "@/store/slices/boardSlice";

const escapeCsvCell = (value: any): string => {
  if (value === null || value === undefined) return "";
  let str = typeof value === "object" ? JSON.stringify(value) : String(value);
  if (/[",\n\r]/.test(str)) {
    str = `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

const getCell = (row: any, columns: string[], index: number): any =>
  Array.isArray(row) ? row[index] : row?.[columns[index]];

/** Serialize board rows + columns to a CSV string. */
export const boardDataToCsv = (data: BoardDataType): string => {
  const columns = data.data.columns ?? [];
  const rows = data.data.data ?? [];
  const header = columns.map(escapeCsvCell).join(",");
  const body = rows
    .map((row) => columns.map((_, i) => escapeCsvCell(getCell(row, columns, i))).join(","))
    .join("\n");
  return body ? `${header}\n${body}` : header;
};

/** Trigger a browser download of the board's data as a .csv file. */
export const exportBoardCsv = (data: BoardDataType) => {
  if (typeof window === "undefined") return;
  const csv = boardDataToCsv(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeName = (data.name || "data").replace(/[^a-z0-9-_]+/gi, "_").toLowerCase();
  link.href = url;
  link.download = `${safeName}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
