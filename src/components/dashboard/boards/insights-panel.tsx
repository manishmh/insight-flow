import { useMemo } from "react";
import { LuX } from "react-icons/lu";
import type { BoardDataType } from "@/store/slices/boardSlice";
import { computeInsights, formatNumber } from "@/utils/insights";

const InsightsPanel = ({
  data,
  onClose,
}: {
  data: BoardDataType;
  onClose: () => void;
}) => {
  const insights = useMemo(() => computeInsights(data), [data]);

  return (
    <div className="absolute inset-0 z-20 bg-white/97 backdrop-blur-sm flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
          Auto insights
          <span className="text-[11px] font-normal text-gray-500">
            {insights.totalRows.toLocaleString()} rows
            {insights.scannedRows < insights.totalRows
              ? ` · sampled ${insights.scannedRows.toLocaleString()}`
              : ""}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-200 text-gray-500"
          aria-label="Close insights"
        >
          <LuX />
        </button>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-4">
        {insights.numericColumns.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-8">
            No numeric columns to analyze in this dataset.
          </div>
        ) : (
          insights.numericColumns.map((col) => (
            <div
              key={col.column}
              className="border border-gray-200 rounded-lg p-3 shadow-sm"
            >
              <div className="font-medium text-gray-800 text-sm mb-2 truncate">
                {col.column}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                {[
                  ["Sum", col.sum],
                  ["Average", col.avg],
                  ["Min", col.min],
                  ["Max", col.max],
                  ["Std dev", col.stdDev],
                  ["Count", col.count],
                ].map(([label, value]) => (
                  <div key={label as string} className="bg-gray-50 rounded px-2 py-1.5">
                    <div className="text-gray-400 uppercase tracking-wide">{label}</div>
                    <div className="font-semibold text-gray-700">
                      {formatNumber(value as number)}
                    </div>
                  </div>
                ))}
              </div>
              {col.anomalies.length > 0 && (
                <div className="mt-2 text-[11px]">
                  <span className="text-amber-600 font-semibold">
                    {col.anomalies.length} outlier{col.anomalies.length > 1 ? "s" : ""}
                  </span>
                  <span className="text-gray-500">
                    {" "}
                    (beyond 2σ):{" "}
                    {col.anomalies
                      .slice(0, 5)
                      .map((a) => formatNumber(a.value))
                      .join(", ")}
                    {col.anomalies.length > 5 ? "…" : ""}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
