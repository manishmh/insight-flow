import { useEffect, useState } from "react";
import ActiveSidepaneTools from "./active-sidepane-tools";
import ChartSection from "./charts-section";
import DataSection from "./data-section";
import EmojiNName from "./emoji-n-name";
import HeaderMenu from "./header-menu";
import { useAppSelector } from "@/store/hooks";
import { RotatingLines } from "react-loader-spinner";

export type sidepaneToolsType = {
  data: boolean;
  charts: boolean;
};

const sidepaneTools: sidepaneToolsType = {
  data: true,
  charts: false,
};

const Sidepane = () => {
  const [headerMenu, setHeaderMenu] = useState(false);
  const [activeTools, setActiveTools] = useState(sidepaneTools);
  const { activeBoard, sidepaneQueryLoading } = useAppSelector((state) => state.board);

  const handleActiveTools = (tool: keyof sidepaneToolsType) => {
    setActiveTools({
      data: tool === "data",
      charts: tool === "charts",
    });
  };

  if (!activeBoard) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500">
        No block selected. Click a block header to open settings.
      </div>
    );
  }

  return (
    <div className="space-y-3 relative">
      {sidepaneQueryLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-200 border-2 border-gray-300 shadow-md">
          <div className="flex flex-col items-center gap-3">
            <RotatingLines width="40" strokeColor="#0ea5e9" strokeWidth="3" />
            <span className="text-sm text-gray-700 font-medium">Loading data...</span>
          </div>
        </div>
      )}
      <div className="px-3 space-y-3">
        <HeaderMenu
          headerMenu={headerMenu}
          handleHeaderMenu={() => setHeaderMenu(!headerMenu)}
        />
        <EmojiNName />
      </div>
      <div>
        <ActiveSidepaneTools
          activeTools={activeTools}
          handleActiveTools={handleActiveTools}
        />
        {activeTools.data && (
          <>
            <DataSection />
          </>
        )}
        {activeTools.charts && (
          <div>
            <ChartSection />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidepane;
