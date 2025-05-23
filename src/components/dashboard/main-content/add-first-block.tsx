"use client";

import { RotatingLines } from "react-loader-spinner";
import { createNewEmptyBlock } from "@/server/components/block-functions";
import { useTransition } from "react";
import { FaPlus } from "react-icons/fa6";
import { PiDotsNineBold } from "react-icons/pi";
import { toast } from "sonner";
import { useDashboardContext } from "@/contexts/dashboard-context";

const AddFirstBlock = ({ dashboardId }: { dashboardId: string }) => {
  const [isPendingBlock, startTransitionBlock] = useTransition();
  const { handleDashboardData } = useDashboardContext();

  const handleEmptyBlock = () => {
    startTransitionBlock(async () => {
      try {
        const block = await createNewEmptyBlock(dashboardId);
        handleDashboardData(dashboardId);
        toast.success("Block added successfully");
      } catch (error) {
        toast.error("Failed to add block");
        console.error(error);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center select-none w-full h-full">
      <div className="w-36 flex flex-col gap-2 aspect-square border-gray-400">
        <div className="w-full h-1/2 flex gap-2">
          <div className="w-full h-full rounded-lg border-2 border-gray-300 bg-[#dae0e6] relative overflow-hidden shadow-lg">
            <div className="text-gray-400 text-3xl z-10 relative grid place-items-center h-full">
              <PiDotsNineBold />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#e1e8ee] to-[#c9d1d9] rounded-lg"></div>
            <div className="absolute top-0 left-0 w-full h2 bg-gradient-to-b from-transparent to-[#e1e8ee] rounded-t-lg"></div>
            <div className="absolute bottom-0 left-0 w-full h-4 bg-gradient-to-t from-[#dae0e6] to-transparent rounded-b-lg"></div>
          </div>
          <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-400"></div>
        </div>
        <div className="w-ful h-1/2 flex gap-2">
          <div className="w-2/3 h-full rounded-lg border-2 border-dashed border-gray-400"></div>
          <div className="w-1/3 h-full rounded-lg border-2 border-dashed border-gray-400"></div>
        </div>
      </div>
      <div className="font-semibold mt-8 text-gray-800">
        Add your first block
      </div>
      <div className="text-gray-500">
        Dashboards are visual display of your workspace data.
      </div>
      <button
        className="flex items-center border text-gray-500 hover:text-gray-800 transition-colors duration-300 border-gray-300 rounded-md px-3 py-1 gap-1 mt-4"
        onClick={handleEmptyBlock}
      >
        {isPendingBlock ? (
          <RotatingLines width="15" strokeColor="black" /> 
        ): (
          <>
            <FaPlus /> Add block
          </>
        )}
      </button>
    </div>
  );
};

export default AddFirstBlock;
