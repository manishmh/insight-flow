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
  setBoardName,
  setCurrentDataId,
} from "@/server/components/block-functions";
import { fetchDataById } from "@/server/components/indexedDB";
import { Board } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
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

/** Transform board table data into bar chart format: labels + numeric dataset(s). */
function boardDataToBarFormat(boardData: BoardDataType): barDataType | null {
  const { data: rows, columns } = boardData.data;
  if (!rows?.length || !columns?.length) return null;

  const getCell = (row: any, colIndex: number): any =>
    Array.isArray(row) ? row[colIndex] : row[columns[colIndex]];

  const labels = rows.map((row) => String(getCell(row, 0) ?? ""));

  let dataColumnIndex = -1;
  let dataColumnName = "Value";
  for (let c = 1; c < columns.length; c++) {
    const values = rows.map((row) => getCell(row, c));
    const parsed = values.map((v) => (typeof v === "number" ? v : Number(v)));
    const validCount = parsed.filter((n) => !Number.isNaN(n)).length;
    if (validCount >= rows.length * 0.5) {
      dataColumnIndex = c;
      dataColumnName = columns[c] ?? "Value";
      break;
    }
  }
  if (dataColumnIndex === -1) {
    for (let c = 0; c < columns.length; c++) {
      const values = rows.map((row) => getCell(row, c));
      const parsed = values.map((v) => (typeof v === "number" ? v : Number(v)));
      const validCount = parsed.filter((n) => !Number.isNaN(n)).length;
      if (validCount >= rows.length * 0.5) {
        dataColumnIndex = c;
        dataColumnName = columns[c] ?? "Value";
        break;
      }
    }
  }

  const dataValues: number[] =
    dataColumnIndex >= 0
      ? rows.map((row) => {
          const v = getCell(row, dataColumnIndex);
          const n = typeof v === "number" ? v : Number(v);
          return Number.isNaN(n) ? 0 : n;
        })
      : rows.map((_, i) => i + 1);

  return {
    labels,
    datasets: [{ label: dataColumnName, data: dataValues }],
  };
}

