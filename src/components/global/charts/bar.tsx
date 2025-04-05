import { useEffect, useState } from "react";
import { useSidebar } from "@/contexts/sidebar-context";

export type barDataType = {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
    }[];
}

const BarChart = ({ barData }: { barData: barDataType }) => {
  const [yaxis, setYaxis] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { sidebarWidth, sidebarOpen } = useSidebar();

  useEffect(() => {
    // Calculate the min and max values from the data
    const min = Math.min(...barData.datasets[0].data);
    const max = Math.max(...barData.datasets[0].data);

    // Generate 8 evenly spaced y-axis values
    const newYaxis = [];
    for (let i = 7; i >= 0; i--) {
      newYaxis.push(min + i * ((max - min) / 7));
    }
    newYaxis.push(0);

    setYaxis(newYaxis);
  }, [barData.datasets]);

  const handleMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    setMousePosition({ x: event.clientX, y: event.clientY });
  };

  return (
    <div className="flex h-full p-3 gap-1 text-[10px]">
      <div className="flex flex-col justify-between mb-[16px]">
        {yaxis.map((y, index) => (
          <div key={`yaxis-${index}`} className="text-gray-500 flex gap-1">
            {y} <div>-</div>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col justify-between ">
        {barData.datasets.map((dataset, index) => (
          <div
            key={`bardataset-${index}`}
            className="flex gap-1 justify-between h-full items-end"
          >
            {dataset.data.map((data, index) => (
              <div
                key={`dataset-${index}`}
                className={`w-full flex flex-col itemscenter h-full justify-end`}
              >
                <div className="h-full flex items-end pt-1">
                  <div
                    className={`bg-cyan-500 w-full group`}
                    style={{ height: `${(data / (yaxis.length - 1)) * 100}%` }}
                    onMouseMove={handleMouseMove}
                  >
                    <div
                      className={`absolute rounded-md hidden py-1 group-hover:block bg-gray-800 z-50 text-xs `}
                      style={{
                        top: `${mousePosition.y + 10}px`,
                        left: `${sidebarOpen ? mousePosition.x - sidebarWidth : mousePosition.x}px`,
                      }}
                    >
                      <div className="p-2 space-y-2 font-semibold font-mono">
                        <div className="text-white">
                          Date: {barData.labels[index]}
                        </div>
                        <div className="text-white">{dataset.label}: {data}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-hidden text-gray-400 flex flex-col items-center">
                    <div className="w-[1px] h-1.5 bg-gray-400"></div>
                    <div>{index + 1}</div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
