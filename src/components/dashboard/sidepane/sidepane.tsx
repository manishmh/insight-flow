import { useState } from "react";
import ActiveSidepaneTools from "./active-sidepane-tools";
import ChartSection from "./charts-section";
import DataSection from "./data-section";
import EmojiNName from "./emoji-n-name";
import HeaderMenu from "./header-menu";
import { useBoardContext } from "@/contexts/board-context";

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
  const { activeBoardData } = useBoardContext();

  const handleActiveTools = (tool: keyof sidepaneToolsType) => {
    setActiveTools({
      data: tool === "data",
      charts: tool === "charts",
    });
  };

  if (!activeBoardData) {
    //TODO: add skeleton loader here. 
    return <div>No Active data</div>
  }

  return (
    <div className="space-y-3">
      <div className="px-3 space-y-3">
        <HeaderMenu
          headerMenu={headerMenu}
          handleHeaderMenu={() => setHeaderMenu(!headerMenu)}
        />
        <EmojiNName name={activeBoardData?.name} dataId={activeBoardData?.id} boardId={activeBoardData.boardId} />
      </div>
      <div>
        <ActiveSidepaneTools
          activeTools={activeTools}
          handleActiveTools={handleActiveTools}
        />
        {activeTools.data && (
          <>
            <DataSection activeBoardData={activeBoardData}/>
          </>
        )}
        {/* {activeTools.charts && (
          <div>
            <ChartSection />
          </div>
        )} */}
      </div>
    </div>
  );
};

export default Sidepane;
