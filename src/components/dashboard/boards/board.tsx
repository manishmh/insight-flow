import Table from "@/components/global/charts/table";
import BarChart from "@/components/global/charts/bar";
import LineChartComp from "@/components/global/charts/line";
import AreaChartComp from "@/components/global/charts/area";
import ScatterChartComp from "@/components/global/charts/scatter";
import PieChartComp from "@/components/global/charts/pie";
import SingleValueComp from "@/components/global/charts/single-value";
import type { barDataType } from "@/components/global/charts/bar";
import type { scatterChartDataType } from "@/components/global/charts/scatter";
import type { pieChartDataType } from "@/components/global/charts/pie";
import type { singleValueDataType } from "@/components/global/charts/single-value";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setActiveBoard, setBoardData, setBoardDataLoadingId, setBoardVisualization, type BoardVisualizationType } from "@/store/slices/boardSlice";
import { toggleSidepane } from "@/store/slices/uiSlice";
import {
  fetchSampleDataWithId,
} from "@/server/components/block-functions";
import { fetchDataById } from "@/server/components/indexedDB";
import { Board } from "@prisma/client";
import { useEffect, useMemo, useState, useTransition } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { RotatingLines } from "react-loader-spinner";

export interface BoardDataType {
  id: string;
  boardId: string;
  name: string;
  data: {
    data: any[];
    columns: string[];
    columnsInfo: any[];
    duration: number;
    updatedAt: number;
  };
}

const CHART_RECORDS_PER_PAGE = 200;
const NUMERIC_COLUMN_SCAN_LIMIT = 1000;
const PIE_SLICE_LIMIT = 24;

type ChartTransformOptions = {
  page?: number;
  pageSize?: number;
  maxScanRows?: number;
};

const getCell = (row: any, columns: string[], colIndex: number): any =>
  Array.isArray(row) ? row[colIndex] : row?.[columns[colIndex]];

const toFiniteNumber = (value: any): number | null => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string" && value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getPagedRows = (rows: any[], page = 1, pageSize = CHART_RECORDS_PER_PAGE) => {
  const currentPage = Math.max(1, page);
  const start = (currentPage - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    start,
  };
};

const getNumericColumns = (
  rows: any[],
  columns: string[],
  maxScanRows = NUMERIC_COLUMN_SCAN_LIMIT
) => {
  const scanCount = Math.min(rows.length, maxScanRows);
  if (!scanCount) return [];

  const numericColumns: number[] = [];
  const threshold = scanCount * 0.5;

  for (let c = 0; c < columns.length; c++) {
    let validCount = 0;
    for (let r = 0; r < scanCount; r++) {
      if (toFiniteNumber(getCell(rows[r], columns, c)) !== null) validCount++;
    }
    if (validCount >= threshold) numericColumns.push(c);
  }

  return numericColumns;
};

/** Transform board table data into chart format for the current page only. */
function boardDataToBarFormat(
  boardData: BoardDataType,
  options: ChartTransformOptions = {}
): barDataType | null {
  const { data: rows, columns } = boardData.data;
  if (!rows?.length || !columns?.length) return null;

  const { rows: pageRows, start } = getPagedRows(rows, options.page, options.pageSize);
  if (!pageRows.length) return null;

  const numericColumns = getNumericColumns(rows, columns, options.maxScanRows);
  const dataColumnIndex = numericColumns.find((index) => index > 0) ?? numericColumns[0] ?? -1;
  const dataColumnName = dataColumnIndex >= 0 ? columns[dataColumnIndex] ?? "Value" : "Value";
  const labels = pageRows.map((row, index) => String(getCell(row, columns, 0) ?? `Item ${start + index + 1}`));
  const dataValues =
    dataColumnIndex >= 0
      ? pageRows.map((row) => toFiniteNumber(getCell(row, columns, dataColumnIndex)) ?? 0)
      : pageRows.map((_, index) => start + index + 1);

  return {
    labels,
    datasets: [{ label: dataColumnName, data: dataValues }],
  };
}

