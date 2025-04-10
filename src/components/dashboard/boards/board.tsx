import Table from "@/components/global/charts/table";
import { useBoardContext } from "@/contexts/board-context";
import { useDashboardContext } from "@/contexts/dashboard-context";
import { useSidepane } from "@/contexts/sidepane-context";
import {
  fetchSampleDataWithId,
  setBoardName,
} from "@/server/components/block-functions";
import { fetchDataById } from "@/server/components/indexedDB";
import { Board } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";
import DragSvg from "../../../../public/dashboard/drag";
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

const DynamicBoard = ({ board }: { board: Board }) => {
  const { handleSidepane } = useSidepane();
  const [isPending, startTransition] = useTransition();
  const [boardData, setBoardData] = useState<BoardDataType | null>(null);
  const { handleActiveBoardData } = useBoardContext();

  const handleSidepaneActivation = () => {
    handleActiveBoardData(boardData);
    handleSidepane();
  };

  useEffect(() => {
    if (!board?.currentDataId) return;

    startTransition(async () => {
      try {
        let data = await fetchDataById(board.currentDataId ?? "");
        if (!data || Object.keys(data).length === 0) {
          data = await fetchSampleDataWithId(board.currentDataId ?? "");
        }

        const formattedData: BoardDataType = {
          id: data?.id ?? "",
          boardId: board.id,
          name: board.name ?? "Untitled",
          data: {
            data: data?.data?.data ?? [],
            columns: data?.data?.columns ?? [],
            columnsInfo: data?.data?.columnsInfo ?? [],
            duration: data?.data?.duration ?? 0,
            updatedAt: data?.data?.updatedAt ?? Date.now(),
          },
        };

        setBoardData(formattedData);
      } catch (error) {
        console.error(
          `Error fetching board data (ID: ${board.currentDataId}):`,
          error
        );
      }
    });
  }, [board?.currentDataId, board.id, board.name]);

  return (
    <div className="h-full flex flex-col w-full relative">
      <div
        className="px-4 py-3 border-b border-gray-400 cursor-pointer"
        onClick={() => handleSidepaneActivation()}
      >
        <h1 className=" font-medium capitalize">
          {boardData?.name}
        </h1>
      </div>
      <div className="h-full ">
        {boardData ? (
          <Table data={boardData} />
        ) : (
          <p className="text-gray-500 p-4">Loading data...</p>
        )}
      </div>
    </div>
  );
};

export default DynamicBoard;
