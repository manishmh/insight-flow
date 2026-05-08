"use client";

import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { useEffect, useRef, useState } from "react";

export type scatterChartDataType = {
  series: { data: { x: number; y: number; id: string | number }[]; label?: string }[];
};

const ScatterChartComp = ({ scatterData }: { scatterData: scatterChartDataType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const data = scatterData.series[0]?.data ?? [];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => setWidth(Math.max(280, el.clientWidth - 24));
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    updateWidth();

    return () => ro.disconnect();
  }, []);

  if (!data.length) return null;

  const series = scatterData.series.map((s, i) => ({
    data: s.data,
    label: s.label ?? `Series ${i + 1}`,
    color: ["#0ea5e9", "#06b6d4", "#8b5cf6", "#ec4899"][i % 4],
  }));

  return (
    <div ref={containerRef} className="h-full w-full flex flex-col overflow-hidden p-3">
      {width > 0 && (
        <ScatterChart
          series={series}
          height={280}
          width={width}
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
          slotProps={{ legend: { hidden: scatterData.series.length <= 1 } }}
        />
      )}
    </div>
  );
};

export default ScatterChartComp;
