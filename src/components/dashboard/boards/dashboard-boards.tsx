import { useDashboardContext } from "@/contexts/dashboard-context";
import { useSidebar } from "@/contexts/sidebar-context";
import { Board } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { ResizableBox } from "react-resizable";
import EmptyBoard from "./empty-board";
import DragSvg from "../../../../public/dashboard/drag";
import "react-resizable/css/styles.css";
import { UpdateBoardSize } from "@/server/components/dashboard-commands";

const DashboardBoards = () => {
  const { dashboardData } = useDashboardContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number | null>(null);
  const { sidebarOpen } = useSidebar();

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setParentWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
  }, [sidebarOpen]);

  const handleResizeStop = async (id: string, width: number, height: number) => {
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
          className="border border-gray-400 rounded-xl relative flex flex-col overflow-hidden"
        >
          <div className="h-full w-full relative">
            <div className="h-full w-full">
              {board.currentDataId != null ? (
                <div className=" bg-blue-300 text-black">{board.currentDataId}</div>
              ) : (
                <EmptyBoard board={board} />
              )}
            </div>
            <div className="w-5 opacity-60 absolute bottom-2 right-2 cursor-se-resize">
              <DragSvg />
            </div>
          </div>
        </ResizableBox>
      ))}
    </div>
  );
};

export default DashboardBoards;
