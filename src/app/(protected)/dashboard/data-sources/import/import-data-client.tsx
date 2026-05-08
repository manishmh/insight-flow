"use client";

import { CreateDashboardFromImportedData } from "@/server/components/dashboard-commands";
import { saveData } from "@/server/components/indexedDB";
import { useAppDispatch } from "@/store/hooks";
import { addDashboard } from "@/store/slices/dashboardSlice";
import { setTableState } from "@/utils/localStorage";
import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { FaFileCsv, FaFileImport } from "react-icons/fa6";
import { LuFileJson, LuLoader2, LuUpload } from "react-icons/lu";
import { toast } from "sonner";

type ParsedImport = {
  name: string;
  columns: string[];
  rows: any[];
  columnsInfo: Record<string, { dataType: string }>;
};

const normalizeName = (name: string) =>
  name
    .replace(/\.[^/.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseCsv = (text: string) => {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      cell += '"';
      i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      row.push(cell.trim());
      cell = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      row.push(cell.trim());
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += char;
    }
  }

  row.push(cell.trim());
  if (row.some((value) => value !== "")) rows.push(row);
  if (rows.length < 2) throw new Error("CSV must include a header row and at least one data row.");

  const columns = rows[0].map((column, index) => column || `Column ${index + 1}`);
  const dataRows = rows.slice(1).map((values) =>
    columns.reduce<Record<string, string>>((result, column, index) => {
      result[column] = values[index] ?? "";
      return result;
    }, {})
  );

  return { columns, rows: dataRows };
};

const getFirstArray = (value: any): any[] => {
  if (Array.isArray(value)) return value;
  if (!value || typeof value !== "object") return [];
  if (Array.isArray(value.data)) return value.data;

  for (const key of Object.keys(value)) {
    if (Array.isArray(value[key])) return value[key];
  }

  return [];
};

const normalizeJson = (text: string) => {
  const parsed = JSON.parse(text);
  const rows = getFirstArray(parsed);
  const explicitColumns = parsed?.columns;

  if (!rows.length) throw new Error("JSON must contain an array of rows or a { data: [...] } object.");

  let columns: string[] = Array.isArray(explicitColumns) ? explicitColumns.map(String) : [];

  if (!columns.length) {
    const firstObject = rows.find((row) => row && typeof row === "object");
    if (Array.isArray(firstObject)) {
      columns = Array.from({ length: firstObject.length }, (_, index) => `Column ${index + 1}`);
    } else if (firstObject) {
      const keys = new Set<string>();
      rows.slice(0, 100).forEach((row) => {
        if (row && typeof row === "object" && !Array.isArray(row)) {
          Object.keys(row).forEach((key) => keys.add(key));
        }
      });
      columns = Array.from(keys);
    }
  }

  if (!columns.length) throw new Error("Could not detect columns from this JSON file.");

  const dataRows = rows.map((row) => {
    if (Array.isArray(row)) {
      return columns.reduce<Record<string, any>>((result, column, index) => {
        result[column] = row[index] ?? null;
        return result;
      }, {});
    }
    return row;
  });

  return { columns, rows: dataRows };
};

const inferType = (value: any) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "boolean") return "Boolean";
  if (typeof value === "number" || (!Number.isNaN(Number(value)) && String(value).trim() !== "")) return "Number";
  if (typeof value === "object") return "Object";
  if (typeof value === "string" && /^https?:\/\//i.test(value)) return "Url";
  if (typeof value === "string" && !Number.isNaN(new Date(value).getTime()) && /^\d{4}-\d{2}-\d{2}/.test(value)) return "Date";
  return "String";
};

const buildColumnsInfo = (columns: string[], rows: any[]) =>
  columns.reduce<Record<string, { dataType: string }>>((info, column) => {
    const type =
      rows
        .slice(0, 100)
        .map((row) => inferType(row?.[column]))
        .find(Boolean) ?? "String";
    info[column] = { dataType: type };
    return info;
  }, {});

const parseImportFile = async (file: File): Promise<ParsedImport> => {
  const text = await file.text();
  if (!text.trim()) throw new Error("The selected file is empty.");

  const extension = file.name.split(".").pop()?.toLowerCase();
  const parsed = extension === "csv" ? parseCsv(text) : normalizeJson(text);
  const name = normalizeName(file.name) || "Imported Data";

  return {
    name,
    columns: parsed.columns,
    rows: parsed.rows,
    columnsInfo: buildColumnsInfo(parsed.columns, parsed.rows),
  };
};

