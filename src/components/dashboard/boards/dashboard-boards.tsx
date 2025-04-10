import { useBoardContext } from "@/contexts/board-context";
import { useDashboardContext } from "@/contexts/dashboard-context";
import { useSidebar } from "@/contexts/sidebar-context";
import { useSidepane } from "@/contexts/sidepane-context";
import { UpdateBoardSize } from "@/server/components/dashboard-commands";
import { Board } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";
import DragSvg from "../../../../public/dashboard/drag";
import DynamicBoard from "./board";
import EmptyBoard from "./empty-board";

const DashboardBoards = () => {
  const { dashboardData } = useDashboardContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number | null>(null);
  const { sidebarOpen } = useSidebar();
  const { sidepaneOpen } = useSidepane();
  const { activeBoardData } = useBoardContext();

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setParentWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
  }, [sidebarOpen]);

  const handleResizeStop = async (
    id: string,
    width: number,
    height: number
  ) => {
    try {
      await UpdateBoardSize(id, width, height);
      console.log("Board size updated successfully", width, height);
    } catch (error) {
      console.log("Failed to update board size", error);
    }
  };

  return (
    <div ref={containerRef} className="flex gap-4 h-full flex-wrap max-w-full">
      {dashboardData?.boards.map((board: Board) => (
        <ResizableBox
          key={board.id}
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
              sidepaneOpen && activeBoardData?.boardId === board.id
                ? "border-2 border-cyan-400"
                : "border border-gray-400"
            }   
          `}
        >
          <div className="h-full w-full">
            {board.currentDataId != null ? (
              <DynamicBoard board={board} />
            ) : (
              <EmptyBoard board={board} />
            )}
          </div>
          <div className="w-5 opacity-60 z-50 absolute bottom-2 right-2 cursor-se-resize">
            <DragSvg />
          </div>
        </ResizableBox>
      ))}
    </div>
  );
};

export default DashboardBoards;
