"use client";

import { Board } from "@prisma/client";
import { Responsive, WidthProvider, type Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import DynamicBoard from "@/components/dashboard/boards/board";
import { TableProvider } from "@/contexts/sidepane-localhost-storage-context";

const ResponsiveGridLayout = WidthProvider(Responsive);

const COLS = { lg: 12, md: 12, sm: 6, xs: 4, xxs: 2 };
const BREAKPOINTS = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
const ROW_HEIGHT = 40;

function buildLayout(boards: Board[]): Layout[] {
  const unpositioned = boards.filter((b) => b.x === 0 && b.y === 0).length > 1;
  if (unpositioned) {
    return boards.map((b, i) => ({
      i: b.id,
      x: (i % 2) * 6,
      y: Math.floor(i / 2) * 8,
      w: 6,
      h: 8,
      static: true,
    }));
  }
  return boards.map((b) => ({
    i: b.id,
    x: b.x,
    y: b.y,
    w: b.w || 6,
    h: b.h || 8,
    static: true,
  }));
}

const SharedDashboardView = ({ boards }: { boards: Board[] }) => {
  if (!boards.length) {
    return (
      <div className="text-center text-gray-500 py-20">
        This dashboard has no blocks yet.
      </div>
    );
  }

  return (
    <TableProvider>
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: buildLayout(boards) }}
        cols={COLS}
        breakpoints={BREAKPOINTS}
        rowHeight={ROW_HEIGHT}
        margin={[16, 16]}
        isDraggable={false}
        isResizable={false}
      >
        {boards.map((board) => (
          <div key={board.id}>
            <div className="h-full flex flex-col rounded-lg overflow-hidden bg-white border border-gray-400">
              <div className="px-3 py-1.5 border-b border-gray-300 bg-gray-50">
                <span className="font-medium capitalize text-sm text-gray-800 truncate">
                  {board.name}
                </span>
              </div>
              <div className="flex-1 min-h-0 relative">
                {board.currentDataId != null ? (
                  <DynamicBoard iboard={board} />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xs text-gray-400">
                    No data
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </ResponsiveGridLayout>
    </TableProvider>
  );
};

export default SharedDashboardView;
