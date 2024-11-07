import { ReactNode, useState } from "react";
import { BsBarChartLineFill, BsTable } from "react-icons/bs";
import {
  FaChartArea,
  FaChartLine,
  FaChartPie,
  FaCircleQuestion,
} from "react-icons/fa6";
import { MdOutlineScatterPlot } from "react-icons/md";

const BlockType = () => {
  const blockTypes = [
    { id: "table", title: "Table", logo: <BsTable /> },
    { id: "barChart", title: "Bar chart", logo: <BsBarChartLineFill /> },
    { id: "lineChart", title: "Line chart", logo: <FaChartLine /> },
    { id: "areaChart", title: "Area chart", logo: <FaChartArea /> },
    {
      id: "scatterPlot",
      title: "Scatter plot",
      logo: <MdOutlineScatterPlot />,
    },
    { id: "pieChart", title: "Pie chart", logo: <FaChartPie /> },
    { id: "singleValue", title: "Single value", logo: <FaCircleQuestion /> },
  ];

  const [activeBlockType, setActiveBlockType] = useState("table");
  const handleActiveBlockType = (id: string) => {
    setActiveBlockType(id);
  }

  return (
    <div className="p-3 px-4">
      <h1 className="text-gray-600">Block type</h1>
      <div className=" py-3 grid grid-cols-3 grid-rows-3 gap-2">
        {blockTypes.map((block) => (
          <Blocks
            key={block.id}
            id={block.id}
            title={block.title}
            logo={block.logo}
            activeBlockType={activeBlockType}
            handleActiveBlockType={handleActiveBlockType}
          />
        ))}
      </div>
    </div>
  );
};

export default BlockType;

const Blocks = ({
  id,
  title,
  logo,
  activeBlockType,
  handleActiveBlockType
}: {
  id: string;
  title: string;
  logo: ReactNode;
  activeBlockType: string;
  handleActiveBlockType: (id: string) => void;
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 box-border  shadow text-gray-500 rounded-md cursor-pointer hover:bg-[#d1d5db52] ${activeBlockType === id ? "border-cyan-500 border-2 py-2" : "border border-gray-300 py-1"}`}
      onClick={() => handleActiveBlockType(id)}
    >
      <div className="text-base text-[#6b7280b4]">{logo}</div>
      <div className="text-[11px]">{title}</div>
    </div>
  );
};
