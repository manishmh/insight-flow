import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  UpdateDashboardLayout,
  type BoardLayoutItem,
} from "@/server/components/dashboard-commands";
import { updateBoardsLayout } from "@/store/slices/dashboardSlice";
import { setActiveBoard, setBoardData } from "@/store/slices/boardSlice";
import { toggleSidepane } from "@/store/slices/uiSlice";
import { Board } from "@prisma/client";
import debounce from "lodash/debounce";
import { useMemo, useRef, useState } from "react";
import { Responsive, WidthProvider, type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import {
  LuDownload,
  LuGripVertical,
  LuLock,
  LuMove,
  LuSparkles,
} from "react-icons/lu";
import { toast } from "sonner";
import { exportBoardCsv } from "@/utils/exportData";
import DynamicBoard from "./board";
import EmptyBoard from "./empty-board";
import InsightsPanel from "./insights-panel";

const ResponsiveGridLayout = WidthProvider(Responsive);

const COLS = { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 };
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const ROW_HEIGHT = 40;
const MIN_W = 3;
const MIN_H = 5;
const DEFAULT_W = 6;
const DEFAULT_H = 8;

/**
 * Build the grid layout from board coordinates. When several boards still sit at
 * the default (0,0) — e.g. legacy rows created before grid positions existed —
 * flow them into a tidy grid instead of stacking them on top of each other.
 */
function buildLayout(boards: Board[]): Layout[] {
  const unpositioned = boards.filter((b) => b.x === 0 && b.y === 0).length > 1;
  if (unpositioned) {
    const perRow = 2;
    return boards.map((b, i) => ({
      i: b.id,
      x: (i % perRow) * DEFAULT_W,
      y: Math.floor(i / perRow) * DEFAULT_H,
      w: DEFAULT_W,
      h: DEFAULT_H,
      minW: MIN_W,
      minH: MIN_H,
    }));
  }
  return boards.map((b) => ({
    i: b.id,
    x: b.x,
    y: b.y,
    w: b.w || DEFAULT_W,
    h: b.h || DEFAULT_H,
    minW: MIN_W,
    minH: MIN_H,
  }));
}

const BlockCard = ({
  board,
  locked,
  isActive,
}: {
  board: Board;
  locked: boolean;
  isActive: boolean;
}) => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.board.boards[board.id]);
  const [showInsights, setShowInsights] = useState(false);

  const openSidepane = () => {
    if (!data) return;
    dispatch(setActiveBoard(data));
    dispatch(setBoardData(data));
    dispatch(toggleSidepane());
  };

  const stopDrag = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div
      className={`h-full flex flex-col rounded-lg overflow-hidden bg-white ${
        isActive ? "border-2 border-cyan-400" : "border border-gray-400"
      }`}
    >
      <div
        onClick={openSidepane}
        title={data ? "Open block settings" : "Select a query first"}
        className={`flex items-center gap-2 px-3 py-1.5 border-b border-gray-300 bg-gray-50 select-none ${
          data ? "cursor-pointer" : ""
        }`}
      >
        {!locked && (
          <button
            onClick={stopDrag}
            title="Drag to reposition"
            aria-label="Drag to reposition block"
            className="block-drag-handle shrink-0 -ml-1 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-200 cursor-grab active:cursor-grabbing"
          >
            <LuGripVertical />
          </button>
        )}
        <span className="font-medium capitalize truncate text-sm text-gray-800">
          {board.name}
        </span>
        {data && (
          <div className="no-drag ml-auto flex items-center gap-1" onClick={stopDrag}>
            <button
              onClick={() => setShowInsights((v) => !v)}
              title="Auto insights"
              className={`p-1.5 rounded hover:bg-gray-200 transition-colors ${
                showInsights ? "text-blue-600" : "text-gray-500"
              }`}
            >
              <LuSparkles className="text-sm" />
            </button>
            <button
              onClick={() => exportBoardCsv(data)}
              title="Export CSV"
              className="p-1.5 rounded hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <LuDownload className="text-sm" />
            </button>
          </div>
        )}
      </div>
      <div className="flex-1 min-h-0 relative">
        {board.currentDataId != null ? (
          <DynamicBoard iboard={board} />
        ) : (
          <EmptyBoard board={board} />
        )}
        {showInsights && data && (
          <InsightsPanel data={data} onClose={() => setShowInsights(false)} />
        )}
      </div>
    </div>
  );
};

const DashboardBoards = () => {
  const dispatch = useAppDispatch();
  const { currentDashboard } = useAppSelector((state) => state.dashboard);
  const { activeBoard } = useAppSelector((state) => state.board);
  const [locked, setLocked] = useState(false);

  const boards = useMemo(
    () => currentDashboard?.boards ?? [],
    [currentDashboard?.boards]
  );
  const layout = useMemo(() => buildLayout(boards), [boards]);

  const dashboardIdRef = useRef(currentDashboard?.id);
  dashboardIdRef.current = currentDashboard?.id;

  const persistLayout = useMemo(
    () =>
      debounce((items: BoardLayoutItem[]) => {
        const id = dashboardIdRef.current;
        if (!id) return;
        UpdateDashboardLayout(id, items).catch(() => {
          toast.error("Failed to save layout");
        });
      }, 600),
    []
  );

  const handleLayoutChange = (current: Layout[]) => {
    const items: BoardLayoutItem[] = current.map((l) => ({
      id: l.i,
      x: l.x,
      y: l.y,
      w: l.w,
      h: l.h,
    }));
    dispatch(updateBoardsLayout(items));
    persistLayout(items);
  };

  if (!currentDashboard) {
    return <div>No dashboard data</div>;
  }

  return (
    <div className="h-full">
      <div className="flex justify-end pb-2">
        <button
          onClick={() => setLocked((v) => !v)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md px-2.5 py-1 bg-white shadow-sm transition-colors"
          title={locked ? "Unlock to drag and resize blocks" : "Lock layout"}
        >
          {locked ? (
            <>
              <LuLock className="text-sm" /> Locked
            </>
          ) : (
            <>
              <LuMove className="text-sm" /> Edit layout
            </>
          )}
        </button>
      </div>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: layout }}
        cols={COLS}
        breakpoints={BREAKPOINTS}
        rowHeight={ROW_HEIGHT}
        margin={[16, 16]}
        isDraggable={!locked}
        isResizable={!locked}
        draggableHandle=".block-drag-handle"
        draggableCancel=".no-drag"
        onDragStop={(l) => handleLayoutChange(l)}
        onResizeStop={(l) => handleLayoutChange(l)}
        compactType="vertical"
      >
        {boards.map((board: Board) => (
          <div key={board.id}>
            <BlockCard
              board={board}
              locked={locked}
              isActive={activeBoard?.boardId === board.id}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DashboardBoards;
