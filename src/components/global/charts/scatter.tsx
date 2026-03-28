"use client";

import { ScatterChart } from "@mui/x-charts/ScatterChart";

export type scatterChartDataType = {
  series: { data: { x: number; y: number; id: string | number }[]; label?: string }[];
};

const ScatterChartComp = ({ scatterData }: { scatterData: scatterChartDataType }) => {
  const data = scatterData.series[0]?.data ?? [];
  if (!data.length) return null;

  const series = scatterData.series.map((s, i) => ({
    data: s.data,
    label: s.label ?? `Series ${i + 1}`,
    color: ["#0ea5e9", "#06b6d4", "#8b5cf6", "#ec4899"][i % 4],
  }));

  return (
    <div className="h-full w-full flex flex-col overflow-hidden p-3">
      <ScatterChart
        series={series}
        height={280}
        margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
        slotProps={{ legend: { hidden: scatterData.series.length <= 1 } }}
      />
    </div>
  );
};

export default ScatterChartComp;
