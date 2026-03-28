"use client";

import { PieChart } from "@mui/x-charts/PieChart";
import { useRef, useState, useEffect } from "react";

export type pieChartDataType = {
  items: { id: string | number; value: number; label: string }[];
};

const PIE_COLORS = ["#0ea5e9", "#06b6d4", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

const PieChartComp = ({ pieData }: { pieData: pieChartDataType }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(320);
  const items = pieData.items ?? [];

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateSize = () => {
      if (!el) return;
      const w = el.clientWidth;
      const h = el.clientHeight;
      setSize(Math.min(w - 40, h - 40, 400));
    };
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    updateSize();
    return () => ro.disconnect();
  }, []);

  if (!items.length) return null;

  const data = items.map((item, i) => ({
    id: item.id,
    value: item.value,
    label: item.label || String(item.id),
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const radius = Math.max(100, Math.floor(size / 2) - 20);
  const innerRadius = Math.max(30, Math.floor(radius * 0.35));

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div ref={containerRef} className="flex-1 min-h-[280px] w-full flex items-center justify-center overflow-hidden p-4">
        <PieChart
          series={[
            {
              data,
              innerRadius,
              outerRadius: radius,
            },
          ]}
          height={size}
          width={size}
          slotProps={{
            legend: {
              hidden: true,
            },
          }}
          margin={{ top: 10, bottom: 10, left: 10, right: 10 }}
        />
      </div>
      <div className="border-t border-gray-200 bg-gray-50/50 px-4 py-2">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {data.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white border border-gray-200 shadow-sm"
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-gray-700">{item.label}</span>
              <span className="text-sm font-bold text-gray-900">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PieChartComp;
