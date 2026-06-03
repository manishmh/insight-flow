"use client";

import { LineChart } from "@mui/x-charts/LineChart";
import { memo, useEffect, useRef, useState } from "react";

export type lineChartDataType = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
};

const LineChartComp = ({ lineData }: { lineData: lineChartDataType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [reflowKey, setReflowKey] = useState(0);
  const dataLength = lineData.datasets[0]?.data?.length ?? 0;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => setWidth(Math.max(280, el.clientWidth - 24));
    const ro = new ResizeObserver(updateWidth);
    ro.observe(el);
    updateWidth();

    return () => ro.disconnect();
  }, []);

  // Force one remount after layout settles: MUI x-charts otherwise renders an
  // empty plot when it mounts before the flex container has its final size
  // (the chart only appeared after a manual resize).
  useEffect(() => {
    const raf = requestAnimationFrame(() => setReflowKey((v) => v + 1));
    const t = setTimeout(() => setReflowKey((v) => v + 1), 120);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [dataLength]);

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
    <div ref={containerRef} className="h-full w-full flex flex-col overflow-hidden p-3">
      {width > 0 && (
        <LineChart
          key={`${width}-${reflowKey}`}
          xAxis={[{ data: xAxisData, scaleType: "point" }]}
          series={series}
          height={280}
          width={width}
          margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
          slotProps={{
            legend: { hidden: lineData.datasets.length <= 1 },
          }}
          sx={{
            ".MuiLineElement-root": { strokeWidth: 2 },
            ".MuiMarkElement-root": { scale: "0.6" },
          }}
        />
      )}
    </div>
  );
};

export default memo(LineChartComp);
