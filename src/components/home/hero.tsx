import Link from "next/link";
import { FaChevronRight } from "react-icons/fa6";
import LineChartComp from "./line-graph";
import DoughnutChart from "./pie-chart";
import Table from "./table";
import HomeBarChart from "./home-bar-chat";
import CardHeader from "./card-header";
import CustomerSpending from "./customer-spending";

const Hero = () => {
  return (
    <div className="pt-[100px] px-8">
      <div className="flex justify-center items-center text-xs">
        <Link href="/login">
            <div className="border shadow border-gray-400 flex items-center gap-1 group px-4 rounded-full py-1 text-gray-700 cursor-pointer">
                Insight Flow Beta <FaChevronRight className="text-xs group-hover:translate-x-1 transition-transform duration-300" />
            </div>
        </Link>
      </div>
      <h1 className="text-5xl lg:text-6xl text-center font-medium pt-4 text-[#38322f] leading-[50px]">
        Data to <span className="text-blue-700">insights</span>
        <br /> in minutes
      </h1>
      <h2 className="text-center max-w-md mx-auto text-sm pt-3 text-gray-500">Designed to transform raw data into actionable<br/> insights for faster decisions</h2>
      <div className="flex justify-center pt-4">
        <Link href="/login">
            <button className="bg-[#2f3f5d] text-white px-6 hover:bg-[#3a5077] py-1 rounded-lg transition-colors duration-300">Get Started</button>
        </Link>
      </div>
      <div className="relative border border-gray-300 mt-20 rounded-xl">
        <div className="absolute inset-0 z-10"></div>
        <CardHeader />
        <div className="grid grid-cols-3 gap-4 px-4 pt-4 relative">
          <div className="border border-gray-300 col-span-3 md:col-span-3 lg:col-span-1 rounded-md shadow py-2">
            <h1 className="text-gray-500 border-b border-gray-300 px-4 pb-2">User Signups</h1>
            <LineChartComp />
          </div>
          <CustomerSpending />
          <div className="border border-gray-300 col-span-3 md:col-span-2 lg:col-span-1 shadow px-4 pt-2 pb-10">
            <h1 className="text-gray-500">Revenue by city</h1>
            <div className="flex justify-center h-full items-center">
              <DoughnutChart />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-4 p-4">
          <Table />
          <HomeBarChart />
        </div>
      </div>
    </div>
  );
};

export default Hero;