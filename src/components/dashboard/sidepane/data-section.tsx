import SelectQuerySvg from "@/components/global/svg/select-query-svg";
import { sampleTableData } from "@/constants/sampel-table-data";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setBoardData, setBoardDataLoadingId, setSidepaneQueryLoading } from "@/store/slices/boardSlice";
import { setCurrentDashboard, updateBoardInDashboard } from "@/store/slices/dashboardSlice";
import { useTableContext } from "@/contexts/sidepane-localhost-storage-context";
import { GetDashboardData } from "@/server/components/dashboard-commands";
import { fetchSampleData, setBoardName, setCurrentDataId } from "@/server/components/block-functions";
import { fetchDataByName, saveData, fetchAllData } from "@/server/components/indexedDB";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import DataColumns from "./data-columns";
import SelectQueryList from "./select-query-list";
import SortBy from "./sort-by";
import Aggregate from "./aggregate";
import FilterBy from "./filter-by";
import type { BoardDataType } from "@/components/dashboard/boards/board";

export type DataSourceItem = {
  label: string;
  data: any[];
};

const dataSources: DataSourceItem[] = [sampleTableData];
const extractedLabels = dataSources.map((source) => source.label);

const originalList = [
  ...extractedLabels,
  "empty_table",
  "documents",
  "users",
  "workspaces",
  "products",
  "purchases",
  "orders",
] as const;

export type QueryType = (typeof originalList)[number];

function parseSampleData(selected: { id: string; name: string; data: any }) {
  let dataObj = selected.data;
  if (Array.isArray(dataObj)) dataObj = { data: dataObj };

  let dataArray: any[] = [];
  let columns: string[] = [];

  if (dataObj?.columns && Array.isArray(dataObj.columns)) columns = dataObj.columns;
  if (dataObj?.data && Array.isArray(dataObj.data)) dataArray = dataObj.data;

  if (dataArray.length === 0 && dataObj && typeof dataObj === "object") {
    for (const key of Object.keys(dataObj)) {
      if (key === "columns") continue;
      const value = (dataObj as any)[key];
      if (Array.isArray(value) && value.length > 0) {
        dataArray = value;
        break;
      }
    }
  }

  if (columns.length === 0 && dataArray.length > 0) {
    const first = dataArray[0];
    if (typeof first === "object" && first !== null && !Array.isArray(first)) columns = Object.keys(first);
    else if (Array.isArray(first)) columns = Array.from({ length: first.length }, (_, i) => `Column ${i + 1}`);
  }

  return { dataArray, columns, dataObj };
}

