import { useEffect, useState } from "react";
import { useAppSelector } from "@/store/hooks";

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
  const { sidebar } = useAppSelector((state) => state.ui);

  useEffect(() => {
    const data = barData.datasets[0]?.data;
    if (!data?.length) {
      setYaxis([0]);
      return;
    }
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    // Generate 8 evenly spaced y-axis values
    const newYaxis = [];
    for (let i = 7; i >= 0; i--) {
      newYaxis.push(min + (i / 7) * range);
    }
    newYaxis.push(min);

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
        {barData.datasets.map((dataset, dsIndex) => {
          const dataArr = dataset.data;
          const maxVal = dataArr.length ? Math.max(...dataArr) : 0;
          const scale = maxVal > 0 ? 100 / maxVal : 0;
          return (
            <div
              key={`bardataset-${dsIndex}`}
              className="flex gap-1 justify-between h-full items-end"
            >
              {dataArr.map((data, barIndex) => (
                <div
                  key={`dataset-${barIndex}`}
                  className="w-full flex flex-col items-center h-full justify-end"
                >
                  <div className="h-full flex items-end pt-1 w-full">
                    <div
                      className="bg-cyan-500 w-full group min-h-[4px]"
                      style={{ height: `${scale * data}%` }}
                      onMouseMove={handleMouseMove}
                    >
                      <div
                        className="absolute rounded-md hidden py-1 group-hover:block bg-gray-800 z-50 text-xs"
                        style={{
                          top: `${mousePosition.y + 10}px`,
                          left: `${sidebar.open ? mousePosition.x - sidebar.width : mousePosition.x}px`,
                        }}
                      >
                        <div className="p-2 space-y-2 font-semibold font-mono">
                          <div className="text-white">
                            {barData.labels[barIndex] ?? barIndex + 1}
                          </div>
                          <div className="text-white">{dataset.label}: {data}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-hidden text-gray-400 flex flex-col items-center">
                    <div className="w-[1px] h-1.5 bg-gray-400" />
                    <div>{barIndex + 1}</div>
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BarChart;