export default function ImportDataClient() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [sourceName, setSourceName] = useState("");
  const [preview, setPreview] = useState<ParsedImport | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isLoading = isParsing || isPending;
  const displayName = sourceName.trim() || preview?.name || file?.name || "";
  const previewRows = useMemo(() => preview?.rows.slice(0, 5) ?? [], [preview]);

  const handleFileChange = async (selectedFile: File | null) => {
    setFile(selectedFile);
    setPreview(null);
    if (!selectedFile) return;

    setIsParsing(true);
    try {
      const parsed = await parseImportFile(selectedFile);
      setPreview(parsed);
      setSourceName((current) => current || parsed.name);
      toast.success("File parsed successfully.");
    } catch (error) {
      setFile(null);
      toast.error(error instanceof Error ? error.message : "Failed to parse file.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = () => {
    if (!preview) {
      toast.error("Choose a JSON or CSV file first.");
      return;
    }

    startTransition(async () => {
      try {
        const dataId =
          typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : Math.random().toString(36).slice(2);
        const name = displayName.trim() || "Imported Data";

        await saveData(dataId, name, {
          id: dataId,
          name,
          data: {
            columns: preview.columns,
            data: preview.rows,
            columnsInfo: preview.columnsInfo,
            duration: 0,
            updatedAt: Date.now(),
          },
        });

        setTableState(dataId, { activeColumns: preview.columns });

        const dashboard = await CreateDashboardFromImportedData({
          dashboardName: name,
          sourceName: name,
          dataId,
        });

        if (!dashboard) throw new Error("Failed to create dashboard for imported data.");

        dispatch(addDashboard(dashboard));
        toast.success("Dashboard created from imported data.");
        router.push(`/dashboard/${dashboard.id}`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Import failed.");
      }
    });
  };

  return (
    <div className="h-full w-full overflow-y-auto p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="border-b border-gray-200 pb-5">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-cyan-50 text-cyan-600">
              <FaFileImport />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Import Data</h1>
              <p className="mt-1 text-sm text-gray-500">
                Upload JSON or CSV data, preview it, then create a dashboard with a table block.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <div className="space-y-5">
            <label className="block rounded-lg border border-dashed border-gray-300 bg-white p-5 text-center shadow-sm transition-colors hover:border-cyan-400">
              <input
                type="file"
                accept=".json,.csv,application/json,text/csv"
                className="hidden"
                disabled={isLoading}
                onChange={(event) => handleFileChange(event.target.files?.[0] ?? null)}
              />
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-gray-50 text-xl text-cyan-600">
                <LuUpload />
              </div>
              <div className="mt-3 text-sm font-semibold text-gray-800">
                {file ? file.name : "Choose a JSON or CSV file"}
              </div>
              <div className="mt-1 text-xs text-gray-500">JSON arrays, JSON {`{ data: [...] }`}, and CSV files are supported.</div>
            </label>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Dashboard name</label>
              <input
                value={sourceName}
                disabled={isLoading}
                onChange={(event) => setSourceName(event.target.value)}
                placeholder="Imported customers"
                className="w-full rounded-lg border border-gray-300 bg-[#f4f7f9] p-3 text-sm outline-none transition-all hover:border-gray-400 focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>

            <button
              type="button"
              onClick={handleImport}
              disabled={!preview || isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-cyan-300"
            >
              {isLoading ? (
                <>
                  <LuLoader2 className="animate-spin" /> Importing and parsing...
                </>
              ) : (
                "Create dashboard"
              )}
            </button>
          </div>

          <div className="min-h-[420px] rounded-lg border border-gray-200 bg-white shadow-sm">
            {preview ? (
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                  <div>
                    <h2 className="font-semibold text-gray-800">{displayName}</h2>
                    <p className="text-xs text-gray-500">
                      {preview.rows.length.toLocaleString()} rows, {preview.columns.length.toLocaleString()} columns detected
                    </p>
                  </div>
                  <div className="flex gap-2 text-gray-400">
                    <LuFileJson />
                    <FaFileCsv />
                  </div>
                </div>
                <div className="overflow-auto p-4">
                  <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        {preview.columns.map((column) => (
                          <th key={column} className="px-3 py-2 text-[10px] font-bold uppercase tracking-wide text-gray-500">
                            {column}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewRows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-50">
                          {preview.columns.map((column) => (
                            <td key={column} className="max-w-[220px] truncate px-3 py-2 text-gray-700">
                              {typeof row?.[column] === "object"
                                ? JSON.stringify(row?.[column])
                                : String(row?.[column] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[420px] flex-col items-center justify-center gap-3 text-gray-500">
                <div className="grid h-14 w-14 place-items-center rounded-lg border border-gray-200 text-2xl">
                  <FaFileImport />
                </div>
                <div className="text-sm font-medium">A preview appears after parsing.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
