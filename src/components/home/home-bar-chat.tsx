import { BarChart } from "@mui/x-charts/BarChart";
import * as React from "react";

const HomeBarChart = () => {
  const chartSettings = {
    xasix: [
      {
        label: "year",
      },
    ],
    yaxis: [
      {
        label: "Total orders (thousands)",
      },
    ],
  };
  return (
    <div className="col-span-5 md:col-span-2 shadow border border-gray-300 h-full w-full rounded-lg ">
      <h1 className="text-gray-500 p-4">Numbers of order by cities</h1>
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: [
              "6/2022",
              "12/2022",
              "6/2023",
              "12/2023",
              "6/2024",
              "12/2024",
            ],
          },
        ]}
        series={[
          { data: [5, 13, 19, 25, 33, 38], color: "#6b7280" },
          { data: [4, 14, 17, 23, 29, 33], color: "#94a3b8" },
          { data: [1, 5, 8, 15, 19, 24], color: "#cbd5e1" },
        ]}
        {...chartSettings}
        width={500}
        height={250}
        className="w-full"
      />
    </div>
  );
};

export default HomeBarChart;
