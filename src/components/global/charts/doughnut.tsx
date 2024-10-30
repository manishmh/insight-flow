import { PieDataType } from "@/components/dashboard/main-content/main-content";
import React, { useEffect, useState } from "react";

const PieChart = ({
  data,
  circleColor,
}: {
  circleColor: string;
  data: PieDataType[];
}) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const [hoveredValue, setHoveredValue] = useState<number>(total);
  const [displayedValue, setDisplayedValue] = useState<number>(total);
  const [hoveredTitle, setHoveredTitle] = useState<string>("Total");

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (hoveredValue !== null) {
      interval = setInterval(() => {
        // difference between the displayed value and the hovered value so count annimation can begin from the current hover value not from 0, and round it for the floating point numbers.
        const difference = Math.round(hoveredValue - displayedValue);

        if (difference > 0) {
          setDisplayedValue(displayedValue + 1);
        } else if (difference < 0) {
          setDisplayedValue(displayedValue - 1);
        } else {
          clearInterval(interval);
        }
      }, 5);
    }

    return () => {
      clearInterval(interval);
    };
  }, [displayedValue, hoveredValue]);

  const createPieSlice = (value: number, index: number, total: number) => {
    const startAngle =
      (data.slice(0, index).reduce((acc, item) => acc + item.value, 0) /
        total) *
      360;
    const endAngle =
      (data.slice(0, index + 1).reduce((acc, item) => acc + item.value, 0) /
        total) *
      360;

    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

    const start = polarToCartesian(100, 100, 80, startAngle);
    const end = polarToCartesian(100, 100, 80, endAngle);

    const slicePathData = [
      `M ${start.x} ${start.y}`,
      `A 80 80 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
      "L 100 100",
      "Z",
    ].join(" ");

    const arcPathData = [
      `M ${start.x} ${start.y}`,
      `A 80 80 0 ${largeArcFlag} 1 ${end.x} ${end.y}`,
    ].join(" ");

    return (
      <React.Fragment key={`pie-slice-${index}`}>
        <path
          key={`arc-${index}`} // Ensure this key is unique
          d={arcPathData}
          fill="transparent"
          stroke={data[index].color}
          strokeWidth="2"
          className={`transition-all duration-300 opacity-50 ${
            hoveredValue === value && "scale-[106%]"
          }`}
          style={{
            transformOrigin: "100px 100px",
          }}
          onMouseEnter={() => {
            setHoveredValue(value);
            setHoveredTitle(data[index].title);
          }}
          onMouseLeave={() => {
            setHoveredValue(total);
            setHoveredTitle("Total");
          }}
        />

        <path
          key={`slice-${index}`} // Ensure this key is unique
          d={slicePathData}
          fill={data[index].color}
          fillOpacity={
            hoveredValue !== total && hoveredValue !== value ? 0.3 : 1
          }
          className="transition-all duration-300"
          style={{
            transformOrigin: "100px 100px",
            transform: `translate(${calculateTranslate(
              startAngle,
              endAngle + 20
            )}px)`,
          }}
          onMouseEnter={() => {
            setHoveredValue(value);
            setHoveredTitle(data[index].title);
          }}
          onMouseLeave={() => {
            setHoveredValue(total);
            setHoveredTitle("Total");
          }}
        />
      </React.Fragment>
    );
  };

  // Helper function to convert polar coordinates to cartesian
  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angle: number
  ) => {
    const radians = (angle - 90) * (Math.PI / 180.0);
    return {
      x: cx + r * Math.cos(radians),
      y: cy + r * Math.sin(radians),
    };
  };

  // Helper function to calculate the translation on hover
  const calculateTranslate = (startAngle: number, endAngle: number) => {
    const middleAngle = (startAngle + endAngle) / 2;
    const radians = (middleAngle - 90) * (Math.PI / 180);
    const translateDistance = 5; // Adjust this to control the translation distance
    return {
      x: translateDistance * Math.cos(radians),
      y: translateDistance * Math.sin(radians),
    };
  };

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full">
      {/* Generate pie slices */}
      {data.map((item, index) => createPieSlice(item.value, index, total))}

      {/* Add white circle to create doughnut effect */}
      <circle
        cx="100"
        cy="100"
        r="50"
        fill={circleColor === "" ? "white" : circleColor}
      />

      {/* Display the hovered title above the value */}
      <text
        x="100"
        y="85" // Position the title above the value
        textAnchor="middle"
        dominantBaseline="middle"
        className="transition-all duration-300 font-medium"
        fontSize="10"
        fill="#898989"
      >
        {hoveredTitle}
      </text>

      {/* Display the hovered value or the total if no slice is hovered */}
      <text
        x="100"
        y="100" // Keep the value in the center
        textAnchor="middle"
        dominantBaseline="middle"
        className="transition-all duration-300 font-bold "
      >
        {displayedValue.toFixed(2)}
      </text>
    </svg>
  );
};

export default PieChart;
