import { useDashboardContext } from "@/contexts/dashboard-context";
import { createNewEmptyBlock } from "@/server/components/block-functions";
import { SetDashboardName } from "@/server/components/dashboard-commands";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useTransition,
} from "react";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GoSidebarExpand } from "react-icons/go";
import { LuLayoutDashboard } from "react-icons/lu";
import { RotatingLines } from "react-loader-spinner";
import { toast } from "sonner";

const DashboardTopbar = ({
  setSidebarHover,
  handleSidebar,
  sidebarOpen,
}: {
  setSidebarHover: Dispatch<SetStateAction<boolean>>;
  handleSidebar: () => void;
  sidebarOpen: boolean;
}) => {
  const { dashboardData, handleDashboardData } = useDashboardContext();
  const [isPendingBlock, startTransitionBlock] = useTransition();
  const [editBlockname, setEditBlockname] = useState(false);
  const [newblockName, setNewBlockName] = useState(dashboardData.name);

  useEffect(() => {
    if (dashboardData.name) {
      setNewBlockName(dashboardData.name);
    }
  }, [dashboardData.name]);

  const handleEmptyBlock = () => {
    startTransitionBlock(async () => {
      try {
        const dashboardId = dashboardData.id;
        await createNewEmptyBlock(dashboardId);
        handleDashboardData(dashboardId);
        toast.success("Block added successfully");
      } catch (error) {
        toast.error("Failed to add block");
        console.error(error);
      }
    });
  };

  const handleRenameDashboard = async () => {
    if (newblockName.trim() && newblockName !== dashboardData.name) {
      try {
        const dashboardId = dashboardData.id;
        await SetDashboardName(dashboardId, newblockName.trim());
        handleDashboardData(dashboardId);
        toast.success("Dashboard renamed successfully");
      } catch (error) {
        toast.error("Failed to rename dashboard");
        console.error(error);
      }
    }
    setEditBlockname(false);
  };

  return (
    <div className="flex justify-between items-center h-full px-2">
      <div className="flex items-center text-gray-600">
        {!sidebarOpen && (
          <div
            className="h-14 aspect-square grid place-items-center cursor-pointer"
            onClick={handleSidebar}
            onMouseEnter={() => setSidebarHover(true)}
            onMouseLeave={() => setSidebarHover(false)}
          >
            <GoSidebarExpand />
          </div>
        )}
        <div className="flex items-center gap-3">
          <div>
            <LuLayoutDashboard />
          </div>

          {editBlockname ? (
            <div>
              <input
                type="text"
                className="bg-transparent border border-gray-400 text-black px-1"
                value={newblockName}
                autoFocus={editBlockname}
                onChange={(e) => setNewBlockName(e.target.value)}
                onBlur={handleRenameDashboard} 
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleRenameDashboard(); 
                  }
                }}
              />
            </div>
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => setEditBlockname(!editBlockname)}
            >
              {dashboardData.name}
            </div>
          )}
        </div>
      </div>
      <div className="text-gray-600 hover:text-gray-800 transition-colors duration-300 flex gap-4 items-center">
        <button
          className="flex items-center border border-gray-300 rounded-md px-2 py-1 gap-1"
          onClick={handleEmptyBlock}
        >
          {isPendingBlock ? (
            <RotatingLines width="15" strokeColor="black" />
          ) : (
            <>
              <AiOutlineAppstoreAdd /> Add block
            </>
          )}
        </button>
        <div className="hover:bg-gray-300 p-1 rounded-sm">
          <BsThreeDotsVertical />
        </div>
      </div>
    </div>
  );
};

export default DashboardTopbar;
