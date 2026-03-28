import { useAppSelector } from "@/store/hooks";
import { UpdateBoardSize } from "@/server/components/dashboard-commands";
import { updateBoardInDashboard } from "@/store/slices/dashboardSlice";
import { useAppDispatch } from "@/store/hooks";
import { Board } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import DragSvg from "../../../../public/dashboard/drag";
import DynamicBoard from "./board";
import EmptyBoard from "./empty-board";

const DashboardBoards = () => {
  const dispatch = useAppDispatch();
  const { currentDashboard } = useAppSelector((state) => state.dashboard);
  const { activeBoard } = useAppSelector((state) => state.board);
  const { sidebar, sidepane } = useAppSelector((state) => state.ui);
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number | null>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setParentWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
  }, [sidebar.open]);

  const handleResizeStop = async (
    id: string,
    width: number,
    height: number
  ) => {
    try {
      const updatedBoard = await UpdateBoardSize(id, width, height);
      if (updatedBoard) {
        dispatch(updateBoardInDashboard(updatedBoard));
      }
      console.log("Board size updated successfully", width, height);
    } catch (error) {
      console.log("Failed to update board size", error);
    }
  };

  if (!currentDashboard) {
    return <div>No dashboard data</div>;
  }

  return (
    <div ref={containerRef} className="flex gap-4 h-full flex-wrap max-w-full">
      {currentDashboard.boards.map((board: Board) => (
        <ResizableBox
          key={`${board.id}-${board.currentDataId || 'empty'}`}
          width={board.width}
          height={board.height}
          minConstraints={[384, 320]}
          maxConstraints={[parentWidth || 0, Infinity]}
          resizeHandles={["se"]}
          onResizeStop={(_, { size }) =>
            handleResizeStop(board.id, size.width, size.height)
          }
          className={`rounded-lg relative flex flex-col overflow-hidden pb-11
            ${
              sidepane.open && activeBoard?.boardId === board.id
                ? "border-2 border-cyan-400"
                : "border border-gray-400"
            }   
          `}
        >
          <>
            <div className="h-full w-full">
              {board.currentDataId != null ? (
                <DynamicBoard iboard={board} />
              ) : (
                <EmptyBoard board={board} />
              )}
            </div>
            <div className="w-5 opacity-60 z-50 absolute bottom-1 right-1 cursor-se-resize">
              <DragSvg />
            </div>
          </>
        </ResizableBox>
      ))}
    </div>
  );
};

export default DashboardBoards;