/** Transform board data for scatter: two numeric columns -> x, y points. */
function boardDataToScatterFormat(boardData: BoardDataType): scatterChartDataType | null {
  const { data: rows, columns } = boardData.data;
  if (!rows?.length || !columns?.length) return null;
  const getCell = (row: any, c: number) =>
    Array.isArray(row) ? row[c] : row[columns[c]];
  const numericCols: number[] = [];
  for (let c = 0; c < columns.length; c++) {
    const parsed = rows.map((row) => {
      const v = getCell(row, c);
      return typeof v === "number" ? v : Number(v);
    });
    const valid = parsed.filter((n) => !Number.isNaN(n)).length;
    if (valid >= rows.length * 0.5) numericCols.push(c);
  }
  if (numericCols.length < 2) return null;
  const xCol = numericCols[0];
  const yCol = numericCols[1];
  const data = rows.map((row, i) => {
    const x = Number(getCell(row, xCol)) || 0;
    const y = Number(getCell(row, yCol)) || 0;
    return { x, y, id: i };
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

/** Transform board data for pie: labels + one numeric series -> slices. */
function boardDataToPieFormat(boardData: BoardDataType): pieChartDataType | null {
  const chart = boardDataToBarFormat(boardData);
  if (!chart || !chart.datasets[0]?.data?.length) return null;
  const labels = chart.labels;
  const values = chart.datasets[0].data;
  const items = labels
    .map((label, i) => ({
      id: i,
      value: Math.max(0, values[i] ?? 0),
      label: label || `Item ${i + 1}`,
    }))
    .filter((item) => item.value > 0);
  if (!items.length) return null;
  return { items };
}

/** Transform board data for single value: multiple metrics (sum, count, avg, min, max). */
function boardDataToSingleValueFormat(boardData: BoardDataType): singleValueDataType | null {
  const chart = boardDataToBarFormat(boardData);
  if (!chart) return null;
  const data = chart.datasets[0]?.data ?? [];
  const label = chart.datasets[0]?.label ?? "Value";
  const count = data.length || boardData.data.data.length;
  const sum = data.reduce((a, b) => a + b, 0);
  const avg = count ? sum / count : 0;
  const min = data.length ? Math.min(...data) : 0;
  const max = data.length ? Math.max(...data) : 0;
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

const DynamicBoard = ({ iboard }: { iboard: Board }) => {
  const dispatch = useAppDispatch();
  const { boardDataLoadingId, boardVisualization } = useAppSelector((state) => state.board);
  const [isPending, startTransition] = useTransition();
  const [boardData, setLocalBoardData] = useState<BoardDataType | null>(null);
  const [board, setBoard] = useState<Board>(iboard);
  const isBlockLoading = boardDataLoadingId === board.id;
  const visualizationType = boardVisualization[board.id] ?? getStoredViz(board.id);
  const [lineAreaChartReady, setLineAreaChartReady] = useState(false);
  const isLineOrArea = visualizationType === "lineChart" || visualizationType === "areaChart";

  // Show loader briefly for line/area charts while MUI chart mounts
  useEffect(() => {
    if (!isLineOrArea) return;
    setLineAreaChartReady(false);
    const t = setTimeout(() => setLineAreaChartReady(true), 280);
    return () => clearTimeout(t);
  }, [isLineOrArea, boardData?.id]);

  // Hydrate chart type from localStorage on mount so selection is remembered
  useEffect(() => {
    if (boardVisualization[board.id] !== undefined) return;
    try {
      const saved = localStorage.getItem(BOARD_VIZ_KEY + board.id);
      if (saved) dispatch(setBoardVisualization({ boardId: board.id, type: saved as BoardVisualizationType }));
    } catch {
      // ignore
    }
  }, [board.id, boardVisualization[board.id], dispatch]);

  // Keep local board state in sync with incoming props so changes like
  // currentDataId and name (after selecting a query) trigger data fetch/render.
  useEffect(() => {
    setBoard(iboard);
  }, [iboard]);

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
        let activeColumns = tableState?.activeColumns;
        
        // If no active columns in localStorage, use all columns and save them
        if (!activeColumns || activeColumns.length === 0) {
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
        {boardData ? (
          visualizationType === "barChart" ? (
            (() => {
              const chartData = boardDataToBarFormat(boardData);
              if (!chartData || !chartData.datasets[0]?.data?.length) {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    Not enough numeric data for bar chart. Use Table or add a numeric column.
                  </div>
                );
              }
              return <BarChart barData={chartData} />;
            })()
          ) : visualizationType === "lineChart" ? (
            (() => {
              const chartData = boardDataToBarFormat(boardData);
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
              return <LineChartComp lineData={chartData} />;
            })()
          ) : visualizationType === "areaChart" ? (
            (() => {
              const chartData = boardDataToBarFormat(boardData);
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
              return <AreaChartComp areaData={chartData} />;
            })()
          ) : visualizationType === "scatterPlot" ? (
            (() => {
              const chartData = boardDataToScatterFormat(boardData);
              if (!chartData || !chartData.series[0]?.data?.length) {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    Need at least two numeric columns for scatter plot. Use Table or add numeric columns.
                  </div>
                );
              }
              return <ScatterChartComp scatterData={chartData} />;
            })()
          ) : visualizationType === "pieChart" ? (
            (() => {
              const chartData = boardDataToPieFormat(boardData);
              if (!chartData || !chartData.items?.length) {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    Not enough data for pie chart. Use Table or add a numeric column.
                  </div>
                );
              }
              return <PieChartComp pieData={chartData} />;
            })()
          ) : visualizationType === "singleValue" ? (
            (() => {
              const chartData = boardDataToSingleValueFormat(boardData);
              if (!chartData?.values?.length) {
                return (
                  <div className="flex items-center justify-center h-full text-gray-500 p-4 text-center">
                    No data for single value.
                  </div>
                );
              }
              return <SingleValueComp data={chartData} />;
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