/** Transform board data for scatter: two numeric columns -> x, y points for the current page. */
function boardDataToScatterFormat(
  boardData: BoardDataType,
  options: ChartTransformOptions = {}
): scatterChartDataType | null {
  const { data: rows, columns } = boardData.data;
  if (!rows?.length || !columns?.length) return null;
  const numericCols = getNumericColumns(rows, columns, options.maxScanRows);
  if (numericCols.length < 2) return null;
  const xCol = numericCols[0];
  const yCol = numericCols[1];
  const { rows: pageRows, start } = getPagedRows(rows, options.page, options.pageSize);
  const data = pageRows.map((row, i) => {
    const x = toFiniteNumber(getCell(row, columns, xCol)) ?? 0;
    const y = toFiniteNumber(getCell(row, columns, yCol)) ?? 0;
    return { x, y, id: start + i };
  });
  return {
    series: [
      {
        data,
        label: `${columns[xCol] ?? "X"} vs ${columns[yCol] ?? "Y"}`,
      },
    ],
  };
}

/** Transform board data for pie: labels + one numeric series -> slices for the current page. */
function boardDataToPieFormat(
  boardData: BoardDataType,
  options: ChartTransformOptions = {}
): pieChartDataType | null {
  const chart = boardDataToBarFormat(boardData, options);
  if (!chart || !chart.datasets[0]?.data?.length) return null;
  const labels = chart.labels;
  const values = chart.datasets[0].data;
  const positiveItems = labels
    .map((label, i) => ({
      id: i,
      value: Math.max(0, values[i] ?? 0),
      label: label || `Item ${i + 1}`,
    }))
    .filter((item) => item.value > 0);

  const items =
    positiveItems.length > PIE_SLICE_LIMIT
      ? [
          ...positiveItems
            .sort((a, b) => b.value - a.value)
            .slice(0, PIE_SLICE_LIMIT - 1),
          {
            id: "other",
            value: positiveItems
              .slice(PIE_SLICE_LIMIT - 1)
              .reduce((total, item) => total + item.value, 0),
            label: "Other on page",
          },
        ]
      : positiveItems;

  if (!items.length) return null;
  return { items };
}

/** Transform board data for single value: multiple metrics (sum, count, avg, min, max). */
function boardDataToSingleValueFormat(
  boardData: BoardDataType,
  options: ChartTransformOptions = {}
): singleValueDataType | null {
  const chart = boardDataToBarFormat(boardData, options);
  if (!chart) return null;
  const data = chart.datasets[0]?.data ?? [];
  const count = data.length;
  let sum = 0;
  let min = data.length ? data[0] : 0;
  let max = data.length ? data[0] : 0;

  for (const value of data) {
    sum += value;
    if (value < min) min = value;
    if (value > max) max = value;
  }

  const avg = count ? sum / count : 0;
  const values = [
    { label: "Sum", value: sum },
    { label: "Count", value: count },
    { label: "Average", value: avg },
    { label: "Min", value: min },
    { label: "Max", value: max },
  ];
  return { values };
}

const BOARD_VIZ_KEY = "board-viz-";

function getStoredViz(boardId: string): string {
  if (typeof window === "undefined") return "table";
  try {
    return localStorage.getItem(BOARD_VIZ_KEY + boardId) ?? "table";
  } catch {
    return "table";
  }
}

const ChartPagination = ({
  page,
  totalRows,
  onPageChange,
}: {
  page: number;
  totalRows: number;
  onPageChange: (page: number) => void;
}) => {
  const totalPages = Math.max(1, Math.ceil(totalRows / CHART_RECORDS_PER_PAGE));
  const start = totalRows ? (page - 1) * CHART_RECORDS_PER_PAGE + 1 : 0;
  const end = Math.min(page * CHART_RECORDS_PER_PAGE, totalRows);

  if (totalRows <= CHART_RECORDS_PER_PAGE) return null;

  return (
    <div className="border-t border-gray-200 bg-gray-50/80 px-4 py-2 flex items-center justify-between gap-3 text-[11px] text-gray-600">
      <span className="font-medium">
        Showing {start.toLocaleString()}-{end.toLocaleString()} of {totalRows.toLocaleString()}
      </span>
      <div className="flex items-center gap-3 font-semibold">
        <button
          className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous chart page"
        >
          <FaChevronLeft className="text-[10px]" />
        </button>
        <span className="bg-white border border-gray-200 text-blue-600 px-2 py-0.5 rounded shadow-sm">
          {page} / {totalPages}
        </span>
        <button
          className="p-1.5 hover:bg-gray-200 rounded-lg disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next chart page"
        >
          <FaChevronRight className="text-[10px]" />
        </button>
      </div>
    </div>
  );
};

