import { useState } from "react";
import { FaPaintbrush } from "react-icons/fa6";
import POBDetails from "./pob-details";

const AdvancedCustomization = () => {
  const [showGraphValue, setShowGraphValue] = useState(false);

  return (
    <div className="h-full max-w-2xl">
      <div className="md:h-[220px] pb-4 flex gap-8 flex-col md:flex-row justify-between">
        <div
          className="md:pl-12 flex flex-shrink-0 justify-center md:justify-normal items-end h-full gap-1"
          onClick={() => setShowGraphValue(!showGraphValue)}
        >
          <BarLine
            height="h-32"
            bg="bg-gray-500"
            value={32}
            showGraphValue={showGraphValue}
          />
          <BarLine
            height="h-40"
            bg="bg-gray-400"
            value={40}
            showGraphValue={showGraphValue}
          />
          <BarLine
            height="h-16"
            bg="bg-gray-300"
            value={16}
            showGraphValue={showGraphValue}
          />
          <div className="w-4"></div>
          <BarLine
            height="h-40"
            bg="bg-gray-500"
            value={40}
            showGraphValue={showGraphValue}
          />
          <BarLine
            height="h-52"
            bg="bg-gray-400"
            value={52}
            showGraphValue={showGraphValue}
          />
          <BarLine
            height="h-44"
            bg="bg-gray-300"
            value={44}
            showGraphValue={showGraphValue}
          />
        </div>
        <div className="w-full flex flex-col items-end gap-4">
          <div className="space-y-2 bg-[#eaf2f8] px-4 py-2 w-1/2 md:w-2/3 lg:w-1/2 shadow-md rounded-md">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-500"></div>
              <span className="text-gray-700">Premium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400"></div>
              <span className="text-gray-700">Free</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-300"></div>
              <span className="text-gray-700">Churned</span>
            </div>
          </div>
          <div className="text-gray-700 xl:w-10/12 bg-[#eaf2f8] p-4 py-3 h-full shadow-md rounded-md flex flex-col justify-between">
            <div className="flex justify-between w-full">
              Bar orientation <span className="text-gray-500">Horizontal</span>
            </div>
            <div className="flex justify-between gap-2 items-center">
              Show values on graph
              <div className={`w-10 h-5 rounded-full cursor-pointer transition-all duration-500 ${showGraphValue ? "bg-blue-950" : "bg-gray-300"}`} onClick={() => setShowGraphValue(!showGraphValue)}>
                <div className={`bg-white h-full w-5 rounded-full transition-all duration-500 ${showGraphValue ? "translate-x-full" : "translate-x-0"}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <POBDetails
        logo={<FaPaintbrush />}
        heading="Advanced customization"
        desc="Take control of your visualization with powerful customizations options to match your unique needs."
      />
    </div>
  );
};

export default AdvancedCustomization;

const BarLine = ({
  height,
  bg,
  value,
  showGraphValue,
}: {
  height: string;
  bg: string;
  value: number;
  showGraphValue: boolean;
}) => {
  return (
    <div className="space-y-1 relative">
      <div
        className={`text-gray-500 transition-all duration-500 absolute z-0 -top-6 ${
          showGraphValue ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        {value}
      </div>
      <div className={`relative z-10 w-5 rounded-sm ${height} ${bg}`}></div>
    </div>
  );
};
