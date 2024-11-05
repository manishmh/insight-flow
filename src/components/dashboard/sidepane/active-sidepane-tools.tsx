import { sidepaneToolsType } from "./sidepane";
import { GoDatabase } from "react-icons/go";
import { MdInsertChartOutlined } from "react-icons/md";

const ActiveSidepaneTools = ({
  activeTools,
  handleActiveTools,
}: {
  activeTools: sidepaneToolsType;
  handleActiveTools: (type: keyof sidepaneToolsType) => void;
}) => {
  return (
    <div className="flex items-center justify-between border-b border-t border-gray-300 px-2 text-gray-600">
      <div
        className={`flex items-center gap-2 w-full justify-center py-2 ${
          activeTools.data
            ? "border-b-2 border-cyan-500 text-cyan-600"
            : "border-b-2 border-transparent"
        }`}
      >
        <div
          className="flex items-center gap-2 transition-colors duration-300 hover:bg-[#d1d5db52] w-full justify-center py-1 rounded-md cursor-pointer"
          onClick={() => handleActiveTools("data")}
        >
          <GoDatabase />
          Data
        </div>
      </div>
      <div
        className={`flex items-center gap-2 w-full justify-center py-2 ${
          activeTools.charts
            ? "border-b-2 border-cyan-500 text-cyan-600"
            : "border-b-2 border-transparent"
        }`}
      >
        <div
          className="flex items-center transition-colors duration-300 gap-2 hover:bg-[#d1d5db52] w-full justify-center py-1 rounded-md cursor-pointer"
          onClick={() => handleActiveTools("charts")}
        >
          <MdInsertChartOutlined />
          Charts
        </div>
      </div>
    </div>
  );
};

export default ActiveSidepaneTools;
