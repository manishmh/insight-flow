import { MdOutlineDataset } from "react-icons/md";
import CustomerSpending from "../customer-spending";
import HomeBarChart from "../home-bar-chat";
import LineChartComp from "../line-graph";
import DoughnutChart from "../pie-chart";
import BasicScatter from "./scatter-chart";
import BasicSparkLine from "./sparkline";

const VisualizeData = () => {
  return (
    <div className="space-y-20 px-4">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 self-center border border-gray-300 px-2 py-1">
          <MdOutlineDataset className="" />
          Data in view
        </div>
        <h1 className="text-3xl xl:text-5xl text-center font-medium text-gray-900">
          Visualize data
          <br /> with powerfull charts
        </h1>
        <h2 className="text-center mx-auto pt-3 text-gray-500">
          Visualize your data in a variety of ways thanks to a robust set of
          visualizations.
          <br /> Whether it&apso;s as a table, a chart, or a single value —
          you&apos;re in control.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="col-span-1 border border-gray-300 rounded-md shadow py-2">
          <h1 className="text-gray-500 border-b border-gray-300 px-4 pb-2">
            User Signups
          </h1>
          <LineChartComp />
        </div>
        <div className="h-full col-span-1">
          <HomeBarChart />
        </div>
        <div className="col-span-1 border border-gray-300 shadow px-4 pt-2 pb-10">
          <h1 className="text-gray-500">Revenue by city</h1>
          <div className="flex justify-center h-full items-center">
            <DoughnutChart />
          </div>
        </div>
        <div className="col-span-1 border border-gray-300 rounded-md shadow">
          <BasicScatter />
        </div>
        <div className="col-span-1 border border-gray-300 rounded-md shadow  flex flex-col h-[370px]">
          <div className="flex items-center gap-4 px-4 py-4">
            <span className="w-3 h-3 bg-cyan-500"></span>
            <span>Premium users</span>
          </div>
          <div className="flex-1 flex">
            <BasicSparkLine />
          </div>
        </div>
        <div className="col-span-1 h-[370px]">
          <CustomerSpending />
        </div>
      </div>
    </div>
  );
};

export default VisualizeData;
