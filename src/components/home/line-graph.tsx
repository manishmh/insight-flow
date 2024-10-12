import { LineChart } from "@mui/x-charts/LineChart";

const LineChartComp = () => {
  return (
    <div className="max-w-[250px] ssm:max-w-[350px] md:max-w-none mx-auto overflow-hidden">
      <div className="flex items-center justify-center gap-3 pt-2">
        <div className="w-3 h-3 bg-blue-900 bg-opacity-70"></div>
        <h1 className="text-gray-600">Premium users</h1>
      </div>
      <LineChart
        className="w-full"
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        series={[
          {
            data: [2, 5.5, 2, 8.5, 1.5, 5],
            color: "#2f3f5d",
          },
        ]}
        width={500}
        height={250}
      />
    </div>
  );
};

export default LineChartComp;
