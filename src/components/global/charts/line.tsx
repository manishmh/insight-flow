"use client";

import { LineChart } from "@mui/x-charts/LineChart";

export type lineChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
};

const LineChartComp = ({ lineData }: { lineData: lineChartDataType }) => {
  const dataLength = lineData.datasets[0]?.data?.length ?? 0;
  if (!dataLength) return null;

  const n = dataLength;
  const xAxisData =
    lineData.labels.length === n
      ? lineData.labels
      : lineData.labels.length >= n
        ? lineData.labels.slice(0, n)
        : [
            ...lineData.labels,
            ...Array.from({ length: n - lineData.labels.length }, (_, i) =>
              String(i + lineData.labels.length + 1)
            ),
          ];

  const series = lineData.datasets.map((ds, i) => ({
    data: ds.data,
    label: ds.label,
    color: ["#0ea5e9", "#06b6d4", "#8b5cf6", "#ec4899"][i % 4],
  }));

  return (
    <div className="h-full w-full flex flex-col overflow-hidden p-3">
      <LineChart
        xAxis={[{ data: xAxisData, scaleType: "point" }]}
        series={series}
        height={280}
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        slotProps={{
          legend: { hidden: lineData.datasets.length <= 1 },
        }}
        sx={{
          ".MuiLineElement-root": { strokeWidth: 2 },
          ".MuiMarkElement-root": { scale: "0.6" },
        }}
      />
    </div>
  );
};

export default LineChartComp;
