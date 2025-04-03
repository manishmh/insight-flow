import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardContext } from "@/contexts/dashboard-context";
import {
  fetchSampleData,
  setCurrentDataId,
} from "@/server/components/block-functions";
import { fetchDataByName, saveData } from "@/server/components/indexedDB";
import { Board } from "@prisma/client";
import { useState, useTransition } from "react";
import { PiDotsNineBold } from "react-icons/pi";
import { RotatingLines } from "react-loader-spinner";

const EmptyBoard = ({ board }: { board: Board }) => {
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [queryHistory, setQueryHistory] = useState<string[]>([]);
  const [selectChangePending, startTransition] = useTransition();
  const { refreshDashboard } = useDashboardContext();

  const handleSelectChange = (value: string) => {
    setSelectedQuery(value);
    setQueryHistory((prev) => {
      const updatedHistory = [value, ...prev];
      return updatedHistory.slice(0, 2);
    });

    startTransition(async () => {
      try {
        let data = await fetchDataByName(value);
        console.log("Data fetched by name:", data);

        let sampleData;
        if (!data || !data.id || !data.data) {
          sampleData = await fetchSampleData(value);
          console.log("Fetched sample data:", sampleData);

          if (sampleData?.id && typeof sampleData.name === "string") {
            await saveData(sampleData.id, sampleData.name, sampleData);
            console.log("Block query updated successfully", sampleData);
          } else {
            console.log("Sample data is invalid or missing required fields");
          }
        }

        const id = data?.id || sampleData?.id;
        if (id) {
          await setCurrentDataId(board.id, id);
          refreshDashboard();
        } else {
          console.log("No valid ID found for update");
        }
      } catch (error) {
        console.error("Failed to update block query", error);
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
