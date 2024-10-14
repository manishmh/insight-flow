import Startsvg from "@/components/ui/starsvg";
import { customers, queriesData } from "@/constants";
import { useState } from "react";
import { FaCode, FaPlay } from "react-icons/fa6";
import { IoReloadOutline } from "react-icons/io5";
import { SiGooglebigquery } from "react-icons/si";
import { VscPreview } from "react-icons/vsc";
import CustomerSpending from "../customer-spending";
import LineChartComp from "../line-graph";
import QueryData from "./query-data";
import RevenueByCity from "./revenue-by-city";
import { motion } from 'framer-motion'

  const rowAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.2, // Stagger the animation for each row
      },
    }),
  };

const QueryDataSql = () => {
  const [activeQuery, setActiveQuery] = useState(0);
  const [runCode, setRunCode] = useState(true);
  const [activeShowData, setActiveShowData] = useState(0);

  const handleLoadQuery = () => {
    if (activeQuery >= 0 && activeQuery < 3) {
      setActiveQuery(activeQuery + 1);
    } else {
      setActiveQuery(0);
    }

    setRunCode(!runCode);
  };

  const handleRunCode = () => {
    console.log("run code is running");
    if (activeShowData >= 0 && activeShowData < 3) {
      setActiveShowData(activeShowData + 1);
    } else {
      setActiveShowData(0);
    }

    setRunCode(!runCode);
  };

  return (
    <div className="px-4 bg-slate100 ">
      <div className="flex flex-col gap-6 items-center">
        <div className="flex items-center text-3xl xl:text-5xl font-medium text-gray-900 justify-center flex-col gap-2 sm:flex-row md:gap-0 ">
          Query your data <span className="h-1 w-8 bg-gray-900 mx-4"></span>{" "}
          your way
        </div>
        <div className="text-center text-gray-600 md:text-lg">
          Streamline your data analysis with our seamless SQL and visual editor.{" "}
          <br /> Give everyone in your team the superpowers they need.
        </div>
        <div className="bg-gray-100 text-gray-700 border-gray-300 border font-semibold px-4 py-1 rounded-md text-sm flex justify-center items-center gap-2">
          <SiGooglebigquery /> SQL
        </div>
      </div>
      <div className="w-full mt-4 max-w-4xl mx-auto md:h-[370px] bgslate-300 flex justify-center flex-col">
        {activeShowData === 0 && <QueryData customers={customers} />}
        {activeShowData === 1 && <RevenueByCity />}
        {activeShowData === 2 && <CustomerSpending />}
        {activeShowData === 3 && (
          <div className="border border-gray-300 col-span-3 md:col-span-3 lg:col-span-1 rounded-lg shadow py-2">
            <h1 className="text-gray-800 border-b px-4 border-gray-300 pb-2">User Signups</h1>
            <LineChartComp />
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <button
          className={`rounded-md  shadow-md  text-white font-semibold px-4 py-2 flex items-center gap-2 my-4 transition-all duration-300 
            ${
              !runCode
                ? "bg-gray-400 cursor-default"
                : "bg-[#242b3b] shadow-gray-700 hover:drop-shadow-lg hover:shadow-black cursor-pointer"
            }`}
          onClick={handleLoadQuery}
          disabled={!runCode}
        >
          <IoReloadOutline /> Load query
        </button>
      </div>
      <div className="py-2 border border-gray-300 rounded-lg max-w-4xl mx-auto shadow-md">
        <div className="mx-auto border-b border-gray-300 pb-2 px-4">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-500">
                <VscPreview /> Preview
              </div>
              <div className="flex items-center gap-2 text-blue-700 font-medium">
                <FaCode /> SQL
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-500">
                <Startsvg />
                Format
              </div>
              <button
                className={`flex items-center gap-2 rounded-md text-white px-4 py-1  transition-all duration-300 
                ${
                  runCode
                    ? "bg-blue-400"
                    : "bg-blue-700 hover:drop-shadow-lg shadow-sm shadow-blue-700 md:shadow-blue-800 cursor-pointer"
                }`}
                disabled={runCode}
                onClick={handleRunCode}
              >
                <FaPlay /> Run
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="px-2 py-4">
            <motion.div className="text-gray-800 h-[200px]" dangerouslySetInnerHTML={{ __html: queriesData[activeQuery]}}
              key={activeQuery} 
              initial="hidden"
                  animate="visible"
                  variants={rowAnimation}
            >
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryDataSql;
