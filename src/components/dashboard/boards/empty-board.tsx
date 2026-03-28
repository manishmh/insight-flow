import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/store/hooks";
import { setCurrentDashboard, updateBoardInDashboard } from "@/store/slices/dashboardSlice";
import { GetDashboardData } from "@/server/components/dashboard-commands";
import { useTableContext } from "@/contexts/sidepane-localhost-storage-context";
import {
  fetchSampleData,
  setBoardName,
  setCurrentDataId,
} from "@/server/components/block-functions";
import { fetchDataByName, saveData } from "@/server/components/indexedDB";
import { Board } from "@prisma/client";
import { useState, useTransition } from "react";
import { PiDotsNineBold } from "react-icons/pi";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";

const EmptyBoard = ({ board }: { board: Board }) => {
  const dispatch = useAppDispatch();
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [selectChangePending, startTransition] = useTransition();
  const { updateState } = useTableContext();

  const handleSelectChange = (value: string) => {
    setSelectedQuery(value);
    setQueryHistory((prev) => {
      const updatedHistory = [value, ...prev];
      return updatedHistory.slice(0, 2);
    });

    startTransition(async () => {
      try {
        let data = null;
        try {
          data = await fetchDataByName(value);
          console.log("Data fetched by name from IndexedDB:", data);
        } catch (indexedDBError) {
          console.log("IndexedDB fetch failed (expected if first time):", indexedDBError);
        }

        let sampleData = null;
        // Check if IndexedDB data is valid (has id, name, and data)
        if (!data || !data.id || !data.name || !data.data) {
          // Fetch from database
          try {
            sampleData = await fetchSampleData(value);
            console.log("Fetched sample data from DB:", sampleData);

            if (!sampleData) {
              console.error(`No sample data found for query: ${value}`);
              toast.error(`No data found for query "${value}". Please try another query.`);
              return;
            }

            // Database returns: { id, name, data: { "data": [...] } }
            // We need to ensure the structure is correct
            if (!sampleData.id || !sampleData.name || !sampleData.data) {
              console.error("Invalid sample data structure:", sampleData);
              toast.error(`Invalid data structure for query "${value}".`);
              return;
            }

            // Save to IndexedDB for future use (save the entire sampleData object)
            try {
              await saveData(sampleData.id, sampleData.name, sampleData);
              console.log("Block query saved to IndexedDB", sampleData);
            } catch (saveError) {
              console.warn("Failed to save to IndexedDB (may already exist):", saveError);
            }
          } catch (dbError) {
            console.error("Failed to fetch from database:", dbError);
            toast.error(`Failed to fetch query "${value}" from database: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`);
            return;
          }
        }

        const selected = data || sampleData;
        console.log("Selected data (final):", selected);
        console.log("Selected data structure:", {
          hasSelected: !!selected,
          hasId: !!selected?.id,
          hasName: !!selected?.name,
          hasData: !!selected?.data,
          dataType: typeof selected?.data,
          isArray: Array.isArray(selected?.data)
        });
        
        if (!selected) {
          console.error("No data found for query:", value);
          toast.error(`No data found for query "${value}". Please try another query.`);
          return;
        }

        if (!selected.id || !selected.name) {
          console.error("Invalid data structure - missing id or name:", { 
            hasId: !!selected.id, 
            hasName: !!selected.name,
            selected 
          });
          toast.error("Failed to load query data. Invalid data structure.");
          return;
        }

        // Handle both IndexedDB format and database format
        // IndexedDB format: { id, name, data: { data: [...], columns: [...] } }
        // Database format: { id, name, data: { data: [...] } } where data is JSONB
        let dataObj = selected.data;
        
        // If data is directly an array (from seed files), wrap it
        if (Array.isArray(dataObj)) {
          dataObj = { data: dataObj };
        }
        
        if (!dataObj) {
          console.error("No data object found in selected:", selected);
          toast.error("Failed to load query data. No data found.");
          return;
        }
        
        console.log("Data object structure:", {
          hasData: !!dataObj.data,
          dataIsArray: Array.isArray(dataObj.data),
          hasColumns: !!dataObj.columns,
          columnsIsArray: Array.isArray(dataObj.columns),
          dataObjKeys: Object.keys(dataObj)
        });

        // Extract data array and columns
        let dataArray: any[] = [];
        let columns: string[] = [];
        
        // Extract columns first (if available in the data structure)
        if (dataObj && typeof dataObj === 'object' && dataObj.columns && Array.isArray(dataObj.columns)) {
          columns = dataObj.columns;
        }
        
        // Handle different data structures
        if (dataObj && typeof dataObj === 'object') {
          // Case 1: dataObj has a 'data' property that is an array
          if (dataObj.data && Array.isArray(dataObj.data)) {
            dataArray = dataObj.data;
          }
          // Case 2: dataObj itself is an array (shouldn't happen after our wrapping, but handle it)
          else if (Array.isArray(dataObj)) {
            dataArray = dataObj;
          }
        }
        
        // If we still don't have a data array, try to extract it differently
        if (dataArray.length === 0 && dataObj && typeof dataObj === 'object') {
          // Check if dataObj has nested structure
          const keys = Object.keys(dataObj);
          console.log("DataObj keys when no data array found:", keys);
          
          // Maybe the data is at the root level with a different key
          for (const key of keys) {
            const value = (dataObj as any)[key];
            if (Array.isArray(value) && value.length > 0 && key !== 'columns') {
              dataArray = value;
              console.log(`Found data array under key: ${key}`);
              break;
            }
          }
        }
        
        // If columns weren't found, generate them from data structure
        if (columns.length === 0 && dataArray.length > 0) {
          const firstItem = dataArray[0];
          if (typeof firstItem === 'object' && !Array.isArray(firstItem)) {
            // Array of objects - extract keys
            columns = Object.keys(firstItem);
          } else if (Array.isArray(firstItem)) {
            // Array of arrays - create generic column names (fallback for old data)
            columns = Array.from({ length: firstItem.length }, (_, i) => `Column ${i + 1}`);
          }
        }

        // Validate we have at least some data
        if (dataArray.length === 0) {
          console.error("No data array found or empty data:", { 
            dataObj, 
            dataArray, 
            dataObjType: typeof dataObj,
            dataObjKeys: dataObj && typeof dataObj === 'object' ? Object.keys(dataObj) : 'N/A',
            selected 
          });
          toast.error("Failed to load query data. No data available.");
          return;
        }
        
        console.log("Successfully extracted data:", {
          dataArrayLength: dataArray.length,
          columnsLength: columns.length,
          firstRow: dataArray[0],
          columns
        });

        const id = selected.id;
        const name = selected.name;

        // Update board with currentDataId first
        const updatedBoardWithDataId = await setCurrentDataId(board.id, id);
        console.log("Board updated with currentDataId:", updatedBoardWithDataId);
        
        // Update board name
        const updatedBoard = await setBoardName(name, board.id);
        console.log("Board updated with name:", updatedBoard);
        
        // Ensure we have a board with currentDataId
        const finalBoard = updatedBoard?.currentDataId 
          ? updatedBoard 
          : { ...updatedBoard, currentDataId: id };
        
        // Update table state with active columns (use all columns if none specified)
        // Only update if we have columns, otherwise the table component will handle it
        if (columns.length > 0) {
          updateState(id, "activeColumns", columns);
        } else {
          // If no columns, still update with empty array to initialize the state
          updateState(id, "activeColumns", []);
        }
        
        // Update the board in Redux immediately
        if (finalBoard) {
          dispatch(updateBoardInDashboard(finalBoard));
        }
        
        // Refresh dashboard in Redux to get the latest board state with all updates
        const refreshedDashboard = await GetDashboardData(board.dashboardId);
        if (refreshedDashboard) {
          dispatch(setCurrentDashboard(refreshedDashboard));
        }
        
        toast.success("Query selected successfully!");
      } catch (error) {
        console.error("Failed to update block query", error);
        toast.error(`Failed to load query data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });
  };

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="pb-6 px-4 text-center space-y-3 flex flex-1 flex-col h-full justify-center">
        <div className="flex justify-center pb-2">
          <div className="w-28 flex flex-col gap-2 aspect-square border-gray-400">
            <div className="w-full h-1/2 flex gap-2">
              <div className="w-full h-full rounded-lg border-2 border-gray-300 bg-[#dae0e6] relative overflow-hidden shadow-lg">
                <div className="text-gray-400 text-3xl z-10 relative grid place-items-center h-full">
                  <PiDotsNineBold />
                </div>
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#e1e8ee] to-[#c9d1d9] rounded-lg"></div>
                <div className="absolute z-0 top-0 left-0 w-full h2 bg-gradient-to-b from-transparent to-[#e1e8ee] rounded-t-lg"></div>
                <div className="absolute z-0 bottom-0 left-0 w-full h-4 bg-gradient-to-t from-[#dae0e6] to-transparent rounded-b-lg"></div>
              </div>
              <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-400"></div>
            </div>
            <div className="w-ful h-1/2 flex gap-2">
              <div className="w-2/3 h-full rounded-lg border-2 border-dashed border-gray-400"></div>
              <div className="w-1/3 h-full rounded-lg border-2 border-dashed border-gray-400"></div>
            </div>
          </div>
        </div>
        <div className="font-semibold">No query selected</div>
        <div className="text-gray-600">
          Select a query before customizing a block.
        </div>
        <div className="flex justify-center">
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="w-full max-w-xs border-gray-400 text-sm">
              <SelectValue placeholder="Select a query" />
            </SelectTrigger>
            <SelectContent className="z-20 bg-[#e1e8ee] max-h-[300px]">
              <SelectGroup className="text-gray-700">
                {queryHistory.length > 0 && (
                  <SelectLabel className="text-gray-400">
                    {" "}
                    Recently Used
                  </SelectLabel>
                )}
                {queryHistory.map((query, index) => (
                  <div key={index} className="ml-8 text-sm mt-2">
                    {query}
                  </div>
                ))}
                <SelectLabel className="text-gray-400 mt-2">
                  Sample Connection
                </SelectLabel>
                <SelectItem value="empty_table">empty_table</SelectItem>
                <SelectItem value="documents">documents</SelectItem>
                <SelectItem value="users">users</SelectItem>
                <SelectItem value="workspaces">workspaces</SelectItem>
                <SelectItem value="customers">customers</SelectItem>
                <SelectItem value="products">products</SelectItem>
                <SelectItem value="purchases">purchases</SelectItem>
                <SelectItem value="orders">orders</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {selectChangePending && (
          <div className="flex justify-center">
            <RotatingLines width="15" strokeColor="black" />
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyBoard;