const DataSection = () => {
  const dispatch = useAppDispatch();
  const { activeBoard } = useAppSelector((state) => state.board);
  const { currentDashboard } = useAppSelector((state) => state.dashboard);
  const { updateState } = useTableContext();
  const [selectQuery, setSelectQuery] = useState(false);
  const [recentlyUsed, setRecentlyUsed] = useState<string[]>([]);
  const [customQueries, setCustomQueries] = useState<string[]>([]);

  useEffect(() => {
    if (selectQuery) {
      const loadCustom = async () => {
        try {
          const all = await fetchAllData();
          if (all) {
            const names = all.map((d: any) => d.name).filter((n: string) => !originalList.includes(n as any));
            setCustomQueries(names);
          }
        } catch (e) {
          console.error("Failed to load custom custom queries", e);
        }
      };
      loadCustom();
    }
  }, [selectQuery]);

  const handleSetSelectQuery = () => {
    setSelectQuery(!selectQuery);
  };

  const handleSelectedQuery = async (query: string) => {
    if (!activeBoard || !currentDashboard) {
      toast.error("No block selected.");
      return;
    }
    const board = currentDashboard.boards.find((b) => b.id === activeBoard.boardId);
    if (!board) {
      toast.error("Block not found.");
      return;
    }

    setSelectQuery(false);
    dispatch(setBoardDataLoadingId(activeBoard.boardId));
    dispatch(setSidepaneQueryLoading(true));

    try {
      let data = await fetchDataByName(query);
      let sampleData: { id: string; name: string; data: any } | null = null;

      if (!data?.id || !data?.name || !data?.data) {
        if (originalList.includes(query as QueryType)) {
          sampleData = await fetchSampleData(query as QueryType);
          if (!sampleData) {
            toast.error(`No data found for "${query}".`);
            return;
          }
          try {
            await saveData(sampleData.id, sampleData.name, sampleData);
          } catch {
            // may already exist
          }
        } else {
          toast.error(`No data found locally for "${query}".`);
          return;
        }
      }

      const selected = data || sampleData;
      if (!selected?.id || !selected?.name) {
        toast.error("Invalid data structure.");
        return;
      }

      const { dataArray, columns, dataObj } = parseSampleData(selected);
      if (dataArray.length === 0) {
        toast.error("No data available.");
        return;
      }

      await setCurrentDataId(board.id, selected.id);
      const updatedBoard = await setBoardName(selected.name, board.id);
      const finalBoard = updatedBoard?.currentDataId ? updatedBoard : { ...updatedBoard, currentDataId: selected.id };

      if (columns.length > 0) {
        updateState(selected.id, "activeColumns", columns);
      } else {
        updateState(selected.id, "activeColumns", []);
      }

      const formattedData: BoardDataType = {
        id: selected.id,
        boardId: board.id,
        name: selected.name,
        data: {
          data: dataArray,
          columns,
          columnsInfo: (dataObj as any)?.columnsInfo ?? {},
          duration: (dataObj as any)?.duration ?? 0,
          updatedAt: (dataObj as any)?.updatedAt ?? Date.now(),
        },
      };

      dispatch(setBoardData(formattedData));
      dispatch(updateBoardInDashboard(finalBoard));

      const refreshed = await GetDashboardData(board.dashboardId);
      if (refreshed) dispatch(setCurrentDashboard(refreshed));

      setRecentlyUsed((prev) => [query, ...prev.filter((q) => q !== query)].slice(0, 3));
      toast.success("Data updated for this block.");
    } catch (error) {
      console.error("Error selecting query in sidepane:", error);
      toast.error(error instanceof Error ? error.message : "Failed to load data.");
      dispatch(setBoardDataLoadingId(null));
    } finally {
      dispatch(setSidepaneQueryLoading(false));
    }
  };

  return (
    <>
      <div className="py-2 px-3 border-b border-gray-300">
        {selectQuery && (
          <SelectQueryList
            queryList={originalList}
            recentlyUsed={recentlyUsed}
            customQueries={customQueries}
            handleSetSelectQuery={handleSetSelectQuery}
            handleSelectQuery={handleSelectedQuery}
          />
        )}
        <div className="text-gray-500 px-2">Query</div>
        <div className="relative">
          <div
            className="text-gray-500 flex items-center w-full gap-2 my-2 hover:bg-[#d1d5db52] py-1 px-2 rounded-md cursor-pointer"
            onClick={() => setSelectQuery(!selectQuery)}
          >
            {selectQuery && <div className="absolute inset-0"></div>}
            <div className="w-4 h-4 mt-[1px] flex flex-shrink-0">
              <SelectQuerySvg />
            </div>
            {activeBoard?.name ? (
              <div className="flex justify-between w-full ">
                <span className="text-gray-800 font-semibold truncate w-1/2">
                  {activeBoard.name}
                </span>
                <span className="whitespace-nowrap w-1/2">Sample Collection</span>
              </div>
            ) : (
              "Select a query..."
            )}
          </div>
        </div>
      </div>

      {activeBoard && <DataColumns TableColumns={activeBoard.data.columns} />}
      
      {activeBoard && <SortBy />}
      {activeBoard && <Aggregate />}
      {activeBoard && <FilterBy />}
    </>
  );
};

export default DataSection;
