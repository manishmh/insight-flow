"use client";

export type singleValueItemType = { label: string; value: number | string };
export type singleValueDataType = { values: singleValueItemType[] };

const METRIC_COLORS = [
  { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", label: "text-blue-600" },
  { bg: "bg-cyan-50", border: "border-cyan-200", text: "text-cyan-700", label: "text-cyan-600" },
  { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", label: "text-purple-600" },
  { bg: "bg-pink-50", border: "border-pink-200", text: "text-pink-700", label: "text-pink-600" },
  { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", label: "text-orange-600" },
];

const SingleValueComp = ({ data }: { data: singleValueDataType }) => {
  const values = data.values ?? [];
  if (!values.length) return null;

  return (
    <div className="h-full w-full flex flex-wrap items-center justify-center gap-4 p-6">
      {values.map((item, i) => {
        const colors = METRIC_COLORS[i % METRIC_COLORS.length];
        return (
          <div
            key={item.label}
            className={`flex flex-col items-center justify-center rounded-xl border-2 ${colors.border} ${colors.bg} px-6 py-5 min-w-[120px] shadow-sm hover:shadow-md transition-shadow duration-200`}
          >
            <div className={`${colors.label} text-xs font-semibold uppercase tracking-wide mb-2`}>
              {item.label}
            </div>
            <div className={`${colors.text} text-2xl md:text-3xl font-bold tabular-nums`}>
              {typeof item.value === "number"
                ? Number.isInteger(item.value)
                  ? item.value.toLocaleString()
                  : item.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : item.value}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SingleValueComp;
