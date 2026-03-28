"use client";

import { LineChart } from "@mui/x-charts/LineChart";

export type areaChartDataType = {
  labels: string[];
  datasets: { label: string; data: number[] }[];
};

const AreaChartComp = ({ areaData }: { areaData: areaChartDataType }) => {
  const dataLength = areaData.datasets[0]?.data?.length ?? 0;
  if (!dataLength) return null;

  const n = dataLength;
  const xAxisData =
    areaData.labels.length === n
      ? areaData.labels
      : areaData.labels.length >= n
        ? areaData.labels.slice(0, n)
        : [
            ...areaData.labels,
            ...Array.from({ length: n - areaData.labels.length }, (_, i) =>
              String(i + areaData.labels.length + 1)
            ),
          ];

  const series = areaData.datasets.map((ds, i) => ({
    data: ds.data,
    label: ds.label,
    color: ["#0ea5e9", "#06b6d4", "#8b5cf6", "#ec4899"][i % 4],
    area: true as const,
  }));

  return (
    <div className="h-full w-full flex flex-col overflow-hidden p-3">
      <LineChart
        xAxis={[{ data: xAxisData, scaleType: "point" }]}
        series={series}
        height={280}
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        slotProps={{ legend: { hidden: areaData.datasets.length <= 1 } }}
        sx={{
          ".MuiLineElement-root": { strokeWidth: 2 },
          ".MuiMarkElement-root": { scale: "0.6" },
        }}
      />
    </div>
  );
};

export default AreaChartComp;
