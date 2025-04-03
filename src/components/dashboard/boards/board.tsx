import Table from "@/components/global/charts/table";
import DragSvg from "../../../../public/dashboard/drag";
import { useBoardContext } from "@/contexts/board-context";
import { useSidepane } from "@/contexts/sidepane-context";
import { fetchSampleDataWithId } from "@/server/components/block-functions";
import { fetchDataById } from "@/server/components/indexedDB";
import { Board } from "@prisma/client";
import { useEffect, useState, useTransition } from "react";

export interface BoardDataType {
  id: string;
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
  const { handleActiveBoardId } = useBoardContext();

  const handleSidepaneActivation = (boardId: string) => {
    handleActiveBoardId(boardId);
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

        console.log("data", data);

        const formattedData: BoardDataType = {
          id: data?.id ?? "",
          name: data?.name ?? "Untitled",
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
  }, [board?.currentDataId]);

  return (
    <div className="h-full relative">
      <div className="px-4 py-3 border-b border-gray-400">
        <h1
          className=" font-medium cursor-pointer capitalize"
          onClick={() => handleSidepaneActivation(board.id)}
        >
          {boardData?.name}
        </h1>
      </div>
      <div className="h-full overflow-scroll">
        {boardData ? (
          <Table data={boardData} />
        ) : (
          <p className="text-gray-500 p-4">Loading data...</p>
        )}
        {/* <div className="w-5 opacity-60 absolute bottom-1 right-1 cursor-se-resize">
          <DragSvg />
        </div> */}
      </div>
      <div className="bg-primary-bg border border-t-gray-400 flex items-center px-4  w-full h-8 absolute bottom-0">Manish</div>
    </div>
  );
};

export default DynamicBoard;