const DynamicBoard = ({
  iboard,
  isResizing = false,
}: {
  iboard: Board;
  isResizing?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const { boardDataLoadingId, boardVisualization } = useAppSelector((state) => state.board);
  const [, startTransition] = useTransition();
  const [boardData, setLocalBoardData] = useState<BoardDataType | null>(null);
  const [board, setBoard] = useState<Board>(iboard);
  const [chartPage, setChartPage] = useState(1);
  const isBlockLoading = boardDataLoadingId === board.id;
  const storedBoardVisualization = boardVisualization[board.id];
  const visualizationType = storedBoardVisualization ?? getStoredViz(board.id);
  const [lineAreaChartReady, setLineAreaChartReady] = useState(false);
  const isLineOrArea = visualizationType === "lineChart" || visualizationType === "areaChart";
  const chartTotalRows = boardData?.data.data.length ?? 0;
  const chartTotalPages = Math.max(1, Math.ceil(chartTotalRows / CHART_RECORDS_PER_PAGE));

  const transformedChartData = useMemo(() => {
    if (!boardData || visualizationType === "table") return null;
    const options = {
      page: chartPage,
      pageSize: CHART_RECORDS_PER_PAGE,
      maxScanRows: NUMERIC_COLUMN_SCAN_LIMIT,
    };

    switch (visualizationType) {
      case "barChart":
      case "lineChart":
      case "areaChart":
        return boardDataToBarFormat(boardData, options);
      case "scatterPlot":
        return boardDataToScatterFormat(boardData, options);
      case "pieChart":
        return boardDataToPieFormat(boardData, options);
      case "singleValue":
        return boardDataToSingleValueFormat(boardData, options);
      default:
        return null;
    }
  }, [boardData, chartPage, visualizationType]);

  // Show loader briefly for line/area charts while MUI chart mounts
  useEffect(() => {
    if (!isLineOrArea) return;
    setLineAreaChartReady(false);
    const t = setTimeout(() => setLineAreaChartReady(true), 280);
    return () => clearTimeout(t);
  }, [isLineOrArea, boardData?.id]);

  // Hydrate chart type from localStorage on mount so selection is remembered
  useEffect(() => {
    if (storedBoardVisualization !== undefined) return;
    try {
      const saved = localStorage.getItem(BOARD_VIZ_KEY + board.id);
      if (saved) dispatch(setBoardVisualization({ boardId: board.id, type: saved as BoardVisualizationType }));
    } catch {
      // ignore
    }
  }, [board.id, storedBoardVisualization, dispatch]);

  // Keep local board state in sync with incoming props so changes like
  // currentDataId and name (after selecting a query) trigger data fetch/render.
  useEffect(() => {
    setBoard(iboard);
  }, [iboard]);

  useEffect(() => {
    setChartPage(1);
  }, [boardData?.id, visualizationType]);

  useEffect(() => {
    if (chartPage > chartTotalPages) {
      setChartPage(chartTotalPages);
    }
  }, [chartPage, chartTotalPages]);

  const renderChartFrame = (content: JSX.Element) => (
    <div className="h-full min-h-0 flex flex-col">
      <div className="min-h-0 flex-1">{content}</div>
      <ChartPagination
        page={chartPage}
        totalRows={chartTotalRows}
        onPageChange={setChartPage}
      />
    </div>
  );

  const handleSidepaneActivation = () => {
    if (boardData) {
      // Set active board in Redux
      dispatch(setActiveBoard(boardData));
      // Store board data in Redux
      dispatch(setBoardData(boardData));
      // Open sidepane
      dispatch(toggleSidepane());
    } else {
      console.warn("Cannot open sidepane: boardData is null");
    }
  };

  // useEffect(() => {
  //   const handleActiveDataChange = async () => {
  //     if (activeBoardData) {
  //       const newBoard =  await setCurrentDataId(activeBoardData?.boardId, activeBoardData?.id);
  //       setBoard(newBoard)
  //     }
  //   };

  //   handleActiveDataChange();
  // }, [activeBoardData]);

  useEffect(() => {
    if (!board?.currentDataId) return;

    startTransition(async () => {
      try {
        let data = await fetchDataById(board.currentDataId ?? "");
        if (!data || Object.keys(data).length === 0) {
          data = await fetchSampleDataWithId(board.currentDataId ?? "");
        }

        if (!data || !data.data) {
          console.error("No data found for board:", board.currentDataId);
          return;
        }

        // Handle data structure from database: { id, name, data: { columns: [...], data: [...] } }
        // or from IndexedDB: { id, name, data: { data: [...], columns: [...] } }
        const dataObj = data.data;
        let dataArray: any[] = [];
        let columns: string[] = [];
        
        // Extract columns first (if available)
        if (dataObj && typeof dataObj === 'object' && dataObj.columns && Array.isArray(dataObj.columns)) {
          columns = dataObj.columns;
        }
        
        // Extract data array
        if (dataObj && typeof dataObj === 'object') {
          if (dataObj.data && Array.isArray(dataObj.data)) {
            dataArray = dataObj.data;
          } else if (Array.isArray(dataObj)) {
            dataArray = dataObj;
          }
        }

        // If columns weren't found, generate them from data structure
        if (columns.length === 0 && dataArray.length > 0) {
          const firstRow = dataArray[0];
          if (Array.isArray(firstRow)) {
            // Array of arrays - generate generic column names (fallback for old data)
            columns = Array.from({ length: firstRow.length }, (_, i) => `Column ${i + 1}`);
          } else if (typeof firstRow === 'object' && firstRow !== null && !Array.isArray(firstRow)) {
            // Array of objects - use keys
            columns = Object.keys(firstRow);
          }
        }

        // Ensure we have columns
        if (columns.length === 0 && dataArray.length > 0) {
          const firstRow = dataArray[0];
          if (Array.isArray(firstRow)) {
            columns = Array.from({ length: firstRow.length }, (_, i) => `Column ${i + 1}`);
          }
        }

        // Get active columns from localStorage, fallback to all columns if not set
        const { getTableState, setTableState } = await import("@/utils/localStorage");
        const tableState = getTableState(data.id);
        let activeColumns = Array.isArray(tableState?.activeColumns)
          ? tableState.activeColumns
          : undefined;
        
        // First-time tables default to all columns; an existing empty array is
        // an intentional Deselect all state.
        if (!tableState || activeColumns === undefined) {
          activeColumns = columns;
          if (columns.length > 0) {
            // Save the full state object, not just activeColumns
            const currentState = tableState || {};
            setTableState(data.id, { 
              ...currentState,
              activeColumns: columns 
            });
          }
        }

        const formattedData: BoardDataType = {
          id: data.id ?? "",
          boardId: board.id,
          name: board.name ?? "Untitled",
          data: {
            data: dataArray,
            columns: columns,
            columnsInfo: dataObj.columnsInfo ?? {},
            duration: dataObj.duration ?? 0,
            updatedAt: dataObj.updatedAt ?? Date.now(),
          },
        };

        console.log("Formatted board data:", {
          id: formattedData.id,
          name: formattedData.name,
          dataLength: formattedData.data.data.length,
          columnsLength: formattedData.data.columns.length,
          columns: formattedData.data.columns,
          activeColumns: activeColumns,
          firstRow: dataArray[0],
          sampleData: dataArray.slice(0, 3)
        });

        setLocalBoardData(formattedData);
        // Update Redux store
        dispatch(setBoardData(formattedData));
      } catch (error) {
        console.error(
          `Error fetching board data (ID: ${board.currentDataId}):`,
          error
        );
      } finally {
        dispatch(setBoardDataLoadingId(null));
      }
    });
  }, [board?.currentDataId, board.id, board.name, dispatch]);

  return (
    <div className="h-full flex flex-col w-full relative">
      <div
        className="px-4 py-3 border-b border-gray-400 cursor-pointer"
        onClick={() => handleSidepaneActivation()}
      >
        <h1 className=" font-medium capitalize">{boardData?.name}</h1>
      </div>
      <div className="h-full relative">
        {isBlockLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-b-lg bg-gray-200 border-2 border-gray-300 shadow-md">
            <div className="flex flex-col items-center gap-2">
              <RotatingLines width="36" strokeColor="#0ea5e9" strokeWidth="3" />
              <span className="text-sm text-gray-700 font-medium">Loading data...</span>
            </div>
          </div>
        )}
        {isResizing ? (
          <div className="h-full w-full bg-slate-100 flex items-center justify-center text-xs font-medium text-slate-500">
            Resizing...
          </div>
        ) : boardData ? (
          visualizationType === "barChart" ? (
            (() => {
              const chartData = transformedChartData as barDataType | null;
              if (!chartData || !chartData.datasets[0]?.data?.length) {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    Not enough numeric data for bar chart. Use Table or add a numeric column.
                  </div>
                );
              }
              return renderChartFrame(<BarChart barData={chartData} />);
            })()
          ) : visualizationType === "lineChart" ? (
            (() => {
              const chartData = transformedChartData as barDataType | null;
              if (!chartData || !chartData.datasets[0]?.data?.length) {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    Not enough numeric data for line chart. Use Table or add a numeric column.
                  </div>
                );
              }
              if (!lineAreaChartReady) {
                return (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-b-lg bg-gray-200 border-2 border-gray-300 shadow-md">
                    <div className="flex flex-col items-center gap-2">
                      <RotatingLines width="36" strokeColor="#0ea5e9" strokeWidth="3" />
                      <span className="text-sm text-gray-700 font-medium">Loading chart...</span>
                    </div>
                  </div>
                );
              }
              return renderChartFrame(<LineChartComp lineData={chartData} />);
            })()
          ) : visualizationType === "areaChart" ? (
            (() => {
              const chartData = transformedChartData as barDataType | null;
              if (!chartData || !chartData.datasets[0]?.data?.length) {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    Not enough numeric data for area chart. Use Table or add a numeric column.
                  </div>
                );
              }
              if (!lineAreaChartReady) {
                return (
                  <div className="absolute inset-0 z-10 flex items-center justify-center rounded-b-lg bg-gray-200 border-2 border-gray-300 shadow-md">
                    <div className="flex flex-col items-center gap-2">
                      <RotatingLines width="36" strokeColor="#0ea5e9" strokeWidth="3" />
                      <span className="text-sm text-gray-700 font-medium">Loading chart...</span>
                    </div>
                  </div>
                );
              }
              return renderChartFrame(<AreaChartComp areaData={chartData} />);
            })()
          ) : visualizationType === "scatterPlot" ? (
            (() => {
              const chartData = transformedChartData as scatterChartDataType | null;
              if (!chartData || !chartData.series[0]?.data?.length) {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    Need at least two numeric columns for scatter plot. Use Table or add numeric columns.
                  </div>
                );
              }
              return renderChartFrame(<ScatterChartComp scatterData={chartData} />);
            })()
          ) : visualizationType === "pieChart" ? (
            (() => {
              const chartData = transformedChartData as pieChartDataType | null;
              if (!chartData || !chartData.items?.length) {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    Not enough data for pie chart. Use Table or add a numeric column.
                  </div>
                );
              }
              return renderChartFrame(<PieChartComp pieData={chartData} />);
            })()
          ) : visualizationType === "singleValue" ? (
            (() => {
              const chartData = transformedChartData as singleValueDataType | null;
              if (!chartData?.values?.length) {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    No data for single value.
                  </div>
                );
              }
              return renderChartFrame(<SingleValueComp data={chartData} />);
            })()
          ) : (
            <Table data={boardData} />
          )
        ) : !isBlockLoading ? (
          <p className="text-gray-500 p-4">Loading data...</p>
        ) : null}
      </div>
    </div>
  );
};

export default DynamicBoard;
