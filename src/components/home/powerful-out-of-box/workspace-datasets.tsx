import LoadingSpinner from "@/components/global/svg/loader";
import { useEffect, useState } from "react";
import { CiTimer } from "react-icons/ci";
import { FaCheck } from "react-icons/fa6";
import POBDetails from "./pob-details";

const WorkspaceDatasets = () => {
  const [translateData, setTranslateData] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (translateData >= 0 && translateData < 2) {
        setTranslateData(translateData + 1);
      } else {
        setTranslateData(0);
      }
    }, 3000);

    return () => clearTimeout(timer);
  });

  return (
    <div className="space-y-6 flex flex-col justify-between h-full max-w-2xl">
      <div className="h-[220px] overflow-hidden">
        <div
          className="h-[200px] font-mono space-y-16 px-2 transition-all duration-1000"
          style={{
            transform: `translateY(calc(-${translateData}00% - ${
              translateData * translateData - 0.5
            }rem))`,
          }}
        >
          <div className="bg-[#eaf2f8] rounded-lg p-4 shadow-md">
            <div className="font-semibold text-gray-700 pl-2">
              Query #912 <LoadingSpinner />
            </div>
            <div className="text-gray-500 pt-4 pl-2">3s ago</div>
            <div className="rounded-lg bg-gray-300 mt-3 py-2 px-4 ">
              Loading...
            </div>
          </div>
          <div className="bg-[#eaf2f8] rounded-lg p-2 shadow-md">
            <div className="font-semibold text-gray-700 pl-2 flex items-center gap-2">
              Query #911 <FaCheck className="text-green-600 text-lg" />
            </div>
            <div className="text-gray-500 pt-4 pl-2 flex items-center gap-4">
              3:16s
              <div className="w-1 rounded-full h-1 bg-gray-400"></div>
              80 words
              <div className="w-1 rounded-full h-1 bg-gray-400"></div>
              1d ago
            </div>
            <div className="rounded-lg bg-gray-300 mt-2 py-2 px-4 ">
              <div>
                <span className="text-orange-600">SELECT</span> city,
                SUM(order_value AS total)
              </div>
              <div>
                <span className="text-orange-600">FROM</span> orders
              </div>
              <div>
                <span className="text-orange-600">WHERE</span> order_date &gt;=
                &apos;2023-01-01&apos;
              </div>
              <div>
                <span className="text-orange-600 pl-8">AND</span> order_date
                &lt;= NOW()
              </div>
            </div>
          </div>
          <div className="bg-[#eaf2f8] rounded-lg p-2 shadow-md">
            <div className="font-semibold text-gray-700 pl-2 flex items-center gap-2">
              Query #910 <FaCheck className="text-green-600 text-lg" />
            </div>
            <div className="text-gray-500 pt-4 pl-2 flex items-center gap-4">
              1:24s
              <div className="w-1 rounded-full h-1 bg-gray-400"></div>
              92 words
              <div className="w-1 rounded-full h-1 bg-gray-400"></div>
              3d ago
            </div>
            <div className="rounded-lg bg-gray-300 mt-2 py-2 px-4 ">
              <div>
                <span className="text-orange-600">SELECT</span> user_plan,{" "}
                <span className="text-orange-600">COUNT</span>(*) AS user_count
              </div>
              <div>
                <span className="text-orange-600">FROM</span> user_table
              </div>
              <div>
                <span className="text-orange-600">WHERE</span> user_type
                &lt;&gt; &apos;anonymous&apos;
              </div>
              <div>
                <span className="text-orange-600 pl-8">AND</span> join_date
                &lt;= &apos;2023-01-01&apos;
              </div>
            </div>
          </div>
        </div>
      </div>
      <POBDetails
        logo={<CiTimer />}
        heading="Workspace datasets"
        desc="Build datasets that anyone in your team can use to ensure easy adoption and consistency."
      />
    </div>
  );
};

export default WorkspaceDatasets;
